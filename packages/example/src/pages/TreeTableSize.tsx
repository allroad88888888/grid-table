import type { ColumnType } from '@grid-table/view'
import { Table } from '@grid-table/view/src'
import { Tag, Button, Space } from 'antd'
import { useState } from 'react'

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
    dataIndex: 'age',
    width: 100,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: 100,
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    width: 100,
    render: (_, { tags }) => (
      <>
        {(tags as string[]).map((tag) => {
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
    width: 100,
    render: (_, record) => {
      return <>操作列</>
    },
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

const rowSelection = {
  width: 20,
}

export function TreeTableSizeDemo() {
  const [stateColumns, setColumnCount] = useState(columns) // 初始显示所有5列

  const handleReduceColumns = () => {
    setColumnCount(
      columns.map((column) => {
        return {
          ...column,
          width: 200,
        }
      }),
    ) // 最少保留1列
  }
  const handleReduceColumnsHalf = () => {
    setColumnCount(
      columns.map((column) => {
        return {
          ...column,
          width: 50,
        }
      }),
    ) // 最少保留1列
  }

  const handleResetColumns = () => {
    setColumnCount(columns) // 重置为显示所有列
  }

  return (
    <div
      style={{
        width: 800,
        height: 300,
      }}
    >
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={handleReduceColumns}>每列200</Button>
        <Button onClick={handleReduceColumnsHalf}>每列50</Button>
        <Button onClick={handleResetColumns}>重置所有列</Button>
      </Space>

      <Table
        rowSelection={rowSelection}
        columns={stateColumns}
        dataSource={data}
        parentProp="parentId"
        idProp="id"
      />
    </div>
  )
}

export default TreeTableSizeDemo
