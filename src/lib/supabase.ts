import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// 환경 변수 검증
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// 클라이언트용 Supabase 인스턴스 (브라우저에서 사용)
export const supabaseClient = createClient<Database>(
  supabaseUrl!,
  supabaseAnonKey!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        "X-Client-Info": "nextjs-yongwoon-ai",
      },
    },
  },
);

// 서버 컴포넌트/서버 액션용 Supabase 인스턴스 생성 함수
export function createSupabaseServerClient(accessToken?: string) {
  return createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: accessToken
        ? {
          Authorization: `Bearer ${accessToken}`,
          "X-Client-Info": "nextjs-yongwoon-ai-server",
        }
        : {
          "X-Client-Info": "nextjs-yongwoon-ai-server",
        },
    },
  });
}

// 관리자용 Supabase 인스턴스 (서버 전용)
export function createSupabaseAdminClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error(
      "Missing env.SUPABASE_SERVICE_ROLE_KEY - Admin client cannot be created",
    );
  }

  return createClient<Database>(supabaseUrl!, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "X-Client-Info": "nextjs-yongwoon-ai-admin",
      },
    },
  });
}

// 타입 안전한 테이블 접근을 위한 헬퍼
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// 자주 사용되는 테이블 타입들
export type Profile = Tables<"profiles">;
export type Conversation = Tables<"conversations">;
export type Message = Tables<"messages">;
export type Document = Tables<"documents">;
export type AuthToken = Tables<"auth_tokens">;
export type VerificationCode = Tables<"verification_codes">;
export type BrowserSession = Tables<"browser_sessions">;

// 인증 관련 헬퍼 함수들
export const auth = {
  /**
   * 현재 사용자 세션을 가져옵니다
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    return { user, error };
  },

  /**
   * 현재 사용자 세션을 가져옵니다
   */
  async getCurrentSession() {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    return { session, error };
  },

  /**
   * 사용자 로그아웃
   */
  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    return { error };
  },

  /**
   * 이메일로 매직 링크 전송
   */
  async signInWithMagicLink(email: string, redirectTo?: string) {
    const { data, error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    return { data, error };
  },

  /**
   * OTP 코드로 인증
   */
  async verifyOtp(
    email: string,
    token: string,
    type: "magiclink" | "signup" | "invite" | "recovery" = "magiclink",
  ) {
    const { data, error } = await supabaseClient.auth.verifyOtp({
      email,
      token,
      type,
    });
    return { data, error };
  },
};

// 실시간 구독을 위한 헬퍼
export const realtime = {
  /**
   * 대화의 메시지 변경사항을 구독합니다
   */
  subscribeToConversationMessages(
    conversationId: string,
    callback: (payload: any) => void,
  ) {
    return supabaseClient
      .channel(`conversation-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        callback,
      )
      .subscribe();
  },

  /**
   * 사용자의 대화 변경사항을 구독합니다
   */
  subscribeToUserConversations(
    userId: string,
    callback: (payload: any) => void,
  ) {
    return supabaseClient
      .channel(`user-conversations-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `user_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe();
  },
};

// 에러 처리 유틸리티
export function handleSupabaseError(error: any): string {
  if (!error) return "";

  // PostgreSQL 에러 코드 매핑
  const errorCodeMessages: Record<string, string> = {
    "23505": "이미 존재하는 데이터입니다.",
    "23503": "참조하는 데이터가 존재하지 않습니다.",
    "23514": "데이터 형식이 올바르지 않습니다.",
    "42501": "권한이 없습니다.",
    "PGRST116": "요청한 리소스를 찾을 수 없습니다.",
  };

  if (error.code && errorCodeMessages[error.code]) {
    return errorCodeMessages[error.code];
  }

  if (error.message) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
}

// 서버 측 유틸리티
export const serverUtils = {
  /**
   * Next.js Request에서 Supabase 클라이언트를 생성합니다
   */
  createClientFromRequest(request: Request) {
    const authHeader = request.headers.get("authorization");
    const accessToken = authHeader?.replace("Bearer ", "");
    return createSupabaseServerClient(accessToken);
  },

  /**
   * cookies를 사용한 서버 클라이언트 생성 (Next.js App Router)
   */
  async createClientFromCookies() {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    // Supabase 세션 쿠키에서 토큰 추출
    const accessToken = cookieStore.get("sb-access-token")?.value;

    return createSupabaseServerClient(accessToken);
  },

  /**
   * 사용자 인증 상태 확인
   */
  async getCurrentUserFromRequest(request: Request) {
    const client = this.createClientFromRequest(request);
    const { data: { user }, error } = await client.auth.getUser();
    return { user, error };
  },

  /**
   * RLS 정책 우회를 위한 관리자 클라이언트 (주의해서 사용)
   */
  getAdminClient() {
    return createSupabaseAdminClient();
  },
};

// 데이터베이스 연결 상태 확인
export async function checkDatabaseConnection(): Promise<
  { success: boolean; error?: string }
> {
  try {
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("id")
      .limit(1);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : "Unknown database connection error",
    };
  }
}

// RLS(Row Level Security) 관련 유틸리티
export const rls = {
  /**
   * 사용자가 리소스에 접근할 수 있는지 확인
   */
  async canAccessResource(
    userId: string,
    resourceType: "conversation" | "message" | "document",
    resourceId: string,
  ): Promise<boolean> {
    try {
      switch (resourceType) {
        case "conversation":
          const conversationQuery = await supabaseClient
            .from("conversations")
            .select("id")
            .eq("id", resourceId)
            .eq("user_id", userId)
            .single();

          return !conversationQuery.error && !!conversationQuery.data;

        case "message":
          // 메시지의 경우 대화를 통해 사용자 소유권을 확인
          const messageQuery = await supabaseClient
            .from("messages")
            .select(`
              id,
              conversation_id,
              conversations!inner(user_id)
            `)
            .eq("id", resourceId)
            .eq("conversations.user_id", userId)
            .single();

          return !messageQuery.error && !!messageQuery.data;

        case "document":
          const documentQuery = await supabaseClient
            .from("documents")
            .select("id")
            .eq("id", resourceId)
            .eq("user_id", userId)
            .single();

          return !documentQuery.error && !!documentQuery.data;

        default:
          return false;
      }
    } catch {
      return false;
    }
  },
};

// 배치 작업을 위한 유틸리티
export const batch = {
  /**
   * 여러 메시지를 한 번에 삽입
   */
  async insertMessages(messages: TablesInsert<"messages">[]) {
    return await supabaseClient
      .from("messages")
      .insert(messages);
  },

  /**
   * 여러 문서를 한 번에 삽입
   */
  async insertDocuments(documents: TablesInsert<"documents">[]) {
    return await supabaseClient
      .from("documents")
      .insert(documents);
  },
};

// 성능 모니터링을 위한 유틸리티
export const monitoring = {
  /**
   * 쿼리 성능을 측정합니다
   */
  async measureQuery<T>(
    queryFn: () => Promise<T>,
    queryName: string,
  ): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    const result = await queryFn();
    const duration = Date.now() - startTime;

    // 개발 환경에서만 로깅
    if (process.env.NODE_ENV === "development") {
      console.log(`[Supabase Query] ${queryName}: ${duration}ms`);
    }

    return { result, duration };
  },
};
