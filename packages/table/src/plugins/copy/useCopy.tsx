import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { atom, useAtomValue, useStore } from 'einfach-state'
import { tableEventsAtom } from '../../hooks/useTableEvents'
import { cellDownAtom, cellUpAtom } from '../areaSelected'
import type { Area } from '../areaSelected/type'
import { getCellId } from '../../utils/getCellId'
import { useBasic } from '@grid-table/basic'

interface Props {
  getDataByArea?: (area: Area) => string
  /**
   * 是否开启复制功能
   * @default false
   */
  enable?: boolean
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
export function useCopy({ getDataByArea = emptyFn, enable = false }: Props = {}) {
  const store = useStore()
  const { getCellStateAtomById, rowIdShowListAtom, columnIdShowListAtom } = useBasic()

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

  useEffect(() => {
    if (enable === false) {
      return
    }
    return store.setter(tableEventsAtom, (_getter, prev) => {
      const next = { ...prev }
      if (!('onCopy' in prev)) {
        next['onCopy'] = new Set()
      }
      next['onCopy']!.add(onCopy)
      return next
    })
  }, [enable, onCopy, store])

  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!ref.current || up.rowIndex === -1 || down.rowIndex === -1) {
      return
    }
    // 模拟选中 触发onCopy
    ref.current.select()
  }, [up, down])

  const area = useAtomValue(copyAreaAtom, { store })

  useEffect(() => {
    if (enable === false) {
      return
    }
    const { rowStartIndex, rowEndIndex, columnStartIndex, columnEndIndex } = area

    if (rowStartIndex === -1 || columnStartIndex === -1) {
      return
    }
    const cancelList: (() => void)[] = []

    const rowIndexList = store.getter(rowIdShowListAtom)
    const columnIndexList = store.getter(columnIdShowListAtom)
    for (let j = rowStartIndex; j <= rowEndIndex; j += 1) {
      for (let i = columnStartIndex; i <= columnEndIndex; i += 1) {
        const cellId = getCellId({
          rowId: rowIndexList[j],
          columnId: columnIndexList[i],
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
  }, [area, store, getCellStateAtomById, enable, rowIdShowListAtom, columnIdShowListAtom])

  if (enable === false || down.columnIndex === -1 || up.columnIndex === -1) {
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
