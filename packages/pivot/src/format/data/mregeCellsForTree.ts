import type { CellId, MergeCellIdItem } from '@grid-table/view'
import { getCellId, getHeaderRowId } from '@grid-table/view'

export function mergeCellsForTree(columns: string[], dataList: Record<string, any>[]) {
  // 合并格子map
  const cellsMap = new Map<CellId, MergeCellIdItem>()

  let prevArea: [number, number][] = [[0, dataList.length - 1]]
  columns.every((columnKey, columnIndex) => {
    let prevVal: any
    let prevCellId: CellId | undefined = undefined

    if (prevArea.length === 0) {
      return false
    }

    prevArea.forEach((area) => {
      const nextArea: [number, number][] = []

      let next: { start?: number; end?: number } = {}
      for (let rowIndex = area[0], j = area[1]; rowIndex <= j; rowIndex += 1) {
        const itemInfo = dataList[rowIndex]
        const cur = itemInfo[columnKey]

        if (prevVal === cur) {
          if (!('start' in next)) {
            next.start = rowIndex - 1
          }

          if (!prevCellId) {
            prevCellId = getCellId({
              rowId: getHeaderRowId(rowIndex - 1),
              columnId: columnKey,
            })
          }

          if (!cellsMap.has(prevCellId)) {
            cellsMap.set(prevCellId, {
              cellId: prevCellId,
              rowIdList: [],
              colIdList: [],
            })
          }
          cellsMap.get(prevCellId)?.rowIdList?.push(getHeaderRowId(rowIndex))

          if (rowIndex === j - 1) {
            if ('start' in next) {
              next.end = rowIndex
              nextArea.push([next.start!, next.end!])
              next = {}
            }
          }
        } else {
          if ('start' in next) {
            next.end = rowIndex - 1
            nextArea.push([next.start!, next.end!])
            next = {}
          }
          prevCellId = undefined
          prevVal = cur
        }
      }
      prevArea = nextArea
    })

    return true
  })

  return Array.from(cellsMap.values())
}
