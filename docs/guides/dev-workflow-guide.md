# 개발 워크플로우 가이드

이 문서는 Task Master를 활용한 실제 소프트웨어 개발의 표준 워크플로우를 안내합니다.
Task Master의 명령어/도구별 상세 설명은 [Task Master Reference](./taskmaster-reference.md)를 참고하세요.

---

## 1. 개요 및 준비

- **Task Master란?**: AI 기반 작업/프로젝트 관리 시스템
- **프로젝트 초기화**: Reference의 [`initialize_project`](./taskmaster-reference.md#프로젝트-초기화-initialize_project) 참고
- **PRD 작성 및 파싱**: Reference의 [`parse_prd`](./taskmaster-reference.md#prd-파싱-parse_prd) 참고

## 2. 표준 개발 흐름

1. **프로젝트 초기화**
2. **PRD 파싱 및 작업 생성**
3. **작업 목록 확인 및 우선순위 선정**
4. **복잡도 분석 및 작업 분해**
5. **하위 작업 단위로 반복적 개발**
   - 목표 이해 및 세부 요구사항 파악
   - 코드베이스 탐색 및 구현 계획 수립
   - 계획 기록 ([update_subtask](./taskmaster-reference.md#하위-작업-업데이트-update_subtask))
   - 구현 및 진행상황 기록
   - 완료 처리 및 커밋
6. **구현 변경사항 반영**
   - 여러 작업/단일 작업 업데이트 ([update](./taskmaster-reference.md#작업-업데이트-update), [update_task](./taskmaster-reference.md#특정-작업-업데이트-update_task))
7. **작업/하위작업 이동, 종속성 관리 등**

## 3. 실전 팁 & 모범 사례

- 작업/하위작업 관리 전략
- 커밋 메시지 작성법
- 규칙/가이드라인 업데이트 방법

## 4. 자주 묻는 질문(FAQ)

- 실무에서 자주 겪는 문제와 해결법

## 5. 참고 자료

- [Task Master Reference](./taskmaster-reference.md)
- [자동 개선 프로세스 가이드](./self-improvement-guide.md)
