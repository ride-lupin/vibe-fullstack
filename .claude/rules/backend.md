---
description: 백엔드 규칙 — apps/api/** 스코프
globs:
  - "apps/api/**"
---

# 백엔드 규칙

## Hono 라우트 패턴

```ts
// 라우터는 도메인별 분리
const router = new Hono()
router.get('/', handler)
router.post('/', zValidator('json', Schema), handler)
```

## 응답 포맷 (필수)

```ts
// 성공
return c.json({ success: true, data: result })
return c.json({ success: true, data: result }, 201) // 생성

// 실패 — 에러 핸들러가 처리
throw Errors.NOT_FOUND('resource')
throw Errors.VALIDATION_ERROR('message')
```

## 미들웨어 순서 (apps/api/src/index.ts)

1. `logger` — 로깅
2. `cors` — CORS
3. 라우터 (`app.route(...)`)
4. `app.onError(errorHandler)` — 에러 핸들러

## Drizzle 쿼리

- 목록: `db.select().from(table).orderBy(...)`
- 단건: `...limit(1)` + 배열 구조분해 `const [item] = ...`
- 생성: `.insert().values().returning()`
- 수정: `.update().set().where().returning()`
- 삭제: `.delete().where()`

## 환경변수

- 모든 환경변수는 `src/lib/env.ts`에서 Zod 검증 후 사용
- 서버 시작 시 유효성 검사 실패하면 `process.exit(1)`

## 테스트 (Vitest)

```ts
describe('POST /v1/{domain}', () => {
  it('{한국어 설명}', async () => {
    // ...
  })
})
```
