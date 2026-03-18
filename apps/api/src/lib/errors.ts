import { HTTPException } from 'hono/http-exception'

export class AppError extends HTTPException {
  constructor(
    status: Parameters<typeof HTTPException>[0],
    public readonly code: string,
    message: string,
  ) {
    super(status, { message })
    this.name = 'AppError'
  }
}

export const Errors = {
  UNAUTHORIZED: () => new AppError(401, 'UNAUTHORIZED', '인증이 필요합니다'),
  FORBIDDEN: () => new AppError(403, 'FORBIDDEN', '접근 권한이 없습니다'),
  NOT_FOUND: (resource: string) =>
    new AppError(404, 'NOT_FOUND', `${resource}을(를) 찾을 수 없습니다`),
  CONFLICT: (message: string) => new AppError(409, 'CONFLICT', message),
  VALIDATION_ERROR: (message: string) => new AppError(400, 'VALIDATION_ERROR', message),
  INTERNAL: () => new AppError(500, 'INTERNAL_SERVER_ERROR', '서버 오류가 발생했습니다'),
} as const
