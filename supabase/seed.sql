-- =============================================================================
-- 시드 데이터 스크립트 (개발용)
-- 개발 환경에서 테스트를 위한 샘플 데이터를 생성
-- =============================================================================

-- 임시로 외래키 제약 조건을 비활성화
SET session_replication_role = replica;

-- 테스트 사용자 프로필 (auth.users 없이 테스트용 데이터만 생성)
-- 실제 운영에서는 사용자가 가입할 때 auth.users에서 자동으로 생성됨
INSERT INTO public.user_profiles (id, email, full_name, subscription_tier, preferences)
VALUES
  -- 테스트용 고정 UUID
  ('10000000-1000-4000-8000-100000000001', 'admin@example.com', 'Admin User', 'enterprise', '{"theme": "dark", "language": "ko"}'),
  ('10000000-1000-4000-8000-100000000002', 'pro@example.com', 'Pro User', 'pro', '{"theme": "light", "language": "en"}'),
  ('10000000-1000-4000-8000-100000000003', 'user@example.com', 'Free User', 'free', '{"theme": "light", "language": "ko"}')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  subscription_tier = EXCLUDED.subscription_tier,
  preferences = EXCLUDED.preferences;

-- 샘플 대화 데이터
INSERT INTO public.conversations (id, user_id, title, model_name, system_prompt, temperature)
VALUES
  ('20000000-2000-4000-8000-200000000001', '10000000-1000-4000-8000-100000000001', 'AI 개발 질문', 'gpt-4', 'You are a helpful AI assistant for software development.', 0.7),
  ('20000000-2000-4000-8000-200000000002', '10000000-1000-4000-8000-100000000002', '프로젝트 기획', 'claude-3-haiku', 'You are a project planning expert.', 0.5),
  ('20000000-2000-4000-8000-200000000003', '10000000-1000-4000-8000-100000000003', '일반 질문', 'gpt-3.5-turbo', 'You are a helpful assistant.', 0.8)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  model_name = EXCLUDED.model_name,
  system_prompt = EXCLUDED.system_prompt,
  temperature = EXCLUDED.temperature;

-- 샘플 메시지 데이터
INSERT INTO public.messages (id, conversation_id, role, content, model_name, token_count)
VALUES
  ('30000000-3000-4000-8000-300000000001', '20000000-2000-4000-8000-200000000001', 'user', 'Next.js 15에서 Server Actions 사용법을 알려주세요', null, 25),
  ('30000000-3000-4000-8000-300000000002', '20000000-2000-4000-8000-200000000001', 'assistant', 'Next.js 15의 Server Actions는 서버에서 직접 실행되는 함수들로, "use server" 지시어를 사용하여 정의할 수 있습니다. 클라이언트 컴포넌트에서 서버 로직을 직접 호출할 수 있게 해주는 강력한 기능입니다.', 'gpt-4', 150),
  ('30000000-3000-4000-8000-300000000003', '20000000-2000-4000-8000-200000000002', 'user', '웹 애플리케이션 아키텍처 설계 도움', null, 15),
  ('30000000-3000-4000-8000-300000000004', '20000000-2000-4000-8000-200000000002', 'assistant', '웹 애플리케이션 아키텍처 설계 시 고려해야 할 주요 사항들: 1) 확장성, 2) 보안, 3) 성능, 4) 유지보수성을 중심으로 마이크로서비스 아키텍처나 모놀리식 아키텍처 중 적절한 선택을 하는 것이 중요합니다.', 'claude-3-haiku', 200)
ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  model_name = EXCLUDED.model_name,
  token_count = EXCLUDED.token_count;

-- 샘플 문서 데이터
INSERT INTO public.documents (id, user_id, filename, original_filename, file_url, content_text, file_size, content_type, processing_status, embedding_status)
VALUES
  ('40000000-4000-4000-8000-400000000001', '10000000-1000-4000-8000-100000000001', 'react-19-guide.md', 'React 19 가이드.md', '/uploads/react-19-guide.md', 'React 19의 새로운 기능들에 대한 종합 가이드입니다. 주요 변경사항으로는 Server Components의 개선, 새로운 Hooks, 성능 최적화 등이 있습니다.', 15000, 'text/markdown', 'completed', 'completed'),
  ('40000000-4000-4000-8000-400000000002', '10000000-1000-4000-8000-100000000002', 'api-design.md', 'API 설계 문서.md', '/uploads/api-design.md', 'RESTful API 설계 원칙과 Best Practices에 대한 문서입니다. HTTP 메서드 사용법, 상태 코드, 인증 방식, 버전 관리 등을 다룹니다.', 8500, 'text/markdown', 'completed', 'completed')
ON CONFLICT (id) DO UPDATE SET
  filename = EXCLUDED.filename,
  original_filename = EXCLUDED.original_filename,
  content_text = EXCLUDED.content_text,
  processing_status = EXCLUDED.processing_status,
  embedding_status = EXCLUDED.embedding_status;

