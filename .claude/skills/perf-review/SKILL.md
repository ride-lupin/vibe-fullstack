---
name: perf-review
description: >
  성능 리뷰 스킬. Performance 에이전트를 사용하여 프런트엔드/백엔드 성능을
  분석하고 최적화 제안을 제공한다. "/perf-review" 요청 시 이 스킬을 사용한다.
---

# perf-review

Performance 에이전트가 프런트엔드와 백엔드를 통합 분석한다.

## 사용법

```
/perf-review           전체 성능 리뷰
/perf-review frontend  프런트엔드만
/perf-review backend   백엔드만
```

## 실행 흐름

1. **프런트엔드 분석** (`apps/web/src/`):
   - `router.ts` — lazy import 사용 여부
   - `queries.ts` — React Query 캐시 설정
   - 컴포넌트 — 불필요한 리렌더링 패턴
   - `vite.config.ts` — 번들 최적화 설정

2. **백엔드 분석** (`apps/api/src/`):
   - `services/` — N+1 쿼리 패턴
   - `db/schema/` — 인덱스 설정
   - `routes/handlers.ts` — 응답 페이로드 최적화

3. **최적화 적용**: 동의 후 코드 수정

4. **검증**: `pnpm tsc --noEmit` + `pnpm --filter api test`
