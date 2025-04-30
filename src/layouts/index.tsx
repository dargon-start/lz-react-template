import { useState, memo, useMemo, Suspense } from 'react'
import { Outlet } from 'react-router'
import { Layout, theme, Spin } from 'antd'
import Header from './components/Header'
import SideBar from './components/SideBar'

const { Sider, Content } = Layout

export default memo(function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  // 使用 useMemo 缓存样式对象，避免不必要的重新计算
  const contentStyle = useMemo(
    () => ({
      margin: '24px 16px',
      padding: 24,
      minHeight: 280,
      background: colorBgContainer,
      borderRadius: borderRadiusLG
    }),
    [colorBgContainer, borderRadiusLG]
  )
  console.log('layout')

  return (
    <Layout className='h-screen overflow-hidden'>
      <Sider
        trigger={null}
        style={{ background: colorBgContainer }}
        collapsible
        collapsed={collapsed}
      >
        <SideBar collapsed={collapsed}></SideBar>
      </Sider>
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={contentStyle}>
          <Suspense fallback={<Spin />}>
            <Outlet></Outlet>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  )
})
