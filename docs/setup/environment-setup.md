# 환경 변수 설정 가이드

## 개요

AI 서비스 구축에 필요한 모든 환경 변수 설정 방법을 안내합니다. `.env.local` 파일을 생성하여 아래 변수들을 설정하세요.

## 🔧 필수 환경 변수

### 1. 기본 Next.js 설정
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. 데이터베이스 (Supabase)
```env
DATABASE_URL=your_supabase_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**설정 방법**:
1. [Supabase](https://supabase.com) 프로젝트 생성
2. Settings > API에서 URL과 키 복사
3. Settings > Database에서 Connection string 복사

### 3. AI 모델 API 키

#### OpenAI
```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_ORGANIZATION_ID=your_openai_org_id
```

**설정 방법**:
1. [OpenAI Platform](https://platform.openai.com) 계정 생성
2. API Keys에서 새 키 생성
3. Organization ID는 Settings에서 확인

#### Anthropic (Claude)
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
```

**설정 방법**:
1. [Anthropic Console](https://console.anthropic.com) 계정 생성
2. API Keys에서 새 키 생성

#### Google AI (Gemini)
```env
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

**설정 방법**:
1. [Google AI Studio](https://aistudio.google.com) 접속
2. API key 생성

## 🗄️ 벡터 데이터베이스 (RAG 시스템)

### Pinecone (프로덕션 권장)
```env
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_index_name
```

**설정 방법**:
1. [Pinecone](https://www.pinecone.io) 계정 생성
2. 새 인덱스 생성 (dimension: 1536, metric: cosine)
3. API Keys에서 키 복사

### Qdrant (로컬 개발용 대안)
```env
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key
```

**설정 방법**:
```bash
# Docker로 Qdrant 실행
docker run -p 6333:6333 qdrant/qdrant
```

## 🚀 캐싱 시스템 (Redis)

### 로컬 Redis
```env
REDIS_URL=redis://localhost:6379
```

**설정 방법**:
```bash
# Docker로 Redis 실행 (이미 compose.yml에 포함됨)
docker compose up redis
```

### Upstash Redis (프로덕션 권장)
```env
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

**설정 방법**:
1. [Upstash](https://upstash.com) 계정 생성
2. 새 Redis 데이터베이스 생성
3. REST API 정보 복사

## 📁 파일 저장소

### Vercel Blob (권장)
```env
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

**설정 방법**:
1. [Vercel](https://vercel.com) 프로젝트 생성
2. Storage > Blob에서 토큰 생성

### AWS S3 (대안)
```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name
```

## 🔐 인증 설정

### NextAuth.js
```env
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

**설정 방법**:
```bash
# 랜덤 시크릿 생성
openssl rand -base64 32
```

### OAuth 제공자 (선택사항)
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## ⚙️ AI 서비스 설정

### 기본 설정
```env
# 기본 AI 모델
DEFAULT_AI_MODEL=gpt-4
DEFAULT_EMBEDDING_MODEL=text-embedding-3-small

# 프롬프트 캐시 TTL (초)
PROMPT_CACHE_TTL=3600

# RAG 설정
RAG_CHUNK_SIZE=1000
RAG_CHUNK_OVERLAP=200
RAG_MAX_RESULTS=5

# streaming 설정
STREAMING_ENABLED=true
MAX_TOKENS=4096
TEMPERATURE=0.7
```

### 보안 설정
```env
# CORS 설정
CORS_ORIGIN=http://localhost:3000

# API 키 암호화
ENCRYPTION_KEY=your_32_character_encryption_key

# JWT 설정
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# API 요청 제한
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

## 📊 모니터링 및 분석 (선택사항)

### Sentry (에러 추적)
```env
SENTRY_DSN=your_sentry_dsn
```

### Vercel Analytics
```env
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

### PostHog (사용자 분석)
```env
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=your_posthog_host
```

## 🛠️ 개발 도구

### 디버그 설정
```env
DEBUG=false
LOG_LEVEL=info
```

## 📋 환경별 설정 예시

### 개발 환경 (.env.local)
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEBUG=true
LOG_LEVEL=debug
```

### 프로덕션 환경
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
DEBUG=false
LOG_LEVEL=error
```

## 🔍 환경 변수 검증

환경 변수가 올바르게 설정되었는지 확인하는 스크립트:

```bash
# 환경 변수 확인
pnpm run env:check
```

## 🚨 보안 주의사항

1. **API 키 보안**: 절대 Git에 커밋하지 마세요
2. **환경 분리**: 개발/스테이징/프로덕션 환경별로 다른 키 사용
3. **권한 최소화**: 필요한 최소 권한만 부여
4. **정기 교체**: API 키를 정기적으로 교체
5. **모니터링**: API 사용량과 비정상적인 접근 모니터링

## 📚 참고 자료

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)
- [OpenAI API Keys](https://platform.openai.com/docs/quickstart/account-setup)
- [Pinecone Quickstart](https://docs.pinecone.io/docs/quickstart)
- [Upstash Redis](https://docs.upstash.com/redis)

## 📚 관련 가이드/Reference
- [전체 아키텍처](../architecture/directory-architecture.md)
- [개발 워크플로우 가이드](../guides/dev-workflow-guide.md)
- [Task Master Reference](../guides/taskmaster-guide.md)
- [규칙 시스템 개요](../rules/overview.md)
- [table-design-specification.md](./table-design-specification.md) — DB 테이블 설계
- [supabase-setup.md](./supabase-setup.md) — Supabase 초기 세팅

이 가이드를 따라 환경 변수를 설정하면 AI 서비스를 위한 완전한 개발 환경을 구축할 수 있습니다.

# 프로젝트 환경 및 설정 가이드

## 1. 환경 변수 (.env.local 예시)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_database_url
# 기타 API 키, Redis, Blob 등
```

- 각 값은 Supabase 대시보드 > Settings > API/Database에서 확인
- Service Role Key는 서버 환경에서만 사용, 절대 노출 금지
- 환경 변수 파일(.env.local)은 절대 커밋하지 마세요

## 2. Supabase 프로젝트 생성 및 연결

1. https://app.supabase.com/ 에서 새 프로젝트 생성
2. Project URL, anon key, service role key, DB URL 복사
3. Connection Pooling 탭에서 Pooler URL 확인 후 DATABASE_URL에 사용

## 3. DB 마이그레이션 관리

### 기본 설정
- Supabase CLI 설치: `brew install supabase/tap/supabase`
- 프로젝트 초기화: `supabase init` (이미 완료됨)
- 프로젝트 연결: `supabase link --project-ref <project-ref>`

### 마이그레이션 워크플로우
```bash
# 새 마이그레이션 생성
supabase migration new <migration-name>

# 마이그레이션 적용
supabase db push

# 마이그레이션 상태 확인
supabase migration list

# 현재 DB와 로컬 스키마 차이 확인
supabase db diff
```

### 현재 적용된 마이그레이션
- `20250530121549_create-tables-only.sql`: AI 서비스용 테이블 생성
  - user_profiles, conversations, messages
  - documents, document_chunks (RAG용)
  - prompt_templates, api_usage_logs
  - RLS 정책 및 보안 함수 포함

### 마이그레이션 작성 규칙
1. **파일 명명**: 날짜_기능명.sql 형식 (자동 생성됨)
2. **순차 실행**: 파일명 순서대로 실행됨
3. **롤백 없음**: PostgreSQL은 기본적으로 forward-only
4. **테스트**: 로컬에서 먼저 테스트 후 원격 적용
5. **커밋 필수**: 마이그레이션 파일은 반드시 Git에 커밋

### 주의사항
- 마이그레이션 파일 수정 금지 (이미 적용된 것)
- 데이터 손실 위험한 작업 시 백업 필수
- 프로덕션 적용 전 스테이징 환경에서 검증

## 4. CORS 설정

- Supabase 대시보드 > Settings > API > Allowed Origins에 프론트엔드 도메인 등록
  - 예시: `http://localhost:3000,https://your-domain.com`

## 5. 참고 및 팀 규칙

- 환경 변수는 커밋 금지 (gitignore에 반드시 포함)
- Service Role Key는 서버에서만 사용, 클라이언트에 노출 금지
- 신규 팀원은 이 문서 순서대로 세팅
- 공식 문서: [Supabase Docs](https://supabase.com/docs)
- 마이그레이션 및 DB 변경은 반드시 코드로 관리하고, 변경 이력을 Git에 남길 것