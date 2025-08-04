import type { ColumnId } from '@grid-table/basic'
import './Drag.css'
import type { UseDragProps } from './useDrag'
import { useDrag, useDrayItem } from './useDrag'
import { atom, useAtomValue, useSetAtom, useAtomCallback } from '@einfach/react'
import { useLayoutEffect } from 'react'
import { autoColumnsSizeAtom } from '../calcSizeByColumn/useColumnAutoSize'
import { areaColumnIdsAtom } from '../areaSelected/state'

const enableColumnResizeAtom = atom(false)

export function DragLine(props: UseDragProps) {
  const { selectIndex, left } = useDrag(props)

  const setColumnResize = useSetAtom(enableColumnResizeAtom)

  useLayoutEffect(() => {
    setColumnResize(props.enableColumnResize ?? false)
  }, [props.enableColumnResize])

  if (selectIndex === undefined) {
    return null
  }

  return (
    <div
      className="grid-table-drag-mv-line"
      style={{
        left,
      }}
    ></div>
  )
}

interface ColumnDragItemProps {
  columnId: ColumnId
}

export function ColumnDragItem({ columnId }: ColumnDragItemProps) {
  const { mousedown } = useDrayItem(columnId)
  const autoColumnsSize = useSetAtom(autoColumnsSizeAtom)

  const enableColumnResize = useAtomValue(enableColumnResizeAtom)

  const handleDoubleClick = useAtomCallback(
    (getter, setter, e: React.MouseEvent) => {
      e.stopPropagation()

      const areaColumnIds = getter(areaColumnIdsAtom)

      let targetColumnIds: ColumnId[]

      // 当数组为空时，就用当前columnId
      if (areaColumnIds.length === 0) {
        targetColumnIds = [columnId]
      } else {
        // 数组长度大于0时，判断columnId是否在areaColumnIdsAtom里面
        const isColumnInArea = areaColumnIds.includes(columnId)
        // 在就用areaColumnIdsAtom，不在就用columnId
        targetColumnIds = isColumnInArea ? areaColumnIds : [columnId]
      }
      console.log(`targetColumnIds`, targetColumnIds)
      // 双击时自动调整列的宽度
      autoColumnsSize(targetColumnIds)
    },
    [columnId, autoColumnsSize],
  )

  if (!enableColumnResize) {
    return null
  }

  return (
    <span
      className="grid-table-drag-item"
      onMouseDown={mousedown}
      onClick={(e) => {
        e.stopPropagation()
      }}
      onDoubleClick={handleDoubleClick}
    />
  )
}
