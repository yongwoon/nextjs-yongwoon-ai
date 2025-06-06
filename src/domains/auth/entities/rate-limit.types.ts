// Rate limiting types

export interface RateLimitInfo {
  isAllowed: boolean;
  remainingAttempts: number;
  resetTime: Date;
  windowMinutes: number;
  maxAttempts: number;
}

export interface RateLimitCheck {
  isAllowed: boolean;
  remainingAttempts: number;
  resetTime: Date;
  error?: string;
}

export interface RateLimitOptions {
  email: string;
  ipAddress?: string;
  browserFingerprint?: string;
  userAgent?: string;
  windowMinutes?: number; // 기본 15분
  maxAttempts?: number; // 기본 3회
}
