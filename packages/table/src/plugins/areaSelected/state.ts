import { getCellId, getRowIdAndColIdByCellId } from '../../utils/getCellId'
import type { CellId, ColumnId, PositionId, RowId } from '@grid-table/basic'
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

export const AREA_CELL_IDS_MATERIALIZE_LIMIT = 100_000

export interface AreaSelectionRange {
  key: string
  columnStartIndex: number
  columnEndIndex: number
  columnCount: number
  theadStartIndex: number
  theadEndIndex: number
  theadRowCount: number
  tbodyStartIndex: number
  tbodyEndIndex: number
  tbodyRowCount: number
  totalCellCount: number
  columnIdList: ColumnId[]
  rowTheadIdList: RowId[]
  rowTbodyIdList: RowId[]
  columnIdIndexMap: Map<ColumnId, number>
  theadRowIdIndexMap: Map<RowId, number>
  tbodyRowIdIndexMap: Map<RowId, number>
  disabledCols: Set<ColumnId>
}

export interface AreaCellIdsResult {
  cellTbodyList: CellId[][]
  cellTheadList: CellId[][]
  totalCellCount: number
  isLimited: boolean
  rangeKey: string
}

const EmptyAreaCellIds: AreaCellIdsResult = {
  cellTbodyList: Empty,
  cellTheadList: Empty,
  totalCellCount: 0,
  isLimited: false,
  rangeKey: '',
}

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

function getRowCount(startIndex: number, endIndex: number): number {
  return startIndex >= 0 && endIndex >= 0 ? endIndex - startIndex + 1 : 0
}

function countSelectableColumns(
  columnIdList: ColumnId[],
  columnStartIndex: number,
  columnEndIndex: number,
  disabledCols: Set<ColumnId>,
) {
  let columnCount = 0
  const disabledInRange: ColumnId[] = []
  for (let i = columnStartIndex; i <= columnEndIndex; i += 1) {
    const columnId = columnIdList[i]
    if (disabledCols.has(columnId)) {
      disabledInRange.push(columnId)
      continue
    }
    columnCount += 1
  }
  return { columnCount, disabledKey: disabledInRange.join(',') }
}

export function isAreaCellSelected(
  range: AreaSelectionRange | null,
  areaType: 'thead' | 'tbody',
  rowId: RowId,
  columnId: ColumnId,
): boolean {
  if (!range || range.disabledCols.has(columnId)) {
    return false
  }

  const columnIndex = range.columnIdIndexMap.get(columnId)
  if (
    columnIndex === undefined ||
    columnIndex < range.columnStartIndex ||
    columnIndex > range.columnEndIndex
  ) {
    return false
  }

  const rowIndex =
    areaType === 'thead' ? range.theadRowIdIndexMap.get(rowId) : range.tbodyRowIdIndexMap.get(rowId)
  const rowStartIndex = areaType === 'thead' ? range.theadStartIndex : range.tbodyStartIndex
  const rowEndIndex = areaType === 'thead' ? range.theadEndIndex : range.tbodyEndIndex

  return rowIndex !== undefined && rowIndex >= rowStartIndex && rowIndex <= rowEndIndex
}

function buildAreaCellIds(range: AreaSelectionRange, areaType: 'thead' | 'tbody'): CellId[][] {
  const rowStartIndex = areaType === 'thead' ? range.theadStartIndex : range.tbodyStartIndex
  const rowEndIndex = areaType === 'thead' ? range.theadEndIndex : range.tbodyEndIndex
  const rowIdList = areaType === 'thead' ? range.rowTheadIdList : range.rowTbodyIdList

  if (rowStartIndex < 0 || rowEndIndex < 0) {
    return Empty
  }

  const cellList: CellId[][] = []
  for (let j = rowStartIndex; j <= rowEndIndex; j += 1) {
    const childIds = []
    for (let i = range.columnStartIndex; i <= range.columnEndIndex; i += 1) {
      const colId = range.columnIdList[i]
      if (range.disabledCols.has(colId)) {
        continue
      }
      childIds.push(
        getCellId({
          rowId: rowIdList[j],
          columnId: colId,
        }),
      )
    }
    cellList.push(childIds)
  }

  return cellList
}

function equalAreaRange(prev: AreaSelectionRange | null, next: AreaSelectionRange | null): boolean {
  return prev?.key === next?.key
}

function equalAreaCellIds(prev: AreaCellIdsResult, next: AreaCellIdsResult): boolean {
  if (
    prev.totalCellCount !== next.totalCellCount ||
    prev.isLimited !== next.isLimited ||
    prev.rangeKey !== next.rangeKey
  ) {
    return false
  }
  return (
    equal2DArray(prev.cellTbodyList, next.cellTbodyList) &&
    equal2DArray(prev.cellTheadList, next.cellTheadList)
  )
}

