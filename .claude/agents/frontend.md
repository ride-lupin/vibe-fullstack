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

## 참조 규칙

| 파일 | 내용 |
|------|------|
| `.claude/rules/general.md` | 전역 — 네이밍, 패키지 매니저 |
| `.claude/rules/frontend.md` | 6계층 구조, react-hook-form, 스타일링, import 경계 |
| `.claude/rules/testing.md` | Playwright E2E 패턴 |

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

## 사용 가능한 스킬

| 스킬 | 용도 |
|------|------|
| `/sync-e2e {feature}` | PRD → Playwright E2E 테스트 생성 |
| `/sync-impl {feature}` | E2E 기반 6계층 프런트엔드 구현 |
| `/qa-review frontend` | 프런트엔드 코드 품질 리뷰 |

@.claude/skills/frontend/sync-e2e/SKILL.md
@.claude/skills/frontend/sync-impl/SKILL.md
@.claude/skills/qa-review/SKILL.md
