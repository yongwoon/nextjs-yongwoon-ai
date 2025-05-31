import React from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <LoginForm />
    </div>
  );
}
