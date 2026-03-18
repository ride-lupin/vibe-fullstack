/**
 * 로그인 E2E 테스트
 * 명세서: doc/login.md
 */
import { test, expect } from '@playwright/test'

const TEST_EMAIL = process.env['TEST_EMAIL'] ?? 'test@example.com'
const TEST_PASSWORD = process.env['TEST_PASSWORD'] ?? 'password123'

test.describe('로그인', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/login')
  })

  // --- 화면 구성 ---
  test('화면 구성 — 이메일 입력 필드가 표시된다', async ({ page }) => {
    await expect(page.getByLabel('이메일')).toBeVisible()
  })

  test('화면 구성 — 비밀번호 입력 필드가 표시된다', async ({ page }) => {
    await expect(page.getByLabel('비밀번호')).toBeVisible()
  })

  test('화면 구성 — 로그인 버튼이 표시된다', async ({ page }) => {
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible()
  })

  // --- 로그인 플로우 ---
  test('로그인 플로우 — 유효한 자격증명으로 로그인하면 대시보드로 이동한다', async ({ page }) => {
    await page.route('**/v1/auth/login**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { accessToken: 'mock-token' },
        }),
      }),
    )

    await page.getByLabel('이메일').fill(TEST_EMAIL)
    await page.getByLabel('비밀번호').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: '로그인' }).click()

    await expect(page).toHaveURL('/dashboard')
  })

  // --- 예외 처리 ---
  test('예외 처리 — 이메일을 입력하지 않으면 에러 메시지가 표시된다', async ({ page }) => {
    await page.getByRole('button', { name: '로그인' }).click()
    await expect(page.getByText('올바른 이메일을 입력해주세요')).toBeVisible()
  })

  test('예외 처리 — 비밀번호가 8자 미만이면 에러 메시지가 표시된다', async ({ page }) => {
    await page.getByLabel('이메일').fill(TEST_EMAIL)
    await page.getByLabel('비밀번호').fill('1234')
    await page.getByRole('button', { name: '로그인' }).click()
    await expect(page.getByText('비밀번호는 8자 이상이어야 합니다')).toBeVisible()
  })

  test('예외 처리 — API 오류 시 alert가 표시된다', async ({ page }) => {
    await page.route('**/v1/auth/login**', (route) =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: '이메일 또는 비밀번호가 올바르지 않습니다' },
        }),
      }),
    )

    const dialog = page.waitForEvent('dialog')
    await page.getByLabel('이메일').fill(TEST_EMAIL)
    await page.getByLabel('비밀번호').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: '로그인' }).click()

    const alertDialog = await dialog
    expect(alertDialog.message()).toBe('이메일 또는 비밀번호가 올바르지 않습니다')
    await alertDialog.dismiss()
  })
})
