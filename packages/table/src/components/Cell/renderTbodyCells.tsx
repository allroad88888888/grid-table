import type { CellsRenderProps } from '@grid-table/core'
import { useMemo, memo } from 'react'
import { useAtomValue, useStore } from '@einfach/react'
import {
  mergeCellBodyAnchorSetAtom,
  mergeCellBodyMapAtom,
  tbodyMergeCellListAtom,
} from './stateMergeCells'
import { columnIdShowListAtom, rowIdShowListAtom } from '@grid-table/basic'
import { getCellId, getRowIdAndColIdByCellId } from '../../utils/getCellId'
import { DataCell } from './Cell'

export const TbodyCells = memo(function TbodyCells({
  columnIndexList,
  rowIndexList,
  getCellStyleByIndex,
}: CellsRenderProps) {
  const store = useStore()
  const mergeCellMap = useAtomValue(mergeCellBodyMapAtom)
  const mergeCellAnchorSet = useAtomValue(mergeCellBodyAnchorSetAtom)
  const mergeCellList = useAtomValue(tbodyMergeCellListAtom)
  const columnList = useAtomValue(columnIdShowListAtom, { store })
  const rowList = useAtomValue(rowIdShowListAtom, { store })
  const rowIndexMap = useMemo(() => {
    return new Map(rowList.map((rowId, index) => [rowId, index]))
  }, [rowList])
  const columnIndexMap = useMemo(() => {
    return new Map(columnList.map((columnId, index) => [columnId, index]))
  }, [columnList])

  const ordinaryCellsToRender = useMemo(() => {
    const result: Array<{
      cellId: string
      columnId: string
      rowId: string
      rowIndex: number
      columnIndex: number
    }> = []

    for (const rowIndex of rowIndexList) {
      for (const columnIndex of columnIndexList) {
        const rowId = rowList[rowIndex]
        const columnId = columnList[columnIndex]
        const cellId = getCellId({ rowId, columnId })

        if (mergeCellAnchorSet.has(cellId) || mergeCellMap.has(cellId)) {
          continue
        }

        result.push({
          cellId,
          columnId,
          rowId,
          rowIndex,
          columnIndex,
        })
      }
    }
    return result
  }, [columnList, mergeCellAnchorSet, mergeCellMap, rowIndexList, rowList, columnIndexList])

  const mergeOverlayCellsToRender = useMemo(() => {
    if (!mergeCellList || mergeCellList.length === 0) return []

    const visibleRowSet = new Set(rowIndexList.map((rowIndex) => rowList[rowIndex]))
    const visibleColumnSet = new Set(columnIndexList.map((columnIndex) => columnList[columnIndex]))

    return mergeCellList.flatMap(({ cellId, rowIdList = [], colIdList = [] }) => {
      const [anchorRowId, anchorColumnId] = getRowIdAndColIdByCellId(cellId)
      const mergedRowIds = [anchorRowId, ...rowIdList].filter((rowId) => rowIndexMap.has(rowId))
      const mergedColumnIds = [anchorColumnId, ...colIdList].filter((columnId) =>
        columnIndexMap.has(columnId),
      )

      if (mergedRowIds.length === 0 || mergedColumnIds.length === 0) return []
      if (mergedRowIds.length === 1 && mergedColumnIds.length === 1) return []

      const hasVisibleRows = mergedRowIds.some((rowId) => visibleRowSet.has(rowId))
      const hasVisibleColumns = mergedColumnIds.some((columnId) => visibleColumnSet.has(columnId))
      if (!hasVisibleRows || !hasVisibleColumns) return []

      const positionRowId = mergedRowIds[0]
      const positionColumnId = mergedColumnIds[0]
      const rowIndex = rowIndexMap.get(positionRowId)
      const columnIndex = columnIndexMap.get(positionColumnId)

      if (rowIndex === undefined || columnIndex === undefined) return []

      return [
        {
          cellId,
          columnId: anchorColumnId,
          rowId: anchorRowId,
          rowIndex,
          columnIndex,
        },
      ]
    })
  }, [columnIndexList, columnIndexMap, columnList, mergeCellList, rowIndexList, rowIndexMap, rowList])

  return (
    <>
      {ordinaryCellsToRender.map(({ cellId, columnId, rowId, rowIndex, columnIndex }) => (
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
      {mergeOverlayCellsToRender.map(({ cellId, columnId, rowId, rowIndex, columnIndex }) => (
        <DataCell
          key={`merge-overlay-${cellId}`}
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
