# @grid-table/view

Full-featured virtual scrolling table component for React with a plugin architecture.

This is the main user-facing package — it re-exports everything from `@grid-table/core` and `@grid-table/basic`.

## Install

```bash
npm install @grid-table/view @einfach/react @einfach/utils @einfach/react-utils
```

## Quick Start

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

## Table Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| dataSource | `any[]` | — | Data array |
| columns | `ColumnType[]` | — | Column definitions |
| idProp | `string` | — | Row ID field name |
| store | `Store` | — | @einfach/react store |
| rowHeight | `number` | `36` | Row height (px) |
| cellDefaultWidth | `number` | `80` | Default column width |
| enableSelectArea | `boolean` | `false` | Enable area selection |
| enableColumnResize | `boolean` | `true` | Enable column resize |
| enableRowNumber | `boolean` | `false` | Show row number column |
| onColumnResize | `(id, width) => void` | — | Column resize callback |
| rowSelection | `object` | — | Row checkbox selection config |
| loading | `boolean` | `false` | Show loading state |
| zebra | `boolean` | `false` | Alternating row colors |
| showHorizontalBorder | `boolean` | — | Show horizontal borders |
| showVerticalBorder | `boolean` | — | Show vertical borders |

## ColumnType

| Prop | Type | Description |
|------|------|-------------|
| title | `ReactNode` | Column header |
| dataIndex | `string \| string[]` | Data field path |
| width | `number` | Column width |
| key | `string` | Unique column key |
| render | `(text, rowInfo, param) => ReactNode` | Custom cell renderer |
| renderComponent | `ComponentType` | Cell renderer component |
| fixed | `'left' \| 'right'` | Sticky column position |
| align | `'left' \| 'center' \| 'right'` | Text alignment |
| flexGrow | `number` | Flex grow ratio |
| className | `string` | Custom CSS class |

## Plugins

Built-in plugins activated via props or provided as components:

| Plugin | Description |
|--------|-------------|
| sticky | Fixed columns and headers |
| drag | Column resize by dragging |
| areaSelected | Region/area cell selection |
| copy | Copy selected cells to clipboard |
| select | Row/cell selection |
| filter | Column data filtering |
| mergeCells | Cell merging |
| calcSizeByColumn | Auto column width calculation |
| border | Cell border styling |
| rowNumber | Row number column |
| theadColumnHide | Toggle column visibility |
| theadContextMenu | Header right-click context menu |

## License

MIT
