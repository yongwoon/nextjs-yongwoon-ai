import { createSupabaseAdminClient } from "@/lib/supabase";

export interface CleanupStats {
  expiredTokensDeleted: number;
  oldSessionsDeleted: number;
  totalProcessingTime: number;
  errors: string[];
}

export interface MonitoringData {
  activeTokensCount: number;
  recentAttempts: {
    last1Hour: number;
    last24Hours: number;
    last7Days: number;
  };
  rateLimitedEmails: string[];
  suspiciousActivity: {
    highVolumeIps: string[];
    multipleEmailsFromSameFingerprint: string[];
  };
}

export const AuthCleanupService = {
  /**
   * 만료된 토큰과 오래된 세션 정리
   */
  async performCleanup(): Promise<CleanupStats> {
    const startTime = Date.now();
    const stats: CleanupStats = {
      expiredTokensDeleted: 0,
      oldSessionsDeleted: 0,
      totalProcessingTime: 0,
      errors: [],
    };

    try {
      const supabase = createSupabaseAdminClient();
      const now = new Date().toISOString();

      // 1. 만료된 인증 토큰 삭제 (만료된 지 1시간 이상 경과)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      try {
        const { data: expiredTokens, error: tokenError } = await supabase
          .from("auth_tokens")
          .delete()
          .lt("expires_at", oneHourAgo)
          .select("id");

        if (tokenError) {
          stats.errors.push(`토큰 삭제 실패: ${tokenError.message}`);
        } else {
          stats.expiredTokensDeleted = expiredTokens?.length || 0;
        }
      } catch (error) {
        stats.errors.push(`토큰 삭제 중 오류: ${error}`);
      }

      // 2. 오래된 브라우저 세션 정리 (30일 이상 비활성)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString();

      try {
        const { data: oldSessions, error: sessionError } = await supabase
          .from("browser_sessions")
          .delete()
          .lt("last_activity", thirtyDaysAgo)
          .select("id");

        if (sessionError) {
          stats.errors.push(`세션 삭제 실패: ${sessionError.message}`);
        } else {
          stats.oldSessionsDeleted = oldSessions?.length || 0;
        }
      } catch (error) {
        stats.errors.push(`세션 삭제 중 오류: ${error}`);
      }

      // 3. 사용된 검증 코드 정리 (7일 이상 경과)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString();

      try {
        const { error: codeError } = await supabase
          .from("verification_codes")
          .delete()
          .not("used_at", "is", null)
          .lt("used_at", sevenDaysAgo);

        if (codeError) {
          stats.errors.push(`검증 코드 삭제 실패: ${codeError.message}`);
        }
      } catch (error) {
        stats.errors.push(`검증 코드 삭제 중 오류: ${error}`);
      }
    } catch (error) {
      stats.errors.push(`전체 정리 과정 중 오류: ${error}`);
    }

    stats.totalProcessingTime = Date.now() - startTime;
    return stats;
  },

  /**
   * 보안 모니터링 데이터 수집
   */
  async getMonitoringData(): Promise<MonitoringData> {
    const supabase = createSupabaseAdminClient();
    const now = new Date();

    const data: MonitoringData = {
      activeTokensCount: 0,
      recentAttempts: {
        last1Hour: 0,
        last24Hours: 0,
        last7Days: 0,
      },
      rateLimitedEmails: [],
      suspiciousActivity: {
        highVolumeIps: [],
        multipleEmailsFromSameFingerprint: [],
      },
    };

    try {
      // 1. 활성 토큰 개수
      const { count: activeTokens } = await supabase
        .from("auth_tokens")
        .select("id", { count: "exact" })
        .is("used_at", null)
        .gt("expires_at", now.toISOString());

      data.activeTokensCount = activeTokens || 0;

      // 2. 최근 시도 횟수
      const last1Hour = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        .toISOString();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString();

      const [hour, day, week] = await Promise.all([
        supabase.from("auth_tokens").select("id", { count: "exact" }).gte(
          "created_at",
          last1Hour,
        ),
        supabase.from("auth_tokens").select("id", { count: "exact" }).gte(
          "created_at",
          last24Hours,
        ),
        supabase.from("auth_tokens").select("id", { count: "exact" }).gte(
          "created_at",
          last7Days,
        ),
      ]);

      data.recentAttempts = {
        last1Hour: hour.count || 0,
        last24Hours: day.count || 0,
        last7Days: week.count || 0,
      };

      // 3. 레이트 리미트에 걸린 이메일들 (15분 내 3회 이상)
      const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000)
        .toISOString();

      const { data: recentTokens } = await supabase
        .from("auth_tokens")
        .select("email")
        .gte("created_at", fifteenMinutesAgo);

      if (recentTokens) {
        const emailCounts = recentTokens.reduce((acc, token) => {
          acc[token.email] = (acc[token.email] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        data.rateLimitedEmails = Object.keys(emailCounts).filter((email) =>
          emailCounts[email] >= 3
        );
      }

      // 4. 의심스러운 활동 감지
      // 4-1. 높은 볼륨의 IP 주소들 (1시간 내 10회 이상)
      const { data: ipTokens } = await supabase
        .from("auth_tokens")
        .select("ip_address")
        .gte("created_at", last1Hour)
        .not("ip_address", "is", null);

      if (ipTokens) {
        const ipCounts = ipTokens.reduce((acc, token) => {
          if (token.ip_address) {
            acc[token.ip_address] = (acc[token.ip_address] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        data.suspiciousActivity.highVolumeIps = Object.keys(ipCounts).filter(
          (ip) => ipCounts[ip] >= 10,
        );
      }

      // 4-2. 같은 브라우저 fingerprint에서 여러 이메일 사용 (24시간 내)
      const { data: fingerprintTokens } = await supabase
        .from("auth_tokens")
        .select("browser_fingerprint, email")
        .gte("created_at", last24Hours)
        .not("browser_fingerprint", "is", null);

      if (fingerprintTokens) {
        const fingerprintEmails = fingerprintTokens.reduce((acc, token) => {
          if (token.browser_fingerprint) {
            if (!acc[token.browser_fingerprint]) {
              acc[token.browser_fingerprint] = new Set();
            }
            acc[token.browser_fingerprint].add(token.email);
          }
          return acc;
        }, {} as Record<string, Set<string>>);

        data.suspiciousActivity.multipleEmailsFromSameFingerprint = Object.keys(
          fingerprintEmails,
        )
          .filter((fingerprint) => fingerprintEmails[fingerprint].size >= 3);
      }
    } catch (error) {
      console.error("모니터링 데이터 수집 중 오류:", error);
    }

    return data;
  },

  /**
   * 자동 정리 작업 스케줄링용 (cron job에서 호출)
   */
  async scheduleCleanup(): Promise<void> {
    try {
      console.log("인증 시스템 정리 작업 시작...");

      const stats = await this.performCleanup();
      const monitoring = await this.getMonitoringData();

      console.log("정리 작업 완료:", {
        stats,
        monitoring: {
          activeTokens: monitoring.activeTokensCount,
          rateLimitedEmails: monitoring.rateLimitedEmails.length,
          suspiciousIps: monitoring.suspiciousActivity.highVolumeIps.length,
        },
      });

      // 의심스러운 활동이 감지되면 알림 (실제 환경에서는 슬랙, 이메일 등으로)
      if (
        monitoring.suspiciousActivity.highVolumeIps.length > 0 ||
        monitoring.suspiciousActivity.multipleEmailsFromSameFingerprint.length >
          0
      ) {
        console.warn("⚠️ 의심스러운 활동 감지:", monitoring.suspiciousActivity);
      }
    } catch (error) {
      console.error("정리 작업 스케줄링 중 오류:", error);
    }
  },

  /**
   * 특정 이메일의 인증 기록 조회 (디버깅용)
   */
  async getEmailAuthHistory(email: string, limitDays: number = 7): Promise<{
    tokens: any[];
    sessions: any[];
    totalAttempts: number;
  }> {
    try {
      const supabase = createSupabaseAdminClient();
      const sinceDate = new Date(Date.now() - limitDays * 24 * 60 * 60 * 1000)
        .toISOString();

      const [tokensResult, sessionsResult] = await Promise.all([
        supabase
          .from("auth_tokens")
          .select("*")
          .eq("email", email)
          .gte("created_at", sinceDate)
          .order("created_at", { ascending: false }),
        supabase
          .from("browser_sessions")
          .select("*")
          .eq("email", email)
          .gte("created_at", sinceDate)
          .order("created_at", { ascending: false }),
      ]);

      return {
        tokens: tokensResult.data || [],
        sessions: sessionsResult.data || [],
        totalAttempts: (tokensResult.data || []).length,
      };
    } catch (error) {
      console.error("이메일 인증 기록 조회 실패:", error);
      return {
        tokens: [],
        sessions: [],
        totalAttempts: 0,
      };
    }
  },
};
