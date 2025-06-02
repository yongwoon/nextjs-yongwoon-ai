import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 클라이언트용 Supabase 인스턴스
export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);

// 서버 컴포넌트/서버 액션용 Supabase 인스턴스 생성 함수
export function createSupabaseServerClient(accessToken?: string) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
}
