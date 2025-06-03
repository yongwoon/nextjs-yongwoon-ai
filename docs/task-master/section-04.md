# Section 4

## Section 4.1 Setup Supabase Auth API Integration

(1) Supabase Auth API 연동 점검
이미 src/lib/supabase.ts에 Supabase 클라이언트가 설정되어 있고,
supabaseClient.auth.signInWithOtp, auth.getCurrentUser 등 인증 관련 함수가 구현되어 있습니다.
하지만, 실제 인증 플로우(매직 링크 발송, 콜백 처리 등)에 사용할 수 있도록 auth 서비스 레이어를 명확히 분리/정리하는 것이 좋습니다.

(2) 필요한 구현/점검 항목
[x] Supabase 클라이언트에서 auth 객체를 통해 인증 API 사용 가능 여부 확인
[x] 인증 관련 함수(매직 링크 발송, 세션 확인 등)를 별도 서비스/유틸로 정리
[x] 인증 관련 환경변수(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)가 올바르게 설정되어 있는지 점검
[x] 인증 관련 에러 핸들링 및 타입 안전성 보장

## Section 4.2 Implement Email Input Component with Validation

- 설명

이메일 입력 컴포넌트를 구현합니다.
사용자가 이메일을 입력하고, 매직 링크 인증을 요청할 수 있도록 합니다.
입력값 검증(validation)을 반드시 포함해야 하며,
react-hook-form@^7.48과 zod@^3.22를 사용하여 이메일 형식 검증을 구현합니다.

구현 요구사항

- 이메일 입력 폼(React 컴포넌트)
- react-hook-form으로 폼 상태 및 제출 관리
- zod로 이메일 유효성 검사(정규식 기반)
- 제출 시 AuthService.sendMagicLink 호출
- 성공/실패/로딩 상태 UI 처리(예: 스피너, 에러 메시지, 성공 안내)
- 접근성(aria-label 등) 및 UX 고려
