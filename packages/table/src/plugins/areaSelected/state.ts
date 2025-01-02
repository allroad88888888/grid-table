import { getCellId } from '../../utils/getCellId'
import type { CellId, ColumnId, PositionId } from '@grid-table/basic'
import { columnIdShowListAtom, rowIdShowListAtom } from '@grid-table/basic'
import { atom } from 'einfach-state'

export const areaSelectEnableAtom = atom(false)

export const emptyPosition: PositionId = {
  rowId: ' -1',
  columnId: '-1',
  cellId: '-1',
}
export const areaStartAtom = atom<PositionId>(emptyPosition)
export const areaEndAtom = atom<PositionId>(emptyPosition)

export const areaCellIdsAtom = atom<CellId[][]>((getter) => {
  const areaStart = getter(areaStartAtom)
  const areaEnd = getter(areaEndAtom)

  if (areaStart.cellId === '-1' || areaEnd.cellId === '-1') {
    return []
  }

  const rowIdList = getter(rowIdShowListAtom)
  const columnIdList = getter(columnIdShowListAtom)

  const columnList = findIndexList(columnIdList, new Set([areaStart.columnId, areaEnd.columnId]))
  const rowList = findIndexList(rowIdList, new Set([areaStart.rowId, areaEnd.rowId]))

  const rowStartIndex = Math.min(...rowList)
  const rowEndIndex = Math.max(...rowList)
  const columnStartIndex = Math.min(...columnList)
  const columnEndIndex = Math.max(...columnList)

  const cellList: CellId[][] = []
  for (let j = rowStartIndex; j <= rowEndIndex; j += 1) {
    const childIds = []
    for (let i = columnStartIndex; i <= columnEndIndex; i += 1) {
      const cellId = getCellId({
        rowId: rowIdList[j],
        columnId: columnIdList[i],
      })
      childIds.push(cellId)
    }
    cellList.push(childIds)
  }

  return cellList
})

export const areaColumnIdsAtom = atom<ColumnId[]>((getter) => {
  const areaStart = getter(areaStartAtom)
  const areaEnd = getter(areaEndAtom)

  if (areaStart.cellId === '-1') {
    return []
  }
  const columnIdList = getter(columnIdShowListAtom)
  const columnAreaList = findIndexList(
    columnIdList,
    new Set([areaStart.columnId, areaEnd.columnId]),
  )
  const columnStartIndex = Math.min(...columnAreaList)
  const columnEndIndex = Math.max(...columnAreaList)

  const columnList: ColumnId[] = []
  for (let i = columnStartIndex; i <= columnEndIndex; i += 1) {
    columnList.push(columnIdList[i])
  }

  return columnList
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