import { logger } from 'hono/logger'

export const loggerMiddleware = logger((message, ...rest) => {
  // eslint-disable-next-line no-console
  console.log(message, ...rest)
})
