#!/bin/bash

# 로컬 Supabase 환경 설정 스크립트
# 개발자가 빠르게 로컬 환경을 설정할 수 있도록 도와주는 스크립트

set -e  # 에러 발생시 스크립트 중단

echo "🚀 Supabase 로컬 환경 설정을 시작합니다..."

# 전역 변수 초기화
SUPABASE_CMD="supabase"  # 기본값, install_supabase_cli에서 재설정될 수 있음

# 색상 코드 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수들
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 필수 도구 확인
check_prerequisites() {
    log_info "필수 도구들을 확인하는 중..."

    # Docker 확인
    if ! command -v docker &> /dev/null; then
        log_error "Docker가 설치되어 있지 않습니다. Docker를 먼저 설치해주세요."
        echo "설치 가이드: https://docs.docker.com/get-docker/"
        exit 1
    fi

    # Docker가 실행 중인지 확인
    if ! docker info &> /dev/null; then
        log_error "Docker가 실행되고 있지 않습니다. Docker를 시작해주세요."
        exit 1
    fi

    # Node.js 확인
    if ! command -v node &> /dev/null; then
        log_error "Node.js가 설치되어 있지 않습니다. Node.js를 먼저 설치해주세요."
        echo "설치 가이드: https://nodejs.org/"
        exit 1
    fi

    # npm 확인
    if ! command -v npm &> /dev/null; then
        log_error "npm이 설치되어 있지 않습니다."
        exit 1
    fi

    log_success "모든 필수 도구가 설치되어 있습니다."
}

# Supabase CLI 설치/업데이트
install_supabase_cli() {
    log_info "Supabase CLI를 확인하는 중..."

    # 시스템에 설치된 Supabase CLI 확인
    if command -v supabase &> /dev/null; then
        local current_version=$(supabase --version 2>/dev/null | head -n1)
        log_info "Supabase CLI가 이미 설치되어 있습니다. 버전: $current_version"

        echo "Supabase CLI를 최신 버전으로 업데이트하시겠습니까? (y/N): "
        read -r update_cli
        if [[ $update_cli =~ ^[Yy]$ ]]; then
            log_info "Supabase CLI를 업데이트하는 중..."

            # macOS Homebrew 사용자
            if command -v brew &> /dev/null; then
                log_info "Homebrew를 사용하여 업데이트하는 중..."
                brew upgrade supabase || {
                    log_warning "Homebrew 업데이트에 실패했습니다. Homebrew tap을 추가하고 다시 시도합니다..."
                    brew install supabase/tap/supabase
                }
            # Linux package manager 사용자
            elif command -v apt &> /dev/null; then
                log_warning "Linux 사용자는 수동으로 최신 버전을 다운로드해야 합니다."
                log_info "다운로드 링크: https://github.com/supabase/cli/releases"
            # Windows Scoop 사용자
            elif command -v scoop &> /dev/null; then
                log_info "Scoop를 사용하여 업데이트하는 중..."
                scoop update supabase
            else
                log_warning "패키지 매니저를 찾을 수 없습니다. npx를 사용하여 CLI를 실행합니다."
            fi
        fi
    else
        log_info "Supabase CLI가 설치되어 있지 않습니다. 설치를 진행합니다..."

        # 운영체제별 설치 방법 안내
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew &> /dev/null; then
                log_info "Homebrew를 사용하여 Supabase CLI를 설치하는 중..."
                brew install supabase/tap/supabase
            else
                log_error "Homebrew가 설치되어 있지 않습니다."
                log_info "Homebrew 설치: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                log_info "또는 npx를 사용하여 CLI를 실행할 수 있습니다: npx supabase"
                exit 1
            fi
        elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            # Windows
            if command -v scoop &> /dev/null; then
                log_info "Scoop를 사용하여 Supabase CLI를 설치하는 중..."
                scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
                scoop install supabase
            else
                log_error "Scoop가 설치되어 있지 않습니다."
                log_info "Scoop 설치: https://scoop.sh/"
                log_info "또는 npx를 사용하여 CLI를 실행할 수 있습니다: npx supabase"
                exit 1
            fi
        else
            # Linux
            log_warning "Linux 사용자는 직접 설치해야 합니다."
            log_info "다음 방법 중 하나를 선택하세요:"
            log_info "1. GitHub 릴리스에서 패키지 다운로드: https://github.com/supabase/cli/releases"
            log_info "2. Go 모듈로 설치: go install github.com/supabase/cli@latest"
            log_info "3. npx 사용: npx supabase"

            echo "npx를 사용하여 계속 진행하시겠습니까? (y/N): "
            read -r use_npx
            if [[ ! $use_npx =~ ^[Yy]$ ]]; then
                log_error "설치를 중단합니다. 위의 방법 중 하나로 Supabase CLI를 설치한 후 다시 실행해주세요."
                exit 1
            fi
            SUPABASE_CMD="npx supabase"
        fi
    fi

    # CLI 설치 확인
    if command -v supabase &> /dev/null; then
        local final_version=$(supabase --version 2>/dev/null | head -n1)
        log_success "Supabase CLI 설치 완료: $final_version"
        SUPABASE_CMD="supabase"
    elif command -v npx &> /dev/null; then
        log_info "npx를 사용하여 Supabase CLI를 실행합니다..."
        SUPABASE_CMD="npx supabase"

        # npx로 버전 확인
        local npx_version=$(npx supabase --version 2>/dev/null | head -n1)
        log_success "npx Supabase CLI 사용 가능: $npx_version"
    else
        log_error "Supabase CLI를 설치하거나 실행할 수 없습니다."
        exit 1
    fi
}

