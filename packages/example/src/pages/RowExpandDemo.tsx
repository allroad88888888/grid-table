import { Table } from '@grid-table/view'
import type { ColumnType } from '@grid-table/view'
import { useState } from 'react'

type Person = {
  id: number
  name: string
  age: number
  department: string
  email: string
  phone: string
  address: string
}

const dataSource: Person[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `员工${i + 1}`,
  age: 22 + Math.floor(Math.random() * 20),
  department: ['技术部', '产品部', '设计部', '市场部'][i % 4],
  email: `user${i + 1}@company.com`,
  phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
  address: `城市${(i % 5) + 1}区 路${i + 1}号`,
}))

const columns: ColumnType[] = [
  { title: '姓名', dataIndex: 'name', width: 120 },
  { title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
  { title: '部门', dataIndex: 'department', width: 120 },
  { title: '邮箱', dataIndex: 'email', width: 200 },
]

export function RowExpandDemo() {
  const [accordion, setAccordion] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])

  return (
    <div style={{ padding: 16 }}>
      <h2>行展开演示</h2>
      <p>点击行展开查看详细信息</p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
        <label>
          <input
            type="checkbox"
            checked={accordion}
            onChange={(e) => {
              setAccordion(e.target.checked)
              setExpandedKeys([])
            }}
          />
          {' '}手风琴模式（同时只展开一行）
        </label>
      </div>

      <div data-testid="expand-status" style={{ marginBottom: 16, padding: 8, background: '#f5f5f5', borderRadius: 4, fontSize: 13 }}>
        <strong>已展开行：</strong>
        {expandedKeys.length === 0 ? ' 无' : ` [${expandedKeys.join(', ')}]`}
      </div>

      <Table
        style={{ width: '100%', height: 500 }}
        columns={columns}
        dataSource={dataSource}
        idProp="id"
        rowExpand={{
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: setExpandedKeys,
          accordion,
          onExpand: (expanded, rowId) => {
            console.log('onExpand:', expanded, rowId)
          },
        }}
        rowHeight={36}
        cellDefaultWidth={100}
        enableCopy
        enableSelectArea
      />

      <div style={{ marginTop: 16, padding: 12, background: '#fff3cd', borderRadius: 4, fontSize: 13 }}>
        <strong>注意：</strong> 行展开功能的渲染层尚未完成。当前 demo 演示的是展开状态管理逻辑，
        展开行 ID（__expand_xxx）已正确插入到行列表中。展开行的自定义内容渲染需要后续实现。
      </div>
    </div>
  )
}

export default RowExpandDemo
