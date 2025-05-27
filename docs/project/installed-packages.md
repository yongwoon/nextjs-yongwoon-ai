# 설치된 패키지 목록

이 프로젝트에서 사용하는 패키지들을 카테고리별로 정리한 목록입니다.

## 🚀 Core Framework

### Next.js & React

- next (^15.3.2) - React 기반 풀스택 웹 프레임워크
- react (^19.1.0) - 사용자 인터페이스 구축을 위한 JavaScript 라이브러리
- react-dom (^19.1.0) - React DOM 렌더링 라이브러리

## 🔧 Refine Framework

### Core Refine Packages

- @refinedev/core (^4.47.1) - Refine의 핵심 기능 제공
- @refinedev/cli (^2.16.21) - Refine 프로젝트 관리 CLI 도구
- @refinedev/devtools (^1.1.32) - 개발 도구 및 디버깅 지원

### Refine Integrations

- @refinedev/nextjs-router (^6.0.0) - Next.js 라우터 통합
- @refinedev/kbar (^1.3.6) - 명령 팔레트 (Cmd+K) 기능
- @refinedev/supabase (^5.7.4) - Supabase 데이터베이스 연동
- @refinedev/react-hook-form (^4.8.14) - React Hook Form 통합
- @refinedev/react-table (^5.6.6) - 테이블 컴포넌트 통합

## 🤖 AI & Machine Learning

### AI SDK & Models

- ai (^4.3.16) - Vercel AI SDK - AI 애플리케이션 구축을 위한 통합 SDK
- @ai-sdk/openai (^1.3.22) - OpenAI 모델 통합 (GPT-4, GPT-3.5 등)
- @ai-sdk/anthropic (^1.2.12) - Anthropic Claude 모델 통합
- @ai-sdk/google (^1.2.18) - Google AI (Gemini) 모델 통합

### RAG & Vector Database

- @langchain/core (^0.3.57) - LangChain 핵심 라이브러리
- @langchain/openai (^0.5.11) - LangChain OpenAI 통합
- @langchain/community (^0.3.44) - LangChain 커뮤니티 통합
- @pinecone-database/pinecone (^6.0.1) - Pinecone 벡터 데이터베이스 클라이언트

### Caching & Session Management

- ioredis (^5.6.1) - Redis 클라이언트 (고성능 캐싱)
- @upstash/redis (^1.34.9) - Upstash Redis 클라이언트 (서버리스 Redis)

### File Processing

- @vercel/blob (^1.1.1) - Vercel Blob 파일 저장소
- multer (^2.0.0) - 파일 업로드 미들웨어
- pdf-parse (^1.1.1) - PDF 파일 파싱
- mammoth (^1.9.0) - Word 문서 파싱
- sharp (^0.34.2) - 이미지 처리 및 최적화

## 🗄️ Database & Backend

### Supabase

- @supabase/ssr (^0.5.2) - Supabase Server-Side Rendering 지원

### Data Management

- @tanstack/react-table (^8.2.6) - 강력한 테이블 라이브러리
- js-cookie (^3.0.5) - 쿠키 관리 유틸리티

## 🎨 Styling & UI

### CSS Framework

- tailwindcss (^3.4.3) - 유틸리티 우선 CSS 프레임워크
- postcss (^8.4.38) - CSS 후처리 도구
- autoprefixer (^10.4.19) - CSS 벤더 프리픽스 자동 추가

## 🛠️ Development Tools

### TypeScript

- typescript (^5.7.3) - JavaScript의 타입 안전성을 제공하는 언어
- @types/react (^19.1.0) - React TypeScript 타입 정의
- @types/react-dom (^19.1.0) - React DOM TypeScript 타입 정의
- @types/node (^22.10.7) - Node.js TypeScript 타입 정의
- @types/js-cookie (^3.0.6) - js-cookie TypeScript 타입 정의
- @types/multer (^2.0.0) - Multer TypeScript 타입 정의
- @types/pdf-parse (^1.1.4) - PDF-parse TypeScript 타입 정의

### Code Quality

