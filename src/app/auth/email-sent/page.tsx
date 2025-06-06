"use client";

import DefaultFooter from "@/components/layout/default-footer";
import DefaultHeader from "@/components/layout/default-hader";
import { useEmailSent } from "./hooks";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function EmailSentPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const t = useTranslations();

  const {
    isResending,
    resendTimer,
    error,
    handleResendLink,
    handleChangeEmail,
  } = useEmailSent(email);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <DefaultHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-card rounded-xl shadow-none flex flex-col items-center py-12">
          {/* 이메일 발송 완료 안내 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t("emailSentPage.title")}
            </h1>
            <p className="text-muted-foreground mb-2">
              {t("emailSentPage.subtitle")}
            </p>
            <p className="text-sm font-medium text-foreground">{email}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {t("emailSentPage.note")}
            </p>
          </div>

          {/* Magic Link 안내 */}
          <div className="w-full">
            <div className="p-4 bg-muted/30 rounded-lg border text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-foreground">
                  매직 링크로 로그인
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                이메일을 확인하고 매직 링크를 클릭하면 자동으로 로그인됩니다
              </p>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* 추가 옵션들 */}
          <div className="w-full mt-8 space-y-4">
            {/* 재발송 버튼 */}
            <button
              onClick={handleResendLink}
              disabled={isResending || resendTimer > 0}
              className="w-full flex items-center justify-center gap-2 h-11 px-4 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary/10 group"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isResending ? "animate-spin" : "group-hover:rotate-12"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isResending
                ? t("emailSentPage.resending")
                : resendTimer > 0
                  ? t("emailSentPage.resendTimer", { seconds: resendTimer })
                  : t("emailSentPage.resendLink")}
            </button>

            {/* 이메일 변경 */}
            <button
              onClick={handleChangeEmail}
              className="w-full flex items-center justify-center gap-2 h-11 px-4 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground font-medium rounded-lg transition-all duration-200 group"
            >
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {t("emailSentPage.changeEmail")}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <DefaultFooter />
    </div>
  );
}
