import type { CSSProperties } from 'react'

export type RowId = string

export type ColumnId = RowId

export type CellId = string

export interface TableBasicProps {
  columns: ColumnId[]
  rows: RowId[]
}

interface CommonState {
  // width: number
  style?: CSSProperties
  className?: Set<string>
}

export interface ColumnItemState extends CommonState {}

export interface RowItemState extends CommonState {}

export interface CellState extends CommonState {}

export type PositionId = {
  rowId: RowId
  columnId: ColumnId
  columnIndex: number
  rowIndex: number
}
