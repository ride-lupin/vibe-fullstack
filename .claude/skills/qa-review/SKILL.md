---
name: qa-review
description: >
  코드 품질 리뷰. QA 에이전트가 실행한다.
  "/qa-review", "/qa-review backend", "/qa-review frontend" 요청 시 사용한다.
---

# qa-review

`apps/api/` 및 `apps/web/` 코드를 종합 검증한다.

## 사용법

```
/qa-review             전체 (backend → frontend 순차)
/qa-review backend     apps/api/ 스코프만
/qa-review frontend    apps/web/ 스코프만
```

## Backend 체크리스트 (`/qa-review backend`)

1. `pnpm --filter api tsc --noEmit` — 타입 에러
2. `pnpm --filter api lint` — 린트 에러
3. 모든 엔드포인트에 `zValidator` 적용 확인
4. 응답 포맷 통일성 (`{ success, data?, error? }`)
5. Drizzle 쿼리 패턴 (N+1 감지, 트랜잭션 누락)
6. 에러 핸들러 등록 확인 (`app.onError(errorHandler)`)
7. `pnpm --filter api test` — 단위 테스트 통과
8. `any` 타입 사용 여부
9. `env.ts` 를 거치지 않는 직접 `process.env` 접근 여부

## Frontend 체크리스트 (`/qa-review frontend`)

1. `pnpm --filter web tsc --noEmit` — 타입 에러
2. `pnpm --filter web lint` — 린트 에러
3. react-hook-form + zodResolver 사용 여부 (폼 있는 페이지)
4. 컴포넌트 내 비즈니스 로직 없음 확인 (커스텀 훅으로 분리)
5. E2E 셀렉터 ↔ 구현 정합성
6. `@repo/shared`에서 스키마 import 확인 (중복 정의 금지)
7. 라우터에 lazy import 사용 확인
8. cross-domain import 없음 확인
9. 에러 처리: HTTPError catch → error.message → alert
10. `any` 타입 사용 여부

## 수정 원칙

- 타입 에러는 즉시 수정
- 린트 경고는 보고 후 수정
- 리팩토링은 동작 변경 없이 코드 품질만 개선
- 수정 완료 후 타입 체크 재실행으로 검증
