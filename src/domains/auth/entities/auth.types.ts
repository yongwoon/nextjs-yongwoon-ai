// Core authentication types

export interface AuthToken {
  id: string;
  email: string;
  token_hash: string;
  token_type: "magic_link" | "verification_code";
  expires_at: string;
  used_at: string | null;
  user_agent: string | null;
  ip_address: string | null;
  browser_fingerprint: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface VerificationCode {
  id: string;
  email: string;
  code: string;
  expires_at: string;
  used_at: string | null;
  auth_token_id: string;
  created_at: string;
}

export interface BrowserSession {
  id: string;
  email: string;
  browser_fingerprint: string;
  user_agent: string;
  ip_address: string | null;
  is_trusted: boolean;
  last_activity: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Token validation types
export interface TokenValidation {
  isValid: boolean;
  token?: AuthToken;
  error?: string;
  reason?: "expired" | "used" | "invalid" | "not_found";
}
