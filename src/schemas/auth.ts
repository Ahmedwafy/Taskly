// src/schemas/auth.schema.ts

import { z } from 'zod';

// ==============================================================
// ● ● ● Sign Up Schema ● ● ●
// ==============================================================
export const SignUpSchema = z.object({
  name: z.string().trim().min(3),
  email: z.string().trim(),
  department: z.string().trim().min(2),
  password: z.string().min(6),
});
export type SignUpFormData = z.infer<typeof SignUpSchema>;

// ==============================================================
// ● ● ● Login Schema ● ● ●
// ==============================================================
export const SignInSchema = z.object({
  email: z.string().trim(),
  password: z.string().trim().min(1),
  rememberMe: z.boolean(),
});
