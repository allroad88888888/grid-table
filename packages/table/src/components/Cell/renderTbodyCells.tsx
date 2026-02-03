import type { CellsRenderProps, Position } from '@grid-table/core'
import { useCallback, useMemo, memo } from 'react'
import { useAtomValue, useStore } from '@einfach/react'
import { mergeCellBodyMapAtom } from './stateMergeCells'
import type { CellId } from '@grid-table/basic'
import { columnIdShowListAtom, rowIdShowListAtom } from '@grid-table/basic'
import { getCellId, getRowIdAndColIdByCellId } from '../../utils'
import { DataCell } from './Cell'

export const TbodyCells = memo(function TbodyCells({
  columnIndexList,
  rowIndexList,
  getCellStyleByIndex,
}: CellsRenderProps) {
  const store = useStore()
  const mergeCellMap = useAtomValue(mergeCellBodyMapAtom)
  const columnList = useAtomValue(columnIdShowListAtom, { store })
  const rowList = useAtomValue(rowIdShowListAtom, { store })

  const getCellIdByPosition = useCallback(
    (position: Position) => {
      const cellId = getCellId({
        rowId: rowList[position.rowIndex],
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
        rowId: rowList[position.rowIndex],
        columnId: columnList[position.columnIndex],
      }
    },
    [columnList, mergeCellMap, rowList],
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
        <DataCell
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
