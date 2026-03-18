import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { LoginRequestSchema } from '@repo/shared/schemas/auth'
import { loginHandler } from './handlers.js'

export const authRouter = new Hono()

authRouter.post('/login', zValidator('json', LoginRequestSchema), loginHandler)
