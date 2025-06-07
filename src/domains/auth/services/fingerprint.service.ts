import FingerprintJS, {
  type Agent,
  type GetResult,
} from "@fingerprintjs/fingerprintjs";
import type { BrowserFingerprint } from "../entities/security.types";

// FingerprintJS 에이전트 인스턴스 (싱글턴)
let fpAgent: Agent | null = null;
let cachedResult: GetResult | null = null;

/**
 * FingerprintService: 브라우저 fingerprint를 생성/반환하는 서비스
 */
export class FingerprintService {
  /**
   * FingerprintJS 에이전트 초기화 (최초 1회)
   */
  private static async getAgent(): Promise<Agent> {
    if (!fpAgent) {
      fpAgent = await FingerprintJS.load();
    }
    return fpAgent;
  }

  /**
   * 고유 브라우저 fingerprint 반환 (캐싱 적용)
   */
  static async getFingerprint(): Promise<BrowserFingerprint> {
    if (cachedResult) {
      return cachedResult.visitorId;
    }
    const agent = await this.getAgent();
    cachedResult = await agent.get();
    return cachedResult.visitorId;
  }
}
