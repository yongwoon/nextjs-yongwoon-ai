> # 📖 프로젝트 공통 언어/용어 사전 (Ubiquitous Language Dictionary)

> 이 문서는 AI 브라우저 어시스턴트 프로젝트의 도메인 특화 용어를 정의하여 개발팀, 비즈니스팀, 사용자 간의 원활한 소통과 일관된 개발을 지원합니다.

---

## 📚 관련 가이드/참고
- [개발 워크플로우 가이드](../dev-workflow-guide.md)
- [디렉토리 아키텍처](../architecture/directory-architecture.md)
- [환경 변수/인프라 설정](../setup/environment-setup.md)
- [규칙 시스템 개요](../guides/overview.md)
- [Task Master Reference](../taskmaster-guide.md)

---

## 📋 용어 정의표

| 영어 | 한국어 | 정의 | 도메인 | 사용 예시 |
|------|--------|------|--------|----------|
| **AI Provider** | AI 제공자 | OpenAI, Anthropic, Google 등 AI 모델을 제공하는 외부 서비스 | AI/Infrastructure | "사용자가 선호하는 AI Provider를 설정할 수 있습니다" |
| **Browser Extension** | 브라우저 확장 프로그램 | 웹브라우저에 추가 기능을 제공하는 소프트웨어 모듈 | Platform | "Chrome Extension Manifest V3를 기반으로 합니다" |
| **Context Awareness** | 컨텍스트 인식 | 현재 웹페이지의 내용과 상황을 AI가 이해하여 적절한 응답을 제공하는 능력 | AI/Core | "컨텍스트 인식을 통해 페이지 관련 질문에 답변합니다" |
| **Content Script** | 콘텐츠 스크립트 | 웹페이지에 직접 삽입되어 DOM을 조작하고 페이지 정보를 추출하는 스크립트 | Extension | "Content Script가 페이지 텍스트를 추출합니다" |
| **Domain Entity** | 도메인 엔티티 | 비즈니스 로직에서 고유한 식별자를 가진 핵심 객체 | Architecture | "Chat Entity는 대화 세션을 나타냅니다" |
| **Embedding** | 임베딩 | 텍스트를 벡터 공간으로 변환한 수치 표현 | AI/RAG | "문서를 벡터 임베딩으로 변환하여 저장합니다" |
| **Event-Driven Architecture** | 이벤트 기반 아키텍처 | 컴포넌트 간 느슨한 결합을 위해 이벤트를 통해 소통하는 설계 패턴 | Architecture | "사용자 액션은 이벤트로 발행되어 처리됩니다" |
| **LLM** | 대형 언어 모델 | 대규모 텍스트 데이터로 훈련된 AI 모델 (GPT, Claude 등) | AI | "LLM을 통해 자연스러운 대화를 제공합니다" |
| **Manifest V3** | 매니페스트 V3 | Chrome 확장 프로그램의 최신 보안 및 성능 표준 | Extension | "Manifest V3 규격에 따라 서비스 워커를 사용합니다" |
| **Multi-AI Model** | 다중 AI 모델 | 여러 AI 모델을 동시에 지원하여 사용자가 선택할 수 있는 시스템 | AI | "Multi-AI Model 지원으로 GPT와 Claude를 모두 사용 가능합니다" |
| **Page Context** | 페이지 컨텍스트 | 현재 웹페이지의 URL, 제목, 내용, 메타데이터 등 상황 정보 | AI/Core | "Page Context를 분석하여 관련 도움말을 제공합니다" |
| **Popup Interface** | 팝업 인터페이스 | 브라우저 확장 프로그램 아이콘 클릭 시 표시되는 작은 UI 창 | Extension | "Popup Interface에서 빠른 설정을 변경할 수 있습니다" |
| **Prompt Caching** | 프롬프트 캐싱 | 동일한 프롬프트에 대한 AI 응답을 저장하여 성능과 비용을 최적화하는 기술 | AI/Performance | "Prompt Caching으로 중복 요청의 응답 시간을 단축합니다" |
| **RAG** | 검색 증강 생성 | Retrieval-Augmented Generation, 외부 지식을 검색하여 AI 응답을 개선하는 기술 | AI | "RAG 시스템으로 문서 기반 정확한 답변을 제공합니다" |
| **Service Worker** | 서비스 워커 | 웹페이지와 별도로 실행되는 백그라운드 스크립트 | Extension | "Service Worker가 확장 프로그램의 백그라운드 작업을 처리합니다" |
| **Sidebar Panel** | 사이드바 패널 | 브라우저 측면에 표시되는 AI 어시스턴트 인터페이스 | UI | "Sidebar Panel에서 AI와 대화할 수 있습니다" |
| **Streaming Response** | 스트리밍 응답 | AI 응답을 실시간으로 점진적으로 받아 표시하는 방식 | AI/UX | "Streaming Response로 타이핑 효과의 자연스러운 대화를 제공합니다" |
| **Template System** | 템플릿 시스템 | 재사용 가능한 프롬프트 템플릿을 관리하는 시스템 | Templates | "Template System을 통해 자주 사용하는 프롬프트를 저장합니다" |
| **Vector Database** | 벡터 데이터베이스 | 임베딩 벡터를 저장하고 유사도 검색을 수행하는 특화 데이터베이스 | AI/Infrastructure | "Pinecone Vector Database에 문서 임베딩을 저장합니다" |
| **Web Scraping** | 웹 스크래핑 | 웹페이지에서 자동으로 데이터를 추출하는 기술 | Data Processing | "Cheerio로 웹 스크래핑하여 페이지 내용을 분석합니다" |
| **Aggregate** | 집합체 | 연관된 객체들의 클러스터로 데이터 일관성 경계를 정의하는 DDD 패턴 | Architecture | "Chat Aggregate는 메시지들과 세션 정보를 포함합니다" |
| **Bounded Context** | 경계 컨텍스트 | 도메인 모델이 정의되고 적용되는 명시적 경계 | Architecture | "Auth와 Chat은 서로 다른 Bounded Context입니다" |
| **Clean Architecture** | 클린 아키텍처 | 의존성 방향을 제어하여 비즈니스 로직을 보호하는 아키텍처 패턴 | Architecture | "Clean Architecture로 프레임워크에 독립적인 구조를 만듭니다" |
| **Domain Service** | 도메인 서비스 | 특정 엔티티에 속하지 않는 도메인 로직을 캡슐화하는 서비스 | Architecture | "Password Validation은 Domain Service로 구현됩니다" |
| **Repository Pattern** | 리포지토리 패턴 | 데이터 접근 로직을 캡슐화하는 설계 패턴 | Architecture | "Repository Pattern으로 데이터베이스 접근을 추상화합니다" |
| **Value Object** | 값 객체 | 식별자 없이 값으로만 구별되는 불변 객체 | Architecture | "Email Address는 Value Object로 모델링됩니다" |
| **Application Service** | 애플리케이션 서비스 | 도메인 객체들을 조율하여 비즈니스 유스케이스를 실행하는 서비스 | Architecture | "ChatApplicationService가 대화 플로우를 조율합니다" |
| **Cross-Platform** | 크로스 플랫폼 | 여러 운영체제나 브라우저에서 동작하는 소프트웨어 특성 | Platform | "WebExtension API로 크로스 플랫폼 호환성을 확보합니다" |
| **API Rate Limiting** | API 속도 제한 | API 호출 빈도를 제한하여 서비스 안정성을 보장하는 메커니즘 | Infrastructure | "AI Provider의 API Rate Limiting을 고려한 요청 관리가 필요합니다" |
| **Token Management** | 토큰 관리 | AI 모델의 입력/출력 토큰 사용량을 추적하고 최적화하는 시스템 | AI/Performance | "Token Management로 비용을 모니터링하고 제어합니다" |
| **Context Window** | 컨텍스트 윈도우 | AI 모델이 한 번에 처리할 수 있는 최대 토큰 수 | AI | "GPT-4의 Context Window는 128K 토큰입니다" |
| **Fine-tuning** | 파인튜닝 | 사전 훈련된 모델을 특정 작업에 맞게 추가 학습시키는 과정 | AI | "한국어 특화를 위한 Fine-tuning을 고려합니다" |
| **Prompt Engineering** | 프롬프트 엔지니어링 | AI 모델에서 최적의 결과를 얻기 위해 입력 프롬프트를 설계하는 기술 | AI | "효과적인 Prompt Engineering으로 응답 품질을 향상시킵니다" |
| **Edge Computing** | 엣지 컴퓨팅 | 사용자에게 가까운 곳에서 데이터를 처리하여 지연시간을 줄이는 컴퓨팅 패러다임 | Infrastructure | "Edge Computing으로 응답 속도를 최적화합니다" |
| **Privacy-First** | 프라이버시 우선 | 사용자 데이터 보호를 최우선으로 하는 설계 원칙 | Security | "Privacy-First 접근으로 로컬 처리를 최대화합니다" |
| **Headless Architecture** | 헤드리스 아키텍처 | 프론트엔드와 백엔드를 분리하여 API를 통해 소통하는 구조 | Architecture | "Headless Architecture로 확장성과 유연성을 확보합니다" |
| **Microservices** | 마이크로서비스 | 애플리케이션을 작은 독립적인 서비스들로 분해하는 아키텍처 패턴 | Architecture | "AI 기능별로 Microservices로 분리하여 개발합니다" |
| **Event Sourcing** | 이벤트 소싱 | 상태 변경을 이벤트 시퀀스로 저장하는 데이터 저장 패턴 | Architecture | "사용자 액션을 Event Sourcing으로 추적합니다" |
| **CQRS** | 명령 쿼리 책임 분리 | 읽기와 쓰기 작업을 분리하는 아키텍처 패턴 | Architecture | "CQRS로 복잡한 쿼리와 명령을 분리하여 처리합니다" |
| **Dependency Injection** | 의존성 주입 | 객체의 의존성을 외부에서 주입하는 설계 패턴 | Architecture | "DI Container로 의존성을 관리합니다" |
| **API Gateway** | API 게이트웨이 | 여러 마이크로서비스에 대한 단일 진입점을 제공하는 컴포넌트 | Infrastructure | "API Gateway에서 인증과 라우팅을 처리합니다" |
| **Circuit Breaker** | 회로 차단기 | 외부 서비스 장애 시 연쇄 장애를 방지하는 패턴 | Infrastructure | "AI API 장애 시 Circuit Breaker가 대체 서비스로 전환합니다" |
| **Health Check** | 헬스 체크 | 서비스의 상태를 모니터링하는 메커니즘 | Infrastructure | "AI Provider Health Check로 서비스 가용성을 확인합니다" |
| **Load Balancing** | 로드 밸런싱 | 여러 서버에 작업을 분산하여 성능을 최적화하는 기술 | Infrastructure | "AI 요청을 Load Balancing으로 분산 처리합니다" |
| **Caching Strategy** | 캐싱 전략 | 데이터 저장과 무효화를 관리하는 방법론 | Performance | "Redis 기반 Caching Strategy로 응답 속도를 향상시킵니다" |
| **A/B Testing** | A/B 테스팅 | 두 가지 버전을 비교하여 더 나은 결과를 찾는 실험 방법 | Product | "AI 모델 선택에 A/B Testing을 적용합니다" |
| **Feature Flag** | 피처 플래그 | 코드 배포 없이 기능을 켜고 끌 수 있는 메커니즘 | Development | "새로운 AI 기능을 Feature Flag로 점진적 출시합니다" |
| **Progressive Web App** | 프로그레시브 웹 앱 | 네이티브 앱과 같은 경험을 제공하는 웹 애플리케이션 | Platform | "PWA로 오프라인에서도 기본 기능을 사용할 수 있습니다" |
| **WebAssembly** | 웹어셈블리 | 브라우저에서 고성능 애플리케이션을 실행하기 위한 바이너리 형식 | Platform | "WebAssembly로 클라이언트 측 AI 처리 성능을 향상시킵니다" |
| **Content Security Policy** | 콘텐츠 보안 정책 | 웹 애플리케이션의 보안을 강화하는 브라우저 보안 표준 | Security | "확장 프로그램의 CSP를 설정하여 보안을 강화합니다" |
| **Zero Trust** | 제로 트러스트 | 모든 네트워크 트래픽을 신뢰하지 않고 검증하는 보안 모델 | Security | "Zero Trust 원칙으로 API 접근을 관리합니다" |
| **Observability** | 관찰 가능성 | 시스템의 내부 상태를 외부에서 관찰할 수 있는 능력 | Monitoring | "로그와 메트릭으로 시스템 Observability를 확보합니다" |
| **Telemetry** | 텔레메트리 | 시스템 사용량과 성능 데이터를 원격으로 수집하는 기술 | Monitoring | "사용자 패턴 분석을 위한 Telemetry를 구현합니다" |

