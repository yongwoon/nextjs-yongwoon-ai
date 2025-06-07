> **이 문서는 Cursor 규칙 작성/운영 가이드입니다.**
- 개발 워크플로우는 [dev-workflow-guide.md](./dev-workflow-guide.md)
- Task Master Reference는 [taskmaster-guide.md](./taskmaster-guide.md)
- 규칙 시스템 개요는 [overview.md](../rules/overview.md) 참고

# Cursor Rules 가이드

이 문서는 Cursor IDE에서 사용되는 규칙 파일 작성 표준에 대한 상세한 가이드입니다.

## 📖 개요

Cursor Rules는 AI 어시스턴트가 프로젝트의 코딩 표준과 관습을 이해할 수 있도록 도와주는 구조화된 문서입니다. 이를 통해 일관된 코드 품질과 스타일을 유지할 수 있습니다.

## 🏗️ 규칙 파일 구조

### 필수 구조 형식

```markdown
---
description: 규칙이 무엇을 강제하는지에 대한 명확하고 한 줄짜리 설명
globs: path/to/files/*.ext, other/path/**/*
alwaysApply: boolean
---

- **주요 사항은 굵게 표시**
  - 세부사항과 함께 하위 항목들
  - 예시와 설명들
```

### 메타데이터 필드

- **description**: 규칙의 목적을 한 줄로 명확하게 설명
- **globs**: 규칙이 적용될 파일 패턴들 (`,`로 구분)
- **alwaysApply**: 해당 규칙을 항상 적용할지 여부 (boolean)

## 📁 파일 참조 방법

### 규칙 파일 참조
```markdown
[filename](mdc:path/to/file)
```

**예시:**
- 규칙 참조: `[prisma.mdc](mdc:.cursor/rules/prisma.mdc)`
- 코드 참조: `[schema.prisma](mdc:prisma/schema.prisma)`

### 일반적인 파일 참조 패턴
- **규칙 파일**: `[규칙명.mdc](mdc:.cursor/rules/규칙명.mdc)`
- **소스 코드**: `[파일명](mdc:src/path/to/file)`
- **설정 파일**: `[config.json](mdc:config.json)`

## 💻 코드 예시 작성법

### 좋은 예시와 나쁜 예시 표시

```typescript
// ✅ DO: 좋은 예시를 보여주기
const goodExample = true;

// ❌ DON'T: 안티패턴 보여주기
const badExample = false;
```

### 언어별 코드 블록 사용

```javascript
// JavaScript 예시
const jsExample = "좋은 JavaScript 코드";
```

```typescript
// TypeScript 예시
interface GoodInterface {
  property: string;
}
```

```python
# Python 예시
def good_function():
    return "좋은 Python 코드"
```

## ✍️ 규칙 내용 작성 가이드라인

### 1. 고수준 개요부터 시작
- 규칙의 전체적인 목적과 범위를 먼저 설명
- 왜 이 규칙이 필요한지 배경 설명

### 2. 구체적이고 실행 가능한 요구사항
- 모호함 없이 명확한 지침 제공
- 개발자가 즉시 적용할 수 있는 구체적인 방법 제시

### 3. 올바른 구현 예시 포함
- 실제 코드베이스의 예시 활용
- 이론적 예시보다 실제 구현 코드 선호

### 4. 기존 코드 참조
- 프로젝트 내 실제 구현 사례 링크
- 다른 규칙과의 상호 참조

### 5. DRY 원칙 적용
- 중복을 피하고 다른 규칙을 참조
- 공통 패턴은 별도 규칙으로 분리

## 🔧 규칙 유지보수

### 규칙 업데이트 시기
- **새로운 패턴 등장**: 코드베이스에서 3회 이상 반복되는 패턴
- **코드 리뷰 피드백**: 반복적으로 언급되는 사항들
- **기존 규칙 개선**: 더 나은 예시나 설명 발견 시

### 규칙 추가 과정
1. 새로운 패턴이나 요구사항 식별
2. 실제 코드에서 예시 수집
3. 명확하고 실행 가능한 규칙 작성
4. 관련 규칙들과의 교차 참조 추가

### 규칙 제거 과정
- 더 이상 사용되지 않는 패턴은 deprecated 마킹
- 적용되지 않는 규칙들 제거
- deprecated 규칙에 대한 마이그레이션 경로 문서화

## 🎯 모범 사례

### DO (해야 할 것들)
- ✅ 실제 코드베이스의 예시 사용
- ✅ 명확하고 구체적인 지침 제공
- ✅ 일관된 포맷팅 유지
- ✅ 관련 규칙들 간 상호 참조
- ✅ 정기적인 규칙 업데이트

### DON'T (하지 말아야 할 것들)
- ❌ 모호하거나 해석의 여지가 있는 표현
- ❌ 이론적이기만 한 예시
- ❌ 일관성 없는 포맷팅
- ❌ 중복되는 내용
- ❌ 오래된 정보 방치

## 🔗 관련 문서

- [개발 워크플로우 가이드](./dev-workflow-guide.md)
- [자동 개선 프로세스 가이드](./self-improvement-guide.md)
- [Task Master Reference](./taskmaster-guide.md)
- [overview.md](../rules/overview.md) — 규칙 시스템 개요
- [directory-architecture.md](../architecture/directory-architecture.md) — 전체 아키텍처

---

이 가이드를 따라 일관되고 효과적인 Cursor Rules를 작성하여 개발 팀의 생산성을 향상시킬 수 있습니다.