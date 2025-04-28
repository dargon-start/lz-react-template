import { Menu, type MenuProps } from 'antd'
import { useNavigate, useMatches } from 'react-router'
import { MENU_ROUTE } from '@/router'
import { useRouteToMenu, usePathname } from '@/hooks'
import logo from '/logo.png'
import { useEffect, useState, useMemo } from 'react'

interface SideBarProps {
  collapsed: boolean
}

export default function SideBar({ collapsed }: SideBarProps) {
  const menuItems = useRouteToMenu(MENU_ROUTE)
  const navigate = useNavigate()
  const pathname = usePathname()
  const matches = useMatches()

  const [openKeys, setOpenKeys] = useState<string[]>([])
  const selectKeys = useMemo(() => [pathname], [pathname])

  // 监听路由变化，设置openKeys
  useEffect(() => {
    if (!collapsed) {
      const keys = matches
        .filter(match => match.pathname !== '/' && match.pathname !== pathname)
        .map(match => match.pathname)
      setOpenKeys(keys)
    }
  }, [pathname, matches, collapsed])

  const changeMenu: MenuProps['onClick'] = info => {
    navigate(info.key)
  }

  const handleOpenChange: MenuProps['onOpenChange'] = keys => {
    setOpenKeys(keys)
  }

  return (
    <>
      <div className='flex items-center justify-center'>
        <img src={logo} alt='logo' className='w-10 h-10' />
        {!collapsed ? <div>react-template</div> : null}
      </div>
      <Menu
        mode='inline'
        theme='light'
        onClick={changeMenu}
        selectedKeys={selectKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: item.children?.map(child => ({
            key: child.key,
            label: child.label
          }))
        }))}
      ></Menu>
    </>
  )
}
