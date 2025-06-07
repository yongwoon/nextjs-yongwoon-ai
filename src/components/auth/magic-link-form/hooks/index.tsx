import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthClientService } from "@/domains/auth/services";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MagicLinkRequestValidation as MagicLinkRequest,
  magicLinkRequestSchema,
} from "@/domains/auth/entities/magic-link.types";

export function useMagicLinkForm() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MagicLinkRequest>({
    resolver: zodResolver(magicLinkRequestSchema),
  });

  const onSubmit = async (data: MagicLinkRequest) => {
    setStatus("loading");
    setErrorMsg(null);
    try {
      const result = await AuthClientService.sendMagicLink(
        data.email,
        window.location.origin + "/auth/callback",
      );
      if (!result.success) {
        setStatus("error");
        setErrorMsg(result.error || "인증 방법 발송에 실패했습니다.");
      } else {
        setStatus("success");
        reset();
        // Email Sent 페이지로 이동
        router.push(`/auth/email-sent?email=${encodeURIComponent(data.email)}`);
      }
    } catch (e) {
      setStatus("error");
      setErrorMsg("알 수 없는 오류가 발생했습니다.");

      console.error(e);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    reset,
    status,
    errorMsg,
    onSubmit,
  };
}
