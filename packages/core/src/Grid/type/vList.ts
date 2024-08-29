import type { ComponentType, CSSProperties } from 'react'
import type { UseVScrollProps } from '../../Basic/type'

export interface ListProps extends UseVScrollProps {
  style?: CSSProperties
  className?: string
  children: ComponentType<{ index: number; style: CSSProperties }>
}

export interface ListItemProps {
  index: number
  style: CSSProperties
}
