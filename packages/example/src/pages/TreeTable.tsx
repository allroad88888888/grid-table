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
            <Tag color={color} id={tag} key={tag}>
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
    id: '1',
    name: '1',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    id: '2',
    name: '2',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    id: '3',
    name: '3',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    id: '1-1',
    parentId: '1',
    name: '1-1',
    age: 22,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    id: '1-2',
    parentId: '1',
    name: '1-2',
    age: 22,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    id: '1-1-1',
    parentId: '1-1',
    name: '1-1-1',
    age: 22,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    id: '1-1-1-1',
    parentId: '1-1-1',
    name: '1-1-1-1',
    age: 22,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
]

export function TreeTableDemo() {
  return <AntdTable columns={columns} dataSource={data} parentProp="parentId" idProp="id" />
}

export default TreeTableDemo
