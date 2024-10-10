import type { ColumnType } from '@grid/table'
import AntdTable from '@grid/table/src/AntdTable'
import { Space, Tag } from 'antd'

const columns: ColumnType[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 100,
    render: (text) => {
      return <a>{text}</a>
    },
  },
  {
    title: 'Age',
    width: 40,
    fixed: 'left',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    fixed: 'right',
    width: 200,
    dataIndex: 'address',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    width: 300,
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
    width: 200,
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
  {
    title: 'column1',
    width: 100,
    fixed: 'right',
    render(cellInfo, rowInfo, { rowId, columnId }) {
      return (
        <div>
          {rowId}-{columnId}
        </div>
      )
    },
  },
  {
    title: 'column2',
    width: 100,
    render(cellInfo, rowInfo, { rowId, columnId }) {
      return (
        <div>
          {rowId}-{columnId}
        </div>
      )
    },
  },
  {
    title: 'column3',
    width: 100,
    fixed: 'left',
    render(cellInfo, rowInfo, { rowId, columnId }) {
      return (
        <div>
          {rowId}-{columnId}
        </div>
      )
    },
  },
  {
    title: 'column4',
    width: 100,
    render(cellInfo, rowInfo, { rowId, columnId }) {
      return (
        <div>
          {rowId}-{columnId}
        </div>
      )
    },
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

const rowSelection = {
  width: 20,
}

export function AntdTableDemo() {
  return (
    <div
      style={{
        width: 800,
      }}
    >
      <AntdTable columns={columns} dataSource={data} rowSelection={rowSelection} />
    </div>
  )
}

export default AntdTableDemo
