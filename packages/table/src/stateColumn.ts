import type { ColumnType } from './types'
import { columnInit } from './core/format'
import { atom, selectAtom } from '@einfach/state'
import { basicAtom, columnIndexListAtom, columnSizeMapAtom } from '@grid-table/basic'
import { dataFamilyAtom } from './stateCore'
import { getColumnId } from './utils/getColumnId'
import { easyEqual } from '@einfach/utils'

export const columnInitAtom = atom(0, (getter, setter, columns: ColumnType[]) => {
  const { columnMap, columnIdList } = columnInit(columns)

  /**
   * 树形处理
   */
  const hasTreeExpand = columns.every((column) => {
    return !column.enabledExpand
  })
  if (hasTreeExpand) {
    columns[0].enabledExpand = true
  }
  const { getColumnOptionAtomByColumnId } = getter(dataFamilyAtom)
  const { getColumnStateAtomById } = getter(basicAtom)

  for (const [columnId, columnOption] of columnMap) {
    columnOption.key = columnId
    setter(getColumnOptionAtomByColumnId(columnId), columnOption)
    setter(getColumnStateAtomById(columnId), {
      className: new Set([`gird-table-text-${columnOption.align || 'left'}`]),
      style: {},
    })
  }

  setter(columnIndexListAtom, columnIdList)
})

export const columnAddAtom = atom(
  0,
  (getter, setter, column: ColumnType, position: 'top' | 'bottom' = 'bottom') => {
    const columnId = getColumnId(column)

    const { getColumnOptionAtomByColumnId } = getter(dataFamilyAtom)
    const { getColumnStateAtomById } = getter(basicAtom)
    setter(getColumnStateAtomById(columnId), {
      className: new Set([`gird-table-text-${column.align || 'left'}`]),
      style: {},
    })
    setter(getColumnOptionAtomByColumnId(columnId), column)
    if (column.width) {
      setter(columnSizeMapAtom, (prev) => {
        const next = new Map(prev)
        next.set(columnId, column.width!)
        return next
      })
    }

    setter(columnIndexListAtom, (prev) => {
      if (position === 'top') {
        return [columnId, ...prev]
      }
      return [...prev, columnId]
    })
  },
)

export const columnsOptionAtom = selectAtom(
  atom((getter) => {
    const { getColumnOptionAtomByColumnId } = getter(dataFamilyAtom)
    return getter(columnIndexListAtom).map((colId) => {
      return getter(getColumnOptionAtomByColumnId(colId))
    })
  }),
  (cols) => {
    return cols
  },
  easyEqual,
)
