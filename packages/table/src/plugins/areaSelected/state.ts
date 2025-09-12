import { getCellId } from '../../utils/getCellId'
import type { CellId, ColumnId, PositionId } from '@grid-table/basic'
import { columnIdShowListAtom, headerRowIndexListAtom, rowIdShowListAtom } from '@grid-table/basic'
import { atom, selectAtom } from '@einfach/react'
import { easyEqual } from '@einfach/utils'
import { columnsOptionAtom } from '../../stateColumn'
import { getColumnId } from '../../utils'

export const areaSelectEnableAtom = atom(false)

export const areaIsTouchAtom = atom<boolean>(false)

export const emptyPosition: PositionId = {
  rowId: ' -1',
  columnId: '-1',
  cellId: '-1',
}
export const areaStartAtom = atom<PositionId>(emptyPosition)
export const areaEndAtom = atom<PositionId>(emptyPosition)

type AreaStartType = 'thead' | 'tbody' | undefined

export const areaStartTypeAtom = atom<AreaStartType>(undefined)
export const areaEndTypeAtom = atom<AreaStartType>(undefined)

export const resetAreaAtom = atom(0, (getter, setter) => {
  setter(areaStartAtom, emptyPosition)
  setter(areaEndAtom, emptyPosition)
  setter(areaStartTypeAtom, undefined)
  setter(areaEndTypeAtom, undefined)
})

/**
 * 过滤哪些列 不能被选中
 */
export const areaDisabledColsAtom = selectAtom(
  columnsOptionAtom,
  (cols) => {
    return cols
      .filter((options) => {
        return options?.enableSelectArea === false
      })
      .map((options) => {
        return getColumnId(options)
      })
  },
  easyEqual,
)

const Empty: CellId[][] = []

