// Error types

export type AuthErrorCode =
  | "RATE_LIMITED"
  | "INVALID_EMAIL"
  | "TOKEN_EXPIRED"
  | "TOKEN_INVALID"
  | "TOKEN_USED"
  | "EMAIL_SEND_FAILED"
  | "DATABASE_ERROR"
  | "UNEXPECTED_ERROR";

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}
