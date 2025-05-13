import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import { lazy, Suspense } from 'react'
import userManagement from './modules/userManagement'
import test from './modules/test'

const Login = lazy(() => import('@/pages/login'))
const Page403 = lazy(() => import('@/pages/error/page-403'))
const Page404 = lazy(() => import('@/pages/error/page-404'))

const PUBLIC_ROUTE = [
  {
    path: '/login',
    element: <Login></Login>
  },
  {
    path: '/403',
    element: <Page403></Page403>
  },
  {
    path: '/404',
    element: <Page404></Page404>
  }
]

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
  const routes = [...PUBLIC_ROUTE, ...PROTECTED_ROUTE, NO_MATCHED_ROUTE]

  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}
