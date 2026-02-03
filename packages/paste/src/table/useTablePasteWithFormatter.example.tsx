import { useTablePasteWithFormatter } from './useTablePasteWithFormatter'

/**
 * 使用示例：带格式化的表格粘贴
 */
export function TablePasteFormatterExample() {
  // 使用 hook，返回完整的状态
  const {
    handlePaste,
    isLoading,
    progress,
    processed,
    total,
    estimatedTimeLeft,
    error,
    data,
  } = useTablePasteWithFormatter({
    columns: [
      // 列 0: 异步转大写（模拟 API 调用）
      {
        formatter: async (value) => {
          await new Promise((resolve) => setTimeout(resolve, 50))
          return value.toUpperCase()
        },
      },
      // 列 1: 数字格式化
      {
        formatter: (value) => {
          const num = parseFloat(value)
          return isNaN(num) ? value : num.toFixed(2)
        },
      },
      // 列 2: 日期格式化
      {
        formatter: (value) => {
          const date = new Date(value)
          return isNaN(date.getTime()) ? value : date.toLocaleDateString('zh-CN')
        },
      },
      // 列 3: 无格式化
      {},
    ],
    // 可选的完成回调
    onComplete: (formattedData) => {
      console.log('格式化完成:', formattedData)
    },
  })

  return (
    <div style={{ padding: 20 }}>
      <h2>表格粘贴格式化示例</h2>
      <div
        style={{
          border: '2px dashed #ccc',
          padding: 20,
          marginBottom: 20,
          minHeight: 100,
        }}
        onPaste={handlePaste as any}
      >
        <p>在此区域粘贴表格数据</p>
        <small>
          列格式：[文本-转大写] [数字-2位小数] [日期-本地化] [无格式化]
        </small>
      </div>

      {/* 加载状态和进度 */}
      {isLoading && (
        <div style={{ marginBottom: 20 }}>
          <div>
            <strong>处理中...</strong>
          </div>
          <div>进度: {progress}%</div>
          <div>
            已处理: {processed} / {total} 个单元格
          </div>
          <div>预计剩余时间: {(estimatedTimeLeft / 1000).toFixed(1)}秒</div>
          <div
            style={{
              width: '100%',
              height: 20,
              background: '#f0f0f0',
              borderRadius: 4,
              overflow: 'hidden',
              marginTop: 10,
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#4CAF50',
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>
      )}

      {/* 错误显示 */}
      {error && (
        <div
          style={{
            color: 'red',
            padding: 10,
            background: '#ffebee',
            borderRadius: 4,
            marginBottom: 20,
          }}
        >
          <strong>错误:</strong> {error.message}
        </div>
      )}

      {/* 数据展示 */}
      {data && data.length > 0 && (
        <div>
          <h3>格式化后的数据：</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>文本</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>数字</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>日期</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>备注</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
