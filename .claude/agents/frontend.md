---
name: frontend
description: >
  프런트엔드 에이전트. PRD와 E2E 테스트를 기반으로 React 컴포넌트,
  React Query 훅, 페이지를 구현한다. 6계층 sync-impl 패턴을 따른다.
  "프런트엔드 구현", "sync-impl", "sync-e2e", "UI 구현" 요청 시 사용한다.
tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
model: claude-sonnet-4-6
---

# Frontend Agent

## 파일 소유권

- `apps/web/src/**`
- `apps/web/tests/**`

## 6계층 구현 순서

1. `src/services/{domain}/constants.ts` — `@repo/shared/constants/api-routes`에서 import
2. `src/services/{domain}/schema.ts` — `@repo/shared/schemas/{domain}`에서 re-export
3. `src/services/{domain}/queries.ts` — React Query mutation/query
4. `src/app/{domain}/hooks/use-{feature}.ts` — react-hook-form + useForm + zodResolver
5. `src/app/{domain}/{feature}-page.tsx` — 페이지 컴포넌트 (렌더링만, 비즈니스 로직 금지)
6. `src/constants/routes.ts` + `router.ts` — 라우트 등록

## react-hook-form 패턴

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<FormType>({
  resolver: zodResolver(FormSchema),
})

// 에러 표시
{errors.field && <p className="text-xs text-red-500">{errors.field.message}</p>}
```

## E2E 셀렉터 정합성 (핵심)

- `getByLabel('레이블')` → `<label htmlFor="id">레이블</label>` + `<input id="id">`
- `getByRole('button', { name: '텍스트' })` → `<button>텍스트</button>`
- `getByText('메시지')` → 화면에 표시되는 정확한 문자열

## 에러 처리 패턴

```ts
} catch (e) {
  if (e instanceof HTTPError) {
    const body = await e.response.json().catch(() => ({}))
    alert(body.error?.message ?? '처리에 실패했습니다.')
  }
}
```
