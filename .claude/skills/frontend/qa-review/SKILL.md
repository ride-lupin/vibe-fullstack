---
name: qa-review (frontend)
description: >
  프런트엔드 코드 품질 리뷰. QA 에이전트가 apps/web/ 스코프로 실행한다.
  "/qa-review frontend" 요청 시 사용한다.
---

# qa-review (frontend)

`apps/web/` 코드를 종합 검증한다.

## 체크리스트

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
