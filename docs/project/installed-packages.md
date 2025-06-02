# 📦 설치된 패키지 목록

이 문서는 `yongwoon-ai` 프로젝트에 설치된 주요 패키지들과 그 역할을 설명합니다.

## 🚀 핵심 프레임워크

### Next.js Ecosystem
- **next** (^15.3.2) - React 기반의 풀스택 웹 프레임워크로 서버사이드 렌더링, 정적 사이트 생성, API 라우트 등을 제공

## 🤖 AI & 머신러닝

### AI SDK 통합
- **ai** (^4.3.16) - Vercel AI SDK의 핵심 패키지로 다양한 AI 모델과 스트리밍 인터페이스를 통합 제공
- **@ai-sdk/openai** (^1.3.22) - OpenAI 모델들(GPT-4, GPT-3.5 등)과의 통합을 위한 어댑터 패키지
- **@ai-sdk/anthropic** (^1.2.12) - Anthropic Claude 모델과의 통합을 위한 어댑터로 고품질 텍스트 생성 지원
- **@ai-sdk/google** (^1.2.18) - Google AI 모델(Gemini 등)과의 통합을 위한 어댑터 패키지

### LangChain 생태계
- **@langchain/core** (^0.3.57) - LangChain의 핵심 추상화 계층으로 LLM, 체인, 메모리 등 기본 구성 요소 제공
- **@langchain/openai** (^0.5.11) - LangChain과 OpenAI 모델의 통합으로 체인 기반 워크플로우에서 OpenAI 활용 지원
- **@langchain/community** (^0.3.44) - 커뮤니티에서 제공하는 다양한 LangChain 통합 및 도구들

### 벡터 데이터베이스
- **@pinecone-database/pinecone** (^6.0.1) - 벡터 유사성 검색을 위한 관리형 벡터 데이터베이스 서비스

## 🤖 AI & Machine Learning

### AI SDK & Models

- **@ai-sdk/openai** (^1.3.22) - OpenAI GPT 모델(GPT-4, GPT-3.5-turbo 등)과의 통합을 제공하는 어댑터
- **@ai-sdk/anthropic** (^1.2.12) - Anthropic Claude 모델(Claude-3 Sonnet, Haiku 등)과의 통합을 제공하는 어댑터
- **@ai-sdk/google** (^1.2.18) - Google AI 모델(Gemini Pro, Gemini Flash 등)과의 통합을 제공하는 어댑터

### RAG & Vector Database

- **@langchain/core** (^0.3.57) - LangChain의 핵심 추상화 및 런타임을 제공하는 라이브러리로 LLM 체인, 프롬프트 템플릿, 출력 파서 등을 포함
- **@langchain/openai** (^0.5.11) - LangChain과 OpenAI 모델을 연결하는 통합 패키지로 임베딩, 채팅, 완성 모델을 지원
- **@langchain/community** (^0.3.44) - 다양한 서드파티 통합과 도구들을 제공하는 커뮤니티 패키지
- **@pinecone-database/pinecone** (^6.0.1) - Pinecone 벡터 데이터베이스 클라이언트로 벡터 임베딩 저장, 검색, 유사도 매칭을 위한 완전 관리형 솔루션

### Caching & Session Management

- **ioredis** (^5.6.1) - Redis용 고성능 Node.js 클라이언트로 클러스터, 센티넬, 파이프라인, Lua 스크립트를 지원
- **@upstash/redis** (^1.34.9) - Upstash Redis용 HTTP 기반 클라이언트로 서버리스 환경에 최적화된 Redis 연결을 제공

### File Processing & Web Scraping

- **@vercel/blob** (^1.1.1) - Vercel Blob 스토리지와의 통합을 제공하여 파일 업로드, 다운로드, 관리를 간소화
- **multer** (^2.0.0) - Express용 multipart/form-data 파일 업로드 처리 미들웨어
- **pdf-parse** (^1.1.1) - PDF 파일에서 텍스트와 메타데이터를 추출하는 순수 JavaScript 라이브러리
- **mammoth** (^1.9.0) - Microsoft Word 문서(.docx)를 HTML 또는 텍스트로 변환하는 라이브러리
- **sharp** (^0.34.2) - 고성능 이미지 처리 라이브러리로 리사이징, 크롭, 포맷 변환, 최적화를 지원
- **cheerio** (^1.0.0) - 서버사이드 jQuery 구현체로 HTML/XML 파싱 및 조작에 사용되는 웹 스크래핑 라이브러리

