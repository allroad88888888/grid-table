import { useCallback, useEffect } from 'react'
import { useAtomValue, atom, useStore, useSetAtom } from '@einfach/react'
import { tableClassNameAtom } from '../../hooks'
import './AreaSelected.css'
import type { PositionId } from '@grid-table/basic'
import { headerLastIdAtom, useBasic } from '@grid-table/basic'
import {
  areaCellIdsAtom,
  areaColumnIdsAtom,
  areaEndAtom,
  areaStartAtom,
  emptyPosition,
} from './state'
import { applyHeaderStyleAtom } from './header'

const isTouchAtom = atom<boolean>(false)

export function useAreaSelected({ enable = false }: { enable?: boolean } = {}) {
  const { cellEventsAtom, getCellStateAtomById } = useBasic()
  const store = useStore()

  const onMouseDown = useCallback(
    (position: PositionId, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.button === 0) {
        store.setter(areaStartAtom, position)
        store.setter(areaEndAtom, emptyPosition)
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
        const down = store.getter(areaEndAtom)
        if (down.columnId === position.columnId && down.rowId === position.rowId) {
          return
        }
        store.setter(areaEndAtom, position)
      }
    },
    [store],
  )

  const cellList = useAtomValue(areaCellIdsAtom, { store })

  useEffect(() => {
    if (!enable) {
      return
    }
    if (cellList.length === 0) {
      return
    }
    console.log(`cellList`, cellList)
    const cancelList: (() => void)[] = []
    cellList.forEach((cellIdList) => {
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
  }, [cellList, store, getCellStateAtomById, enable])

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

  const areaColumnIds = useAtomValue(areaColumnIdsAtom, { store })
  const headerLastId = useAtomValue(headerLastIdAtom, { store })
  // 监听选择区域变化，更新表头最后一行的边框样式
  const applyHeaderStyle = useSetAtom(applyHeaderStyleAtom, { store })
  useEffect(() => {
    if (!enable) {
      return
    }

    // applyHeaderStyleAtom 返回清理函数，确保类型安全
    return applyHeaderStyle() || undefined
  }, [applyHeaderStyle, enable, areaColumnIds, headerLastId])

  // const onContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   e.preventDefault()
  //   store.setter(areaStartAtom, emptyPosition)
  //   store.setter(areaEndAtom, emptyPosition)
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
