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
    >

    </div>
  )
}

interface ColumnDragItemProps {
  columnIndex: number
}

export function ColumnDragItem({ columnIndex }: ColumnDragItemProps) {
  const { mousedown } = useDrayItem(columnIndex)
  return (
    <div
      className="grid-table-drag-item"
      onMouseDown={mousedown}
    />
  )
}
