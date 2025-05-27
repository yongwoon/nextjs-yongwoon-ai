# Task Master 사용법 가이드

이 문서는 Task Master 시스템의 모든 도구와 명령어에 대한 상세한 참조 가이드입니다.

## 📖 개요

Task Master는 AI 기반 프로젝트 관리 시스템으로, MCP 도구와 CLI 명령어 두 가지 방식으로 상호작용할 수 있습니다.

**권장사항**: 통합 도구(Cursor 등)에서는 **MCP 도구**를 사용하고, 직접적인 사용자 상호작용이나 대체 수단으로는 **CLI 명령어**를 사용하세요.

## 🚀 초기화 및 설정

### 1. 프로젝트 초기화 (`initialize_project`)

**목적**: 새 프로젝트를 위한 기본 Task Master 파일 구조와 구성을 설정

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `projectName`: 프로젝트 이름 설정
- `projectDescription`: 프로젝트 간략한 설명
- `projectVersion`: 초기 버전 (예: '0.1.0')
- `authorName`: 작성자 이름
- `skipInstall`: 종속성 설치 건너뛰기 (기본값: false)
- `addAliases`: 셸 별칭 (tm, taskmaster) 추가 (기본값: false)
- `yes`: 프롬프트 건너뛰고 기본값 사용 (기본값: false)

#### CLI 명령어
```bash
task-master init [options]

# 주요 옵션:
--name <name>          # 프로젝트 이름 설정
--description <text>   # 프로젝트 설명
--version <version>    # 초기 버전 설정
-y, --yes             # 기본 설정으로 빠른 초기화
```

**사용법**: 새 프로젝트 시작 시 한 번 실행

**중요**: 완료 후 작업 파일을 생성하려면 PRD를 파싱해야 합니다.

### 2. PRD 파싱 (`parse_prd`)

**목적**: 제품 요구사항 문서를 파싱하여 초기 작업 세트를 자동 생성

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `input`: PRD 파일 경로 (기본값: "scripts/prd.txt")
- `output`: 생성될 tasks.json 파일 경로
- `numTasks`: 생성할 최상위 작업 수 (권장)
- `append`: 기존 파일에 추가 (기본값: false)
- `force`: 기존 파일 덮어쓰기 (기본값: false)
- `research`: 연구 모델 사용 (기본값: false)

#### CLI 명령어
```bash
task-master parse-prd [file] [options]

# 예시:
task-master parse-prd scripts/prd.txt -n 10 -f
task-master parse-prd --input=prd.txt --num-tasks=15 --research
```

**중요**: AI 호출이 포함되어 최대 1분 소요될 수 있습니다.

## ⚙️ AI 모델 구성

### 3. 모델 관리 (`models`)

**목적**: AI 모델 구성 확인 또는 특정 모델 설정

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로)
- `setMain`: 주요 모델 ID 설정
- `setResearch`: 연구 모델 ID 설정
- `setFallback`: 대체 모델 ID 설정
- `ollama`: 설정 모델이 Ollama 모델임을 지정 (boolean)
- `openrouter`: 설정 모델이 OpenRouter 모델임을 지정 (boolean)
- `listAvailableModels`: 사용 가능한 모델 목록 표시 (boolean)

#### CLI 명령어
```bash
task-master models [options]

# 예시:
task-master models                                # 현재 구성 보기
task-master models --set-main claude-3-5-sonnet  # 주요 모델 설정
task-master models --set-research perplexity     # 연구 모델 설정
task-master models --setup                       # 대화형 설정
```

**참고**: 구성은 `.taskmasterconfig` 파일에 저장되며, API 키는 `.env` 파일(CLI) 또는 `mcp.json`(MCP)에 설정해야 합니다.

## 📋 작업 조회 및 확인

### 4. 작업 목록 조회 (`get_tasks`)

**목적**: 작업 목록을 조회하고 상태별로 필터링

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `status`: 특정 상태로 필터링 (예: 'pending', 'done')
- `withSubtasks`: 하위 작업 포함 여부
- `file`: tasks.json 파일 경로 (상대 경로 또는 절대 경로)

