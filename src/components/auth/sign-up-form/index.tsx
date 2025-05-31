"use client";
import React from "react";
import { useSignUpForm } from "./hooks";

export function SignUpForm() {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } =
    useSignUpForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-sm mx-auto"
    >
      <div>
        <label htmlFor="email" className="block font-medium mb-1">
          이메일
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full border rounded px-3 py-2"
          autoComplete="email"
        />
        {typeof errors.email?.message === "string" && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="block font-medium mb-1">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="w-full border rounded px-3 py-2"
          autoComplete="new-password"
        />
        {typeof errors.password?.message === "string" && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block font-medium mb-1">
          비밀번호 확인
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          className="w-full border rounded px-3 py-2"
          autoComplete="new-password"
        />
        {typeof errors.confirmPassword?.message === "string" && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "가입 중..." : "회원가입"}
      </button>
    </form>
  );
}
