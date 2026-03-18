---
description: 공유 패키지 규칙 — packages/shared/** 스코프
globs:
  - "packages/shared/**"
---

# Shared 패키지 규칙

## 원칙

- `packages/shared`는 **Architect 에이전트만 생성/수정**
- 다른 에이전트는 import만 사용

## Zod 스키마 네이밍

```ts
// {Domain}{Entity}{Action}Schema
export const UserCreateRequestSchema = z.object({ ... })
export const UserResponseSchema = z.object({ ... })
export const UserListResponseSchema = z.array(UserResponseSchema)
```

## 타입 export (필수)

```ts
// 모든 스키마에 대응하는 타입 export
export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
```

## 의존성 제한

- `zod` 외 런타임 의존성 금지
- Node.js 전용 모듈 사용 금지 (FE/BE 공용이므로)
