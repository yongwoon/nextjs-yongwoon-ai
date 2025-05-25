#!/bin/bash

# Docker Compose를 이용한 개발 환경 시작 스크립트

echo "🚀 Next.js 개발 환경을 시작합니다..."

# .env.local 파일이 없으면 생성
if [ ! -f .env.local ]; then
    echo "📝 .env.local 파일을 생성합니다..."
    cat > .env.local << EOF
# Next.js 환경변수
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 데이터베이스 설정 (Docker Compose PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/nextjs_dev

# Redis 설정
REDIS_URL=redis://redis:6379

# JWT 시크릿
JWT_SECRET=your_jwt_secret_key_here_$(openssl rand -hex 32)

# Supabase 설정 (필요시 주석 해제)
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EOF
    echo "✅ .env.local 파일이 생성되었습니다."
fi

# Docker Compose 실행
echo "🐳 Docker Compose를 시작합니다..."
docker-compose up --build

echo "🎉 개발 환경이 시작되었습니다!"
echo "📱 애플리케이션: http://localhost:3000"
echo "🗄️  PostgreSQL: localhost:5432"
echo "🔴 Redis: localhost:6379"