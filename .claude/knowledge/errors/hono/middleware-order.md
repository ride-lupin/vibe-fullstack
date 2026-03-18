---
error_pattern: "Cannot read properties of undefined (reading 'userId')"
category: hono
frequency: medium
auto_fixable: true
---

## 증상

`c.get('userId')` 가 undefined를 반환. authMiddleware가 적용되지 않은 상태.

## 원인

라우터에 `authMiddleware`를 추가하지 않았거나, 미들웨어 순서가 잘못됨.

## 해결책

```ts
// apps/api/src/routes/{domain}/index.ts
import { authMiddleware } from '../../middleware/auth.js'

router.use('*', authMiddleware)  // 모든 라우트에 인증 적용
router.get('/', handler)
```

## 미들웨어 순서 (apps/api/src/index.ts)

```ts
app.use('*', loggerMiddleware)  // 1. 로거
app.use('*', cors(...))          // 2. CORS
// 인증이 필요한 라우터는 라우터 내부에서 authMiddleware 적용
app.route('/v1/auth', authRouter)    // 인증 불필요
app.route('/v1/items', itemsRouter)  // 라우터 내부에서 auth 적용
app.onError(errorHandler)            // 마지막: 에러 핸들러
```
