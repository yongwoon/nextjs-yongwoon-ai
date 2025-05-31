# 프로젝트 구조 및 아키텍처

> 🏗️ **Next.js AI 플랫폼의 전체 구조와 설계 원칙**

이 문서는 프로젝트의 디렉토리 구조, 아키텍처 패턴, 레이어 설계를 설명합니다. 구현 상세는 각 도메인별 문서를 참조하세요.

- **AI 기능 구현**: [`AI_SERVICE_ARCHITECTURE.md`](./AI_SERVICE_ARCHITECTURE.md)
- **개발 시작하기**: [`GETTING_STARTED.md`](./GETTING_STARTED.md)
- **구현 계획**: [`IMPLEMENTATION_ROADMAP.md`](./IMPLEMENTATION_ROADMAP.md)

## 🎯 핵심 설계 원칙

### 1. Domain-Driven Design (DDD)
- **도메인 분리**: 각 비즈니스 영역이 독립적인 구조를 가짐
- **경계 컨텍스트**: 서로 다른 비즈니스 영역 간의 명확한 경계
- **유비쿼터스 언어**: 코드와 비즈니스 요구사항 전반의 일관된 용어

### 2. Clean Architecture
- **의존성 역전**: 상위 레벨이 하위 레벨에 의존하지 않음
- **레이어 격리**: 각 레이어는 단일 책임과 명확한 인터페이스
- **프레임워크 독립성**: 비즈니스 로직이 UI 프레임워크에 독립적

### 3. Event-Driven Architecture
- **느슨한 결합**: 컴포넌트들이 이벤트를 통해 통신
- **확장성**: 기존 코드 수정 없이 새로운 기능 추가 가능
- **감사 가능성**: 모든 비즈니스 이벤트가 추적되고 재생 가능

## 📁 전체 디렉토리 구조

```
nextjs-yongwoon-ai/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   └── signup/
│   │   ├── (dashboard)/               # 메인 대시보드
│   │   │   ├── chat/
│   │   │   ├── documents/
│   │   │   ├── templates/
│   │   │   └── settings/
│   │   ├── api/                       # API 라우트
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── documents/
│   │   │   ├── templates/
│   │   │   └── webhooks/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── domains/                       # 도메인 레이어 (DDD)
│   │   ├── auth/                      # 인증 도메인
│   │   ├── chat/                      # AI 채팅 도메인
│   │   ├── documents/                 # 문서 관리 도메인
│   │   ├── templates/                 # 템플릿 도메인
│   │   ├── analytics/                 # 분석 도메인
│   │   └── shared/                    # 공통 도메인 유틸리티
│   ├── infrastructure/                # 인프라 레이어
│   │   ├── ai-providers/              # AI 서비스 통합
│   │   ├── database/                  # 데이터베이스 연동
│   │   ├── storage/                   # 파일 저장소
│   │   ├── email/                     # 이메일 서비스
│   │   ├── monitoring/                # 모니터링 도구
│   │   └── cache/                     # 캐싱 시스템
│   ├── presentation/                  # 프레젠테이션 레이어
│   │   ├── components/                # UI 컴포넌트
│   │   ├── hooks/                     # React 훅
│   │   ├── providers/                 # Context Provider
│   │   ├── styles/                    # 스타일시트
│   │   └── utils/                     # UI 유틸리티
│   ├── core/                          # 애플리케이션 코어
│   │   ├── events/                    # 이벤트 시스템
│   │   ├── di/                        # 의존성 주입
│   │   ├── config/                    # 애플리케이션 설정
│   │   ├── security/                  # 보안 관련
│   │   ├── monitoring/                # 모니터링
│   │   ├── cache/                     # 캐시 관리
│   │   └── errors/                    # 에러 정의
│   └── lib/                           # 공통 라이브러리
├── docs/                              # 문서
├── tests/                             # 전역 테스트
├── scripts/                           # 빌드/배포 스크립트
├── public/                            # 정적 자산
├── prisma/                            # 데이터베이스 스키마
└── 설정 파일들
```

## 🏛️ 도메인 구조 패턴

### 표준 도메인 구조
```
domains/[domain-name]/
├── models/                            # 도메인 모델
│   ├── entities/                      # 엔티티
│   ├── value-objects/                 # 값 객체
│   └── aggregates/                    # 집합체
├── services/                          # 서비스 계층
│   ├── domain-services/               # 도메인 서비스
│   ├── application-services/          # 애플리케이션 서비스
│   └── workflows/                     # 워크플로우
├── repositories/                      # 리포지토리 패턴
│   ├── interfaces/                    # 인터페이스 정의
│   └── implementations/               # 구현체
├── events/                            # 도메인 이벤트
│   ├── definitions/                   # 이벤트 정의
│   ├── handlers/                      # 이벤트 핸들러
│   └── publishers/                    # 이벤트 발행자
├── hooks/                             # React 훅
├── components/                        # 도메인 전용 컴포넌트
├── types/                             # 타입 정의
├── errors/                            # 도메인 에러
├── config/                            # 도메인 설정
├── tests/                             # 도메인 테스트
└── README.md                          # 도메인 문서
```

