import { theme } from 'antd'

const { useToken } = theme
export default function CssTheme() {
  let { token } = useToken()
  console.log(token, 'token')

  const globalVars = `html {
    --ant-color-primary: ${token.colorPrimary};
    --ant-color-primary-hover: ${token.colorPrimaryHover};
  }`
  return <style>{globalVars}</style>
}
