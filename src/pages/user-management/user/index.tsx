import { memo } from 'react'
interface UserProps {}

export default memo(function index({}: UserProps) {
  console.log('user')

  return <>user</>
})
