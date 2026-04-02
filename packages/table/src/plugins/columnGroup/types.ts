import type { ColumnType } from '../../types/column'
import type { ReactNode } from 'react'

export type GroupColumnType<ItemInfo = Record<string, any>> = ColumnType<ItemInfo> & {
  children?: GroupColumnType<ItemInfo>[]
  groupAlign?: 'left' | 'center' | 'right'
  collapsible?: boolean
  collapsedWidth?: number
  collapsedTitle?: ReactNode
}

export type HeaderCell = {
  column: GroupColumnType
  rowIndex: number
  colStart: number
  colSpan: number
  rowSpan: number
}

export type UseColumnGroupProps<ItemInfo = Record<string, any>> = {
  groupColumns?: GroupColumnType<ItemInfo>[]
}
