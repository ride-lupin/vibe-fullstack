---
description: 프런트엔드 규칙 — apps/web/** 스코프
globs:
  - "apps/web/**"
---

# 프런트엔드 규칙

## 6계층 구현 순서 (필수)

1. `src/services/{domain}/constants.ts` — API 경로 (shared에서 import)
2. `src/services/{domain}/schema.ts` — Zod 스키마 (shared에서 re-export)
3. `src/services/{domain}/queries.ts` — React Query
4. `src/app/{domain}/hooks/use-{feature}.ts` — 커스텀 훅
5. `src/app/{domain}/{feature}-page.tsx` — 페이지
6. `src/constants/routes.ts` + `router.ts` — 라우트 등록

## 컴포넌트 규칙

- 컴포넌트 파일 내 비즈니스 로직 직접 작성 금지 → 커스텀 훅으로 분리
- `useEffect` 최소화 — 파생 상태는 렌더링 중 직접 계산
- 서버 상태: React Query / 클라이언트 전역 상태: Zustand

## react-hook-form 패턴

```tsx
// 항상 zodResolver 사용
const form = useForm<FormType>({ resolver: zodResolver(FormSchema) })
// 에러 표시
{form.formState.errors.field?.message && (
  <p className="text-xs text-red-500">{form.formState.errors.field.message}</p>
)}
```

## 스타일링

- Tailwind 클래스 우선 — 인라인 `style` 속성 금지
- Radix UI primitive를 Tailwind로 직접 스타일링

## 폴더 배치

| 상황 | 위치 |
|------|------|
| 특정 도메인만 사용 | `app/{domain}/` |
| 2개 이상 도메인 공유 컴포넌트 | `src/components/` |
| 2개 이상 도메인 공유 훅 | `src/hooks/` |

## import 경계

- `app/domain-a/`에서 `app/domain-b/` 직접 import 금지
- 공유 코드는 `src/components/`, `src/hooks/`, `src/services/` 또는 `@repo/shared`로
