> **이 문서는 Prettier 코드 포맷팅/운영 가이드입니다.**

- 개발 워크플로우는 [dev-workflow-guide.md](../guides/dev-workflow-guide.md)
- Task Master Reference는 [taskmaster-guide.md](../guides/taskmaster-guide.md)
- 규칙 시스템 개요는 [overview.md](../rules/overview.md) 참고

# Prettier 설정 가이드

## 개요

이 프로젝트는 코드 포맷팅을 위해 Prettier를 사용합니다. Prettier는 일관된 코드 스타일을 유지하고 팀 협업을 원활하게 만들어줍니다.

## 설치된 패키지

```json
{
  "prettier": "^3.5.3",
  "eslint-config-prettier": "^10.1.5",
  "eslint-plugin-prettier": "^5.4.0"
}
```

## Prettier 설정 (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "proseWrap": "preserve"
}
```

### 설정 설명

- **semi**: 세미콜론 사용 (true)
- **trailingComma**: 후행 쉼표 사용 (all)
- **singleQuote**: 작은따옴표 대신 큰따옴표 사용 (false)
- **printWidth**: 한 줄 최대 길이 (80자)
- **tabWidth**: 탭 크기 (2칸)
- **useTabs**: 탭 대신 스페이스 사용 (false)
- **bracketSpacing**: 객체 리터럴 괄호 내 공백 (true)
- **bracketSameLine**: JSX 태그 닫는 괄호 위치 (false)
- **arrowParens**: 화살표 함수 매개변수 괄호 (always)
- **endOfLine**: 줄 끝 문자 (lf)

## 사용 가능한 스크립트

### 포맷팅 명령어

```bash
# 모든 파일 포맷팅
npm run format

# 포맷팅 검사 (수정하지 않음)
npm run format:check

# ESLint와 함께 사용
npm run lint:fix
```

### 개별 파일 포맷팅

```bash
# 특정 파일 포맷팅
npx prettier --write src/app/page.tsx

# 특정 디렉토리 포맷팅
npx prettier --write src/components/
```

## VS Code 설정

프로젝트에는 `.vscode/settings.json` 파일이 포함되어 있어 다음 기능을 제공합니다:

- **저장 시 자동 포맷팅**: 파일 저장 시 Prettier가 자동 실행
- **붙여넣기 시 포맷팅**: 코드 붙여넣기 시 자동 포맷팅
- **ESLint 자동 수정**: 저장 시 ESLint 규칙 자동 수정

### VS Code 확장 프로그램

다음 확장 프로그램 설치를 권장합니다:

1. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
2. **ESLint** (`dbaeumer.vscode-eslint`)

## ESLint와의 통합

ESLint 설정에서 Prettier와 충돌하는 스타일 규칙들을 제거했습니다:

- `comma-dangle`, `quotes`, `semi` 등의 스타일 규칙은 Prettier가 처리
- 코드 품질 관련 규칙은 ESLint가 계속 처리

## 무시할 파일 (`.prettierignore`)

다음 파일들은 Prettier 포맷팅에서 제외됩니다:

- `node_modules/`
- `.next/`
- `dist/`, `build/`
- 환경 변수 파일 (`.env*`)
- 로그 파일
- 설정 파일 (`*.config.js`, `*.config.ts`)
- 마크다운 파일 (`*.md`)

## 워크플로우 권장사항

### 개발 중

1. VS Code에서 파일 저장 시 자동 포맷팅 활용
2. 커밋 전 `npm run format:check`로 포맷팅 확인

### CI/CD

```bash
# 빌드 전 포맷팅 검사
npm run format:check
npm run lint
npm run build
```

### 팀 협업

1. 모든 팀원이 동일한 VS Code 설정 사용
2. 커밋 전 포맷팅 검사 습관화
3. PR 리뷰 시 스타일 이슈 대신 로직에 집중

## 문제 해결

### 포맷팅이 적용되지 않는 경우

1. VS Code에서 Prettier 확장 프로그램 설치 확인
2. 파일이 `.prettierignore`에 포함되어 있는지 확인
3. VS Code 설정에서 기본 포맷터가 Prettier로 설정되어 있는지 확인

### ESLint와 충돌하는 경우

현재 설정에서는 스타일 관련 ESLint 규칙을 제거하여 충돌을 방지했습니다. 추가 충돌이 발생하면 해당 규칙을 ESLint 설정에서 제거하세요.

## 추가 설정

### 특정 파일 타입 제외

`.prettierignore`에 패턴 추가:

```
# 특정 확장자 제외
*.min.js
*.bundle.js

# 특정 디렉토리 제외
legacy/
```

### 프로젝트별 설정 오버라이드

필요시 `.prettierrc` 파일을 수정하여 프로젝트 요구사항에 맞게 조정할 수 있습니다.

## 📚 관련 가이드/Reference

- [dev-workflow-guide.md](../guides/dev-workflow-guide.md) — 개발 워크플로우
- [taskmaster-guide.md](../guides/taskmaster-guide.md) — Task Master Reference
- [overview.md](../rules/overview.md) — 규칙 시스템 개요
- [directory-architecture.md](../architecture/directory-architecture.md) — 전체 아키텍처
