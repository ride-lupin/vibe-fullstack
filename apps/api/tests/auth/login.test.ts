import { describe, it, expect, vi, beforeEach } from 'vitest'

// DB 모킹 (실제 통합 테스트에서는 테스트 DB 사용)
vi.mock('../../src/db/client', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
  },
}))

vi.mock('../../src/lib/env', () => ({
  env: {
    NODE_ENV: 'test',
    PORT: 3000,
    DATABASE_URL: 'postgresql://test',
    JWT_SECRET: 'test-secret-that-is-long-enough-for-validation',
    JWT_EXPIRES_IN: '7d',
  },
}))

describe('POST /v1/auth/login', () => {
  it('이메일 형식이 잘못되면 400을 반환한다', async () => {
    const { default: app } = await import('../../src/index')
    const res = await app.request('/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid-email', password: 'password123' }),
    })

    expect(res.status).toBe(400)
  })

  it('비밀번호가 8자 미만이면 400을 반환한다', async () => {
    const { default: app } = await import('../../src/index')
    const res = await app.request('/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: '1234' }),
    })

    expect(res.status).toBe(400)
  })

  it('존재하지 않는 이메일이면 400을 반환한다', async () => {
    const { db } = await import('../../src/db/client')
    const mockLimit = vi.fn().mockResolvedValue([])
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({ limit: mockLimit }),
      }),
    } as never)

    const { default: app } = await import('../../src/index')
    const res = await app.request('/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'notfound@example.com', password: 'password123' }),
    })

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.success).toBe(false)
  })
})
