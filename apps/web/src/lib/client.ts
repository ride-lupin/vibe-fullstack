import ky from 'ky'
import { useAuthStore } from '@/store/auth-store'

export const apiClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL + '/',
  hooks: {
    beforeRequest: [
      (request) => {
        const token = useAuthStore.getState().token
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})
