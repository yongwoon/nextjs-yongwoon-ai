import { createSupabaseAdminClient } from "@/lib/supabase";

export interface RateLimitCheck {
  isAllowed: boolean;
  remainingAttempts: number;
  resetTime: Date;
  error?: string;
  // 디버깅을 위한 추가 정보
  debugInfo?: {
    attemptCount: number;
    maxAttempts: number;
    windowMinutes: number;
    errorType?: "database" | "rate_limit" | "unknown";
    originalError?: string;
  };
}

export interface RateLimitOptions {
  email: string;
  ipAddress?: string;
  browserFingerprint?: string;
  userAgent?: string;
  windowMinutes?: number; // 기본 15분
  maxAttempts?: number; // 기본 3회
}

export const RateLimitService = {
  /**
   * 이메일 발송 제한 확인
   */
  async checkRateLimit(options: RateLimitOptions): Promise<RateLimitCheck> {
    try {
      const windowMinutes = options.windowMinutes || 15;
      const maxAttempts = options.maxAttempts || 3;
      const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

      const supabase = createSupabaseAdminClient();

      // 지정된 시간 윈도우 내에서 이메일별 토큰 생성 횟수 조회
      const { data: tokens, error } = await supabase
        .from("auth_tokens")
        .select("id, created_at")
        .eq("email", options.email)
        .gte("created_at", windowStart.toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("레이트 리미트 확인 실패:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });

        // 개발 환경에서는 에러를 명확히 표시하되, 개발을 방해하지 않도록 처리
        const isDevelopment = process.env.NODE_ENV === "development";

        if (isDevelopment) {
          // 개발 환경: 에러를 명확히 표시하고 개발자가 선택할 수 있도록 함
          console.warn("🚨 [개발 환경] 데이터베이스 에러 발생!");
          console.warn("📋 해결 방법:");
          console.warn("1. Supabase 마이그레이션 실행: npx supabase db reset");
          console.warn(
            "2. 환경 변수 확인: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
          );
          console.warn(
            "3. 테이블 존재 여부 확인: /api/auth/debug?action=connection",
          );
          console.warn(
            "⚠️  현재는 레이트 리미팅을 우회하여 개발을 계속할 수 있습니다.",
          );

          return {
            isAllowed: true, // 개발 환경에서는 우회 허용
            remainingAttempts: maxAttempts,
            resetTime: new Date(Date.now() + windowMinutes * 60 * 1000),
            error: `[개발 환경] 데이터베이스 에러: ${error.message}`,
            debugInfo: {
              attemptCount: 0,
              maxAttempts,
              windowMinutes,
              errorType: "database",
              originalError: error.message,
            },
          };
        } else {
          // 프로덕션 환경: 보안을 위해 차단
          return {
            isAllowed: false,
            remainingAttempts: 0,
            resetTime: new Date(Date.now() + windowMinutes * 60 * 1000),
            error:
              "시스템 오류로 인해 일시적으로 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요.",
            debugInfo: {
              attemptCount: 0,
              maxAttempts,
              windowMinutes,
              errorType: "database",
              originalError: "Database connection error (production)",
            },
          };
        }
      }

      const attemptCount = tokens?.length || 0;
      const remainingAttempts = Math.max(0, maxAttempts - attemptCount);
      const isAllowed = attemptCount < maxAttempts;

      // 가장 오래된 토큰의 생성 시간을 기준으로 리셋 시간 계산
      let resetTime = new Date(Date.now() + windowMinutes * 60 * 1000);
      if (tokens && tokens.length > 0) {
        const oldestToken = tokens[tokens.length - 1];
        resetTime = new Date(
          new Date(oldestToken.created_at).getTime() +
            windowMinutes * 60 * 1000,
        );
      }

      // 디버깅 로그 추가
      console.log("Rate limit check result:", {
        email: options.email,
        attemptCount,
        maxAttempts,
        isAllowed,
        remainingAttempts,
        resetTime,
        windowMinutes,
      });

      return {
        isAllowed,
        remainingAttempts,
        resetTime,
        debugInfo: {
          attemptCount,
          maxAttempts,
          windowMinutes,
          errorType: isAllowed ? undefined : "rate_limit",
        },
      };
    } catch (error) {
      console.error("레이트 리미트 확인 중 오류:", error);

      // 예상치 못한 에러의 경우 개발 환경에서는 허용
      const isDevelopment = process.env.NODE_ENV === "development";
      const windowMinutes = options.windowMinutes || 15;
      const maxAttempts = options.maxAttempts || 3;

      return {
        isAllowed: isDevelopment,
        remainingAttempts: isDevelopment ? maxAttempts : 0,
        resetTime: new Date(Date.now() + windowMinutes * 60 * 1000),
        error: isDevelopment
          ? `예상치 못한 에러 (개발 환경에서 허용): ${error}`
          : "레이트 리미트 확인 중 오류가 발생했습니다.",
        debugInfo: {
          attemptCount: 0,
          maxAttempts,
          windowMinutes,
          errorType: "unknown",
          originalError: String(error),
        },
      };
    }
  },

  /**
   * IP 주소 기반 레이트 리미트 확인 (선택적)
   */
  async checkIpRateLimit(
    ipAddress: string,
    windowMinutes: number = 60,
    maxAttempts: number = 10,
  ): Promise<RateLimitCheck> {
    try {
      const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
      const supabase = createSupabaseAdminClient();

      // IP 주소별 토큰 생성 횟수 조회
      const { data: tokens, error } = await supabase
        .from("auth_tokens")
        .select("id, created_at")
        .eq("ip_address", ipAddress)
        .gte("created_at", windowStart.toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("IP 레이트 리미트 확인 실패:", error);

        const isDevelopment = process.env.NODE_ENV === "development";

        return {
          isAllowed: isDevelopment,
          remainingAttempts: isDevelopment ? maxAttempts : 0,
          resetTime: new Date(Date.now() + windowMinutes * 60 * 1000),
          error: isDevelopment
            ? `IP 레이트 리미트 데이터베이스 에러 (개발 환경에서 허용): ${error.message}`
            : "IP 레이트 리미트 확인 중 오류가 발생했습니다.",
          debugInfo: {
            attemptCount: 0,
            maxAttempts,
            windowMinutes,
            errorType: "database",
            originalError: error.message,
          },
        };
      }

      const attemptCount = tokens?.length || 0;
      const remainingAttempts = Math.max(0, maxAttempts - attemptCount);
      const isAllowed = attemptCount < maxAttempts;

      let resetTime = new Date(Date.now() + windowMinutes * 60 * 1000);
      if (tokens && tokens.length > 0) {
        const oldestToken = tokens[tokens.length - 1];
        resetTime = new Date(
          new Date(oldestToken.created_at).getTime() +
            windowMinutes * 60 * 1000,
        );
      }

      return {
        isAllowed,
        remainingAttempts,
        resetTime,
        debugInfo: {
          attemptCount,
          maxAttempts,
          windowMinutes,
          errorType: isAllowed ? undefined : "rate_limit",
        },
      };
    } catch (error) {
      console.error("IP 레이트 리미트 확인 중 오류:", error);

      const isDevelopment = process.env.NODE_ENV === "development";

      return {
        isAllowed: isDevelopment,
        remainingAttempts: isDevelopment ? maxAttempts : 0,
        resetTime: new Date(Date.now() + windowMinutes * 60 * 1000),
        error: isDevelopment
          ? `IP 레이트 리미트 예상치 못한 에러 (개발 환경에서 허용): ${error}`
          : "IP 레이트 리미트 확인 중 오류가 발생했습니다.",
        debugInfo: {
          attemptCount: 0,
          maxAttempts,
          windowMinutes,
          errorType: "unknown",
          originalError: String(error),
        },
      };
    }
  },

  /**
   * 브라우저 세션 기반 레이트 리미트 확인
   */
  async checkBrowserSessionRateLimit(
    browserFingerprint: string,
    windowMinutes: number = 30,
    maxAttempts: number = 5,
  ): Promise<RateLimitCheck> {
    try {
      const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
      const supabase = createSupabaseAdminClient();

      // 브라우저 fingerprint별 토큰 생성 횟수 조회
      const { data: tokens, error } = await supabase
        .from("auth_tokens")
        .select("id, created_at")
        .eq("browser_fingerprint", browserFingerprint)
        .gte("created_at", windowStart.toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("브라우저 세션 레이트 리미트 확인 실패:", error);

        const isDevelopment = process.env.NODE_ENV === "development";

        return {
          isAllowed: isDevelopment,
          remainingAttempts: isDevelopment ? maxAttempts : 0,
          resetTime: new Date(Date.now() + windowMinutes * 60 * 1000),
          error: isDevelopment
            ? `브라우저 세션 레이트 리미트 데이터베이스 에러 (개발 환경에서 허용): ${error.message}`
            : "브라우저 세션 레이트 리미트 확인 중 오류가 발생했습니다.",
          debugInfo: {
            attemptCount: 0,
            maxAttempts,
            windowMinutes,
            errorType: "database",
            originalError: error.message,
          },
        };
      }

      const attemptCount = tokens?.length || 0;
      const remainingAttempts = Math.max(0, maxAttempts - attemptCount);
      const isAllowed = attemptCount < maxAttempts;

      let resetTime = new Date(Date.now() + windowMinutes * 60 * 1000);
      if (tokens && tokens.length > 0) {
        const oldestToken = tokens[tokens.length - 1];
        resetTime = new Date(
          new Date(oldestToken.created_at).getTime() +
            windowMinutes * 60 * 1000,
        );
      }

      return {
        isAllowed,
        remainingAttempts,
        resetTime,
        debugInfo: {
          attemptCount,
          maxAttempts,
          windowMinutes,
          errorType: isAllowed ? undefined : "rate_limit",
        },
      };
    } catch (error) {
      console.error("브라우저 세션 레이트 리미트 확인 중 오류:", error);

      const isDevelopment = process.env.NODE_ENV === "development";

      return {
        isAllowed: isDevelopment,
        remainingAttempts: isDevelopment ? maxAttempts : 0,
        resetTime: new Date(Date.now() + windowMinutes * 60 * 1000),
        error: isDevelopment
          ? `브라우저 세션 레이트 리미트 예상치 못한 에러 (개발 환경에서 허용): ${error}`
          : "브라우저 세션 레이트 리미트 확인 중 오류가 발생했습니다.",
        debugInfo: {
          attemptCount: 0,
          maxAttempts,
          windowMinutes,
          errorType: "unknown",
          originalError: String(error),
        },
      };
    }
  },

  /**
   * 종합적인 레이트 리미트 확인 (이메일 + IP + 브라우저)
   */
  async checkComprehensiveRateLimit(options: RateLimitOptions): Promise<{
    isAllowed: boolean;
    limitedBy: "email" | "ip" | "browser" | null;
    details: {
      email: RateLimitCheck;
      ip?: RateLimitCheck;
      browser?: RateLimitCheck;
    };
  }> {
    const results = {
      email: await this.checkRateLimit(options),
      ip: undefined as RateLimitCheck | undefined,
      browser: undefined as RateLimitCheck | undefined,
    };

    // IP 주소 기반 확인 (선택적)
    if (options.ipAddress) {
      results.ip = await this.checkIpRateLimit(options.ipAddress);
    }

    // 브라우저 fingerprint 기반 확인 (선택적)
    if (options.browserFingerprint) {
      results.browser = await this.checkBrowserSessionRateLimit(
        options.browserFingerprint,
      );
    }

    // 어떤 제한에 걸렸는지 확인
    let isAllowed = results.email.isAllowed;
    let limitedBy: "email" | "ip" | "browser" | null = null;

    if (!results.email.isAllowed) {
      limitedBy = "email";
      isAllowed = false;
    } else if (results.ip && !results.ip.isAllowed) {
      limitedBy = "ip";
      isAllowed = false;
    } else if (results.browser && !results.browser.isAllowed) {
      limitedBy = "browser";
      isAllowed = false;
    }

    return {
      isAllowed,
      limitedBy,
      details: results,
    };
  },

  /**
   * 사용자 친화적인 에러 메시지 생성
   */
  generateRateLimitMessage(rateLimitCheck: RateLimitCheck): string {
    if (rateLimitCheck.isAllowed) {
      return "";
    }

    const resetTime = rateLimitCheck.resetTime;
    const now = new Date();
    const minutesUntilReset = Math.ceil(
      (resetTime.getTime() - now.getTime()) / (1000 * 60),
    );

    if (minutesUntilReset <= 1) {
      return "너무 많은 인증 요청이 있었습니다. 잠시 후 다시 시도해주세요.";
    } else if (minutesUntilReset <= 60) {
      return `너무 많은 인증 요청이 있었습니다. ${minutesUntilReset}분 후에 다시 시도해주세요.`;
    } else {
      const hours = Math.ceil(minutesUntilReset / 60);
      return `너무 많은 인증 요청이 있었습니다. ${hours}시간 후에 다시 시도해주세요.`;
    }
  },

  /**
   * 데이터베이스 연결 및 테이블 상태 확인 (디버깅용)
   */
  async debugDatabaseConnection(): Promise<{
    isConnected: boolean;
    tablesExist: {
      auth_tokens: boolean;
      verification_codes: boolean;
      browser_sessions: boolean;
    };
    sampleQuery: {
      success: boolean;
      error?: string;
      count?: number;
    };
    error?: string;
  }> {
    try {
      const supabase = createSupabaseAdminClient();

      // 1. 기본 연결 테스트
      const { data: connectionTest, error: connectionError } = await supabase
        .from("auth_tokens")
        .select("count", { count: "exact" })
        .limit(0);

      if (connectionError) {
        return {
          isConnected: false,
          tablesExist: {
            auth_tokens: false,
            verification_codes: false,
            browser_sessions: false,
          },
          sampleQuery: {
            success: false,
            error: connectionError.message,
          },
          error: `데이터베이스 연결 실패: ${connectionError.message}`,
        };
      }

      // 2. 각 테이블 존재 여부 확인
      const tableChecks = await Promise.allSettled([
        supabase.from("auth_tokens").select("count", { count: "exact" }).limit(
          0,
        ),
        supabase.from("verification_codes").select("count", { count: "exact" })
          .limit(0),
        supabase.from("browser_sessions").select("count", { count: "exact" })
          .limit(0),
      ]);

      const tablesExist = {
        auth_tokens: tableChecks[0].status === "fulfilled",
        verification_codes: tableChecks[1].status === "fulfilled",
        browser_sessions: tableChecks[2].status === "fulfilled",
      };

      // 3. 샘플 쿼리 실행
      const { count, error: queryError } = await supabase
        .from("auth_tokens")
        .select("id", { count: "exact" })
        .limit(1);

      return {
        isConnected: true,
        tablesExist,
        sampleQuery: {
          success: !queryError,
          error: queryError?.message,
          count: count || 0,
        },
      };
    } catch (error) {
      return {
        isConnected: false,
        tablesExist: {
          auth_tokens: false,
          verification_codes: false,
          browser_sessions: false,
        },
        sampleQuery: {
          success: false,
          error: String(error),
        },
        error: `예상치 못한 에러: ${error}`,
      };
    }
  },

  /**
   * 특정 이메일의 레이트 리미트 상태 상세 조회 (디버깅용)
   */
  async debugEmailRateLimit(email: string): Promise<{
    tokens: Array<{
      id: string;
      created_at: string;
      used_at: string | null;
      expires_at: string;
      token_type: string;
    }>;
    summary: {
      total: number;
      active: number;
      expired: number;
      used: number;
      last15Minutes: number;
      last1Hour: number;
      last24Hours: number;
    };
    rateLimitStatus: RateLimitCheck;
  }> {
    try {
      const supabase = createSupabaseAdminClient();
      const now = new Date();

      // 최근 24시간 내 모든 토큰 조회
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const { data: tokens, error } = await supabase
        .from("auth_tokens")
        .select("id, created_at, used_at, expires_at, token_type")
        .eq("email", email)
        .gte("created_at", last24Hours.toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`토큰 조회 실패: ${error.message}`);
      }

      const tokenList = tokens || [];

      // 통계 계산
      const last15Minutes = new Date(now.getTime() - 15 * 60 * 1000);
      const last1Hour = new Date(now.getTime() - 60 * 60 * 1000);

      const summary = {
        total: tokenList.length,
        active: tokenList.filter((t) =>
          !t.used_at && new Date(t.expires_at) > now
        ).length,
        expired: tokenList.filter((t) => new Date(t.expires_at) <= now).length,
        used: tokenList.filter((t) => t.used_at).length,
        last15Minutes: tokenList.filter((t) =>
          new Date(t.created_at) >= last15Minutes
        ).length,
        last1Hour: tokenList.filter((t) =>
          new Date(t.created_at) >= last1Hour
        ).length,
        last24Hours: tokenList.length,
      };

      // 현재 레이트 리미트 상태 확인
      const rateLimitStatus = await this.checkRateLimit({ email });

      return {
        tokens: tokenList,
        summary,
        rateLimitStatus,
      };
    } catch (error) {
      // 에러 발생 시 빈 결과와 함께 에러 정보 반환
      const rateLimitStatus = await this.checkRateLimit({ email });

      return {
        tokens: [],
        summary: {
          total: 0,
          active: 0,
          expired: 0,
          used: 0,
          last15Minutes: 0,
          last1Hour: 0,
          last24Hours: 0,
        },
        rateLimitStatus: {
          ...rateLimitStatus,
          error: `디버깅 조회 실패: ${error}`,
        },
      };
    }
  },
};
