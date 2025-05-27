# Testing Guide

이 프로젝트는 Vitest를 사용하여 테스트를 실행합니다.

## 테스트 실행

```bash
# 개발 모드에서 테스트 실행 (watch mode)
pnpm test

# 테스트를 한 번만 실행
pnpm test:run

# 커버리지와 함께 테스트 실행
pnpm test:coverage

# UI 모드로 테스트 실행
pnpm test:ui
```

## 테스트 구조

- **설정 파일**: `src/test/setup.ts` - 테스트 환경 초기 설정
- **타입 정의**: `src/test/vitest.d.ts` - Vitest 글로벌 타입 정의
- **테스트 파일**: `*.test.tsx` 또는 `*.spec.tsx` 확장자로 작성

## 예제 테스트

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
```

## 테스트 모킹

### Next.js Router 모킹
Next.js의 `useRouter`와 `useNavigation` 훅은 이미 `src/test/setup.ts`에서 모킹되어 있습니다.

### API 호출 모킹
```typescript
import { vi } from 'vitest'

vi.mock('../api/client', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test User' })
}))
```

## 커버리지 리포트

커버리지 리포트는 `coverage/` 디렉토리에 생성됩니다:
- `coverage/index.html` - HTML 리포트
- `coverage/coverage-summary.json` - JSON 요약

## Vitest 설정

주요 설정은 `vite.config.ts`에 정의되어 있습니다:

- **환경**: jsdom (브라우저 환경 시뮬레이션)
- **글로벌**: describe, it, expect 등이 글로벌로 사용 가능
- **CSS 지원**: CSS 파일 테스트 지원
- **별칭**: `@/`로 src 디렉토리 참조 가능

## 유용한 팁

1. **컴포넌트 테스트**: `@testing-library/react` 사용
2. **유틸리티 함수 테스트**: 순수 함수 단위 테스트
3. **API 테스트**: MSW(Mock Service Worker) 사용 권장
4. **스냅샷 테스트**: UI 변경 감지용으로 활용

## 문제 해결

### 모듈을 찾을 수 없는 경우
```bash
pnpm install
```

### 타입 에러가 발생하는 경우
```bash
pnpm type-check
```

### 캐시 문제
```bash
pnpm test --no-cache
```