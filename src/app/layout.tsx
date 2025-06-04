import { Metadata } from "next";
import React, { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import "@styles/global.css";

export const metadata: Metadata = {
  title: "Yongwoon AI",
  description: "AI-powered personal assistant",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const locale = await getLocale();

  console.log("-------------------- AAAA");
  console.log(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <Suspense>{children}</Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
