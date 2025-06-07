# Taskmaster AI

## Taskmaster AI란?

Taskmaster AI는 프로젝트의 작업(Task) 관리와 개발 워크플로우 자동화를 지원하는 도구입니다. Taskmaster를 통해 작업을 체계적으로 분해하고, 우선순위와 의존성을 관리하며, AI 기반의 개발 지원을 받을 수 있습니다.

- 전체 개발 흐름과 실전 사용법은 [개발 워크플로우 가이드](../dev-workflow-guide.md)에서 확인하세요.
- Taskmaster의 모든 명령어와 상세 기능은 [Task Master Reference](../taskmaster-guide.md)에서 볼 수 있습니다.

## 시작하기

1. **프로젝트 초기화**
   - 터미널에서 아래 명령어로 Taskmaster를 초기화하세요.

   ```bash
   task-master init
   ```

   - 초기화 시, 커스텀 Cursor 규칙 파일과 Taskmaster 설정 파일이 생성됩니다.

2. **작업 목록 확인**
   - 현재 등록된 작업(Task) 목록을 확인하려면:

   ```bash
   task-master list
   ```

## 주요 명령어

- 작업 목록 보기

  ```bash
  task-master list
  ```

- 다음 작업 추천 받기

  ```bash
  task-master next
  ```

- 특정 작업 상세 보기

  ```bash
  task-master show <id>
  ```

- 작업 추가

  ```bash
  task-master add-task --prompt="설명..."
  ```

- 작업 상태 변경

  ```bash
  task-master set-status --id=<id> --status=done
  ```

- 기타 명령어와 옵션은 [Task Master Reference](../taskmaster-guide.md) 참고

## 셋업 예시

```text
╭───────────────────────────────────╮
│                                   │
│   Initializing your new project   │
│                                   │
╰───────────────────────────────────╯

ℹ️ Required options not provided, proceeding with prompts.
Add shell aliases for task-master? This lets you type "tm" instead of "task-master" (Y/n): y

Task Master Project settings:
Add shell aliases (so you can use "tm" instead of "task-master"): Yes

Do you want to continue with these settings? (Y/n): y
ℹ️ Initializing project in /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai
ℹ️ Created directory: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.cursor/rules
ℹ️ Created directory: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.roo
ℹ️ Created directory: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.roo/rules
ℹ️ Created directory: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.roo/rules-architect
ℹ️ Created directory: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.roo/rules-ask
ℹ️ Created directory: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.roo/rules-boomerang
ℹ️ Created directory: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.roo/rules-code
ℹ️ Created directory: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.roo/rules-debug
ℹ️ Created directory: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.roo/rules-test
ℹ️ Created directory: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/scripts
ℹ️ Created directory: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/tasks
ℹ️ Setting up MCP configuration for Cursor integration...
✅ Created MCP configuration file for Cursor integration
ℹ️ MCP server will use the installed task-master-ai package
⚠️ /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.env.example already exists, skipping.
ℹ️ Created file: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.taskmasterconfig
ℹ️ /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.gitignore already exists, merging content...
✅ Updated /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.gitignore with additional entries
ℹ️ Created file: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.cursor/rules/dev_workflow.mdc
ℹ️ Created file: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.cursor/rules/taskmaster.mdc
ℹ️ Created file: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.cursor/rules/cursor_rules.mdc
ℹ️ Created file: /Users/yongwoon/Desktop/yongwoon/source/private/projects/nextjs-yongwoon-ai/.cursor/rules/self_improve.mdc
ℹ️ Generating Roo rules from Cursor rules...
[INFO] Converting Cursor rule cursor_rules.mdc to Roo rule roo_rules.md
[SUCCESS] Successfully converted cursor_rules.mdc to roo_rules.md
```

## 관련 가이드/참고

- [개발 워크플로우 가이드](../dev-workflow-guide.md)
- [Task Master Reference](../taskmaster-guide.md)
- [디렉토리 아키텍처](../architecture/directory-architecture.md)
- [Cursor 규칙 개요](../guides/cursor-rules-guide.md)
