# @grid-table/pivot

Pivot table component with data aggregation and cross-tabulation, built on `@grid-table/view`.

## Install

```bash
npm install @grid-table/pivot @grid-table/view @einfach/react @einfach/utils
```

## Usage

```tsx
import { Pivot } from '@grid-table/pivot'

const dataConfig = {
  fields: {
    rows: ['region'],
    columns: ['category'],
    values: ['sales'],
  },
  data: [
    { region: 'East', category: 'A', sales: 100 },
    { region: 'East', category: 'B', sales: 200 },
    { region: 'West', category: 'A', sales: 150 },
    { region: 'West', category: 'B', sales: 300 },
  ],
}

function App() {
  return <Pivot dataConfig={dataConfig} style={{ width: '100%', height: 500 }} />
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| dataConfig | `DataConfig` | — | Pivot configuration (required) |
| rowHeight | `number` | `32` | Row height |
| overRowCount | `number` | `22` | Overscan row count |
| style | `CSSProperties` | — | Container styles |
| className | `string` | — | CSS class |
| theme | `object` | — | Theme configuration |

## DataConfig

```tsx
{
  fields: {
    rows: string[]          // Row dimension fields
    columns: string[]       // Column dimension fields
    values: string[]        // Aggregate value fields
    valueInCols?: boolean   // Place values in columns (default: true)
  },
  data: Record<string, any>[]  // Source data
  meta?: Meta[]                // Field metadata (formatters, renderers)
  sortParams?: SortParams
  filterParams?: FilterParam[]
  treeRow?: TreePropsItem      // Row tree expansion config
  treeColumn?: TreePropsItem   // Column tree expansion config
}
```

## License

MIT