export const areaCellIdsAtom = atom<{
  cellTbodyList: CellId[][]
  cellTheadList: CellId[][]
}>((getter) => {
  const areaStart = getter(areaStartAtom)
  let areaEnd = getter(areaEndAtom)
  const areaStartType = getter(areaStartTypeAtom)
  const areaEndType = getter(areaEndTypeAtom)

  // 如果没有开始位置或开始类型，则没有选中区域
  if (areaStart.cellId === '-1' || !areaStartType) {
    return { cellTbodyList: Empty, cellTheadList: Empty }
  }

  // 如果没有结束位置，则结束位置等于开始位置，结束类型等于开始类型
  if (areaEnd.cellId === '-1') {
    areaEnd = areaStart
  }
  const finalEndType = areaEndType || areaStartType

  const rowTheadIdList = getter(headerRowIndexListAtom)
  const rowTbodyIdList = getter(rowIdShowListAtom)
  const columnIdList = getter(columnIdShowListAtom)

  // 计算列范围
  const allColumnIds = new Set<string>([areaStart.columnId, areaEnd.columnId])
  const columnList = findIndexList(columnIdList, allColumnIds)
  const columnStartIndex = Math.min(...columnList)
  const columnEndIndex = Math.max(...columnList)

  const disabledCols = new Set(getter(areaDisabledColsAtom))
  const cellTbodyList: CellId[][] = []
  const cellTheadList: CellId[][] = []

  // 根据开始和结束类型确定行范围
  let theadStartIndex = -1,
    theadEndIndex = -1
  let tbodyStartIndex = -1,
    tbodyEndIndex = -1

  if (areaStartType === finalEndType) {
    // 同区域内的选择
    if (areaStartType === 'thead') {
      const theadRowList = findIndexList(rowTheadIdList, new Set([areaStart.rowId, areaEnd.rowId]))
      theadStartIndex = Math.min(...theadRowList)
      theadEndIndex = Math.max(...theadRowList)
    } else if (areaStartType === 'tbody') {
      const tbodyRowList = findIndexList(rowTbodyIdList, new Set([areaStart.rowId, areaEnd.rowId]))
      tbodyStartIndex = Math.min(...tbodyRowList)
      tbodyEndIndex = Math.max(...tbodyRowList)
    }
  } else if (areaStartType === 'thead' && finalEndType === 'tbody') {
    // 从 thead 到 tbody
    const theadStartRowList = findIndexList(rowTheadIdList, new Set([areaStart.rowId]))
    const tbodyEndRowList = findIndexList(rowTbodyIdList, new Set([areaEnd.rowId]))

    theadStartIndex = Math.min(...theadStartRowList)
    theadEndIndex = rowTheadIdList.length - 1 // thead 最后一行

    tbodyStartIndex = 0 // tbody 第一行
    tbodyEndIndex = Math.max(...tbodyEndRowList)
  } else if (areaStartType === 'tbody' && finalEndType === 'thead') {
    // 从 tbody 到 thead（从下往上拖拽）
    const tbodyStartRowList = findIndexList(rowTbodyIdList, new Set([areaStart.rowId]))
    const theadEndRowList = findIndexList(rowTheadIdList, new Set([areaEnd.rowId]))

    tbodyStartIndex = 0 // tbody 第一行 (row_0)
    tbodyEndIndex = Math.max(...tbodyStartRowList) // 开始行

    theadStartIndex = Math.min(...theadEndRowList) // 结束行
    theadEndIndex = rowTheadIdList.length - 1 // thead 最后一行 (head_row_1)
  }

  // 生成 thead 区域的 cellIds
  if (theadStartIndex >= 0 && theadEndIndex >= 0) {
    for (let j = theadStartIndex; j <= theadEndIndex; j += 1) {
      const childIds = []
      for (let i = columnStartIndex; i <= columnEndIndex; i += 1) {
        const colId = columnIdList[i]
        if (disabledCols.has(colId)) {
          continue
        }
        const cellId = getCellId({
          rowId: rowTheadIdList[j],
          columnId: colId,
        })
        childIds.push(cellId)
      }
      cellTheadList.push(childIds)
    }
  }

  // 生成 tbody 区域的 cellIds
  if (tbodyStartIndex >= 0 && tbodyEndIndex >= 0) {
    for (let j = tbodyStartIndex; j <= tbodyEndIndex; j += 1) {
      const childIds = []
      for (let i = columnStartIndex; i <= columnEndIndex; i += 1) {
        const colId = columnIdList[i]
        if (disabledCols.has(colId)) {
          continue
        }
        const cellId = getCellId({
          rowId: rowTbodyIdList[j],
          columnId: colId,
        })
        childIds.push(cellId)
      }
      cellTbodyList.push(childIds)
    }
  }

  return { cellTbodyList, cellTheadList }
})

export const areaColumnIdsAtom = atom<ColumnId[]>((getter) => {
  const areaStart = getter(areaStartAtom)
  const areaEnd = getter(areaEndAtom)

  if (areaStart.cellId === '-1') {
    return []
  }

  const columnIdList = getter(columnIdShowListAtom)
  const endPosition = areaEnd.cellId === '-1' ? areaStart : areaEnd

  const columnAreaList = findIndexList(
    columnIdList,
    new Set([areaStart.columnId, endPosition.columnId]),
  )
  const columnStartIndex = Math.min(...columnAreaList)
  const columnEndIndex = Math.max(...columnAreaList)

  const columnList: ColumnId[] = []
  for (let i = columnStartIndex; i <= columnEndIndex; i += 1) {
    columnList.push(columnIdList[i])
  }

  const disabledCols = new Set(getter(areaDisabledColsAtom))

  return columnList.filter((columnId) => !disabledCols.has(columnId))
})

function findIndexList(ids: string[], matchIds: Set<string>) {
  const res = new Set<number>()
  ids.some((id, index) => {
    if (matchIds.has(id)) {
      res.add(index)
    }
    if (matchIds.size === res.size) {
      return true
    }
    return false
  })

  return res
}