function throwVirtualSetIterationError(): never {
  throw new Error(
    '[AreaSelectedCellSet] selection exceeds AREA_CELL_IDS_MATERIALIZE_LIMIT; ' +
      'iteration is not supported. Use buildAreaCellIds(range) to materialize on demand, ' +
      'or query via .has(cellId) / isAreaCellSelected(range, ...).',
  )
}

class AreaSelectedCellSet extends Set<CellId> {
  constructor(
    private range: AreaSelectionRange,
    private areaType: 'thead' | 'tbody',
  ) {
    super()
  }

  override get size() {
    const rowCount = this.areaType === 'thead' ? this.range.theadRowCount : this.range.tbodyRowCount
    return rowCount * this.range.columnCount
  }

  override has(cellId: CellId) {
    const [rowId, columnId] = getRowIdAndColIdByCellId(cellId)
    return isAreaCellSelected(this.range, this.areaType, rowId, columnId)
  }

  override forEach(): void {
    throwVirtualSetIterationError()
  }
  override keys(): SetIterator<CellId> {
    throwVirtualSetIterationError()
  }
  override values(): SetIterator<CellId> {
    throwVirtualSetIterationError()
  }
  override entries(): SetIterator<[CellId, CellId]> {
    throwVirtualSetIterationError()
  }
  override [Symbol.iterator](): SetIterator<CellId> {
    throwVirtualSetIterationError()
  }

  get compareKey() {
    return `${this.areaType}:${this.range.key}`
  }
}

function equalAreaSelectedCellSet(prev: Set<CellId>, next: Set<CellId>): boolean {
  if (prev.size !== next.size) {
    return false
  }
  const prevVirtual = prev instanceof AreaSelectedCellSet
  const nextVirtual = next instanceof AreaSelectedCellSet
  if (prevVirtual && nextVirtual) {
    return prev.compareKey === next.compareKey
  }
  if (prevVirtual !== nextVirtual) {
    return false
  }
  for (const id of prev) {
    if (!next.has(id)) return false
  }
  return true
}

