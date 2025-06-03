"use client";

import DefaultFooter from "@/components/layout/default-footer";
import MagicLinkForm from "@/components/auth/magic-link-form";
import SocialLogin from "@/components/auth/social-login";
import OrDivider from "@/components/common/or-divider";
import DefaultHeader from "@/components/layout/default-hader";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <DefaultHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-card rounded-xl shadow-none flex flex-col items-center py-12">
          <h1 className="text-3xl font-bold text-center mb-2 text-foreground">
            Build with Gaemamusa
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Sign in or create a developer account to build with the Gaemamusa
            API
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
              By continuing, you agree to Gaemamusa&apos;s{" "}
              <a href="#" className="underline">
                Commercial Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Usage Policy
              </a>
              ,<br />
              and acknowledge our{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      {/* 하단 카드형 링크 */}
      <section className="w-full flex justify-center gap-4 px-4 mt-12 mb-4">
        <div className="bg-card rounded-lg border border-border px-6 py-4 text-center text-sm">
          <div className="font-medium mb-1 text-foreground">Developer Docs</div>
          <div className="text-muted-foreground">
            Get started with Gaemamusa&apos;s API and Gaemamusa
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border px-6 py-4 text-center text-sm">
          <div className="font-medium mb-1 text-foreground">API Reference</div>
          <div className="text-muted-foreground">
            Integrate and scale using Gaemamusa&apos;s API
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border px-6 py-4 text-center text-sm">
          <div className="font-medium mb-1 text-foreground">Cookbooks</div>
          <div className="text-muted-foreground">
            Practical code examples and best practices
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border px-6 py-4 text-center text-sm">
          <div className="font-medium mb-1 text-foreground">Quickstarts</div>
          <div className="text-muted-foreground">
            Sample apps built with Gaemamusa&apos;s API
          </div>
        </div>
      </section>

      {/* Footer */}
      <DefaultFooter />
    </div>
  );
}
