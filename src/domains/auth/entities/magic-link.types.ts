// Magic link specific types
import { z } from "zod";

export interface MagicLinkRequest {
  email: string;
  redirectTo?: string;
  userAgent?: string;
  ipAddress?: string;
  browserFingerprint?: string;
  metadata?: Record<string, any>;
}

export interface MagicLinkResponse {
  success: boolean;
  error?: string;
  rateLimited?: boolean;
  remainingAttempts?: number;
  resetTime?: Date;
  tokenId?: string;
}

export interface MagicLinkOptions {
  email: string;
  redirectTo?: string;
  userAgent?: string;
  ipAddress?: string;
  browserFingerprint?: string;
  metadata?: Record<string, any>;
}

export interface MagicLinkResult {
  success: boolean;
  error?: string;
  rateLimited?: boolean;
  remainingAttempts?: number;
  resetTime?: Date;
}

// Validation schemas
export const magicLinkRequestSchema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요."),
});

export type MagicLinkRequestValidation = z.infer<typeof magicLinkRequestSchema>;
