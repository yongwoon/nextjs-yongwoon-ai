> # 🚀 프로젝트 초기 설정 가이드

> 이 문서는 Next.js 기반 AI 서비스 플랫폼의 초기 세팅, 주요 스택, 필수 명령어, 참고 가이드를 안내합니다.

---

## 📚 관련 가이드/참고

- [개발 워크플로우 가이드](../dev-workflow-guide.md)
- [디렉토리 아키텍처](../architecture/directory-architecture.md)
- [환경 변수/인프라 설정](../setup/environment-setup.md)
- [DB 테이블 설계](../setup/table-design-specification.md)
- [규칙 시스템 개요](../guides/overview.md)
- [Task Master Reference](../taskmaster-guide.md)

---

## 📝 프로젝트 환경/스택 요약

- **Next.js 15 (App Router)**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Supabase**
- **AI SDK (OpenAI, Anthropic, Google, LangChain, Pinecone 등)**

---

## 1️⃣ 프로젝트 생성 및 초기화

```bash
# Next.js 프로젝트 생성 (최초 1회)
npx create-next-app@latest yongwoon-ai --typescript --tailwind --eslint --app --src-dir

# 프로젝트 폴더로 이동
d cd yongwoon-ai

# 패키지 매니저 초기화 (pnpm 권장)
pnpm install
```

---

## 2️⃣ 주요 패키지 설치 (AI/DB 등)

> 실제 의존성/버전은 항상 [package.json](../../package.json) 기준으로 확인하세요.

```bash
pnpm add next react react-dom
pnpm add ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google
pnpm add @langchain/core @langchain/openai @langchain/community
pnpm add @pinecone-database/pinecone ioredis @upstash/redis
pnpm add @supabase/supabase-js @supabase/ssr
pnpm add zod @hookform/resolvers react-hook-form
# 기타 UI/테스트/유틸 등은 [installed-packages.md](./installed-packages.md) 참고
```

---

## 3️⃣ 개발 환경 설정

- 환경 변수/DB/인프라 세팅은 [environment-setup.md](../setup/environment-setup.md) 참고
- DB 테이블 설계는 [table-design-specification.md](../setup/table-design-specification.md) 참고
- 전체 폴더 구조/규칙은 [디렉토리 아키텍처](../architecture/directory-architecture.md), [규칙 시스템 개요](../guides/overview.md) 참고

---

## ✅ 초기화 완료 메시지 예시

```bash
✅ Success! Created yongwoon-ai with Next.js App Router and AI integrations
```

---

> **운영/개발 중 패키지, 환경, 워크플로우 변경 시 [Task Master Reference](../taskmaster-guide.md)와 위 가이드 문서도 함께 업데이트 권장**
