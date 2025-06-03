import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "@/domains/auth/services/auth.service";
import { useState } from "react";

const EmailSchema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요."),
});

type EmailFormValues = z.infer<typeof EmailSchema>;

export function useMagicLinkForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormValues>({
    resolver: zodResolver(EmailSchema),
  });

  const onSubmit = async (data: EmailFormValues) => {
    setStatus("loading");
    setErrorMsg(null);
    try {
      const { error } = await AuthService.sendMagicLink(
        data.email,
        window.location.origin + "/auth/callback",
      );
      if (error) {
        setStatus("error");
        setErrorMsg(error.message || "매직 링크 발송에 실패했습니다.");
      } else {
        setStatus("success");
        reset();
      }
    } catch (e) {
      setStatus("error");
      setErrorMsg("알 수 없는 오류가 발생했습니다.");
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
