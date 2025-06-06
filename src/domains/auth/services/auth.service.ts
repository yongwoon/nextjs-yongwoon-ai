import { supabaseClient } from "@/lib/supabase";

export const AuthService = {
  /**
   * 이메일로 매직 링크 발송
   */
  async sendMagicLink(email: string, redirectTo?: string) {
    return supabaseClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
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
   * Magic Link 발송
   * Supabase의 기본 동작으로 Magic Link만 발송됩니다.
   */
  async sendBothAuthMethods(email: string, redirectTo?: string) {
    return this.sendMagicLink(email, redirectTo);
  },

  /**
   * 현재 세션 확인
   */
  async getSession() {
    return supabaseClient.auth.getSession();
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
   * OTP 코드로 인증
   */
  async verifyOtp(email: string, token: string) {
    return supabaseClient.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
  },
};
