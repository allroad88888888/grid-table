import type { CellsRenderProps, Position } from '@grid-table/core'
import { DataCellThead } from './CellThead'
import { useCallback, useMemo, memo } from 'react'
import { useAtomValue, useStore } from '@einfach/react'
import { mergeCellTheadMapAtom } from './stateMergeCells'
import type { CellId } from '@grid-table/basic'
import { columnIdShowListAtom } from '@grid-table/basic'
import { getCellId, getHeaderRowId, getRowIdAndColIdByCellId } from '../../utils'

export const TheadCells = memo(function TheadCells({
  columnIndexList,
  rowIndexList,
  getCellStyleByIndex,
}: CellsRenderProps) {
  const store = useStore()
  const mergeCellMap = useAtomValue(mergeCellTheadMapAtom)
  const columnList = useAtomValue(columnIdShowListAtom, { store })

  const getCellIdByPosition = useCallback(
    (position: Position) => {
      const cellId = getCellId({
        rowId: getHeaderRowId(position.rowIndex),
        columnId: columnList[position.columnIndex],
      })

      if (mergeCellMap.has(cellId)) {
        const tCellId = mergeCellMap.get(cellId)!
        const [rowId, columnId] = getRowIdAndColIdByCellId(tCellId)
        return {
          cellId: tCellId,
          rowId,
          columnId,
        }
      }
      return {
        cellId,
        rowId: getHeaderRowId(position.rowIndex),
        columnId: columnList[position.columnIndex],
      }
    },
    [columnList, mergeCellMap],
  )

  const cellsToRender = useMemo(() => {
    const result: Array<{
      cellId: string
      columnId: string
      rowId: string
      rowIndex: number
      columnIndex: number
    }> = []
    const seen = new Set<CellId>()
    for (const rowIndex of rowIndexList) {
      for (const columnIndex of columnIndexList) {
        const { cellId, columnId, rowId } = getCellIdByPosition({
          rowIndex,
          columnIndex,
        })
        if (seen.has(cellId)) continue
        seen.add(cellId)
        result.push({ cellId, columnId, rowId, rowIndex, columnIndex })
      }
    }
    return result
  }, [rowIndexList, columnIndexList, getCellIdByPosition])

  return (
    <>
      {cellsToRender.map(({ cellId, columnId, rowId, rowIndex, columnIndex }) => (
        <DataCellThead
          key={cellId}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
          style={getCellStyleByIndex(rowIndex, columnIndex)}
          cellId={cellId}
          columnId={columnId}
          rowId={rowId}
        />
      ))}
    </>
  )
})
