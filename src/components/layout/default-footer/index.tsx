"use client";

import { useTranslations } from "next-intl";

export default function DefaultFooter() {
  const t = useTranslations();

  return (
    <footer className="w-full px-8 py-6 border-t border-border flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground bg-background">
      <span className="font-bold tracking-tight text-foreground">A\\</span>
      <div className="flex gap-4 mt-2 md:mt-0">
        <a href="#" className="hover:underline">
          {t("product")}
        </a>
        <a href="#" className="hover:underline">
          {t("research")}
        </a>
        <a href="#" className="hover:underline">
          {t("careers")}
        </a>
        <a href="#" className="hover:underline">
          {t("commercialTerms")}
        </a>
        <a href="#" className="hover:underline">
          {t("privacyPolicy")}
        </a>
        <a href="#" className="hover:underline">
          {t("yourPrivacyChoices")}
        </a>
      </div>
    </footer>
  );
}
