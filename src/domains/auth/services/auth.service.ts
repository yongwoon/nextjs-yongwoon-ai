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
};
