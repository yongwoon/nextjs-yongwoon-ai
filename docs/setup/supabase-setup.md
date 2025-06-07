> **이 문서는 Supabase 초기 세팅 체크리스트입니다.**

- 환경 변수/인프라 설정은 [environment-setup.md](./environment-setup.md)
- DB 테이블 설계는 [table-design-specification.md](./table-design-specification.md) 참고

# Supabase를 사용할 때, 애플리케이션을 위해 설정해야 할 것

- **Application 등록**
- **이메일 템플릿 추가**: [Add email template](../../src/domains/auth/templates/setup-guide.md)
- **로그인 후 리다이렉트 URL 설정**

```text
Supabase 대시보드에서 직접 설정을 확인하는 것이 더 빠릅니다.

해결 방법:
1. Supabase Dashboard 접속
2. Authentication > URL Configuration으로 이동
3. 다음과 같이 설정:
   - Site URL: http://localhost:3000 확인 및 추가
   - Redirect URLs: http://localhost:3000/auth/callback 확인 및 추가
```

---

## 📚 관련 가이드/Reference

- [전체 아키텍처](../architecture/directory-architecture.md)
- [개발 워크플로우 가이드](../guides/dev-workflow-guide.md)
- [Task Master Reference](../guides/taskmaster-guide.md)
- [규칙 시스템 개요](../rules/overview.md)
- [environment-setup.md](./environment-setup.md) — 환경 변수/인프라 설정
- [table-design-specification.md](./table-design-specification.md) — DB 테이블 설계
