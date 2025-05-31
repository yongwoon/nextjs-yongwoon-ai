# Yongwoon AI

> 🤖 **Getmerlin과 같은 고급 AI 서비스를 구축할 수 있는 완전한 스택**

Next.js 15 + React 19 기반의 AI 서비스 플랫폼으로, 프롬프트 캐싱, RAG(Retrieval-Augmented Generation), 실시간 스트리밍 등의 고급 기능을 제공합니다.

## ✨ 주요 기능

- 🧠 **다중 AI 모델 지원**: OpenAI, Anthropic, Google AI 통합
- 📚 **RAG 시스템**: 문서 기반 컨텍스트 생성 및 벡터 검색
- ⚡ **프롬프트 캐싱**: Redis 기반 고성능 캐싱
- 🔄 **실시간 스트리밍**: Server-Sent Events 기반 실시간 응답
- 📁 **파일 처리**: PDF, Word, 텍스트 파일 자동 파싱 및 임베딩
- 🔐 **보안**: Row Level Security (RLS) 및 사용자별 데이터 격리
- 📊 **모니터링**: API 사용량 추적 및 성능 분석

## 🏗️ 기술 스택

### 프론트엔드
- **Next.js 15** + **React 19**: 최신 웹 프레임워크
- **Refine Framework**: 관리자 패널 및 CRUD 인터페이스
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **TypeScript**: 타입 안전성

### 백엔드 & AI
- **AI SDK**: OpenAI, Anthropic, Google AI 통합
- **LangChain**: RAG 시스템 및 문서 처리
- **Pinecone/Qdrant**: 벡터 데이터베이스
- **Redis**: 캐싱 및 세션 관리

### 데이터베이스 & 인프라
- **Supabase**: PostgreSQL + 인증 + 실시간 기능
- **Docker**: 컨테이너화된 개발 환경
- **Vercel Blob**: 파일 저장소

## 🚀 빠른 시작

### pre-required

- Install supabase

```bash
brew install supabase/tap/supabase
```

### 1. 환경 설정

```bash
# 저장소 클론
git clone <repository-url>
cd yongwoon-ai

# 의존성 설치 (pnpm 사용)
pnpm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 API 키들을 설정하세요
```

### 2. Supabase 프로젝트 설정

#### 🚀 자동 설정 (권장)

로컬 Supabase 환경을 빠르게 설정하려면 제공된 스크립트를 사용하세요:

```bash
# 스크립트 실행 권한 부여 (최초 1회)
chmod +x scripts/supabase-local-setup.sh

# 자동 설정 스크립트 실행
./scripts/supabase-local-setup.sh
```

**스크립트가 수행하는 작업:**
- ✅ 필수 도구 확인 (Docker, Node.js, npm)
- 📦 Supabase CLI 설치/업데이트
- 🧹 기존 Supabase 인스턴스 정리
- 🚀 로컬 Supabase 환경 시작
- 🗄️ 데이터베이스 마이그레이션 적용
- 🌱 시드 데이터 로드 (선택사항)
- 📊 개발 환경 정보 출력

스크립트 실행 후 Supabase Studio(`http://localhost:54323`)에서 데이터베이스를 관리할 수 있습니다.

#### 🔧 수동 설정

자동 스크립트를 사용하지 않는 경우 아래 단계를 따라 수동으로 설정하세요:

