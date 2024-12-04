import type { ColumnType } from '@grid-table/view'
import { atom } from 'einfach-state'
import type { PivotProps } from './type'
import { formatToTable } from './format'
import { headerMergeCellListAtom, mergeCellListAtom } from '@grid-table/view'

export const dataListAtom = atom<Record<string, any>[]>([])

export const columnListAtom = atom<ColumnType[]>([])

export const headerDataListAtom = atom<Record<string, any>[]>([])

export const headerColumnListAtom = atom([])

export const initAtom = atom(undefined, (getter, setter, { dataConfig }: PivotProps) => {
  const { data, columns, headerData, headerMergeCellList, bodyMergeCelList } =
    formatToTable(dataConfig)

  setter(dataListAtom, data)
  setter(
    columnListAtom,
    columns.map((prop) => {
      return {
        title: '',
        width: 100,
        align: 'center',
        dataIndex: prop,
        key: prop,
      } as ColumnType
    }),
  )
  setter(headerDataListAtom, headerData)
  setter(headerMergeCellListAtom, headerMergeCellList)
  setter(mergeCellListAtom, bodyMergeCelList)
})
