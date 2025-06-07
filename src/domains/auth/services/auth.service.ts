import { supabaseClient } from "@/lib/supabase";
import {
  AuthTokenService,
  type TokenGenerationOptions,
} from "./auth-token.service";
import { type RateLimitOptions, RateLimitService } from "./rate-limit.service";

export interface MagicLinkOptions {
  email: string;
  redirectTo?: string;
  userAgent?: string;
  ipAddress?: string;
  browserFingerprint?: string;
  metadata?: Record<string, any>;
}

export interface MagicLinkResult {
  success: boolean;
  error?: string;
  rateLimited?: boolean;
  remainingAttempts?: number;
  resetTime?: Date;
}

export const AuthService = {
  /**
   * 이메일로 매직 링크 발송 (레이트 리미팅 포함)
   */
  async sendMagicLink(
    email: string,
    redirectTo?: string,
  ): Promise<MagicLinkResult> {
    return this.sendMagicLinkWithOptions({
      email,
      redirectTo,
    });
  },

  /**
   * 매직 링크 발송 (확장된 옵션 포함)
   */
  async sendMagicLinkWithOptions(
    options: MagicLinkOptions,
  ): Promise<MagicLinkResult> {
    try {
      // 1. 레이트 리미트 확인
      const rateLimitCheck = await RateLimitService.checkComprehensiveRateLimit(
        {
          email: options.email,
          ipAddress: options.ipAddress,
          browserFingerprint: options.browserFingerprint,
          userAgent: options.userAgent,
        } as RateLimitOptions,
      );

      if (!rateLimitCheck.isAllowed) {
        // 디버깅 정보 로그
        console.log("Rate limit triggered:", {
          email: options.email,
          limitedBy: rateLimitCheck.limitedBy,
          details: rateLimitCheck.details,
        });

        // 개발 환경에서는 더 자세한 에러 메시지 제공
        const isDevelopment = process.env.NODE_ENV === "development";
        let errorMessage = RateLimitService.generateRateLimitMessage(
          rateLimitCheck.details.email,
        );

        // 개발 환경에서 디버깅 정보 추가
        if (isDevelopment && rateLimitCheck.details.email.debugInfo) {
          const debug = rateLimitCheck.details.email.debugInfo;

          if (debug.errorType === "database") {
            // DB 에러인 경우 명확한 안내 메시지
            errorMessage =
              `🚨 [개발 환경] 데이터베이스 연결 오류가 발생했습니다!\n\n`;
            errorMessage += `📋 해결 방법:\n`;
            errorMessage +=
              `1. Supabase 마이그레이션 실행: npx supabase db reset\n`;
            errorMessage +=
              `2. 환경 변수 확인: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY\n`;
            errorMessage +=
              `3. 테이블 존재 여부 확인: /api/auth/debug?action=connection\n\n`;
            errorMessage +=
              `⚠️ 현재는 개발을 위해 레이트 리미팅을 우회했지만, 실제 DB 문제를 해결해야 합니다.\n\n`;
            errorMessage += `원본 에러: ${debug.originalError}`;
          } else {
            // 일반적인 레이트 리미트인 경우
            errorMessage += `\n\n[개발 환경 디버깅 정보]\n`;
            errorMessage += `- 에러 타입: ${debug.errorType}\n`;
            errorMessage +=
              `- 시도 횟수: ${debug.attemptCount}/${debug.maxAttempts}\n`;
            errorMessage += `- 시간 윈도우: ${debug.windowMinutes}분\n`;
            if (debug.originalError) {
              errorMessage += `- 원본 에러: ${debug.originalError}\n`;
            }
          }
        }

        return {
          success: false,
          error: errorMessage,
          rateLimited: true,
          remainingAttempts: rateLimitCheck.details.email.remainingAttempts,
          resetTime: rateLimitCheck.details.email.resetTime,
        };
      }

      // 2. Supabase를 통한 매직 링크 발송
      const { error } = await supabaseClient.auth.signInWithOtp({
        email: options.email,
        options: {
          emailRedirectTo: options.redirectTo,
          data: options.metadata,
        },
      });

      if (error) {
        console.error("매직 링크 발송 실패:", error);
        return {
          success: false,
          error: "이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.",
        };
      }

      // 3. 성공적으로 발송된 후 토큰 생성 및 저장 (추적/로깅용)
      const tokenResult = await AuthTokenService.generateAndStoreToken({
        email: options.email,
        tokenType: "magic_link",
        userAgent: options.userAgent,
        ipAddress: options.ipAddress,
        browserFingerprint: options.browserFingerprint,
        metadata: options.metadata,
      } as TokenGenerationOptions);

      // 토큰 저장 실패는 로깅만 하고 사용자에게는 성공으로 응답
      if (!tokenResult.success) {
        console.warn(
          "토큰 저장 실패 (매직링크는 정상 발송됨):",
          tokenResult.error,
        );
      }

      return {
        success: true,
        remainingAttempts: rateLimitCheck.details.email.remainingAttempts,
      };
    } catch (error) {
      console.error("매직 링크 발송 중 오류:", error);
      return {
        success: false,
        error: "예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      };
    }
  },

  /**
   * 이메일로 OTP 코드 발송 (6자리 숫자)
   */
  async sendOtpCode(email: string) {
    return supabaseClient.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
  },

  /**
   * 현재 세션 확인
   */
  async getSession() {
    return supabaseClient.auth.getSession();
  },

  /**
   * 사용자 정보 가져오기
   */
  async getUser() {
    return supabaseClient.auth.getUser();
  },

  /**
   * 로그아웃
   */
  async signOut() {
    return supabaseClient.auth.signOut();
  },

  /**
   * 세션 설정 (access_token과 refresh_token으로)
   */
  async setSession(access_token: string, refresh_token: string) {
    return supabaseClient.auth.setSession({
      access_token,
      refresh_token,
    });
  },

  /**
   * Authorization code를 세션으로 교환 (PKCE 방식)
   */
  async exchangeCodeForSession(code: string) {
    return supabaseClient.auth.exchangeCodeForSession(code);
  },

  /**
   * OTP 토큰 검증 (매직 링크 콜백용)
   */
  async verifyOtp(
    token_hash: string,
    type: "email" | "magiclink" = "magiclink",
  ) {
    return supabaseClient.auth.verifyOtp({
      token_hash,
      type,
    });
  },

  /**
   * 이메일과 토큰으로 OTP 검증 (기존 호환성)
   */
  async verifyOtpWithEmail(email: string, token: string) {
    return supabaseClient.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
  },

  /**
   * 레이트 리미트 상태 확인 (프론트엔드용)
   */
  async checkRateLimitStatus(
    email: string,
    ipAddress?: string,
    browserFingerprint?: string,
  ): Promise<{
    isAllowed: boolean;
    remainingAttempts: number;
    resetTime: Date;
    message?: string;
  }> {
    const rateLimitCheck = await RateLimitService.checkRateLimit({
      email,
      ipAddress,
      browserFingerprint,
    });

    return {
      isAllowed: rateLimitCheck.isAllowed,
      remainingAttempts: rateLimitCheck.remainingAttempts,
      resetTime: rateLimitCheck.resetTime,
      message: rateLimitCheck.isAllowed
        ? undefined
        : RateLimitService.generateRateLimitMessage(rateLimitCheck),
    };
  },

  /**
   * 토큰 관리 유틸리티
   */
  token: {
    /**
     * 특정 이메일의 모든 토큰 무효화
     */
    async invalidateAll(email: string) {
      return AuthTokenService.invalidateAllTokensForEmail(email);
    },

    /**
     * 만료된 토큰 정리
     */
    async cleanup() {
      return AuthTokenService.cleanupExpiredTokens();
    },

    /**
     * 활성 토큰 개수 확인
     */
    async getActiveCount(email: string) {
      return AuthTokenService.getActiveTokenCount(email);
    },
  },
};