### 주요 도메인 설명

#### 🔐 Auth 도메인
**책임**: 사용자 인증 및 권한 관리
- 사용자 등록/로그인/로그아웃
- 세션 관리 및 토큰 처리
- 권한 기반 접근 제어 (RBAC)
- 비밀번호 정책 및 보안

#### 💬 Chat 도메인
**책임**: AI 채팅 기능
- AI 모델과의 대화 세션 관리
- 메시지 저장 및 히스토리
- 실시간 스트리밍 응답
- 프롬프트 캐싱 및 최적화

#### 📄 Documents 도메인
**책임**: 문서 관리 및 RAG
- 파일 업로드 및 파싱
- 벡터 임베딩 생성
- 문서 기반 검색 (RAG)
- 메타데이터 관리

#### 📝 Templates 도메인
**책임**: 프롬프트 템플릿 관리
- 템플릿 생성/편집/공유
- 카테고리 및 태그 관리
- 변수 치환 시스템
- 커뮤니티 템플릿

#### 📊 Analytics 도메인
**책임**: 사용량 분석 및 모니터링
- AI API 사용량 추적
- 사용자 행동 분석
- 성능 메트릭 수집
- 비용 추적

## 🎨 레이어 아키텍처

### 1. Presentation Layer (`presentation/`)
**책임**: 사용자 인터페이스와 사용자 경험
- React 컴포넌트와 페이지
- UI 상태 관리
- 사용자 상호작용 처리
- 폼 처리 및 검증
- 반응형 디자인

**구조**:
```
presentation/
├── components/
│   ├── ui/                           # shadcn/ui 기본 컴포넌트
│   ├── layout/                       # 레이아웃 컴포넌트
│   ├── shared/                       # 공통 재사용 컴포넌트
│   └── domain-specific/              # 도메인별 컴포넌트
├── hooks/
│   ├── ui/                           # UI 관련 훅
│   ├── data/                         # 데이터 페칭 훅
│   └── effects/                      # 사이드 이펙트 훅
├── providers/
├── styles/
└── utils/
```

### 2. Domain Layer (`domains/`)
**책임**: 비즈니스 로직과 규칙
- 도메인 엔티티와 값 객체
- 비즈니스 규칙과 검증
- 도메인 서비스와 워크플로우
- 도메인 이벤트와 핸들러
- 비즈니스 전용 계산

### 3. Infrastructure Layer (`infrastructure/`)
**책임**: 외부 통합과 기술적 관심사
- 데이터베이스 접근과 ORM
- 외부 API 클라이언트
- 파일 저장소와 CDN
- 이메일과 알림 서비스
- 캐싱과 성능 최적화

**구조**:
```
infrastructure/
├── ai-providers/                     # AI 서비스 제공자
│   ├── openai/
│   ├── anthropic/
│   ├── google/
│   └── interfaces/
├── database/                         # 데이터베이스
│   ├── prisma/
│   ├── redis/
│   └── migrations/
├── storage/                          # 저장소
│   ├── s3/
│   ├── vercel-blob/
│   └── local/
├── email/                            # 이메일 서비스
├── monitoring/                       # 모니터링
└── cache/                            # 캐싱
```

### 4. Core Layer (`core/`)
**책임**: 애플리케이션 전반의 관심사
- 의존성 주입 컨테이너
- 이벤트 버스와 메시징
- 보안과 권한 관리
- 모니터링과 로깅
- 설정 관리

**구조**:
```
core/
├── events/                           # 이벤트 시스템
│   ├── event-bus.ts
│   ├── event-store.ts
│   └── event-replay.ts
├── di/                               # 의존성 주입
├── config/                           # 설정 관리
├── security/                         # 보안
├── monitoring/                       # 모니터링
├── cache/                            # 캐시 관리
├── errors/                           # 에러 정의
└── types/                            # 공통 타입
```

## 📐 아키텍처 패턴 설명

### Domain-Driven Design 패턴

#### 1. Aggregates (집합체)
- **목적**: 관련된 엔티티들을 하나의 일관성 있는 단위로 묶음
- **특징**: 트랜잭션 경계를 정의하고 비즈니스 불변식을 보장
- **예시**: UserProfile (User + Preferences + Subscriptions)