-- 샘플 문서 청크 데이터 (실제 벡터 임베딩은 제외)
INSERT INTO public.document_chunks (id, document_id, content, chunk_index, token_count)
VALUES
  ('50000000-5000-4000-8000-500000000001', '40000000-4000-4000-8000-400000000001', 'React 19 소개: React 19는 많은 새로운 기능과 개선사항을 포함하고 있습니다.', 0, 20),
  ('50000000-5000-4000-8000-500000000002', '40000000-4000-4000-8000-400000000001', 'Server Components 개선사항: 성능이 향상되고 사용법이 더욱 간단해졌습니다.', 1, 18),
  ('50000000-5000-4000-8000-500000000003', '40000000-4000-4000-8000-400000000002', 'API 엔드포인트 설계 원칙: RESTful API는 직관적이고 일관성 있는 구조를 가져야 합니다.', 0, 22)
ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  token_count = EXCLUDED.token_count;

-- 샘플 프롬프트 템플릿 데이터
INSERT INTO public.prompt_templates (id, user_id, name, description, template, category, variables, is_public)
VALUES
  ('60000000-6000-4000-8000-600000000001', '10000000-1000-4000-8000-100000000001', '코드 리뷰 요청', '코드 리뷰를 위한 템플릿', '다음 {language} 코드를 리뷰해주세요:\n\n{code}\n\n특히 {focus_area}에 집중해서 검토해주세요.', 'development', '["language", "code", "focus_area"]', true),
  ('60000000-6000-4000-8000-600000000002', '10000000-1000-4000-8000-100000000002', '기술 문서 작성', '기술 문서 작성을 위한 템플릿', '{topic}에 대한 기술 문서를 작성해주세요. 대상 독자는 {audience}이고, {detail_level} 수준으로 설명해주세요.', 'documentation', '["topic", "audience", "detail_level"]', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  template = EXCLUDED.template,
  variables = EXCLUDED.variables;

-- 샘플 API 사용량 로그
INSERT INTO public.api_usage_logs (id, user_id, endpoint, model_name, input_tokens, output_tokens, total_tokens, cost_usd, response_time_ms, status_code)
VALUES
  ('70000000-7000-4000-8000-700000000001', '10000000-1000-4000-8000-100000000001', '/api/chat', 'gpt-4', 100, 150, 250, 0.0045, 2500, 200),
  ('70000000-7000-4000-8000-700000000002', '10000000-1000-4000-8000-100000000002', '/api/analyze', 'claude-3-haiku', 200, 300, 500, 0.0075, 3200, 200),
  ('70000000-7000-4000-8000-700000000003', '10000000-1000-4000-8000-100000000003', '/api/summarize', 'gpt-3.5-turbo', 80, 120, 200, 0.0015, 1800, 200)
ON CONFLICT (id) DO UPDATE SET
  model_name = EXCLUDED.model_name,
  input_tokens = EXCLUDED.input_tokens,
  output_tokens = EXCLUDED.output_tokens,
  total_tokens = EXCLUDED.total_tokens,
  cost_usd = EXCLUDED.cost_usd;

-- 샘플 문서-대화 연결 데이터
INSERT INTO public.document_conversation_links (conversation_id, document_id)
VALUES
  ('20000000-2000-4000-8000-200000000001', '40000000-4000-4000-8000-400000000001'),
  ('20000000-2000-4000-8000-200000000002', '40000000-4000-4000-8000-400000000002')
ON CONFLICT (document_id, conversation_id) DO NOTHING;

-- 샘플 메시지 피드백 데이터
INSERT INTO public.message_feedback (id, message_id, user_id, feedback_type, rating, comment)
VALUES
  ('80000000-8000-4000-8000-800000000001', '30000000-3000-4000-8000-300000000002', '10000000-1000-4000-8000-100000000001', 'helpful', 5, '매우 유용한 답변이었습니다'),
  ('80000000-8000-4000-8000-800000000002', '30000000-3000-4000-8000-300000000004', '10000000-1000-4000-8000-100000000002', 'helpful', 4, '좋은 아키텍처 제안입니다')
ON CONFLICT (id) DO UPDATE SET
  feedback_type = EXCLUDED.feedback_type,
  rating = EXCLUDED.rating,
  comment = EXCLUDED.comment;

-- 샘플 프롬프트 캐시 데이터
INSERT INTO public.prompt_cache (cache_key, prompt_hash, response_content, model_name, token_count, expires_at)
VALUES
  ('cache-react-19-features', 'abc123def456', 'React 19의 주요 기능들에 대한 응답...', 'gpt-4', 250, NOW() + INTERVAL '1 day'),
  ('cache-api-design-best-practices', 'def456ghi789', 'API 설계 Best Practices에 대한 응답...', 'claude-3-haiku', 180, NOW() + INTERVAL '1 day')
ON CONFLICT (cache_key) DO UPDATE SET
  response_content = EXCLUDED.response_content,
  model_name = EXCLUDED.model_name,
  token_count = EXCLUDED.token_count;

-- 외래키 제약 조건 다시 활성화
SET session_replication_role = DEFAULT;

-- 시드 데이터 삽입 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '🌱 시드 데이터가 성공적으로 로드되었습니다!';
    RAISE NOTICE '👤 테스트 사용자 3명';
    RAISE NOTICE '💬 대화 3개 및 메시지 4개';
    RAISE NOTICE '📄 문서 2개 및 청크 3개';
    RAISE NOTICE '📝 프롬프트 템플릿 2개';
    RAISE NOTICE '📊 API 사용량 로그 3개';
    RAISE NOTICE '🔗 기타 연결 데이터';
END $$;