export const areaSelectionRangeAtom = selectAtom(
  atom<AreaSelectionRange | null>((getter) => {
    const areaStart = getter(areaStartAtom)
    let areaEnd = getter(areaEndAtom)
    const areaStartType = getter(areaStartTypeAtom)
    const areaEndType = getter(areaEndTypeAtom)

    // 如果没有开始位置或开始类型，则没有选中区域
    if (areaStart.cellId === '-1' || !areaStartType) {
      return null
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
    if (columnList.size === 0) {
      return null
    }
    const columnStartIndex = Math.min(...columnList)
    const columnEndIndex = Math.max(...columnList)

    const disabledCols = new Set(getter(areaDisabledColsAtom))

    // 根据开始和结束类型确定行范围
    let theadStartIndex = -1,
      theadEndIndex = -1
    let tbodyStartIndex = -1,
      tbodyEndIndex = -1

    if (areaStartType === finalEndType) {
      // 同区域内的选择
      if (areaStartType === 'thead') {
        const theadRowList = lookupIndices(theadIndexMap, new Set([areaStart.rowId, areaEnd.rowId]))
        if (theadRowList.size === 0) {
          return null
        }
        theadStartIndex = Math.min(...theadRowList)
        theadEndIndex = Math.max(...theadRowList)
      } else if (areaStartType === 'tbody') {
        const tbodyRowList = lookupIndices(tbodyIndexMap, new Set([areaStart.rowId, areaEnd.rowId]))
        if (tbodyRowList.size === 0) {
          return null
        }
        tbodyStartIndex = Math.min(...tbodyRowList)
        tbodyEndIndex = Math.max(...tbodyRowList)
      }
    } else if (areaStartType === 'thead' && finalEndType === 'tbody') {
      // 从 thead 到 tbody
      const theadStartRowList = lookupIndices(theadIndexMap, new Set([areaStart.rowId]))
      const tbodyEndRowList = lookupIndices(tbodyIndexMap, new Set([areaEnd.rowId]))

      if (theadStartRowList.size > 0) {
        theadStartIndex = Math.min(...theadStartRowList)
        theadEndIndex = rowTheadIdList.length - 1
      }

      if (tbodyEndRowList.size > 0) {
        tbodyStartIndex = 0
        tbodyEndIndex = Math.max(...tbodyEndRowList)
      }
    } else if (areaStartType === 'tbody' && finalEndType === 'thead') {
      // 从 tbody 到 thead（从下往上拖拽）
      const tbodyStartRowList = lookupIndices(tbodyIndexMap, new Set([areaStart.rowId]))
      const theadEndRowList = lookupIndices(theadIndexMap, new Set([areaEnd.rowId]))

      if (tbodyStartRowList.size > 0) {
        tbodyStartIndex = 0
        tbodyEndIndex = Math.max(...tbodyStartRowList)
      }

      if (theadEndRowList.size > 0) {
        theadStartIndex = Math.min(...theadEndRowList)
        theadEndIndex = rowTheadIdList.length - 1
      }
    }

    const { columnCount, disabledKey } = countSelectableColumns(
      columnIdList,
      columnStartIndex,
      columnEndIndex,
      disabledCols,
    )
    const theadRowCount = getRowCount(theadStartIndex, theadEndIndex)
    const tbodyRowCount = getRowCount(tbodyStartIndex, tbodyEndIndex)
    const totalCellCount = columnCount * (theadRowCount + tbodyRowCount)

    if (totalCellCount === 0) {
      return null
    }

    const key = [
      columnStartIndex,
      columnEndIndex,
      columnIdList[columnStartIndex],
      columnIdList[columnEndIndex],
      theadStartIndex,
      theadEndIndex,
      theadStartIndex >= 0 ? rowTheadIdList[theadStartIndex] : '',
      theadEndIndex >= 0 ? rowTheadIdList[theadEndIndex] : '',
      tbodyStartIndex,
      tbodyEndIndex,
      tbodyStartIndex >= 0 ? rowTbodyIdList[tbodyStartIndex] : '',
      tbodyEndIndex >= 0 ? rowTbodyIdList[tbodyEndIndex] : '',
      columnCount,
      disabledKey,
    ].join('|')

    return {
      key,
      columnStartIndex,
      columnEndIndex,
      columnCount,
      theadStartIndex,
      theadEndIndex,
      theadRowCount,
      tbodyStartIndex,
      tbodyEndIndex,
      tbodyRowCount,
      totalCellCount,
      columnIdList,
      rowTheadIdList,
      rowTbodyIdList,
      columnIdIndexMap: colIndexMap,
      theadRowIdIndexMap: theadIndexMap,
      tbodyRowIdIndexMap: tbodyIndexMap,
      disabledCols,
    }
  }),
  (prev) => prev,
  equalAreaRange,
)

export const areaCellIdsAtom = selectAtom(
  atom<AreaCellIdsResult>((getter) => {
    const range = getter(areaSelectionRangeAtom)

    if (!range) {
      return EmptyAreaCellIds
    }

    if (range.totalCellCount > AREA_CELL_IDS_MATERIALIZE_LIMIT) {
      return {
        cellTbodyList: Empty,
        cellTheadList: Empty,
        totalCellCount: range.totalCellCount,
        isLimited: true,
        rangeKey: range.key,
      }
    }

    return {
      cellTbodyList: buildAreaCellIds(range, 'tbody'),
      cellTheadList: buildAreaCellIds(range, 'thead'),
      totalCellCount: range.totalCellCount,
      isLimited: false,
      rangeKey: range.key,
    }
  }),
  (prev) => prev,
  equalAreaCellIds,
)

/**
 * 选中区域的 tbody cell 集合 —— 一次 setter 替代逐 cell setter
 * useCell 通过 selectAtom 读取，判断 cellId 是否在 Set 中
 */
export const areaSelectedTbodyCellSetAtom = selectAtom(
  atom<Set<CellId>>((getter) => {
    const range = getter(areaSelectionRangeAtom)
    const { cellTbodyList, isLimited } = getter(areaCellIdsAtom)

    if (!range) {
      return new Set<CellId>()
    }
    if (isLimited) {
      return new AreaSelectedCellSet(range, 'tbody')
    }

    const set = new Set<CellId>()
    cellTbodyList.forEach((row) => {
      row.forEach((cellId) => set.add(cellId))
    })
    return set
  }),
  (prev) => prev,
  equalAreaSelectedCellSet,
)

/**
 * 选中区域的 thead cell 集合
 */
export const areaSelectedTheadCellSetAtom = selectAtom(
  atom<Set<CellId>>((getter) => {
    const range = getter(areaSelectionRangeAtom)
    const { cellTheadList, isLimited } = getter(areaCellIdsAtom)

    if (!range) {
      return new Set<CellId>()
    }
    if (isLimited) {
      return new AreaSelectedCellSet(range, 'thead')
    }

    const set = new Set<CellId>()
    cellTheadList.forEach((row) => {
      row.forEach((cellId) => set.add(cellId))
    })
    return set
  }),
  (prev) => prev,
  equalAreaSelectedCellSet,
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
  if (columnAreaList.size === 0) {
    return []
  }
  const columnStartIndex = Math.min(...columnAreaList)
  const columnEndIndex = Math.max(...columnAreaList)

  const columnList: ColumnId[] = []
  for (let i = columnStartIndex; i <= columnEndIndex; i += 1) {
    columnList.push(columnIdList[i])
  }

  const disabledCols = new Set(getter(areaDisabledColsAtom))

  return columnList.filter((columnId) => !disabledCols.has(columnId))
})
