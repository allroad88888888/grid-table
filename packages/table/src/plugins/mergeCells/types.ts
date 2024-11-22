import type { CellId, ColumnId, RowId } from '../../../../basic/src'

export interface MergeCellsItem {
  rowSpan?: number
  cloSpan?: number
  rowIndex: number
  columnIndex: number
}

export interface TableMergeCellsProps {
  cellList?: MergeCellsItem[]
}

export interface MergeCellIdItem {
  rowIdList?: RowId[]
  colIdList?: ColumnId[]
  cellId: CellId
}
