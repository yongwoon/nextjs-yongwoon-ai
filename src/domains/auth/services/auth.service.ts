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
};
