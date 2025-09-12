import type { CSSProperties } from 'react'
import type { CopyAreas } from './types'

// 复制边框样式常量
export const COPY_BORDER_WIDTH = '2px'
export const COPY_BORDER_STYLE = 'dashed'
export const COPY_BORDER_COLOR = 'blue'

/**
 * 计算总的选中单元格数量
 */
export function getTotalSelectedCells(areas: CopyAreas): number {
  return areas.cellTheadList.length + areas.cellTbodyList.length
}

/**
 * 检查是否有选中的区域
 */
export function hasSelectedAreas(areas: CopyAreas | null | undefined): boolean {
  return !!(areas && (areas.cellTheadList.length > 0 || areas.cellTbodyList.length > 0))
}

/**
 * 创建复制边框样式
 */
export function createCopyBorderStyle({
  currentRowIndex,
  totalRowLength,
  columnIndex,
  columnLength,
  prevStyle,
}: {
  currentRowIndex: number
  totalRowLength: number
  columnIndex: number
  columnLength: number
  prevStyle: CSSProperties
}): CSSProperties {
  const nextStyle: CSSProperties = {
    ...prevStyle,
    // 显式清除简写属性以避免冲突
    // border: undefined,
    // borderTop: undefined,
    // borderBottom: undefined,
    // borderLeft: undefined,
    // borderRight: undefined,
    // // 使用非简写属性避免与可能存在的简写属性冲突
    // borderTopWidth: 0,
    // borderTopStyle: 'none',
    // borderTopColor: 'transparent',
    // borderBottomWidth: 0,
    // borderBottomStyle: 'none',
    // borderBottomColor: 'transparent',
    // borderLeftWidth: 0,
    // borderLeftStyle: 'none',
    // borderLeftColor: 'transparent',
    // borderRightWidth: 0,
    // borderRightStyle: 'none',
    // borderRightColor: 'transparent',
  }

  // 设置上边框：整个选择区域的第一行
  if (currentRowIndex === 0) {
    nextStyle.borderTopWidth = COPY_BORDER_WIDTH
    nextStyle.borderTopStyle = COPY_BORDER_STYLE
    nextStyle.borderTopColor = COPY_BORDER_COLOR
  }

  // 设置下边框：整个选择区域的最后一行
  if (currentRowIndex === totalRowLength - 1) {
    nextStyle.borderBottomWidth = COPY_BORDER_WIDTH
    nextStyle.borderBottomStyle = COPY_BORDER_STYLE
    nextStyle.borderBottomColor = COPY_BORDER_COLOR
  }

  // 设置左边框：第一列
  if (columnIndex === 0) {
    nextStyle.borderLeftWidth = COPY_BORDER_WIDTH
    nextStyle.borderLeftStyle = COPY_BORDER_STYLE
    nextStyle.borderLeftColor = COPY_BORDER_COLOR
  }

  // 设置右边框：最后一列
  if (columnIndex === columnLength - 1) {
    nextStyle.borderRightWidth = COPY_BORDER_WIDTH
    nextStyle.borderRightStyle = COPY_BORDER_STYLE
    nextStyle.borderRightColor = COPY_BORDER_COLOR
  }

  return nextStyle
}

/**
 * 隐藏的复制文本框样式
 */
export const HIDDEN_TEXTAREA_STYLE: CSSProperties = {
  width: 0,
  height: 0,
  zIndex: -1,
  position: 'absolute',
  right: -1,
  bottom: -1,
  resize: 'none',
  border: 'none',
  padding: 0,
  margin: 0,
}
