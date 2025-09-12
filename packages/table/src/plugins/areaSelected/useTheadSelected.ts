import type { PositionId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'
import { atom, useStore } from '@einfach/react'
import { useCallback, useEffect } from 'react'
import { areaStartAtom, areaEndAtom, areaStartTypeAtom, areaEndTypeAtom } from './state'
import { getCellId } from '../../utils'

const selectTheadColumnAreaIdsAtom = atom<PositionId[]>([])

export function useTheadLastRowColumnSelect({ enable = false }: { enable?: boolean } = {}) {
  const { theadCellEventsAtom, rowIdShowListAtom, headerRowIndexListAtom } = useBasic()
  const store = useStore()

  const onClick = useCallback(
    (position: PositionId, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const headerRowIds = store.getter(headerRowIndexListAtom)

      /**
       * 只有表头最后一行有这个点击效果
       */
      const lastHeaderRowIndex = headerRowIds.length - 1
      const currentRowIndex = headerRowIds.indexOf(position.rowId)
      if (currentRowIndex !== lastHeaderRowIndex) {
        return
      }

      // 检查是否按住了右键（contextmenu），如果是右键则不处理
      if (e.button === 2) {
        return
      }

      // 处理 Shift 键多选逻辑
      if (e.shiftKey) {
        store.setter(selectTheadColumnAreaIdsAtom, (prev) => {
          if (prev.length === 0) {
            return [position]
          }
          return [prev[0], position]
        })

        const area = store.getter(selectTheadColumnAreaIdsAtom)
        const startColumnId = area[0].columnId
        const endColumnId = (area[1] || area[0]).columnId

        // 设置跨区域选择：从 thead 到 tbody
        store.setter(areaStartTypeAtom, 'thead')
        store.setter(areaEndTypeAtom, 'tbody')

        // 开始位置：thead 的点击位置
        store.setter(areaStartAtom, {
          columnId: startColumnId,
          rowId: position.rowId,
          cellId: getCellId({
            rowId: position.rowId,
            columnId: startColumnId,
          }),
        })

        // 结束位置：tbody 的最后一行
        const rowIdShowList = store.getter(rowIdShowListAtom)
        const lastTbodyRowId = rowIdShowList[rowIdShowList.length - 1]
        store.setter(areaEndAtom, {
          columnId: endColumnId,
          rowId: lastTbodyRowId,
          cellId: getCellId({
            columnId: endColumnId,
            rowId: lastTbodyRowId,
          }),
        })
      } else {
        // 普通左键点击：选中整列
        store.setter(selectTheadColumnAreaIdsAtom, [position])

        // 设置跨区域选择：从 thead 到 tbody
        store.setter(areaStartTypeAtom, 'thead')
        store.setter(areaEndTypeAtom, 'tbody')

        // 开始位置：thead 的点击位置
        store.setter(areaStartAtom, {
          columnId: position.columnId,
          rowId: position.rowId,
          cellId: position.cellId,
        })

        // 结束位置：tbody 的最后一行，同一列
        const rowIdShowList = store.getter(rowIdShowListAtom)
        const lastTbodyRowId = rowIdShowList[rowIdShowList.length - 1]
        store.setter(areaEndAtom, {
          columnId: position.columnId,
          rowId: lastTbodyRowId,
          cellId: getCellId({
            columnId: position.columnId,
            rowId: lastTbodyRowId,
          }),
        })
      }
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
