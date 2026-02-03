import type { ComponentType, CSSProperties, ReactNode } from 'react'
import type { ColumnId, RowId } from './base'
import type { ScrollLogicalPosition } from './vList'

export interface Position {
  rowIndex: number
  columnIndex: number
}

interface BaseProps {
  rowIndex: number
  style?: React.CSSProperties
}

/**
 * 行 渲染参数
 */
export interface RowProps extends BaseProps {
  children?: ReactNode
}

/**
 *  单元格渲染参数
 */
export interface CellProps extends BaseProps {
  columnIndex: number
  cellId: string
  columnId: ColumnId
  rowId: RowId
  children?: ComponentType<Position>
}

/**
 * thead render 参数
 */
export interface THeaderProps {
  theadStyle?: React.CSSProperties
  /**
   * @default 1
   */
  theadRowCount?: number
  theadRowCalcSize: (index: number) => number
  theadBaseSize?: number
  theadClassName?: string
  theadHasRow?: boolean

  renderTheadCell: ComponentType<CellsRenderProps>
}

export interface TBodyRowProps {
  rowCount: number
  /**
   * @default 10
   */
  overRowCount?: number
  tbodyHasRow?: boolean
  renderTbodyCell: ComponentType<CellsRenderProps>
  /**
   * @default 1
   * grid布局 row base length
   */
  rowBaseSize?: number
  rowClassName?: string
  rowCalcSize: (index: number) => number
  rowCalcStyle?: (rowIndex: number) => React.CSSProperties | undefined
  rowStayIndexList?: number[]
}

export interface ColumnProps {
  /**
   * 列总数
   */
  columnCount: number
  /**
   * 计算列宽
   * @param index
   * @returns
   */
  columnCalcSize: (index: number) => number

  /**
   * @default 20
   */
  overColumnCount?: number
  /**
   * @default 1
   * grid布局 column base length
   */
  columnBaseSize?: number

  columnCalcStyle?: (columnIndex: number) => React.CSSProperties | undefined

  columnStayIndexList?: number[]
}

export interface VGridTableProps extends THeaderProps, TBodyRowProps, ColumnProps {
  /**
   * 请注意 对于整体宽度 小于外层容器宽度，必须传递width
   */
  style?: React.CSSProperties
  className?: string

  /**
   * 数据为空 渲染
   * @returns
   */
  emptyComponent?: ComponentType

  /**
   *
   */
  loadingComponent?: ComponentType<{ className?: string; style?: React.CSSProperties }>

  loading?: boolean

  children?: ReactNode

  tbodyChildren?: ReactNode

  theadChildren?: ReactNode

  onResize?: (param: ResizeParam) => void

  minColumnWidth?: number
  maxColumnWidth?: number
  columnPadding?: number

  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseOut?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onCopy?: (e: React.ClipboardEvent<HTMLDivElement>) => void
}

export interface ResizeParam {
  height: number
  width: number
}

export interface CellsRenderProps {
  rowIndexList: number[]
  columnIndexList: number[]
  getCellStyleByIndex: (rowIndex: number, columnIndex: number) => CSSProperties
}

export interface VGridTableRef {
  scrollTo: (
    rowIndex: number,
    columnIndex: number,
    options?: {
      behavior?: ScrollBehavior
      rowLogicalPosition?: ScrollLogicalPosition
      columnLogicalPosition?: ScrollLogicalPosition
    },
  ) => void
  scroll: (
    left?: number,
    top?: number,
    options?: {
      behavior?: ScrollBehavior
      leftLogicalPosition?: ScrollLogicalPosition
      rightLogicalPosition?: ScrollLogicalPosition
    },
  ) => void
  calculateColumnWidths: () =>
    | {
        columnWidths: number[]
        columnIndexList: number[]
      }
    | undefined
}
