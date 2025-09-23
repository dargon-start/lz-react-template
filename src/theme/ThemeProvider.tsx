import { useEffect, useState } from 'react'
import { ConfigProvider, theme } from 'antd'
import { useSettings } from '@/store'
import { ThemeMode } from '#/enum'
import { presetsColors } from '@/theme/tokens/color'
import CssTheme from './CssTheme'

interface ThemeProviderProps {
  children: React.ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { themeMode, themeColorPresets } = useSettings()
  const [, setRefresh] = useState(0)

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setRefresh(prev => prev + 1)
      }
    }
    window.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  let tm = theme.defaultAlgorithm
  if (themeMode === ThemeMode.System) {
    // 获取系统主题
    tm = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? theme.darkAlgorithm
      : theme.defaultAlgorithm
  } else {
    tm = themeMode === ThemeMode.Dark ? theme.darkAlgorithm : theme.defaultAlgorithm
  }

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: tm,
          token: {
            colorPrimary: presetsColors[themeColorPresets]
          }
        }}
      >
        {children}
        <CssTheme></CssTheme>
      </ConfigProvider>
    </>
  )
}
