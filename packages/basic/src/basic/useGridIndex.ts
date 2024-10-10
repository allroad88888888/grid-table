import { useAtomValue } from 'einfach-state'
import { useBasic } from './useBasic'

export function useGridIndex({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) {
  const { columnIndexListAtom, rowIndexListAtom } = useBasic()
  const columnList = useAtomValue(columnIndexListAtom)
  const rowList = useAtomValue(rowIndexListAtom)
  return {
    rowIndex: rowList[rowIndex],
    columnIndex: columnList[columnIndex],
  }
}
