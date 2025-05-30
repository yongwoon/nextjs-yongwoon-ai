# Documentation

이 디렉토리는 Yongwoon AI 프로젝트의 모든 문서를 체계적으로 구성합니다.

## 📂 구조

```
docs/
├── setup/                    # 설정 및 시작 가이드
├── architecture/             # 아키텍처 문서
├── rules/                    # Rules 시스템 문서
├── project/                  # 프로젝트 관리
└── upgrade-history/          # 업그레이드 히스토리
```

## 📋 카테고리별 문서

### 🚀 Setup (설정)
프로젝트를 시작하고 개발 환경을 구성하는데 필요한 모든 가이드입니다.

- **[getting-started.md](setup/getting-started.md)** - 프로젝트 시작 가이드
- **[environment-setup.md](setup/environment-setup.md)** - 환경 변수 설정 및 개발 환경 구성
- **[docker-setup.md](setup/docker-setup.md)** - Docker를 사용한 개발 환경 설정
- **[database-schema.sql](setup/database-schema.sql)** - 데이터베이스 스키마 정의
- **[table-design-specification.md](setup/table-design-specification.md)** - 데이터베이스 테이블 설계서

### 🏗️ Architecture (아키텍처)
시스템의 전체적인 구조와 설계에 대한 문서입니다.

- **[directory-architecture.md](architecture/directory-architecture.md)** - 프로젝트 디렉토리 구조 및 패턴
- **[ai-service-architecture.md](architecture/ai-service-architecture.md)** - AI 서비스 아키텍처 및 통합

### 📏 Rules (규칙 시스템)
개발 품질과 일관성을 위한 규칙 시스템에 대한 문서입니다.

- **[overview.md](rules/overview.md)** - Rules 시스템 전체 개요
- **[cursor-rules-guide.md](rules/cursor-rules-guide.md)** - Cursor IDE 규칙 작성 가이드
- **[dev-workflow-guide.md](rules/dev-workflow-guide.md)** - Task Master 중심 개발 워크플로우
- **[taskmaster-guide.md](rules/taskmaster-guide.md)** - Task Master 도구 및 명령어 참조
- **[self-improvement-guide.md](rules/self-improvement-guide.md)** - 규칙 자동 개선 프로세스

### 📊 Project (프로젝트 관리)
프로젝트 계획, 진행 상황 및 도구에 대한 문서입니다.

- **[implementation-roadmap.md](project/implementation-roadmap.md)** - 구현 로드맵 및 마일스톤
- **[installed-packages.md](project/installed-packages.md)** - 설치된 패키지 목록 및 설명
- **[taskmaster-ai.md](project/taskmaster-ai.md)** - Task Master AI 도구 설명
- **[superplate.md](project/superplate.md)** - Superplate 설정 정보

### 📚 Upgrade History (업그레이드 히스토리)
주요 라이브러리 및 도구 업그레이드 기록입니다.

- **[pnpm-migration.md](upgrade-history/pnpm-migration.md)** - PNPM 마이그레이션 과정
- **[prettier-setup.md](upgrade-history/prettier-setup.md)** - Prettier 설정 과정
- **[tailwind-v4-upgrade.md](upgrade-history/tailwind-v4-upgrade.md)** - Tailwind CSS v4 업그레이드
- **[eslint-v9-migration.md](upgrade-history/eslint-v9-migration.md)** - ESLint v9 마이그레이션
- **[eslint-configuration.md](upgrade-history/eslint-configuration.md)** - ESLint 구성 설정

## 🎯 문서 사용 가이드

### 새로운 개발자를 위한 권장 순서

1. **설정 시작**: `setup/getting-started.md`부터 시작
2. **환경 구성**: `setup/environment-setup.md`로 개발 환경 설정
3. **아키텍처 이해**: `architecture/` 폴더의 문서들로 시스템 구조 파악
4. **Rules 시스템 학습**: `rules/overview.md`부터 시작하여 개발 프로세스 이해
5. **프로젝트 현황 파악**: `project/implementation-roadmap.md`로 진행 상황 확인

### 기존 개발자를 위한 참조

- **새로운 기능 개발**: `rules/dev-workflow-guide.md` 참조
- **코드 품질 관리**: `rules/cursor-rules-guide.md` 참조
- **작업 관리**: `rules/taskmaster-guide.md` 참조
- **업그레이드 정보**: `upgrade-history/` 폴더 내 관련 문서 참조

## 🔧 문서 기여 가이드

1. **새 문서 추가**: 적절한 카테고리 폴더에 추가
2. **링크 업데이트**: 관련 문서들의 상호 참조 링크 업데이트
3. **파일명 규칙**: 소문자와 하이픈(-) 사용 (예: `my-new-guide.md`)
4. **README 업데이트**: 새 문서 추가 시 해당 카테고리의 설명 업데이트

---

**참고**: 모든 문서는 프로젝트의 일관성과 품질 향상을 목표로 작성되었습니다. 궁금한 점이 있다면 `rules/overview.md`부터 시작하는 것을 권장합니다.