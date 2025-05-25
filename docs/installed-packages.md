# 설치된 패키지 목록

이 프로젝트에서 사용하는 패키지들을 카테고리별로 정리한 목록입니다.

## 🚀 Core Framework

### Next.js & React

- next (^14.1.0) - React 기반 풀스택 웹 프레임워크
- react (^18.0.0) - 사용자 인터페이스 구축을 위한 JavaScript 라이브러리
- react-dom (^18.0.0) - React DOM 렌더링 라이브러리

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

## 🗄️ Database & Backend

### Supabase

- @supabase/ssr (^0.3.0) - Supabase Server-Side Rendering 지원

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

- typescript (^5.4.2) - JavaScript의 타입 안전성을 제공하는 언어
- @types/react (^18.0.0) - React TypeScript 타입 정의
- @types/react-dom (^18.0.0) - React DOM TypeScript 타입 정의
- @types/node (^18.16.2) - Node.js TypeScript 타입 정의
- @types/js-cookie (^3.0.6) - js-cookie TypeScript 타입 정의

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

```bash
npm run dev          # 개발 서버 시작 (메모리 최적화 포함)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 시작
npm run lint         # 코드 린팅
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier로 코드 포맷팅
npm run format:check # 포맷팅 검사 (수정하지 않음)
npm run refine       # Refine CLI 실행
```

## 📝 패키지 특징

### Refine Framework

- 관리자 패널 특화: CRUD 작업에 최적화된 React 프레임워크
- 다양한 백엔드 지원: Supabase, REST API, GraphQL 등
- 풍부한 UI 컴포넌트: 테이블, 폼, 차트 등 관리자 패널에 필요한 컴포넌트 제공

### 개발 환경

- TypeScript: 타입 안전성으로 개발 생산성 향상
- Tailwind CSS: 빠른 UI 개발을 위한 유틸리티 CSS
- ESLint: 코드 품질 관리 및 일관성 유지
- Prettier: 자동 코드 포맷팅으로 일관된 코드 스타일 유지
