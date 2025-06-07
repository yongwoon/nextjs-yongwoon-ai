# 인증 Flow

> 이 문서는 Supabase 기반 Magic Link 인증 시스템의 전체 플로우와 보안, UX, 구현 구조를 설명합니다.
>
> - [전체 아키텍처](./directory-architecture.md)
> - [개발 워크플로우 가이드](../guides/dev-workflow-guide.md)
> - [Task Master Reference](../guides/taskmaster-guide.md)
> - [규칙 시스템 개요](../rules/overview.md)

## 개요

이 문서는 yongwoon.ai 에서 사용하는 **Supabase 기반 Magic Link 통합 인증 시스템**에 대해 설명합니다.
모든 사용자 인증(회원가입/로그인)은 Magic Link를 통해 이루어지며, 별도의 비밀번호 설정이나 관리가 필요하지 않습니다.

## 기술 스택

- **인증 서비스**: Supabase Auth
- **데이터베이스**: Supabase PostgreSQL
- **토큰 저장**: `auth_tokens` 테이블 (레이트 리미팅용)
- **프론트엔드**: Next.js 14 (App Router)
- **백엔드**: Next.js API Routes
- **보안**: Row Level Security (RLS), 환경변수 분리

## 통합 인증 Flow (신규/기존 사용자 공통)

### 개요도

```text
[사용자]
   ↓
이메일 입력 (MagicLinkForm)
   ↓
[AuthClientService.sendMagicLink]
   ↓
API Route (/api/auth/magic-link)
   ↓
[AuthService.sendMagicLinkWithOptions]
   ↓
레이트 리미팅 확인
   ↓
Supabase Magic Link 발송
   ↓
발송 완료 메시지
   ↓
이메일 수신
   ↓
Magic Link 클릭 ──→ [/auth/callback] ──→ 자동 로그인 완료
   ↓
홈페이지
```

### 단계별 Flow

#### 1. Magic Link 요청

- **Frontend Component**: `MagicLinkForm` (`src/components/auth/magic-link-form/`)
- **사용자 동작**: 이메일 주소 입력
- **호출되는 서비스**: `AuthClientService.sendMagicLink()`
- **API 엔드포인트**: `POST /api/auth/magic-link`
- **처리 과정**:
  - 사용자가 이메일 주소를 입력합니다
  - `MagicLinkForm`에서 `AuthClientService.sendMagicLink()`를 호출합니다
  - 클라이언트 서비스는 브라우저 fingerprint를 생성하고 API 라우트를 호출합니다
  - API 라우트에서 `AuthService.sendMagicLinkWithOptions()`를 실행합니다
  - **레이트 리미팅 확인**: 이메일, IP, 브라우저별 발송 제한 검사
  - **토큰 생성 및 저장**: `AuthTokenService`를 통해 안전한 토큰 생성
  - **Supabase Magic Link 발송**: `supabase.auth.signInWithOtp()` 호출
  - **Magic Link URL**: `http://localhost:3000/auth/callback`
  - Frontend는 이메일 발송 확인 메시지를 표시합니다

#### 2. Magic Link 인증 및 자동 로그인

- **사용자 동작**: 이메일의 magic link 클릭
- **호출되는 엔드포인트**: `GET /auth/callback?code={code}`
- **처리 과정**:
  - 사용자가 이메일의 magic link를 클릭합니다
  - Supabase가 `/auth/callback?code={code}` 형태로 리다이렉트합니다
  - 콜백 라우트에서 `supabase.auth.exchangeCodeForSession(code)`를 호출합니다
  - **신규 사용자인 경우**: Supabase가 자동으로 계정을 생성합니다
  - **기존 사용자인 경우**: 기존 계정으로 인증합니다
  - 성공 시 사용자를 홈페이지로 리다이렉트합니다
  - 실패 시 `/auth/error` 페이지로 리다이렉트하며 에러 메시지를 표시합니다

#### 3. 에러 처리

- **Frontend Page**: `AuthErrorPage` (`src/app/auth/error/page.tsx`)
- **처리 상황**:
  - Magic Link 만료
  - 잘못된 토큰
  - 네트워크 오류
  - Supabase 설정 문제
- **사용자 경험**:
  - 명확한 에러 메시지 표시
  - 새로운 Magic Link 요청 버튼 제공
  - 로그인 페이지로 돌아가기 옵션

## 아키텍처 구조