### Browser Extension & Cross-Platform

- **webextension-polyfill** (^0.12.0) - 브라우저 확장 프로그램 API를 Promise 기반으로 표준화하여 크롬, 파이어폭스 등 여러 브라우저 호환성을 제공
- **playwright** (^1.52.0) - 웹 페이지 자동화 및 테스팅을 위한 도구로 Chromium, Firefox, Safari 브라우저를 지원하며 스크래핑과 E2E 테스트에 활용

## 🗄️ Database & Backend

### Supabase & Environment

- **@supabase/supabase-js** (^2.38) - Supabase 공식 JS/TS 클라이언트 라이브러리
- **@supabase/auth-helpers-nextjs** (^0.10.0) - Next.js에서 Supabase 인증을 쉽게 처리할 수 있는 헬퍼 패키지
- **@supabase/ssr** (^0.5.2) - Supabase의 Server-Side Rendering 지원 패키지로 Next.js와 함께 안전한 서버사이드 인증과 데이터 페칭을 제공
- **@t3-oss/env-nextjs** (^0.13.6) - TypeScript로 환경 변수의 런타임 유효성 검사와 타입 안전성을 보장하는 스키마 기반 환경 변수 관리 도구

### Data Management & Validation

- **@tanstack/react-table** (^8.2.6) - 헤드리스 테이블 라이브러리로 정렬, 필터링, 그룹화, 가상화 등 고급 테이블 기능을 제공
- **js-cookie** (^3.0.5) - 브라우저 쿠키를 간단하고 가벼운 API로 관리할 수 있는 유틸리티 라이브러리
- **zod** (^3.25.30) - TypeScript 우선 스키마 선언 및 유효성 검사 라이브러리로 런타임 타입 안전성을 제공

## 🎨 Styling & UI

### CSS Framework & Processing

- **tailwindcss** (^4.1.7) - 유틸리티 클래스 기반 CSS 프레임워크로 빠른 UI 개발과 일관된 디자인 시스템 구축을 지원
- **@tailwindcss/postcss** (^4.1.7) - Tailwind CSS의 PostCSS 플러그인으로 최신 CSS 기능과 최적화를 제공
- **@tailwindcss/vite** (^4.1.7) - Vite 번들러와 Tailwind CSS의 통합을 제공하는 플러그인
- **postcss** (^8.4.38) - CSS 후처리 도구로 CSS를 JavaScript 플러그인으로 변환하여 자동 프리픽싱, 압축 등을 수행
- **autoprefixer** (^10.4.19) - CSS 속성에 벤더 프리픽스를 자동으로 추가하여 브라우저 호환성을 향상시키는 PostCSS 플러그인

### UI Components & Styling Utilities

- **@radix-ui/react-dialog** (^1.1.14) - 접근성을 고려한 모달 다이얼로그 컴포넌트로 키보드 탐색, 포커스 관리, ARIA 속성을 자동으로 처리
- **@radix-ui/react-dropdown-menu** (^2.1.15) - 헤드리스 드롭다운 메뉴 컴포넌트로 완전한 키보드 탐색과 접근성을 제공
- **@radix-ui/react-label** (^2.1.7) - 폼 라벨 컴포넌트로 접근성 속성과 폼 컨트롤과의 연결을 자동으로 관리
- **@radix-ui/react-slot** (^1.2.3) - 컴포넌트 합성을 위한 슬롯 패턴 구현체로 자식 컴포넌트의 props를 부모에게 전달
- **lucide-react** (^0.511.0) - Lucide 아이콘 세트의 React 컴포넌트 버전으로 가벼우면서도 일관된 아이콘 시스템 제공
- **class-variance-authority** (^0.7.1) - TypeScript 기반 클래스 이름 관리 유틸리티로 조건부 스타일링과 variant 패턴을 지원
- **clsx** (^2.1.1) - 조건부 클래스 이름 결합을 위한 가볍고 빠른 유틸리티 라이브러리
- **tailwind-merge** (^3.3.0) - Tailwind CSS 클래스들을 충돌 없이 병합하는 유틸리티로 조건부 스타일링에서 중복 제거
- **tw-animate-css** (^1.3.0) - Tailwind CSS용 애니메이션 유틸리티 클래스 확장 패키지

