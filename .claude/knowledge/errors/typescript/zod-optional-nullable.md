---
error_pattern: "TS2345: Argument of type 'string | undefined' is not assignable to type 'string | null'"
category: typescript
frequency: high
auto_fixable: true
---

## 증상

Zod 스키마의 `.optional()` 필드를 Drizzle insert에 전달할 때 타입 불일치.

## 원인

`z.string().optional()` → `string | undefined`
Drizzle nullable 컬럼 → `string | null`

두 타입이 호환되지 않음.

## 해결책

1. Zod 스키마에서 `.nullable()` 사용
2. 또는 변환: `.optional().transform(val => val ?? null)`

## 코드 예시

```ts
// Before (에러)
export const Schema = z.object({
  description: z.string().optional(),
})

// After (수정)
export const Schema = z.object({
  description: z.string().nullable(),
})
```

## 관련 파일

- `packages/shared/src/schemas/*.ts`
- `apps/api/src/db/schema/*.ts`
