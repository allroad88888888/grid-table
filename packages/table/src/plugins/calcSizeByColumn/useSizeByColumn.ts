import { useInit } from 'einfach-utils'
import { useBasic } from '../../basic'
import type { BasicOption } from './type'

interface UseSizeByColumnProps {
  columns: BasicOption[]
  /**
   * 列最小宽度
   * @default 25
   */
  columnMinWidth?: number
  rowHeight: number
  rowCount: number
}

export function useCellSizeByColumn(props: UseSizeByColumnProps) {
  const { columns, rowCount, rowHeight, columnMinWidth = 25 } = props
  const { rowSizeListAtom, columnSizeListAtom, store } = useBasic()
  useInit(() => {
    const sizeList = new Array(rowCount)
    sizeList.fill(rowHeight)
    store.setter(rowSizeListAtom, sizeList)
  }, [rowCount, rowHeight])

  useInit(() => {
    const sizeList = columns.map((column) => {
      return column.width || columnMinWidth
    })
    store.setter(columnSizeListAtom, sizeList)
  }, [columns])
}
