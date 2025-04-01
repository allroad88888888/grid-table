import { atom } from '@einfach/state'
import {
  basicAtom,
  columnIndexListAtom,
  getCellId,
  headerRowIndexListAtom,
  rowIndexListAtom,
  theadMergeCellListAtom,
} from '@grid-table/view'
import { mergeStyles } from '../utils/mergeStyles'
import type { Theme } from './types/theme'
import { fieldsRowsAtom } from '../state'
import { CellType, formatStyle } from './formatStyle'
import { findLastPerGroup } from './utils/util'

type CellIdList = {
  cornerIds: string[]
  colsIds: string[]
  borderCellIds: string[]
  borderRowIds: string[]
  borderDataIds: string[]
  borderCornerIds: string[]
  boundCornerIds: string[]
  boundCellIds: string[]
}

const initializeCellIdLists = (): CellIdList => ({
  cornerIds: [],
  colsIds: [],
  borderCellIds: [],
  borderRowIds: [],
  borderDataIds: [],
  borderCornerIds: [],
  boundCornerIds: [],
  boundCellIds: [],
})

const processCornerCells = (
  headerId: string,
  rows: string[],
  isFirstColumn: boolean,
  cellIdLists: CellIdList,
  getHeaderCellStateAtomById: any,
  cornerCell: any,
  theadMergeCellList: string[],
  setter: any,
) => {
  const cornerCancelList: (() => void)[] = []

  rows.forEach((rowsId, rowIndex) => {
    const cornerId = getCellId({
      rowId: headerId,
      columnId: rowsId,
    })
    cellIdLists.cornerIds.push(cornerId)

    const isLastRow = rowIndex === rows.length - 1
    if (isLastRow) {
      cellIdLists.borderCornerIds.push(cornerId)
    }
    if (isFirstColumn) {
      cellIdLists.boundCornerIds.push(cornerId)
    }

    cornerCancelList.push(
      setter(getHeaderCellStateAtomById(cornerId), (getter: any, prev: any) => {
        const corStyle = formatStyle(
          CellType.Corner,
          cornerCell,
          cornerId,
          [...theadMergeCellList, ...cellIdLists.borderCornerIds],
          { mergeCellIds: cellIdLists.boundCornerIds },
        )
        return {
          ...prev,
          style: mergeStyles([prev.style, corStyle]),
        }
      })!,
    )
  })

  return cornerCancelList
}

const processColumnCells = (
  headerId: string,
  columnIds: string[],
  isFirstColumn: boolean,
  cellIdLists: CellIdList,
  getHeaderCellStateAtomById: any,
  colCell: any,
  lastMergeCellList: string[],
  setter: any,
) => {
  const colCancelList: (() => void)[] = []

  columnIds.forEach((columnId, columnIndex) => {
    const cellId = getCellId({
      rowId: headerId,
      columnId,
    })

    if (cellIdLists.cornerIds.includes(cellId)) {
      return
    }

    if (isFirstColumn) {
      cellIdLists.borderCellIds.push(cellId)
    }
    if (columnIndex === columnIds.length - 1) {
      cellIdLists.boundCellIds.push(cellId)
    }

    cellIdLists.colsIds.push(cellId)
    colCancelList.push(
      setter(getHeaderCellStateAtomById(cellId), (getter: any, prev: any) => {
        const colStyle = formatStyle(CellType.Column, colCell, cellId, cellIdLists.borderCellIds, {
          mergeCellIds: [...cellIdLists.boundCellIds, ...lastMergeCellList],
        })
        return {
          ...prev,
          style: mergeStyles([prev.style, colStyle]),
        }
      })!,
    )
  })

  return colCancelList
}

const processDataCells = (
  rowBodyId: string,
  dataIds: string[],
  cellIdLists: CellIdList,
  getCellStateAtomById: any,
  dataCell: any,
  setter: any,
) => {
  const dataCancelList: (() => void)[] = []

  dataIds.forEach((dataId, dataIndex) => {
    const cellId = getCellId({
      rowId: rowBodyId,
      columnId: dataId,
    })

    const islastRow = dataIndex === dataIds.length - 1
    if (islastRow) {
      cellIdLists.borderDataIds.push(cellId)
    }

    dataCancelList.push(
      setter(getCellStateAtomById(cellId), (getter: any, prev: any) => {
        const dataStyle = formatStyle(CellType.Data, dataCell, cellId, cellIdLists.borderDataIds)
        return {
          ...prev,
          style: mergeStyles([prev.style, dataStyle]),
        }
      })!,
    )
  })

  return dataCancelList
}

const processRowCells = (
  rowBodyId: string,
  rows: string[],
  cellIdLists: CellIdList,
  getCellStateAtomById: any,
  rowCell: any,
  setter: any,
) => {
  const rowCancelList: (() => void)[] = []

  rows.forEach((rowsId, rowIndex) => {
    const rowId = getCellId({
      rowId: rowBodyId,
      columnId: rowsId,
    })

    const islastRow = rowIndex === rows.length - 1
    if (islastRow) {
      cellIdLists.borderRowIds.push(rowId)
    }

    rowCancelList.push(
      setter(getCellStateAtomById(rowId), (getter: any, prev: any) => {
        const rowStyle = formatStyle(CellType.Row, rowCell, rowId, cellIdLists.borderRowIds)
        return {
          ...prev,
          style: mergeStyles([prev.style, rowStyle]),
        }
      })!,
    )
  })

  return rowCancelList
}

export const initHeaderThemeAtom = atom(0, (getter, setter, theme: Theme) => {
  const headerIds = getter(headerRowIndexListAtom)
  const columnIds = getter(columnIndexListAtom)
  const rowBodyIds = getter(rowIndexListAtom)
  const rows = getter(fieldsRowsAtom)
  const theadMergeCellList = getter(theadMergeCellListAtom)?.map((item) => item.cellId) ?? []
  const { rowCell = {}, colCell = {}, dataCell = {}, cornerCell = {} } = theme
  const { getHeaderCellStateAtomById, getCellStateAtomById } = getter(basicAtom)
  const cellIdLists = initializeCellIdLists()
  const lastMergeCellList = findLastPerGroup(theadMergeCellList)

  const allCancelLists: (() => void)[][] = []

  // Process header rows
  headerIds.forEach((headerId, headerIndex) => {
    const isFirstColumn = headerIndex === 0
    const cornerCancelList = processCornerCells(
      headerId,
      rows,
      isFirstColumn,
      cellIdLists,
      getHeaderCellStateAtomById,
      cornerCell,
      theadMergeCellList,
      setter,
    )
    allCancelLists.push(cornerCancelList)

    const colCancelList = processColumnCells(
      headerId,
      columnIds,
      isFirstColumn,
      cellIdLists,
      getHeaderCellStateAtomById,
      colCell,
      lastMergeCellList,
      setter,
    )
    allCancelLists.push(colCancelList)
  })

  // Process data cells
  const dataIds = columnIds.filter((n) => !rows.includes(n)) ?? []

  rowBodyIds.forEach((rowBodyId) => {
    const dataCancelList = processDataCells(
      rowBodyId,
      dataIds,
      cellIdLists,
      getCellStateAtomById,
      dataCell,
      setter,
    )
    allCancelLists.push(dataCancelList)

    const rowCancelList = processRowCells(
      rowBodyId,
      rows,
      cellIdLists,
      getCellStateAtomById,
      rowCell,
      setter,
    )
    allCancelLists.push(rowCancelList)
  })

  return () => {
    allCancelLists.flat().forEach((cancel) => cancel())
  }
})
