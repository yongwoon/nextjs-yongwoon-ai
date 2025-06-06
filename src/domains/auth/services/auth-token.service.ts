import { type AuthToken, createSupabaseAdminClient } from "@/lib/supabase";
import { createHash, randomBytes } from "crypto";

export interface TokenGenerationOptions {
  email: string;
  tokenType: "magic_link" | "verification_code";
  expiresInMinutes?: number;
  userAgent?: string;
  ipAddress?: string;
  browserFingerprint?: string;
  metadata?: Record<string, any>;
}

export interface TokenValidationResult {
  isValid: boolean;
  token?: AuthToken;
  error?: string;
}

export const AuthTokenService = {
  /**
   * 새로운 인증 토큰 생성 및 저장
   */
  async generateAndStoreToken(options: TokenGenerationOptions): Promise<{
    success: boolean;
    tokenHash?: string;
    rawToken?: string;
    error?: string;
  }> {
    try {
      const supabase = createSupabaseAdminClient();

      // 32바이트 랜덤 토큰 생성
      const rawToken = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(rawToken).digest("hex");

      // 만료 시간 설정 (기본 15분)
      const expiresInMinutes = options.expiresInMinutes || 15;
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

      // 토큰 저장
      const { data, error } = await supabase
        .from("auth_tokens")
        .insert({
          email: options.email,
          token_hash: tokenHash,
          token_type: options.tokenType,
          expires_at: expiresAt.toISOString(),
          user_agent: options.userAgent || null,
          ip_address: options.ipAddress || null,
          browser_fingerprint: options.browserFingerprint || null,
          metadata: options.metadata || {},
        })
        .select()
        .single();

      if (error) {
        console.error("토큰 저장 실패:", error);
        return {
          success: false,
          error: "토큰 저장에 실패했습니다.",
        };
      }

      return {
        success: true,
        tokenHash,
        rawToken,
      };
    } catch (error) {
      console.error("토큰 생성 중 오류:", error);
      return {
        success: false,
        error: "토큰 생성 중 오류가 발생했습니다.",
      };
    }
  },

  /**
   * 토큰 검증 및 사용 처리
   */
  async validateAndUseToken(
    email: string,
    rawToken: string,
    tokenType: "magic_link" | "verification_code",
  ): Promise<TokenValidationResult> {
    try {
      const supabase = createSupabaseAdminClient();
      const tokenHash = createHash("sha256").update(rawToken).digest("hex");

      // 토큰 조회
      const { data: token, error: fetchError } = await supabase
        .from("auth_tokens")
        .select("*")
        .eq("email", email)
        .eq("token_hash", tokenHash)
        .eq("token_type", tokenType)
        .is("used_at", null)
        .single();

      if (fetchError || !token) {
        return {
          isValid: false,
          error: "유효하지 않은 토큰입니다.",
        };
      }

      // 만료 시간 확인
      const now = new Date();
      const expiresAt = new Date(token.expires_at);

      if (now > expiresAt) {
        return {
          isValid: false,
          error: "만료된 토큰입니다.",
        };
      }

      // 토큰을 사용됨으로 표시
      const { error: updateError } = await supabase
        .from("auth_tokens")
        .update({ used_at: now.toISOString() })
        .eq("id", token.id);

      if (updateError) {
        console.error("토큰 사용 처리 실패:", updateError);
        return {
          isValid: false,
          error: "토큰 처리 중 오류가 발생했습니다.",
        };
      }

      return {
        isValid: true,
        token,
      };
    } catch (error) {
      console.error("토큰 검증 중 오류:", error);
      return {
        isValid: false,
        error: "토큰 검증 중 오류가 발생했습니다.",
      };
    }
  },

  /**
   * 특정 이메일의 만료되지 않은 토큰 개수 조회
   */
  async getActiveTokenCount(
    email: string,
    tokenType?: "magic_link" | "verification_code",
  ): Promise<number> {
    try {
      const supabase = createSupabaseAdminClient();
      const now = new Date().toISOString();

      let query = supabase
        .from("auth_tokens")
        .select("id", { count: "exact" })
        .eq("email", email)
        .is("used_at", null)
        .gt("expires_at", now);

      if (tokenType) {
        query = query.eq("token_type", tokenType);
      }

      const { count } = await query;
      return count || 0;
    } catch (error) {
      console.error("활성 토큰 개수 조회 실패:", error);
      return 0;
    }
  },

  /**
   * 만료된 토큰 정리
   */
  async cleanupExpiredTokens(): Promise<
    { success: boolean; deletedCount?: number }
  > {
    try {
      const supabase = createSupabaseAdminClient();
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("auth_tokens")
        .delete()
        .lt("expires_at", now)
        .select("id");

      if (error) {
        console.error("만료된 토큰 정리 실패:", error);
        return { success: false };
      }

      return {
        success: true,
        deletedCount: data?.length || 0,
      };
    } catch (error) {
      console.error("토큰 정리 중 오류:", error);
      return { success: false };
    }
  },

  /**
   * 특정 이메일의 모든 활성 토큰 무효화
   */
  async invalidateAllTokensForEmail(
    email: string,
  ): Promise<{ success: boolean }> {
    try {
      const supabase = createSupabaseAdminClient();
      const now = new Date().toISOString();

      const { error } = await supabase
        .from("auth_tokens")
        .update({ used_at: now })
        .eq("email", email)
        .is("used_at", null);

      if (error) {
        console.error("토큰 무효화 실패:", error);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error("토큰 무효화 중 오류:", error);
      return { success: false };
    }
  },
};
