# @grid-table/core

Virtual scrolling engine powered by CSS Grid.

## Install

```bash
npm install @grid-table/core
```

## Components

### VGridTable

2D virtual scrolling grid with row and column virtualization.

```tsx
import { VGridTable } from '@grid-table/core'

<VGridTable
  rowCount={1000}
  columnCount={50}
  rowCalcSize={(index) => 36}
  columnCalcSize={(index) => 120}
  theadRowCount={1}
  renderTheadCell={(rowIndex, colIndex) => <div>Header {colIndex}</div>}
  renderTbodyCell={(rowIndex, colIndex) => <div>Cell {rowIndex}-{colIndex}</div>}
  overRowCount={10}
  overColumnCount={5}
/>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| rowCount | `number` | Total row count |
| columnCount | `number` | Total column count |
| rowCalcSize | `(index: number) => number` | Row height calculator |
| columnCalcSize | `(index: number) => number` | Column width calculator |
| theadRowCount | `number` | Number of header rows |
| renderTheadCell | `(rowIndex, colIndex) => ReactNode` | Header cell renderer |
| renderTbodyCell | `(rowIndex, colIndex) => ReactNode` | Body cell renderer |
| overRowCount | `number` | Row overscan count (default: 10) |
| overColumnCount | `number` | Column overscan count (default: 5) |

### VGridList

1D virtual scrolling list.

```tsx
import { VGridList } from '@grid-table/core'

<VGridList
  baseSize={36}
  itemCount={10000}
  calcItemSize={(index) => 36}
  overscanCount={10}
>
  {ItemComponent}
</VGridList>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| baseSize | `number` | Base item height |
| itemCount | `number` | Total item count |
| calcItemSize | `(index: number) => number` | Item size calculator |
| overscanCount | `number` | Overscan count |
| stayIndexList | `number[]` | Always-visible item indices |

### useAutoSizer

Hook to detect container size changes.

```tsx
import { useAutoSizer } from '@grid-table/core'

const ref = useRef<HTMLDivElement>(null)
const { width, height } = useAutoSizer(ref)
```

## License

MIT
