import type { ColumnType } from '@grid-table/view'
import type { ExcelInitProps } from '../state/type'
import { ColumnIndex } from '../cell/ColumnIndex'

/**
 * 根据数字生成字母
 * @param num
 * @returns
 */
function numberToExcelColumn(num: number) {
  let columnName = ''
  while (num >= 0) {
    columnName = String.fromCharCode((num % 26) + 65) + columnName
    num = Math.floor(num / 26)
    num--
  }
  return columnName
}

export function createColumnName(columnCount: number) {
  //   const names = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  const res = []
  for (let i = 0; i < columnCount; i += 1) {
    res.push(numberToExcelColumn(i))
  }
  return res
}

function createColumnOption(name: string) {
  const option: ColumnType = {
    dataIndex: name,
    title: name,
    align: 'center',
    width: 64,
  }
  return option
}

export function createEmptyExcel({ rowCount, columnCount }: ExcelInitProps) {
  const columnNames = createColumnName(columnCount)

  const columns = columnNames.map((columnName) => {
    return createColumnOption(columnName)
  })

  const dataList = []
  const emptyTemp = {}
  for (let i = 0; i < rowCount; i += 1) {
    dataList.push(emptyTemp)
  }

  return {
    columns: [
      { title: '', align: 'center', width: 48, renderComponent: ColumnIndex } as ColumnType,
      ...columns,
    ],
    dataList,
  }
}
