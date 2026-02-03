# useTablePasteWithFormatter

带格式化功能的表格粘贴 hook，支持按列配置格式化方法（可异步），并提供实时进度反馈。

## 功能特性

- ✅ 按列配置格式化方法
- ✅ 支持同步和异步格式化函数
- ✅ 实时进度状态（百分比、已处理数量、预计剩余时间）
- ✅ 加载状态 (isLoading)
- ✅ 错误状态
- ✅ 格式化后的数据
- ✅ 可选格式化（列没有配置格式化方法则保持原值）

## 基础用法

```typescript
import { useTablePasteWithFormatter } from '@grid-table/paste'

function MyComponent() {
  const { handlePaste, isLoading, progress, error, data } = useTablePasteWithFormatter({
    columns: [
      { formatter: (value) => value.toUpperCase() }, // 第 0 列转大写
      { formatter: (value) => parseFloat(value).toFixed(2) }, // 第 1 列格式化数字
      {}, // 第 2 列不格式化
    ],
  })

  return (
    <div>
      <div onPaste={handlePaste}>粘贴区域</div>
      {isLoading && <div>处理中... {progress}%</div>}
      {error && <div>错误: {error.message}</div>}
      {data && <div>已导入 {data.length} 行数据</div>}
    </div>
  )
}
```

## 异步格式化

格式化函数支持返回 Promise，适合需要调用 API 的场景：

```typescript
const { handlePaste, isLoading, progress, data } = useTablePasteWithFormatter({
  columns: [
    {
      // 异步验证并格式化邮箱
      formatter: async (email) => {
        const isValid = await validateEmail(email)
        return isValid ? email : `❌ ${email}`
      },
    },
    {
      // 异步查询用户名
      formatter: async (userId) => {
        const user = await fetchUser(userId)
        return user?.name || userId
      },
    },
  ],
})

// 使用返回的状态
if (isLoading) {
  console.log(`处理中: ${progress}%`)
}
if (data) {
  console.log('所有异步格式化完成:', data)
}
```

## 进度监控

通过返回的状态值实时获取进度信息：

```typescript
const { 
  handlePaste, 
  isLoading, 
  progress, 
  processed, 
  total, 
  estimatedTimeLeft 
} = useTablePasteWithFormatter({
  columns: [/* ... */],
})

// 显示进度条
return (
  <div onPaste={handlePaste}>
    {isLoading && (
      <div>
        <div>进度: {progress}%</div>
        <div>已处理: {processed}/{total}</div>
        <div>预计剩余: {(estimatedTimeLeft / 1000).toFixed(1)}秒</div>
        <progress value={progress} max={100} />
      </div>
    )}
  </div>
)
```

## 错误处理

通过返回的 `error` 状态处理错误：

```typescript
const { handlePaste, error, isLoading } = useTablePasteWithFormatter({
  columns: [
    {
      formatter: async (value) => {
        if (!value) throw new Error('值不能为空')
        return await processValue(value)
      },
    },
  ],
})

// 显示错误
return (
  <div>
    <div onPaste={handlePaste}>粘贴区域</div>
    {error && (
      <div style={{ color: 'red' }}>
        错误: {error.message}
      </div>
    )}
  </div>
)
```

## 访问行列信息

格式化函数可以接收行索引和列索引：

```typescript
const { handlePaste } = useTablePasteWithFormatter({
  columns: [
    {
      formatter: (value, rowIndex, colIndex) => {
        return `R${rowIndex}-C${colIndex}: ${value}`
      },
    },
  ],
})
```

## 完整示例

```typescript
import { useTablePasteWithFormatter } from '@grid-table/paste'

function TableImporter() {
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
      // 列 0: 姓名 - 去除空格并首字母大写
      {
        formatter: (name) => {
          const trimmed = name.trim()
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
        },
      },
      // 列 1: 邮箱 - 异步验证
      {
        formatter: async (email) => {
          await new Promise((r) => setTimeout(r, 100)) // 模拟 API
          const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          return isValid ? email.toLowerCase() : ''
        },
      },
      // 列 2: 金额 - 格式化为货币
      {
        formatter: (amount) => {
          const num = parseFloat(amount)
          return isNaN(num) ? '¥0.00' : `¥${num.toFixed(2)}`
        },
      },
      // 列 3: 备注 - 不处理
      {},
    ],
  })

  return (
    <div>
      <div
        onPaste={handlePaste as any}
        style={{
          border: '2px dashed #ccc',
          padding: 20,
          minHeight: 100,
        }}
      >
        粘贴表格数据到此处
      </div>

      {isLoading && (
        <div style={{ marginTop: 20 }}>
          <progress value={progress} max={100} />
          <div>
            处理进度: {processed}/{total} 单元格
          </div>
          <div>预计剩余: {(estimatedTimeLeft / 1000).toFixed(1)} 秒</div>
        </div>
      )}

      {error && <div style={{ color: 'red' }}>错误: {error.message}</div>}

      {data && data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>邮箱</th>
              <th>金额</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
```

## API 参考

### useTablePasteWithFormatter(options)

#### 参数 (options)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| columns | `ColumnFormatter[]` | 是 | 列配置数组，索引对应列索引 |
| onComplete | `(data: string[][]) => void` | 否 | 完成回调（可选） |

#### 返回值 (UseTablePasteWithFormatterResult)

| 属性 | 类型 | 说明 |
|------|------|------|
| handlePaste | `(e: ClipboardEvent) => void` | 粘贴处理函数 |
| isLoading | `boolean` | 是否正在处理中 |
| progress | `number` | 当前进度百分比 0-100 |
| processed | `number` | 已处理的单元格数量 |
| total | `number` | 总单元格数量 |
| estimatedTimeLeft | `number` | 预计剩余时间（毫秒） |
| error | `Error \| null` | 错误信息 |
| data | `string[][] \| null` | 格式化后的数据 |

#### ColumnFormatter

```typescript
type ColumnFormatter = {
  formatter?: (
    value: string,
    rowIndex: number,
    colIndex: number
  ) => string | Promise<string>
}
```

#### 类型定义

```typescript
type UseTablePasteWithFormatterResult = {
  handlePaste: (e: ClipboardEvent) => void
  isLoading: boolean
  progress: number
  processed: number
  total: number
  estimatedTimeLeft: number
  error: Error | null
  data: string[][] | null
}
```

## 性能优化建议

1. **批量更新进度**: 进度回调默认每处理 10 个单元格触发一次，避免过于频繁的更新
2. **异步并发控制**: 当前实现是逐单元格处理，如需并发可以考虑使用 `Promise.all` 分批处理
3. **大数据量**: 对于超大表格（>10000 单元格），建议：
   - 显示加载指示器
   - 使用 Web Worker 处理（需要额外封装）
   - 分批导入数据

## 注意事项

- 格式化函数抛出的错误会被 `onError` 捕获，不会中断整个处理流程
- 预计剩余时间是基于已处理单元格的平均耗时估算的
- 如果某列没有配置格式化方法，该列的值将保持原样
- 格式化是按行逐个处理的，确保了顺序一致性
