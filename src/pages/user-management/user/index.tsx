import { memo } from 'react'
import { Table, Tag } from 'antd'
import useSWR from 'swr'
import { getOrgList } from '@/api/user-management'
import type { Organization } from '@/api/user-management/org.type'
interface dataType extends Organization {
  key: React.ReactNode
}

interface UserProps {}

export default memo(function index({}: UserProps) {
  const {
    data,
    isLoading,
    error
  } = useSWR('/api/user-management/orgs', () => getOrgList({}))

  const tableData = data?.map(item => ({
    ...item,
    key: item.id
  }))



  if (error) return <div>failed to load</div>

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => {
        return <Tag color={status === 'enable' ? 'success' : 'error'}>{status}</Tag>
      }
    },
    {
      title: 'Description',
      dataIndex: 'desc'
    }
  ]

  return (
    <>
      <div className='text-primary text-base hover:text-primary-hover'>用户列表</div>
      <Table<dataType> columns={columns} dataSource={tableData} loading={isLoading} />
    </>
  )
})
