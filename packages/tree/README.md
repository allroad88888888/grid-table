# @grid-tree/core

High-performance virtual scrolling tree component.

## Install

```bash
npm install @grid-tree/core @einfach/react @einfach/utils
```

## Usage

```tsx
import GridTree from '@grid-tree/core'

const relation = {
  ROOT: ['node-1', 'node-2'],
  'node-1': ['node-1-1', 'node-1-2'],
  'node-2': ['node-2-1'],
}

function App() {
  return (
    <GridTree
      relation={relation}
      root="ROOT"
      expendLevel={2}
      size={36}
      ContentComponent={({ id }) => <span>{id}</span>}
      style={{ height: 400 }}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| relation | `Record<string, string[]>` | — | Tree structure (parent → children) |
| root | `string` | `'ROOT'` | Root node ID |
| expendLevel | `number` | `2` | Default expand depth |
| minLengthExpandAll | `number` | `100` | Auto expand all if tree size < this |
| showRoot | `boolean` | `false` | Show root node |
| size | `number` | `36` | Item height (px) |
| levelSize | `number` | `24` | Indentation per level (px) |
| ContentComponent | `ComponentType` | — | Custom item renderer |
| stayIds | `string[]` | — | Always-visible node IDs |
| overscanCount | `number` | — | Overscan count |
| style | `CSSProperties` | — | Container styles |
| className | `string` | — | CSS class |
| tag | `'div' \| 'ul'` | — | Container element |
| itemTag | `'div' \| 'li'` | `'li'` | Item element |
| isTiling | `boolean` | `false` | Force flat layout |
| disabledIds | `string[]` | — | Disabled node IDs |

## Ref Methods

```tsx
const treeRef = useRef<GridTreeRef>(null)

treeRef.current.scrollTo('node-1')    // Scroll to node by ID
treeRef.current.scroll(0, 200)        // Scroll by pixels
```

## Hooks

| Hook | Description |
|------|-------------|
| `useIdByIndex(index)` | Get node ID by visible index |
| `useLevel(id)` | Get node depth level |
| `useIsCollapse(id)` | Check if node is collapsed |
| `useItem(id)` | Get node data |
| `useCollapseAll()` | Collapse all nodes |
| `useExpandAll()` | Expand all nodes |

## License

MIT
