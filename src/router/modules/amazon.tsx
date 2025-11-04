import { lazy } from 'react'
import { ShoppingOutlined } from '@ant-design/icons'
import DashboardLayout from '@/layouts/index'

const Amazon = lazy(() => import('@/pages/amazon'))

export default {
  path: '/amazon',
  element: <DashboardLayout />,
  meta: {
    label: 'Amazon Listing 生成器',
    icon: <ShoppingOutlined />,
    key: '/amazon'
  },
  children: [
    {
      index: true,
      element: <Amazon />,
      meta: {
        label: 'Listing 生成',
        key: '/amazon'
      }
    }
  ]
}

