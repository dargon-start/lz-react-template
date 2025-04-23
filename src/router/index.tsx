import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import DashboardLayout from '@/layouts/index'
import Login from '@/pages/login'
import Test from '@/pages/test'

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env

const PUBLIC_ROUTE = {
  path: '/login',
  element: <Login />
}

const NO_MATCHED_ROUTE = {
  path: '*',
  element: <Navigate to='/404' replace />
}

export default function Router() {
  const PROTECTED_ROUTE = {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={HOMEPAGE} replace />
      },
      {
        path: '/test',
        element: <Test />
      }
    ]
  }

  const routes = [PUBLIC_ROUTE, PROTECTED_ROUTE, NO_MATCHED_ROUTE]

  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}
