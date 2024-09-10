import { useCallback, useLayoutEffect } from 'react'
import { useAtomValue, atom } from 'einfach-state'
import { useBasic } from '../../basic'
import { tableClassNameAtom } from '../../hooks'
import './AreaSelected.css'
import type { Position } from '@grid-table/core'
import { getCellId } from '../../utils/getCellId'
import { tableEventsAtom } from '../../hooks/useTableEvents'

const emptyPosition: Position = {
  rowIndex: -1,
  columnIndex: -1,
}
export const cellDownAtom = atom<Position>(emptyPosition)
export const cellUpAtom = atom<Position>(emptyPosition)
const isTouchAtom = atom<boolean>(false)

export function useAreaSelected() {
  const { store, cellEventsAtom, getCellStateAtomById, rowIndexListAtom, columnIndexListAtom } =
    useBasic()

  const onMouseDown = useCallback(
    (position: Position, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.button === 0) {
        store.setter(cellDownAtom, {
          rowIndex: position.rowIndex,
          columnIndex: position.columnIndex,
        })
        store.setter(cellUpAtom, emptyPosition)
        store.setter(isTouchAtom, true)
      }
    },
    [store],
  )

  const onMouseUp = useCallback(
    (position: Position, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      store.setter(isTouchAtom, false)
    },
    [store],
  )

  const onMouseEnter = useCallback(
    (position: Position, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const isTouch = store.getter(isTouchAtom)

      if (!isTouch) {
        return
      }
      if (e.buttons === 1) {
        if (down.columnIndex === position.columnIndex && down.rowIndex === position.rowIndex) {
          return
        }
        store.setter(cellUpAtom, {
          rowIndex: position.rowIndex,
          columnIndex: position.columnIndex,
        })
      }
    },
    [store],
  )

  const down = useAtomValue(cellDownAtom, { store })
  const up = useAtomValue(cellUpAtom, { store })

  useLayoutEffect(() => {
    const rowStartIndex = Math.min(up.rowIndex, down.rowIndex)
    const rowEndIndex = Math.max(up.rowIndex, down.rowIndex)
    const columnStartIndex = Math.min(up.columnIndex, down.columnIndex)
    const columnEndIndex = Math.max(up.columnIndex, down.columnIndex)

    const rowIndexList = store.getter(rowIndexListAtom)
    const columnIndexList = store.getter(columnIndexListAtom)

    if (rowStartIndex === -1 || columnStartIndex === -1) {
      return
    }
    const cancelList: (() => void)[] = []
    for (let j = rowStartIndex; j <= rowEndIndex; j += 1) {
      for (let i = columnStartIndex; i <= columnEndIndex; i += 1) {
        const cellId = getCellId({
          rowIndex: rowIndexList[j],
          columnIndex: columnIndexList[i],
        })

        cancelList.push(
          store.setter(getCellStateAtomById(cellId), (_getter, prev) => {
            const nextClsx = new Set(prev.className)
            nextClsx.add('select-cell-item')
            return {
              ...prev,
              className: nextClsx,
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
  }, [up, down, store, getCellStateAtomById])

  useLayoutEffect(() => {
    return store.setter(tableClassNameAtom, (getter, clsList) => {
      return new Set(clsList.add('user-select-none'))
    })
  }, [store])

  useLayoutEffect(() => {
    return store.setter(cellEventsAtom, (getter, prev) => {
      const next = { ...prev }

      if (!('onMouseEnter' in prev)) {
        next['onMouseEnter'] = new Set()
      }

      if (!('onMouseDown' in prev)) {
        next['onMouseDown'] = new Set()
      }
      if (!('onMouseUp' in prev)) {
        next['onMouseUp'] = new Set()
      }
      next['onMouseEnter']!.add(onMouseEnter)
      next['onMouseDown']!.add(onMouseDown)
      next['onMouseUp']!.add(onMouseUp)

      return next
    })
  }, [cellEventsAtom, onMouseEnter, onMouseDown, onMouseUp, store])

  const onContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    store.setter(cellDownAtom, emptyPosition)
    store.setter(cellUpAtom, emptyPosition)
  }, [])

  useLayoutEffect(() => {
    return store.setter(tableEventsAtom, (_getter, prev) => {
      const next = { ...prev }

      if (!('onContextMenu' in prev)) {
        next['onContextMenu'] = new Set()
      }
      next['onContextMenu']!.add(onContextMenu)
      return next
    })
  }, [onContextMenu, store])
}