- eslint (^9.27.0) - JavaScript/TypeScript 코드 린터
- eslint-config-next (^15.3.2) - Next.js용 ESLint 설정
- @typescript-eslint/parser (^8.32.1) - TypeScript용 ESLint 파서
- @typescript-eslint/eslint-plugin (^8.32.1) - TypeScript용 ESLint 플러그인
- @eslint/js (^9.27.0) - ESLint JavaScript 기본 설정
- @eslint/eslintrc (^3.3.1) - ESLint 설정 호환성 유틸리티

### Code Formatting

- prettier (^3.5.3) - 코드 포맷터 (일관된 코드 스타일 유지)
- eslint-config-prettier (^10.1.5) - ESLint와 Prettier 충돌 방지 설정
- eslint-plugin-prettier (^5.4.0) - ESLint에서 Prettier 규칙 사용

### Build & Development

- cross-env (^7.0.3) - 크로스 플랫폼 환경변수 설정

## 📊 프로젝트 정보

- 프로젝트명: yongwoon-ai
- 버전: 0.1.0
- Node.js 요구사항: >=18.0.0
- Refine 프로젝트 ID: jIU8e4-1LjeAx-OvNUY1

## 🎯 주요 스크립트

### 개발 & 빌드

```bash
pnpm dev          # 개발 서버 시작 (메모리 최적화 포함)
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버 시작
pnpm lint         # 코드 린팅
pnpm lint:fix     # ESLint 자동 수정
pnpm format       # Prettier로 코드 포맷팅
pnpm format:check # 포맷팅 검사 (수정하지 않음)
pnpm refine       # Refine CLI 실행
```

### Docker & 인프라

```bash
pnpm docker:up    # Docker 컨테이너 시작 (백그라운드)
pnpm docker:down  # Docker 컨테이너 중지 및 제거
pnpm docker:logs  # Docker 컨테이너 로그 확인
pnpm docker:clean # Docker 볼륨 및 이미지 정리
```

### 데이터베이스

```bash
pnpm db:migrate   # 데이터베이스 마이그레이션 실행
pnpm db:seed      # 데이터베이스 시드 데이터 삽입
pnpm db:reset     # 데이터베이스 초기화 (마이그레이션 + 시드)
```

### AI & 환경 검증

```bash
pnpm env:check    # 환경 변수 설정 검증
pnpm ai:test      # AI 모델 연결 테스트
pnpm health       # 전체 시스템 헬스 체크
```

### 패키지 관리

```bash
pnpm add <package>     # 패키지 추가
pnpm add -D <package>  # 개발 의존성 추가
pnpm remove <package>  # 패키지 제거
pnpm update           # 패키지 업데이트
pnpm outdated         # 오래된 패키지 확인
```

## 📝 패키지 특징

### AI 서비스 아키텍처

- **멀티 모델 지원**: OpenAI GPT, Anthropic Claude, Google Gemini 통합
- **RAG 시스템**: LangChain + Pinecone으로 문서 기반 AI 응답
- **실시간 스트리밍**: Vercel AI SDK로 실시간 AI 응답 스트리밍
- **파일 처리**: PDF, Word, 이미지 등 다양한 파일 형식 지원
- **캐싱 최적화**: Redis 기반 프롬프트 및 응답 캐싱

### Refine Framework

- 관리자 패널 특화: CRUD 작업에 최적화된 React 프레임워크
- 다양한 백엔드 지원: Supabase, REST API, GraphQL 등
- 풍부한 UI 컴포넌트: 테이블, 폼, 차트 등 관리자 패널에 필요한 컴포넌트 제공

### 개발 환경

- **TypeScript**: 타입 안전성으로 개발 생산성 향상
- **Tailwind CSS**: 빠른 UI 개발을 위한 유틸리티 CSS
- **ESLint + Prettier**: 코드 품질 관리 및 일관된 스타일 유지
- **pnpm**: 빠르고 효율적인 패키지 관리
- **Docker**: 일관된 개발 환경 제공 (PostgreSQL, Redis, Qdrant)
