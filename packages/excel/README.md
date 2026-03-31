# @grid-table/excel

Excel-like spreadsheet component built on `@grid-table/view`.

## Install

```bash
npm install @grid-table/excel @grid-table/view @einfach/react @einfach/utils
```

## Usage

```tsx
import { Excel } from '@grid-table/excel'

function App() {
  return <Excel style={{ width: '100%', height: 600 }} />
}
```

The `Excel` component provides a pre-configured spreadsheet with:

- Editable cells
- Auto-generated rows (1000) and columns (300)
- Built-in cell editing support

## Props

| Prop | Type | Description |
|------|------|-------------|
| className | `string` | Custom CSS class |
| style | `CSSProperties` | Container styles |

## License

MIT
