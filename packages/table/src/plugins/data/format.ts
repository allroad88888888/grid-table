import { easyGet } from 'einfach-utils'
import { getCellId } from '../../utils/getCellId'
import type { DataContextType } from './createDataContext'
import type { UseDataProps } from './type/common'

export function format(
  props: Pick<UseDataProps, 'dataSource' | 'columns'>,
  context: DataContextType,
) {
  const { dataSource, columns } = props
  const { getCellInfoByCellId, getRowInfoByRowId, getColumnOptionAtomByColId } = context

  dataSource.forEach((rowInfo, rowIndex) => {
    getRowInfoByRowId(`${rowIndex}`, rowInfo)
    columns.forEach((column, columnIndex) => {
      const cellId = getCellId({
        rowIndex,
        columnIndex,
      })
      if (column.dataIndex) {
        getCellInfoByCellId(cellId, easyGet(rowInfo, column.dataIndex))
      }
      getColumnOptionAtomByColId(columnIndex, column)
    })
  })
}
