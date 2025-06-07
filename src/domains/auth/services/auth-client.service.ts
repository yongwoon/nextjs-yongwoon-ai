import type { MagicLinkOptions, MagicLinkResult } from "./auth.service";

/**
 * 클라이언트 사이드에서 사용하는 Auth 서비스
 * 실제 로직은 API 라우트를 통해 서버에서 실행됩니다.
 */
export const AuthClientService = {
  /**
   * 매직 링크 발송 (클라이언트용)
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
   * 매직 링크 발송 (확장된 옵션 포함, 클라이언트용)
   */
  async sendMagicLinkWithOptions(
    options: Omit<
      MagicLinkOptions,
      "userAgent" | "ipAddress" | "browserFingerprint"
    >,
  ): Promise<MagicLinkResult> {
    try {
      // 브라우저 fingerprint 생성 (간단한 버전)
      const browserFingerprint = await this.generateBrowserFingerprint();

      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Browser-Fingerprint": browserFingerprint,
        },
        body: JSON.stringify({
          email: options.email,
          redirectTo: options.redirectTo,
          metadata: options.metadata,
        }),
      });

      const result = await response.json();

      // HTTP 상태 코드에 따른 처리
      if (!response.ok) {
        return {
          success: false,
          error: result.error || "요청 처리 중 오류가 발생했습니다.",
          rateLimited: response.status === 429,
          remainingAttempts: result.remainingAttempts,
          resetTime: result.resetTime ? new Date(result.resetTime) : undefined,
        };
      }

      return {
        ...result,
        resetTime: result.resetTime ? new Date(result.resetTime) : undefined,
      };
    } catch (error) {
      console.error("매직 링크 발송 요청 실패:", error);
      return {
        success: false,
        error: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
      };
    }
  },

  /**
   * 간단한 브라우저 fingerprint 생성
   */
  async generateBrowserFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.fillText("Browser fingerprint", 2, 2);
      }

      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + "x" + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL(),
      ].join("|");

      // 간단한 해시 생성
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32bit integer로 변환
      }

      return Math.abs(hash).toString(36);
    } catch (error) {
      // fingerprint 생성 실패 시 랜덤 값 반환
      return Math.random().toString(36).substring(2, 15);
    }
  },

  /**
   * 현재 사용자의 레이트 리미트 상태 확인 (개발 환경용)
   */
  async checkRateLimitStatus(email: string): Promise<any> {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("이 기능은 개발 환경에서만 사용할 수 있습니다.");
    }

    try {
      const response = await fetch(
        `/api/auth/debug?action=email&email=${encodeURIComponent(email)}`,
      );
      return await response.json();
    } catch (error) {
      console.error("레이트 리미트 상태 확인 실패:", error);
      return null;
    }
  },
};