#### CLI 명령어
```bash
task-master list [options]

# 예시:
task-master list                    # 모든 작업 보기
task-master list -s pending        # 대기 중인 작업만 보기
task-master list --with-subtasks   # 하위 작업 포함
```

### 5. 다음 작업 찾기 (`next_task`)

**목적**: 종속성과 상태를 기반으로 다음에 작업할 수 있는 작업 표시

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `file`: tasks.json 파일 경로
- `complexityReport`: 복잡도 보고서 파일 경로

#### CLI 명령어
```bash
task-master next [options]

# 예시:
task-master next                    # 다음 작업 찾기
task-master next -f custom-tasks.json  # 특정 파일에서 찾기
```

### 6. 특정 작업 세부 정보 (`get_task`)

**목적**: 특정 작업 또는 하위 작업의 상세 정보 표시

#### MCP 도구 매개변수
- `id`: 작업 ID (예: '15') 또는 하위 작업 ID (예: '15.2') (**필수**)
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로)
- `file`: tasks.json 파일 경로
- `status`: 하위 작업을 상태별로 필터링

#### CLI 명령어
```bash
task-master show [id] [options]

# 예시:
task-master show 15        # 작업 15 보기
task-master show 15.2      # 하위 작업 15.2 보기
task-master show -i 10     # 작업 10 보기
```

## ✏️ 작업 생성 및 수정

### 7. 작업 추가 (`add_task`)

**목적**: 새로운 작업을 AI로 구조화하여 추가

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `prompt`: 새 작업 설명 (**필수**)
- `dependencies`: 선행 작업 ID들 (쉼표로 구분)
- `priority`: 우선순위 ('high', 'medium', 'low')
- `research`: 연구 역할 활성화
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master add-task [options]

# 예시:
task-master add-task -p "JWT를 사용한 사용자 인증 구현"
task-master add-task --prompt="API 엔드포인트 생성" --priority=high --research
```

**중요**: AI 호출이 포함되어 최대 1분 소요될 수 있습니다.

### 8. 하위 작업 추가 (`add_subtask`)

**목적**: 기존 작업에 새 하위 작업 추가 또는 기존 작업을 하위 작업으로 변환

#### MCP 도구 매개변수
- `id`: 부모 작업 ID (**필수**)
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `taskId`: 기존 작업을 하위 작업으로 변환할 때 사용
- `title`: 새 하위 작업 제목 (taskId 미사용 시 **필수**)
- `description`: 하위 작업 설명
- `details`: 구현 세부사항
- `dependencies`: 종속성 ID들
- `status`: 초기 상태 (기본값: 'pending')
- `skipGenerate`: 마크다운 파일 재생성 건너뛰기

#### CLI 명령어
```bash
task-master add-subtask [options]

# 예시:
task-master add-subtask -p 15 -t "데이터베이스 스키마 설계"
task-master add-subtask --parent=10 --task-id=5  # 작업 5를 작업 10의 하위로
```

### 9. 작업 업데이트 (`update`)

**목적**: 새로운 컨텍스트나 변경사항을 기반으로 여러 향후 작업 업데이트

#### MCP 도구 매개변수
- `from`: 업데이트 시작할 작업 ID (**필수**)
- `prompt`: 변경사항이나 새 컨텍스트 설명 (**필수**)
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로)
- `research`: 연구 역할 사용
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master update [options]

# 예시:
task-master update --from=18 --prompt="Redux 대신 React Query 사용으로 변경"
task-master update --from=5 --prompt="데이터베이스를 MySQL에서 PostgreSQL로 변경" --research
```

**중요**: AI 호출이 포함되어 최대 1분 소요될 수 있습니다.

### 10. 특정 작업 업데이트 (`update_task`)

**목적**: 특정 작업을 새 정보나 컨텍스트로 수정

#### MCP 도구 매개변수
- `id`: 업데이트할 작업 ID (**필수**)
- `prompt`: 새 정보나 변경사항 설명 (**필수**)
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `research`: 연구 역할 사용
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master update-task [options]

