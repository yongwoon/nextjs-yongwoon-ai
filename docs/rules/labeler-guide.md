# GitHub Labeler Guide

GitHub의 자동 라벨링 시스템 설정과 사용법에 대한 가이드입니다.

## 📋 개요

GitHub Labeler는 PR(Pull Request)이 생성되거나 업데이트될 때 변경된 파일이나 브랜치 이름을 기반으로 자동으로 라벨을 붙여주는 도구입니다. 이를 통해 코드 리뷰와 프로젝트 관리를 보다 효율적으로 할 수 있습니다.

## ⚙️ 설정 파일 위치

```
.github/labeler.yml
```

## 🏷️ 라벨링 규칙

### 브랜치 기반 라벨

브랜치 이름 패턴에 따라 자동으로 붙는 라벨입니다.

#### `hotfix` 라벨
```yaml
hotfix:
  - head-branch: ["^hotfix-", "hotfix", "^hotfix/"]
```
- **적용 조건**: 브랜치 이름이 다음 패턴 중 하나와 일치
  - `hotfix-*` (예: `hotfix-critical-bug`)
  - `hotfix`
  - `hotfix/*` (예: `hotfix/payment-error`)

#### `refactor` 라벨
```yaml
refactor:
  - head-branch: ["^refactor-", "refactor", "^refactor/"]
```
- **적용 조건**: 리팩토링 관련 브랜치
  - `refactor-*` (예: `refactor-user-service`)
  - `refactor`
  - `refactor/*` (예: `refactor/auth-module`)

#### `feature` 라벨
```yaml
feature:
  - head-branch: ["^feature-", "feature", "^feature/", "^feat/"]
```
- **적용 조건**: 새로운 기능 개발 브랜치
  - `feature-*` (예: `feature-user-dashboard`)
  - `feature`
  - `feature/*` (예: `feature/payment-integration`)
  - `feat/*` (예: `feat/ai-chat`)

#### `bugfix` 라벨
```yaml
bugfix:
  - head-branch: ["^bugfix-", "bugfix", "^bugfix/", "^fix/"]
```
- **적용 조건**: 버그 수정 브랜치
  - `bugfix-*` (예: `bugfix-login-error`)
  - `bugfix`
  - `bugfix/*` (예: `bugfix/memory-leak`)
  - `fix/*` (예: `fix/validation-issue`)

### 파일 기반 라벨

변경된 파일의 경로나 확장자에 따라 자동으로 붙는 라벨입니다.

#### `documentation` 라벨
```yaml
documentation:
  - changed-files:
      - any-glob-to-any-file:
          - "**/*.md"
          - docs/**
          - README*
          - CHANGELOG*
          - TESTING.md
```
- **적용 조건**: 문서 관련 파일 변경
  - 모든 마크다운 파일 (`.md`)
  - `docs/` 디렉토리 하위 모든 파일
  - README, CHANGELOG 파일
  - TESTING.md 파일

#### `frontend` 라벨
```yaml
frontend:
  - changed-files:
      - any-glob-to-any-file:
          - src/app/**
          - src/components/**
          - src/styles/**
          - "**/*.tsx"
          - "**/*.jsx"
```
- **적용 조건**: 프론트엔드 관련 파일 변경
  - Next.js App Router (`src/app/`)
  - React 컴포넌트 (`src/components/`)
  - 스타일 파일 (`src/styles/`)
  - TypeScript React 파일 (`.tsx`)
  - JavaScript React 파일 (`.jsx`)

#### `backend` 라벨
```yaml
backend:
  - changed-files:
      - any-glob-to-any-file:
          - src/lib/**
          - src/providers/**
          - src/middleware.ts
          - src/utils/**
```
- **적용 조건**: 백엔드 관련 파일 변경
  - 라이브러리 코드 (`src/lib/`)
  - 프로바이더 (`src/providers/`)
  - 미들웨어 (`src/middleware.ts`)
  - 유틸리티 함수 (`src/utils/`)

#### `testing` 라벨
```yaml
testing:
  - changed-files:
      - any-glob-to-any-file:
          - src/test/**
          - "**/*.test.*"
          - "**/*.spec.*"
          - vitest.config.*
          - jest.config.*
          - TESTING.md
          - coverage/**
```
- **적용 조건**: 테스트 관련 파일 변경
  - 테스트 디렉토리 (`src/test/`)
  - 테스트 파일 (`.test.*`, `.spec.*`)
  - 테스트 설정 파일 (`vitest.config.*`, `jest.config.*`)
  - 테스트 문서 (`TESTING.md`)
  - 커버리지 파일 (`coverage/`)

#### `config` 라벨
```yaml
config:
  - changed-files:
      - any-glob-to-any-file:
          - "*.config.*"
          - "*.json"
          - "*.yml"
          - "*.yaml"
          - .github/**
          - Dockerfile*
          - docker-compose*
          - compose.yml
          - .env*
          - .eslintrc*
          - .prettierrc*
          - .gitignore
          - .dockerignore
```
- **적용 조건**: 설정 파일 변경
  - 모든 설정 파일 (`*.config.*`)
  - JSON, YAML 파일
  - GitHub 설정 (`.github/`)
  - Docker 관련 파일
  - 환경 변수 (`.env*`)
  - 린터/포매터 설정
  - ignore 파일들

#### `dependencies` 라벨
```yaml
dependencies:
  - changed-files:
      - any-glob-to-any-file:
          - package.json
          - pnpm-lock.yaml
          - yarn.lock
          - package-lock.json
```
- **적용 조건**: 의존성 관련 파일 변경
  - 패키지 매니저 파일들
  - 락 파일들