### Theming & UX

- **next-themes** (^0.4.6) - Next.js 애플리케이션을 위한 완전한 테마 관리 솔루션으로 다크/라이트 모드 전환과 시스템 설정 동기화를 지원
- **sonner** (^2.0.3) - React용 토스트 알림 라이브러리로 애니메이션, 스택킹, 접근성을 고려한 사용자 알림 시스템

## 🧪 Testing & Quality Assurance

### Testing Framework

- **vitest** (^3.1.4) - Vite 기반의 고속 유닛 테스트 프레임워크로 Jest와 호환되는 API와 ESM 지원을 제공
- **@vitejs/plugin-react** (^4.5.0) - Vite에서 React 지원을 위한 공식 플러그인으로 Fast Refresh와 JSX 변환을 제공
- **jsdom** (^26.1.0) - 순수 JavaScript로 구현된 DOM 및 HTML 표준으로 Node.js 환경에서 브라우저 환경을 시뮬레이션
- **@vitest/coverage-v8** (^3.1.4) - Vitest와 함께 사용하는 코드 커버리지 도구
- **@vitest/ui** (^3.1.4) - Vitest용 웹 기반 UI 인터페이스

### React Testing Utilities

- **@testing-library/react** (^16.3.0) - React 컴포넌트를 사용자 중심의 방식으로 테스트하기 위한 간단하고 완전한 테스팅 유틸리티
- **@testing-library/jest-dom** (^6.6.3) - Jest DOM 매처를 확장하여 DOM 요소의 상태를 더 자세히 어서트할 수 있는 커스텀 매처 제공

## 📝 Form Management

### Form Handling & Validation

- **react-hook-form** (^7.56.4) - 최소한의 리렌더링으로 고성능 폼을 구축하기 위한 React 라이브러리
- **@hookform/resolvers** (^5.0.1) - React Hook Form과 다양한 스키마 검증 라이브러리(Zod, Yup, Joi 등)를 연결하는 어댑터

## 🛠️ Development Tools

### TypeScript & Type Definitions

- **typescript** (^5.4.2) - JavaScript에 정적 타입 검사를 추가하는 프로그래밍 언어로 컴파일 타임 오류 감지와 IDE 지원을 제공
- **@types/react** (^19.1.5) - React 라이브러리의 TypeScript 타입 정의로 컴포넌트, 훅, 이벤트 등의 타입 안전성을 보장
- **@types/react-dom** (^19.1.5) - React DOM 라이브러리의 TypeScript 타입 정의로 DOM 조작과 이벤트 처리의 타입 안전성을 제공
- **@types/node** (^22.15.21) - Node.js 런타임 환경의 TypeScript 타입 정의로 서버사이드 개발에 필요한 API 타입을 제공
- **@types/js-cookie** (^3.0.6) - js-cookie 라이브러리의 TypeScript 타입 정의
- **@types/multer** (^1.4.12) - Multer 파일 업로드 미들웨어의 TypeScript 타입 정의
- **@types/pdf-parse** (^1.1.5) - PDF 파싱 라이브러리의 TypeScript 타입 정의
- **@types/webextension-polyfill** (^0.12.3) - 브라우저 확장 프로그램 API polyfill의 TypeScript 타입 정의

### Code Quality & Linting

