interface Option {
  /**
   * 收起节点
   */
  collapseNodeSet?: Set<string>
  iteratorFn?: (node: string) => void
}

/**
 * 获取子节点下面所有节点
 * @param node
 * @param relation
 * @returns
 */
export function getChildrenNodeList(
  node: string,
  relation: Map<string, string[]>,
  { collapseNodeSet, iteratorFn }: Option = {},
) {
  const children: string[] = []
  function iterNode(parentNode: string) {
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
