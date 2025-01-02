import type { CellId, ColumnId, RowId } from '@grid-table/basic'

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