### 클라이언트/서버 분리

```text
┌─────────────────────────────────────────────────────────────┐
│                    클라이언트 사이드                          │
├─────────────────────────────────────────────────────────────┤
│ AuthClientService                                           │
│ - sendMagicLink()                                          │
│ - generateBrowserFingerprint()                             │
│ - API 라우트 호출                                           │
│                                                            │
│ 환경변수:                                                   │
│ - NEXT_PUBLIC_SUPABASE_URL ✅                              │
│ - NEXT_PUBLIC_SUPABASE_ANON_KEY ✅                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ fetch('/api/auth/magic-link')
┌─────────────────────────────────────────────────────────────┐
│                    서버 사이드                               │
├─────────────────────────────────────────────────────────────┤
│ API Routes (/api/auth/*)                                   │
│ │                                                          │
│ ├─ AuthService                                             │
│ │  - sendMagicLinkWithOptions()                           │
│ │  - 레이트 리미팅 확인                                     │
│ │                                                          │
│ ├─ AuthTokenService                                        │
│ │  - generateAndStoreToken()                              │
│ │  - validateAndUseToken()                                │
│ │                                                          │
│ ├─ RateLimitService                                        │
│ │  - checkComprehensiveRateLimit()                        │
│ │  - 이메일/IP/브라우저별 제한                              │
│ │                                                          │
│ └─ Supabase Admin Client                                   │
│    - createSupabaseAdminClient()                          │
│    - auth_tokens 테이블 접근                               │
│                                                            │
│ 환경변수:                                                   │
│ - SUPABASE_SERVICE_ROLE_KEY ❌ (절대 공개 금지)            │
└─────────────────────────────────────────────────────────────┘
```

### 보안 계층

1. **환경변수 보안**:
   - 클라이언트: `NEXT_PUBLIC_*` 키만 사용 (RLS로 보호)
   - 서버: `SUPABASE_SERVICE_ROLE_KEY` 사용 (관리자 권한)

2. **레이트 리미팅**:
   - 이메일별: 15분에 3회
   - IP별: 1시간에 10회
   - 브라우저별: 1시간에 5회

3. **토큰 보안**:
   - SHA-256 해시로 저장
   - 15분 자동 만료
   - 일회용 (사용 후 무효화)

## 세션 관리

### Supabase 세션

- **세션 저장**: Supabase가 자동으로 브라우저에 세션 쿠키 저장
- **세션 확인**: `supabase.auth.getSession()`으로 현재 세션 상태 확인
- **자동 갱신**: Supabase가 토큰 만료 전 자동으로 갱신
- **세션 지속**: 브라우저 재시작 후에도 세션 유지

### 로그아웃

- **Frontend**: 로그아웃 버튼 클릭
- **처리**: `supabase.auth.signOut()` 호출
- **결과**: 세션 쿠키 삭제 및 로그인 페이지로 리다이렉트

## 특수 상황 처리

### 개발 환경에서의 디버깅

- **디버깅 API**: `GET /api/auth/debug` (개발 환경에서만 접근 가능)
- **기능**:
  - 데이터베이스 연결 상태 확인
  - 특정 이메일의 토큰 상태 조회
  - 레이트 리미팅 상태 확인
  - 테이블 존재 여부 확인

### Magic Link 만료

- **시나리오**: 사용자가 만료된 Magic Link를 클릭한 경우
- **처리 과정**:
  - Supabase가 만료 오류를 반환합니다
  - `/auth/error` 페이지로 리다이렉트됩니다
  - 사용자에게 새로운 Magic Link 요청을 안내합니다

### 데이터베이스 연결 오류

- **개발 환경**: 상세한 에러 메시지와 해결 방법 안내
- **프로덕션 환경**: 일반적인 오류 메시지만 표시
- **공통**: 서버 로그에 상세한 에러 정보 기록

## 보안 고려사항

### Supabase 보안

- **Row Level Security (RLS)**: 모든 테이블에 적절한 RLS 정책 적용
- **환경변수 분리**: 클라이언트/서버 키 명확히 구분
- **API 키 보안**: `SERVICE_ROLE_KEY` 절대 클라이언트 노출 금지

### Magic Link 보안

- **토큰 생성**: 32바이트 암호화된 랜덤 토큰
- **토큰 저장**: SHA-256 해시로 데이터베이스에 저장
- **만료 시간**: 15분 후 자동 만료
- **일회성**: 사용 후 즉시 무효화
- **동시 요청**: 새 요청 시 기존 토큰 무효화

