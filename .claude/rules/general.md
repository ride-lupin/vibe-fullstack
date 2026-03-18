---
description: 전역 규칙 — 모든 파일에 적용
---

# 전역 규칙

## 패키지 매니저

- **pnpm만 사용** — `npm`, `yarn` 절대 금지
- 워크스페이스 명령: `pnpm --filter {package} {script}`

## 코딩 컨벤션

**네이밍:**
- 파일: `kebab-case.ts`, `kebab-case.tsx`
- 컴포넌트: `PascalCase`
- 변수/함수: `camelCase`
- 상수: `UPPER_SNAKE_CASE`
- Boolean 변수: `is`, `has`, `can` 접두어

**코드 스타일:**
- `any` 타입 사용 금지 — Zod 추론 또는 명시적 타입 사용
- Early Return 패턴 — 중첩 if 최소화
- 선언형 코드 선호
- 단일 책임 원칙
- 빈 폴더/파일 생성 금지 — 실제 필요한 시점에만 생성
- 환경변수 값 하드코딩 금지

## 에러 메시지

- 사용자에게 표시되는 에러 메시지는 한국어로 작성

## 커밋 형식

```
feat: 기능 추가
fix: 버그 수정
refactor: 리팩토링
chore: 기타 작업
```
