> **이 문서는:**

- AI 서비스 플랫폼의 PostgreSQL 테이블/스키마 설계 명세서입니다.
- 실제 SQL 정의는 [`database-schema.sql`](./database-schema.sql) 참고
- 보안 정책 및 RLS는 [Supabase Security Guide](../guides/supabase-security-guide.md) 참고
- 전체 시스템 구조는 [디렉토리 아키텍처](../architecture/directory-architecture.md), [AI 서비스 아키텍처](../architecture/ai-service-architecture.md) 참고
- 개발 워크플로우 및 Task Master 활용법은 [Dev Workflow Guide](../guides/dev-workflow-guide.md), [Task Master Reference](../guides/taskmaster-guide.md) 참고

# 테이블 설계서

## 개요

AI 서비스 플랫폼을 위한 PostgreSQL 데이터베이스 스키마 설계서입니다. Supabase를 기반으로 하며, RAG(Retrieval-Augmented Generation), 프롬프트 캐싱, 사용자 관리 등의 기능을 지원합니다.

---

## 1. user_profiles (사용자 프로필)

### 목적

`auth.users` 테이블을 확장하여 애플리케이션별 사용자 정보를 관리합니다.

### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|-------|------|----------|------|
| `id` | UUID | PRIMARY KEY, REFERENCES auth.users(id) | 사용자 고유 식별자 (Supabase auth와 연동) |
| `email` | TEXT | | 사용자 이메일 주소 |
| `full_name` | TEXT | | 사용자 전체 이름 |
| `avatar_url` | TEXT | | 프로필 이미지 URL |
| `subscription_tier` | TEXT | DEFAULT 'free' | 구독 등급 (free, pro, enterprise) |
| `api_usage_count` | INTEGER | DEFAULT 0 | 현재 API 사용 횟수 |
| `api_usage_limit` | INTEGER | DEFAULT 1000 | API 사용 제한 |
| `preferences` | JSONB | DEFAULT '{}' | 사용자 설정 (JSON 형태) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성 시간 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정 시간 |

### 특징

- Supabase Auth와 1:1 관계
- 새 사용자 등록 시 자동으로 프로필 생성 (트리거)
- API 사용량 추적 및 제한 기능

---

## 2. conversations (대화 세션)

### 목적

사용자와 AI 간의 대화 세션을 관리합니다. 각 대화는 독립적인 컨텍스트를 가집니다.

### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|-------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 대화 세션 고유 식별자 |
| `user_id` | UUID | REFERENCES auth.users(id) ON DELETE CASCADE | 대화 소유자 |
| `title` | TEXT | NOT NULL, DEFAULT 'New Conversation' | 대화 제목 |
| `model_name` | TEXT | DEFAULT 'gpt-4' | 사용된 AI 모델명 |
| `system_prompt` | TEXT | | 시스템 프롬프트 (AI 역할 설정) |
| `temperature` | DECIMAL(3,2) | DEFAULT 0.7 | 응답 창의성 조절 (0.0~1.0) |
| `max_tokens` | INTEGER | DEFAULT 4096 | 최대 토큰 수 |
| `is_archived` | BOOLEAN | DEFAULT FALSE | 아카이브 여부 |
| `metadata` | JSONB | DEFAULT '{}' | 추가 메타데이터 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성 시간 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정 시간 |

### 특징

- 사용자별 대화 세션 관리
- AI 모델 설정 및 파라미터 저장
- 대화별 시스템 프롬프트 커스터마이징 가능

---

## 3. messages (메시지)

### 목적

대화 세션 내의 개별 메시지를 저장합니다. 사용자 질문과 AI 응답을 모두 포함합니다.

### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|-------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 메시지 고유 식별자 |
| `conversation_id` | UUID | REFERENCES conversations(id) ON DELETE CASCADE | 소속 대화 세션 |
| `role` | TEXT | CHECK (role IN ('user', 'assistant', 'system')) | 메시지 역할 |
| `content` | TEXT | NOT NULL | 메시지 내용 |
| `token_count` | INTEGER | | 토큰 사용량 |
| `model_name` | TEXT | | 응답 생성에 사용된 모델명 |
| `finish_reason` | TEXT | | 응답 완료 이유 (stop, length, etc.) |
| `metadata` | JSONB | DEFAULT '{}' | 추가 메타데이터 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성 시간 |

### 특징

- 대화 흐름 순서대로 메시지 저장
- 토큰 사용량 추적으로 비용 계산 지원
- 시스템, 사용자, AI 응답 구분

---

## 4. documents (문서)

### 목적

사용자가 업로드한 문서를 관리합니다. RAG 시스템의 지식 베이스 역할을 합니다.

### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|-------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 문서 고유 식별자 |
| `user_id` | UUID | REFERENCES auth.users(id) ON DELETE CASCADE | 문서 소유자 |
| `filename` | TEXT | NOT NULL | 저장된 파일명 |
| `original_filename` | TEXT | NOT NULL | 원본 파일명 |
| `file_url` | TEXT | NOT NULL | 파일 저장 URL |
| `file_size` | INTEGER | | 파일 크기 (bytes) |
| `content_type` | TEXT | | MIME 타입 |
| `content_text` | TEXT | | 추출된 텍스트 내용 |
| `chunk_count` | INTEGER | DEFAULT 0 | 생성된 청크 수 |
| `processing_status` | TEXT | CHECK (status IN ('pending', 'processing', 'completed', 'failed')) | 텍스트 추출 상태 |
| `embedding_status` | TEXT | CHECK (status IN ('pending', 'processing', 'completed', 'failed')) | 임베딩 생성 상태 |
| `error_message` | TEXT | | 처리 중 오류 메시지 |
| `metadata` | JSONB | DEFAULT '{}' | 추가 메타데이터 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성 시간 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정 시간 |

### 특징

- 파일 업로드부터 임베딩 생성까지 상태 추적
- 다양한 파일 형식 지원 (PDF, Word, 텍스트 등)
- 비동기 처리를 위한 상태 관리

---

## 5. document_chunks (문서 청크)

### 목적

RAG 시스템을 위해 문서를 작은 단위로 분할한 청크를 저장합니다. 벡터 검색의 기본 단위입니다.

### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|-------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 청크 고유 식별자 |
| `document_id` | UUID | REFERENCES documents(id) ON DELETE CASCADE | 소속 문서 |
| `chunk_index` | INTEGER | NOT NULL | 문서 내 청크 순서 |
| `content` | TEXT | NOT NULL | 청크 텍스트 내용 |
| `token_count` | INTEGER | | 청크의 토큰 수 |
| `embedding` | vector(1536) | | 임베딩 벡터 (OpenAI text-embedding-3-small) |
| `metadata` | JSONB | DEFAULT '{}' | 청크 메타데이터 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성 시간 |

### 특징

- 1536차원 벡터 임베딩 저장
- ivfflat 인덱스로 고속 벡터 검색 지원
- 청크별 토큰 수 추적

---

## 6. document_conversation_links (문서-대화 연결)

### 목적

문서와 대화 세션 간의 N:N 관계를 관리합니다. 특정 대화에서 참조하는 문서를 추적합니다.

### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|-------|------|----------|------|
| `document_id` | UUID | REFERENCES documents(id) ON DELETE CASCADE | 연결된 문서 |
| `conversation_id` | UUID | REFERENCES conversations(id) ON DELETE CASCADE | 연결된 대화 |
| `linked_at` | TIMESTAMPTZ | DEFAULT NOW() | 연결 시간 |

### 특징

- 복합 기본키 (document_id, conversation_id)
- 대화별 컨텍스트 문서 관리
- RAG 시스템의 문서 범위 제한 기능

---

## 7. prompt_templates (프롬프트 템플릿)

### 목적

재사용 가능한 프롬프트 템플릿을 관리합니다. 변수 치환을 통해 동적 프롬프트 생성을 지원합니다.

### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|-------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 템플릿 고유 식별자 |
| `user_id` | UUID | REFERENCES auth.users(id) ON DELETE CASCADE | 템플릿 소유자 |
| `name` | TEXT | NOT NULL | 템플릿 이름 |
| `description` | TEXT | | 템플릿 설명 |
| `template` | TEXT | NOT NULL | 프롬프트 템플릿 내용 |
| `variables` | JSONB | DEFAULT '[]' | 템플릿 변수 정의 |
| `category` | TEXT | DEFAULT 'general' | 템플릿 카테고리 |
| `is_public` | BOOLEAN | DEFAULT FALSE | 공개 템플릿 여부 |
| `usage_count` | INTEGER | DEFAULT 0 | 사용 횟수 |
| `tags` | TEXT[] | DEFAULT '{}' | 태그 목록 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성 시간 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정 시간 |

### 특징

- 변수 치환을 통한 동적 프롬프트 생성
- 공개/비공개 템플릿 관리
- 카테고리 및 태그로 분류

---

## 8. api_usage_logs (API 사용량 로그)

### 목적

API 호출 내역을 추적하여 사용량 분석 및 비용 계산을 지원합니다.

### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|-------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 로그 고유 식별자 |
| `user_id` | UUID | REFERENCES auth.users(id) ON DELETE CASCADE | 사용자 |
| `conversation_id` | UUID | REFERENCES conversations(id) ON DELETE SET NULL | 관련 대화 (선택사항) |
| `endpoint` | TEXT | NOT NULL | API 엔드포인트 |
| `model_name` | TEXT | | 사용된 모델명 |
| `input_tokens` | INTEGER | DEFAULT 0 | 입력 토큰 수 |
| `output_tokens` | INTEGER | DEFAULT 0 | 출력 토큰 수 |
| `total_tokens` | INTEGER | DEFAULT 0 | 총 토큰 수 |
| `cost_usd` | DECIMAL(10,6) | DEFAULT 0 | 비용 (USD) |
| `response_time_ms` | INTEGER | | 응답 시간 (밀리초) |
| `status_code` | INTEGER | | HTTP 상태 코드 |
| `error_message` | TEXT | | 오류 메시지 |
| `metadata` | JSONB | DEFAULT '{}' | 추가 메타데이터 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성 시간 |

