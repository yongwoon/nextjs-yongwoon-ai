# Task Master Reference

Task Master의 모든 도구/명령어에 대한 상세 Reference 문서입니다.
실제 개발 흐름 및 단계별 가이드는 [개발 워크플로우 가이드](./dev-workflow-guide.md)를 참고하세요.

---

## 1. MCP 도구/CLI 명령어 개요
- MCP vs CLI 차이
- 환경 변수 및 구성 파일 관리

## 2. 명령어/도구별 상세 설명

### 2.1 프로젝트 초기화 (`initialize_project`)
- **목적**: 새 프로젝트를 위한 기본 Task Master 파일 구조와 구성을 설정
- **파라미터/옵션**: projectRoot, projectName, ... (상세 내용 기존 내용에서 발췌)
- **예시**:
  ```bash
  task-master init --name <name> --description <desc> -y
  ```

### 2.2 PRD 파싱 (`parse_prd`)
- **목적**: 제품 요구사항 문서를 파싱하여 초기 작업 세트 자동 생성
- **파라미터/옵션**: input, output, numTasks, ...
- **예시**:
  ```bash
  task-master parse-prd --input=prd.txt --num-tasks=10 -f
  ```

### 2.3 작업 목록 조회 (`get_tasks`)
- **목적**: 작업 목록을 조회하고 상태별로 필터링
- **파라미터/옵션**: status, withSubtasks, ...
- **예시**:
  ```bash
  task-master list -s pending --with-subtasks
  ```

### 2.4 다음 작업 찾기 (`next_task`)
- **목적**: 종속성과 상태를 기반으로 다음에 작업할 수 있는 작업 표시
- **파라미터/옵션**: ...
- **예시**:
  ```bash
  task-master next
  ```

### 2.5 작업 세부 정보 (`get_task`)
- **목적**: 특정 작업 또는 하위 작업의 상세 정보 표시
- **파라미터/옵션**: id, ...
- **예시**:
  ```bash
  task-master show 15.2
  ```

### 2.6 작업 추가/수정/상태변경/삭제 등
- 각 도구별 목적, 파라미터, 예시 (기존 내용에서 발췌)

### 2.7 작업 분해/확장/이동/종속성 관리 등
- 각 도구별 목적, 파라미터, 예시 (기존 내용에서 발췌)

## 3. 환경 변수 및 구성 관리
- .taskmasterconfig, .env, mcp.json 등

## 4. 참고 링크
- [개발 워크플로우 가이드](./dev-workflow-guide.md)
- [자동 개선 프로세스 가이드](./self-improvement-guide.md)