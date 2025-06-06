# Auth Domain - Token Storage & Rate Limiting

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

**제한 규칙:**
- **이메일별**: 15분 내 최대 3회
- **IP별**: 60분 내 최대 10회
- **브라우저별**: 30분 내 최대 5회

### 🚀 AuthService (Enhanced)
기존 인증 서비스에 토큰 스토리지와 레이트 리미팅이 통합되었습니다.

**새로운 메서드:**
- `sendMagicLinkWithOptions()` - 확장된 옵션으로 매직 링크 발송
- `checkRateLimitStatus()` - 레이트 리미트 상태 확인
- `token.*` - 토큰 관리 유틸리티 메서드들

**호환성:**
- 기존 `sendMagicLink()` 메서드는 그대로 유지되며 내부적으로 레이트 리미팅 적용
- 모든 기존 메서드들이 계속 작동

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

## 사용 예시

### 기본 매직 링크 발송
```typescript
import { AuthService } from '@/domains/auth/services';

// 기존 방식 (레이트 리미팅 자동 적용)
const result = await AuthService.sendMagicLink('user@example.com', '/dashboard');

if (result.success) {
  console.log('매직 링크가 발송되었습니다.');
} else if (result.rateLimited) {
  console.log(`레이트 리미트: ${result.error}`);
} else {
  console.log(`오류: ${result.error}`);
}
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

3. **모니터링**
   - 의심스러운 활동 자동 감지
   - 정기적인 토큰 정리 작업
   - 상세한 인증 로그 추적

4. **데이터 보존**
   - 만료된 토큰 자동 정리
   - 개인정보 보호를 위한 데이터 보존 기간 관리
   - GDPR 준수를 위한 데이터 삭제 기능

## 향후 개선사항

- [ ] 지리적 위치 기반 보안 강화
- [ ] 머신러닝 기반 이상 행위 탐지
- [ ] 실시간 알림 시스템 통합
- [ ] 더 정교한 브라우저 fingerprinting
- [ ] 마이크로서비스 아키텍처 분리