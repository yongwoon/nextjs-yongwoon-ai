// Authentication result types
import type { Profile } from "./auth.types";
import type { RateLimitInfo } from "./rate-limit.types";

export interface AuthenticationResult {
  success: boolean;
  user?: Profile;
  session?: any; // Supabase session type
  error?: string;
  rateLimited?: boolean;
  rateLimitInfo?: RateLimitInfo;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface TokenGenerationResponse {
  success: boolean;
  tokenId?: string;
  token?: string; // 암호화된 토큰
  expiresAt?: Date;
  error?: string;
}
