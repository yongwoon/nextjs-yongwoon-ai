-- =============================================================================
-- 롤백 스크립트 (Down Migration)
-- 데이터베이스 스키마 변경사항을 되돌리기 위한 스크립트
-- =============================================================================

-- WARNING: 이 스크립트는 모든 데이터를 삭제합니다!
-- 운영 환경에서는 신중하게 사용하세요.

-- 데이터 삭제 순서: 외래키 의존성을 고려하여 하위 테이블부터 삭제

-- 1. 피드백 데이터 삭제
DELETE FROM public.message_feedback;

-- 2. 캐시 데이터 삭제
DELETE FROM public.prompt_cache;

-- 3. API 사용량 로그 삭제
DELETE FROM public.api_usage_logs;

-- 4. 프롬프트 템플릿 삭제
DELETE FROM public.prompt_templates;

-- 5. 문서-대화 연결 삭제
DELETE FROM public.document_conversation_links;

-- 6. 문서 청크 삭제
DELETE FROM public.document_chunks;

-- 7. 문서 삭제
DELETE FROM public.documents;

-- 8. 메시지 삭제
DELETE FROM public.messages;

-- 9. 대화 삭제
DELETE FROM public.conversations;

-- 10. 사용자 프로필 삭제
DELETE FROM public.user_profiles;

-- 트리거 삭제
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
DROP TRIGGER IF EXISTS update_prompt_templates_updated_at ON public.prompt_templates;
DROP TRIGGER IF EXISTS update_prompt_cache_updated_at ON public.prompt_cache;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 함수 삭제
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.cleanup_expired_cache();
DROP FUNCTION IF EXISTS public.search_similar_chunks(vector, integer, uuid);
DROP FUNCTION IF EXISTS public.check_user_api_limit(uuid);
DROP FUNCTION IF EXISTS public.increment_api_usage(uuid);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- RLS 정책 삭제 (테이블 삭제 전에)
-- 피드백 테이블 정책
DROP POLICY IF EXISTS "Users can view own feedback" ON public.message_feedback;
DROP POLICY IF EXISTS "Users can insert own feedback" ON public.message_feedback;
DROP POLICY IF EXISTS "Users can update own feedback" ON public.message_feedback;

-- 캐시 테이블 정책 (있다면)
DROP POLICY IF EXISTS "Service role can manage cache" ON public.prompt_cache;

-- API 사용량 로그 정책
DROP POLICY IF EXISTS "Users can view own usage logs" ON public.api_usage_logs;
DROP POLICY IF EXISTS "Service role can insert usage logs" ON public.api_usage_logs;

-- 프롬프트 템플릿 정책
DROP POLICY IF EXISTS "Users can view own templates" ON public.prompt_templates;
DROP POLICY IF EXISTS "Users can view public templates" ON public.prompt_templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON public.prompt_templates;
DROP POLICY IF EXISTS "Users can update own templates" ON public.prompt_templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON public.prompt_templates;

-- 문서-대화 연결 정책
DROP POLICY IF EXISTS "Users can view own document links" ON public.document_conversation_links;
DROP POLICY IF EXISTS "Users can insert own document links" ON public.document_conversation_links;
DROP POLICY IF EXISTS "Users can delete own document links" ON public.document_conversation_links;

-- 문서 청크 정책
DROP POLICY IF EXISTS "Users can view chunks from own documents" ON public.document_chunks;
DROP POLICY IF EXISTS "Service role can manage chunks" ON public.document_chunks;

-- 문서 정책
DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;

-- 메시지 정책
DROP POLICY IF EXISTS "Users can view messages from own conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages to own conversations" ON public.messages;

-- 대화 정책
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON public.conversations;

-- 사용자 프로필 정책
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

-- 테이블 삭제 (외래키 의존성 순서로)
DROP TABLE IF EXISTS public.message_feedback CASCADE;
DROP TABLE IF EXISTS public.prompt_cache CASCADE;
DROP TABLE IF EXISTS public.api_usage_logs CASCADE;
DROP TABLE IF EXISTS public.prompt_templates CASCADE;
DROP TABLE IF EXISTS public.document_conversation_links CASCADE;
DROP TABLE IF EXISTS public.document_chunks CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- 확장 기능 제거 (필요한 경우)
-- 주의: 다른 애플리케이션에서 사용 중일 수 있으므로 주석 처리
-- DROP EXTENSION IF EXISTS "vector";
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '데이터베이스 스키마가 성공적으로 롤백되었습니다.';
  RAISE NOTICE '모든 테이블, 정책, 트리거, 함수가 삭제되었습니다.';
  RAISE WARNING '이 작업은 되돌릴 수 없습니다!';
END $$;