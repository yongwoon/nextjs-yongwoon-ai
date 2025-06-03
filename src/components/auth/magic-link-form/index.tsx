"use client";

import { useMagicLinkForm } from "./hooks";

export default function MagicLinkForm({ isLoading }: { isLoading?: boolean }) {
  const { register, handleSubmit, errors } = useMagicLinkForm();

  return (
    <form
      className="space-y-4 w-full mx-auto"
      onSubmit={handleSubmit((data) => {
        console.log(data.email);
      })}
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
          placeholder="user@email.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
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
          {isLoading ? "전송 중..." : "매직 링크 받기"}
        </button>
      </div>
    </form>
  );
}
