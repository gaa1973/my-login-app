import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('有効なメールアドレスを入力してください。'),
    password: z
      .string()
      .min(6, 'パスワードは6文字以上で入力してください。'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('有効なメールアドレスを入力してください。'),
    password: z.string(),
  }),
});
