# 프로젝트 초기 설정

## 개요
이 프로젝트는 Next.js 15와 React 19를 기반으로 구성된 AI 서비스 플랫폼입니다.

## 초기 템플릿
- ✔ Choose a project template · nextjs-app-router

## 기술 스택
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Supabase

## 개발 환경 설정
프로젝트 초기 설정은 Next.js의 create-next-app을 기반으로 하여 추가적인 AI 및 데이터베이스 통합을 포함합니다.

```bash
# Next.js 프로젝트 생성
npx create-next-app@latest yongwoon-ai --typescript --tailwind --eslint --app --src-dir

# 추가 AI 및 데이터베이스 패키지 설치
pnpm add @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google
pnpm add @supabase/supabase-js @supabase/ssr
pnpm add @langchain/core @langchain/openai @langchain/community
pnpm add @pinecone-database/pinecone ioredis
pnpm add ai zod @hookform/resolvers react-hook-form

# 개발 환경 설정 완료
✅ Success! Created yongwoon-ai with Next.js App Router and AI integrations
```
