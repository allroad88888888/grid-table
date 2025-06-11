import { atom, useAtomValue, useStore } from '@einfach/react'
import { useEffect } from 'react'
import { tableClassNameAtom } from '../../hooks'
import type { ColumnId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'

const selectColumnIndexAtom = atom<ColumnId | undefined>(undefined)
const firstEventAtom = atom<[number, number] | undefined>(undefined)
const leftAtom = atom<number | undefined>(0)

const DragIngClassName = 'grid-drag-ing'

export interface UseDragProps {
  dragColumnMinSize?: number
  /**
   * 是否固定宽度
   */
  fixedWidth?: boolean
}

export function useDrag({ dragColumnMinSize = 40, fixedWidth = false }: UseDragProps) {
  const { columnSizeMapAtom, resizeAtom } = useBasic()
  const store = useStore()
  const selectColumnId = useAtomValue(selectColumnIndexAtom, { store })
  const left = useAtomValue(leftAtom, { store })

  const { height } = useAtomValue(resizeAtom, { store })

  useEffect(() => {
    if (selectColumnId === undefined) {
      return
    }

    const [firstX, firstLeft] = store.getter(firstEventAtom)!

    const columnSizeMap = store.getter(columnSizeMapAtom)

    const currentWidth = columnSizeMap.get(selectColumnId) || 0

    function mouseup(event: MouseEvent) {
      if (!selectColumnId) {
        return
      }
      const nextSizeMap = new Map(columnSizeMap)
      const mvLength = event.clientX - firstX
      const nextWidth = Math.max(dragColumnMinSize, currentWidth + mvLength)
      nextSizeMap.set(selectColumnId, nextWidth)

      store.setter(columnSizeMapAtom, nextSizeMap)

      store.setter(selectColumnIndexAtom, undefined)
      store.setter(firstEventAtom, undefined)
      /**
       * 移除选中效果
       */
      const next = new Set(store.getter(tableClassNameAtom))
      next.delete(DragIngClassName)
      store.setter(tableClassNameAtom, next)
    }

    function mouseMove(event: MouseEvent) {
      const mvLength = event.clientX - firstX

      const tLeft = Math.max(firstLeft - currentWidth + dragColumnMinSize, firstLeft + mvLength)
      store.setter(leftAtom, tLeft)
    }
    document.body.addEventListener('mousemove', mouseMove)
    document.body.addEventListener('mouseup', mouseup)
    document.body.addEventListener('mouseleave', mouseup)
    return () => {
      document.body.removeEventListener('mouseup', mouseup)
      document.body.removeEventListener('mousemove', mouseMove)
      document.body.removeEventListener('mouseleave', mouseup)
    }
  }, [selectColumnId])

  return {
    selectIndex: selectColumnId,
    left,
    height,
  }
}

export function useDrayItem(columnId: ColumnId) {
  const store = useStore()
  function mousedown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    store.setter(selectColumnIndexAtom, columnId)
    const left = (e.target as HTMLDivElement).offsetLeft + 2
    store.setter(leftAtom, left)
    store.setter(firstEventAtom, [e.clientX, left])
    const next = new Set(store.getter(tableClassNameAtom))
    next.add(DragIngClassName)
    store.setter(tableClassNameAtom, next)
  }
  return { mousedown }
}
