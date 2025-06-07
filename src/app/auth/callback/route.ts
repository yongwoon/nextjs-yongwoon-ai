import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // 인증 성공 - 사용자를 원하는 페이지로 리다이렉트
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          // 개발 환경에서는 localhost로 리다이렉트
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          // 프로덕션 환경에서는 forwarded host 사용
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          // 기본값으로 origin 사용
          return NextResponse.redirect(`${origin}${next}`);
        }
      } else {
        console.error("인증 코드 교환 실패:", error);
        // 인증 실패 - 에러 페이지로 리다이렉트
        return NextResponse.redirect(
          `${origin}/auth/error?message=${
            encodeURIComponent(
              "인증에 실패했습니다. 다시 시도해주세요.",
            )
          }`,
        );
      }
    } catch (error) {
      console.error("콜백 처리 중 오류:", error);
      return NextResponse.redirect(
        `${origin}/auth/error?message=${
          encodeURIComponent(
            "인증 처리 중 오류가 발생했습니다.",
          )
        }`,
      );
    }
  }

  // 코드가 없는 경우 - 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login`);
}
