import { Table } from '@grid-table/view'
import type { ColumnType } from '@grid-table/view'
import type { UseRowSelectionProps } from '@grid-table/view/src/plugins/select'
import { useMemo, useState } from 'react'
import './RowNumberDemo.css'

// 模拟数据类型
type Person = {
  id: number
  name: string
  age: number
  email: string
  department: string
  position: string
  salary: number
  joinDate: string
}

// 模拟数据
const generateMockData = (count: number): Person[] => {
  const departments = ['技术部', '产品部', '设计部', '市场部', '人事部', '财务部']
  const positions = ['工程师', '产品经理', '设计师', '市场专员', '人事专员', '财务专员']

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `员工${index + 1}`,
    age: 22 + Math.floor(Math.random() * 20),
    email: `user${index + 1}@company.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    position: positions[Math.floor(Math.random() * positions.length)],
    salary: 8000 + Math.floor(Math.random() * 12000),
    joinDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  }))
}

// 列配置
const columns: ColumnType[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
    fixed: 'left',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 80,
    align: 'center',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 200,
  },
  {
    title: '部门',
    dataIndex: 'department',
    width: 120,
  },
  {
    title: '职位',
    dataIndex: 'position',
    width: 120,
  },
  {
    title: '薪资',
    dataIndex: 'salary',
    width: 100,
    align: 'right',
    render: (text) => `¥${Number(text).toLocaleString()}`,
  },
  {
    title: '入职日期',
    dataIndex: 'joinDate',
    width: 120,
    align: 'center',
  },
]

// 勾选框配置
const rowSelection: UseRowSelectionProps = {
  width: 50,
  fixed: 'left',
  align: 'center',
  title: '选择',
}

export function RowNumberDemo() {
  const [dataSize, setDataSize] = useState(50)
  const [enableRowNumber, setEnableRowNumber] = useState(true)
  const [enableRowSelection, setEnableRowSelection] = useState(false)
  const [rowNumberConfig, setRowNumberConfig] = useState({
    width: 30,
    title: '#',
    startIndex: 21,
  })

  // 生成数据
  const dataSource = generateMockData(dataSize)

  const config = useMemo(() => {
    return {
      enabled: enableRowNumber,
      width: rowNumberConfig.width,
      title: rowNumberConfig.title,
      startIndex: rowNumberConfig.startIndex,
    }
  }, [enableRowNumber, rowNumberConfig])

  return (
    <div className="row-number-demo">
      <div className="row-number-demo__header">
        <h1 className="row-number-demo__title">序号列功能演示</h1>
        <p className="row-number-demo__description">
          展示表格序号列的各种使用场景，包括基本功能、自定义配置和与其他功能的配合使用。
        </p>
      </div>

      {/* 控制面板 */}
      <div className="row-number-demo__controls">
        <div className="row-number-demo__control-group">
          <label className="row-number-demo__control-label">序号列：</label>
          <input
            type="checkbox"
            checked={enableRowNumber}
            onChange={(e) => setEnableRowNumber(e.target.checked)}
          />
          <span>启用</span>
        </div>

        <div className="row-number-demo__control-group">
          <label className="row-number-demo__control-label">勾选框：</label>
          <input
            type="checkbox"
            checked={enableRowSelection}
            onChange={(e) => setEnableRowSelection(e.target.checked)}
          />
          <span>启用</span>
        </div>

        <div className="row-number-demo__control-group">
          <label className="row-number-demo__control-label">数据量：</label>
          <select
            value={dataSize}
            onChange={(e) => setDataSize(Number(e.target.value))}
            className="row-number-demo__control-select"
          >
            <option value={10}>10 条</option>
            <option value={50}>50 条</option>
            <option value={100}>100 条</option>
            <option value={500}>500 条</option>
            <option value={1000}>1000 条</option>
          </select>
        </div>

        {enableRowNumber && (
          <>
            <div className="row-number-demo__control-group">
              <label className="row-number-demo__control-label">序号列宽度：</label>
              <input
                type="number"
                value={rowNumberConfig.width}
                onChange={(e) =>
                  setRowNumberConfig((prev) => ({ ...prev, width: Number(e.target.value) }))
                }
                className="row-number-demo__control-input"
                style={{ width: '80px' }}
                min="50"
                max="200"
              />
            </div>

            <div className="row-number-demo__control-group">
              <label className="row-number-demo__control-label">序号列标题：</label>
              <input
                type="text"
                value={rowNumberConfig.title}
                onChange={(e) => setRowNumberConfig((prev) => ({ ...prev, title: e.target.value }))}
                className="row-number-demo__control-input"
                style={{ width: '80px' }}
              />
            </div>

            <div className="row-number-demo__control-group">
              <label className="row-number-demo__control-label">起始索引：</label>
              <input
                type="number"
                value={rowNumberConfig.startIndex}
                onChange={(e) =>
                  setRowNumberConfig((prev) => ({ ...prev, startIndex: Number(e.target.value) }))
                }
                className="row-number-demo__control-input"
                style={{ width: '80px' }}
                min="0"
                max="100"
              />
            </div>
          </>
        )}
      </div>

      {/* 功能说明 */}
      <div className="row-number-demo__feature-box">
        <h3 className="row-number-demo__feature-title">功能特性</h3>
        <ul className="row-number-demo__feature-list">
          <li>序号列自动固定在左侧，不受水平滚动影响</li>
          <li>支持自定义宽度、标题和起始索引</li>
          <li>序号列 flexGrow 为 0，不参与剩余宽度分配</li>
          <li>禁用区域选中功能，居中对齐显示</li>
          <li>可与勾选框、固定列等功能完美配合</li>
          <li>支持大数据量场景，性能优异</li>
        </ul>
      </div>

      {/* 表格 */}
      <div className="row-number-demo__table-container">
        <Table
          style={{
            width: '100%',
            height: '500px',
          }}
          columns={columns}
          dataSource={dataSource}
          enableRowNumber={config}
          rowSelection={enableRowSelection ? rowSelection : undefined}
          enableCopy={true}
          enableHeadContextMenu={true}
          enableSelectArea={true}
          bordered={true}
          rowHeight={36}
          cellDefaultWidth={120}
        />
      </div>

      {/* 使用说明 */}
      <div className="row-number-demo__section">
        <h3 className="row-number-demo__section-title">使用方法</h3>
        <div className="row-number-demo__code-block">
          {`// 基本使用
<Table
  enableRowNumber={true}  // 开启序号列
  columns={columns}
  dataSource={dataSource}
  // ... 其他 props
/>

// 与勾选框配合使用
<Table
  enableRowNumber={true}
  rowSelection={{
    width: 50,
    fixed: 'left',
    align: 'center',
  }}
  columns={columns}
  dataSource={dataSource}
/>

// 注意：序号列会自动添加到表格的第一列位置
// 具有以下固定配置：
// - flexGrow: 0        (不参与宽度放大)
// - fixed: 'left'      (固定在左侧)
// - enableSelectArea: false  (禁用区域选中)
// - align: 'center'    (居中对齐)`}
        </div>
      </div>

      {/* 性能说明 */}
      <div className="row-number-demo__section">
        <h3 className="row-number-demo__section-title">性能优化</h3>
        <div className="row-number-demo__performance-box">
          <ul className="row-number-demo__performance-list">
            <li>
              <strong>memo 优化：</strong>使用 React.memo 和 useMemo 防止不必要的重渲染
            </li>
            <li>
              <strong>虚拟滚动：</strong>支持大数据量场景，仅渲染可视区域内的序号
            </li>
            <li>
              <strong>智能缓存：</strong>防止重复添加序号列，保持引用稳定性
            </li>
            <li>
              <strong>类型安全：</strong>完整的 TypeScript 类型支持
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RowNumberDemo
