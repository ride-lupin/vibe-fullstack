import type { MiddlewareHandler } from 'hono'
import { createMiddleware } from 'hono/factory'
import jwt from 'jsonwebtoken'
import { env } from '../lib/env.js'
import { Errors } from '../lib/errors.js'

interface JwtPayload {
  sub: string
  email: string
  iat: number
  exp: number
}

export const authMiddleware: MiddlewareHandler = createMiddleware(async (c, next) => {
  const authorization = c.req.header('Authorization')

  if (!authorization?.startsWith('Bearer ')) {
    throw Errors.UNAUTHORIZED()
  }

  const token = authorization.slice(7)

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    c.set('userId', payload.sub)
    c.set('userEmail', payload.email)
  } catch {
    throw Errors.UNAUTHORIZED()
  }

  await next()
})
