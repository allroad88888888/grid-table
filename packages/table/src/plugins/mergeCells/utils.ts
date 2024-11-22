import { getCellId, getRowIdAndColIdByCellId } from '../../utils/getCellId'
import type { MergeCellIdItem } from './types'

export function getAffectedCellSet(mergeCellList: MergeCellIdItem[] = []) {
  const cellIdSet = new Set<string>()

  mergeCellList.forEach(({ cellId, rowIdList = [], colIdList = [] }) => {
    const [curRowId, curColId] = getRowIdAndColIdByCellId(cellId)
    ;[curRowId, ...rowIdList].forEach((rowId, rowIndex) => {
      ;[curColId, ...colIdList].forEach((colId, colIndex) => {
        if (rowIndex === 0 && colIndex === 0) {
          return
        }
        cellIdSet.add(
          getCellId({
            rowId,
            columnId: colId,
          }),
        )
      })
    })
  })
  return cellIdSet
}
