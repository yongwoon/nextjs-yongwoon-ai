"use client";

import DefaultFooter from "@/components/layout/default-footer";
import MagicLinkForm from "@/components/auth/magic-link-form";
import SocialLogin from "@/components/auth/social-login";
import OrDivider from "@/components/common/or-divider";
import DefaultHeader from "@/components/layout/default-hader";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <DefaultHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-card rounded-xl shadow-none flex flex-col items-center py-12">
          <h1 className="text-3xl font-bold text-center mb-2 text-foreground">
            {t("loginPage.title")}
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {t("loginPage.subtitle")}
          </p>

          {/* Google Login Button */}
          <SocialLogin />

          {/* OR Divider */}

          <OrDivider />

          {/* Email Input Form */}
          <div className="w-full mt-2">
            <MagicLinkForm isLoading={false} />
          </div>

          {/* 약관/정책 안내 */}
          <div className="w-full">
            <p className="text-xs text-muted-foreground mt-6 text-center">
              {t("loginPage.agreePrefix")}{" "}
              <a href="#" className="underline">
                {t("commercialTerms")}
              </a>{" "}
              {t("loginPage.and")}{" "}
              <a href="#" className="underline">
                {t("loginPage.usagePolicy")}
              </a>
              ,<br />
              {t("loginPage.acknowledge")}{" "}
              <a href="#" className="underline">
                {t("privacyPolicy")}
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      {/* 하단 카드형 링크 */}
      <section className="w-full flex justify-center gap-4 px-4 mt-12 mb-4">
        <div className="bg-card rounded-lg border border-border px-6 py-4 text-center text-sm">
          <div className="font-medium mb-1 text-foreground">
            {t("loginPage.developerDocs")}
          </div>
          <div className="text-muted-foreground">
            {t("loginPage.developerDocsDesc")}
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border px-6 py-4 text-center text-sm">
          <div className="font-medium mb-1 text-foreground">
            {t("loginPage.apiReference")}
          </div>
          <div className="text-muted-foreground">
            {t("loginPage.apiReferenceDesc")}
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border px-6 py-4 text-center text-sm">
          <div className="font-medium mb-1 text-foreground">
            {t("loginPage.cookbooks")}
          </div>
          <div className="text-muted-foreground">
            {t("loginPage.cookbooksDesc")}
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border px-6 py-4 text-center text-sm">
          <div className="font-medium mb-1 text-foreground">
            {t("loginPage.quickstarts")}
          </div>
          <div className="text-muted-foreground">
            {t("loginPage.quickstartsDesc")}
          </div>
        </div>
      </section>

      {/* Footer */}
      <DefaultFooter />
    </div>
  );
}
