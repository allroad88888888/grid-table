import { atom } from '@einfach/state'
import type { ColumnContextMenuOption } from './type'

/**
 * 显示的位置信息
 */
export const columnContextMenuPositionAtom = atom<
  { x: number; y: number; columnId: string } | undefined
>(undefined)

/**
 * 右键是否显示
 */
export const columnContextMenuVisibleAtom = atom((getter) => {
  return !!getter(columnContextMenuPositionAtom)
})

/**
 * 右键列表显示的组件
 */
export const columnContextMenuOptionsAtom = atom<ColumnContextMenuOption[]>([])
