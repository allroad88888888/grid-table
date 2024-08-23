import type { CSSProperties } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { atom, useAtomValue } from 'einfach-state'
import { useBasic } from '../../basic'
import { tableEventsAtom } from '../../hooks/useTableEvents'
import { cellDownAtom, cellUpAtom } from '../areaSelected'
import type { Area } from '../areaSelected/type'
import { getCellId } from '../../utils/getCellId'

interface Props {
  getDataByArea?: (area: Area) => string
}

function emptyFn() {
  // eslint-disable-next-line no-console
  console.warn('The table copy method does not pass parameters to the custom copy data method')
  return 'The table copy method does not pass parameters to the custom copy data method'
}

export const copyAreaAtom = atom<Area>({
  rowStartIndex: -1,
  rowEndIndex: -1,
  columnStartIndex: -1,
  columnEndIndex: -1,
})
/**
 * 这里逻辑 是弄个隐藏的text 制造能触发copy的事件
 * @returns
 */
export function useCopy({ getDataByArea = emptyFn }: Props = {}) {
  const { store, getCellStateAtomById } = useBasic()

  const down = useAtomValue(cellDownAtom, { store })
  const up = useAtomValue(cellUpAtom, { store })

  const onCopy = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const upInfo = store.getter(cellDownAtom)
      const downInfo = store.getter(cellDownAtom)
      if (upInfo.rowIndex === -1 || downInfo.rowIndex === -1) {
        return
      }
      const rowStartIndex = Math.min(up.rowIndex, down.rowIndex)
      const rowEndIndex = Math.max(up.rowIndex, down.rowIndex)
      const columnStartIndex = Math.min(up.columnIndex, down.columnIndex)
      const columnEndIndex = Math.max(up.columnIndex, down.columnIndex)
      const newArea = {
        rowStartIndex,
        rowEndIndex,
        columnStartIndex,
        columnEndIndex,
      }
      store.setter(copyAreaAtom, newArea)
      const text = getDataByArea(newArea)

      e.clipboardData.setData('text/plain', text)
      e.stopPropagation()
      e.preventDefault()
    },
    [down, up, getDataByArea, store],
  )

  useLayoutEffect(() => {
    return store.setter(tableEventsAtom, (_getter, prev) => {
      const next = { ...prev }
      if (!('onCopy' in prev)) {
        next['onCopy'] = new Set()
      }
      next['onCopy']!.add(onCopy)
      return next
    })
  }, [onCopy, store])

  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!ref.current || up.rowIndex === -1 || down.rowIndex === -1) {
      return
    }
    // 模拟选中 触发onCopy
    ref.current.select()
  }, [up, down])

  const area = useAtomValue(copyAreaAtom, { store })

  useLayoutEffect(() => {
    const { rowStartIndex, rowEndIndex, columnStartIndex, columnEndIndex } = area

    if (rowStartIndex === -1 || columnStartIndex === -1) {
      return
    }
    const cancelList: (() => void)[] = []
    for (let j = rowStartIndex; j <= rowEndIndex; j += 1) {
      for (let i = columnStartIndex; i <= columnEndIndex; i += 1) {
        const cellId = getCellId({
          rowIndex: j,
          columnIndex: i,
        })

        cancelList.push(
          store.setter(getCellStateAtomById(cellId), (_getter, prev) => {
            const nextStyle: CSSProperties = {
              ...prev.style,
              borderTop: 'none',
              borderBottom: 'none',
              borderLeft: 'none',
              borderRight: 'none',
            }
            const borderStyle = '2px dashed blue'
            if (j === rowStartIndex) {
              nextStyle.borderTop = borderStyle
            }
            if (j === rowEndIndex) {
              nextStyle.borderBottom = borderStyle
            }

            if (i === columnStartIndex) {
              nextStyle.borderLeft = borderStyle
            }
            if (i === columnEndIndex) {
              nextStyle.borderRight = borderStyle
            }

            return {
              ...prev,
              style: nextStyle,
            }
          })!,
        )
      }
    }

    return () => {
      cancelList.forEach((cancel) => {
        cancel()
      })
    }
  }, [area, store, getCellStateAtomById])

  if (down.columnIndex === -1 || up.columnIndex === -1) {
    return null
  }

  return (
    <textarea
      style={{
        width: 0,
        height: 0,
        zIndex: -1,
        position: 'absolute',
        right: -1,
        bottom: -1,
        resize: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
      }}
      ref={ref}
      readOnly
      value="copy error!!!"
    />
  )
}
