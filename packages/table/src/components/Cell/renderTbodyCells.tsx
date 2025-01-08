import type { CellsRenderProps, Position } from '@grid-table/core'
import { Fragment, useCallback } from 'react'
import { useAtomValue, useStore } from 'einfach-state'
import { mergeCellBodyMapAtom } from './stateMergeCells'
import type { CellId } from '@grid-table/basic'
import { columnIdShowListAtom, rowIdShowListAtom } from '@grid-table/basic'
import { getCellId, getRowIdAndColIdByCellId } from '../../utils'
import { DataCell } from './Cell'

export function useRenderTbodyCells() {
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

  const renderTBodyCells = useCallback(
    ({ columnIndexList, rowIndexList, getCellStyleByIndex }: CellsRenderProps) => {
      const renderCellIds = new Set<CellId>()

      return (
        <>
          {rowIndexList.map((rowIndex) => {
            return (
              <Fragment key={rowIndex}>
                {columnIndexList.map((columnIndex) => {
                  const { cellId, columnId, rowId } = getCellIdByPosition({
                    rowIndex,
                    columnIndex,
                  })
                  if (renderCellIds.has(cellId)) {
                    return null
                  }
                  renderCellIds.add(cellId)
                  return (
                    <DataCell
                      key={`${cellId}`}
                      columnIndex={columnIndex}
                      rowIndex={rowIndex}
                      style={getCellStyleByIndex(rowIndex, columnIndex)}
                      cellId={cellId}
                      columnId={columnId}
                      rowId={rowId}
                    />
                  )
                })}
              </Fragment>
            )
          })}
        </>
      )
    },
    [getCellIdByPosition],
  )

  return {
    renderTBodyCells,
  }
}