# 예시:
task-master update-task --id=15 --prompt="MySQL 대신 PostgreSQL 사용"
task-master update-task -i 8 -p "보안 요구사항 추가" --research
```

**중요**: AI 호출이 포함되어 최대 1분 소요될 수 있습니다.

### 11. 하위 작업 업데이트 (`update_subtask`)

**목적**: 기존 내용을 덮어쓰지 않고 특정 하위 작업에 타임스탬프된 정보 추가

#### MCP 도구 매개변수
- `id`: 하위 작업 ID (예: '15.2') (**필수**)
- `prompt`: 추가할 정보나 노트 (**필수**)
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `research`: 연구 역할 사용
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master update-subtask [options]

# 예시:
task-master update-subtask --id=15.2 --prompt="API가 헤더 X를 요구함을 발견"
task-master update-subtask -i 8.1 -p "구현 중 발견한 이슈들..." --research
```

**사용법**: 개발 중 구현 노트, 코드 스니펫, 명확화 사항을 추가할 때 사용

**중요**: AI 호출이 포함되어 최대 1분 소요될 수 있습니다.

### 12. 작업 상태 설정 (`set_task_status`)

**목적**: 하나 이상의 작업 또는 하위 작업 상태 업데이트

#### MCP 도구 매개변수
- `id`: 작업/하위 작업 ID(들) (**필수**)
- `status`: 새 상태 (**필수**: 'pending', 'done', 'in-progress', 'review', 'deferred', 'cancelled')
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master set-status [options]

# 예시:
task-master set-status -i 15 -s done        # 작업 15 완료로 표시
task-master set-status --id=15.2 --status=in-progress  # 하위 작업 진행 중으로
task-master set-status -i "16,17.1" -s done # 여러 작업 동시 업데이트
```

### 13. 작업 제거 (`remove_task`)

**목적**: 작업이나 하위 작업을 목록에서 영구 제거

#### MCP 도구 매개변수
- `id`: 제거할 작업/하위 작업 ID (**필수**)
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `confirm`: 확인 프롬프트 건너뛰기 (기본값: false)
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master remove-task [options]

# 예시:
task-master remove-task -i 5      # 작업 5 제거
task-master remove-task --id=5.2 -y  # 하위 작업 5.2 확인 없이 제거
```

**주의**: 실행 취소할 수 없는 작업입니다. 대신 'cancelled'이나 'deferred' 상태 사용을 고려하세요.

## 🔨 작업 구조 및 분해

### 14. 작업 확장 (`expand_task`)

**목적**: AI를 사용하여 복잡한 작업을 관리 가능한 하위 작업들로 분해

#### MCP 도구 매개변수
- `id`: 확장할 작업 ID (**필수**)
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `num`: 생성할 하위 작업 수 (선택사항)
- `research`: 연구 역할 사용
- `prompt`: 하위 작업 생성을 위한 추가 컨텍스트
- `force`: 기존 하위 작업 제거 후 새로 생성 (기본값: false)
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master expand [options]

# 예시:
task-master expand -i 15          # 작업 15 확장
task-master expand --id=10 --force --research  # 강제로 재확장, 연구 사용
task-master expand -i 8 -n 5      # 5개 하위 작업으로 확장
```

**중요**: AI 호출이 포함되어 최대 1분 소요될 수 있습니다.

### 15. 모든 작업 확장 (`expand_all`)

**목적**: 적격한 모든 대기/진행 중 작업을 복잡도 분석이나 기본값에 따라 자동 확장

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로)
- `num`: 작업별 하위 작업 수 (선택사항)
- `research`: 연구 역할 사용
- `prompt`: 확장을 위한 일반적인 컨텍스트
- `force`: 기존 하위 작업 제거 후 새로 생성 (기본값: false)
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master expand --all [options]

# 예시:
task-master expand --all          # 모든 적격 작업 확장
task-master expand --all --force --research  # 강제 재확장, 연구 사용
```

**중요**: AI 호출이 포함되어 최대 1분 소요될 수 있습니다.

### 16. 하위 작업 제거 (`clear_subtasks`)

**목적**: 지정된 부모 작업들에서 모든 하위 작업 제거

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `id`: 하위 작업을 제거할 부모 작업 ID(들) (`all` 미사용 시 **필수**)
- `all`: 모든 부모 작업에서 하위 작업 제거
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master clear-subtasks [options]

