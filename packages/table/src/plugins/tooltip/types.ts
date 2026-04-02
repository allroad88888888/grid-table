import type { PositionId } from '@grid-table/basic'
import type { ComponentType, ReactNode } from 'react'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto'

export type TooltipContent<ItemInfo = Record<string, any>> = (
  value: unknown,
  rowData: ItemInfo,
  position: PositionId,
) => ReactNode

export type ColumnTooltipOptions<ItemInfo = Record<string, any>> = {
  tooltip?: boolean | ReactNode | TooltipContent<ItemInfo>
  tooltipPlacement?: TooltipPlacement
}

export type TooltipProps = {
  content: ReactNode
  anchorRect: DOMRect
  placement: TooltipPlacement
  maxWidth: number
}

export type UseTooltipProps = {
  enableAutoTooltip?: boolean
  tooltipShowDelay?: number
  tooltipHideDelay?: number
  tooltipMaxWidth?: number
  tooltipComponent?: ComponentType<TooltipProps>
}
