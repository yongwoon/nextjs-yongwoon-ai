// refine 관련 코드 전체 삭제

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email({ message: "유효한 이메일을 입력하세요." }),
  password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (_data: LoginFormValues) => {
    // TODO: Supabase 인증 로직 구현 예정
    // Magic Link 기반 인증으로 변경될 예정
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 임시 로딩 시뮬레이션
    reset();
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
