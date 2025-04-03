/** @jsxImportSource solid-js */
import { createSignal, createMemo, For } from 'solid-js'
import { VGridTable } from '../Grid/VGridTable'
import type { RenderCellsProps } from '../Grid/type'

export function VGridTableMillionDemo() {
  // 定义行列数量 - 1000x1000 = 1,000,000 cells
  const [rowCount, setRowCount] = createSignal(1000)
  const [colCount, setColCount] = createSignal(1000)
  
  // 创建单元格数据缓存
  const cellData = createMemo(() => {
    // 仅生成索引，实际数据按需计算，避免内存占用
    console.time('生成单元格索引')
    const result = {
      rows: Array.from({ length: rowCount() }, (_, i) => i),
      cols: Array.from({ length: colCount() }, (_, i) => i)
    }
    console.timeEnd('生成单元格索引')
    return result
  })
  
  // 单元格内容生成函数 - 使用行列索引组合生成唯一内容
  const getCellContent = (rowIndex: number, colIndex: number) => {
    return `r${rowIndex}c${colIndex}`
  }
  
  // 行高计算
  const calcRowSize = (index: number) => {
    // 使用固定高度以提高性能
    return 32
  }
  
  // 列宽计算
  const calcColumnSize = (index: number) => {
    // 使用固定宽度以提高性能
    return 100
  }
  
  // 表头行高计算
  const calcTheadRowSize = (index: number) => {
    return 32
  }
  
  // 渲染表头单元格
  const renderTheadCell = (props: RenderCellsProps) => {
    const { rowIndexList, columnIndexList, getCellStyleByIndex } = props
    
    return (
      <For each={columnIndexList}>
        {(colIndex) => (
          <div 
            class="thead-cell"
            style={getCellStyleByIndex(0, colIndex)}
          >
            列 {colIndex}
          </div>
        )}
      </For>
    )
  }
  
  // 渲染表体单元格
  const renderTbodyCell = (props: RenderCellsProps) => {
    const { rowIndexList, columnIndexList, getCellStyleByIndex } = props
    
    return (
      <>
        <For each={rowIndexList}>
          {(rowIndex) => (
            <For each={columnIndexList}>
              {(colIndex) => (
                <div 
                  class="tbody-cell"
                  style={getCellStyleByIndex(rowIndex, colIndex)}
                >
                  {getCellContent(rowIndex, colIndex)}
                </div>
              )}
            </For>
          )}
        </For>
      </>
    )
  }
  
  // 加载状态控制
  const [loading, setLoading] = createSignal(false)
  
  return (
    <div style={{ 
      "max-width": "100%", 
      height: "600px", 
      overflow: "hidden",
      display: "flex",
      "flex-direction": "column"
    }}>
      <div style={{ padding: "10px" }}>
        <h2>SolidJS VGridTable 百万单元格示例</h2>
        <div>
          <button 
            onClick={() => setLoading(prev => !prev)}
            style={{ margin: "5px" }}
          >
            {loading() ? "停止加载" : "显示加载中"}
          </button>
          <button 
            onClick={() => {
              console.time('重新渲染')
              setRowCount(1000)
              setColCount(1000)
              setTimeout(() => {
                console.timeEnd('重新渲染')
              }, 0)
            }}
            style={{ margin: "5px" }}
          >
            百万单元格 (1000x1000)
          </button>
          <button 
            onClick={() => {
              setRowCount(100)
              setColCount(100)
            }}
            style={{ margin: "5px" }}
          >
            减少到10,000单元格 (100x100)
          </button>
        </div>
      </div>
      
      <div style={{ flex: 1, border: "1px solid #ccc" }}>
        <VGridTable
          rowCount={rowCount()}
          columnCount={colCount()}
          rowCalcSize={calcRowSize}
          columnCalcSize={calcColumnSize}
          renderTbodyCell={renderTbodyCell}
          renderTheadCell={renderTheadCell}
          theadRowCalcSize={calcTheadRowSize}
          loading={loading()}
          emptyComponent={() => <div style={{ padding: "20px" }}>没有数据</div>}
          loadingComponent={() => (
            <div style={{ 
              position: "absolute", 
              top: "50%", 
              left: "50%", 
              transform: "translate(-50%, -50%)",
              background: "rgba(255,255,255,0.8)",
              padding: "20px",
              "border-radius": "5px",
              "box-shadow": "0 0 10px rgba(0,0,0,0.1)"
            }}>
              加载中...
            </div>
          )}
          style={{
            height: "500px",width: "1000px",overflow:'auto',
            position: "relative"
          }}
        />
      </div>
      
      <style>{`
        .thead-cell {
          background: #f5f5f5;
          border-right: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
          font-weight: bold;
          padding: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
        }
        
        .tbody-cell {
          border-right: 1px solid #e8e8e8;
          border-bottom: 1px solid #e8e8e8;
          padding: 8px;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .tbody-cell:hover {
          background: #f0f7ff;
        }
      `}</style>
    </div>
  )
} 