---
name: sync-schema
description: >
  PRD를 읽고 공유 Zod 스키마, DB 스키마, API 경로 상수를 생성한다.
  Architect 에이전트가 실행한다. "/sync-schema {feature}" 요청 시 사용한다.
---

# sync-schema

PRD를 분석하여 공유 스키마와 DB 스키마를 생성한다.

## 사용법

```
/sync-schema {feature}    예: /sync-schema user-management
```

## 실행 흐름

### 1. PRD 파싱

`docs/features/{feature}.md` 읽기:
- API 연동 섹션 → 요청/응답 타입 추출
- 폼 필드 → 유효성 검사 규칙 추출
- 데이터 엔티티 → DB 스키마 설계

### 2. 공유 Zod 스키마 생성

`packages/shared/src/schemas/{domain}.ts`:

```ts
import { z } from 'zod'

// 요청 스키마 (한국어 validation 메시지)
export const {Domain}CreateRequestSchema = z.object({
  field: z.string().min(1, '필드를 입력해주세요'),
})

// 응답 스키마
export const {Domain}ResponseSchema = z.object({
  id: z.string().uuid(),
  field: z.string(),
  createdAt: z.string().datetime(),
})

// 타입 export
export type {Domain}CreateRequest = z.infer<typeof {Domain}CreateRequestSchema>
export type {Domain}Response = z.infer<typeof {Domain}ResponseSchema>
```

### 3. DB 스키마 생성

`apps/api/src/db/schema/{domain}.ts`:

```ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const {domain}s = pgTable('{domain}s', {
  id: uuid('id').primaryKey().defaultRandom(),
  // ... 공유 스키마 필드와 일치
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
```

`apps/api/src/db/schema/index.ts` 업데이트.

### 4. API 경로 상수 업데이트

`packages/shared/src/constants/api-routes.ts`에 도메인 라우트 추가.

### 5. 완료 출력

```
✅ sync-schema {feature} 완료

생성된 파일:
  [생성] packages/shared/src/schemas/{domain}.ts
  [생성] apps/api/src/db/schema/{domain}.ts
  [수정] apps/api/src/db/schema/index.ts
  [수정] packages/shared/src/constants/api-routes.ts

다음 단계:
  Backend → /sync-api {feature}
  Frontend → /sync-e2e {feature} → /sync-impl {feature}
```