# 예시:
task-master clear-subtasks -i 15     # 작업 15의 하위 작업들 제거
task-master clear-subtasks --id="16,18"  # 여러 작업의 하위 작업들 제거
task-master clear-subtasks --all     # 모든 하위 작업 제거
```

### 17. 하위 작업 제거 (`remove_subtask`)

**목적**: 부모에서 하위 작업 제거, 선택적으로 독립 작업으로 변환

#### MCP 도구 매개변수
- `id`: 제거할 하위 작업 ID (예: '15.2') (**필수**)
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `convert`: 삭제 대신 독립 작업으로 변환
- `skipGenerate`: 마크다운 파일 재생성 건너뛰기
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master remove-subtask [options]

# 예시:
task-master remove-subtask -i 15.2           # 하위 작업 15.2 제거
task-master remove-subtask --id=15.2 -c     # 하위 작업을 독립 작업으로 변환
```

### 18. 작업 이동 (`move_task`)

**목적**: 작업 계층 구조 내에서 작업이나 하위 작업을 새 위치로 이동

#### MCP 도구 매개변수
- `from`: 이동할 작업/하위 작업 ID (**필수**)
- `to`: 목적지 ID (**필수**)
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로)
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master move [options]

# 예시:
task-master move --from=5.2 --to=7.3    # 하위 작업 5.2를 7.3으로 이동
task-master move --from=5 --to=7        # 작업 5를 작업 7의 하위로 이동
task-master move --from="10,11,12" --to="16,17,18"  # 여러 작업 동시 이동
```

**지원 시나리오**:
- 독립 작업을 하위 작업으로 변환
- 하위 작업을 독립 작업으로 변환
- 하위 작업을 다른 부모로 이동
- 같은 부모 내 하위 작업 순서 변경
- 존재하지 않는 ID로 이동 (플레이스홀더 자동 생성)

## 🔗 종속성 관리

### 19. 종속성 추가 (`add_dependency`)

**목적**: 작업 간 종속성 관계 정의

#### MCP 도구 매개변수
- `id`: 종속성을 가질 작업 ID (**필수**)
- `dependsOn`: 선행 작업 ID (**필수**)
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master add-dependency [options]

# 예시:
task-master add-dependency -i 15 -d 12    # 작업 15가 작업 12에 종속
task-master add-dependency --id=20 --depends-on=18
```

### 20. 종속성 제거 (`remove_dependency`)

**목적**: 두 작업 간 종속성 관계 제거

#### MCP 도구 매개변수
- `id`: 종속성을 제거할 작업 ID (**필수**)
- `dependsOn`: 더 이상 선행 작업이 아닐 ID (**필수**)
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master remove-dependency [options]

# 예시:
task-master remove-dependency -i 15 -d 12
task-master remove-dependency --id=20 --depends-on=18
```

### 21. 종속성 검증 (`validate_dependencies`)

**목적**: 순환 참조나 존재하지 않는 작업 링크 등 종속성 문제 확인

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master validate-dependencies [options]

# 예시:
task-master validate-dependencies
task-master validate-dependencies -f custom-tasks.json
```

### 22. 종속성 자동 수정 (`fix_dependencies`)

**목적**: 종속성 오류를 자동으로 수정

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master fix-dependencies [options]

# 예시:
task-master fix-dependencies
task-master fix-dependencies -f custom-tasks.json
```

## 📊 분석 및 보고

### 23. 프로젝트 복잡도 분석 (`analyze_project_complexity`)

**목적**: 작업들의 복잡도를 분석하고 추가 분해가 필요한 작업 제안

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `output`: 복잡도 분석 보고서 저장 경로 (기본값: 'scripts/task-complexity-report.json')
- `threshold`: 확장 권장을 위한 최소 복잡도 점수 (1-10)
- `research`: 연구 역할 사용
- `file`: tasks.json 파일 경로
- `from`: 분석할 범위의 시작 작업 ID
- `to`: 분석할 범위의 끝 작업 ID
- `ids`: 분석할 특정 작업 ID들 (쉼표로 구분)

#### CLI 명령어
```bash
task-master analyze-complexity [options]

