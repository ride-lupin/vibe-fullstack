import type { Context } from 'hono'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { db } from '../../db/client.js'
import { users } from '../../db/schema/users.js'
import { env } from '../../lib/env.js'
import { Errors } from '../../lib/errors.js'

// 비밀번호는 실제로는 bcrypt 사용 — 여기서는 예시용 단순 해시
const hashPassword = async (password: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + env.JWT_SECRET)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Buffer.from(hash).toString('hex')
}

const verifyPassword = async (password: string, hash: string) => {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export const loginHandler = async (c: Context) => {
  const { email, password } = c.req.valid('json' as never) as { email: string; password: string }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (!user) {
    throw Errors.VALIDATION_ERROR('이메일 또는 비밀번호가 올바르지 않습니다')
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    throw Errors.VALIDATION_ERROR('이메일 또는 비밀번호가 올바르지 않습니다')
  }

  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  )

  return c.json({
    success: true,
    data: { accessToken },
  })
}
