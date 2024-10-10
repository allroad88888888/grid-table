import type { RowId } from '@grid-table/basic/src'

interface Option {
  /**
   * 收起节点
   */
  collapseNodeSet?: Set<RowId>
  iteratorFn?: (node: RowId) => void
}

/**
 * 获取子节点下面所有节点
 * @param node
 * @param relation
 * @returns
 */
export function getChildrenNodeList(
  node: RowId,
  relation: Map<RowId, RowId[]>,
  { collapseNodeSet, iteratorFn }: Option = {},
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
  iterNode(node)
  return children
}
