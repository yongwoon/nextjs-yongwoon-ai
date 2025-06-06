# Supabase 이메일 템플릿 설정 가이드

이 가이드는 Goguryeo Gaemamusa AI의 매직 링크 인증을 위한 커스텀 이메일 템플릿을 Supabase에 설정하는 방법을 설명합니다.

## 📋 설정 단계

### 1. Supabase Dashboard 접속
1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 해당 프로젝트 선택
3. 좌측 메뉴에서 **Authentication** > **Settings** 클릭

### 2. 이메일 템플릿 설정 접근
1. **Email Templates** 탭 선택
2. **Magic Link** 섹션 찾기

### 3. 템플릿 적용
프로젝트에서 다음 코드를 실행하여 템플릿 설정 정보를 가져옵니다:

```bash
# 템플릿 설정 정보 가져오기
# app container 내부에서 실행
npx tsx get-email-templates.ts
```

### 4. Supabase에 템플릿 설정

#### Subject (제목)
```
{{ .SiteURL }}에서 제공하는 Goguryeo 로그인을 위한 매직 링크
```

#### HTML Body
위에서 출력된 `config.magicLink.body` 내용을 복사하여 붙여넣기

#### Text Body
위에서 출력된 `config.magicLink.bodyText` 내용을 복사하여 붙여넣기

## 🔧 고급 설정

### 환경별 설정
개발/프로덕션 환경에 따라 다른 템플릿을 사용하려면:

```typescript
// 개발 환경
EmailTemplateService.updateConfig({
  companyName: "Goguryeo (Dev)",
  supportEmail: "dev-support@goguryeo.ai"
});

// 프로덕션 환경
EmailTemplateService.updateConfig({
  companyName: "Goguryeo",
  supportEmail: "support@goguryeo.ai"
});
```

### 브랜드 커스터마이징
```typescript
EmailTemplateService.updateConfig({
  companyName: "Your Company",
  supportEmail: "support@yourcompany.com",
  logoUrl: "https://yourcompany.com/logo.png",
  brandColor: "#your-brand-color"
});
```

## 🧪 템플릿 테스트

### 미리보기 생성
```typescript
const preview = EmailTemplateService.generatePreview('magic-link', {
  userEmail: 'test@example.com',
  magicLink: 'https://yourapp.com/auth/callback?token=test'
});

console.log('미리보기 HTML:', preview.html);
```

### 렌더링 테스트
```typescript
const testResult = EmailTemplateService.testEmailRendering(preview.html);
console.log('테스트 결과:', testResult);
```

## 📱 이메일 클라이언트 호환성

### 테스트해야 할 클라이언트들
- [ ] Gmail (Web, Mobile)
- [ ] Outlook (Web, Desktop, Mobile)
- [ ] Apple Mail (Desktop, iOS)
- [ ] Yahoo Mail
- [ ] Naver Mail
- [ ] Daum Mail

### 반응형 디자인 확인
- [ ] 데스크톱 (1200px+)
- [ ] 태블릿 (768px-1199px)
- [ ] 모바일 (320px-767px)

## 🔍 변수 참조

Supabase에서 사용 가능한 템플릿 변수들:

| 변수 | 설명 | 예시 |
|------|------|------|
| `{{ .Email }}` | 사용자 이메일 | user@example.com |
| `{{ .Token }}` | 인증 토큰 | abc123def456 |
| `{{ .TokenHash }}` | 토큰 해시 | hashed_token_value |
| `{{ .SiteURL }}` | 사이트 URL | https://yourapp.com |
| `{{ .RedirectTo }}` | 리다이렉트 URL | /dashboard |
| `{{ .Data }}` | 추가 메타데이터 | custom_data |

## 🚀 배포 체크리스트

배포 전 확인사항:

- [ ] 템플릿이 Supabase Dashboard에 올바르게 설정되었는지 확인
- [ ] 개발 환경에서 실제 이메일 발송 테스트
- [ ] 다양한 이메일 클라이언트에서 렌더링 확인
- [ ] 매직 링크 클릭 후 인증 플로우 테스트
- [ ] 에러 케이스 (만료된 링크, 잘못된 토큰) 테스트
- [ ] 모바일 디바이스에서 링크 클릭 테스트

## ⚠️ 주의사항

1. **보안**: 템플릿에 민감한 정보를 하드코딩하지 마세요
2. **성능**: 이미지는 최적화하여 사용하세요
3. **접근성**: 색상 대비와 폰트 크기를 고려하세요
4. **국제화**: 다국어 지원이 필요한 경우 별도 템플릿을 준비하세요

## 📞 지원

템플릿 설정 중 문제가 발생하면:
- 개발팀 Slack 채널 문의
- GitHub Issues 등록
- support@goguryeo.ai 이메일 문의