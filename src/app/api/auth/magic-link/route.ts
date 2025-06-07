import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/domains/auth/services";
import { z } from "zod";

// 요청 검증 스키마
const MagicLinkRequestSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  redirectTo: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 요청 데이터 검증
    const validationResult = MagicLinkRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "잘못된 요청 데이터입니다.",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const { email, redirectTo, metadata } = validationResult.data;

    // 클라이언트 정보 수집
    const userAgent = request.headers.get("user-agent") || undefined;
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwarded?.split(",")[0] || realIp || undefined;

    // 브라우저 fingerprint (간단한 버전)
    const browserFingerprint =
      request.headers.get("x-browser-fingerprint") || undefined;

    // 매직 링크 발송
    const result = await AuthService.sendMagicLinkWithOptions({
      email,
      redirectTo,
      userAgent,
      ipAddress,
      browserFingerprint,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json(result, {
        status: result.rateLimited ? 429 : 400,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("매직 링크 API 에러:", error);

    return NextResponse.json(
      {
        success: false,
        error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 },
    );
  }
}
