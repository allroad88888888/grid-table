import { useAtomValue } from 'einfach-state'
import { useBasic } from './useBasic'

export function useGridIndex({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) {
  const { columnListAtom, rowListAtom } = useBasic()
  const columnList = useAtomValue(columnListAtom)
  const rowList = useAtomValue(rowListAtom)
  return {
    rowIndex: rowList[rowIndex],
    columnIndex: columnList[columnIndex],
  }
}
