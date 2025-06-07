import { NextRequest, NextResponse } from "next/server";
import { RateLimitService } from "@/domains/auth/services";

export async function GET(request: NextRequest) {
  try {
    // 개발 환경에서만 접근 허용
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "이 엔드포인트는 개발 환경에서만 사용할 수 있습니다." },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const action = searchParams.get("action") || "connection";

    switch (action) {
      case "connection":
        // 데이터베이스 연결 상태 확인
        const connectionStatus = await RateLimitService
          .debugDatabaseConnection();
        return NextResponse.json({
          action: "database_connection_check",
          timestamp: new Date().toISOString(),
          result: connectionStatus,
        });

      case "email":
        // 특정 이메일의 레이트 리미트 상태 확인
        if (!email) {
          return NextResponse.json(
            { error: "email 파라미터가 필요합니다." },
            { status: 400 },
          );
        }

        const emailStatus = await RateLimitService.debugEmailRateLimit(email);
        return NextResponse.json({
          action: "email_rate_limit_check",
          email,
          timestamp: new Date().toISOString(),
          result: emailStatus,
        });

      case "test":
        // 레이트 리미트 테스트
        if (!email) {
          return NextResponse.json(
            { error: "email 파라미터가 필요합니다." },
            { status: 400 },
          );
        }

        const testResult = await RateLimitService.checkRateLimit({
          email,
          windowMinutes: 15,
          maxAttempts: 3,
        });

        return NextResponse.json({
          action: "rate_limit_test",
          email,
          timestamp: new Date().toISOString(),
          result: testResult,
        });

      default:
        return NextResponse.json(
          {
            error: "지원하지 않는 액션입니다.",
            supportedActions: ["connection", "email", "test"],
            usage: {
              connection: "/api/auth/debug?action=connection",
              email: "/api/auth/debug?action=email&email=test@example.com",
              test: "/api/auth/debug?action=test&email=test@example.com",
            },
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("디버깅 API 에러:", error);
    return NextResponse.json(
      {
        error: "디버깅 중 오류가 발생했습니다.",
        details: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
