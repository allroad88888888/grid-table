import type { ListItemProps } from '@grid-table/core/src'
import { VGridList } from '@grid-table/core/src'
import { useMethods } from 'einfach-utils'
import { rowIds } from '../mock/rowIds'
import { atom, loadable, useAtomValue, useSetAtom } from 'einfach-state'

function Item({ index, style }: ListItemProps) {
  return <div style={style}>{index}</div>
}

const atom1 = atom(1)
const atom2 = atom((getter, { signal }) => {
  getter(atom1)
  return new Promise((rev) => {
    const a = setTimeout(() => {
      rev(100)
    }, 3000)
    signal.addEventListener('abort', () => {
      clearTimeout(a)
    })
  }) as Promise<number>
})

function DemoList() {
  const { calcRowHeight } = useMethods({
    calcRowHeight(index: number) {
      return index % 2 ? 24 : 36
    },
    calcColumnWidth(index: number) {
      return index % 2 ? 100 : 150
    },
  })
  const setAtom1 = useSetAtom(atom1)
  const { data } = useAtomValue(loadable(atom2))

  return (
    <div onClick={() => {
      setAtom1(1000)
    }}
    >
      ------ :
      {data}

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
    </div>
  )
}

export default DemoList
