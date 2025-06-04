"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function DefaultHeader() {
  const t = useTranslations();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <span className="text-xl font-semibold text-gray-900">Gaemamusa</span>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          {t("signIn")}
        </Link>
        <Link
          href="/signup"
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {t("signUp")}
        </Link>
      </div>
    </header>
  );
}
