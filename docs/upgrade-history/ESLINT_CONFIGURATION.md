# ESLint 설정 가이드

## 개요

이 프로젝트는 Next.js 15 + React 19 + TypeScript 환경에 최적화된 ESLint v9 설정을 사용합니다. 일반적으로 많은 개발자들이 추천하는 규칙들을 포함하여 코드 품질과 일관성을 보장합니다.

## 설정 파일

- **설정 파일**: `eslint.config.js` (ESLint v9 Flat Config 형식)
- **패키지 타입**: ES Module (`"type": "module"` in package.json)

## 포함된 규칙

### 1. 기본 설정

- **JavaScript 기본 권장 설정**: `@eslint/js` recommended
- **Next.js 설정**: `next/core-web-vitals` (TypeScript 지원 포함)

### 2. 코드 품질 규칙

#### 변수 관리

- `no-unused-vars`: 사용하지 않는 변수 금지 (언더스코어로 시작하는 변수는 허용)
- `prefer-const`: 재할당되지 않는 변수는 const 사용
- `no-var`: var 키워드 사용 금지

#### 코드 안전성

- `no-console`: console 사용 시 경고
- `no-debugger`: debugger 문 사용 금지
- `no-duplicate-imports`: 중복 import 금지
- `eqeqeq`: 엄격한 동등 비교 (===) 강제

### 3. React 관련 규칙

#### React 17+ 최적화

- `react/jsx-uses-react`: 비활성화 (자동 JSX 변환)
- `react/react-in-jsx-scope`: 비활성화 (자동 JSX 변환)
- `react/prop-types`: 비활성화 (TypeScript 사용)
- `react/display-name`: 컴포넌트 displayName 권장

#### React Hooks

- `react-hooks/rules-of-hooks`: Hooks 규칙 엄격 적용
- `react-hooks/exhaustive-deps`: 의존성 배열 검사 (경고)

### 4. 코드 스타일 규칙

#### 문법 스타일

- `curly`: 모든 제어문에 중괄호 필수
- `comma-dangle`: 여러 줄에서 trailing comma 필수
- `quotes`: 쌍따옴표 사용 강제
- `semi`: 세미콜론 필수

#### Next.js 특화

- `@next/next/no-img-element`: img 태그 대신 next/image 사용
- `@next/next/no-html-link-for-pages`: a 태그 대신 next/link 사용

## 예외 설정

### 1. 설정 파일들

다음 파일들은 더 관대한 규칙 적용:

- `*.config.{js,ts,mjs}`
- `*.setup.{js,ts}`
- `tailwind.config.*`

**예외 규칙**:

- `no-console`: 비활성화
- `no-unused-vars`: 비활성화

### 2. 테스트 파일들

다음 패턴의 파일들은 테스트 환경에 맞는 규칙 적용:

- `**/*.{test,spec}.{js,ts,jsx,tsx}`
- `**/__tests__/**/*`

**예외 규칙**:

- `no-console`: 비활성화
- `no-unused-vars`: 비활성화

## 사용법

### 전체 프로젝트 검사

```bash
npx eslint src/ --ext .ts,.tsx,.js,.jsx
```

### 자동 수정

```bash
npx eslint src/ --ext .ts,.tsx,.js,.jsx --fix
```

### 특정 파일 검사

```bash
npx eslint src/app/layout.tsx
```

### Docker 환경에서 실행

```bash
docker exec -it nextjs-yongwoon-ai-app-1 sh -c "cd /app && npx eslint src/ --ext .ts,.tsx,.js,.jsx"
```

## 현재 상태

✅ **모든 오류 수정 완료**

- 총 16개 문제 → 3개 경고만 남음
- 남은 경고: React Hooks dependency 경고 3개 (일반적으로 허용)

### 수정된 주요 이슈들

1. **코드 스타일**: trailing comma, 쌍따옴표, 세미콜론
2. **코드 품질**: 엄격한 동등 비교 (=== 사용)
3. **변수 관리**: 사용하지 않는 변수 제거
4. **Import 최적화**: 중복 import 통합
5. **React 최적화**: React 17+ 자동 JSX 변환 적용

## 권장사항

### 1. IDE 설정

- VS Code ESLint 확장 설치
- 저장 시 자동 수정 활성화
- 실시간 오류 표시 활성화

### 2. Git Hooks

pre-commit hook에 ESLint 검사 추가 권장:

```bash
npx eslint src/ --ext .ts,.tsx,.js,.jsx
```

### 3. CI/CD 통합

빌드 파이프라인에 ESLint 검사 단계 추가 권장

## 추가 정보

이 설정은 다음 환경에 최적화되어 있습니다:

- **Node.js**: v22.16.0
- **Next.js**: 15.3.2
- **React**: 19.1.0
- **TypeScript**: 5.7.3
- **ESLint**: 9.27.0

설정에 대한 질문이나 개선 제안이 있으면 팀과 상의해주세요.
