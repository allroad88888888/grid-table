import { Table } from '@grid-table/view'
import type { ColumnType, FilterState, TextFilterValue, NumberFilterValue, SelectFilterValue } from '@grid-table/view'
import { useState, useCallback } from 'react'

type Person = {
  id: number
  name: string
  age: number
  score: number
  department: string
}

const departments = ['技术部', '产品部', '设计部', '市场部', '人事部', '财务部']

const generateData = (count: number): Person[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `员工${i + 1}`,
    age: 22 + Math.floor(Math.random() * 20),
    score: 50 + Math.floor(Math.random() * 50),
    department: departments[i % departments.length],
  }))

const dataSource = generateData(50)

const columns: ColumnType[] = [
  { title: '姓名', dataIndex: 'name', width: 120, sorter: true, filterType: 'text' },
  { title: '年龄', dataIndex: 'age', width: 80, align: 'center', sorter: true, filterType: 'number' },
  { title: '得分', dataIndex: 'score', width: 80, align: 'right', filterType: 'number' },
  { title: '部门', dataIndex: 'department', width: 120, filterType: 'select' },
]

export function FilterDemo() {
  const [filterState, setFilterState] = useState<FilterState>(new Map())
  const [nameFilter, setNameFilter] = useState('')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [selectedDepts, setSelectedDepts] = useState<string[]>([])

  const applyFilters = useCallback(() => {
    const next: FilterState = new Map()

    if (nameFilter) {
      const val: TextFilterValue = { type: 'text', operator: 'contains', value: nameFilter }
      next.set('name', val)
    }

    if (ageMin || ageMax) {
      const min = ageMin ? Number(ageMin) : -Infinity
      const max = ageMax ? Number(ageMax) : Infinity
      const val: NumberFilterValue = { type: 'number', operator: 'between', value: [min, max] }
      next.set('age', val)
    }

    if (selectedDepts.length > 0) {
      const val: SelectFilterValue = { type: 'select', operator: 'include', value: selectedDepts }
      next.set('department', val)
    }

    setFilterState(next)
  }, [nameFilter, ageMin, ageMax, selectedDepts])

  const clearFilters = useCallback(() => {
    setFilterState(new Map())
    setNameFilter('')
    setAgeMin('')
    setAgeMax('')
    setSelectedDepts([])
  }, [])

  const toggleDept = useCallback((dept: string) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
    )
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h2>过滤演示</h2>
      <p>配置过滤条件后点击"应用过滤"，支持多列 AND 逻辑组合</p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>姓名（包含）</label>
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="输入关键字"
            style={{ width: 120, padding: '4px 8px' }}
            data-testid="filter-name-input"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>年龄范围</label>
          <input
            type="number"
            value={ageMin}
            onChange={(e) => setAgeMin(e.target.value)}
            placeholder="最小"
            style={{ width: 60, padding: '4px 8px' }}
          />
          <span style={{ margin: '0 4px' }}>-</span>
          <input
            type="number"
            value={ageMax}
            onChange={(e) => setAgeMax(e.target.value)}
            placeholder="最大"
            style={{ width: 60, padding: '4px 8px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>部门</label>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {departments.map((dept) => (
              <label key={dept} style={{ fontSize: 12 }}>
                <input
                  type="checkbox"
                  checked={selectedDepts.includes(dept)}
                  onChange={() => toggleDept(dept)}
                />
                {dept}
              </label>
            ))}
          </div>
        </div>

        <button onClick={applyFilters} style={{ padding: '4px 12px' }} data-testid="filter-apply-btn">应用过滤</button>
        <button onClick={clearFilters} style={{ padding: '4px 12px' }} data-testid="filter-clear-btn">清除</button>
      </div>

      <div data-testid="filter-status" style={{ marginBottom: 16, padding: 8, background: '#f5f5f5', borderRadius: 4, fontSize: 13 }}>
        <strong>过滤条件数：</strong> {filterState.size}
        {filterState.size > 0 && (
          <span style={{ marginLeft: 8 }}>
            ({[...filterState.keys()].join(', ')})
          </span>
        )}
      </div>

      <Table
        style={{ width: '100%', height: 500 }}
        columns={columns}
        dataSource={dataSource}
        idProp="id"
        filter={{
          state: filterState,
          onChange: setFilterState,
        }}
        sort={{}}
        enableCopy
        enableSelectArea
        rowHeight={36}
        cellDefaultWidth={100}
      />
    </div>
  )
}

export default FilterDemo