# 예시:
task-master analyze-complexity                    # 모든 작업 분석
task-master analyze-complexity --research         # 연구 모델 사용
task-master analyze-complexity --threshold=7      # 임계값 7 이상 작업 식별
task-master analyze-complexity --ids="1,3,5"     # 특정 작업들만 분석
```

**중요**: AI 호출이 포함되어 최대 1분 소요될 수 있습니다.

### 24. 복잡도 보고서 보기 (`complexity_report`)

**목적**: 작업 복잡도 분석 보고서를 읽기 쉬운 형식으로 표시

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `file`: 복잡도 보고서 경로 (기본값: 'scripts/task-complexity-report.json')

#### CLI 명령어
```bash
task-master complexity-report [options]

# 예시:
task-master complexity-report
task-master complexity-report -f custom-report.json
```

## 📁 파일 관리

### 25. 작업 파일 생성 (`generate`)

**목적**: tasks.json을 기반으로 각 작업에 대한 개별 마크다운 파일 생성/업데이트

#### MCP 도구 매개변수
- `projectRoot`: 프로젝트 루트 디렉토리 (절대 경로, **필수**)
- `output`: 작업 파일들을 저장할 디렉토리 (기본값: tasks 디렉토리)
- `file`: tasks.json 파일 경로

#### CLI 명령어
```bash
task-master generate [options]

# 예시:
task-master generate                    # 기본 위치에 생성
task-master generate -o ./my-tasks     # 특정 디렉토리에 생성
```

**사용법**: tasks.json 변경 후 개별 작업 파일들을 최신 상태로 유지하기 위해 실행

## ⚙️ 환경 변수 구성

Task Master는 주로 **`.taskmasterconfig`** 파일(프로젝트 루트)을 사용하여 구성을 관리하며, `task-master models --setup`으로 관리됩니다.

환경 변수는 **민감한 API 키와 특정 엔드포인트 URL에만** 사용됩니다:

### API 키 (해당 제공업체 사용 시 필수)
- `ANTHROPIC_API_KEY`
- `PERPLEXITY_API_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_API_KEY`
- `MISTRAL_API_KEY`
- `AZURE_OPENAI_API_KEY` (`AZURE_OPENAI_ENDPOINT`도 필요)
- `OPENROUTER_API_KEY`
- `XAI_API_KEY`
- `OLLAMA_API_KEY` (`OLLAMA_BASE_URL`도 필요)

### 엔드포인트 (선택사항/제공업체별)
- `AZURE_OPENAI_ENDPOINT`
- `OLLAMA_BASE_URL` (기본값: `http://localhost:11434/api`)

**API 키 설정 위치**:
- **CLI 사용**: 프로젝트 루트의 **`.env`** 파일
- **MCP/Cursor 통합**: **`.cursor/mcp.json`** 파일의 `env` 섹션

## 🚨 중요 참고사항

1. **AI 처리 시간**: AI가 포함된 도구들(`parse_prd`, `analyze_project_complexity`, `update_subtask`, `update_task`, `update`, `expand_all`, `expand_task`, `add_task`)은 최대 1분 소요될 수 있습니다.

2. **MCP 서버 재시작**: `scripts/modules`의 핵심 로직이나 MCP 도구 정의가 변경되면 MCP 서버를 재시작해야 합니다.

3. **구성 파일 주의**: `.taskmasterconfig` 파일을 수동으로 편집하지 마세요. `task-master models` 명령이나 `models` MCP 도구를 사용하세요.

4. **API 키 요구사항**:
   - MCP에서 AI 명령이 실패하면 `.cursor/mcp.json`의 `env` 섹션에 선택된 제공업체의 API 키가 있는지 확인
   - CLI에서 AI 명령이 실패하면 프로젝트 루트의 `.env` 파일에 API 키가 있는지 확인

## 🔗 관련 문서

- [개발 워크플로우 가이드](./dev-workflow-guide.md)
- [Cursor Rules 가이드](./cursor-rules-guide.md)
- [자동 개선 프로세스 가이드](./self-improvement-guide.md)

---

이 가이드를 통해 Task Master의 모든 기능을 효과적으로 활용하여 프로젝트 관리 효율성을 크게 향상시킬 수 있습니다.