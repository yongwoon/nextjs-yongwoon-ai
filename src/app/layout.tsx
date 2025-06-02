import { Metadata } from "next";
import React, { Suspense } from "react";

import "@styles/global.css";

export const metadata: Metadata = {
  title: "Yongwoon AI",
  description: "AI-powered personal assistant",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
