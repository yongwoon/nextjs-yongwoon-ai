# Auth Domain - Token Storage & Rate Limiting

> 이 문서는 Magic Link 인증을 위한 토큰 스토리지와 레이트 리미팅 기능의 구조와 구현, 보안, 테스트, 문제해결을 설명합니다.
>
> - [전체 아키텍처](./directory-architecture.md)
> - [개발 워크플로우 가이드](../guides/dev-workflow-guide.md)
> - [Task Master Reference](../guides/taskmaster-guide.md)
> - [규칙 시스템 개요](../rules/overview.md)

이 도메인은 Magic Link 인증을 위한 토큰 스토리지와 레이트 리미팅 기능을 제공합니다.

## 주요 기능

### 🔐 AuthTokenService
안전한 토큰 생성, 저장, 검증을 담당합니다.

**주요 메서드:**
- `generateAndStoreToken()` - 새로운 인증 토큰 생성 및 저장
- `validateAndUseToken()` - 토큰 검증 및 사용 처리
- `getActiveTokenCount()` - 활성 토큰 개수 조회
- `cleanupExpiredTokens()` - 만료된 토큰 정리
- `invalidateAllTokensForEmail()` - 특정 이메일의 모든 토큰 무효화

**보안 특징:**
- SHA-256 해시를 사용한 토큰 저장
- 32바이트 암호화된 랜덤 토큰 생성
- 자동 만료 시간 관리 (기본 15분)
- 일회용 토큰 (사용 후 자동 무효화)

### ⏱️ RateLimitService
이메일 발송 빈도 제한을 통한 남용 방지를 담당합니다.

**주요 메서드:**
- `checkRateLimit()` - 이메일별 레이트 리미트 확인
- `checkIpRateLimit()` - IP 주소별 레이트 리미트 확인
- `checkBrowserSessionRateLimit()` - 브라우저별 레이트 리미트 확인
- `checkComprehensiveRateLimit()` - 종합적인 레이트 리미트 확인
- `generateRateLimitMessage()` - 사용자 친화적인 에러 메시지 생성
- `debugDatabaseConnection()` - 데이터베이스 연결 상태 확인 (디버깅용)

**제한 규칙:**
- **이메일별**: 15분 내 최대 3회
- **IP별**: 60분 내 최대 10회
- **브라우저별**: 30분 내 최대 5회

**에러 처리 개선:**
- 데이터베이스 에러와 실제 레이트 리미트 구분
- 개발 환경에서 상세한 디버깅 정보 제공
- 프로덕션 환경에서 보안을 위한 안전한 기본값 적용

### 🚀 AuthService (Enhanced)
기존 인증 서비스에 토큰 스토리지와 레이트 리미팅이 통합되었습니다.

**새로운 메서드:**
- `sendMagicLinkWithOptions()` - 확장된 옵션으로 매직 링크 발송
- `checkRateLimitStatus()` - 레이트 리미트 상태 확인
- `token.*` - 토큰 관리 유틸리티 메서드들

**호환성:**
- 기존 `sendMagicLink()` 메서드는 그대로 유지되며 내부적으로 레이트 리미팅 적용
- 모든 기존 메서드들이 계속 작동

**⚠️ 중요: 서버 전용 서비스**
- `AuthService`는 **서버 사이드에서만** 실행되어야 합니다
- `SUPABASE_SERVICE_ROLE_KEY` 등 민감한 환경변수에 접근하기 때문
- 클라이언트에서 사용 시 환경변수 접근 오류 발생

### 🌐 AuthClientService (New)
클라이언트 사이드에서 사용할 수 있는 Auth 서비스입니다.

**주요 메서드:**
- `sendMagicLink()` - 클라이언트용 매직 링크 발송
- `sendMagicLinkWithOptions()` - 확장된 옵션으로 매직 링크 발송
- `generateBrowserFingerprint()` - 브라우저 fingerprint 자동 생성

**특징:**
- API 라우트(`/api/auth/magic-link`)를 통해 서버 사이드 AuthService 호출
- 브라우저 fingerprint 자동 생성
- IP 주소 자동 수집
- 클라이언트에서 안전하게 사용 가능

