import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import { ROUTES } from '@/constants/routes'

export const DashboardPage = () => {
  const clearToken = useAuthStore((s) => s.clearToken)
  const navigate = useNavigate()

  const handleLogout = () => {
    clearToken()
    navigate(ROUTES.LOGIN)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <button
        onClick={handleLogout}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
      >
        로그아웃
      </button>
    </main>
  )
}
