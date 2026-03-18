---
name: fix-error
description: >
  에러 진단/수정 스킬. 빌드/타입/테스트 에러를 진단하고 수정한다.
  지식베이스에서 기존 해결책을 먼저 탐색한다.
  "/fix-error {description}" 요청 시 이 스킬을 사용한다.
---

# fix-error

에러를 진단하고 수정한다.

## 사용법

```
/fix-error "TS2345 타입 에러"
/fix-error "Playwright 셀렉터 찾을 수 없음"
/fix-error "drizzle migration conflict"
```

## 실행 흐름

### 1. 지식베이스 탐색

`.claude/knowledge/errors/` 에서 유사 패턴 검색:
- 에러 메시지 키워드 매칭
- `auto_fixable: true` 항목이면 즉시 자동 적용

### 2. 진단 (기존 해결책 없을 때)

Error Handler 에이전트가:
1. 에러 메시지 + 스택 트레이스 분석
2. 관련 파일 탐색 (에러 위치 → import 추적)
3. 원인 진단 + 수정

### 3. 검증

```bash
pnpm tsc --noEmit          # 타입 에러
pnpm --filter api test     # 백엔드 테스트
pnpm test:bot {feature}    # E2E 테스트 (해당 시)
```

### 4. 지식베이스 기록

해결 후 `.claude/knowledge/errors/{category}/{pattern}.md` 에 기록.
`frequency` 카운터 업데이트 (기존 파일이면 +1).

---

## 완료 출력

```
✅ 에러 수정 완료

원인: {원인 설명}
수정: {수정 내용}
검증: pnpm tsc --noEmit — 통과

지식베이스 기록: .claude/knowledge/errors/{category}/{file}.md
```
