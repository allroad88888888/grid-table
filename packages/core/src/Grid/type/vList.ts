import type { ComponentType, CSSProperties } from 'react'
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
}

export interface ListItemProps {
  index: number
  style: CSSProperties
}

export interface VGridListRef {
  scrollTo: (
    index: number,
    { behavior }: { behavior?: ScrollBehavior; logicalPosition?: ScrollLogicalPosition },
  ) => void
}
