import { createBrowserRouter, redirect } from 'react-router-dom'
import { getToken } from '@/store/auth-store'
import { ROUTES } from './routes'

const authLoader = () => {
  if (!getToken()) return redirect(ROUTES.LOGIN)
  return null
}

const guestLoader = () => {
  if (getToken()) return redirect(ROUTES.DASHBOARD)
  return null
}

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    loader: guestLoader,
    lazy: async () => {
      const { LoginPage } = await import('@/app/auth/login-page')
      return { Component: LoginPage }
    },
  },
  {
    path: ROUTES.DASHBOARD,
    loader: authLoader,
    lazy: async () => {
      const { DashboardPage } = await import('@/app/dashboard/dashboard-page')
      return { Component: DashboardPage }
    },
  },
  {
    index: true,
    loader: () => redirect(ROUTES.LOGIN),
  },
])
