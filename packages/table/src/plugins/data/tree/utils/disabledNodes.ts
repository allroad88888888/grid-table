interface Option {
  /**
   * 禁用节点
   */
  disNodeList?: Set<string>
  /**
   * 是否移除被禁用的树枝
   */
  // enableRemoveDisabledBranches?: boolean
  /**
   * 是否移除被禁用的头部树枝
   */
  enableRemoveDisabledTopBranches?: boolean
}

/**
 * 获取子节点下面所有节点
 * @param node
 * @param relation
 * @returns
 */
export function filterRelationByDisableNodes(
  root: string,
  relation: Map<string, string[]>,
  {
    disNodeList,

    enableRemoveDisabledTopBranches = false,
  }: Option = {},
) {
  const newRelation = new Map<string, string[]>()
  newRelation.set(root, [])
  function iterNode(parentNode: string, topIsDisabled: boolean = true) {
    const childrenNodeList = relation.get(parentNode)
    let levelIsDisabled = true
    let tempTopDisabled = topIsDisabled

    const tempParentNode = topIsDisabled ? root : parentNode
    if (relation.has(tempParentNode)) {
      relation.set(tempParentNode, [])
    }
    if (childrenNodeList) {
      if (enableRemoveDisabledTopBranches && topIsDisabled && disNodeList) {
        tempTopDisabled = childrenNodeList.every((node) => {
          return disNodeList?.has(node)
        })
      }
      childrenNodeList.forEach((cNode) => {
        const childrenIsDisabled = iterNode(cNode, tempTopDisabled)
        if (!childrenIsDisabled) {
          relation.get(tempParentNode)?.push(cNode)
        }
        if (disNodeList?.has(cNode) || childrenIsDisabled === false) {
          levelIsDisabled = false
        }
      })
    }

    return levelIsDisabled
  }
  iterNode(root)
  return newRelation
}
