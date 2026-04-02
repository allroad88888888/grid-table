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

/**
 * 比较两个二维数组是否相等
 */
function equal2DArray(arr1: CellId[][], arr2: CellId[][]): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i += 1) {
    const row1 = arr1[i]
    const row2 = arr2[i]
    if (row1.length !== row2.length) {
      return false
    }
    for (let j = 0; j < row1.length; j += 1) {
      if (row1[j] !== row2[j]) {
        return false
      }
    }
  }
  return true
}

const Empty: CellId[][] = []

/**
 * id → index 索引 Map，避免 findIndexList 的 O(n) 线性遍历
 * 只在对应 list 变化时重建
 */
const columnIdIndexMapAtom = atom((getter) => {
  const list = getter(columnIdShowListAtom)
  const map = new Map<string, number>()
  list.forEach((id, i) => map.set(id, i))
  return map
})

const rowTbodyIdIndexMapAtom = atom((getter) => {
  const list = getter(rowIdShowListAtom)
  const map = new Map<string, number>()
  list.forEach((id, i) => map.set(id, i))
  return map
})

const rowTheadIdIndexMapAtom = atom((getter) => {
  const list = getter(headerRowIndexListAtom)
  const map = new Map<string, number>()
  list.forEach((id, i) => map.set(id, i))
  return map
})

/**
 * 通过 id→index Map 直接 O(1) 查找，替代旧的线性遍历 findIndexList
 */
function lookupIndices(indexMap: Map<string, number>, ids: Set<string>): Set<number> {
  const res = new Set<number>()
  ids.forEach((id) => {
    const index = indexMap.get(id)
    if (index !== undefined) {
      res.add(index)
    }
  })
  return res
}

export const areaCellIdsAtom = selectAtom(
  atom<{
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

  const colIndexMap = getter(columnIdIndexMapAtom)
  const tbodyIndexMap = getter(rowTbodyIdIndexMapAtom)
  const theadIndexMap = getter(rowTheadIdIndexMapAtom)

  // 计算列范围
  const columnList = lookupIndices(colIndexMap, new Set([areaStart.columnId, areaEnd.columnId]))
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
      const theadRowList = lookupIndices(theadIndexMap, new Set([areaStart.rowId, areaEnd.rowId]))
      theadStartIndex = Math.min(...theadRowList)
      theadEndIndex = Math.max(...theadRowList)
    } else if (areaStartType === 'tbody') {
      const tbodyRowList = lookupIndices(tbodyIndexMap, new Set([areaStart.rowId, areaEnd.rowId]))
      tbodyStartIndex = Math.min(...tbodyRowList)
      tbodyEndIndex = Math.max(...tbodyRowList)
    }
  } else if (areaStartType === 'thead' && finalEndType === 'tbody') {
    // 从 thead 到 tbody
    const theadStartRowList = lookupIndices(theadIndexMap, new Set([areaStart.rowId]))
    const tbodyEndRowList = lookupIndices(tbodyIndexMap, new Set([areaEnd.rowId]))

    theadStartIndex = Math.min(...theadStartRowList)
    theadEndIndex = rowTheadIdList.length - 1

    tbodyStartIndex = 0
    tbodyEndIndex = Math.max(...tbodyEndRowList)
  } else if (areaStartType === 'tbody' && finalEndType === 'thead') {
    // 从 tbody 到 thead（从下往上拖拽）
    const tbodyStartRowList = lookupIndices(tbodyIndexMap, new Set([areaStart.rowId]))
    const theadEndRowList = lookupIndices(theadIndexMap, new Set([areaEnd.rowId]))

    tbodyStartIndex = 0
    tbodyEndIndex = Math.max(...tbodyStartRowList)

    theadStartIndex = Math.min(...theadEndRowList)
    theadEndIndex = rowTheadIdList.length - 1
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
  }),
  (prev) => prev,
  (prev, next) =>
    equal2DArray(prev.cellTbodyList, next.cellTbodyList) &&
    equal2DArray(prev.cellTheadList, next.cellTheadList),
)

export const areaColumnIdsAtom = atom<ColumnId[]>((getter) => {
  const areaStart = getter(areaStartAtom)
  const areaEnd = getter(areaEndAtom)

  if (areaStart.cellId === '-1') {
    return []
  }

  const columnIdList = getter(columnIdShowListAtom)
  const colIndexMap = getter(columnIdIndexMapAtom)
  const endPosition = areaEnd.cellId === '-1' ? areaStart : areaEnd

  const columnAreaList = lookupIndices(
    colIndexMap,
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