### 특징

- 토큰 사용량 및 비용 추적
- 성능 모니터링 (응답 시간)
- 오류 추적 및 디버깅 지원

---

## 9. prompt_cache (프롬프트 캐시)

### 목적

동일한 프롬프트에 대한 AI 응답을 캐싱하여 비용 절약과 성능 향상을 도모합니다.

### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|-------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 캐시 고유 식별자 |
| `cache_key` | TEXT | UNIQUE NOT NULL | 캐시 키 |
| `prompt_hash` | TEXT | NOT NULL | 프롬프트 해시값 |
| `response_content` | TEXT | NOT NULL | 캐시된 응답 내용 |
| `model_name` | TEXT | NOT NULL | 모델명 |
| `token_count` | INTEGER | | 토큰 수 |
| `hit_count` | INTEGER | DEFAULT 1 | 캐시 히트 횟수 |
| `expires_at` | TIMESTAMPTZ | NOT NULL | 만료 시간 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성 시간 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정 시간 |

### 특징

- 프롬프트 해시 기반 캐싱
- TTL(Time To Live) 기반 만료 관리
- 캐시 히트 횟수 추적

---

## 10. message_feedback (메시지 피드백)

### 목적

사용자가 AI 응답에 대해 제공하는 피드백을 수집하여 서비스 품질 개선에 활용합니다.

### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|-------|------|----------|------|
| `id` | UUID | PRIMARY KEY | 피드백 고유 식별자 |
| `message_id` | UUID | REFERENCES messages(id) ON DELETE CASCADE | 피드백 대상 메시지 |
| `user_id` | UUID | REFERENCES auth.users(id) ON DELETE CASCADE | 피드백 제공자 |
| `rating` | INTEGER | CHECK (rating >= 1 AND rating <= 5) | 평점 (1-5) |
| `feedback_type` | TEXT | CHECK (type IN ('helpful', 'not_helpful', 'inappropriate', 'inaccurate')) | 피드백 유형 |
| `comment` | TEXT | | 추가 코멘트 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성 시간 |

### 특징

- 평점 및 유형별 피드백 수집
- 품질 개선을 위한 데이터 분석 지원
- 사용자별 피드백 이력 관리

---

## 보안 및 접근 제어

### RLS (Row Level Security)

모든 테이블에 Row Level Security가 활성화되어 있으며, 사용자는 본인의 데이터에만 접근할 수 있습니다.

### 정책 요약

- **사용자 데이터 격리**: 각 사용자는 본인의 데이터만 조회/수정/삭제 가능
- **공개 템플릿**: `is_public=true`인 프롬프트 템플릿은 모든 사용자가 조회 가능
- **서비스 레벨 접근**: API 사용량 로그는 서비스 레벨에서 삽입 가능

### 인덱스 최적화

- 자주 조회되는 컬럼에 인덱스 생성
- 벡터 검색을 위한 ivfflat 인덱스
- GIN 인덱스로 배열 및 JSONB 검색 최적화

---

## 유틸리티 함수

### 1. search_similar_chunks()

벡터 유사도 기반 문서 검색 함수입니다.

### 2. check_user_api_limit()

사용자의 API 사용량 제한 확인 함수입니다.

### 3. increment_api_usage()

사용자의 API 사용량을 증가시키는 함수입니다.

### 4. cleanup_expired_cache()

만료된 캐시를 정리하는 함수입니다.

---

## 확장 가능성

이 스키마는 다음과 같은 확장을 고려하여 설계되었습니다:

1. **멀티 테넌트 지원**: 조직/팀 단위 데이터 관리
2. **파일 버전 관리**: 문서 수정 이력 추적
3. **협업 기능**: 대화 공유 및 협업
4. **고급 분석**: 사용 패턴 및 성능 분석
5. **AI 모델 확장**: 새로운 AI 모델 지원

---

## Related Guides / Reference

- [database-schema.sql](./database-schema.sql) — 실제 SQL 스키마 정의
- [Supabase Security Guide](../guides/supabase-security-guide.md) — RLS/보안 정책
- [디렉토리 아키텍처](../architecture/directory-architecture.md)
- [AI 서비스 아키텍처](../architecture/ai-service-architecture.md)
- [Dev Workflow Guide](../guides/dev-workflow-guide.md)
- [Task Master Reference](../guides/taskmaster-guide.md)
