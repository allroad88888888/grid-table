import type { UseDataProps } from './common'
import type { UseRowSelectionProps } from '../plugins/select/useRowSelection'
import type { CSSProperties } from 'react'
import type { VGridTableProps } from '@grid-table/core'
import type { CopyProps, UseRowNumberProps, UseSizeByColumnProps } from '../plugins'
import type { Store } from '@einfach/react'
import type { AutoColumnsSizeOptions } from '../plugins/calcSizeByColumn/measureColumnsWidth'
import type { OnColumnResizeCallback } from '../plugins/drag/useDrag'
import type { UseSortProps } from '../plugins/sort/types'
import type { UseFilterProps } from '../plugins/filter/types'
import type { UseRowExpandProps } from '../plugins/rowExpand/types'

/**
 * 表格多语言配置
 */
export type TableLocale = {
  // 列固定相关
  stickyLeft: string
  stickyRight: string
  unstick: string
  // 列隐藏相关
  hideColumn: string
  showHiddenColumns: string
}

/**
 * 默认中文多语言配置
 */
export const DEFAULT_TABLE_LOCALE: TableLocale = {
  stickyLeft: '固定到左边',
  stickyRight: '固定到右边',
  unstick: '取消固定',
  hideColumn: '隐藏当前列',
  showHiddenColumns: '显示隐藏列',
}

export type AntdTableProps = {
  className?: string
  style?: CSSProperties
  showHorizontalBorder?: boolean
  showVerticalBorder?: boolean
  /**
   * 行高度
   * @default 36
   */
  rowHeight?: number
  /**
   * 单元格默认宽度
   * @default 80
   */
  cellDefaultWidth?: number
  /**
   * @default false
   */
  loading?: boolean
  /**
   * 开启勾选框
   */
  rowSelection?: UseRowSelectionProps

  /**
   * 复制功能是否启用
   * @default false
   */
  // enableCopy?: boolean
  /**
   * 是否开启区域选中
   */
  enableSelectArea?: boolean
  /**
   * header 右键
   */
  enableHeadContextMenu?: boolean
  store?: Store
  /**
   * 是否启用表头拖拽调整列宽
   * @default true
   */
  enableColumnResize?: boolean

  /**
   * 列宽调整完成时的回调函数
   * 可用于缓存列宽到本地存储
   * @param columnId 被调整的列ID
   * @param newWidth 调整后的新宽度
   */
  onColumnResize?: OnColumnResizeCallback

  /**
   * 是否开启序号列
   * @default false
   */
  enableRowNumber?: boolean | UseRowNumberProps

  zebra?: boolean

  /**
   * 多语言配置，支持部分覆盖
   * @example
   * ```tsx
   * <Table locale={{ hideColumn: 'Hide Column', showHiddenColumns: 'Show Hidden' }} />
   * ```
   */
  locale?: Partial<TableLocale>

  gpuScroll?: boolean
  children?: React.ReactNode

  rowStayIndexList?: number[]

  /**
   * 是否启用 IntersectionObserver 延迟渲染（针对 RenderComponent）
   * @default true
   */
  enableIntersectionRender?: boolean
  /**
   * IntersectionObserver rootMargin，用于提前触发 cell 渲染
   * @default '1px'
   */
  intersectionRootMargin?: string
  /**
   * IntersectionObserver 交叉阈值
   * @default 0
   */
  intersectionThreshold?: number | number[]

  /**
   * 合并单元格高度超过容器时是否启用 sticky 定位
   * 开启后大跨度合并单元格会固定在可视区域内，防止溢出导致滚动抖动
   * @default true
   */
  stickyMergeCell?: boolean

  /**
   * 滚动速度阈值（px/s），超过此速度时延迟渲染
   * @default 800
   */
  speedThreshold?: number
  /**
   * 滚动停止/减速后的等待时间（ms）
   * @default 150
   */
  idleDelay?: number
} & CopyProps &
  UseSortProps &
  UseFilterProps &
  UseRowExpandProps &
  UseDataProps &
  Pick<
    VGridTableProps,
    | 'theadBaseSize'
    | 'rowBaseSize'
    | 'overRowCount'
    | 'overColumnCount'
    | 'columnBaseSize'
    | 'emptyComponent'
    | 'loadingComponent'
    | 'loading'
    | 'minColumnWidth'
    | 'maxColumnWidth'
  > &
  AutoColumnsSizeOptions &
  Pick<UseSizeByColumnProps, 'shrinkFromCurrent' | 'expandFromCurrent'>

export interface AntdTableRef {
  autoColumnsSize: () => void
}