### 🧹 AuthCleanupService
시스템 유지보수와 보안 모니터링을 담당합니다.

**주요 메서드:**
- `performCleanup()` - 만료된 토큰과 오래된 세션 정리
- `getMonitoringData()` - 보안 모니터링 데이터 수집
- `scheduleCleanup()` - 자동 정리 작업 실행
- `getEmailAuthHistory()` - 이메일별 인증 기록 조회

**모니터링 기능:**
- 활성 토큰 개수 추적
- 최근 시도 횟수 통계 (1시간, 24시간, 7일)
- 레이트 리미트에 걸린 이메일 목록
- 의심스러운 활동 감지 (고빈도 IP, 다중 이메일 사용 등)

## 아키텍처 분리

### 클라이언트/서버 분리 구조

```mermaid
graph TD
    A[클라이언트 컴포넌트] --> B[AuthClientService]
    B --> C[/api/auth/magic-link]
    C --> D[AuthService]
    D --> E[AuthTokenService]
    D --> F[RateLimitService]
    E --> G[Supabase Admin Client]
    F --> G
```

**분리 이유:**
- 환경변수 보안: `SUPABASE_SERVICE_ROLE_KEY` 등 민감한 키를 클라이언트에 노출하지 않음
- 권한 분리: 관리자 권한이 필요한 작업은 서버에서만 실행
- 에러 처리: 서버에서 적절한 에러 처리 후 클라이언트에 안전한 메시지 전달

## 사용 예시

### 클라이언트에서 매직 링크 발송
```typescript
import { AuthClientService } from '@/domains/auth/services';

// 기본 사용법
const result = await AuthClientService.sendMagicLink(
  'user@example.com',
  'http://localhost:3000/auth/callback'
);

if (result.success) {
  console.log('매직 링크가 발송되었습니다.');
} else if (result.rateLimited) {
  console.log(`레이트 리미트: ${result.error}`);
} else {
  console.log(`오류: ${result.error}`);
}
```

### 서버에서 매직 링크 발송 (API 라우트)
```typescript
import { AuthService } from '@/domains/auth/services';

// API 라우트에서 사용
const result = await AuthService.sendMagicLinkWithOptions({
  email: 'user@example.com',
  redirectTo: '/dashboard',
  userAgent: request.headers['user-agent'],
  ipAddress: getClientIP(request),
  browserFingerprint: 'browser-fingerprint-hash',
  metadata: { source: 'landing-page' }
});
```

### 확장된 옵션으로 매직 링크 발송
```typescript
import { AuthService } from '@/domains/auth/services';

const result = await AuthService.sendMagicLinkWithOptions({
  email: 'user@example.com',
  redirectTo: '/dashboard',
  userAgent: request.headers['user-agent'],
  ipAddress: getClientIP(request),
  browserFingerprint: 'browser-fingerprint-hash',
  metadata: { source: 'landing-page' }
});
```

### 레이트 리미트 상태 확인
```typescript
import { AuthService } from '@/domains/auth/services';

const status = await AuthService.checkRateLimitStatus('user@example.com');

console.log(`남은 시도 횟수: ${status.remainingAttempts}`);
console.log(`리셋 시간: ${status.resetTime}`);
```

### 토큰 직접 관리
```typescript
import { AuthTokenService } from '@/domains/auth/services';

// 토큰 생성
const tokenResult = await AuthTokenService.generateAndStoreToken({
  email: 'user@example.com',
  tokenType: 'magic_link',
  userAgent: 'Mozilla/5.0...',
  ipAddress: '192.168.1.1'
});

// 토큰 검증
const validation = await AuthTokenService.validateAndUseToken(
  'user@example.com',
  tokenResult.rawToken!,
  'magic_link'
);
```

### 시스템 모니터링
```typescript
import { AuthCleanupService } from '@/domains/auth/services';

// 모니터링 데이터 확인
const monitoring = await AuthCleanupService.getMonitoringData();
console.log('활성 토큰:', monitoring.activeTokensCount);
console.log('레이트 리미트된 이메일:', monitoring.rateLimitedEmails);

// 정리 작업 실행
const cleanup = await AuthCleanupService.performCleanup();
console.log('정리된 토큰 수:', cleanup.expiredTokensDeleted);
```

