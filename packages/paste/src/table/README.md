# Table Paste Hooks

表格粘贴相关的 React Hooks 集合。

## 文件结构

```
table/
├── formatOutput.ts                        # 格式化输出工具函数
├── useTablePaste.ts                       # 基础表格粘贴 hook
├── useTablePasteWithFormatter.ts          # 带格式化功能的高级 hook
├── useTablePasteWithFormatter.example.tsx # 使用示例
└── useTablePasteWithFormatter.md          # 详细文档
```

## Hooks

### 1. useTablePaste

基础 hook，处理粘贴事件并解析表格数据。

```typescript
const handlePaste = useTablePaste((result) => {
  console.log(result.tsv)    // TSV 格式
  console.log(result.data)   // 二维数组
  console.log(result.rawText) // 原始文本
  console.log(result.rawHtml) // 原始 HTML
})
```

### 2. useTablePasteTsv

简化版，直接返回 TSV 字符串。

```typescript
const handlePaste = useTablePasteTsv((tsv) => {
  console.log(tsv)
})
```

### 3. useTablePasteData

简化版，直接返回二维数组。

```typescript
const handlePaste = useTablePasteData((data) => {
  console.log(data) // string[][]
})
```

### 4. useTablePasteWithFormatter ⭐

**高级 hook**，支持按列配置格式化方法（可异步），并返回完整的状态信息。

```typescript
const { 
  handlePaste, 
  isLoading, 
  progress, 
  error, 
  data 
} = useTablePasteWithFormatter({
  columns: [
    { formatter: (v) => v.toUpperCase() },        // 同步格式化
    { formatter: async (v) => await api(v) },     // 异步格式化
    {},                                            // 不格式化
  ],
})

// 使用状态
if (isLoading) {
  console.log(`处理中: ${progress}%`)
}
if (error) {
  console.error('错误:', error.message)
}
if (data) {
  console.log('格式化完成:', data)
}
```

**特性：**
- ✅ 按列配置格式化方法
- ✅ 支持同步和异步格式化
- ✅ 返回完整状态（isLoading、progress、error、data）
- ✅ 预计剩余时间
- ✅ 自动错误处理

## 使用场景

| Hook | 使用场景 |
|------|---------|
| `useTablePaste` | 需要原始数据和多种格式 |
| `useTablePasteTsv` | 只需要 TSV 格式 |
| `useTablePasteData` | 只需要二维数组 |
| `useTablePasteWithFormatter` | 需要对数据进行验证、转换或格式化 |

## 详细文档

查看 [useTablePasteWithFormatter.md](./useTablePasteWithFormatter.md) 了解高级 hook 的完整使用指南。

查看 [useTablePasteWithFormatter.example.tsx](./useTablePasteWithFormatter.example.tsx) 查看实际使用示例。
