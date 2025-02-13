import type { RowId } from '@grid-table/basic'
import { ROOT } from './const'

interface Option {
  /**
   * 收起节点
   */
  collapseNodeSet?: Set<RowId>
  iteratorFn?: (node: RowId) => void
  startNode?: RowId
}

/**
 * 获取子节点下面所有节点
 * @param node
 * @param relation
 * @returns
 */
export function getChildrenNodeList(
  relation: Map<RowId, RowId[]>,
  { collapseNodeSet, iteratorFn, startNode = ROOT }: Option = { startNode: ROOT },
) {
  const children: RowId[] = []
  function iterNode(parentNode: RowId) {
    if (collapseNodeSet && collapseNodeSet.has(parentNode)) {
      return
    }
    const childrenNodeList = relation.get(parentNode)
    if (childrenNodeList) {
      childrenNodeList.forEach((cNode) => {
        children.push(cNode)
        iteratorFn?.(cNode)
        iterNode(cNode)
      })
    }
  }
  iterNode(startNode)
  return children
}