## 🎯 도메인별 용어 그룹

### 🤖 AI & Machine Learning
- **LLM**, **Multi-AI Model**, **Context Awareness**, **RAG**, **Embedding**
- **Prompt Engineering**, **Token Management**, **Context Window**, **Streaming Response**
- **Fine-tuning**, **AI Provider**, **Prompt Caching**

### 🔧 Browser Extension
- **Browser Extension**, **Manifest V3**, **Content Script**, **Service Worker**
- **Popup Interface**, **Sidebar Panel**, **Cross-Platform**, **Content Security Policy**

### 🏗️ Architecture & Design
- **Clean Architecture**, **Event-Driven Architecture**, **Domain Entity**, **Value Object**
- **Repository Pattern**, **Aggregate**, **Bounded Context**, **Domain Service**
- **Application Service**, **Microservices**, **CQRS**, **Event Sourcing**

### 🚀 Infrastructure & DevOps
- **Vector Database**, **API Gateway**, **Circuit Breaker**, **Load Balancing**
- **Health Check**, **Caching Strategy**, **Edge Computing**, **Dependency Injection**

### 📊 Performance & Monitoring
- **Observability**, **Telemetry**, **A/B Testing**, **Feature Flag**
- **API Rate Limiting**, **Progressive Web App**, **WebAssembly**