- **eslint** (^9.27.0) - JavaScript/TypeScript 코드의 문법 오류, 스타일 문제, 잠재적 버그를 찾아내는 정적 분석 도구
- **eslint-config-next** (^15.3.2) - Next.js 프로젝트에 최적화된 ESLint 규칙 세트로 React, Next.js 모범 사례를 포함
- **@typescript-eslint/parser** (^8.32.1) - TypeScript 코드를 ESLint가 이해할 수 있도록 파싱하는 파서
- **@typescript-eslint/eslint-plugin** (^8.32.1) - TypeScript 특화 ESLint 규칙들을 제공하는 플러그인
- **@eslint/js** (^9.27.0) - ESLint의 기본 JavaScript 규칙 세트
- **@eslint/eslintrc** (^3.3.1) - 레거시 ESLint 설정 파일(.eslintrc) 형식과의 호환성을 제공하는 유틸리티
- **prettier** (^3.5.3) - 일관된 코드 스타일을 자동으로 적용하는 opinionated 코드 포맷터
- **eslint-config-prettier** (^10.1.5) - ESLint와 Prettier 간의 규칙 충돌을 방지하고 Prettier가 처리할 규칙들을 비활성화하는 설정
- **eslint-plugin-prettier** (^5.4.0) - Prettier를 ESLint 규칙으로 실행하여 포맷팅 이슈를 ESLint 오류로 표시하는 플러그인

### Build & Development Utilities

- **cross-env** (^7.0.3) - Windows, macOS, Linux에서 일관되게 환경 변수를 설정할 수 있는 크로스 플랫폼 도구
- **vite** (^6.0.7) - 빠른 개발 서버와 번들링을 제공하는 차세대 프론트엔드 빌드 도구

## 📊 프로젝트 정보

- **프로젝트명**: yongwoon-ai
- **버전**: 0.1.0
- **패키지 매니저**: pnpm 10.11.0
- **Node.js 요구사항**: >=18.0.0
- **pnpm 요구사항**: >=8.0.0
- **모듈 시스템**: ESM (ES Modules)

## 🚀 패키지 설치 가이드

### Docker 환경에서 패키지 설치

이 프로젝트는 Docker 환경에서 개발하며, 모든 패키지 설치는 Docker 컨테이너 내부에서 수행해야 합니다.

```bash
# Docker 컨테이너 확인
docker ps

# 기본 패키지 설치
docker exec -it nextjs-yongwoon-ai-app-1 pnpm install

# 새 패키지 추가 (runtime dependency)
docker exec -it nextjs-yongwoon-ai-app-1 pnpm add <package-name>

# 개발 의존성 추가
docker exec -it nextjs-yongwoon-ai-app-1 pnpm add -D <package-name>

# 특정 버전 설치
docker exec -it nextjs-yongwoon-ai-app-1 pnpm add <package-name>@<version>

# 패키지 제거
docker exec -it nextjs-yongwoon-ai-app-1 pnpm remove <package-name>

# 패키지 업데이트
docker exec -it nextjs-yongwoon-ai-app-1 pnpm update

# 의존성 정리
docker exec -it nextjs-yongwoon-ai-app-1 pnpm prune
```

### 로컬 환경에서 패키지 설치 (대안)

Docker를 사용하지 않는 경우:

```bash
# 기본 패키지 설치
pnpm install

# 새 패키지 추가
pnpm add <package-name>

# 개발 의존성 추가
pnpm add -D <package-name>
```

## 🎯 주요 스크립트

### 개발 & 빌드

```bash
pnpm dev          # 개발 서버 시작 (메모리 최적화 4GB 할당)
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버 시작
pnpm type-check   # TypeScript 타입 검사 (컴파일 없이)
```

### 코드 품질 관리

```bash
pnpm lint         # ESLint로 코드 검사
pnpm lint:fix     # ESLint 자동 수정 적용
pnpm format       # Prettier로 코드 포맷팅
pnpm format:check # 포맷팅 규칙 준수 여부 확인 (수정하지 않음)
```

### Docker & 인프라

```bash
pnpm docker:dev   # Docker Compose로 개발 환경 시작 (빌드 포함)
pnpm docker:down  # Docker 컨테이너 중지 및 제거
pnpm docker:clean # Docker 볼륨, 네트워크, 고아 컨테이너 정리
```

### 데이터베이스 관리

```bash
pnpm db:migrate   # Supabase 대시보드에서 SQL 스키마 실행 안내
pnpm db:seed      # 스키마 파일에 포함된 시드 데이터 실행 안내
```

### 테스팅

