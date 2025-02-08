import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { atom, useAtom, useAtomValue, useStore, useSetAtom } from '@einfach/state'
import { tableEventsAtom } from '../../hooks/useTableEvents'
import { areaCellIdsAtom } from '../areaSelected/state'
import type { CellId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'
import { useDocumentClickHandler } from '../../utils/useDocumentClickHandler'
import { copyAtom } from './state'

export interface CopyProps {
  copyGetDataByCellIds?: (cellIds: CellId[][]) => string
  /**
   * 是否开启复制功能
   * @default false
   */
  enableCopy?: boolean
}

// function emptyFn() {
//   // eslint-disable-next-line no-console
//   console.warn('The table copy method does not pass parameters to the custom copy data method')
//   return 'The table copy method does not pass parameters to the custom copy data method'
// }

export const showCopyStyleAtom = atom(false)
/**
 * 这里逻辑 是弄个隐藏的text 制造能触发copy的事件
 * @returns
 */
export function useCopy({ copyGetDataByCellIds, enableCopy: enable = true }: CopyProps = {}) {
  const store = useStore()
  const { getCellStateAtomById } = useBasic()

  const [isShowStyle, showCopyStyle] = useAtom(showCopyStyleAtom, { store })

  const cellIds = useAtomValue(areaCellIdsAtom, { store })
  const copy = useSetAtom(copyAtom)

  const onCopy = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const cellIds = store.getter(areaCellIdsAtom)

      if (!cellIds || cellIds.length === 0) {
        return
      }

      showCopyStyle(true)
      const text = copyGetDataByCellIds ? copyGetDataByCellIds(cellIds) : copy(cellIds)

      e.clipboardData.setData('text/plain', text)
      e.stopPropagation()
      e.preventDefault()
    },
    [copy, copyGetDataByCellIds, showCopyStyle, store],
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
    if (!ref.current || cellIds.length === 0) {
      return
    }
    // 模拟选中 触发onCopy
    ref.current.select()
  }, [cellIds.length])

  useEffect(() => {
    if (enable === false || isShowStyle === false) {
      return
    }

    const cancelList: (() => void)[] = []

    const rowLength = cellIds.length

    cellIds.forEach((rowCellIds, rowIndex) => {
      const columnLength = rowCellIds.length
      rowCellIds.forEach((cellId, columnIndex) => {
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
            if (rowIndex === 0) {
              nextStyle.borderTop = borderStyle
            }
            if (rowIndex === rowLength - 1) {
              nextStyle.borderBottom = borderStyle
            }

            if (columnIndex === 0) {
              nextStyle.borderLeft = borderStyle
            }
            if (columnIndex === columnLength - 1) {
              nextStyle.borderRight = borderStyle
            }

            return {
              ...prev,
              style: nextStyle,
            }
          })!,
        )
      })
    })

    return () => {
      cancelList.forEach((cancel) => {
        cancel()
      })
    }
  }, [cellIds, enable, getCellStateAtomById, isShowStyle, store])

  const cancel = useCallback(() => {
    showCopyStyle(false)
  }, [showCopyStyle])

  useDocumentClickHandler(cancel)

  if (enable === false || cellIds.length === 0) {
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
