import { useCallback, useEffect } from 'react'
import { useAtomValue, atom, useStore } from 'einfach-state'
import { tableClassNameAtom } from '../../hooks'
import './AreaSelected.css'
import { getCellId } from '../../utils/getCellId'
import { tableEventsAtom } from '../../hooks/useTableEvents'
import type { PositionId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'

const emptyPosition: PositionId = {
  rowId: ' -1',
  columnId: '-1',
  columnIndex: -1,
  rowIndex: -1,
}
export const cellDownAtom = atom<PositionId>(emptyPosition)
export const cellUpAtom = atom<PositionId>(emptyPosition)
const isTouchAtom = atom<boolean>(false)

export function useAreaSelected({ enable = false }: { enable?: boolean } = {}) {
  const { cellEventsAtom, getCellStateAtomById, rowIdShowListAtom, columnIdShowListAtom } =
    useBasic()
  const store = useStore()

  const onMouseDown = useCallback(
    (position: PositionId, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.button === 0) {
        store.setter(cellDownAtom, position)
        store.setter(cellUpAtom, emptyPosition)
        store.setter(isTouchAtom, true)
      }
    },
    [store],
  )

  const onMouseUp = useCallback(
    (position: PositionId, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      store.setter(isTouchAtom, false)
    },
    [store],
  )

  const onMouseEnter = useCallback(
    (position: PositionId, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const isTouch = store.getter(isTouchAtom)

      if (!isTouch) {
        return
      }

      if (e.buttons === 1) {
        if (down.columnId === position.columnId && down.rowId === position.rowId) {
          return
        }
        store.setter(cellUpAtom, position)
      }
    },
    [store],
  )

  const down = useAtomValue(cellDownAtom, { store })
  const up = useAtomValue(cellUpAtom, { store })

  useEffect(() => {
    if (!enable) {
      return
    }
    const rowStartIndex = Math.min(up.rowIndex, down.rowIndex)
    const rowEndIndex = Math.max(up.rowIndex, down.rowIndex)
    const columnStartIndex = Math.min(up.columnIndex, down.columnIndex)
    const columnEndIndex = Math.max(up.columnIndex, down.columnIndex)

    const rowIndexList = store.getter(rowIdShowListAtom)
    const columnIndexList = store.getter(columnIdShowListAtom)

    if (rowStartIndex === -1 || columnStartIndex === -1) {
      return
    }

    const cancelList: (() => void)[] = []
    for (let j = rowStartIndex; j <= rowEndIndex; j += 1) {
      for (let i = columnStartIndex; i <= columnEndIndex; i += 1) {
        const cellId = getCellId({
          rowId: rowIndexList[j],
          columnId: columnIndexList[i],
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
  }, [up, down, store, getCellStateAtomById, enable])

  useEffect(() => {
    if (!enable) {
      return
    }
    return store.setter(tableClassNameAtom, (getter, clsList) => {
      return new Set(clsList.add('user-select-none'))
    })
  }, [store, enable])

  useEffect(() => {
    if (!enable) {
      return
    }
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
  }, [cellEventsAtom, onMouseEnter, onMouseDown, onMouseUp, store, enable])

  const onContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    store.setter(cellDownAtom, emptyPosition)
    store.setter(cellUpAtom, emptyPosition)
  }, [])

  useEffect(() => {
    if (!enable) {
      return
    }
    return store.setter(tableEventsAtom, (_getter, prev) => {
      const next = { ...prev }

      if (!('onContextMenu' in prev)) {
        next['onContextMenu'] = new Set()
      }
      next['onContextMenu']!.add(onContextMenu)
      return next
    })
  }, [onContextMenu, store, enable])
}
