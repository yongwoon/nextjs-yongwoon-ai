# Tailwind CSS v4 업그레이드 가이드

이 프로젝트는 Tailwind CSS v3에서 v4로 성공적으로 업그레이드되었습니다.

## 🔄 주요 변경사항

### 1. 패키지 업데이트

- **tailwindcss**: 3.4.17 → **4.1.7** ✅
- **@tailwindcss/postcss**: 새로 추가 ✅
- **@tailwindcss/vite**: 새로 추가 ✅

### 2. CSS 파일 변경 (`src/styles/global.css`)

```css
// 이전 (v3)
@tailwind base;
@tailwind components;
@tailwind utilities;

// 현재 (v4)
@import "tailwindcss";
```

### 3. PostCSS 설정 변경 (`postcss.config.js`)

```js
// 이전 (v3)
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// 현재 (v4)
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### 4. 설정 파일 변경

- **JavaScript 설정 파일**: `tailwind.config.js` → `tailwind.config.js.backup` (백업됨)
- **CSS 기반 설정**: `src/styles/global.css`에 `@theme` 블록 추가

## 🚀 v4의 새로운 기능

### 1. 자동 Import 및 Vendor Prefixing

- PostCSS import와 autoprefixer가 자동으로 처리됨
- 별도 설정 불필요

### 2. CSS 변수 기반 테마

- 모든 테마 값이 CSS 변수로 제공됨
- JavaScript에서 `var(--color-red-500)` 형태로 사용 가능

### 3. 향상된 성능

- 빌드 시간 단축
- 더 작은 번들 크기

## ⚠️ 주의사항

### 1. 브라우저 지원

- **최소 요구사항**: Safari 16.4+, Chrome 111+, Firefox 128+
- 구형 브라우저 지원이 필요한 경우 v3.4 사용 권장

### 2. Breaking Changes 확인 필요

- **Hover 스타일**: 모바일에서 `hover` 동작 변경
- **Variant 스택 순서**: 좌→우 순서로 변경
- **CSS 변수 문법**: `bg-[--brand-color]` → `bg-(--brand-color)`

### 3. 제거된 기능들

- `@tailwind` 지시문
- 일부 deprecated 유틸리티 클래스들
- JavaScript 기반 설정 자동 감지

## 📋 마이그레이션 체크리스트

- [x] Tailwind CSS v4 설치
- [x] PostCSS 플러그인 업데이트
- [x] CSS 파일 @import 구문 변경
- [x] JavaScript 설정 파일 백업
- [x] 애플리케이션 정상 작동 확인
- [ ] 브라우저 호환성 테스트
- [ ] 스타일 깨짐 확인
- [ ] 커스텀 유틸리티 클래스 검토

## 🔗 참고 자료

- [Tailwind CSS v4 공식 업그레이드 가이드](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)
- [Breaking Changes 전체 목록](https://tailwindcss.com/docs/upgrade-guide#changes-from-v3)

## 🎯 다음 단계

1. **브라우저 테스트**: 지원하는 브라우저에서 정상 작동 확인
2. **스타일 검토**: 모든 페이지의 스타일이 올바르게 적용되는지 확인
3. **성능 측정**: v4의 성능 향상 효과 측정
4. **팀 공유**: 팀원들에게 v4 변경사항 공유

---

**업그레이드 완료일**: $(date)
**업그레이드 담당자**: AI Assistant
**테스트 상태**: ✅ 기본 기능 정상 작동 확인됨
