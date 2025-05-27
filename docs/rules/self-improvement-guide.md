# 자동 개선 프로세스 가이드

이 문서는 코드베이스 분석을 통한 규칙 자동 개선 프로세스에 대한 상세한 가이드입니다.

## 📖 개요

자동 개선 시스템은 지속적으로 코드베이스를 분석하여 새로운 패턴을 식별하고, 기존 규칙을 개선하며, 일관성 있는 개발 표준을 유지하는 시스템입니다.

## 🎯 규칙 개선 트리거

### 새로운 패턴 감지 시점
- **코드 패턴 반복**: 기존 규칙에 포함되지 않은 새로운 코드 패턴 발견
- **유사한 구현**: 여러 파일에서 반복되는 비슷한 구현 방식
- **공통 오류 패턴**: 예방 가능한 일반적인 오류 패턴 식별
- **새 라이브러리/도구**: 일관되게 사용되는 새로운 라이브러리나 도구
- **모범 사례 출현**: 코드베이스에서 나타나는 새로운 모범 사례

## 🔍 분석 프로세스

### 1. 새 코드와 기존 규칙 비교
```typescript
// 새로운 코드 패턴 예시
const data = await prisma.user.findMany({
  select: { id: true, email: true },
  where: { status: 'ACTIVE' }
});
```

### 2. 표준화가 필요한 패턴 식별
- API 호출 패턴
- 에러 처리 방식
- 데이터 검증 로직
- 컴포넌트 구조
- 테스트 패턴

### 3. 외부 문서 참조 확인
- 공식 문서 링크 유효성
- 버전별 변경사항 추적
- 새로운 권장사항 적용

### 4. 일관된 에러 처리 패턴 모니터링
```typescript
// 표준화할 에러 처리 패턴
try {
  const result = await apiCall();
  return { success: true, data: result };
} catch (error) {
  logger.error('API call failed', { error });
  return { success: false, error: error.message };
}
```

### 5. 테스트 패턴 및 커버리지 검토
- 단위 테스트 구조
- 통합 테스트 패턴
- 모킹 전략
- 테스트 데이터 관리

## 📝 규칙 업데이트 기준

### 새 규칙 추가 시점
- **3회 이상 사용**: 새로운 기술/패턴이 3개 이상의 파일에서 사용될 때
- **버그 방지**: 공통 버그를 예방할 수 있는 규칙이 필요할 때
- **코드 리뷰 피드백**: 코드 리뷰에서 반복적으로 언급되는 사항
- **보안/성능 패턴**: 새로운 보안이나 성능 패턴이 등장할 때

### 기존 규칙 수정 시점
- **더 나은 예시**: 코드베이스에 더 좋은 예시가 존재할 때
- **추가 엣지 케이스**: 새로운 엣지 케이스가 발견될 때
- **관련 규칙 업데이트**: 연관된 규칙들이 업데이트될 때
- **구현 세부사항 변경**: 구현 방식이 변경될 때

## 🔄 패턴 인식 예시

### Prisma 사용 패턴
```typescript
// 반복되는 패턴을 발견하면:
const data = await prisma.user.findMany({
  select: { id: true, email: true },
  where: { status: 'ACTIVE' }
});

// prisma.mdc 규칙에 추가 고려사항:
// - 표준 select 필드
// - 공통 where 조건
// - 성능 최적화 패턴
```

### API 응답 패턴
```typescript
// 일관된 API 응답 구조
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### 컴포넌트 패턴
```typescript
// React 컴포넌트 구조
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  // 기타 props...
}

export const Component: React.FC<ComponentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("base-styles", className)} {...props}>
      {children}
    </div>
  );
};
```

## ✅ 규칙 품질 검사

### 규칙의 품질 기준
- **실행 가능성**: 명확하고 실행 가능한 지침
- **구체성**: 모호하지 않은 구체적인 내용
- **현실성**: 실제 코드에서 가져온 예시 사용
- **최신성**: 최신 정보와 참조 유지
- **일관성**: 패턴의 일관된 적용

### 규칙 검증 체크리스트
```markdown
- [ ] 실제 코드베이스의 예시를 포함하는가?
- [ ] 명확하고 구체적인 지침을 제공하는가?
- [ ] 관련 외부 문서 링크가 유효한가?
- [ ] 다른 규칙과 일관성을 유지하는가?
- [ ] 최신 개발 관습을 반영하는가?
```

## 🔄 지속적 개선 프로세스

### 1. 코드 리뷰 댓글 모니터링
```bash
# Git 로그에서 반복되는 코드 리뷰 패턴 찾기
git log --grep="fix:" --oneline | head -20
git log --grep="refactor:" --oneline | head -20
```

### 2. 일반적인 개발 질문 추적
- 팀 내 반복되는 질문 유형
- 새로운 개발자 온보딩 시 자주 나오는 질문
- 문서화가 부족한 영역

### 3. 주요 리팩토링 후 규칙 업데이트
```typescript
// 리팩토링 전
function processData(data: any) {
  // 구식 처리 방식
}

