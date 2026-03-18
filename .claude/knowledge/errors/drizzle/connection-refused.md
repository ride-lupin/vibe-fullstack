---
error_pattern: "connect ECONNREFUSED 127.0.0.1:5432"
category: drizzle
frequency: high
auto_fixable: false
---

## 증상

API 서버 실행 시 PostgreSQL 연결 실패.

## 원인

1. Docker Compose로 PostgreSQL이 실행되지 않음
2. `.env` 파일의 `DATABASE_URL`이 설정되지 않음
3. PostgreSQL 포트가 다름

## 해결책

```bash
# 1. PostgreSQL 실행 확인
docker compose up -d postgres

# 2. 연결 확인
docker compose ps

# 3. .env 파일 확인
cat .env | grep DATABASE_URL
# 예: DATABASE_URL=postgresql://postgres:password@localhost:5432/vibe_fullstack

# 4. .env.example 복사
cp .env.example .env
```

## 예방

`apps/api/src/lib/env.ts`의 Zod 검증이 서버 시작 전에 `DATABASE_URL` 형식을 확인함.
그러나 DB 서버 자체가 실행 중인지는 런타임에만 알 수 있음.
