# 개발 워크플로우 가이드

이 문서는 Task Master를 중심으로 한 소프트웨어 개발 프로젝트 관리 워크플로우에 대한 상세한 가이드입니다.

## 📖 개요

Task Master는 체계적인 프로젝트 관리를 위한 AI 기반 작업 관리 시스템입니다. 이 가이드는 효율적인 개발 프로세스를 위한 표준 워크플로우를 제공합니다.

## 🔧 주요 상호작용 방법

### 1. MCP 서버 (권장)
- **통합 개발 환경용**: Cursor와 같은 AI 통합 도구에서 사용
- **구조화된 데이터 교환**: 더 나은 성능과 오류 처리
- **도구 기반 인터페이스**: `get_tasks`, `add_subtask` 등의 MCP 도구 사용
- **재시작 필요 조건**: `scripts/modules`의 핵심 로직이나 MCP 도구 정의 변경 시

### 2. CLI 명령어 (사용자 친화적)
- **직접 터미널 상호작용**: 사용자가 직접 명령어 실행
- **대체 수단**: MCP 서버가 접근 불가능하거나 특정 기능이 노출되지 않을 때
- **전역 설치**: `npm install -g task-master-ai` 또는 `npx task-master-ai` 사용

## 🚀 표준 개발 워크플로우 프로세스

### 1단계: 프로젝트 초기화
```bash
# MCP 도구 사용
initialize_project

# CLI 명령어 사용
task-master init
```

### 2단계: PRD 파싱 (초기 작업 생성)
```bash
# MCP 도구 사용
parse_prd

# CLI 명령어 사용
task-master parse-prd --input='<prd-file.txt>'
```

### 3단계: 현재 작업 상태 확인
```bash
# MCP 도구 사용
get_tasks

# CLI 명령어 사용
task-master list
```

### 4단계: 다음 작업 결정
```bash
# MCP 도구 사용
next_task

# CLI 명령어 사용
task-master next
```

### 5단계: 복잡도 분석
```bash
# MCP 도구 사용
analyze_project_complexity

# CLI 명령어 사용
task-master analyze-complexity --research
```

### 6단계: 복잡도 보고서 검토
```bash
# MCP 도구 사용
complexity_report

# CLI 명령어 사용
task-master complexity-report
```

## 🎯 작업 선택 기준

작업을 선택할 때 다음 기준을 따릅니다:

1. **종속성 완료**: 모든 선행 작업이 'done' 상태
2. **우선순위 레벨**: high > medium > low
3. **ID 순서**: 숫자가 낮은 순서부터

## 📋 작업 세부 정보 확인

### 특정 작업 조회
```bash
# MCP 도구 사용
get_task --id=<task_id>

# CLI 명령어 사용
task-master show <id>
```

### 작업 구조 필드 이해

- **id**: 고유 식별자 (예: `1`, `1.1`)
- **title**: 간략한 설명적 제목
- **description**: 작업 내용의 간결한 요약
- **status**: 현재 상태 (`pending`, `done`, `deferred` 등)
- **dependencies**: 선행 작업 ID들 (상태 표시기 포함)
- **priority**: 중요도 레벨 (`high`, `medium`, `low`)
- **details**: 심층적인 구현 지침
- **testStrategy**: 검증 접근 방법
- **subtasks**: 더 작고 구체적인 하위 작업들

## 🔨 작업 분해 프로세스

### 복잡한 작업 확장
```bash
# MCP 도구 사용
expand_task --id=<task_id> --force --research

# CLI 명령어 사용
task-master expand --id=<id> --force --research
```

### 기존 하위 작업 제거 (필요시)
```bash
# MCP 도구 사용
clear_subtasks --id=<task_id>

# CLI 명령어 사용
task-master clear-subtasks --id=<id>
```

### 모든 작업 일괄 확장
```bash
# MCP 도구 사용
expand_all --force --research

# CLI 명령어 사용
task-master expand --all --force --research
```

## 📝 반복적 하위 작업 구현

### 1단계: 목표 이해 (준비)
- `get_task` / `task-master show <subtaskId>`로 요구사항 파악

### 2단계: 초기 탐색 및 계획 (1차 반복)
- 코드베이스 탐색하여 수정할 파일, 함수, 코드 라인 식별
- 구체적인 코드 변경사항(diff)과 위치 결정
- 탐색 단계에서 얻은 모든 관련 세부사항 수집

### 3단계: 계획 기록
```bash
# MCP 도구 사용
update_subtask --id=<subtaskId> --prompt='<detailed plan>'

# CLI 명령어 사용
task-master update-subtask --id=<subtaskId> --prompt='<detailed plan>'
```

### 4단계: 계획 검증
- `get_task` / `task-master show <subtaskId>`로 계획이 올바르게 기록되었는지 확인

### 5단계: 구현 시작
```bash
# MCP 도구 사용
set_task_status --id=<subtaskId> --status=in-progress

# CLI 명령어 사용
task-master set-status --id=<subtaskId> --status=in-progress
```

### 6단계: 진행 상황 정제 및 기록 (2차+ 반복)
- 구현 중 발견한 내용을 정기적으로 기록
- 성공한 것과 실패한 것을 모두 기록
- 중복을 피하기 위해 기존 세부사항을 간략히 검토

