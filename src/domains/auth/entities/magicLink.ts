import { z } from "zod";

export const magicLinkRequestSchema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요."),
});

export type MagicLinkRequest = z.infer<typeof magicLinkRequestSchema>;
