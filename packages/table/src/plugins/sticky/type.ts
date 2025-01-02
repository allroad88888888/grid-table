import type { RowId } from '@grid-table/basic'

export interface UseStickyProps {
  topIdList?: RowId[]
  bottomIdList?: RowId[]
  direction?: 'row' | 'column'
  topSpace?: number
  /**
   *
   * @default
   * true
   */
  fixed?: boolean
}

export type StickyType = 'rowTop' | 'rowBottom' | 'columnTop' | 'columnBottom'
export type PositionType = 'left' | 'right' | 'top' | 'bottom'
