import { atom } from '@einfach/react'
import type { CellId } from '@grid-table/basic'
import type { MergeCellIdItem } from './type'
import { getCellId, getRowIdAndColIdByCellId } from '../../utils/getCellId'

export const theadMergeCellListAtom = atom<MergeCellIdItem[] | undefined>(undefined)
export const tbodyMergeCellListAtom = atom<MergeCellIdItem[] | undefined>(undefined)

export function mergeCellsToMap(list: MergeCellIdItem[] | undefined): Map<CellId, CellId> {
  const resMap = new Map<CellId, CellId>()

  list?.forEach(({ cellId, rowIdList, colIdList }) => {
    const [curRowId, curColId] = getRowIdAndColIdByCellId(cellId)
    const mergedRowIds = [curRowId, ...(rowIdList || [])]
    const mergedColIds = [curColId, ...(colIdList || [])]

    mergedRowIds.forEach((rowId, rowIndex) => {
      mergedColIds.forEach((colId, colIndex) => {
        if (rowIndex === 0 && colIndex === 0) {
          return
        }

        const tCellId = getCellId({
          rowId,
          columnId: colId,
        })
        resMap.set(tCellId, cellId)
      })
    })
  })

  return resMap
}

/**
 * thead合并单元格atom
 * 比如说  单元格 1-A 1-B 合并成1A   1B对应1A
 */
export const mergeCellTheadMapAtom = atom((getter) => {
  return mergeCellsToMap(getter(theadMergeCellListAtom))
})

/**
 * tbody合并单元格atom
 * 比如说  单元格 1-A 1-B 合并成1A   1B对应1A
 */
export const mergeCellBodyMapAtom = atom((getter) => {
  return mergeCellsToMap(getter(tbodyMergeCellListAtom))
})

export const mergeCellBodyAnchorSetAtom = atom((getter) => {
  const anchorSet = new Set<CellId>()
  getter(tbodyMergeCellListAtom)?.forEach(({ cellId }) => {
    anchorSet.add(cellId)
  })
  return anchorSet
})
