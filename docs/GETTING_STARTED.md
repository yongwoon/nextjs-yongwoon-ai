# 시작하기

> 🚀 **신규 개발자를 위한 빠른 설정 가이드**

이 가이드는 프로젝트를 처음 접하는 개발자가 5분 안에 개발 환경을 설정하고 첫 실행을 완료할 수 있도록 도와줍니다.

## 📋 사전 요구사항

다음 도구들이 설치되어 있는지 확인하세요:

- **Node.js** 18.17 이상
- **pnpm** 8.0 이상 (권장)
- **Git**

```bash
# 버전 확인
node --version  # v18.17.0+
pnpm --version  # 8.0.0+
```

## ⚡ 5분 빠른 시작

### 1. 프로젝트 설정

```bash
# 1. 저장소 클론
git clone <repository-url>
cd nextjs-yongwoon-ai

# 2. 의존성 설치
pnpm install

# 3. 환경 변수 파일 생성
cp .env.example .env.local
```

### 2. 최소 환경 변수 설정

`.env.local` 파일을 열고 **최소한** 다음 항목만 설정하세요:

```env
# 기본 데이터베이스 (필수)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI 기능 사용시 (선택)
OPENAI_API_KEY=sk-...
```

> 💡 **빠른 시작**: Supabase만 설정하면 기본 기능을 사용할 수 있습니다. AI 기능은 나중에 추가할 수 있습니다.

### 3. 개발 서버 실행

```bash
pnpm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인하세요.

## ✅ 설치 완료 확인

개발 서버가 실행되면:

1. ✅ 홈페이지가 정상적으로 로드됨
2. ✅ 콘솔에 에러가 없음
3. ✅ 기본 UI가 표시됨

## 🔧 자주 사용하는 명령어

```bash
# 개발
pnpm run dev          # 개발 서버 실행
pnpm run build        # 프로덕션 빌드
pnpm run type-check   # 타입 검사

# 코드 품질
pnpm run lint         # 린트 검사
pnpm run format       # 코드 포맷팅
```

## 🚨 자주 발생하는 문제

### "포트 3000이 이미 사용 중"
```bash
# 다른 포트로 실행
PORT=3001 pnpm run dev
```

### "의존성 설치 실패"
```bash
# 캐시 정리 후 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### "환경 변수 오류"
```bash
# 환경 변수 파일 확인
cat .env.local

# 예시 파일과 비교
cat .env.example
```

## 🎯 다음 단계

설치가 완료되었다면:

1. **[🏗️ 프로젝트 구조 이해하기](./DIRECTORY_ARCHITECTURE.md)**
2. **[🤖 AI 기능 설정하기](./AI_SERVICE_ARCHITECTURE.md)**
3. **[📋 개발 계획 확인하기](./IMPLEMENTATION_ROADMAP.md)**

## 💡 개발 팁

- **점진적 설정**: 모든 기능을 한 번에 설정하려 하지 마세요
- **문서 활용**: 각 기능별 상세 문서를 참조하세요
- **커뮤니티 활용**: 문제가 생기면 GitHub Issues를 확인하세요

## 🆘 도움이 필요하다면

- **🐛 버그 리포트**: GitHub Issues
- **📖 상세 문서**: `docs/` 폴더 참조
- **💬 질문**: Discussions 탭 활용

이제 개발을 시작할 준비가 완료되었습니다! 🎉