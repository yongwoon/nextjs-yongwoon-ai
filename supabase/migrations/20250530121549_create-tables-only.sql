-- =============================================================================
-- AI 서비스 데이터베이스 스키마 (테이블 생성만)
-- Supabase PostgreSQL 스키마 정의
-- =============================================================================

-- 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 사용자 프로필 테이블 (auth.users 확장)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  api_usage_count INTEGER DEFAULT 0,
  api_usage_limit INTEGER DEFAULT 1000,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 대화 세션 테이블
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  model_name TEXT DEFAULT 'gpt-4',
  system_prompt TEXT,
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 4096,
  is_archived BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 메시지 테이블
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  token_count INTEGER,
  model_name TEXT,
  finish_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 문서 테이블
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  content_type TEXT,
  content_text TEXT,
  chunk_count INTEGER DEFAULT 0,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  embedding_status TEXT DEFAULT 'pending' CHECK (embedding_status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 문서 청크 테이블 (RAG용)
CREATE TABLE public.document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER,
  embedding vector(1536), -- OpenAI text-embedding-3-small 차원
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 문서-대화 연결 테이블 (N:N 관계)
CREATE TABLE public.document_conversation_links (
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (document_id, conversation_id)
);

-- 프롬프트 템플릿 테이블
CREATE TABLE public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  category TEXT DEFAULT 'general',
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API 사용량 로그 테이블
CREATE TABLE public.api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  model_name TEXT,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost_usd DECIMAL(10,6) DEFAULT 0,
  response_time_ms INTEGER,
  status_code INTEGER,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 캐시 테이블 (프롬프트 캐싱용)
CREATE TABLE public.prompt_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  prompt_hash TEXT NOT NULL,
  response_content TEXT NOT NULL,
  model_name TEXT NOT NULL,
  token_count INTEGER,
  hit_count INTEGER DEFAULT 1,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 피드백 테이블
CREATE TABLE public.message_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_type TEXT CHECK (feedback_type IN ('helpful', 'not_helpful', 'inappropriate', 'inaccurate')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_subscription_tier ON public.user_profiles(subscription_tier);
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_created_at ON public.conversations(created_at DESC);
CREATE INDEX idx_conversations_updated_at ON public.conversations(updated_at DESC);
CREATE INDEX idx_conversations_is_archived ON public.conversations(is_archived);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_role ON public.messages(role);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_processing_status ON public.documents(processing_status);
CREATE INDEX idx_documents_embedding_status ON public.documents(embedding_status);
CREATE INDEX idx_documents_created_at ON public.documents(created_at DESC);
CREATE INDEX idx_document_chunks_document_id ON public.document_chunks(document_id);
CREATE INDEX idx_document_chunks_embedding ON public.document_chunks USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_document_conversation_links_document_id ON public.document_conversation_links(document_id);
CREATE INDEX idx_document_conversation_links_conversation_id ON public.document_conversation_links(conversation_id);
CREATE INDEX idx_prompt_templates_user_id ON public.prompt_templates(user_id);
CREATE INDEX idx_prompt_templates_category ON public.prompt_templates(category);
CREATE INDEX idx_prompt_templates_is_public ON public.prompt_templates(is_public);
CREATE INDEX idx_prompt_templates_tags ON public.prompt_templates USING GIN(tags);
CREATE INDEX idx_api_usage_logs_user_id ON public.api_usage_logs(user_id);
CREATE INDEX idx_api_usage_logs_created_at ON public.api_usage_logs(created_at DESC);
CREATE INDEX idx_api_usage_logs_endpoint ON public.api_usage_logs(endpoint);
CREATE INDEX idx_prompt_cache_cache_key ON public.prompt_cache(cache_key);
CREATE INDEX idx_prompt_cache_expires_at ON public.prompt_cache(expires_at);
CREATE INDEX idx_prompt_cache_prompt_hash ON public.prompt_cache(prompt_hash);
CREATE INDEX idx_message_feedback_message_id ON public.message_feedback(message_id);
CREATE INDEX idx_message_feedback_user_id ON public.message_feedback(user_id);

-- RLS (Row Level Security) 정책
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.conversations
  FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages from own conversations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = messages.conversation_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert messages to own conversations" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = messages.conversation_id AND user_id = auth.uid()
    )
  );

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view chunks from own documents" ON public.document_chunks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = document_chunks.document_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert chunks to own documents" ON public.document_chunks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = document_chunks.document_id AND user_id = auth.uid()
    )
  );

