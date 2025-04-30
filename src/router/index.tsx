import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import { lazy, Suspense } from 'react'
import DashboardLayout from '@/layouts/index'
import userManagement from './modules/userManagement'
import test from './modules/test'

const Login = lazy(() => import('@/pages/login'))

const PUBLIC_ROUTE = {
  path: '/login',
  element: <Login></Login>
}

const NO_MATCHED_ROUTE = {
  path: '*',
  element: <Navigate to='/404' replace />
}

export const MENU_ROUTE = [userManagement, test]

const PROTECTED_ROUTE = [
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Navigate to='/user-management/user' replace />
      }
    ]
  },
  ...MENU_ROUTE
]

export default function Router() {
  const routes = [PUBLIC_ROUTE, ...PROTECTED_ROUTE, NO_MATCHED_ROUTE]

  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}