// 리팩토링 후 - 새로운 표준 패턴
function processData<T>(data: T): ProcessedData<T> {
  // 새로운 타입 안전한 처리 방식
}
```

### 4. 외부 문서 링크 유지
- API 문서 버전 확인
- 라이브러리 업데이트 추적
- 권장 사항 변경사항 모니터링

### 5. 관련 규칙 간 상호 참조
```markdown
// 규칙 파일에서 다른 규칙 참조
이 패턴은 [api-patterns.mdc](mdc:.cursor/rules/api-patterns.mdc)와 연관됩니다.
자세한 타입 정의는 [typescript.mdc](mdc:.cursor/rules/typescript.mdc)를 참조하세요.
```

## 🗑️ 규칙 폐기 프로세스

### 폐기 대상 규칙 식별
- **더 이상 사용되지 않는 패턴**: 코드베이스에서 제거된 패턴
- **적용되지 않는 규칙**: 더 이상 관련 없는 기술이나 접근법
- **중복되는 내용**: 다른 규칙과 중복되는 내용

### 폐기 프로세스
1. **Deprecated 마킹**: 즉시 제거하지 않고 deprecated 표시
```markdown
⚠️ **DEPRECATED**: 이 패턴은 더 이상 권장되지 않습니다.
새로운 접근법은 [new-pattern.mdc](mdc:.cursor/rules/new-pattern.mdc)를 참조하세요.
```

2. **마이그레이션 경로 문서화**: 기존 코드를 새 패턴으로 변경하는 방법 제공
```markdown
### 마이그레이션 가이드
```typescript
// 이전 방식 (deprecated)
const oldWay = () => { /* ... */ };

// 새로운 방식 (권장)
const newWay = () => { /* ... */ };
```

3. **단계적 제거**: 충분한 기간 후 완전 제거

## 📈 개선 효과 측정

### 측정 지표
- **코드 리뷰 시간 단축**: 표준화된 패턴 사용으로 리뷰 시간 감소
- **버그 발생률 감소**: 예방 규칙 적용으로 버그 감소
- **개발자 온보딩 시간**: 새로운 개발자 적응 시간 단축
- **코드 일관성 향상**: 코드베이스 전반의 일관성 개선

### 피드백 수집
```markdown
개발자 피드백 수집 방법:
- 정기적인 규칙 효용성 설문
- 코드 리뷰 중 규칙 관련 댓글 분석
- 새로운 패턴 제안 수집
- 규칙 적용의 어려움 파악
```

## 🔗 관련 도구 및 자동화

### 코드 분석 도구
```bash
# ESLint 규칙 위반 패턴 분석
npx eslint . --format=json > eslint-report.json

# TypeScript 컴파일러 경고 패턴 분석
npx tsc --noEmit --listFiles > typescript-check.log

# 코드 복잡도 분석
npx ts-node scripts/analyze-complexity.ts
```

### 자동화 스크립트
```typescript
// 새로운 패턴 감지를 위한 스크립트 예시
interface PatternAnalysis {
  pattern: string;
  occurrences: number;
  files: string[];
  needsRule: boolean;
}

function analyzeCodePatterns(): PatternAnalysis[] {
  // 코드 패턴 분석 로직
}
```

## 🎯 모범 사례

### DO (해야 할 것들)
- ✅ 실제 코드에서 패턴을 관찰하고 규칙 생성
- ✅ 팀 피드백을 정기적으로 수집하고 반영
- ✅ 점진적이고 지속적인 개선 추진
- ✅ 규칙의 효과를 측정하고 평가
- ✅ 새로운 기술과 트렌드를 적극적으로 학습

### DON'T (하지 말아야 할 것들)
- ❌ 이론적이거나 사용되지 않는 패턴으로 규칙 생성
- ❌ 한 번에 너무 많은 규칙을 변경
- ❌ 팀의 피드백 없이 일방적으로 규칙 변경
- ❌ 폐기된 패턴을 그대로 방치
- ❌ 규칙의 실제 적용 여부를 확인하지 않음

## 🔗 관련 문서

- [Cursor Rules 가이드](./cursor-rules-guide.md)
- [개발 워크플로우 가이드](./dev-workflow-guide.md)
- [Task Master 사용법](./taskmaster-guide.md)

---

이 자동 개선 프로세스를 통해 코드베이스의 품질과 일관성을 지속적으로 향상시키고, 개발 팀의 생산성을 크게 높일 수 있습니다.