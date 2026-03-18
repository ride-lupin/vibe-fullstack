---
error_pattern: "waiting for locator... to be visible"
category: playwright
frequency: high
auto_fixable: false
---

## 증상

E2E 테스트에서 `getByLabel`, `getByRole`, `getByText` 가 요소를 찾지 못함.

## 원인

1. 구현의 label 텍스트가 E2E 셀렉터와 다름
2. `htmlFor`/`id` 쌍이 올바르게 연결되지 않음
3. 컴포넌트가 아직 마운트되지 않음 (비동기 로딩)

## 해결책

1. `getByLabel('레이블')` → `<label htmlFor="x">레이블</label>` + `<input id="x">`
2. `getByRole('button', { name: '텍스트' })` → `<button>텍스트</button>` (정확히 일치)
3. 비동기 요소 → `await expect(locator).toBeVisible()` 로 대기

## 진단 명령

```bash
# 현재 페이지 스냅샷 확인
await page.screenshot({ path: 'debug.png' })
console.log(await page.content())
```
