import type { ComponentType, CSSProperties, ReactNode } from 'react'
import type { buildBasic } from './buildBasic'
import type { Position } from '@grid-table/core'

interface CommonState {
  style?: CSSProperties
  className?: Set<string>
}

export interface ColumnItemState extends CommonState {}

export interface RowItemState extends CommonState {}

export interface CellState extends CommonState {}

export interface TableOption {
  rowBaseSize?: number
  columnBaseSize?: number
  theadBaseSize?: number
  rowCount?: number
  columnCount?: number
}

export type BasicStore = ReturnType<typeof buildBasic>

export interface UseBasicInitProps extends TableOption {
  columnCount: number
  columnCalcSize: (index: number) => number
  rowCount: number
  rowCalcSize: (index: number) => number
  theadRowCount?: number
  /**
   * 没有就取 rowCalcSize
   * @param index
   * @returns
   */
  theadCalcSize?: (index: number) => number
}

export type EventsSet = {
  [P in keyof EventsItem]: Set<EventsItem[P]>
}

export type EventsCellSet = {
  [P in keyof EventsItem]: Set<
    (position: Position, ...args: Parameters<EventsItem[P]>) => ReturnType<EventsItem[P]>
  >
}

export interface EventsItem {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseOver: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onCopy: (e: React.ClipboardEvent<HTMLDivElement>) => void
}
