import { useNavigate } from 'react-router-dom'
import { HTTPError } from 'ky'
import { useLoginMutation } from '@/services/auth/queries'
import { useAuthStore } from '@/store/auth-store'
import { ROUTES } from '@/constants/routes'
import type { LoginRequest } from '@/services/auth/schema'

export const useLogin = () => {
  const { mutateAsync, isPending } = useLoginMutation()
  const setToken = useAuthStore((s) => s.setToken)
  const navigate = useNavigate()

  const handleSubmit = async (data: LoginRequest) => {
    try {
      const result = await mutateAsync(data)
      setToken(result.data.accessToken)
      navigate(ROUTES.DASHBOARD)
    } catch (e) {
      if (e instanceof HTTPError) {
        const body = await e.response.json().catch(() => ({}))
        alert((body as { error?: { message?: string } }).error?.message ?? '로그인에 실패했습니다.')
      }
    }
  }

  return { handleSubmit, isPending }
}
