# @grid-table/paste

剪贴板粘贴数据处理工具库，支持从 Excel 等应用复制数据的解析。

## 安装

```bash
pnpm add @grid-table/paste
```

## 目录结构

```
src/
├── demo/          # Demo 展示相关
│   └── usePasteHandler.ts   # 通用粘贴处理，展示所有数据类型
├── table/         # 表格数据处理
│   ├── formatOutput.ts      # TSV 格式转换
│   └── useTablePaste.ts     # 表格粘贴 hook
└── utils/         # 基础工具函数
    ├── extractTextData.ts   # 文本提取
    ├── extractImages.ts     # 图片提取
    ├── extractClipboardData.ts  # 剪贴板数据提取
    ├── detectFormat.ts      # 格式检测
    ├── extractFiles.ts      # 文件提取
    └── processHtml.ts       # HTML 处理
```

## 使用方法

### 1. 表格数据处理（推荐）

适用于需要从 Excel 复制数据并转为标准格式的场景。

```tsx
import { useTablePaste, useTablePasteTsv } from '@grid-table/paste'

function MyComponent() {
  // 方式1：获取完整结果
  const handlePaste = useTablePaste((result) => {
    console.log(result.tsv)   // "line_0014\t桌面收纳盒\t1\nline_0019\t护手霜\t1"
    console.log(result.data)  // [["line_0014", "桌面收纳盒", "1"], ...]
  })

  // 方式2：只获取 TSV 字符串
  const handlePasteTsv = useTablePasteTsv((tsv) => {
    console.log(tsv)  // "line_0014\t桌面收纳盒\t1\n..."
  })

  return <div onPaste={handlePaste}>粘贴区域</div>
}
```

### 2. Demo 展示（开发调试）

展示所有粘贴数据类型的详细信息，适用于开发调试。

```tsx
import { usePasteHandler, type PasteResult } from '@grid-table/paste'
import { useState } from 'react'

function PasteDemo() {
  const [result, setResult] = useState<PasteResult>({ items: [], images: [] })
  const [types, setTypes] = useState<string[]>([])

  const handlePaste = usePasteHandler(setResult, setTypes)

  return (
    <div onPaste={handlePaste}>
      粘贴内容到这里查看解析结果
    </div>
  )
}
```

### 3. 工具函数（直接使用）

```tsx
import {
  formatToTsv,
  htmlTableToTsv,
  extractAndConvertToTsv,
} from '@grid-table/paste'

// 将二维数组转为 TSV
const tsv = formatToTsv([
  ['line_0014', '桌面收纳盒', '1'],
  ['line_0019', '护手霜', '1'],
])
// 输出: "line_0014\t桌面收纳盒\t1\nline_0019\t护手霜\t1"

// 从 HTML 表格转为 TSV
const tsv2 = htmlTableToTsv('<table><tr><td>A</td><td>B</td></tr></table>')
// 输出: "A\tB"

// 直接从剪贴板事件提取
element.addEventListener('paste', (e) => {
  const tsv = extractAndConvertToTsv(e.clipboardData)
})
```

## API

### Table 模块

| 函数 | 说明 |
|------|------|
| `useTablePaste(onPaste)` | 表格粘贴 hook，返回完整结果 |
| `useTablePasteTsv(onPaste)` | 简化版，直接返回 TSV 字符串 |
| `useTablePasteData(onPaste)` | 简化版，直接返回二维数组 |
| `formatToTsv(data)` | 二维数组转 TSV |
| `htmlTableToTsv(html)` | HTML 表格转 TSV |
| `csvToTsv(csv)` | CSV 转 TSV |
| `convertToTsv(content)` | 智能转换（自动检测格式） |
| `extractAndConvertToTsv(clipboardData)` | 从剪贴板提取并转 TSV |

### Demo 模块

| 函数 | 说明 |
|------|------|
| `usePasteHandler(setResult, setTypes)` | 通用粘贴处理，解析所有数据类型 |

### 支持的数据类型

| 类型 | 说明 |
|------|------|
| `text` | 纯文本 |
| `html` | HTML（支持表格解析、图片替换） |
| `image` | 图片（自动转 base64） |
| `rtf` | RTF 富文本格式 |
| `csv` | CSV 数据 |
| `json` | JSON 数据 |
| `url` | URL 链接 |
| `file` | 其他文件 |
