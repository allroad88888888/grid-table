import { useCallback, useEffect } from 'react'
import { useAtomValue, useStore } from '@einfach/react'
import type { PositionId } from '@grid-table/basic'
import { theadCellEventsAtom, useBasic } from '@grid-table/basic'
import {
  areaCellIdsAtom,
  emptyPosition,
  areaStartAtom,
  areaEndAtom,
  areaStartTypeAtom,
  areaEndTypeAtom,
  areaIsTouchAtom,
} from './state'

export function useTheadAreaSelected({ enable = false }: { enable?: boolean } = {}) {
  const { tbodyCellEventsAtom, getTheadCellStateAtomById } = useBasic()
  const store = useStore()

  const onMouseDown = useCallback(
    (position: PositionId, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.button === 0) {
        store.setter(areaStartAtom, position)
        store.setter(areaStartTypeAtom, 'thead')
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
        store.setter(areaEndTypeAtom, 'thead')
      }
    },
    [store],
  )

  const { cellTheadList } = useAtomValue(areaCellIdsAtom, { store })

  useEffect(() => {
    if (!enable) {
      return
    }
    if (cellTheadList.length === 0) {
      return
    }
    const cancelList: (() => void)[] = []
    cellTheadList.forEach((cellIdList) => {
      cellIdList.forEach((cellId) => {
        cancelList.push(
          store.setter(getTheadCellStateAtomById(cellId), (_getter, prev) => {
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
  }, [cellTheadList, store, getTheadCellStateAtomById, enable])

  useEffect(() => {
    if (!enable) {
      return
    }
    return store.setter(theadCellEventsAtom, (getter, prev) => {
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
}
