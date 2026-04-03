import { Table } from '@grid-table/view'
import type { ColumnType, SortState } from '@grid-table/view'
import { useState, useCallback } from 'react'

type Person = {
  id: number
  name: string
  age: number
  score: number
  department: string
  joinDate: string
}

const departments = ['技术部', '产品部', '设计部', '市场部', '人事部', '财务部']

const generateData = (count: number): Person[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `员工${i + 1}`,
    age: 22 + Math.floor(Math.random() * 20),
    score: 50 + Math.floor(Math.random() * 50),
    department: departments[i % departments.length],
    joinDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  }))

const dataSource = generateData(50)

const columns: ColumnType[] = [
  { title: '姓名', dataIndex: 'name', width: 120, sorter: true },
  { title: '年龄', dataIndex: 'age', width: 80, align: 'center', sorter: true },
  {
    title: '得分',
    dataIndex: 'score',
    width: 80,
    align: 'right',
    sorter: (a: Record<string, any>, b: Record<string, any>) => (a.score as number) - (b.score as number),
  },
  { title: '部门', dataIndex: 'department', width: 120, sorter: true },
  { title: '入职日期', dataIndex: 'joinDate', width: 120, sorter: true },
]

export function SortDemo() {
  const [sortState, setSortState] = useState<SortState>([])
  const [enableMultiSort, setEnableMultiSort] = useState(true)

  const onSortChange = useCallback((next: SortState) => {
    setSortState(next)
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h2>排序演示</h2>
      <p>点击表头排序，Shift+Click 多列排序</p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
        <label>
          <input
            type="checkbox"
            checked={enableMultiSort}
            onChange={(e) => setEnableMultiSort(e.target.checked)}
          />
          {' '}启用多列排序
        </label>
        <button onClick={() => setSortState([])}>清除排序</button>
      </div>

      <div data-testid="sort-status" style={{ marginBottom: 16, padding: 8, background: '#f5f5f5', borderRadius: 4, fontSize: 13 }}>
        <strong>当前排序状态：</strong>
        {sortState.length === 0
          ? ' 无'
          : sortState.map((s, i) => (
              <span key={s.columnId} style={{ marginLeft: 8 }}>
                {i > 0 && ' → '}
                {s.columnId} ({s.direction})
              </span>
            ))}
      </div>

      <Table
        style={{ width: '100%', height: 500 }}
        columns={columns}
        dataSource={dataSource}
        idProp="id"
        sort={{
          state: sortState,
          onChange: onSortChange,
          enableMultiSort,
        }}
        enableCopy
        enableSelectArea
        enableHeadContextMenu
        rowHeight={36}
        cellDefaultWidth={100}
      />
    </div>
  )
}

export default SortDemo
