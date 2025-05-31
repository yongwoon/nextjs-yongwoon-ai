"use client";
import React from "react";
import { useLoginForm } from "./hooks";

export function LoginForm() {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } =
    useLoginForm();

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
          autoComplete="current-password"
        />
        {typeof errors.password?.message === "string" && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