# 기존 Supabase 인스턴스 정리
cleanup_existing() {
    log_info "기존 Supabase 인스턴스를 정리하는 중..."

    if supabase status &> /dev/null; then
        log_warning "실행 중인 Supabase 인스턴스를 발견했습니다. 중지하고 있습니다..."
        supabase stop
        log_success "기존 인스턴스가 중지되었습니다."
    fi
}

# Supabase 로컬 환경 시작
start_supabase() {
    log_info "Supabase 로컬 환경을 시작하는 중..."

    # 기존 인스턴스 정리
    $SUPABASE_CMD stop --no-backup 2>/dev/null || true

    # 로컬 환경 시작
    if $SUPABASE_CMD start; then
        log_success "Supabase 로컬 환경이 성공적으로 시작되었습니다!"
    else
        log_error "Supabase 시작에 실패했습니다."
        log_info "Docker가 실행 중인지 확인하고 다시 시도해주세요."
        exit 1
    fi
}

# 데이터베이스 마이그레이션 적용
apply_migrations() {
    log_info "데이터베이스 마이그레이션을 적용하는 중..."

    if $SUPABASE_CMD db reset; then
        log_success "마이그레이션이 성공적으로 적용되었습니다!"
    else
        log_warning "마이그레이션 적용 중 문제가 발생했습니다."
        log_info "수동으로 확인해주세요: $SUPABASE_CMD db reset"
    fi
}

# 시드 데이터 로드
load_seed_data() {
    echo "시드 데이터를 로드하시겠습니까? (y/N): "
    read -r load_seed

    if [[ $load_seed =~ ^[Yy]$ ]]; then
        log_info "시드 데이터를 로드하는 중..."

        if [ -f "supabase/seed.sql" ]; then
            if $SUPABASE_CMD db reset --with-seed; then
                log_success "시드 데이터가 성공적으로 로드되었습니다!"
            else
                log_warning "시드 데이터 로드 중 문제가 발생했습니다."
            fi
        else
            log_warning "시드 데이터 파일(supabase/seed.sql)을 찾을 수 없습니다."
        fi
    fi
}

# 환경 정보 출력
show_environment_info() {
    log_success "=== 🎉 Supabase 로컬 환경 설정 완료! ==="
    echo
    log_info "다음 URL들을 사용할 수 있습니다:"

    # Supabase 상태 정보 가져오기
    if $SUPABASE_CMD status > /tmp/supabase_status.txt 2>/dev/null; then
        echo
        echo "📊 Supabase Studio (데이터베이스 관리):"
        grep "Studio URL" /tmp/supabase_status.txt || echo "  http://localhost:54323"

        echo
        echo "🔗 API 엔드포인트:"
        grep "API URL" /tmp/supabase_status.txt || echo "  http://localhost:54321"

        echo
        echo "📧 메일 테스팅 (Inbucket):"
        grep "Inbucket URL" /tmp/supabase_status.txt || echo "  http://localhost:54324"

        echo
        echo "🗄️ 데이터베이스 직접 연결:"
        grep "DB URL" /tmp/supabase_status.txt || echo "  postgresql://postgres:postgres@localhost:54322/postgres"

        # 임시 파일 정리
        rm -f /tmp/supabase_status.txt
    else
        echo "  📊 Supabase Studio: http://localhost:54323"
        echo "  🔗 API URL: http://localhost:54321"
        echo "  📧 Inbucket (메일): http://localhost:54324"
        echo "  🗄️ DB URL: postgresql://postgres:postgres@localhost:54322/postgres"
    fi

    echo
    log_info "유용한 명령어들:"
    echo "  📋 상태 확인: $SUPABASE_CMD status"
    echo "  🔄 재시작: $SUPABASE_CMD stop && $SUPABASE_CMD start"
    echo "  🛑 중지: $SUPABASE_CMD stop"
    echo "  🗄️ DB 리셋: $SUPABASE_CMD db reset"
    echo
    log_success "개발을 시작하세요! 🚀"
}

# 메인 실행 흐름
main() {
    echo
    log_info "=== Supabase 로컬 환경 설정 시작 ==="
    echo

    check_prerequisites
    echo

    install_supabase_cli
    echo

    cleanup_existing
    echo

    start_supabase
    echo

    apply_migrations
    echo

    load_seed_data
    echo

    show_environment_info
    echo

    log_success "🎉 Supabase 로컬 환경 설정이 완료되었습니다!"
    log_info "개발을 시작하실 수 있습니다. 즐거운 코딩 되세요! 🚀"
}

# 스크립트 실행
main "$@"