##### 1. 새 Supabase 프로젝트 생성
1. [Supabase Dashboard](https://app.supabase.com)에서 새 프로젝트 생성
2. Project Name, Database Password 설정
3. Region 선택 (가까운 지역 권장)

##### 2. Supabase CLI 연결
```bash
# 프로젝트 연결 (Reference ID와 DB Password 필요)
supabase link --project-ref YOUR_PROJECT_REF

# 연결 확인
supabase status
```

##### 3. 데이터베이스 스키마 적용
```bash
# 마이그레이션 적용 (AI 서비스용 테이블 생성)
supabase db push

# 테이블 생성 확인
# Supabase Dashboard > Table Editor에서 확인
```

### 테이블 구조
현재 AI 서비스를 위한 다음 테이블들이 구성되어 있습니다:

- **user_profiles**: 사용자 프로필 및 구독 정보
- **conversations**: AI 대화 세션 관리
- **messages**: 대화 메시지 저장
- **documents**: 업로드된 문서 관리
- **document_chunks**: RAG를 위한 문서 청크 (벡터 임베딩 포함)
- **document_conversation_links**: 문서-대화 연결 관계
- **prompt_templates**: 재사용 가능한 프롬프트 템플릿
- **api_usage_logs**: API 사용량 추적
- **prompt_cache**: 프롬프트 캐싱
- **message_feedback**: 메시지 피드백

자세한 테이블 설계는 [`docs/setup/table-design-specification.md`](docs/setup/table-design-specification.md)를 참조하세요.

### 마이그레이션 관리

**중요**: 모든 데이터베이스 변경은 마이그레이션 파일로 관리합니다.

```bash
# 새 마이그레이션 생성
supabase migration new <migration-name>

# 마이그레이션 적용
supabase db push

# 마이그레이션 상태 확인
supabase migration list
```

### Row Level Security (RLS)
모든 테이블에 RLS 정책이 적용되어 사용자별 데이터 격리가 보장됩니다:
- 사용자는 자신의 데이터만 접근 가능
- 대화, 문서, 메시지 등 모든 리소스가 소유권 기반으로 보호
- 공개 프롬프트 템플릿은 모든 사용자가 조회 가능

## 📋 사용 가능한 스크립트

### 개발
- `pnpm run dev` - 개발 서버 실행
- `pnpm run build` - 프로덕션 빌드
- `pnpm run start` - 프로덕션 서버 실행
- `pnpm run type-check` - TypeScript 타입 검사

### 코드 품질
- `pnpm run lint` - ESLint 검사
- `pnpm run lint:fix` - ESLint 자동 수정
- `pnpm run format` - Prettier 포맷팅
- `pnpm run format:check` - 포맷팅 검사

### Docker
- `pnpm run docker:dev` - Docker Compose로 전체 스택 실행
- `pnpm run docker:down` - Docker 서비스 중지
- `pnpm run docker:clean` - Docker 볼륨 포함 완전 정리

### Supabase & 데이터베이스
- `./scripts/supabase-local-setup.sh` - 로컬 Supabase 환경 자동 설정
- `pnpm run db:migrate` - 데이터베이스 마이그레이션 안내
- `pnpm run db:seed` - 시드 데이터 안내

### 유틸리티
- `pnpm run env:check` - 환경 변수 검증
- `pnpm run ai:test` - AI 연결 테스트
- `pnpm run cache:clear` - Redis 캐시 정리

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 라우트
│   ├── (dashboard)/       # 대시보드 라우트
│   └── api/               # API 엔드포인트
├── components/            # React 컴포넌트
├── lib/                   # 핵심 라이브러리
│   ├── ai/               # AI 모델 통합
│   ├── cache/            # 캐싱 시스템
│   ├── rag/              # RAG 시스템
│   └── file-processing/  # 파일 처리
├── types/                # TypeScript 타입
└── providers/            # React Context
```

## 🔧 환경 변수 설정

필수 환경 변수들을 `.env.local`에 설정하세요:

```env
# AI 모델 API 키
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key

# 데이터베이스 (Supabase)
DATABASE_URL=your_supabase_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 벡터 데이터베이스
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name

# 캐싱 (Redis)
REDIS_URL=redis://localhost:6379

# 파일 저장소
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

자세한 설정 방법은 [`docs/ENVIRONMENT_SETUP.md`](docs/ENVIRONMENT_SETUP.md)를 참조하세요.

## 📚 문서

### 시작하기
- [🚀 시작 가이드](docs/setup/getting-started.md)
- [🔧 환경 설정](docs/setup/environment-setup.md)
- [🐳 Docker 설정](docs/setup/docker-setup.md)
- [🗄️ 데이터베이스 스키마](docs/setup/database-schema.sql)

### 아키텍처
- [📁 디렉토리 아키텍처](docs/architecture/directory-architecture.md)
- [🏗️ AI 서비스 아키텍처](docs/architecture/ai-service-architecture.md)

### Rules 시스템
- [📋 Rules 시스템 개요](docs/rules/overview.md)
- [🎯 Cursor Rules 가이드](docs/rules/cursor-rules-guide.md)
- [🔄 개발 워크플로우 가이드](docs/rules/dev-workflow-guide.md)
- [🚀 Task Master 사용법](docs/rules/taskmaster-guide.md)
- [🔧 자동 개선 프로세스 가이드](docs/rules/self-improvement-guide.md)

### 프로젝트 관리
- [🗺️ 구현 로드맵](docs/project/implementation-roadmap.md)
- [📦 설치된 패키지](docs/project/installed-packages.md)
- [🤖 Task Master AI](docs/project/taskmaster-ai.md)

## 🎯 로드맵

### Phase 1: 기본 구조 ✅
- [x] 디렉토리 아키텍처 설계
- [x] AI 패키지 설치
- [x] 데이터베이스 스키마 설계 및 구현
- [x] RLS 보안 정책 구현
- [x] 환경 설정 가이드
- [x] 테이블 설계서 작성

### Phase 2: 핵심 기능 (진행 중)
- [ ] AI 모델 통합
- [ ] 기본 채팅 시스템
- [ ] 프롬프트 캐싱
- [ ] 사용자 인증

### Phase 3: 고급 기능
- [ ] RAG 시스템 구현
- [ ] 파일 업로드 및 처리
- [ ] 실시간 스트리밍
- [ ] 관리자 패널

### Phase 4: 최적화
- [ ] 성능 최적화
- [ ] 모니터링 시스템
- [ ] 테스트 코드
- [ ] 배포 자동화

## task-master 사용법

- show task list

```bash
task-master list
```

- task-master model(`.taskmasterconfig` 에서 직접 수정 가능하다.)

```bash
# model list
task-master models
# set model
task-master models --set-main claude-opus-4-20250514
```

## 🤝 기여하기