### 🔒 Security & Privacy
- **Privacy-First**, **Zero Trust**, **Content Security Policy**

## 📝 용어 사용 가이드라인

- 도메인 용어는 코드, 문서, 커뮤니케이션에서 일관되게 사용해야 하며, [Task Master Reference](../taskmaster-guide.md) 및 [개발 워크플로우 가이드](../dev-workflow-guide.md)에서 실제 적용 예시와 관리 방법을 참고하세요.

### ✅ 올바른 사용법
```typescript
// 좋은 예: 도메인 용어를 코드에 일관되게 사용
class ChatAggregate {
  private pageContext: PageContext
  private aiProvider: AIProvider

  async generateContextualResponse(prompt: string): Promise<StreamingResponse> {
    const embeddedContext = await this.ragService.searchRelevantDocs(prompt)
    return this.aiProvider.streamResponse(prompt, embeddedContext)
  }
}
```

### ❌ 피해야 할 사용법
```typescript
// 나쁜 예: 기술적 용어와 비즈니스 용어 혼재
class Chatbot {  // 'AI Assistant' 또는 'ConversationService' 사용 권장
  private gptClient  // 'aiProvider' 사용 권장

  async getAnswer(input: string) {  // 'generateResponse' 사용 권장
    // ...
  }
}
```

## 🔄 용어 진화 및 관리

- 새로운 용어 추가/수정/삭제는 [Task Master Reference](../taskmaster-guide.md)와 [규칙 시스템 개요](../guides/overview.md)에 따라 팀 내 공식 프로세스를 따릅니다.
- 용어 변경 시, 코드/문서/워크플로우 전반에 일관되게 반영하고, 변경 내역을 팀에 공유하세요.

### 용어 추가/수정 프로세스
1. **제안**: 새로운 용어나 수정 사항 제안
2. **검토**: 팀 내 논의를 통한 적절성 검토
3. **승인**: 기술 리드 및 제품 오너 승인
4. **적용**: 코드베이스 및 문서 전반 업데이트
5. **전파**: 팀 전체에 변경 사항 공유

---

**📝 참고**: 이 문서는 프로젝트 진화에 따라 지속적으로 업데이트됩니다. 새로운 개념이나 용어가 등장하면 즉시 추가하여 팀 간 소통의 일관성을 유지하세요.