# supabase curl

- 데이터베이스 연결 상태 확인

```bash
curl "http://localhost:3000/api/auth/debug?action=connection"

{"action":"database_connection_check","timestamp":"2025-06-07T00:15:32.319Z","result":{"isConnected":true,"tablesExist":{"auth_tokens":true,"verification_codes":true,"browser_sessions":true},"sampleQuery":{"success":true,"count":0}}}
```

- 특정 이메일의 레이트 리미트 상태 확인

```bash
curl "http://localhost:3000/api/auth/debug?action=email&email=your-email@example.com"

{"action":"email_rate_limit_check","email":"your-email@example.com","timestamp":"2025-06-07T00:15:43.140Z","result":{"tokens":[],"summary":{"total":0,"active":0,"expired":0,"used":0,"last15Minutes":0,"last1Hour":0,"last24Hours":0},"rateLimitStatus":{"isAllowed":true,"remainingAttempts":3,"resetTime":"2025-06-07T00:30:43.137Z","debugInfo":{"attemptCount":0,"maxAttempts":3,"windowMinutes":15}}}}
```

- 레이트 리미트 테스트

```bash
curl "http://localhost:3000/api/auth/debug?action=test&email=your-email@example.com"
{"action":"rate_limit_test","email":"your-email@example.com","timestamp":"2025-06-07T00:15:51.055Z","result":{"isAllowed":true,"remainingAttempts":3,"resetTime":"2025-06-07T00:30:51.054Z","debugInfo":{"attemptCount":0,"maxAttempts":3,"windowMinutes":15}}}
```

- mail 발송

```bash
curl -X POST "http://localhost:3000/api/auth/magic-link" -H "Content-Type: application/json" -H "X-Browser-Fingerprint: test-fingerprint" -d '{"email": "test@example.com", "redirectTo": "http://localhost:3000/auth/callback"}'

```
