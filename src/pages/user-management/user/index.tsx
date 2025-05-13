import { memo } from 'react'
interface UserProps {}

export default memo(function index({}: UserProps) {
  console.log('user')

  return (
    <>
      <div className='text-primary text-base hover:text-primary-hover'>user</div>
    </>
  )
})