ALTER TABLE public.document_conversation_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view links for their conversations or documents" ON public.document_conversation_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = document_conversation_links.conversation_id AND user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = document_conversation_links.document_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert links for their conversations and documents" ON public.document_conversation_links
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = document_conversation_links.conversation_id AND user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = document_conversation_links.document_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete links for their conversations and documents" ON public.document_conversation_links
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = document_conversation_links.conversation_id AND user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = document_conversation_links.document_id AND user_id = auth.uid()
    )
  );

ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own and public templates" ON public.prompt_templates
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert own templates" ON public.prompt_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own templates" ON public.prompt_templates
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own templates" ON public.prompt_templates
  FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own usage logs" ON public.api_usage_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can insert usage logs" ON public.api_usage_logs
  FOR INSERT WITH CHECK (true);

ALTER TABLE public.message_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own feedback" ON public.message_feedback
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own feedback" ON public.message_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own feedback" ON public.message_feedback
  FOR UPDATE USING (auth.uid() = user_id);

-- 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompt_templates_updated_at
  BEFORE UPDATE ON public.prompt_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompt_cache_updated_at
  BEFORE UPDATE ON public.prompt_cache
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 사용자 프로필 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- 새 사용자 등록 시 프로필 자동 생성 트리거
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 캐시 만료 정리 함수
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.prompt_cache WHERE expires_at < NOW();
END;
$$ language 'plpgsql';

-- 벡터 유사도 검색 함수
CREATE OR REPLACE FUNCTION public.search_similar_chunks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.8,
  match_count int DEFAULT 5,
  user_id_filter uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  content text,
  similarity float,
  metadata jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.content,
    1 - (dc.embedding <=> query_embedding) as similarity,
    dc.metadata
  FROM public.document_chunks dc
  JOIN public.documents d ON dc.document_id = d.id
  WHERE
    (user_id_filter IS NULL OR d.user_id = user_id_filter)
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ language 'plpgsql';

-- 사용자 API 사용량 확인 함수
CREATE OR REPLACE FUNCTION public.check_user_api_limit(user_id_param uuid)
RETURNS boolean AS $$
DECLARE
  current_usage integer;
  usage_limit integer;
BEGIN
  SELECT api_usage_count, api_usage_limit
  INTO current_usage, usage_limit
  FROM public.user_profiles
  WHERE id = user_id_param;

  RETURN current_usage < usage_limit;
END;
$$ language 'plpgsql';

-- API 사용량 증가 함수
CREATE OR REPLACE FUNCTION public.increment_api_usage(user_id_param uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.user_profiles
  SET api_usage_count = api_usage_count + 1
  WHERE id = user_id_param;
END;
$$ language 'plpgsql';

-- 기본 프롬프트 템플릿
INSERT INTO public.prompt_templates (name, description, template, category, is_public, variables) VALUES
('일반 어시스턴트', '일반적인 AI 어시스턴트 역할', '당신은 도움이 되는 AI 어시스턴트입니다. 사용자의 질문에 정확하고 유용한 답변을 제공해주세요.', 'general', true, '[]'),
('코딩 도우미', '프로그래밍 관련 질문 답변', '당신은 숙련된 프로그래머입니다. 코딩 문제를 해결하고 최적의 솔루션을 제공해주세요. 언어: {{language}}', 'coding', true, '[{"name": "language", "type": "string", "description": "프로그래밍 언어"}]'),
('번역가', '다국어 번역 서비스', '당신은 전문 번역가입니다. {{source_lang}}에서 {{target_lang}}로 정확하게 번역해주세요.', 'translation', true, '[{"name": "source_lang", "type": "string", "description": "원본 언어"}, {"name": "target_lang", "type": "string", "description": "번역할 언어"}]'),
('문서 요약', '긴 문서의 핵심 내용 요약', '다음 문서의 핵심 내용을 {{length}} 형태로 요약해주세요. 중요한 포인트를 놓치지 마세요.', 'analysis', true, '[{"name": "length", "type": "string", "description": "요약 길이 (짧게/보통/자세히)"}]');

-- 권한 설정
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.prompt_templates TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
