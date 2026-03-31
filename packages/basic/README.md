# @grid-table/basic

Atom-based state management layer for grid-table, built on [@einfach/react](https://github.com/einfach-org/einfach).

## Install

```bash
npm install @grid-table/basic
```

## Usage

```tsx
import { createCore } from '@grid-table/basic'
import { createStore } from '@einfach/react'

const store = createStore()
const core = createCore(store)

// Access atom families for per-row/column/cell state
const { getColumnStateAtomById, getRowStateAtomById, getCellStateAtomById } = core
```

## API

### createCore(store?)

Creates the core state atoms for a table instance. Returns:

| Property | Description |
|----------|-------------|
| `getColumnStateAtomById` | Atom family for column state (style, className) |
| `getRowStateAtomById` | Atom family for row state |
| `getCellStateAtomById` | Atom family for cell state |
| `columnIndexListAtom` | Column ID list |
| `rowIndexListAtom` | Row ID list |
| `columnSizeMapAtom` | Column width map |
| `rowSizeMapAtom` | Row height map |

### State Atoms

| Atom | Type | Description |
|------|------|-------------|
| `columnIndexListAtom` | `Atom<ColumnId[]>` | Ordered column IDs |
| `rowIndexListAtom` | `Atom<RowId[]>` | Ordered row IDs |
| `headerRowIndexListAtom` | `Atom<RowId[]>` | Header row IDs |
| `columnSizeMapAtom` | `Atom<Map<ColumnId, number>>` | Column widths |
| `rowSizeMapAtom` | `Atom<Map<RowId, number>>` | Row heights |

### Utilities

| Function | Description |
|----------|-------------|
| `createAtomFamilyEntity()` | Factory for dynamic atom families keyed by ID |
| `getIdByObj(obj, key)` | Extract ID from data object |

## License

MIT
