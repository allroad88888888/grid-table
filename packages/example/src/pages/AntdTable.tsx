import AntdTable from '@grid/table/src/antd/AntdTable'
import type { ColumnType } from '@grid/table/src/plugins/data/type'
import { Space, Tag } from 'antd'
const columns: ColumnType[] = [
  {
    title: 'Name',
    dataIndex: 'name',

    render: (text) => {
      return <a>{text}</a>
    },
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green'
          if (tag === 'loser') {
            color = 'volcano'
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        })}
      </>
    ),
  },
  {
    title: 'Action',
    render: (_, record) => (
      <Space size="middle">
        <a>
          Invite
          {record.name}
        </a>
        <a>Delete</a>
      </Space>
    ),
  },
]
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

export function AntdTableDemo() {
  return <AntdTable columns={columns} dataSource={data} />
}

export default AntdTableDemo
