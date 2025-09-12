import { useCallback, useEffect } from 'react'
import { useAtomValue, useStore } from '@einfach/react'
import type { PositionId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'
import {
  areaCellIdsAtom,
  areaStartAtom,
  areaEndAtom,
  areaStartTypeAtom,
  areaEndTypeAtom,
  emptyPosition,
  areaIsTouchAtom,
} from './state'

export function useTbodyAreaSelected({ enable = false }: { enable?: boolean } = {}) {
  const { tbodyCellEventsAtom, getCellStateAtomById } = useBasic()
  const store = useStore()

  const onMouseDown = useCallback(
    (position: PositionId, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.button === 0) {
        store.setter(areaStartAtom, position)
        store.setter(areaStartTypeAtom, 'tbody')
        store.setter(areaEndAtom, emptyPosition)
        store.setter(areaEndTypeAtom, undefined)
        store.setter(areaIsTouchAtom, true)
      }
    },
    [store],
  )

  const onMouseUp = useCallback(
    (position: PositionId, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      store.setter(areaIsTouchAtom, false)
    },
    [store],
  )

  const onMouseEnter = useCallback(
    (position: PositionId, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const isTouch = store.getter(areaIsTouchAtom)

      if (!isTouch) {
        return
      }

      if (e.buttons === 1) {
        const currentEnd = store.getter(areaEndAtom)
        if (currentEnd.columnId === position.columnId && currentEnd.rowId === position.rowId) {
          return
        }
        store.setter(areaEndAtom, position)
        store.setter(areaEndTypeAtom, 'tbody')
      }
    },
    [store],
  )

  const { cellTbodyList } = useAtomValue(areaCellIdsAtom, { store })

  useEffect(() => {
    if (!enable) {
      return
    }
    if (cellTbodyList.length === 0) {
      return
    }
    const cancelList: (() => void)[] = []
    cellTbodyList.forEach((cellIdList) => {
      cellIdList.forEach((cellId) => {
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
      })
    })

    return () => {
      cancelList.forEach((cancel) => {
        cancel()
      })
    }
  }, [cellTbodyList, store, getCellStateAtomById, enable])

  useEffect(() => {
    if (!enable) {
      return
    }
    return store.setter(tbodyCellEventsAtom, (getter, prev) => {
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
  }, [tbodyCellEventsAtom, onMouseEnter, onMouseDown, onMouseUp, store, enable])

  // const onContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   e.preventDefault()
  //   store.setter(areaStartAtom, emptyPosition)
  //   store.setter(areaEndAtom, emptyPosition)
  //   store.setter(areaStartTypeAtom, undefined)
  //   store.setter(areaEndTypeAtom, undefined)
  // }, [])

  // useEffect(() => {
  //   if (!enable) {
  //     return
  //   }
  //   return store.setter(tableEventsAtom, (_getter, prev) => {
  //     const next = { ...prev }

  //     if (!('onContextMenu' in prev)) {
  //       next['onContextMenu'] = new Set()
  //     }
  //     next['onContextMenu']!.add(onContextMenu)
  //     return next
  //   })
  // }, [onContextMenu, store, enable])
}
