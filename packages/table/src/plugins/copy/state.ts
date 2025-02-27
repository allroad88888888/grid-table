import { atom } from '@einfach/state'
import type { CellId } from '@grid-table/basic'
import { getRowIdAndColIdByCellId } from '../../utils'
import { getColumnOptionAtomByColumnId, getRowInfoAtomByRowId } from '../../stateCore'
import { easyGet } from '@einfach/utils'

export const copyAtom = atom(undefined, (getter, setter, cellIds: CellId[][]) => {
  // 获取所有单元格数据
  const data = cellIds.map((cellList) => {
    const firstCellId = cellList[0]
    const [rowId] = getRowIdAndColIdByCellId(firstCellId)
    const rowInfo = getter(getRowInfoAtomByRowId(rowId))!
    return cellList.map((cellId) => {
      const [, columnId] = getRowIdAndColIdByCellId(cellId)
      const columnOption = getter(getColumnOptionAtomByColumnId(columnId))
      if (!columnOption.dataIndex) {
        return ''
      }
      const cellInfo = easyGet(rowInfo, columnOption.dataIndex, '')
      return cellInfo
    })
  })

  // 计算每列的最大宽度
  const columnWidths = data[0].map((_, columnIndex) => {
    return Math.max(...data.map((row) => String(row[columnIndex]).length))
  })

  // 将数据格式化为对齐后的字符串
  const formattedData = data
    .map((row) => {
      return row
        .map((cellInfo, index) => {
          // 根据最大宽度填充空格
          return String(cellInfo).padEnd(columnWidths[index], ' ')
        })
        .join('\t')
    })
    .join('\n')

  return formattedData
})
