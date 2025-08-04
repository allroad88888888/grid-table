import type { ColumnType } from '@grid-table/view'
import { Table } from '@grid-table/view/src'
import { Tag, Button, Space } from 'antd'
import { useStore } from '@einfach/react'

const columns: ColumnType[] = [
  // 左侧固定列
  {
    title: '序号',
    dataIndex: 'id',
    width: 80,
    fixed: 'left',
    key: 'index',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
    fixed: 'left',
    key: 'name',
    render: (text: any) => <a>{text}</a>,
  },

  // 中间普通列
  {
    title: '年龄',
    dataIndex: 'age',
    width: 80,
    key: 'age',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 200,
    key: 'email',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    width: 120,
    key: 'phone',
  },
  {
    title: '部门',
    dataIndex: 'department',
    width: 120,
    key: 'department',
  },
  {
    title: '职位',
    dataIndex: 'position',
    width: 150,
    key: 'position',
  },
  {
    title: '薪资',
    dataIndex: 'salary',
    width: 100,
    key: 'salary',
    render: (salary: any) => `$${salary?.toLocaleString()}`,
  },
  {
    title: '入职日期',
    dataIndex: 'startDate',
    width: 120,
    key: 'startDate',
  },

  // 右侧固定列
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    fixed: 'right',
    key: 'status',
    render: (status: any) => {
      const color = status === 'Active' ? 'green' : status === 'Inactive' ? 'red' : 'orange'
      return <Tag color={color}>{status}</Tag>
    },
  },
  {
    title: '操作',
    width: 120,
    fixed: 'right',
    key: 'action',
    render: (_: any, record: any) => (
      <Space>
        <Button size="small" type="link">
          编辑
        </Button>
        <Button size="small" type="link" danger>
          删除
        </Button>
      </Space>
    ),
  },
]

const data = [
  {
    id: '1',
    name: 'John Doe',
    age: 32,
    email: 'john.doe@company.com',
    phone: '+1-555-0101',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 120000,
    startDate: '2020-01-15',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 28,
    email: 'jane.smith@company.com',
    phone: '+1-555-0102',
    department: 'Design',
    position: 'UI/UX Designer',
    salary: 95000,
    startDate: '2021-03-20',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    age: 45,
    email: 'bob.johnson@company.com',
    phone: '+1-555-0103',
    department: 'Engineering',
    position: 'Tech Lead',
    salary: 150000,
    startDate: '2018-07-10',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Alice Brown',
    age: 35,
    email: 'alice.brown@company.com',
    phone: '+1-555-0104',
    department: 'Product',
    position: 'Product Manager',
    salary: 130000,
    startDate: '2019-11-05',
    status: 'Inactive',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    age: 29,
    email: 'charlie.wilson@company.com',
    phone: '+1-555-0105',
    department: 'Engineering',
    position: 'Frontend Developer',
    salary: 85000,
    startDate: '2022-02-14',
    status: 'Active',
  },
  {
    id: '6',
    name: 'Diana Lee',
    age: 31,
    email: 'diana.lee@company.com',
    phone: '+1-555-0106',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 110000,
    startDate: '2020-08-20',
    status: 'Active',
  },
  {
    id: '7',
    name: 'Eva Garcia',
    age: 27,
    email: 'eva.garcia@company.com',
    phone: '+1-555-0107',
    department: 'Design',
    position: 'Graphic Designer',
    salary: 75000,
    startDate: '2021-12-01',
    status: 'Pending',
  },
  {
    id: '8',
    name: 'Frank Miller',
    age: 38,
    email: 'frank.miller@company.com',
    phone: '+1-555-0108',
    department: 'QA',
    position: 'QA Manager',
    salary: 105000,
    startDate: '2019-04-15',
    status: 'Active',
  },
]

export function EditTableDemo() {
  const store = useStore()

  return (
    <div
      style={{
        width: '100%',
        height: 400,
        padding: 16,
      }}
    >
      <Table
        columns={columns}
        dataSource={data}
        idProp="id"
        bordered
        store={store}
        enableSelectArea={true}
        enableHeadContextMenu={true}
        enableColumnResize={true}
        enableCopy={true}
      />
    </div>
  )
}

export default EditTableDemo
