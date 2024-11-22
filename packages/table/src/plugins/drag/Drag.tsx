import type { ColumnId } from '@grid-table/basic'
import './Drag.css'
import type { UseDragProps } from './useDrag'
import { useDrag, useDrayItem } from './useDrag'

export function DragLine(props: UseDragProps) {
  const { selectIndex, left } = useDrag(props)
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
  return <span className="grid-table-drag-item" onMouseDown={mousedown} />
}
