/** @jsxImportSource solid-js */
import { createSignal, createMemo } from 'solid-js'
import { VGridList } from '../Grid/VGridList'

export function VGridListDemo() {
  // 定义行数量 - 默认1000行
  const [itemCount, setItemCount] = createSignal(1000)
  
  // 行高计算函数
  const calcItemSize = (index: number) => {
    // 使用固定高度以提高性能
    return 36
  }
  
  // 行内容渲染组件
  const RowItem = (props: { index: number; style: any; isPending?: boolean }) => {
    return (
      <div 
        style={{
          ...props.style,
          padding: '10px',
          backgroundColor: props.index % 2 === 0 ? '#f9f9f9' : '#fff',
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          transition: 'background-color 0.2s',
          ...(props.isPending ? { opacity: 0.6 } : {})
        }}
        onMouseEnter={(e) => { 
          e.currentTarget.style.backgroundColor = '#f0f7ff' 
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.backgroundColor = props.index % 2 === 0 ? '#f9f9f9' : '#fff'
        }}
      >
        <div style={{ 'margin-right': '10px', 'font-weight': 'bold', width: '50px' }}>
          #{props.index}
        </div>
        <div style={{ flex: 1 }}>
          这是第 {props.index + 1} 行数据 - {generateRandomContent(props.index)}
        </div>
      </div>
    )
  }
  
  // 随机内容生成函数
  const generateRandomContent = (index: number) => {
    const phrases = [
      "SolidJS虚拟滚动演示",
      "高性能列表渲染",
      "基于网格布局",
      "支持大数据量",
      "行高动态计算",
      "内存占用优化",
      "流畅的滚动体验"
    ]
    return phrases[index % phrases.length]
  }
  
  return (
    <div style={{ 
      "max-width": "800px", 
      height: "600px", 
      overflow: "hidden",
      display: "flex",
      "flex-direction": "column",
      margin: "0 auto",
      border: "1px solid #ddd",
      "border-radius": "8px",
      "box-shadow": "0 2px 10px rgba(0,0,0,0.05)"
    }}>
      <div style={{ padding: "16px", "border-bottom": "1px solid #eee" }}>
        <h2 style={{ margin: "0 0 16px 0" }}>SolidJS VGridList 1000行演示</h2>
        <div style={{ display: "flex", "gap": "8px" }}>
          <button 
            onClick={() => setItemCount(1000)}
            style={{ 
              padding: "8px 16px", 
              background: itemCount() === 1000 ? "#1976d2" : "#e0e0e0",
              color: itemCount() === 1000 ? "white" : "black",
              border: "none",
              "border-radius": "4px",
              cursor: "pointer"
            }}
          >
            1000行
          </button>
          <button 
            onClick={() => setItemCount(100)}
            style={{ 
              padding: "8px 16px", 
              background: itemCount() === 100 ? "#1976d2" : "#e0e0e0",
              color: itemCount() === 100 ? "white" : "black",
              border: "none",
              "border-radius": "4px",
              cursor: "pointer"
            }}
          >
            100行
          </button>
          <button 
            onClick={() => setItemCount(10000)}
            style={{ 
              padding: "8px 16px", 
              background: itemCount() === 10000 ? "#1976d2" : "#e0e0e0",
              color: itemCount() === 10000 ? "white" : "black",
              border: "none",
              "border-radius": "4px",
              cursor: "pointer"
            }}
          >
            10000行
          </button>
        </div>
        <div style={{ "margin-top": "8px", color: "#666", "font-size": "14px" }}>
          当前显示: {itemCount()} 行数据
        </div>
      </div>
      
      <div style={{ flex: 1, position: "relative",border: "1px solid #ccc",height: "500px",width: "300px",overflow:'auto' }}>
        <VGridList
          baseSize={36}
          itemCount={itemCount()}
          calcItemSize={calcItemSize}
          children={RowItem}
          overscanCount={5}
          style={{
            height: "100%",
            width: "100%"
          }}
        />
      </div>
    </div>
  )
} 