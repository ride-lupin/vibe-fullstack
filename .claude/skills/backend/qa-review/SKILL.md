---
name: qa-review (backend)
description: >
  백엔드 코드 품질 리뷰. QA 에이전트가 apps/api/ 스코프로 실행한다.
  "/qa-review backend" 요청 시 사용한다.
---

# qa-review (backend)

`apps/api/` 코드를 종합 검증한다.

## 체크리스트

1. `pnpm --filter api tsc --noEmit` — 타입 에러
2. `pnpm --filter api lint` — 린트 에러
3. 모든 엔드포인트에 `zValidator` 적용 확인
4. 응답 포맷 통일성 (`{ success, data?, error? }`)
5. Drizzle 쿼리 패턴 (N+1 감지, 트랜잭션 누락)
6. 에러 핸들러 등록 확인 (`app.onError(errorHandler)`)
7. `pnpm --filter api test` — 단위 테스트 통과
8. `any` 타입 사용 여부
9. `env.ts` 를 거치지 않는 직접 `process.env` 접근 여부
