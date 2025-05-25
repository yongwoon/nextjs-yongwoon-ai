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

### 2. 데이터베이스 설정

```bash
# Supabase 프로젝트 생성 후 SQL 스키마 실행
# docs/database-schema.sql 파일의 내용을 Supabase SQL Editor에서 실행
```

### 3. 개발 서버 실행

```bash
# Docker를 사용한 전체 스택 실행 (권장)
pnpm run docker:dev

# 또는 로컬 개발 서버만 실행
pnpm run dev
```

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

### 데이터베이스
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

- [📁 디렉토리 아키텍처](docs/DIRECTORY_ARCHITECTURE.md)
- [🏗️ AI 서비스 아키텍처](docs/AI_SERVICE_ARCHITECTURE.md)
- [🔧 환경 변수 설정](docs/ENVIRONMENT_SETUP.md)
- [🗄️ 데이터베이스 스키마](docs/database-schema.sql)
- [📦 설치된 패키지](docs/installed-packages.md)

## 🎯 로드맵

### Phase 1: 기본 구조 ✅
- [x] 디렉토리 아키텍처 설계
- [x] AI 패키지 설치
- [x] 데이터베이스 스키마 설계
- [x] 환경 설정 가이드

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

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [Refine](https://refine.dev) - 강력한 React 프레임워크
- [Supabase](https://supabase.com) - 오픈소스 Firebase 대안
- [Vercel AI SDK](https://sdk.vercel.ai) - AI 애플리케이션 구축 도구
