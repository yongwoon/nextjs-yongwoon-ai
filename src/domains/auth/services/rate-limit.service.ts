import { createSupabaseAdminClient } from "@/lib/supabase";

export interface RateLimitCheck {
  isAllowed: boolean;
  remainingAttempts: number;
  resetTime: Date;
  error?: string;
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
        return {
          isAllowed: false,
          remainingAttempts: 0,
          resetTime: new Date(Date.now() + windowMinutes * 60 * 1000),
          error: "레이트 리미트 확인 중 오류가 발생했습니다.",
        };
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

      return {
        isAllowed,
        remainingAttempts,
        resetTime,
      };
    } catch (error) {
      console.error("레이트 리미트 확인 중 오류:", error);
      return {
        isAllowed: false,
        remainingAttempts: 0,
        resetTime: new Date(
          Date.now() + (options.windowMinutes || 15) * 60 * 1000,
        ),
        error: "레이트 리미트 확인 중 오류가 발생했습니다.",
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
        return {
          isAllowed: false,
          remainingAttempts: 0,
          resetTime: new Date(Date.now() + windowMinutes * 60 * 1000),
          error: "IP 레이트 리미트 확인 중 오류가 발생했습니다.",
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
      };
    } catch (error) {
      console.error("IP 레이트 리미트 확인 중 오류:", error);
      return {
        isAllowed: false,
        remainingAttempts: 0,
        resetTime: new Date(Date.now() + windowMinutes * 60 * 1000),
        error: "IP 레이트 리미트 확인 중 오류가 발생했습니다.",
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
        return {
          isAllowed: false,
          remainingAttempts: 0,
          resetTime: new Date(Date.now() + windowMinutes * 60 * 1000),
          error: "브라우저 세션 레이트 리미트 확인 중 오류가 발생했습니다.",
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
      };
    } catch (error) {
      console.error("브라우저 세션 레이트 리미트 확인 중 오류:", error);
      return {
        isAllowed: false,
        remainingAttempts: 0,
        resetTime: new Date(Date.now() + windowMinutes * 60 * 1000),
        error: "브라우저 세션 레이트 리미트 확인 중 오류가 발생했습니다.",
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
};
