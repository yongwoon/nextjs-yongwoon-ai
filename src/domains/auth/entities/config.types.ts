// Configuration types

export interface AuthConfig {
  rateLimiting: {
    email: {
      windowMinutes: number;
      maxAttempts: number;
    };
    ip: {
      windowMinutes: number;
      maxAttempts: number;
    };
    browser: {
      windowMinutes: number;
      maxAttempts: number;
    };
  };
  tokens: {
    magicLinkExpiryMinutes: number;
    verificationCodeExpiryMinutes: number;
  };
  security: {
    requireBrowserFingerprint: boolean;
    trustNewDevices: boolean;
    sessionTimeoutMinutes: number;
  };
}

export interface AuthServiceConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  redirectTo?: string;
  debug?: boolean;
}
