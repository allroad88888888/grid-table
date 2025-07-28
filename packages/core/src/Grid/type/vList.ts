import type { ComponentType, CSSProperties, RefObject } from 'react'
import type { UseVScrollProps } from '../../Basic/type'

export type ScrollLogicalPosition = 'start' | 'center' | 'end' | 'nearest'

export interface ListProps extends UseVScrollProps {
  style?: CSSProperties
  className?: string
  children: ComponentType<{ index: number; style: CSSProperties; isPending?: boolean }>
  /**
   * @default div
   */
  tag?: 'div' | 'ul'
  'data-testid'?: string
  scrollRef?: RefObject<HTMLDivElement>
}

export interface ListItemProps {
  index: number
  style: CSSProperties
}

export interface VGridListRef {
  scrollTo: (
    index: number,
    options?: {
      behavior?: ScrollBehavior
      logicalPosition?: ScrollLogicalPosition
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
}
