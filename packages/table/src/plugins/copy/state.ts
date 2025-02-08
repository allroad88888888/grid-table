import { atom } from '@einfach/state'
import type { CellId } from '@grid-table/basic'
import { getRowIdAndColIdByCellId } from '../../utils'
import { getColumnOptionAtomByColumnId, getRowInfoAtomByRowId } from '../../stateCore'
import { easyGet } from '@einfach/utils'

export const copyAtom = atom(undefined, (getter, setter, cellIds: CellId[][]) => {
  let res = ''
  cellIds.forEach((cellList) => {
    const firstCellId = cellList[0]
    const [rowId] = getRowIdAndColIdByCellId(firstCellId)
    const rowInfo = getter(getRowInfoAtomByRowId(rowId))!
    cellList.forEach((cellId) => {
      const [, columnId] = getRowIdAndColIdByCellId(cellId)
      const columnOption = getter(getColumnOptionAtomByColumnId(columnId))
      const cellInfo = easyGet(rowInfo, columnOption.dataIndex!)
      res += `${cellInfo}\t`
    })
    res += '\n'
  })
  return res
})
