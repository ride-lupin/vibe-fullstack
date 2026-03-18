---
name: error-report
description: >
  에러 현황 리포트 스킬. .claude/knowledge/errors/ 통계를 분석하여
  카테고리별 에러 빈도와 해결/미해결 현황을 보고한다.
  "/error-report" 요청 시 이 스킬을 사용한다.
---

# error-report

`.claude/knowledge/errors/` 디렉토리를 분석하여 프로젝트 에러 현황을 리포트한다.

## 실행 흐름

1. `find .claude/knowledge/errors -name "*.md"` 로 모든 에러 파일 수집
2. frontmatter (`category`, `frequency`, `auto_fixable`) 파싱
3. 카테고리별 집계
4. 리포트 출력

## 출력 형식

```
## 에러 현황 리포트

### 카테고리별 통계
| 카테고리 | 에러 수 | 자동 수정 가능 | 빈도 높음 |
|---------|--------|--------------|---------|
| typescript | N | N | N |
| playwright | N | N | N |
| hono | N | N | N |
| drizzle | N | N | N |
| build | N | N | N |

### 빈도 높음 (Top 5)
1. {파일}: {error_pattern}
2. ...

### 자동 수정 가능
- {파일}: {error_pattern}

### 주의 필요 (auto_fixable: false, frequency: high)
- {파일}: {error_pattern}
```
