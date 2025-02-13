import type { ColumnType } from '@grid-table/view'
import { atom } from '@einfach/state'
import type { PivotProps } from './type'
import { formatToTable } from './format'
import { tbodyMergeCellListAtom, theadMergeCellListAtom } from '@grid-table/view'
import { CellFirst } from './cell/First'

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
    columns.map((prop, index) => {
      const columnOption: ColumnType = {
        title: '',
        width: 100,
        align: 'center',
        dataIndex: prop,
        key: prop,
      }
      if (index === 0) {
        columnOption.renderComponent = CellFirst
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
