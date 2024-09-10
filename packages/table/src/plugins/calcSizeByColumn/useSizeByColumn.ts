import { useBasic } from '../../basic'
import { useLayoutEffect } from 'react'
import { useAtomValue } from 'einfach-state'
import { useData } from '../data'
import { useAutoWidth } from './useAutoWidth'

interface UseSizeByColumnProps {
  /**
   * 列最小宽度
   * @default 25
   */
  columnMinWidth?: number
  rowHeight: number
  rowCount: number
  wrapWidth: number
}

export function useCellSizeByColumn(props: UseSizeByColumnProps) {
  const { rowCount, rowHeight, columnMinWidth = 25, wrapWidth } = props
  const { rowSizeListAtom, columnSizeListAtom, store, rowIndexListAtom, columnIndexListAtom } =
    useBasic()
  const { columnOptionsAtom } = useData()
  const columns = useAtomValue(columnOptionsAtom, { store })

  useLayoutEffect(() => {
    const sizeList = new Array(rowCount)
    sizeList.fill(rowHeight)
    const indexList = []
    for (let i = 0; i < rowCount; i += 1) {
      indexList.push(i)
    }
    store.setter(rowIndexListAtom, indexList)
    store.setter(rowSizeListAtom, sizeList)
  }, [rowCount, rowHeight, rowIndexListAtom, rowSizeListAtom, store])

  useLayoutEffect(() => {
    const indexList: number[] = []
    const sizeList = columns.map((column, index) => {
      indexList.push(index)
      return column.width || columnMinWidth
    })
    store.setter(columnSizeListAtom, sizeList)
    store.setter(columnIndexListAtom, indexList)
  }, [columnIndexListAtom, columnMinWidth, columnSizeListAtom, columns, store])

  useAutoWidth({
    width: wrapWidth,
    defaultItemWidth: columnMinWidth,
  })
}
