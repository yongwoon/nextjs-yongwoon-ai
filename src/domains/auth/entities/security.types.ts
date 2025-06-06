// Security context types

export interface SecurityContext {
  userAgent?: string;
  ipAddress?: string;
  browserFingerprint?: string;
  timestamp: Date;
}

// Event types for audit logging
export interface AuthEvent {
  type:
    | "magic_link_sent"
    | "magic_link_clicked"
    | "login_success"
    | "login_failed"
    | "rate_limited";
  email: string;
  securityContext: SecurityContext;
  metadata?: Record<string, any>;
  timestamp: Date;
}