## 개발 및 테스트

### 디버깅 도구

#### 1. 디버깅 API 엔드포인트
개발 환경에서 `/api/auth/debug` 엔드포인트를 통해 시스템 상태를 확인할 수 있습니다:

```bash
# 데이터베이스 연결 상태 확인
curl "http://localhost:3000/api/auth/debug?action=connection"

# 특정 이메일의 레이트 리미트 상태 확인
curl "http://localhost:3000/api/auth/debug?action=rate-limit&email=test@example.com"

# 특정 이메일의 토큰 상태 확인
curl "http://localhost:3000/api/auth/debug?action=tokens&email=test@example.com"
```

#### 2. 레이트 리미팅 디버깅
```typescript
// 개발 환경에서 레이트 리미팅 상태 확인
const debugInfo = await RateLimitService.debugDatabaseConnection();
console.log('DB 연결 상태:', debugInfo.isConnected);
console.log('테이블 존재 여부:', debugInfo.tableExists);

// 특정 이메일의 레이트 리미트 상태 확인
const emailStatus = await RateLimitService.debugEmailRateLimit('test@example.com');
console.log('토큰 개수:', emailStatus.tokenCount);
console.log('최근 토큰들:', emailStatus.recentTokens);
```

### 테스트 유틸리티 사용
```typescript
// 개발 환경에서만 사용 가능
import { AuthTestUtils } from '@/utils/auth-test';

// 종합 테스트 실행
await AuthTestUtils.runComprehensiveTest('test@example.com');

// 레이트 리미트 테스트
await AuthTestUtils.testRateLimit('test@example.com', 5);

// 토큰 플로우 테스트
await AuthTestUtils.testTokenFlow('test@example.com');
```

### 브라우저 콘솔에서 테스트
개발 환경에서는 브라우저 콘솔에서 직접 테스트할 수 있습니다:
```javascript
// 전역으로 노출된 테스트 유틸리티 사용
AuthTestUtils.runComprehensiveTest('your-email@example.com');
```

## 환경 설정

### 필수 환경 변수

#### Supabase 설정
```env
# .env 파일 (CLI 사용 시)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### MCP/Cursor 설정
```json
// .cursor/mcp.json의 env 섹션
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://your-project.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key"
  }
}
```

### Supabase 프로젝트 설정

#### URL Configuration
Supabase Dashboard에서 다음 설정을 확인하세요:

1. **Authentication > URL Configuration**으로 이동
2. **Site URL**: `http://localhost:3000` (개발 환경)
3. **Redirect URLs**에 추가:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/error`

#### 환경변수 일치 확인
- `src/utils/supabase/constants.ts`에서 하드코딩된 값 대신 환경변수 사용
- `.env` 파일의 URL과 Supabase 프로젝트 URL이 일치하는지 확인

## 문제 해결 가이드

### 1. "Missing env.SUPABASE_SERVICE_ROLE_KEY" 에러

**원인**: 클라이언트 사이드에서 서버 전용 서비스를 호출

**해결방법**:
```typescript
// ❌ 잘못된 사용법 (클라이언트에서)
import { AuthService } from '@/domains/auth/services';
await AuthService.sendMagicLink(email); // 에러 발생

// ✅ 올바른 사용법 (클라이언트에서)
import { AuthClientService } from '@/domains/auth/services';
await AuthClientService.sendMagicLink(email);
```

### 2. "너무 많은 인증 요청" 에러 (첫 요청임에도)

**원인**: 데이터베이스 연결 오류로 인한 레이트 리미팅 오작동

**해결방법**:
1. 데이터베이스 연결 상태 확인:
   ```bash
   curl "http://localhost:3000/api/auth/debug?action=connection"
   ```

2. Supabase 마이그레이션 실행:
   ```bash
   npx supabase db reset
   ```

3. 환경변수 확인:
   - `SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY` 값 확인
   - `.env` 파일과 Supabase 프로젝트 설정 일치 여부 확인

### 3. 매직 링크 클릭 시 404 에러

**원인**: Supabase 프로젝트의 Redirect URL 설정 문제

**해결방법**:
1. Supabase Dashboard에서 Authentication > URL Configuration 확인
2. Redirect URLs에 `http://localhost:3000/auth/callback` 추가
3. Site URL을 `http://localhost:3000`으로 설정

