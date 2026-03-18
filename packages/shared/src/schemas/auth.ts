import { z } from 'zod'

// ── 요청 스키마 ──────────────────────────────────────────
export const LoginRequestSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
})

// ── 응답 스키마 ──────────────────────────────────────────
export const AuthTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresIn: z.number().optional(),
})

export const LoginResponseSchema = z.object({
  success: z.literal(true),
  data: AuthTokenSchema,
})

// ── 타입 export ──────────────────────────────────────────
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type AuthToken = z.infer<typeof AuthTokenSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
