import { atom, useAtomValue } from 'einfach-state'
import { useInit } from 'einfach-utils'
import { useLayoutEffect } from 'react'
import { useBasic } from '../../basic'
import { tableClassNameAtom } from '../../hooks'

const selectColumnIndexAtom = atom<number | undefined>(undefined)
const firstEventAtom = atom<[number, number] | undefined>(undefined)
const leftAtom = atom<number | undefined>(undefined)

const DragIngClassName = 'grid-drag-ing'

export interface UseDragProps {
  columnBaseSize: number
  /**
   * 是否固定宽度
   */
  fixedWidth?: boolean
}

export function useDrag({ columnBaseSize, fixedWidth = false }: UseDragProps) {
  const { store, columnSizeListAtom, columnIndexListAtom, resizeAtom } = useBasic()
  const selectIndex = useAtomValue(selectColumnIndexAtom, { store })
  const left = useAtomValue(leftAtom, { store })

  const { height } = useAtomValue(resizeAtom, { store })

  const sizeMapAtom = useInit(() => {
    return atom((getter) => {
      const columnSizeMap = getter(columnSizeListAtom)
      const columnList = getter(columnIndexListAtom)
      const sizeMap: Map<number, number> = new Map()

      let prevSize = 0
      for (const columnIndex of columnList) {
        prevSize += columnSizeMap[columnIndex]
        sizeMap.set(columnIndex, prevSize)
      }
      return sizeMap
    })
  })

  useLayoutEffect(() => {
    if (selectIndex === undefined) {
      return
    }

    const [firstX] = store.getter(firstEventAtom)!
    const sizeMap = store.getter(sizeMapAtom)
    const currentX = sizeMap.get(selectIndex)!
    const tempColumnSize = store.getter(columnSizeListAtom)
    const currentSize = tempColumnSize[selectIndex]

    store.setter(leftAtom, currentX - 2)

    function mouseup() {
      if (store.getter(leftAtom) !== currentX - 2) {
        store.setter(columnSizeListAtom, (getter, prevState) => {
          const next = [...prevState]
          const index = store.getter(selectColumnIndexAtom)!
          const tLeft = store.getter(leftAtom)!
          /**
           * 计算宽度
           */
          const current = tempColumnSize[index]!
          const tWidth = tLeft - sizeMap.get(index)! + currentSize
          const realWidth = Math.floor(tWidth / columnBaseSize) * columnBaseSize
          next.splice(index, 1, realWidth)

          if (fixedWidth && index < sizeMap.size - 1) {
            const nextWidth = current - realWidth + tempColumnSize[index + 1]!
            next.splice(index + 1, 1, Math.ceil(nextWidth / columnBaseSize) * columnBaseSize)
          }

          return next
        })
      }

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
      const tLeft = Math.max(currentX - currentSize + 40, currentX + mvLength)
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
  }, [selectIndex])

  return {
    selectIndex,
    left,
    height,
  }
}

export function useDrayItem(columnIndex: number) {
  const { store } = useBasic()
  function mousedown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    store.setter(selectColumnIndexAtom, columnIndex)
    store.setter(firstEventAtom, [e.clientX, e.clientY])

    const next = new Set(store.getter(tableClassNameAtom))
    next.add(DragIngClassName)
    store.setter(tableClassNameAtom, next)
  }
  return { mousedown }
}
