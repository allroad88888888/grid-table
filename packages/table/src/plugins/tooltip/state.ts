import { atom } from '@einfach/react'
import type { PositionId } from '@grid-table/basic'
import type { TooltipPlacement } from './types'
import type { ReactNode } from 'react'

export const activeTooltipAtom = atom<{
  position: PositionId
  content: ReactNode
  anchorRect: DOMRect
  placement: TooltipPlacement
} | null>(null)
