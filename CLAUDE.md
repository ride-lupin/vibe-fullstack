# Vibe Fullstack — Claude Code 팀 에이전트 기반 풀스택 바이브 코딩 보일러플레이트

프런트엔드 개발자가 Claude Code Agent Teams를 활용하여 풀스택 기능을 구현하는 보일러플레이트.

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| **모노레포** | Turborepo + pnpm |
| **프런트엔드** | React 19 + Vite + TypeScript strict |
| **스타일링** | Tailwind CSS v4 + Radix UI |
| **서버 상태** | React Query v5 |
| **클라이언트 상태** | Zustand + persist |
| **검증** | Zod (FE/BE 공유) |
| **폼 관리** | react-hook-form + @hookform/resolvers/zod |
| **HTTP 클라이언트** | ky |
| **백엔드** | Hono.js |
| **ORM** | Drizzle ORM |
| **DB** | PostgreSQL (Docker Compose) |
| **E2E 테스트** | Playwright |
| **API 테스트** | Vitest |
| **라우터** | react-router-dom v7 |

---

## 프로젝트 구조

```
vibe-fullstack/
├── CLAUDE.md
├── .claude/
│   ├── agents/         # 8개 에이전트 정의
│   ├── rules/          # 경로 스코프 규칙
│   ├── skills/         # 스킬 정의
│   │   ├── new-feature/    # 풀스택 오케스트레이터
│   │   ├── perf-review/
│   │   ├── fix-error/
│   │   ├── error-report/
│   │   ├── backend/        # sync-schema, sync-api, qa-review
│   │   └── frontend/       # sync-e2e, sync-impl, qa-review
│   ├── knowledge/errors/   # 에러 패턴 지식베이스
│   └── settings.json
├── docs/
│   └── features/       # FE/BE 공유 풀스택 PRD 문서
├── apps/
│   ├── web/            # React 19 + Vite
│   └── api/            # Hono.js + Drizzle
└── packages/
    ├── shared/         # 공유 Zod 스키마 (핵심!)
    ├── eslint-config/
    └── typescript-config/
```

---

## 개발 워크플로우

### 풀스택 PRD 기반 TDD 플로우

```
① PRD 작성           docs/features/{feature}.md
       ↓
② 스키마 설계         /sync-schema {feature}   ← Architect 에이전트
       ↓
  ┌────┴────┐
  ↓         ↓
③-A API 구현         /sync-api {feature}       ← Backend 에이전트
  │         ↓
  │  ③-B E2E 작성    /sync-e2e {feature}       ← Frontend 에이전트
  │         ↓
  │  ③-C 프런트 구현 /sync-impl {feature}      ← Frontend 에이전트
  └────┬────┘
       ↓
④ 코드 리뷰           /qa-review
       ↓
⑤ 성능 리뷰           /perf-review
       ↓
⑥ 커밋                git commit
```

### 오케스트레이터 — 단일 커맨드

```bash
/new-feature {feature}   # 전체 플로우 자동 실행
```

---

## 패키지 매니저 & 명령어

**패키지 매니저: pnpm (npm, yarn 금지)**

```bash
# 개발 환경 시작
docker compose up -d         # PostgreSQL
pnpm install                 # 의존성 설치
pnpm --filter api dev        # API 서버 (포트 3000)
pnpm --filter web dev        # 프런트 서버 (포트 5173)

# DB
pnpm --filter api db:push    # 스키마 푸시 (개발)
pnpm --filter api db:migrate # 마이그레이션 실행
pnpm --filter api db:studio  # Drizzle Studio

# 린트
pnpm --filter api lint       # 백엔드 린트
pnpm --filter web lint       # 프런트 린트

# 타입 체크
pnpm --filter api typecheck  # 백엔드 타입 체크
pnpm --filter web typecheck  # 프런트 타입 체크

# 테스트
pnpm --filter api test                    # 백엔드 단위 테스트
pnpm --filter web test:bot {feature}      # E2E 테스트 (특정 기능)
pnpm --filter web test:bot                # E2E 전체
pnpm --filter web test:bot:changed        # 변경분만

# 빌드
pnpm build                   # 전체 빌드
```

---

## 에이전트 구성 (8개)

| # | 에이전트 | 역할 | 모델 |
|---|---------|------|------|
| 1 | `architect` | 공유 스키마 + DB 스키마 설계 | opus |
| 2 | `backend` | Hono API + Vitest 테스트 | sonnet |
| 3 | `frontend` | E2E + 6계층 UI 구현 | sonnet |
| 4 | `qa` | 코드 품질 리뷰 | sonnet |
| 5 | `perf` | 성능 분석 + 최적화 | sonnet |
| 6 | `devops` | CI/CD, Docker, 배포 | sonnet |
| 7 | `security` | 보안 감사 | sonnet |
| 8 | `error-handler` | 에러 진단/수정 | sonnet |

---

## 파일 소유권

| 영역 | 소유 에이전트 |
|------|-------------|
| `packages/shared/**` | Architect (다른 에이전트는 import만) |
| `apps/api/src/db/schema/**` | Architect |
| `apps/api/src/routes,services,middleware/**` | Backend |
| `apps/api/tests/**` | Backend |
| `apps/web/src/**` | Frontend |
| `apps/web/tests/**` | Frontend |

---

## Zod 스키마가 Single Source of Truth

```
packages/shared/src/schemas/{domain}.ts
  ↓ import
apps/api/src/routes/{domain}/index.ts  (zValidator 검증)
  ↓ import
apps/web/src/services/{domain}/schema.ts  (re-export)
  ↓ import
apps/web/src/app/{domain}/hooks/use-{feature}.ts  (zodResolver)
```

별도 OpenAPI 스펙이나 계약 파일 불필요.

---

## 훅 동작

| 트리거 | 동작 |
|--------|------|
| `git commit` | 백엔드 tsc + 프런트 tsc + 백엔드 테스트 통과 시에만 허용 |
| `docs/features/*.md` 수정 | `/sync-schema --auto` → `/sync-api --auto` → `/sync-e2e --auto` → `/sync-impl --auto` 자동 실행 |
| `packages/shared/src/schemas/*.ts` 수정 | `pnpm --filter api typecheck && pnpm --filter web typecheck` 실행 알림 |

---

## 레퍼런스 구현 — 인증 (로그인)

- **PRD**: `docs/features/login.md`
- **공유 스키마**: `packages/shared/src/schemas/auth.ts`
- **DB 스키마**: `apps/api/src/db/schema/users.ts`
- **API**: `apps/api/src/routes/auth/`
- **프런트**: `apps/web/src/app/auth/login-page.tsx`
- **E2E**: `apps/web/tests/e2e/login.spec.ts`

---

## 환경변수

`.env.example` 복사 후 수정:

```bash
cp .env.example .env
```

| 변수 | 용도 |
|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `JWT_SECRET` | JWT 서명 키 (32자 이상) |
| `VITE_API_BASE_URL` | 프런트에서 API 서버 주소 |

