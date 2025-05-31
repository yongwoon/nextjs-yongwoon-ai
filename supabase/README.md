# Supabase Database Migration Guide

이 문서는 Supabase 데이터베이스 마이그레이션 프로세스와 로컬 개발 환경 관리에 대한 종합 가이드입니다.

## 📋 목차

1. [초기 설정](#초기-설정)
2. [주요 로컬 명령어](#주요-로컬-명령어)
3. [데이터 보관 및 관리](#데이터-보관-및-관리)
4. [마이그레이션 프로세스](#마이그레이션-프로세스)
5. [시드 데이터 관리](#시드-데이터-관리)
6. [롤백 프로세스](#롤백-프로세스)
7. [CI/CD 배포](#cicd-배포)

## 🚀 초기 설정

### 1. Supabase CLI 설치

```bash
# Homebrew (macOS 권장)
brew install supabase/tap/supabase

# NPM (글로벌)
npm install -g supabase

# 직접 다운로드
curl -L https://github.com/supabase/cli/releases/latest/download/supabase_darwin_amd64.tar.gz | tar -xz
```

### 2. 프로젝트 초기화

```bash
# 프로젝트 루트에서 실행
supabase init

# 로컬 환경 시작
supabase start
```

### 3. 자동 설정 스크립트 실행

```bash
# 모든 설정을 자동으로 처리
chmod +x scripts/supabase-local-setup.sh
./scripts/supabase-local-setup.sh
```

## 🔄 주요 로컬 명령어

### 기본 서비스 관리

```bash
# 로컬 Supabase 시작
supabase start

# 로컬 Supabase 중지
supabase stop

# 상태 확인
supabase status

# 로그 확인
supabase logs

# 완전 재시작 (데이터 유지)
supabase stop && supabase start

# 완전 삭제 후 재시작 (데이터 삭제)
supabase stop --backup && supabase start
```

### 데이터베이스 관리

```bash
# 마이그레이션 생성
supabase migration new <migration_name>

# 마이그레이션 실행
supabase db push

# 스키마 재설정
supabase db reset

# 시드 데이터 로드
supabase db reset --seed

# 원격 스키마 동기화
supabase db pull
```

### 개발 도구

```bash
# Studio UI 열기 (브라우저)
open http://127.0.0.1:54323

# TypeScript 타입 생성
supabase gen types typescript --local > types/supabase.ts

# 함수 배포 (Edge Functions)
supabase functions deploy <function_name>

# 도움말
supabase --help
```

## 💾 데이터 보관 및 관리

### Docker 볼륨 관리

로컬 Supabase 데이터는 Docker 볼륨에 안전하게 저장됩니다:

```bash
# 프로젝트별 볼륨 확인
docker volume ls --filter label=com.supabase.cli.project=nextjs-yongwoon-ai

# 모든 Supabase 볼륨 확인
docker volume ls --filter label=com.supabase.cli

# 볼륨 상세 정보
docker volume inspect <volume_name>

# 볼륨 백업 (선택사항)
docker run --rm -v <volume_name>:/data -v $(pwd):/backup ubuntu tar czf /backup/backup.tar.gz -C /data .

# 볼륨 복원 (선택사항)
docker run --rm -v <volume_name>:/data -v $(pwd):/backup ubuntu tar xzf /backup/backup.tar.gz -C /data
```

### 데이터 지속성

- ✅ **자동 보관**: `supabase stop` 실행 시 데이터가 자동으로 Docker 볼륨에 보관
- ✅ **자동 복원**: `supabase start` 실행 시 이전 데이터가 자동으로 복원
- ⚠️ **완전 삭제**: `supabase stop --backup` 실행 시에만 데이터가 영구 삭제됨

### 백업 전략

```bash
# 정기 백업 (권장)
supabase db dump --local > backups/$(date +%Y%m%d_%H%M%S)_backup.sql

# 특정 테이블만 백업
supabase db dump --local --table=users > backups/users_backup.sql

# 스키마만 백업
supabase db dump --local --schema-only > backups/schema_backup.sql
```

## 🔧 마이그레이션 프로세스

### 1. 새 마이그레이션 생성

```bash
# 새 마이그레이션 파일 생성
supabase migration new create_new_feature

# 생성된 파일 경로: supabase/migrations/YYYYMMDD_HHMMSS_create_new_feature.sql
```

### 2. 마이그레이션 작성

```sql
-- 예시: 새 테이블 생성
CREATE TABLE IF NOT EXISTS public.new_feature (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책 설정
ALTER TABLE public.new_feature ENABLE ROW LEVEL SECURITY;
```

### 3. 로컬 테스트

```bash
# 로컬에서 마이그레이션 적용
supabase db reset

# 또는 새 마이그레이션만 적용
supabase db push
```

### 4. 운영 배포

```bash
# 운영 환경에 배포
supabase db push --linked

# 또는 CI/CD를 통한 자동 배포 (권장)
```

## 🌱 시드 데이터 관리

### 시드 파일 위치
- `supabase/seed.sql` - 개발용 테스트 데이터

### 시드 데이터 실행

```bash
# 전체 재설정 + 시드 데이터 로드
supabase db reset

# 시드 데이터만 실행
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f supabase/seed.sql
```

### 시드 데이터 내용

현재 시드 데이터에는 다음이 포함되어 있습니다:
- 👤 테스트 사용자 3명 (admin, pro, free 등급)
- 💬 대화 3개 및 메시지 4개
- 📄 문서 2개 및 청크 3개
- 📝 프롬프트 템플릿 2개
- 📊 API 사용량 로그 3개
- 🔗 문서-대화 연결 데이터
- 📝 메시지 피드백 데이터
- 💾 프롬프트 캐시 데이터

## 🔄 롤백 프로세스

### 긴급 롤백

```bash
# 롤백 스크립트 실행
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f supabase/rollback.sql

# 또는 특정 마이그레이션으로 되돌리기
supabase db reset --to <migration_version>
```

### 운영 환경 롤백

```bash
# 운영 데이터베이스 백업 (필수!)
supabase db dump --linked > emergency_backup.sql

# 롤백 실행
supabase db push --linked rollback.sql
```

## 🚀 CI/CD 배포

### GitHub Actions 워크플로우

자동 배포는 `.github/workflows/supabase-deploy.yml`을 통해 처리됩니다:

- **트리거**: `main` 브랜치 푸시 또는 PR
- **단계**:
  1. 환경 검증
  2. 마이그레이션 검증
  3. 로컬 테스트
  4. 운영 배포 (main 브랜치만)

### 수동 배포

```bash
# Supabase 프로젝트 연결
supabase link --project-ref <your-project-ref>

# 운영 환경에 배포
supabase db push --linked

# Edge Functions 배포
supabase functions deploy --no-verify-jwt
```

## 📁 디렉토리 구조

```
supabase/
├── migrations/                    # 마이그레이션 파일들
│   └── 20250530121549_create-tables-only.sql
├── config.toml                   # Supabase 설정 파일
├── seed.sql                      # 개발용 시드 데이터 (9.2KB)
├── rollback.sql                  # 롤백/다운 마이그레이션 스크립트 (5.6KB)
├── .branches/                    # 브랜치별 설정
├── .temp/                        # 임시 파일들
├── .gitignore                    # Git 무시 파일 목록
└── README.md                     # 이 파일
```

## 🔍 문제 해결

### 일반적인 문제들

1. **포트 충돌**
   ```bash
   # 포트 사용 중인 프로세스 확인
   lsof -i :54321

   # 프로세스 종료
   kill -9 <PID>
   ```

2. **Docker 용량 부족**
   ```bash
   # Docker 정리
   docker system prune -a

   # Supabase 볼륨만 정리
   docker volume prune --filter label=com.supabase.cli
   ```

3. **마이그레이션 충돌**
   ```bash
   # 강제 재설정
   supabase db reset --linked

   # 특정 마이그레이션부터 재실행
   supabase db push --linked --include-seed
   ```

### 로그 확인

```bash
# 전체 로그
supabase logs

# 특정 서비스 로그
supabase logs -f postgres
supabase logs -f api
supabase logs -f auth
```

## 📊 스키마 구조

### 주요 테이블

1. **user_profiles**: 사용자 프로필 정보
2. **conversations**: AI 대화 세션
3. **messages**: 대화 메시지
4. **documents**: 업로드된 문서
5. **document_chunks**: RAG를 위한 문서 청크
6. **prompt_templates**: 재사용 가능한 프롬프트
7. **api_usage_logs**: API 사용량 추적
8. **message_feedback**: 메시지 피드백
9. **prompt_cache**: 프롬프트 캐시
10. **document_conversation_links**: 문서-대화 연결

### 보안 정책 (RLS)

모든 테이블에 Row Level Security가 적용되어 있습니다:
- 사용자는 자신의 데이터만 접근 가능
- 공개 프롬프트 템플릿은 모든 사용자가 조회 가능
- 서비스 역할은 모든 데이터에 접근 가능

## 🔧 개발 워크플로

### 1. 스키마 변경 프로세스

```bash
# 1. 새 브랜치 생성
git checkout -b feature/new-schema-change

# 2. 새 마이그레이션 생성
supabase migration new add_new_feature

# 3. 마이그레이션 파일 편집
# migrations/새파일.sql 수정

# 4. 로컬에서 테스트
supabase db reset

# 5. 시드 데이터로 테스트
supabase db reset --seed

# 6. 커밋 및 푸시
git add .
git commit -m "feat: add new schema for feature X"
git push origin feature/new-schema-change
```

### 2. 타입 생성

TypeScript 타입을 자동 생성하려면:

```bash
# 타입 생성
supabase gen types typescript --local > src/types/database.types.ts
```

## 🚨 주의사항

### 운영 환경 주의점

1. **항상 백업 먼저**: 운영 환경 변경 전 반드시 백업
2. **단계적 배포**: 큰 변경사항은 여러 단계로 나누어 배포
3. **롤백 계획**: 모든 마이그레이션에 대한 롤백 계획 수립
4. **테스트 환경**: 운영 환경과 동일한 테스트 환경에서 먼저 검증

### 데이터 손실 방지

```bash
# 운영 환경 변경 전 체크리스트
1. [ ] 백업 생성 완료
2. [ ] 테스트 환경에서 검증 완료
3. [ ] 롤백 스크립트 준비 완료
4. [ ] 팀원들에게 배포 일정 공지
5. [ ] 모니터링 도구 준비
```

## 📝 예제 스크립트

### 로컬 환경 완전 리셋

```bash
#!/bin/bash
echo "로컬 Supabase 환경을 완전히 리셋합니다..."
supabase stop
supabase start
supabase db reset --seed
echo "리셋 완료!"
```

### 프로덕션 배포

```bash
#!/bin/bash
echo "프로덕션 배포를 시작합니다..."

# 1. 백업
echo "1. 백업 생성 중..."
supabase db dump --linked > "backup_$(date +%Y%m%d_%H%M%S).sql"

# 2. 마이그레이션 푸시
echo "2. 마이그레이션 적용 중..."
supabase db push --linked

# 3. 확인
echo "3. 배포 완료! 상태를 확인하세요."
supabase projects list
```

## 📚 추가 리소스

- [Supabase CLI 공식 문서](https://supabase.com/docs/guides/cli)
- [마이그레이션 가이드](https://supabase.com/docs/guides/database/migrations)
- [로컬 개발 가이드](https://supabase.com/docs/guides/cli/local-development)
- [Edge Functions 가이드](https://supabase.com/docs/guides/functions)

---

💡 **팁**: 개발 중에는 항상 로컬 환경에서 먼저 테스트하고, 정기적으로 백업을 생성하는 것을 권장합니다.
