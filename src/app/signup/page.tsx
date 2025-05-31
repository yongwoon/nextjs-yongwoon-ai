import React from "react";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>
      <SignUpForm />
    </div>
  );
}