#### `scripts` 라벨
```yaml
scripts:
  - changed-files:
      - any-glob-to-any-file:
          - scripts/**
          - "*.sh"
```
- **적용 조건**: 스크립트 파일 변경
  - `scripts/` 디렉토리
  - 셸 스크립트 파일 (`.sh`)

#### `ci-cd` 라벨
```yaml
ci-cd:
  - changed-files:
      - any-glob-to-any-file:
          - .github/workflows/**
          - .github/actions/**
```
- **적용 조건**: CI/CD 관련 파일 변경
  - GitHub Actions 워크플로우
  - GitHub Actions 액션

#### `taskmaster` 라벨
```yaml
taskmaster:
  - changed-files:
      - any-glob-to-any-file:
          - tasks/**
          - .taskmasterconfig
```
- **적용 조건**: Taskmaster 관련 파일 변경
  - 태스크 파일들 (`tasks/`)
  - Taskmaster 설정 파일

#### `ai` 라벨
```yaml
ai:
  - changed-files:
      - any-glob-to-any-file:
          - src/lib/ai/**
          - "**/*ai*"
          - "**/*openai*"
          - "**/*anthropic*"
```
- **적용 조건**: AI 관련 파일 변경
  - AI 라이브러리 (`src/lib/ai/`)
  - AI 관련 파일명을 포함한 파일들

## 🚀 사용법

### 1. 자동 라벨링 활성화

GitHub Actions에서 자동으로 실행되도록 설정하려면 다음 워크플로우를 추가하세요:

```yaml
# .github/workflows/labeler.yml
name: "Pull Request Labeler"
on:
  pull_request_target:

jobs:
  labeler:
    permissions:
      contents: read
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - name: Apply labels based on changed files
        uses: actions/labeler@v5
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

### 2. 브랜치 네이밍 컨벤션

라벨이 자동으로 붙도록 다음 브랜치 네이밍 컨벤션을 따르세요:

- **새 기능**: `feature/user-authentication` 또는 `feat/payment-system`
- **버그 수정**: `fix/login-error` 또는 `bugfix/memory-leak`
- **리팩토링**: `refactor/auth-module` 또는 `refactor-user-service`
- **핫픽스**: `hotfix/critical-security-patch`

### 3. 파일 구조 가이드

파일을 적절한 디렉토리에 배치하여 자동 라벨링을 활용하세요:

```
src/
├── app/              # frontend 라벨
├── components/       # frontend 라벨
├── lib/             # backend 라벨
├── providers/       # backend 라벨
├── utils/           # backend 라벨
├── test/            # testing 라벨
└── styles/          # frontend 라벨

docs/                # documentation 라벨
scripts/             # scripts 라벨
.github/workflows/   # ci-cd 라벨
tasks/              # taskmaster 라벨
```

## 📝 라벨 관리 팁

### 1. 라벨 생성
GitHub 저장소에서 다음 라벨들을 미리 생성해두세요:
- `hotfix` (빨간색 - #d73a49)
- `feature` (초록색 - #28a745)
- `bugfix` (주황색 - #fd7e14)
- `refactor` (파란색 - #007bff)
- `documentation` (회색 - #6c757d)
- `frontend` (보라색 - #6f42c1)
- `backend` (노란색 - #ffc107)
- `testing` (분홍색 - #e83e8c)
- `config` (하늘색 - #17a2b8)
- `dependencies` (진한 회색 - #495057)
- `scripts` (올리브색 - #6c757d)
- `ci-cd` (진한 파란색 - #0056b3)
- `taskmaster` (연두색 - #20c997)
- `ai` (자주색 - #6610f2)

### 2. 수동 라벨 추가
자동 라벨링 외에도 필요에 따라 수동으로 라벨을 추가할 수 있습니다:
- `breaking-change`: 호환성을 깨는 변경사항
- `needs-review`: 리뷰가 필요한 PR
- `work-in-progress`: 작업 중인 PR
- `ready-for-merge`: 머지 준비 완료

## 🔧 커스터마이징

프로젝트에 맞게 라벨링 규칙을 수정하려면 `.github/labeler.yml` 파일을 편집하세요.

### 새로운 라벨 추가 예시

```yaml
mobile:
  - changed-files:
      - any-glob-to-any-file:
          - src/mobile/**
          - "**/*.native.*"

database:
  - changed-files:
      - any-glob-to-any-file:
          - src/database/**
          - "**/*.sql"
          - prisma/**
```

### 파일 패턴 문법

- `**/*`: 모든 하위 디렉토리의 모든 파일
- `*.ext`: 특정 확장자를 가진 파일
- `path/**`: 특정 디렉토리 하위의 모든 파일
- `^pattern`: 브랜치 이름이 pattern으로 시작
- `pattern$`: 브랜치 이름이 pattern으로 끝남

## 🚨 주의사항

1. **권한 설정**: Labeler가 작동하려면 GitHub Actions에 `pull-requests: write` 권한이 필요합니다.

2. **라벨 존재**: 설정한 라벨이 저장소에 미리 생성되어 있어야 합니다.

3. **대소문자 구분**: 파일 패턴은 대소문자를 구분합니다.

4. **성능**: 너무 많은 패턴을 추가하면 라벨링 성능이 저하될 수 있습니다.

## 📚 참고 자료

- [GitHub Actions Labeler](https://github.com/actions/labeler)
- [Glob Pattern Documentation](https://docs.github.com/en/actions/learn-github-actions/expressions#functions)
- [GitHub Labels API](https://docs.github.com/en/rest/issues/labels)