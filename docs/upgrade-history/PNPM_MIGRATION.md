# pnpm 마이그레이션 가이드

## 개요

이 프로젝트는 npm에서 pnpm으로 마이그레이션되었습니다. pnpm은 더 빠르고 효율적인 패키지 관리자입니다.

## pnpm의 장점

### 🚀 성능
- **빠른 설치**: 심볼릭 링크를 사용한 효율적인 패키지 관리
- **디스크 공간 절약**: 글로벌 스토어에서 패키지 공유
- **병렬 설치**: 의존성을 병렬로 설치하여 속도 향상

### 🔒 보안 및 안정성
- **엄격한 의존성 관리**: phantom dependencies 방지
- **정확한 의존성 해결**: 더 예측 가능한 의존성 트리
- **보안 강화**: 패키지 무결성 검증

### 🛠️ 개발 경험
- **모노레포 지원**: workspace 기능이 뛰어남
- **npm 호환성**: 기존 npm 스크립트와 호환
- **더 나은 에러 메시지**: 명확한 오류 정보 제공

## 설치 및 설정

### pnpm 설치

```bash
# npm을 통한 글로벌 설치
npm install -g pnpm

# 또는 Homebrew (macOS)
brew install pnpm

# 또는 curl을 통한 설치
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 프로젝트 설정

프로젝트에는 다음 설정이 추가되었습니다:

#### package.json
```json
{
  "packageManager": "pnpm@10.11.0",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

#### .npmrc
```ini
# pnpm 설정
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=false
prefer-workspace-packages=true

# 빌드 스크립트 승인 (보안)
enable-pre-post-scripts=true

# 로그 레벨
loglevel=warn

# 캐시 설정
store-dir=~/.pnpm-store
```

## 사용법

### 기본 명령어

```bash
# 의존성 설치
pnpm install

# 패키지 추가
pnpm add <package-name>
pnpm add -D <package-name>  # devDependencies

# 패키지 제거
pnpm remove <package-name>

# 스크립트 실행
pnpm run dev
pnpm run build
pnpm run lint

# 또는 단축형
pnpm dev
pnpm build
pnpm lint
```

### 프로젝트 스크립트

```bash
# 개발 서버 시작
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 시작
pnpm start

# 코드 린팅
pnpm lint
pnpm lint:fix

# 코드 포맷팅
pnpm format
pnpm format:check

# Next.js CLI
pnpm next dev
pnpm next build
pnpm next start
```

### 고급 명령어

```bash
# 의존성 트리 확인
pnpm list

# 오래된 패키지 확인
pnpm outdated

# 패키지 업데이트
pnpm update

# 캐시 정리
pnpm store prune

# 의존성 감사
pnpm audit
```

## Docker 통합

Dockerfile이 pnpm을 사용하도록 업데이트되었습니다:

```dockerfile
# pnpm 설치
RUN npm install -g pnpm@10.11.0

# 패키지 파일들 복사
COPY package.json pnpm-lock.yaml* ./

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 개발 서버 시작
CMD ["pnpm", "run", "dev"]
```

## 마이그레이션 과정

### 완료된 작업

1. ✅ npm에서 pnpm으로 패키지 관리자 변경
2. ✅ package.json에 packageManager 필드 추가
3. ✅ .npmrc 파일 pnpm 설정으로 업데이트
4. ✅ Dockerfile pnpm 사용으로 수정
5. ✅ .prettierignore에 pnpm 관련 파일 추가

### 주의사항

#### Peer Dependencies 경고
현재 React 19를 사용하고 있어 일부 패키지에서 peer dependency 경고가 발생합니다:

```
✕ unmet peer react@"^17.0.0 || ^18.0.0": found 19.1.0
```

이는 해당 패키지들이 아직 React 19를 공식 지원하지 않기 때문이며, 실제 동작에는 문제가 없습니다.

#### 해결 방법
`.npmrc`에서 `strict-peer-dependencies=false` 설정으로 경고를 무시하도록 설정했습니다.

## 팀 협업

### 새로운 팀원 온보딩

1. pnpm 설치:
   ```bash
   npm install -g pnpm
   ```

2. 프로젝트 클론 후 의존성 설치:
   ```bash
   git clone <repository>
   cd <project>
   pnpm install
   ```

### CI/CD 업데이트

CI/CD 파이프라인에서 npm 대신 pnpm 사용:

```yaml
# GitHub Actions 예시
- name: Install pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 10.11.0

- name: Install dependencies
  run: pnpm install --frozen-lockfile

- name: Build
  run: pnpm build
```

## 문제 해결

### 일반적인 문제

#### 1. pnpm 명령어를 찾을 수 없음
```bash
# pnpm 재설치
npm install -g pnpm
```

#### 2. 의존성 설치 실패
```bash
# 캐시 정리 후 재설치
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 3. 빌드 스크립트 실행 권한 오류
```bash
# 빌드 스크립트 승인
pnpm approve-builds
```

### 성능 최적화

#### 캐시 위치 변경
```ini
# .npmrc
store-dir=/path/to/custom/store
```

#### 네트워크 설정
```ini
# .npmrc
registry=https://registry.npmjs.org/
network-timeout=60000
```

## 추가 리소스

- [pnpm 공식 문서](https://pnpm.io/)
- [pnpm vs npm vs yarn 비교](https://pnpm.io/benchmarks)
- [pnpm CLI 명령어](https://pnpm.io/cli/add)
- [pnpm 설정 옵션](https://pnpm.io/npmrc)

## 롤백 방법

필요시 npm으로 롤백하는 방법:

```bash
# pnpm 파일 제거
rm -rf node_modules pnpm-lock.yaml .pnpm-store

# package.json에서 packageManager 필드 제거
# .npmrc 파일을 npm 설정으로 복원

# npm으로 의존성 재설치
npm install
```