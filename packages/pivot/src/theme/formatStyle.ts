import type { CSSProperties } from 'react'
import {
  extractBorderRightProperties,
  extractBorderTopProperties,
  transformToBorderLeftBottom,
} from './utils/border'

export enum CellType {
  Corner = 'corner',
  Column = 'column',
  Row = 'row',
  Data = 'data',
}

export function formatStyle(
  cellType: CellType,
  style: CSSProperties,
  cellId: string,
  boundIds: string[],
  { mergeCellIds }: { mergeCellIds?: string[] } = { mergeCellIds: [] },
): CSSProperties {
  const commonStyle = transformToBorderLeftBottom(style)
  switch (cellType) {
    case CellType.Column: // 列
      //  考虑最上边框的样式
      const topStyle = extractBorderTopProperties(style) as CSSProperties
      const colStyle = boundIds.includes(cellId) ? { ...topStyle, ...commonStyle } : commonStyle
      //  考虑到合并的列，右边的边框的样式
      const rightColStyle = extractBorderRightProperties(style) as CSSProperties
      const lastColStyle = mergeCellIds?.includes(cellId)
        ? { ...rightColStyle, ...colStyle }
        : colStyle
      return lastColStyle
    case CellType.Corner: // 角
      //  考虑最右边的边框的样式
      const rightCorStyle = extractBorderRightProperties(style) as CSSProperties
      //  考虑最上边的边框的样式 有合并单元格的情况
      const topCorStyle = extractBorderTopProperties(style) as CSSProperties
      //  考虑是否是边界
      const cornerStyle = boundIds.includes(cellId)
        ? { ...rightCorStyle, ...commonStyle }
        : commonStyle
      const lastCornerStyle = mergeCellIds?.includes(cellId)
        ? { ...topCorStyle, ...cornerStyle }
        : cornerStyle
      return lastCornerStyle
    case CellType.Data:
      const dStyle = extractBorderRightProperties(style) as CSSProperties
      const dataStyle = boundIds.includes(cellId) ? { ...dStyle, ...commonStyle } : commonStyle
      return dataStyle
    case CellType.Row:
      const rightStyle = extractBorderRightProperties(style) as CSSProperties
      const rowStyle = boundIds.includes(cellId) ? { ...rightStyle, ...commonStyle } : commonStyle
      return rowStyle
    default:
      return style
  }
}
