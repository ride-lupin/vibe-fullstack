---
name: sync-e2e
description: >
  `apps/web/doc/{feature}.md` PRD를 읽고 `apps/web/tests/e2e/{feature}.spec.ts`
  Playwright E2E 테스트를 자동 생성 또는 업데이트한다.
  "/sync-e2e {feature}", "E2E 테스트 만들어줘", "spec 동기화" 요청 시 사용한다.
---

# sync-e2e

PRD를 파싱하여 Playwright E2E 테스트를 생성 또는 업데이트한다.

## 사용법

```
/sync-e2e {feature}          특정 기능 spec 생성/업데이트
/sync-e2e                    spec이 없는 모든 doc/*.md 대상
/sync-e2e --auto {feature}   훅에 의한 자동 호출 (확인 없이 실행)
```

## 실행 흐름

### 1. 대상 파일 결정

- `_`로 시작하는 파일 건너뜀
- 기존 spec 존재 시 → 부분 업데이트 (전체 재생성 지양)

### 2. PRD → 테스트 변환 규칙

| PRD 섹션 | 테스트 패턴 |
|----------|-----------|
| 화면 구성 | `test('화면 구성 — {요소}가 표시된다', ...)` |
| {기능} 플로우 | `test('{기능} 플로우 — {조건}이면 {결과}다', ...)` |
| 예외 처리 | `test('예외 처리 — {조건}이면 {결과}다', ...)` |

### 3. 인증 패턴 결정

- "인증이 필요" → `loginAndGoto()` 헬퍼 패턴
- "로그인 페이지" 자체 설명 → localStorage clear 패턴

### 4. 기존 spec 부분 업데이트

변경 계획 제시 후 사용자 확인 (`--auto` 모드는 즉시 실행).

### 5. API 모킹

API 응답이 필요한 테스트:
```ts
await page.route('**/v1/{endpoint}**', (route) =>
  route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({...}) })
)
```

## 완료 출력

```
✅ tests/e2e/{feature}.spec.ts 생성 완료

테스트 케이스 (N개):
  화면 구성 — ...
  {기능} 플로우 — ...
  예외 처리 — ...
```
