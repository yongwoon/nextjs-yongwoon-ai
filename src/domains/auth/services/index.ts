// Auth services exports
export { AuthService } from "./auth.service";
export { AuthClientService } from "./auth-client.service";
export { AuthTokenService } from "./auth-token.service";
export { RateLimitService } from "./rate-limit.service";
export { AuthCleanupService } from "./auth-cleanup.service";

// Types exports
export type { MagicLinkOptions, MagicLinkResult } from "./auth.service";

export type {
  TokenGenerationOptions,
  TokenValidationResult,
} from "./auth-token.service";

export type { RateLimitCheck, RateLimitOptions } from "./rate-limit.service";

export type { CleanupStats, MonitoringData } from "./auth-cleanup.service";
