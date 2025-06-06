"use client";

import { useAuthCallback } from "./hooks";

export default function AuthCallbackPage() {
  const { status, message } = useAuthCallback();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4">
          {status === "loading" && (
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          )}
          {status === "success" && (
            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {status === "error" && (
            <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>
        <p className="text-lg font-medium">{message}</p>
        {status === "error" && (
          <p className="text-sm text-muted-foreground mt-2">
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        )}
      </div>
    </div>
  );
}
