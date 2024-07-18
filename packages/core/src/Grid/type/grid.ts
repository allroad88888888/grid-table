import type { ComponentType, ReactNode } from 'react'
import type { ItemsRenderedProps } from '../../Basic/type'

interface BaseProps {
  rowIndex: number
  style: React.CSSProperties
}

/**
 * 行 渲染参数
 */
export interface RowProps extends BaseProps {
  children: ReactNode
}

/**
 *  单元格渲染参数
 */
export interface CellProps extends BaseProps {
  columnIndex: number
}

/**
 * thead render 参数
 */
interface THeaderProps {
  theadStyle?: React.CSSProperties
  /**
   * @default 1
   */
  theadRowCount?: number
  theadRowCalcSize: (index: number) => number
  theadBaseSize?: number
  theadTrComponent?: ComponentType<RowProps>
  theadCellComponent: ComponentType<CellProps>
  theadClass?: string
}

interface TBodyRowProps {
  rowCount: number
  /**
     * @default 10
     */
  overRowCount?: number
  /**
     * @default 1
     * grid布局 row base length
     */
  rowBaseSize?: number
  rowClassName?: string
  rowCalcSize: (index: number) => number
  rowCalcStyle?: (rowIndex: number) => React.CSSProperties | undefined
  rowStayIndexList?: number[]
  /**
     * trRender
     * @param param
     * @returns
     */
  tbodyTrComponent?: ComponentType<RowProps>
  onTbodyRowsRendered?: (param: ItemsRenderedProps) => any
}

interface ColumnProps {
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

export interface VGridTableProps
  extends THeaderProps, TBodyRowProps, ColumnProps {
  /**
     * 请注意 对于整体宽度 小于外层容器宽度，必须传递width
     */
  style?: React.CSSProperties
  className?: string
  /**
     * cell render
     * @param param
     * @returns
     */
  cellComponent: ComponentType<CellProps>
  /**
     * 数据为空 渲染
     * @returns
     */
  emptyComponent?: ComponentType

  children?: ReactNode

}
