import { atom } from '@einfach/react'
import type { CellId } from '@grid-table/basic'
import type { FocusPosition } from './types'

/** 当前活动单元格 */
export const focusPositionAtom = atom<FocusPosition | null>(null)

/** 键盘选区锚点（Shift 选区的起点） */
export const selectionAnchorAtom = atom<FocusPosition | null>(null)

/**
 * 生成单元格的 DOM id（供 aria-activedescendant 引用）
 */
export function getCellDomId(cellId: CellId): string {
  return `grid-cell-${cellId}`
}
