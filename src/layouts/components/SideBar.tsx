import React from 'react'
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import logo from '@/assets/images/logo.png'

interface SideBarProps {
  collapsed: boolean
}

const SideBar: React.FC<SideBarProps> = ({ collapsed }) => {
  return (
    <>
      <div className='flex items-center justify-center'>
        <img src={logo} alt='logo' className='w-10 h-10' />
        {!collapsed ? <div>react-tempalte</div> : null}
      </div>
      <Menu
        theme='light'
        mode='inline'
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <UserOutlined />,
            label: 'nav 1'
          },
          {
            key: '2',
            icon: <VideoCameraOutlined />,
            label: 'nav 2'
          },
          {
            key: '3',
            icon: <UploadOutlined />,
            label: 'nav 3'
          }
        ]}
      />
    </>
  )
}

export default SideBar
