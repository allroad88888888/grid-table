import { useCallback, useEffect } from 'react'
import { useStore, useSetAtom } from 'einfach-state'

import type { PositionId } from '@grid-table/basic'
import { headerRowIndexListAtom, theadCellEventsAtom } from '@grid-table/basic'
import { columnContextMenuPositionAtom } from './state'

export function useTheadContextMenu({ enable = true }: { enable: boolean }) {
  const store = useStore()
  const setPosition = useSetAtom(columnContextMenuPositionAtom, { store })
  const onContextMenu = useCallback(
    (position: PositionId, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation()
      e.preventDefault()
      const rowShowIds = store.getter(headerRowIndexListAtom)
      /**
       * 只有最后一列 有这个点击效果
       */
      if (rowShowIds.length - 1 > Number(position.rowId)) {
        return
      }

      setPosition({
        x: e.currentTarget.offsetLeft,
        y: e.currentTarget.offsetTop,
        columnId: position.columnId,
      })
    },
    [setPosition, store],
  )

  const cancelContextMenu = useCallback(() => {
    setPosition(undefined)
  }, [])

  useEffect(() => {
    if (!enable) {
      return
    }

    document.body.addEventListener('click', cancelContextMenu)

    const cancel = store.setter(theadCellEventsAtom, (getter, prev) => {
      const next = { ...prev }

      if (!('onContextMenu' in prev)) {
        next['onContextMenu'] = new Set()
      }

      next['onContextMenu']!.add(onContextMenu)

      return next
    })!
    return () => {
      cancel()
      document.body.removeEventListener('click', cancelContextMenu)
    }
  }, [store, enable, onContextMenu, cancelContextMenu])
}
