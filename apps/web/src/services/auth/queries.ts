import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/client'
import { AUTH_ENDPOINTS } from './constants'
import { LoginResponseSchema, type LoginRequest } from './schema'

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await apiClient.post(AUTH_ENDPOINTS.LOGIN.slice(1), { json: data }).json()
      return LoginResponseSchema.parse(res)
    },
  })
