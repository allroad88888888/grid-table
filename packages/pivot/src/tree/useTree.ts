import type { TreeProps } from './type'
import { useTreeRow } from './useTreeRow'

export function useTree({ treeRow, treeColumn }: TreeProps) {
  useTreeRow({
    ...treeRow,
  })
}
