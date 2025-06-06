"use client";

import { useMagicLinkForm } from "./hooks";
import { useTranslations } from "next-intl";

export default function MagicLinkForm({ isLoading }: { isLoading?: boolean }) {
  const { register, handleSubmit, errors, status, errorMsg, onSubmit } =
    useMagicLinkForm();
  const t = useTranslations();

  // 훅의 status를 우선적으로 사용하되, props로 전달된 isLoading도 고려
  const isFormLoading = status === "loading" || isLoading;

  return (
    <form
      className="space-y-4 w-full mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* 이메일 입력 + 버튼을 하나의 flex-col로 묶어서 너비 통일 */}
      <div className="flex flex-col gap-2 w-full">
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className={`
            w-full h-12 px-4
            border border-gray-300 rounded-md
            bg-white
            text-base
            focus:outline-none focus:ring-2 focus:ring-primary/50
            transition
            ${errors.email ? "border-red-500" : ""}
          `}
          placeholder={t("authComponent.magicLinkForm.placeholder")}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}

        {/* API 에러 메시지 표시 */}
        {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}

        {/* 성공 메시지 표시 */}
        {status === "success" && (
          <p className="text-xs text-green-600 mt-1">
            매직 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.
          </p>
        )}

        <button
          type="submit"
          disabled={isFormLoading}
          className={`
            w-full h-12
            rounded-md
            bg-primary text-white font-semibold
            hover:bg-primary/90
            transition
            disabled:opacity-60
            mt-2
          `}
        >
          {isFormLoading
            ? t("authComponent.magicLinkForm.sending")
            : t("authComponent.magicLinkForm.submit")}
        </button>
      </div>
    </form>
  );
}
