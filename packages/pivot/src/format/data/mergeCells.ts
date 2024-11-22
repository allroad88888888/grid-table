import type { CellId, MergeCellIdItem } from '@grid-table/view'
import { getCellId, getHeaderRowId } from '@grid-table/view'

export function mergeCells(columns: string[], dataList: Record<string, any>[]) {
  const cellsMap = new Map<CellId, MergeCellIdItem>()

  let prevRowInfo: Record<string, any> | undefined = undefined

  const rowColumnIndexCellIds: (CellId | undefined)[] = []

  dataList.forEach((itemInfo, rowIndex) => {
    let prev: any = undefined
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
        cellsMap.get(prevCellId)?.colIdList?.push(columnKey)
      } else {
        prevCellId = undefined
      }
      prev = current

      if (prevRowInfo && prevRowInfo[columnKey] === current) {
        if (!rowColumnIndexCellIds[columnIndex]) {
          rowColumnIndexCellIds[columnIndex] = getCellId({
            rowId: getHeaderRowId(rowIndex - 1),
            columnId: columnKey,
          })
          cellsMap.set(rowColumnIndexCellIds[columnIndex]!, {
            cellId: rowColumnIndexCellIds[columnIndex]!,
            rowIdList: [],
            colIdList: [],
          })
        }
        cellsMap.get(rowColumnIndexCellIds[columnIndex]!)?.rowIdList?.push(getHeaderRowId(rowIndex))
      } else {
        rowColumnIndexCellIds[columnIndex] = undefined
      }
    })
    prevRowInfo = itemInfo
  })

  return Array.from(cellsMap.values())
}