### 7단계: 규칙 검토 및 업데이트 (구현 후)
- 모든 코드 변경사항과 관련 채팅 기록 검토
- 구현 중 확립된 새로운 코드 패턴이나 모범 사례 식별
- 내부 가이드라인에 따라 새 규칙 생성 또는 기존 규칙 업데이트

### 8단계: 작업 완료 표시
```bash
# MCP 도구 사용
set_task_status --id=<subtaskId> --status=done

# CLI 명령어 사용
task-master set-status --id=<subtaskId> --status=done
```

### 9단계: 변경사항 커밋 (Git 사용 시)
```bash
git add .
git commit -m 'feat(module): 하위작업 <subtaskId>에 대한 기능 X 구현

- 변경사항에 대한 세부내용...
- 패턴 Z에 대한 규칙 Y 업데이트'
```

### 10단계: 다음 하위 작업으로 진행
- `next_task` / `task-master next`로 다음 작업 식별

## 🔄 구현 변경사항 처리

### 구현이 계획과 크게 다를 때
```bash
# 여러 미래 작업 업데이트
# MCP 도구 사용
update --from=<futureTaskId> --prompt='<explanation>' --research

# CLI 명령어 사용
task-master update --from=<id> --prompt='<explanation>' --research
```

```bash
# 단일 특정 작업 업데이트
# MCP 도구 사용
update_task --id=<taskId> --prompt='<explanation>' --research

# CLI 명령어 사용
task-master update-task --id=<id> --prompt='<explanation>' --research
```

## 📊 작업 상태 관리

### 상태 유형
- **pending**: 작업 준비 완료
- **in-progress**: 현재 작업 중
- **done**: 완료 및 검증됨
- **review**: 검토 필요
- **deferred**: 연기됨
- **cancelled**: 취소됨

### 상태 변경
```bash
# MCP 도구 사용
set_task_status --id=<task_id> --status=<new_status>

# CLI 명령어 사용
task-master set-status --id=<id> --status=<status>
```

## 🔗 종속성 관리

### 종속성 추가
```bash
# MCP 도구 사용
add_dependency --id=<task_id> --dependsOn=<prerequisite_id>

# CLI 명령어 사용
task-master add-dependency --id=<id> --depends-on=<id>
```

### 종속성 제거
```bash
# MCP 도구 사용
remove_dependency --id=<task_id> --dependsOn=<prerequisite_id>

# CLI 명령어 사용
task-master remove-dependency --id=<id> --depends-on=<id>
```

### 종속성 검증
```bash
# MCP 도구 사용
validate_dependencies

# CLI 명령어 사용
task-master validate-dependencies
```

### 종속성 자동 수정
```bash
# MCP 도구 사용
fix_dependencies

# CLI 명령어 사용
task-master fix-dependencies
```

## 🏗️ 작업 재구성

### 작업 이동
```bash
# MCP 도구 사용
move_task --from=<source_id> --to=<destination_id>

# CLI 명령어 사용
task-master move --from=<id> --to=<id>
```

### 지원되는 이동 시나리오
- 독립 작업을 하위 작업으로 변환
- 하위 작업을 독립 작업으로 변환
- 하위 작업을 다른 부모로 이동
- 같은 부모 내에서 하위 작업 순서 변경
- 존재하지 않는 ID 위치로 작업 이동 (자동으로 플레이스홀더 생성)
- 쉼표로 구분된 여러 작업 동시 이동

## ⚙️ 구성 관리

### 주요 구성 방법

1. **`.taskmasterconfig` 파일 (주요)**
   - 프로젝트 루트에 위치
   - AI 모델 선택, 매개변수, 로깅 레벨 등 저장
   - `task-master models --setup` 명령으로 관리

2. **환경 변수 (`.env` / `mcp.json`)**
   - 민감한 API 키와 특정 엔드포인트 URL만 사용
   - CLI 사용 시 프로젝트 루트의 `.env` 파일
   - MCP/Cursor 통합 시 `.cursor/mcp.json`의 `env` 섹션

### 모델 구성
```bash
# MCP 도구 사용
models --setMain=<model_id>

# CLI 명령어 사용
task-master models --set-main=<model_id>
```

## 🎯 다음 작업 결정

### 자동 작업 식별
```bash
# MCP 도구 사용
next_task

# CLI 명령어 사용
task-master next
```

이 명령은 다음을 제공합니다:
- 모든 종속성이 충족된 작업 식별
- 우선순위, 종속성 수, ID별 작업 우선순위 지정
- 기본 작업 세부사항 및 설명
- 구현 세부사항 및 하위 작업 (있는 경우)
- 상황별 제안 작업

## 🔍 코드 분석 및 리팩토링 기법

### 최상위 함수 검색
모듈 구조 이해나 리팩토링 계획에 유용:

```bash
# 내보낸 함수/상수 찾기
rg "export (async function|function|const) \w+"
```

이는 다음에 도움이 됩니다:
- 파일 간 함수 비교 (마이그레이션 중)
- 잠재적 네이밍 충돌 식별
- 모듈 구조 이해

---

이 워크플로우는 일반적인 가이드라인을 제공합니다. 특정 프로젝트 요구사항과 팀 관습에 따라 적절히 조정하여 사용하세요.