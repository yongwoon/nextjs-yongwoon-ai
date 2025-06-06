import {
  AuthCleanupService,
  AuthService,
  AuthTokenService,
} from "@/domains/auth/services";

// 개발 환경에서만 사용하는 테스트 유틸리티
export const AuthTestUtils = {
  /**
   * 레이트 리미트 테스트 - 연속으로 이메일 발송 시도
   */
  async testRateLimit(email: string, attempts: number = 5): Promise<void> {
    console.log(`🧪 레이트 리미트 테스트 시작 - ${email}에 ${attempts}회 시도`);

    for (let i = 1; i <= attempts; i++) {
      console.log(`\n--- 시도 ${i}/${attempts} ---`);

      const result = await AuthService.sendMagicLink(
        email,
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      );

      console.log(`결과:`, {
        success: result.success,
        error: result.error,
        rateLimited: result.rateLimited,
        remainingAttempts: result.remainingAttempts,
      });

      // 각 시도 사이에 1초 대기
      if (i < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(`\n✅ 레이트 리미트 테스트 완료`);
  },

  /**
   * 토큰 생성 및 검증 테스트
   */
  async testTokenFlow(email: string): Promise<void> {
    console.log(`🧪 토큰 플로우 테스트 시작 - ${email}`);

    // 1. 토큰 생성
    console.log("\n1. 토큰 생성 중...");
    const tokenResult = await AuthTokenService.generateAndStoreToken({
      email,
      tokenType: "magic_link",
      userAgent: "test-user-agent",
      ipAddress: "127.0.0.1",
      browserFingerprint: "test-fingerprint",
      metadata: { test: true },
    });

    console.log("토큰 생성 결과:", {
      success: tokenResult.success,
      hasTokenHash: !!tokenResult.tokenHash,
      hasRawToken: !!tokenResult.rawToken,
      error: tokenResult.error,
    });

    if (!tokenResult.success || !tokenResult.rawToken) {
      console.log("❌ 토큰 생성 실패");
      return;
    }

    // 2. 토큰 검증 (유효한 토큰)
    console.log("\n2. 유효한 토큰 검증 중...");
    const validationResult = await AuthTokenService.validateAndUseToken(
      email,
      tokenResult.rawToken,
      "magic_link",
    );

    console.log("토큰 검증 결과:", {
      isValid: validationResult.isValid,
      hasToken: !!validationResult.token,
      error: validationResult.error,
    });

    // 3. 사용된 토큰 재검증 (실패해야 함)
    console.log("\n3. 사용된 토큰 재검증 중...");
    const revalidationResult = await AuthTokenService.validateAndUseToken(
      email,
      tokenResult.rawToken,
      "magic_link",
    );

    console.log("재검증 결과 (실패해야 함):", {
      isValid: revalidationResult.isValid,
      error: revalidationResult.error,
    });

    console.log(`\n✅ 토큰 플로우 테스트 완료`);
  },

  /**
   * 활성 토큰 상태 확인
   */
  async checkTokenStatus(email: string): Promise<void> {
    console.log(`🧪 토큰 상태 확인 - ${email}`);

    const activeCount = await AuthTokenService.getActiveTokenCount(email);
    const rateLimitStatus = await AuthService.checkRateLimitStatus(email);

    console.log("현재 상태:", {
      activeTokens: activeCount,
      rateLimitStatus,
    });
  },

  /**
   * 모니터링 데이터 확인
   */
  async checkMonitoringData(): Promise<void> {
    console.log(`🧪 모니터링 데이터 확인`);

    const monitoringData = await AuthCleanupService.getMonitoringData();

    console.log("모니터링 데이터:", {
      activeTokensCount: monitoringData.activeTokensCount,
      recentAttempts: monitoringData.recentAttempts,
      rateLimitedEmails: monitoringData.rateLimitedEmails,
      suspiciousActivity: monitoringData.suspiciousActivity,
    });
  },

  /**
   * 정리 작업 테스트
   */
  async testCleanup(): Promise<void> {
    console.log(`🧪 정리 작업 테스트`);

    const cleanupStats = await AuthCleanupService.performCleanup();

    console.log("정리 작업 결과:", cleanupStats);
  },

  /**
   * 종합 테스트 실행
   */
  async runComprehensiveTest(
    testEmail: string = "test@example.com",
  ): Promise<void> {
    console.log(`🚀 종합 테스트 시작 - ${testEmail}`);
    console.log("=".repeat(50));

    try {
      // 1. 초기 상태 확인
      await this.checkTokenStatus(testEmail);

      // 2. 토큰 플로우 테스트
      await this.testTokenFlow(testEmail);

      // 3. 레이트 리미트 테스트 (3회만 - 제한에 걸리지 않도록)
      await this.testRateLimit(testEmail, 3);

      // 4. 모니터링 데이터 확인
      await this.checkMonitoringData();

      // 5. 정리 작업 테스트
      await this.testCleanup();

      console.log("\n" + "=".repeat(50));
      console.log(`✅ 종합 테스트 완료`);
    } catch (error) {
      console.error("\n❌ 테스트 중 오류 발생:", error);
    }
  },
};

// 개발 환경에서만 전역에 노출
if (process.env.NODE_ENV === "development") {
  (globalThis as any).AuthTestUtils = AuthTestUtils;
  console.log(
    "🔧 AuthTestUtils가 전역으로 노출되었습니다. 콘솔에서 AuthTestUtils.runComprehensiveTest() 실행 가능",
  );
}
