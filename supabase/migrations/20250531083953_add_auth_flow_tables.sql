-- =============================================================================
-- 인증 Flow 관련 테이블 추가
-- Magic Link 기반 통합 인증 시스템을 위한 테이블들
-- =============================================================================

-- Magic Link 토큰 관리 테이블
CREATE TABLE public.auth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token_hash TEXT UNIQUE NOT NULL,
  token_type TEXT NOT NULL CHECK (token_type IN ('magic_link', 'verification_code')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  user_agent TEXT,
  ip_address INET,
  browser_fingerprint TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification Code 테이블 (크로스 브라우저 인증용)
CREATE TABLE public.verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  magic_link_token_id UUID REFERENCES public.auth_tokens(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  attempts_count INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 브라우저 세션 추적 테이블 (크로스 브라우저 감지용)
CREATE TABLE public.auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  browser_fingerprint TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  is_active BOOLEAN DEFAULT TRUE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인증 시도 로그 테이블 (보안 모니터링용)
CREATE TABLE public.auth_attempt_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  attempt_type TEXT NOT NULL CHECK (attempt_type IN ('magic_link_request', 'magic_link_click', 'verification_code_request', 'verification_code_verify', 'cross_browser_detected')),
  success BOOLEAN NOT NULL,
  user_agent TEXT,
  ip_address INET,
  browser_fingerprint TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_auth_tokens_email ON public.auth_tokens(email);
CREATE INDEX idx_auth_tokens_token_hash ON public.auth_tokens(token_hash);
CREATE INDEX idx_auth_tokens_expires_at ON public.auth_tokens(expires_at);
CREATE INDEX idx_auth_tokens_token_type ON public.auth_tokens(token_type);
CREATE INDEX idx_auth_tokens_used_at ON public.auth_tokens(used_at);

CREATE INDEX idx_verification_codes_email ON public.verification_codes(email);
CREATE INDEX idx_verification_codes_code ON public.verification_codes(code);
CREATE INDEX idx_verification_codes_expires_at ON public.verification_codes(expires_at);
CREATE INDEX idx_verification_codes_magic_link_token_id ON public.verification_codes(magic_link_token_id);

CREATE INDEX idx_auth_sessions_user_id ON public.auth_sessions(user_id);
CREATE INDEX idx_auth_sessions_email ON public.auth_sessions(email);
CREATE INDEX idx_auth_sessions_session_token ON public.auth_sessions(session_token);
CREATE INDEX idx_auth_sessions_browser_fingerprint ON public.auth_sessions(browser_fingerprint);
CREATE INDEX idx_auth_sessions_is_active ON public.auth_sessions(is_active);
CREATE INDEX idx_auth_sessions_expires_at ON public.auth_sessions(expires_at);

CREATE INDEX idx_auth_attempt_logs_email ON public.auth_attempt_logs(email);
CREATE INDEX idx_auth_attempt_logs_attempt_type ON public.auth_attempt_logs(attempt_type);
CREATE INDEX idx_auth_attempt_logs_created_at ON public.auth_attempt_logs(created_at DESC);
CREATE INDEX idx_auth_attempt_logs_ip_address ON public.auth_attempt_logs(ip_address);

-- RLS (Row Level Security) 정책
ALTER TABLE public.auth_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service can manage auth tokens" ON public.auth_tokens
  FOR ALL USING (true);

ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service can manage verification codes" ON public.verification_codes
  FOR ALL USING (true);

ALTER TABLE public.auth_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions" ON public.auth_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can manage auth sessions" ON public.auth_sessions
  FOR ALL USING (true);

ALTER TABLE public.auth_attempt_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service can manage auth logs" ON public.auth_attempt_logs
  FOR ALL USING (true);

-- 유틸리티 함수들

-- 만료된 토큰 정리 함수
CREATE OR REPLACE FUNCTION public.cleanup_expired_auth_tokens()
RETURNS void AS $$
BEGIN
  -- 만료된 auth_tokens 삭제
  DELETE FROM public.auth_tokens
  WHERE expires_at < NOW();

  -- 만료된 verification_codes 삭제
  DELETE FROM public.verification_codes
  WHERE expires_at < NOW();

  -- 만료된 auth_sessions 삭제
  DELETE FROM public.auth_sessions
  WHERE expires_at < NOW();
END;
$$ language 'plpgsql';

-- 브라우저 fingerprint 생성 함수
CREATE OR REPLACE FUNCTION public.generate_browser_fingerprint(
  user_agent_param TEXT,
  ip_address_param INET
)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(
    digest(
      COALESCE(user_agent_param, '') || '|' || COALESCE(ip_address_param::TEXT, ''),
      'sha256'
    ),
    'hex'
  );
END;
$$ language 'plpgsql';

-- 크로스 브라우저 감지 함수
CREATE OR REPLACE FUNCTION public.detect_cross_browser_access(
  email_param TEXT,
  user_agent_param TEXT,
  ip_address_param INET
)
RETURNS BOOLEAN AS $$
DECLARE
  current_fingerprint TEXT;
  existing_session_count INTEGER;
BEGIN
  -- 현재 요청의 브라우저 fingerprint 생성
  current_fingerprint := public.generate_browser_fingerprint(user_agent_param, ip_address_param);

  -- 동일한 이메일로 활성화된 세션 중 다른 브라우저 fingerprint가 있는지 확인
  SELECT COUNT(*)
  INTO existing_session_count
  FROM public.auth_sessions
  WHERE email = email_param
    AND is_active = true
    AND expires_at > NOW()
    AND browser_fingerprint != current_fingerprint;

  -- 다른 브라우저에서 활성 세션이 있으면 크로스 브라우저로 판단
  RETURN existing_session_count > 0;
END;
$$ language 'plpgsql';

-- Magic Link 토큰 생성 함수
CREATE OR REPLACE FUNCTION public.create_magic_link_token(
  email_param TEXT,
  user_agent_param TEXT DEFAULT NULL,
  ip_address_param INET DEFAULT NULL,
  expires_minutes INTEGER DEFAULT 15
)
RETURNS TABLE (
  token_id UUID,
  token_hash TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  new_token_id UUID;
  new_token_hash TEXT;
  new_expires_at TIMESTAMP WITH TIME ZONE;
  fingerprint TEXT;
BEGIN
  -- 기존 미사용 토큰들 무효화
  UPDATE public.auth_tokens
  SET used_at = NOW()
  WHERE email = email_param
    AND token_type = 'magic_link'
    AND used_at IS NULL
    AND expires_at > NOW();

  -- 새 토큰 생성
  new_token_id := gen_random_uuid();
  new_token_hash := encode(gen_random_bytes(32), 'hex');
  new_expires_at := NOW() + (expires_minutes || ' minutes')::INTERVAL;
  fingerprint := public.generate_browser_fingerprint(user_agent_param, ip_address_param);

  -- 토큰 저장
  INSERT INTO public.auth_tokens (
    id, email, token_hash, token_type, expires_at,
    user_agent, ip_address, browser_fingerprint
  ) VALUES (
    new_token_id, email_param, new_token_hash, 'magic_link', new_expires_at,
    user_agent_param, ip_address_param, fingerprint
  );

  RETURN QUERY SELECT new_token_id, new_token_hash, new_expires_at;
END;
$$ language 'plpgsql';

-- Verification Code 생성 함수
CREATE OR REPLACE FUNCTION public.create_verification_code(
  email_param TEXT,
  magic_link_token_id_param UUID,
  expires_minutes INTEGER DEFAULT 5
)
RETURNS TABLE (
  code_id UUID,
  verification_code TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  new_code_id UUID;
  new_code TEXT;
  new_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 기존 미사용 코드들 무효화
  UPDATE public.verification_codes
  SET used_at = NOW()
  WHERE email = email_param
    AND used_at IS NULL
    AND expires_at > NOW();

  -- 6자리 숫자 코드 생성
  new_code_id := gen_random_uuid();
  new_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  new_expires_at := NOW() + (expires_minutes || ' minutes')::INTERVAL;

  -- 코드 저장
  INSERT INTO public.verification_codes (
    id, email, code, magic_link_token_id, expires_at
  ) VALUES (
    new_code_id, email_param, new_code, magic_link_token_id_param, new_expires_at
  );

  RETURN QUERY SELECT new_code_id, new_code, new_expires_at;
END;
$$ language 'plpgsql';

-- 인증 시도 로그 기록 함수
CREATE OR REPLACE FUNCTION public.log_auth_attempt(
  email_param TEXT,
  attempt_type_param TEXT,
  success_param BOOLEAN,
  user_agent_param TEXT DEFAULT NULL,
  ip_address_param INET DEFAULT NULL,
  error_message_param TEXT DEFAULT NULL,
  metadata_param JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
  fingerprint TEXT;
BEGIN
  log_id := gen_random_uuid();
  fingerprint := public.generate_browser_fingerprint(user_agent_param, ip_address_param);

  INSERT INTO public.auth_attempt_logs (
    id, email, attempt_type, success, user_agent, ip_address,
    browser_fingerprint, error_message, metadata
  ) VALUES (
    log_id, email_param, attempt_type_param, success_param,
    user_agent_param, ip_address_param, fingerprint, error_message_param, metadata_param
  );

  RETURN log_id;
END;
$$ language 'plpgsql';

-- 권한 설정
GRANT SELECT, INSERT, UPDATE, DELETE ON public.auth_tokens TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.verification_codes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.auth_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.auth_attempt_logs TO authenticated;

GRANT ALL ON public.auth_tokens TO service_role;
GRANT ALL ON public.verification_codes TO service_role;
GRANT ALL ON public.auth_sessions TO service_role;
GRANT ALL ON public.auth_attempt_logs TO service_role;

-- 정기적인 정리 작업을 위한 cron job (pg_cron 확장이 있는 경우)
-- SELECT cron.schedule('cleanup-expired-auth-tokens', '0 */6 * * *', 'SELECT public.cleanup_expired_auth_tokens();');
