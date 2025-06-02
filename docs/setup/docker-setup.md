# Docker 개발 환경 설정 가이드

이 프로젝트는 Next.js를 사용하며, Docker Compose를 통해 개발 환경을 구성할 수 있습니다.

## 🚀 빠른 시작

### 1. 개발 환경 시작

```bash
# 스크립트를 이용한 자동 설정 및 시작
./docker-dev.sh
```

### 2. 수동 시작

```bash
# Docker Compose로 개발 환경 시작
docker-compose up --build

# 백그라운드에서 실행
docker-compose up -d --build
```

## 📋 서비스 구성

### 애플리케이션 서비스

- **app**: Next.js 애플리케이션
  - 포트: `3000`
  - URL: http://localhost:3000

### 데이터베이스 서비스

- **postgres**: PostgreSQL 15

  - 포트: `5432`
  - 데이터베이스: `nextjs_dev`
  - 사용자: `postgres`
  - 비밀번호: `postgres`

- **redis**: Redis 7
  - 포트: `6379`

## 🔧 환경 변수 설정

개발 환경에서 사용할 환경 변수는 `.env.local` 파일에 설정합니다:

```env
# Next.js 환경변수
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 데이터베이스 설정
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/nextjs_dev

# Redis 설정
REDIS_URL=redis://redis:6379

# JWT 시크릿
JWT_SECRET=your_jwt_secret_key_here

# Supabase 설정 (프로덕션용)
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 파일 구조

```text
.
├── compose.yml              # Docker Compose 설정
├── Dockerfile.local         # 개발용 Dockerfile
├── docker-dev.sh           # 개발 환경 시작 스크립트
├── .dockerignore           # Docker 빌드 제외 파일
└── .env.local              # 환경 변수 (자동 생성)
```

## 🛠️ 유용한 명령어

### Docker Compose 명령어

```bash
# 서비스 시작
docker-compose up

# 백그라운드에서 시작
docker-compose up -d

# 특정 서비스만 시작
docker-compose up app

# 서비스 중지
docker-compose down

# 볼륨까지 삭제하며 중지
docker-compose down -v

# 로그 확인
docker-compose logs -f app

# 컨테이너 내부 접속
docker-compose exec app sh
```

### 데이터베이스 접속

```bash
# PostgreSQL 접속
docker-compose exec postgres psql -U postgres -d nextjs_dev

# Redis 접속
docker-compose exec redis redis-cli
```

## 🔄 개발 워크플로우

1. **코드 변경**: 로컬에서 코드를 수정하면 자동으로 컨테이너에 반영됩니다.
2. **핫 리로드**: Next.js 개발 서버가 파일 변경을 감지하고 자동으로 새로고침합니다.
3. **의존성 추가**: `package.json`을 수정한 후 컨테이너를 재빌드해야 합니다.

```bash
# 의존성 변경 후 재빌드
docker-compose up --build
```

## 🐛 문제 해결

### 포트 충돌

다른 서비스가 포트를 사용 중인 경우 `compose.yml`에서 포트를 변경하세요:

```yaml
ports:
  - "3001:3000" # 3000 대신 3001 사용
```

### 권한 문제

macOS/Linux에서 권한 문제가 발생하는 경우:

```bash
# 스크립트 실행 권한 부여
chmod +x docker-dev.sh
```

### 캐시 문제

Docker 빌드 캐시 문제가 발생하는 경우:

```bash
# 캐시 없이 재빌드
docker-compose build --no-cache
```

## 📚 추가 정보

- [Next.js 문서](https://nextjs.org/docs)
- [Docker 문서](https://docs.docker.com)
- [PostgreSQL 문서](https://www.postgresql.org/docs)
- [Redis 문서](https://redis.io/documentation)
- [Qdrant 문서](https://qdrant.tech/documentation)
