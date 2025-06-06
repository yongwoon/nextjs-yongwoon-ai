import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/domains/auth/services/auth.service";

export function useAuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("인증 처리 중...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL fragment에서 파라미터 추출
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );
        // URL search params에서도 추출
        const searchParams = new URLSearchParams(window.location.search);

        // 에러 체크 (search params에서)
        const error = searchParams.get("error") || hashParams.get("error");
        const error_code =
          searchParams.get("error_code") || hashParams.get("error_code");
        const error_description =
          searchParams.get("error_description") ||
          hashParams.get("error_description");

        if (error || error_code || error_description) {
          let errorMessage = "인증에 실패했습니다.";

          if (error_code === "otp_exp") {
            errorMessage =
              "매직 링크가 만료되었습니다. 새로운 링크를 요청해주세요.";
          } else if (error === "access_denied") {
            errorMessage = "인증이 거부되었습니다.";
          } else if (error_description) {
            errorMessage = error_description;
          }

          setStatus("error");
          setMessage(errorMessage);

          // 3초 후 로그인 페이지로 리다이렉트
          setTimeout(() => {
            router.push(
              `/login?error=authentication_failed&message=${encodeURIComponent(errorMessage)}`,
            );
          }, 3000);
          return;
        }

        // access_token이 fragment에 있는 경우
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");

        if (access_token && refresh_token) {
          const { data, error } = await AuthService.setSession(
            access_token,
            refresh_token,
          );

          if (error) {
            throw new Error(error.message);
          }

          if (data.user) {
            setStatus("success");
            setMessage("인증이 완료되었습니다. 홈으로 이동합니다...");

            setTimeout(() => {
              router.push("/");
            }, 1000);
            return;
          }
        }

        // authorization code가 있는 경우
        const code = searchParams.get("code");
        if (code) {
          const { data, error } =
            await AuthService.exchangeCodeForSession(code);

          if (error) {
            throw new Error(error.message);
          }

          if (data.user) {
            setStatus("success");
            setMessage("인증이 완료되었습니다. 홈으로 이동합니다...");

            setTimeout(() => {
              router.push("/");
            }, 1000);
            return;
          }
        }

        // 토큰이 없는 경우
        throw new Error("인증 토큰을 찾을 수 없습니다.");
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
        );

        setTimeout(() => {
          router.push(
            `/login?error=authentication_failed&message=${encodeURIComponent("인증 처리 중 오류가 발생했습니다.")}`,
          );
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return {
    status,
    message,
  };
}
