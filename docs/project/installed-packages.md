> # 📦 설치된 패키지 및 운영 가이드

> 이 문서는 `yongwoon-ai` 프로젝트의 실제 설치 패키지와 그 역할, 관리 방법을 정리합니다. (최신 정보는 항상 [package.json](../../package.json) 기준)

---

## 📚 관련 가이드/참고

- [개발 워크플로우 가이드](../dev-workflow-guide.md)
- [디렉토리 아키텍처](../architecture/directory-architecture.md)
- [환경 변수/인프라 설정](../setup/environment-setup.md)
- [규칙 시스템 개요](../guides/overview.md)
- [Task Master Reference](../taskmaster-guide.md)

---

## 📝 프로젝트 환경 요약

- **프로젝트명**: yongwoon-ai
- **버전**: 0.1.0
- **패키지 매니저**: pnpm 10.11.0
- **Node.js 요구사항**: >=18.0.0
- **pnpm 요구사항**: >=8.0.0
- **모듈 시스템**: ESM (ES Modules)

---

## 🚀 주요 Dependencies

### Next.js & React

- **next** (^15.3.2) — React 기반 풀스택 프레임워크
- **react** (^19.1.0), **react-dom** (^19.1.0) — UI 라이브러리 및 렌더러

### AI & 머신러닝

- **ai** (^4.3.16) — Vercel AI SDK, 다양한 AI 모델 및 스트리밍 지원
- **@ai-sdk/openai** (^1.3.22), **@ai-sdk/anthropic** (^1.2.12), **@ai-sdk/google** (^1.2.18) — OpenAI, Anthropic, Google AI 모델 어댑터
- **@langchain/core** (^0.3.57), **@langchain/openai** (^0.5.11), **@langchain/community** (^0.3.44) — LLM 체인, 프롬프트, RAG 등
- **@pinecone-database/pinecone** (^6.0.1) — 벡터 DB 클라이언트

### 데이터/세션/캐싱

- **ioredis** (^5.6.1), **@upstash/redis** (^1.34.9) — Redis 클라이언트 (클러스터/서버리스)
- **js-cookie** (^3.0.5) — 브라우저 쿠키 관리
- **zod** (^3.25.30) — 타입 안전성 및 유효성 검사

### 파일/웹/이미지 처리

- **@vercel/blob** (^1.1.1) — Vercel Blob 스토리지 연동
- **multer** (^2.0.0) — 파일 업로드 미들웨어
- **pdf-parse** (^1.1.1), **mammoth** (^1.9.0) — PDF/Word 파일 파싱
- **sharp** (^0.34.2) — 이미지 변환/최적화
- **cheerio** (^1.0.0) — 서버사이드 HTML 파싱/스크래핑

### 브라우저 확장/테스트

- **webextension-polyfill** (^0.12.0) — 브라우저 확장 API 표준화
- **playwright** (^1.52.0) — E2E 테스트/웹 자동화

### Supabase & 환경

- **@supabase/supabase-js** (^2.38) — Supabase JS 클라이언트
- **@supabase/ssr** (^0.6.1) — SSR 지원
- **@t3-oss/env-nextjs** (^0.13.6) — 환경 변수 타입 안전성

### UI/스타일링

- **tailwindcss** (^4.1.7), **postcss** (^8.4.38), **autoprefixer** (^10.4.19) — CSS 프레임워크 및 처리
- **@radix-ui/react-dialog** (^1.1.14), **@radix-ui/react-dropdown-menu** (^2.1.15), **@radix-ui/react-label** (^2.1.7), **@radix-ui/react-slot** (^1.2.3) — 접근성/합성 UI 컴포넌트
- **lucide-react** (^0.511.0) — 아이콘
- **class-variance-authority** (^0.7.1), **clsx** (^2.1.1), **tailwind-merge** (^3.3.0) — 조건부 스타일/클래스 관리
- **tw-animate-css** (^1.3.0) — Tailwind 애니메이션 확장
- **next-themes** (^0.4.6) — 다크/라이트 테마 관리
- **sonner** (^2.0.3) — 토스트 알림

### 폼/테이블

- **react-hook-form** (^7.56.4) — 폼 관리
- **@hookform/resolvers** (^5.0.1) — 폼 검증 어댑터
- **@tanstack/react-table** (^8.2.6) — 고급 테이블

---

## 🧪 주요 DevDependencies

### 타입/테스트/빌드

- **typescript** (^5.4.2) — 타입스크립트
- **vitest** (^3.1.4), **@vitest/ui** (^3.1.4), **@vitest/coverage-v8** (^3.1.4) — 테스트/커버리지/UI
- **@testing-library/react** (^16.3.0), **@testing-library/jest-dom** (^6.6.3) — React 테스트
- **jsdom** (^26.1.0) — DOM 시뮬레이션
- **vite** (^6.0.7), **@vitejs/plugin-react** (^4.5.0) — 번들러/플러그인

### 린트/포맷팅

- **eslint** (^9.27.0), **eslint-config-next** (^15.3.2), **@typescript-eslint/parser** (^8.32.1), **@typescript-eslint/eslint-plugin** (^8.32.1), **@eslint/js** (^9.27.0), **@eslint/eslintrc** (^3.3.1) — 린트/규칙
- **prettier** (^3.5.3), **eslint-config-prettier** (^10.1.5), **eslint-plugin-prettier** (^5.4.0) — 코드 포맷팅

### Tailwind & PostCSS

- **@tailwindcss/postcss** (^4.1.7), **@tailwindcss/vite** (^4.1.7) — Tailwind/Vite/PostCSS 연동

### 기타

- **cross-env** (^7.0.3) — 환경변수 크로스 플랫폼 설정

---

## 🚀 패키지 설치/관리 가이드

### Docker 환경에서 패키지 설치

```bash
docker compose run --rm app pnpm install
# 새 패키지 추가 (런타임)
docker compose run --rm app pnpm add <package-name>
# 개발 의존성 추가
docker compose run --rm app pnpm add -D <package-name>
# 패키지 제거
docker compose run --rm app pnpm remove <package-name>
# 패키지 업데이트
docker compose run --rm app pnpm update
# 의존성 정리
docker compose run --rm app pnpm prune
```

### 로컬 환경에서 패키지 설치 (대안)

```bash
pnpm install
pnpm add <package-name>
pnpm add -D <package-name>
pnpm remove <package-name>
pnpm update
pnpm prune
```

---

## 📎 참고/운영 팁

- 실제 의존성/버전은 [package.json](../../package.json)에서 항상 확인
- 패키지/환경/규칙/워크플로우 변경 시 [Task Master Reference](../taskmaster-guide.md), [dev-workflow-guide.md](../dev-workflow-guide.md), [overview.md](../guides/overview.md) 등도 함께 업데이트 권장
- 패키지별 상세 사용법/예시는 각 기능별 폴더 및 README, 또는 위 가이드 문서 참고
