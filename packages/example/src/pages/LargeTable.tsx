import { atom, createStore } from '@einfach/state'
import { VGridTable } from '@grid-table/core'
import type { CellsRenderProps } from '@grid-table/core'
import { useMemo, useCallback, memo, useState } from 'react'
import './LargeTable.css'

// 创建一个百万+的格子 (1000行 x 1000列 = 1,000,000格子)
const ROWS = 1000
const COLUMNS = 1000

// 用于单元格值计算的函数
const getCellValue = (rowIndex: number, columnIndex: number) => {
  return `${rowIndex},${columnIndex}`
}

// 使用atom存储状态
const rowIndexListAtom = atom<number[]>([])
const columnIndexListAtom = atom<number[]>([])

// 初始化store
const store = createStore()

// 初始化数据
store.setter(rowIndexListAtom, Array.from({ length: ROWS }, (_, i) => i))
store.setter(columnIndexListAtom, Array.from({ length: COLUMNS }, (_, i) => i))

// 使用memo优化单元格组件
const TheadCell = memo(({ rowIndex, columnIndex, style }: { 
  rowIndex: number
  columnIndex: number
  style: React.CSSProperties 
}) => {
  return (
    <div
      style={style}
      className="large-table-thead-cell"
    >
      {`列-${columnIndex}`}
    </div>
  )
})

// 使用memo优化表体单元格组件
const TbodyCell = memo(({ rowIndex, columnIndex, style }: {
  rowIndex: number
  columnIndex: number
  style: React.CSSProperties
}) => {
  return (
    <div
      style={style}
      className="large-table-cell"
    >
      {getCellValue(rowIndex, columnIndex)}
    </div>
  )
})

export function LargeTableDemo() {
  const [loading, setLoading] = useState(true)
  
  // 使用useMemo缓存行高和列宽的计算函数
  const rowCalcSize = useMemo(() => {
    const cache = new Map<number, number>()
    return (index: number) => {
      if (cache.has(index)) {
        return cache.get(index)!
      }
      const size = 30 // 固定行高
      cache.set(index, size)
      return size
    }
  }, [])

  const columnCalcSize = useMemo(() => {
    const cache = new Map<number, number>()
    return (index: number) => {
      if (cache.has(index)) {
        return cache.get(index)!
      }
      const size = 80 // 固定列宽
      cache.set(index, size)
      return size
    }
  }, [])

  const theadRowCalcSize = useMemo(() => {
    return (index: number) => 40 // 表头行高固定为40px
  }, [])

  // 表头单元格渲染
  const renderTheadCell = useCallback((props: CellsRenderProps) => {
    const { rowIndexList, columnIndexList, getCellStyleByIndex } = props
    return (
      <>
        {rowIndexList.map((rowIndex: number) => (
          columnIndexList.map((columnIndex: number) => (
            <TheadCell
              key={`thead-${rowIndex}-${columnIndex}`}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              style={getCellStyleByIndex(rowIndex, columnIndex)}
            />
          ))
        ))}
      </>
    )
  }, [])

  // 表体单元格渲染
  const renderTbodyCell = useCallback((props: CellsRenderProps) => {
    const { rowIndexList, columnIndexList, getCellStyleByIndex } = props
    return (
      <>
        {rowIndexList.map((rowIndex: number) => (
          columnIndexList.map((columnIndex: number) => (
            <TbodyCell
              key={`cell-${rowIndex}-${columnIndex}`}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              style={getCellStyleByIndex(rowIndex, columnIndex)}
            />
          ))
        ))}
      </>
    )
  }, [])

  // 模拟初始加载
  useMemo(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const EmptyComponent = useCallback(() => (
    <div className="large-table-empty">暂无数据</div>
  ), [])

  const LoadingComponent = useCallback(() => (
    <div className="large-table-loading">加载中...</div>
  ), [])

  return (
    <div className="large-table-container">
      <h1>百万级大表格示例</h1>
      <div className="large-table-stats">
        <div>行数: {ROWS}</div>
        <div>列数: {COLUMNS}</div>
        <div>总格子数: {ROWS * COLUMNS}</div>
      </div>
      <VGridTable
        style={{ 
          width: '100%', 
          height: '600px',
          border: '1px solid #ddd',
          overflow: 'auto'
        }}
        className="large-table"
        // 表格基础设置
        rowCount={ROWS}
        columnCount={COLUMNS}
        rowBaseSize={1}
        columnBaseSize={1}
        // 表头设置
        theadRowCount={1}
        theadBaseSize={1}
        theadRowCalcSize={theadRowCalcSize}
        renderTheadCell={renderTheadCell}
        // 表体设置
        renderTbodyCell={renderTbodyCell}
        rowCalcSize={rowCalcSize}
        columnCalcSize={columnCalcSize}
        // 性能优化
        overRowCount={50} // 增加预渲染行数
        overColumnCount={50} // 增加预渲染列数
        // 加载状态
        loading={loading}
        loadingComponent={LoadingComponent}
        emptyComponent={EmptyComponent}
      />
    </div>
  )
} 