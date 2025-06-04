"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function IndexPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 mb-8">{t("description")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {t("getStarted")}
            </Link>
            <Link
              href="/login"
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {t("signIn")}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500">
          <p>{t("copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
