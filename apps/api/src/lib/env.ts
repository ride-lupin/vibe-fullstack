import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET은 최소 32자 이상이어야 합니다'),
  JWT_EXPIRES_IN: z.string().default('7d'),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  console.error('❌ 환경변수 검증 실패:')
  console.error(result.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = result.data
