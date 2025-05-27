# Rules 시스템 개요

이 문서는 프로젝트의 `.cursor/rules` 디렉토리에 정의된 규칙들에 대한 종합적인 설명을 제공합니다.

## 📖 목차

1. [Cursor Rules 시스템](#cursor-rules-시스템)
2. [개발 워크플로우](#개발-워크플로우)
3. [Task Master 시스템](#task-master-시스템)
4. [자동 개선 프로세스](#자동-개선-프로세스)

## 🎯 Rules 시스템의 목적

이 규칙 시스템은 다음을 목표로 합니다:

- **일관된 코드 품질 유지**: 모든 개발자가 동일한 표준을 따르도록 함
- **효율적인 개발 프로세스**: Task Master를 통한 체계적인 작업 관리
- **자동화된 품질 개선**: 지속적인 규칙 업데이트 및 개선
- **통합된 개발 환경**: Cursor와 AI 도구들의 최적화된 활용

## 📋 포함된 규칙 파일들

### 1. [cursor_rules.mdc](../cursor/rules/cursor_rules.mdc)
Cursor IDE에서 사용되는 규칙 파일 작성 표준을 정의합니다.

### 2. [dev_workflow.mdc](../cursor/rules/dev_workflow.mdc)
Task Master를 중심으로 한 개발 워크플로우 가이드라인을 제공합니다.

### 3. [taskmaster.mdc](../cursor/rules/taskmaster.mdc)
Task Master 시스템의 모든 도구와 명령어에 대한 상세한 참조 문서입니다.

### 4. [self_improve.mdc](../cursor/rules/self_improve.mdc)
코드베이스 분석을 통한 규칙 자동 개선 프로세스를 설명합니다.

## 🔧 규칙 적용 방법

1. **개발 시작 전**: 해당하는 규칙 문서를 검토
2. **코딩 중**: Cursor에서 자동으로 규칙 적용
3. **코드 리뷰**: 규칙 준수 여부 확인
4. **규칙 업데이트**: 새로운 패턴 발견 시 규칙 개선

## 📚 세부 문서들

각 규칙에 대한 자세한 설명은 다음 문서들을 참조하세요:

- [Cursor Rules 가이드](./cursor-rules-guide.md)
- [개발 워크플로우 가이드](./dev-workflow-guide.md)
- [Task Master 사용법](./taskmaster-guide.md)
- [자동 개선 프로세스 가이드](./self-improvement-guide.md)

## 🚀 시작하기

1. 프로젝트 초기화: Task Master의 `initialize_project` 도구 사용
2. PRD 파싱: `parse_prd` 도구로 초기 작업 생성
3. 개발 시작: `next_task` 도구로 다음 작업 확인
4. 규칙 준수: 각 단계에서 해당 규칙 문서 참조

---

이 규칙 시스템을 통해 더 효율적이고 일관된 개발 환경을 구축할 수 있습니다.