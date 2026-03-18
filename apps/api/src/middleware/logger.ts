import { logger } from 'hono/logger'

export const loggerMiddleware = logger((message, ...rest) => {
  console.log(message, ...rest)
})
