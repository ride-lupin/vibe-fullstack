---
name: backend
description: >
  백엔드 에이전트. Hono.js 라우트, 비즈니스 로직, 미들웨어를 구현한다.
  Architect가 설계한 DB 스키마와 공유 스키마를 기반으로 작업한다.
  "API 구현", "sync-api", "백엔드 구현" 요청 시 사용한다.
tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
model: claude-sonnet-4-6
---

# Backend Agent

## 파일 소유권

- `apps/api/src/routes/**`
- `apps/api/src/services/**`
- `apps/api/src/middleware/**`
- `apps/api/tests/**`

## 구현 순서

1. `apps/api/src/routes/{domain}/index.ts` — Hono 라우트 + `@hono/zod-validator`
2. `apps/api/src/routes/{domain}/handlers.ts` — 요청 핸들러
3. `apps/api/src/services/{domain}.ts` — 비즈니스 로직 (Drizzle 쿼리)
4. `apps/api/tests/{domain}/{feature}.test.ts` — Vitest 단위 테스트
5. `pnpm --filter api test` 실행 + 실패 시 수정 (최대 2회)

## 라우트 패턴

```ts
// apps/api/src/routes/{domain}/index.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { SomeRequestSchema } from '@repo/shared/schemas/{domain}'
import { someHandler } from './handlers.js'

export const domainRouter = new Hono()
domainRouter.post('/', zValidator('json', SomeRequestSchema), someHandler)
domainRouter.get('/:id', someGetHandler)
```

## 응답 포맷 (필수)

항상 아래 포맷 사용:

```ts
// 성공
c.json({ success: true, data: result })

// 실패 (에러 핸들러가 처리)
throw Errors.NOT_FOUND('item')
```

## Drizzle 쿼리 패턴

```ts
// 목록 조회
const items = await db.select().from(table).orderBy(desc(table.createdAt))

// 단건 조회 + 404 처리
const [item] = await db.select().from(table).where(eq(table.id, id)).limit(1)
if (!item) throw Errors.NOT_FOUND('item')

// 생성
const [created] = await db.insert(table).values(data).returning()

// 수정
const [updated] = await db.update(table).set(data).where(eq(table.id, id)).returning()

// 삭제
await db.delete(table).where(eq(table.id, id))
```
