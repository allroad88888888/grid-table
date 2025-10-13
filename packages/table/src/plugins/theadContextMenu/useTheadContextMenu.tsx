import { useCallback, useEffect } from 'react'
import { useStore, useSetAtom } from '@einfach/react'

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

      // 获取表格容器和鼠标点击位置
      // thead-cell 的父容器作为定位参考
      const tableContainer = e.currentTarget.closest('.thead-cell')?.parentElement?.parentElement
      const containerRect = tableContainer?.getBoundingClientRect()

      // 计算相对位置时，需要加上滚动条的偏移量
      const scrollLeft = (tableContainer as HTMLElement)?.scrollLeft || 0
      const scrollTop = (tableContainer as HTMLElement)?.scrollTop || 0

      setPosition({
        x: (containerRect ? e.clientX - containerRect.left : e.clientX) + scrollLeft,
        y: (containerRect ? e.clientY - containerRect.top : e.clientY) + scrollTop,
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
