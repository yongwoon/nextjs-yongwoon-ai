import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/domains/auth/services/auth.service";

export function useEmailSent(email: string) {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 재발송 타이머 관리
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Magic Link 재발송
  const handleResendLink = async () => {
    if (resendTimer > 0 || isResending) {
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      const { error } = await AuthService.sendBothAuthMethods(
        email,
        window.location.origin + "/auth/callback",
      );

      if (error) {
        setError(error || "매직 링크 재발송에 실패했습니다.");
      } else {
        setResendTimer(60); // 60초 재발송 제한
      }
    } catch (e) {
      setError("알 수 없는 오류가 발생했습니다.");
      console.error(e);
    } finally {
      setIsResending(false);
    }
  };

  // 이메일 변경 (로그인 페이지로 돌아가기)
  const handleChangeEmail = () => {
    router.push("/login");
  };

  return {
    isResending,
    resendTimer,
    error,
    handleResendLink,
    handleChangeEmail,
  };
}