### 4. 개발 환경에서 디버깅 정보 확인

**개발 환경 에러 메시지 예시**:
```
🚨 [개발 환경] 데이터베이스 연결 오류가 발생했습니다!

📋 해결 방법:
1. Supabase 마이그레이션 실행: npx supabase db reset
2. 환경 변수 확인: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
3. 테이블 존재 여부 확인: /api/auth/debug?action=connection

⚠️ 현재는 개발을 위해 레이트 리미팅을 우회했지만, 실제 DB 문제를 해결해야 합니다.

원본 에러: [실제 에러 메시지]
```

## API 라우트

### `/api/auth/magic-link` (POST)
매직 링크 발송을 위한 API 엔드포인트

**요청 본문**:
```typescript
{
  email: string;
  redirectTo?: string;
  metadata?: Record<string, any>;
}
```

**응답**:
```typescript
{
  success: boolean;
  message?: string;
  error?: string;
  rateLimited?: boolean;
  debugInfo?: any; // 개발 환경에서만
}
```

### `/api/auth/callback` (GET)
Supabase 매직 링크 인증 콜백 처리

**쿼리 매개변수**:
- `code`: Supabase 인증 코드
- `next`: 인증 후 리다이렉트할 경로 (기본값: `/`)

### `/api/auth/debug` (GET) - 개발 환경 전용
시스템 상태 디버깅을 위한 엔드포인트

**쿼리 매개변수**:
- `action`: `connection` | `rate-limit` | `tokens`
- `email`: 이메일 주소 (action이 `rate-limit` 또는 `tokens`일 때)

## 데이터베이스 스키마

### auth_tokens 테이블
```sql
CREATE TABLE auth_tokens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL,
  token_hash text NOT NULL,
  token_type text NOT NULL CHECK (token_type IN ('magic_link', 'verification_code')),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  user_agent text,
  ip_address text,
  browser_fingerprint text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
```

### 권장 인덱스
```sql
-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_auth_tokens_email_created ON auth_tokens(email, created_at);
CREATE INDEX idx_auth_tokens_expires_at ON auth_tokens(expires_at);
CREATE INDEX idx_auth_tokens_token_hash ON auth_tokens(token_hash);
CREATE INDEX idx_auth_tokens_ip_created ON auth_tokens(ip_address, created_at);
```

## 보안 고려사항

1. **토큰 보안**
   - 원본 토큰은 메모리에만 존재하고 즉시 해시화
   - SHA-256 해시를 사용하여 데이터베이스에 저장
   - 32바이트 암호화된 랜덤 토큰 생성

2. **레이트 리미팅**
   - 다층 레이트 리미팅 (이메일, IP, 브라우저)
   - 슬라이딩 윈도우 방식 사용
   - 브루트 포스 공격 방지

3. **환경변수 보안**
   - `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에 노출하지 않음
   - `NEXT_PUBLIC_` 접두사 없이 서버 전용으로 관리
   - API 라우트를 통한 안전한 서버 사이드 실행

4. **모니터링**
   - 의심스러운 활동 자동 감지
   - 정기적인 토큰 정리 작업
   - 상세한 인증 로그 추적

5. **데이터 보존**
   - 만료된 토큰 자동 정리
   - 개인정보 보호를 위한 데이터 보존 기간 관리
   - GDPR 준수를 위한 데이터 삭제 기능

## 향후 개선사항

- [ ] 지리적 위치 기반 보안 강화
- [ ] 머신러닝 기반 이상 행위 탐지
- [ ] 실시간 알림 시스템 통합
- [ ] 더 정교한 브라우저 fingerprinting
- [ ] 마이크로서비스 아키텍처 분리
- [ ] WebSocket을 통한 실시간 인증 상태 업데이트

---

## 📚 관련 문서
- [Supabase 보안 가이드](../guides/supabase-security-guide.md)
- [인증 플로우](./auth-flow.md)
- [개발 워크플로우 가이드](../guides/dev-workflow-guide.md)
- [Task Master Reference](../guides/taskmaster-guide.md)
- [규칙 시스템 개요](../rules/overview.md)