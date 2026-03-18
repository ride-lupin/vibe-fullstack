import type { Context } from 'hono'
import type { StatusCode } from 'hono/utils/http-status'
import { HTTPException } from 'hono/http-exception'
import { AppError } from '../lib/errors.js'

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof AppError) {
    return c.json(
      { success: false, error: { code: err.code, message: err.message } },
      err.status as StatusCode,
    )
  }

  if (err instanceof HTTPException) {
    return c.json(
      { success: false, error: { code: 'HTTP_ERROR', message: err.message } },
      err.status as StatusCode,
    )
  }

  console.error('Unhandled error:', err)
  return c.json(
    { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류가 발생했습니다' } },
    500,
  )
}
