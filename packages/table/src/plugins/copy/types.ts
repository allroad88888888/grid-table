import type { CellId } from '@grid-table/basic'

export interface CopyProps {
  copyTbodyCellInfo?: (cellIds: CellId[][]) => string[][] | Promise<string[][]>

  /**
   * 是否开启复制功能
   * @default false
   */
  enableCopy?: boolean
}

export interface CopyAreas {
  cellTheadList: CellId[][]
  cellTbodyList: CellId[][]
  totalCellCount?: number
  isLimited?: boolean
}