#### 2. Domain Services (도메인 서비스)
- **목적**: 특정 엔티티에 속하지 않는 비즈니스 로직 처리
- **특징**: 무상태이며 순수한 비즈니스 로직만 포함
- **예시**: PasswordPolicyService, AIModelSelector

#### 3. Application Services (애플리케이션 서비스)
- **목적**: 사용 사례(Use Case)를 조율하고 트랜잭션을 관리
- **특징**: 인프라스트럭처와 도메인을 연결하는 오케스트레이터
- **예시**: ChatService, DocumentProcessingService

#### 4. Repository Pattern (리포지토리 패턴)
- **목적**: 데이터 접근 로직을 추상화하여 도메인과 분리
- **특징**: 인터페이스를 통해 구현체를 교체 가능
- **예시**: UserRepository, MessageRepository

### Event-Driven 패턴

#### 1. Domain Events (도메인 이벤트)
- **목적**: 도메인에서 발생한 중요한 사건을 다른 부분에 알림
- **특징**: 비동기 처리와 시스템 간 결합도 감소
- **예시**: UserRegistered, DocumentProcessed

#### 2. Event Handlers (이벤트 핸들러)
- **목적**: 특정 이벤트에 대한 반응 처리
- **특징**: 단일 책임 원칙에 따라 하나의 핸들러는 하나의 작업만
- **예시**: SendWelcomeEmailHandler, UpdateAnalyticsHandler

#### 3. Event Bus (이벤트 버스)
- **목적**: 이벤트 발행자와 구독자 간의 중재
- **특징**: 느슨한 결합을 통한 확장성 제공
- **구현**: Redis Pub/Sub 또는 인메모리 이벤트 버스

## 🔧 의존성 흐름

### 계층 간 의존성 규칙
```
Presentation Layer
       ↓ (의존)
Domain Layer
       ↑ (구현)
Infrastructure Layer
       ↑ (설정)
Core Layer
```

### 의존성 주입 (DI) 패턴
- **컨테이너**: 모든 의존성을 중앙에서 관리
- **인터페이스**: 구현체가 아닌 인터페이스에 의존
- **라이프사이클**: Singleton, Transient, Scoped 등

### 모듈 경계
- **도메인 간**: 직접 참조 금지, 이벤트를 통한 통신
- **레이어 간**: 상위 레이어가 하위 레이어 인터페이스에만 의존
- **외부 시스템**: Infrastructure 레이어를 통해서만 접근

## 📝 네이밍 컨벤션

### 파일 네이밍
```
# 엔티티
user.entity.ts
session.entity.ts

# 값 객체
email.vo.ts
password.vo.ts

# 서비스
auth.service.ts
password-policy.service.ts

# 리포지토리
user.repository.interface.ts
prisma-user.repository.ts

# 이벤트
user-registered.event.ts
send-welcome-email.handler.ts

# 컴포넌트
LoginForm.tsx
UserProfileCard.tsx
```

### 디렉토리 네이밍
- **kebab-case**: 폴더명은 kebab-case 사용
- **복수형**: 컬렉션을 나타내는 폴더는 복수형
- **명확성**: 역할이 명확하게 드러나는 이름 사용

## 🎯 확장성 고려사항

### 1. 모듈 확장
- 새로운 도메인 추가시 기존 코드 영향 최소화
- 이벤트 기반 통신으로 느슨한 결합 유지
- 인터페이스 기반 설계로 구현체 교체 용이

### 2. 성능 확장
- 캐싱 전략을 레이어별로 적용
- 비동기 처리를 통한 응답성 향상
- 데이터베이스 샤딩 준비

### 3. 팀 확장
- 도메인별 팀 분담 가능한 구조
- 명확한 인터페이스로 팀 간 협업 용이
- 독립적인 배포 및 테스트 가능

## 📋 개발 가이드라인

### 1. 새로운 기능 추가
1. 해당 도메인 식별
2. 도메인 모델 설계
3. 이벤트 정의
4. 서비스 구현
5. UI 컴포넌트 개발

### 2. 기존 기능 수정
1. 영향 범위 분석
2. 이벤트 호환성 확인
3. 테스트 커버리지 확인
4. 점진적 변경 적용

### 3. 성능 최적화
1. 병목 지점 식별
2. 캐싱 전략 적용
3. 비동기 처리 검토
4. 모니터링 지표 확인

이 아키텍처는 확장 가능하고 유지보수가 용이한 현대적인 웹 애플리케이션을 구축하기 위한 견고한 기반을 제공합니다.