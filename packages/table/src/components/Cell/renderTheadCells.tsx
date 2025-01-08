import type { CellsRenderProps, Position } from '@grid-table/core'
import { DataCellThead } from './CellThead'
import type { ReactNode } from 'react'
import { Fragment, useCallback } from 'react'
import { useAtomValue, useStore } from 'einfach-state'
import { mergeCellTheadMapAtom } from './stateMergeCells'
import type { CellId } from '@grid-table/basic'
import { columnIdShowListAtom } from '@grid-table/basic'
import { getCellId, getHeaderRowId, getRowIdAndColIdByCellId } from '../../utils'

export function useRenderTheadCells() {
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

  const renderTheadCells = useCallback<(props: CellsRenderProps) => ReactNode>(
    ({ columnIndexList, rowIndexList, getCellStyleByIndex }: CellsRenderProps) => {
      const renderCellIds = new Set<CellId>()
      return (
        <Fragment>
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
                    <DataCellThead
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
        </Fragment>
      )
    },
    [getCellIdByPosition],
  )

  return {
    renderTheadCells,
  }
}
