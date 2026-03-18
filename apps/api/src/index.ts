import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from './lib/env.js'
import { errorHandler } from './middleware/error-handler.js'
import { loggerMiddleware } from './middleware/logger.js'
import { authRouter } from './routes/auth/index.js'

const app = new Hono()

// 미들웨어
app.use('*', loggerMiddleware)
app.use(
  '*',
  cors({
    origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
    credentials: true,
  }),
)

// 헬스체크
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// 라우터
app.route('/v1/auth', authRouter)

// 에러 핸들러
app.onError(errorHandler)

serve({ fetch: app.fetch, port: env.PORT }, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 API 서버 실행 중: http://localhost:${env.PORT}`)
})

export default app
