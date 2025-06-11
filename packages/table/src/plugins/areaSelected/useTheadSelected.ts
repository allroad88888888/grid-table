import type { PositionId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'
import { atom, useStore } from '@einfach/react'
import { useCallback, useEffect } from 'react'
import { areaStartAtom, areaEndAtom } from './state'
import { getCellId } from '../../utils'

const selectTheadColumnAreaIdsAtom = atom<PositionId[]>([])

export function useTheadSelected({ enable = false }: { enable?: boolean } = {}) {
  const { theadCellEventsAtom, rowIdShowListAtom, headerRowIndexListAtom } = useBasic()
  const store = useStore()

  const onClick = useCallback(
    (position: PositionId, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const rowShowIds = store.getter(headerRowIndexListAtom)
      /**
       * 只有最后一列 有这个点击效果
       */
      if (rowShowIds.length - 1 > Number(position.rowId)) {
        return
      }

      store.setter(selectTheadColumnAreaIdsAtom, (prev) => {
        if (prev.length === 0 || !e.shiftKey) {
          return [position]
        }
        return [prev[0], position]
      })

      const area = store.getter(selectTheadColumnAreaIdsAtom)

      const rowIdShowList = store.getter(rowIdShowListAtom)
      const rowStartId = rowIdShowList[0]
      store.setter(areaStartAtom, {
        columnId: area[0].columnId,
        rowId: rowStartId,
        cellId: getCellId({
          rowId: rowStartId,
          columnId: area[0].columnId,
        }),
      })

      const length = rowIdShowList.length
      const rowEndId = rowIdShowList[length - 1]
      const colEndId = (area[1] || area[0]).columnId
      store.setter(areaEndAtom, {
        columnId: colEndId,
        rowId: rowEndId,
        cellId: getCellId({
          columnId: colEndId,
          rowId: rowEndId,
        }),
      })
    },
    [headerRowIndexListAtom, rowIdShowListAtom, store],
  )

  useEffect(() => {
    if (!enable) {
      return
    }
    return store.setter(theadCellEventsAtom, (getter, prev) => {
      const next = { ...prev }

      if (!('onClick' in prev)) {
        next['onClick'] = new Set()
      }

      next['onClick']!.add(onClick)

      return next
    })
  }, [store, enable, theadCellEventsAtom, onClick])
}
