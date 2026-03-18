---
name: new-feature
description: >
  풀스택 피처 오케스트레이터. PRD를 기반으로 Architect → Backend/Frontend → QA → Perf
  전체 플로우를 자동 실행한다. "/new-feature {feature}" 요청 시 반드시 이 스킬을 사용한다.
---

# new-feature

PRD를 기반으로 풀스택 피처 전체를 자동 구현한다.

## 사용법

```
/new-feature {feature}    예: /new-feature user-management
```

`{feature}`는 `docs/features/{feature}.md` PRD 파일명(확장자 제외)이다.

---

## 실행 흐름

### 1. 사전 검증

- `docs/features/{feature}.md` 존재 확인
- 없으면 중단 후 PRD 작성 요청

### 2. Agent Teams 또는 Subagent 모드 결정

**Agent Teams 모드** (복잡한 피처, CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 활성화 시):
```
Architect teammate → 스키마 설계 완료 대기
  ↓ 완료 시
Backend teammate (병렬) + Frontend teammate (병렬)
  ↓ 둘 다 완료 시
QA subagent → Perf subagent → git commit
```

**Subagent 순차 모드** (간단한 피처 또는 Teams 비활성 시):
```
@architect → /sync-schema {feature}
@backend   → /sync-api {feature}
@frontend  → /sync-e2e {feature} → /sync-impl {feature}
@qa        → /qa-review backend → /qa-review frontend
@perf      → /perf-review
→ git commit -m "feat: {feature} 구현"
```

### 3. Agent Teams 프롬프트 (참고용)

```
Create an agent team for implementing the {feature} feature.

Spawn three teammates:
1. architect: Run /sync-schema {feature}
   — reads docs/features/{feature}.md, generates shared Zod schema,
     DB schema, and API route constants.

2. backend: After architect completes, run /sync-api {feature}
   — implements Hono routes, service layer, and Vitest tests.

3. frontend: After architect completes, run /sync-e2e {feature},
   then run /sync-impl {feature}
   — generates E2E tests then implements 6-layer frontend code.

Coordinate through the task list. Backend and frontend work in parallel
after architect finishes. Each teammate owns separate files — no overlapping edits.
```

### 4. 완료 기준

- `pnpm --filter api test` 통과
- `pnpm --filter web test:bot {feature}` 통과
- `pnpm --filter api typecheck && pnpm --filter web typecheck` 통과
- `/qa-review backend` + `/qa-review frontend` 완료
- `/perf-review` 완료

### 5. 커밋

모든 검증 통과 후:
```bash
git add -p  # 변경 파일 확인
git commit -m "feat: {feature} 구현"
```

---

## 비용 참고

Agent Teams는 teammate 수에 비례하여 토큰 비용 증가 (3 teammates ≈ 3-4x).
단순한 피처는 Subagent 순차 모드가 비용 효율적.
복잡한 피처(여러 API 엔드포인트 + 다수 UI 컴포넌트)에만 Agent Teams 사용 권장.
