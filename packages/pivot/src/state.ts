import type { CellId, ColumnType } from '@grid-table/view'
import { atom } from '@einfach/state'
import type { PivotProps } from './type'
import { formatToTable } from './format'
import {
  getColumnOptionAtomByColumnId,
  getRowIdAndColIdByCellId,
  getRowInfoAtomByRowId,
  tbodyMergeCellListAtom,
  theadMergeCellListAtom,
} from '@grid-table/view'
import { easyGet } from '@einfach/utils'

export const dataListAtom = atom<Record<string, any>[]>([])

export const columnListAtom = atom<ColumnType[]>([])

export const headerDataListAtom = atom<Record<string, any>[]>([])

export const headerColumnListAtom = atom([])

export const initAtom = atom(undefined, (getter, setter, { dataConfig }: PivotProps) => {
  const { data, columns, headerData, headerMergeCellList, bodyMergeCelList } =
    formatToTable(dataConfig)

  setter(dataListAtom, data)

  const rowSet = new Set(dataConfig.fields.rows)

  setter(
    columnListAtom,
    columns.map((prop) => {
      const columnOption: ColumnType = {
        title: '',
        width: 100,
        align: 'center',
        dataIndex: prop,
        key: prop,
      }
      if (rowSet.has(prop)) {
        columnOption.fixed = 'left'
      }
      return columnOption
    }),
  )
  setter(headerDataListAtom, headerData)
  setter(theadMergeCellListAtom, headerMergeCellList)
  setter(tbodyMergeCellListAtom, bodyMergeCelList)
})

export const copyAtom = atom(undefined, (getter, setter, cellIds: CellId[][]) => {
  // const { getRowInfoAtomByRowId, getColumnOptionAtomByColumnId } = getter(coreDataAtoms)

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
