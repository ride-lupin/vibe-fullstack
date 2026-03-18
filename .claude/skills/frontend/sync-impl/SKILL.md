---
name: sync-impl
description: >
  PRD + E2E 테스트를 읽고 6계층 프런트엔드 코드를 자동 생성 또는 업데이트한다.
  Frontend 에이전트가 실행한다.
  "/sync-impl {feature}", "구현해줘", "코드 생성" 요청 시 사용한다.
---

# sync-impl

PRD + E2E 기반으로 6계층 프런트엔드 코드를 구현한다.

## 사용법

```
/sync-impl {feature}          특정 기능 구현
/sync-impl --auto {feature}   훅에 의한 자동 호출
```

## 실행 흐름 (6단계)

### 1. 입력 검증

- `docs/features/{feature}.md` 존재 확인
- `apps/web/tests/e2e/{feature}.spec.ts` 존재 확인 (없으면 경고)
- `packages/shared/src/schemas/{domain}.ts` 존재 확인

### 2. 레퍼런스 파일 읽기

- `apps/web/tests/e2e/{feature}.spec.ts` — 셀렉터, assertion, 모킹
- `apps/web/src/app/auth/login-page.tsx` — 페이지 패턴
- `apps/web/src/app/auth/hooks/use-login.ts` — 훅 패턴
- `apps/web/src/constants/routes.ts` + `router.ts` — 라우트 등록

### 3. 변경 계획 제시 (인터랙티브 모드)

생성/수정 파일 목록 + 요약 제시 후 사용자 확인.
(`--auto` 모드는 즉시 실행)

### 4. 6계층 구현

1. `src/services/{domain}/constants.ts` — `@repo/shared/constants/api-routes` import
2. `src/services/{domain}/schema.ts` — `@repo/shared/schemas/{domain}` re-export
3. `src/services/{domain}/queries.ts` — React Query (POST→useMutation, GET→useQuery)
4. `src/app/{domain}/hooks/use-{feature}.ts` — react-hook-form + zodResolver
5. `src/app/{domain}/{feature}-page.tsx` — E2E 셀렉터와 정확히 일치하는 UI
6. `src/constants/routes.ts` + `router.ts` — lazy import 라우트 등록

### 5. 타입 체크

```bash
pnpm --filter web tsc --noEmit
```

에러 시 즉시 수정 (최대 2회).

### 6. E2E 테스트 실행

```bash
pnpm --filter web test:bot {feature}
```

실패 시 수정 + 재실행 (최대 2회).

## E2E 셀렉터 정합성 규칙 (핵심)

| E2E 셀렉터 | 구현 |
|-----------|------|
| `getByLabel('레이블')` | `<label htmlFor="id">레이블</label>` + `<input id="id">` |
| `getByRole('button', { name: '텍스트' })` | `<button>텍스트</button>` |
| `getByText('메시지')` | 화면에 표시되는 정확한 문자열 |

## 완료 출력

```
✅ sync-impl {feature} 완료

생성/수정된 파일:
  [생성] src/services/{domain}/constants.ts
  ...

타입 체크: 통과
테스트: pnpm test:bot {feature} — N개 통과
```
