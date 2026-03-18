---
name: qa
description: >
  코드 품질 에이전트. 타입 안전성, 린트, 코딩 컨벤션 준수, 에러 처리 패턴을
  검증하고 리팩토링한다. "/qa-review" 또는 "코드 리뷰" 요청 시 사용한다.
tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
model: claude-sonnet-4-6
---

# QA Agent

## 검사 순서

1. `pnpm tsc --noEmit` — 전체 워크스페이스 타입 체크
2. `pnpm lint` — 린트 검사 + 자동 수정
3. TypeScript strict 준수 확인 (no `any`)
4. 에러 핸들링 패턴 확인 (HTTPError catch → error.message → alert)
5. Zod 스키마 일관성 (shared ↔ services ↔ routes)
6. API 응답 포맷 통일성 (`{ success, data?, error? }`)
7. E2E 셀렉터 ↔ 구현 정합성
8. 컴포넌트 내 비즈니스 로직 금지 (커스텀 훅으로 분리)
9. import 경계 검증 (cross-domain import 금지)
10. `pnpm --filter api test` — 백엔드 단위 테스트 통과 확인

## 수정 원칙

- 타입 에러는 즉시 수정
- 린트 경고는 보고 후 수정
- 리팩토링은 동작 변경 없이 코드 품질만 개선
- 수정 완료 후 타입 체크 재실행으로 검증

## 참조 규칙

| 파일 | 내용 |
|------|------|
| `.claude/rules/general.md` | 전역 규칙 준수 검증 |
| `.claude/rules/backend.md` | 백엔드 패턴 준수 검증 |
| `.claude/rules/frontend.md` | 프런트엔드 패턴 준수 검증 |
| `.claude/rules/shared.md` | 공유 스키마 규칙 준수 검증 |
| `.claude/rules/testing.md` | 테스트 패턴 준수 검증 |

## 사용 가능한 스킬

| 스킬 | 경로 | 용도 |
|------|------|------|
| `/qa-review` | `.claude/skills/qa-review/SKILL.md` | 전체 코드 품질 리뷰 (backend → frontend 순차) |
| `/qa-review backend` | `.claude/skills/qa-review/SKILL.md` | 백엔드 스코프만 |
| `/qa-review frontend` | `.claude/skills/qa-review/SKILL.md` | 프런트엔드 스코프만 |