### 레이트 리미팅

- **다중 계층**: 이메일, IP, 브라우저별 독립적 제한
- **에러 처리**: DB 오류 시 개발/프로덕션 환경별 적절한 처리
- **디버깅**: 개발 환경에서 상세한 디버깅 정보 제공

## 구현 파일 구조

```text
src/
├── app/
│   ├── api/auth/
│   │   ├── magic-link/route.ts      # Magic Link 발송 API
│   │   └── debug/route.ts           # 디버깅 API (개발용)
│   ├── auth/
│   │   ├── callback/route.ts        # Magic Link 콜백 처리
│   │   └── error/page.tsx           # 인증 에러 페이지
│   └── login/page.tsx               # 로그인 페이지
├── components/auth/
│   └── magic-link-form/
│       ├── index.tsx                # Magic Link 폼 컴포넌트
│       └── hooks/index.tsx          # 폼 로직 훅
├── domains/auth/services/
│   ├── auth.service.ts              # 서버용 인증 서비스
│   ├── auth-client.service.ts       # 클라이언트용 인증 서비스
│   ├── auth-token.service.ts        # 토큰 관리 서비스
│   ├── rate-limit.service.ts        # 레이트 리미팅 서비스
│   └── index.ts                     # 서비스 내보내기
├── utils/supabase/
│   ├── client.ts                    # 클라이언트용 Supabase
│   ├── server.ts                    # 서버용 Supabase
│   └── constants.ts                 # Supabase 설정
└── lib/
    └── supabase.ts                  # Supabase 유틸리티
```

## 환경 설정

### 필수 환경변수

```bash
# 클라이언트용 (공개 가능)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 서버용 (절대 공개 금지)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Supabase 프로젝트 설정

1. **Authentication > URL Configuration**:
   - Site URL: `http://localhost:3000` (개발) / `https://yourdomain.com` (프로덕션)
   - Redirect URLs: `http://localhost:3000/auth/callback` 추가

2. **Database > Tables**:
   - `auth_tokens` 테이블 생성 (마이그레이션 실행)

3. **Authentication > Settings**:
   - Enable email confirmations: 비활성화 (Magic Link 사용)
   - Secure email change: 활성화

## 사용자 경험 (UX) 고려사항

### 간소화된 인증 과정

- 사용자는 비밀번호를 기억하거나 관리할 필요가 없습니다
- 회원가입과 로그인이 동일한 과정으로 통합되어 혼란을 줄입니다
- 이메일만으로 간단하게 계정에 접근할 수 있습니다

### 사용자 안내

- 이메일 입력 페이지에서 "Sign up" 또는 "Sign in" 구분 없이 "Continue with email" 등의 통합된 메시지 사용
- Magic Link 이메일 발송 후 명확한 안내 메시지 제공
- Magic Link 만료 시 친화적인 오류 메시지와 재요청 옵션 제공

### 에러 처리 UX

- **개발 환경**: 상세한 디버깅 정보와 해결 방법 안내
- **프로덕션 환경**: 사용자 친화적인 에러 메시지
- **공통**: 명확한 다음 단계 안내 (재시도, 새 요청 등)

### 접근성

- 명확하고 이해하기 쉬운 UI/UX 디자인
- 모바일 환경에서도 원활한 Magic Link 처리
- 키보드 네비게이션 지원
- 스크린 리더 호환성

## 모니터링 및 로깅

### 보안 로깅

- 레이트 리미팅 위반 시도
- 만료된 토큰 사용 시도
- 데이터베이스 연결 오류
- 의심스러운 인증 패턴

### 성능 모니터링

- Magic Link 발송 성공률
- 인증 완료 시간
- 데이터베이스 응답 시간
- API 엔드포인트 응답 시간

### 사용자 분석

- 인증 성공/실패 비율
- Magic Link 클릭률
- 사용자 재방문 패턴
- 디바이스/브라우저별 사용 통계

## 관련 문서

- [Supabase 보안 가이드](../guides/supabase-security-guide.md)
- [Auth Domain 구현 가이드](./domainLayer-token-storage-rate-limiting.md)
- [개발 워크플로우 가이드](../guides/dev-workflow-guide.md)
- [Task Master Reference](../guides/taskmaster-guide.md)
- [규칙 시스템 개요](../rules/overview.md)
