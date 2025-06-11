import { atom } from '@einfach/react'
import {
  basicAtom,
  columnIndexListAtom,
  getCellId,
  headerRowIndexListAtom,
  rowIndexListAtom,
} from '@grid-table/view'
import { mergeStyles } from '../utils/mergeStyles'
import type { Theme } from './types/theme'
import { fieldsRowsAtom } from '../state'

export const initHeaderThemeAtom = atom(0, (getter, setter, theme: Theme) => {
  const headerIds = getter(headerRowIndexListAtom)
  const columnIds = getter(columnIndexListAtom)
  const rowBodyIds = getter(rowIndexListAtom)
  const rows = getter(fieldsRowsAtom)

  const { rowCell = {}, colCell = {}, dataCell = {}, cornerCell = {} } = theme

  const { getHeaderCellStateAtomById, getCellStateAtomById } = getter(basicAtom)
  const colCancelList: (() => void)[] = []
  const cornerCancelList: (() => void)[] = []
  const rowCancelList: (() => void)[] = []
  const dataCancelList: (() => void)[] = []
  const cornerIds: string[] = []
  headerIds.forEach((rowId) => {
    // 角头
    rows.forEach((rowsId) => {
      const cornerId = getCellId({
        rowId,
        columnId: rowsId,
      })
      cornerIds.push(cornerId)
      cornerCancelList.push(
        setter(getHeaderCellStateAtomById(cornerId), (getter, prev) => {
          const next = {
            ...prev,
            style: mergeStyles([prev.style, cornerCell]),
          }
          return next
        })!,
      )
    })
    // 列头
    columnIds.forEach((columnId) => {
      const cellId = getCellId({
        rowId,
        columnId,
      })
      if (cornerIds.includes(cellId)) {
        return
      }
      // col.push(cellId)
      colCancelList.push(
        setter(getHeaderCellStateAtomById(cellId), (getter, prev) => {
          const next = {
            ...prev,
            style: mergeStyles([prev.style, colCell]),
          }
          return next
        })!,
      )
    })
  })
  const dataIds: string[] = columnIds.filter((n) => !rows.includes(n)) ?? []

  rowBodyIds.map((rowBodyId) => {
    // 数值单元格
    dataIds.forEach((dataId) => {
      const cellId = getCellId({
        rowId: rowBodyId,
        columnId: dataId,
      })
      dataCancelList.push(
        setter(getCellStateAtomById(cellId), (getter, prev) => {
          const next = {
            ...prev,
            style: mergeStyles([prev.style, dataCell]),
          }
          return next
        })!,
      )
    })
    // 行头
    rows.forEach((rowsId) => {
      const rowId = getCellId({
        rowId: rowBodyId,
        columnId: rowsId,
      })
      // row.push(rowId)
      rowCancelList.push(
        setter(getCellStateAtomById(rowId), (getter, prev) => {
          const next = {
            ...prev,
            style: mergeStyles([prev.style, rowCell]),
          }
          return next
        })!,
      )
    })
  })

  return () => {
    colCancelList.forEach((cancel) => {
      cancel()
    })
    cornerCancelList.forEach((cancel) => {
      cancel()
    })
    rowCancelList.forEach((cancel) => {
      cancel()
    })
    dataCancelList.forEach((cancel) => {
      cancel()
    })
  }
})
