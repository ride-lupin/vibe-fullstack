---
description: 테스트 규칙 — **/*.test.ts, **/*.spec.ts 스코프
globs:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---

# 테스트 규칙

## Playwright E2E (apps/web/tests/e2e/)

```ts
test.describe('{기능 이름}', () => {
  test.beforeEach(async ({ page }) => { ... })

  // 테스트 이름은 한국어로
  test('화면 구성 — {요소}가 표시된다', async ({ page }) => { ... })
  test('{기능} 플로우 — {조건}이면 {결과}다', async ({ page }) => { ... })
  test('예외 처리 — {조건}이면 {결과}다', async ({ page }) => { ... })
})
```

**셀렉터 우선순위:**
1. `getByRole` — 접근성 역할 기반
2. `getByLabel` — 레이블 연결 입력
3. `getByText` — 텍스트 기반
4. `data-testid` — 최후 수단

**API 모킹:**
```ts
await page.route('**/v1/some/endpoint**', (route) =>
  route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({...}) })
)
```

## Vitest 단위 테스트 (apps/api/tests/)

```ts
describe('{대상}', () => {
  it('{한국어 설명}', async () => {
    // Arrange
    // Act
    // Assert
    expect(result).toBe(expected)
  })
})
```

- DB는 테스트 환경에서 모킹 허용 (vi.mock)
- 통합 테스트에서는 테스트 전용 DB 사용 권장
