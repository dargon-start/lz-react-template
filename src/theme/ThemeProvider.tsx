import { ConfigProvider, theme } from 'antd'
import { useSettings } from '../store/settingStore'
import { ThemeMode } from '#/enum'
import { presetsColors } from '@/theme/tokens/color'

interface ThemeProviderProps {
  children: React.ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { themeMode, themeColorPresets } = useSettings()

  const tm = themeMode === ThemeMode.Dark ? theme.darkAlgorithm : theme.defaultAlgorithm
  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: tm,
          token: {
            colorPrimary: presetsColors[themeColorPresets].default
          }
        }}
      >
        {children}
      </ConfigProvider>
    </>
  )
}
