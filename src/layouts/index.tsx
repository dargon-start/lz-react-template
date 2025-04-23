import React, { useState } from 'react'
import { Outlet } from 'react-router'
import { Layout, theme } from 'antd'
import Header from './components/Header'
import SideBar from './components/SideBar'

const { Sider, Content } = Layout

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

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
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout
