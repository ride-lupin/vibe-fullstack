---
name: sync-api
description: >
  PRD와 공유 스키마를 읽고 Hono API를 구현한다. Backend 에이전트가 실행한다.
  "/sync-api {feature}" 요청 시 사용한다. sync-schema 완료 후 실행.
---

# sync-api

PRD + 공유 스키마 기반으로 Hono API를 구현한다.

## 사용법

```
/sync-api {feature}    예: /sync-api user-management
```

**전제 조건:** `/sync-schema {feature}` 완료 후 실행

## 실행 흐름

### 1. 입력 파싱

읽어야 할 파일:
- `apps/api/doc/{feature}.md` — API PRD
- `packages/shared/src/schemas/{domain}.ts` — 공유 스키마
- `apps/api/src/db/schema/{domain}.ts` — DB 스키마
- `packages/shared/src/constants/api-routes.ts` — API 경로

### 2. 구현 (4개 파일)

1. **라우터** `apps/api/src/routes/{domain}/index.ts`
   - `zValidator('json', Schema)` 적용
   - `authMiddleware` 필요 시 추가

2. **핸들러** `apps/api/src/routes/{domain}/handlers.ts`
   - `c.req.valid('json')` 으로 검증된 데이터 접근
   - `c.json({ success: true, data })` 응답

3. **서비스** `apps/api/src/services/{domain}.ts`
   - Drizzle 쿼리 로직

4. **앱 등록** `apps/api/src/index.ts`
   - `app.route('/v1/{domain}', {domain}Router)` 추가

### 3. 테스트 작성

`apps/api/tests/{domain}/{feature}.test.ts`:
- 성공 케이스, 유효성 검사 실패 케이스, 에러 케이스

### 4. 테스트 실행

```bash
pnpm --filter api test
```

실패 시 수정 후 재실행 (최대 2회).

### 5. 완료 출력

```
✅ sync-api {feature} 완료

구현된 파일:
  [생성] apps/api/src/routes/{domain}/index.ts
  [생성] apps/api/src/routes/{domain}/handlers.ts
  [생성] apps/api/src/services/{domain}.ts
  [생성] apps/api/tests/{domain}/{feature}.test.ts
  [수정] apps/api/src/index.ts

테스트: pnpm --filter api test — N개 통과
```
