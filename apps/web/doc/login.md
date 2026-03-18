# 로그인

## 개요

이메일과 비밀번호로 로그인하는 페이지. 인증 성공 시 대시보드로 이동한다. 로그인하지 않은 사용자가 보호된 라우트 접근 시 이 페이지로 리다이렉트된다.

---

## 화면 구성

- 이메일 입력 필드 (`label: 이메일`)
- 비밀번호 입력 필드 (`label: 비밀번호`)
- 로그인 버튼 (`button: 로그인`)

---

## 로그인 플로우

1. 이메일 입력
2. 비밀번호 입력
3. 로그인 버튼 클릭
4. 유효성 검사 통과 시 `POST /v1/auth/login` 호출
5. 성공 시 accessToken을 Zustand store에 저장 후 `/dashboard`로 이동

**API 연동:**
- Endpoint: `POST /v1/auth/login`
- Request: `{ email: string, password: string }`
- Response: `{ success: true, data: { accessToken: string } }`

---

## 예외 처리

- 이메일을 입력하지 않으면 `올바른 이메일을 입력해주세요` 에러 표시 (서버 요청 없이)
- 비밀번호가 8자 미만이면 `비밀번호는 8자 이상이어야 합니다` 에러 표시 (서버 요청 없이)
- API 오류 시 서버에서 받은 `error.message` 또는 `로그인에 실패했습니다.` alert 표시
