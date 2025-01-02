import type { CellId, MergeCellIdItem } from '@grid-table/view'
import { getCellId, getHeaderRowId } from '@grid-table/view'

export function mergeCells(
  columns: string[],
  dataList: Record<string, any>[],
  {
    rowMergeType = 'auto',
  }: {
    /**
     * 行合并单元格模式
     * auto 遇到相同的，就自动合并
     * tree 必须上一个节点
     */
    rowMergeType?: 'auto' | 'tree'
  } = {},
) {
  // 合并格子map
  const cellsMap = new Map<CellId, MergeCellIdItem>()

  // 上一列信息
  let prevRowInfo: Record<string, any> | undefined = undefined

  const rowColumnIndexCellIds: (CellId | undefined)[] = []

  dataList.forEach((itemInfo, rowIndex) => {
    // 上一行信息
    let prev: any = undefined
    // 上一个格子信息
    let prevCellId: CellId | undefined = undefined
    columns.forEach((columnKey, columnIndex) => {
      const current = itemInfo[columnKey]
      if (prev && prev === current) {
        if (!prevCellId) {
          prevCellId = getCellId({
            rowId: getHeaderRowId(rowIndex),
            columnId: columns[columnIndex - 1],
          })
          cellsMap.set(prevCellId, { cellId: prevCellId, rowIdList: [], colIdList: [] })
        }
        // 左右合并 列合并
        cellsMap.get(prevCellId)?.colIdList?.push(columnKey)
      } else {
        prevCellId = undefined
      }
      prev = current
      /**
       * 如果上一行 这一列的数据 === 当前列的数据，则合并行
       */
      if (prevRowInfo && prevRowInfo[columnKey] === current) {
        /**
         * 添加一个合并的
         */
        if (!rowColumnIndexCellIds[columnIndex]) {
          rowColumnIndexCellIds[columnIndex] = getCellId({
            rowId: getHeaderRowId(rowIndex - 1),
            columnId: columnKey,
          })

          cellsMap.set(rowColumnIndexCellIds[columnIndex]!, {
            // ...cellsMap.get(prevCellId!),
            cellId: rowColumnIndexCellIds[columnIndex]!,

            rowIdList: [],
            colIdList: [],
          })
        }

        // 上下合并 行合并
        cellsMap.get(rowColumnIndexCellIds[columnIndex]!)?.rowIdList?.push(getHeaderRowId(rowIndex))
      } else {
        rowColumnIndexCellIds[columnIndex] = undefined
      }
    })
    prevRowInfo = itemInfo
  })

  return Array.from(cellsMap.values())
}
