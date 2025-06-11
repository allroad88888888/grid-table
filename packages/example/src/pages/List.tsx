import type { ListItemProps } from '@grid-table/core'
import { VGridList } from '@grid-table/core'
import { useMethods } from '@einfach/react-utils'
import { rowIds } from '../mock/rowIds'

function Item({ index, style }: ListItemProps) {
  return <div style={style}>{index}</div>
}

function DemoList() {
  const { calcRowHeight } = useMethods({
    calcRowHeight(index: number) {
      return index % 2 ? 24 : 36
    },
    calcColumnWidth(index: number) {
      return index % 2 ? 100 : 150
    },
  })

  return (
    <VGridList
      baseSize={12}
      // baseSize={24}
      calcItemSize={calcRowHeight}
      itemCount={rowIds.length}
      style={{
        width: 300,
        height: 600,
        border: '1px solid red',
        overflow: 'auto',
      }}
    >
      {Item}
    </VGridList>
  )
}

export default DemoList