```bash
pnpm test         # Vitest로 테스트 실행
pnpm test:ui      # Vitest UI로 테스트 실행
pnpm test:run     # 단일 실행 모드로 테스트
pnpm test:coverage # 코드 커버리지 포함 테스트
```

### AI & 환경 검증

```bash
pnpm env:check    # 환경 변수 설정 검증 (구현 예정)
pnpm ai:test      # AI 모델 연결 테스트 (구현 예정)
pnpm cache:clear  # Redis 캐시 정리 (구현 예정)
```

## 📝 프로젝트 아키텍처 특징

### 🤖 AI 서비스 아키텍처

- **멀티 모델 AI 지원**: OpenAI GPT, Anthropic Claude, Google Gemini를 통합한 유연한 AI 모델 선택
- **고급 RAG 시스템**: LangChain + Pinecone 벡터 데이터베이스로 문맥 기반 지능형 문서 검색 및 응답 생성
- **실시간 스트리밍**: Vercel AI SDK를 활용한 타이핑 효과의 실시간 AI 응답 스트리밍
- **다중 파일 처리**: PDF, Word, 이미지 등 다양한 파일 형식 지원으로 포괄적인 문서 AI 처리
- **고성능 캐싱**: Redis 기반 지능형 캐싱으로 AI 응답 속도 최적화 및 API 비용 절감
- **브라우저 확장**: WebExtension API 지원으로 크롬, 파이어폭스 등 다양한 브라우저 플랫폼 확장 가능
- **웹 스크래핑**: Cheerio + Playwright를 통한 웹 페이지 컨텍스트 분석 및 자동화

### 🎨 현대적 UI/UX 시스템

- **컴포넌트 기반 디자인**: Radix UI 기반의 접근성을 고려한 헤드리스 컴포넌트 시스템
- **Tailwind CSS**: 유틸리티 우선 접근법으로 일관되고 확장 가능한 디자인 시스템 구축
- **다크/라이트 테마**: 시스템 설정과 동기화되는 완전한 테마 관리 시스템
- **모션 디자인**: CSS 애니메이션과 트랜지션으로 부드러운 사용자 경험 제공
- **아이콘 시스템**: Lucide React로 통합된 일관성 있는 아이콘 세트

### 🧪 품질 보증 및 테스팅

- **현대적 테스팅**: Vitest + Testing Library를 통한 빠르고 안정적인 단위 테스트
- **E2E 자동화**: Playwright를 활용한 브라우저 자동화 및 종단간 테스트
- **타입 안전성**: TypeScript를 통한 컴파일 타임 오류 감지 및 IDE 지원
- **코드 품질**: ESLint + Prettier로 일관된 코드 스타일과 모범 사례 적용

### 🚀 개발 및 배포 환경

- **고성능 패키지 관리**: pnpm을 통한 빠른 의존성 설치 및 디스크 공간 절약
- **환경 변수 관리**: T3 Env를 통한 타입 안전한 환경 변수 검증 및 관리
- **Docker 컨테이너화**: 일관된 개발 환경 제공 (PostgreSQL, Redis, Qdrant 포함)
- **Next.js 15**: 최신 React 19 기능과 App Router를 활용한 풀스택 웹 애플리케이션
- **ESM 모듈**: 최신 ES 모듈 시스템으로 트리 셰이킹과 번들 최적화 지원

### 🔐 보안 및 성능

- **서버사이드 인증**: Supabase SSR을 통한 안전한 서버사이드 사용자 인증
- **스키마 검증**: Zod를 통한 런타임 데이터 유효성 검사 및 타입 안전성
- **이미지 최적화**: Sharp를 통한 고성능 이미지 처리 및 최적화
- **메모리 관리**: Node.js 메모리 할당 최적화로 대용량 AI 처리 안정성 확보

### 📦 패키지 관리 특징

- **모노레포 지원**: pnpm workspace를 통한 효율적인 의존성 관리
- **Peer Dependency 최적화**: React 19와 호환성 확보를 위한 의존성 구성
- **자동 업데이트**: Renovate 또는 Dependabot을 통한 보안 패치 자동 적용
- **번들 분석**: Webpack Bundle Analyzer를 통한 번들 크기 최적화