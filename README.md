# grid-table

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![npm](https://img.shields.io/npm/v/@grid-table/view)](https://www.npmjs.com/package/@grid-table/view)

[English](#english) | [中文](#中文)

---

## English

High-performance virtual scrolling table for React, powered by CSS Grid.

### Features

- **CSS Grid Layout** — Row and column virtualization with CSS Grid positioning
- **Plugin Architecture** — Sticky columns, drag reorder, area selection, copy, filter, merge cells, row numbers, column hide, context menu, borders, column auto-size
- **Tree Table** — Expandable tree data with virtual scrolling
- **Excel-like Editing** — Cell editing with formula support
- **Pivot Table** — Data aggregation and cross-tabulation
- **Clipboard** — Paste from Excel with TSV/CSV/HTML/JSON parsing
- **Atom State Management** — Built on [@einfach/react](https://github.com/einfach-org/einfach) (Jotai-like)
- **TypeScript** — Full type definitions included

### Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@grid-table/core](./packages/core) | [![npm](https://img.shields.io/npm/v/@grid-table/core)](https://www.npmjs.com/package/@grid-table/core) | Virtual scrolling engine (VGridTable, VGridList) |
| [@grid-table/basic](./packages/basic) | [![npm](https://img.shields.io/npm/v/@grid-table/basic)](https://www.npmjs.com/package/@grid-table/basic) | Atom-based state management and core utilities |
| [@grid-table/view](./packages/table) | [![npm](https://img.shields.io/npm/v/@grid-table/view)](https://www.npmjs.com/package/@grid-table/view) | Full-featured table component with plugins |
| [@grid-table/excel](./packages/excel) | [![npm](https://img.shields.io/npm/v/@grid-table/excel)](https://www.npmjs.com/package/@grid-table/excel) | Excel-like cell editing |
| [@grid-table/pivot](./packages/pivot) | [![npm](https://img.shields.io/npm/v/@grid-table/pivot)](https://www.npmjs.com/package/@grid-table/pivot) | Pivot table with data transformation |
| [@grid-table/paste](./packages/paste) | [![npm](https://img.shields.io/npm/v/@grid-table/paste)](https://www.npmjs.com/package/@grid-table/paste) | Clipboard paste data processing |
| [@grid-tree/core](./packages/tree) | [![npm](https://img.shields.io/npm/v/@grid-tree/core)](https://www.npmjs.com/package/@grid-tree/core) | Tree data structure and components |
| [@grid-tree/select](./packages/tree-select) | [![npm](https://img.shields.io/npm/v/@grid-tree/select)](https://www.npmjs.com/package/@grid-tree/select) | Tree select / dropdown component |

### Quick Start

```bash
npm install @grid-table/view @einfach/react @einfach/utils @einfach/react-utils
```

```tsx
import { Table } from '@grid-table/view'
import { useStore } from '@einfach/react'
import type { ColumnType } from '@grid-table/view'

const columns: ColumnType[] = [
  { title: 'Name', dataIndex: 'name', width: 150, key: 'name' },
  { title: 'Age', dataIndex: 'age', width: 100, key: 'age' },
  { title: 'Email', dataIndex: 'email', width: 250, key: 'email' },
]

const data = [
  { id: 1, name: 'John', age: 28, email: 'john@example.com' },
  { id: 2, name: 'Jane', age: 32, email: 'jane@example.com' },
  { id: 3, name: 'Bob', age: 25, email: 'bob@example.com' },
]

function App() {
  const store = useStore()
  return (
    <Table
      store={store}
      columns={columns}
      dataSource={data}
      idProp="id"
      rowHeight={36}
      style={{ width: '100%', height: 500 }}
    />
  )
}
```

### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

### License

[MIT](./LICENSE)

---

## 中文

基于 CSS Grid 的高性能 React 虚拟滚动表格。

### 特性

- **CSS Grid 布局** — 行列虚拟化，基于 CSS Grid 定位
- **插件架构** — 固定列、拖拽排序、区域选择、复制、过滤、合并单元格、行号、列隐藏、右键菜单、边框、列宽自适应
- **树形表格** — 可展开的树形数据，支持虚拟滚动
- **Excel 编辑** — 单元格编辑，支持公式
- **透视表** — 数据聚合与交叉分析
- **剪贴板** — 从 Excel 粘贴，支持 TSV/CSV/HTML/JSON 解析
- **Atom 状态管理** — 基于 [@einfach/react](https://github.com/einfach-org/einfach)（类似 Jotai）
- **TypeScript** — 完整的类型定义

### 包列表

| 包名 | 版本 | 说明 |
|------|------|------|
| [@grid-table/core](./packages/core) | [![npm](https://img.shields.io/npm/v/@grid-table/core)](https://www.npmjs.com/package/@grid-table/core) | 虚拟滚动引擎（VGridTable、VGridList） |
| [@grid-table/basic](./packages/basic) | [![npm](https://img.shields.io/npm/v/@grid-table/basic)](https://www.npmjs.com/package/@grid-table/basic) | 基于 Atom 的状态管理和核心工具 |
| [@grid-table/view](./packages/table) | [![npm](https://img.shields.io/npm/v/@grid-table/view)](https://www.npmjs.com/package/@grid-table/view) | 完整功能的表格组件（含插件） |
| [@grid-table/excel](./packages/excel) | [![npm](https://img.shields.io/npm/v/@grid-table/excel)](https://www.npmjs.com/package/@grid-table/excel) | Excel 风格单元格编辑 |
| [@grid-table/pivot](./packages/pivot) | [![npm](https://img.shields.io/npm/v/@grid-table/pivot)](https://www.npmjs.com/package/@grid-table/pivot) | 透视表与数据转换 |
| [@grid-table/paste](./packages/paste) | [![npm](https://img.shields.io/npm/v/@grid-table/paste)](https://www.npmjs.com/package/@grid-table/paste) | 剪贴板粘贴数据处理 |
| [@grid-tree/core](./packages/tree) | [![npm](https://img.shields.io/npm/v/@grid-tree/core)](https://www.npmjs.com/package/@grid-tree/core) | 树形数据结构与组件 |
| [@grid-tree/select](./packages/tree-select) | [![npm](https://img.shields.io/npm/v/@grid-tree/select)](https://www.npmjs.com/package/@grid-tree/select) | 树形选择器/下拉组件 |

### 快速开始

```bash
npm install @grid-table/view @einfach/react @einfach/utils @einfach/react-utils
```

```tsx
import { Table } from '@grid-table/view'
import { useStore } from '@einfach/react'
import type { ColumnType } from '@grid-table/view'

const columns: ColumnType[] = [
  { title: '姓名', dataIndex: 'name', width: 150, key: 'name' },
  { title: '年龄', dataIndex: 'age', width: 100, key: 'age' },
  { title: '邮箱', dataIndex: 'email', width: 250, key: 'email' },
]

const data = [
  { id: 1, name: '张三', age: 28, email: 'zhang@example.com' },
  { id: 2, name: '李四', age: 32, email: 'li@example.com' },
  { id: 3, name: '王五', age: 25, email: 'wang@example.com' },
]

function App() {
  const store = useStore()
  return (
    <Table
      store={store}
      columns={columns}
      dataSource={data}
      idProp="id"
      rowHeight={36}
      style={{ width: '100%', height: 500 }}
    />
  )
}
```

### 贡献

参见 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解开发环境搭建和贡献指南。

### 许可证

[MIT](./LICENSE)
