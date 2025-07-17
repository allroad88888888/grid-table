import type { ColumnId } from '@grid-table/basic'
import './Drag.css'
import type { UseDragProps } from './useDrag'
import { useDrag, useDrayItem } from './useDrag'
import { atom, useAtomValue, useSetAtom } from '@einfach/react'
import { useLayoutEffect } from 'react'

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

  const enableColumnResize = useAtomValue(enableColumnResizeAtom)
  if (!enableColumnResize) {
    return null
  }

  return <span className="grid-table-drag-item" onMouseDown={mousedown} />
}
