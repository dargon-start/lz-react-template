import React from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { theme, Button } from 'antd'

// 定义 Props 类型
interface HeaderProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed }: HeaderProps) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  return (
    <>
      <header
        style={{ background: colorBgContainer }}
        className='flex items-center justify-between'
      >
        <div>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
        fontSize: '16px',
              width: 64,
              height: 64
            }}
          />
        </div>
        <div className='flex items-center h-full mx-2'>
          <img
            className='avatar w-10 h-10'
            src='https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
            alt='avatar'
          />
          <span className='ml-2'>Admin</span>
        </div>
      </header>
    </>
  )
}

export default Header
