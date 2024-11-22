import type { ColumnType, DataItem, UseDataProps } from '../types'
import { ROOT } from '../utils/const'
import type { RowId } from '@grid-table/basic'
import { getColumnId } from '../utils/getColumnId'

export function columnInit(columns: ColumnType[]) {
  const columnIdList: string[] = []
  const columnMap = new Map()
  columns.forEach((column) => {
    const columnId = getColumnId(column)
    columnIdList.push(columnId)
    columnMap.set(columnId, column)
  })

  return {
    columnMap,
    columnIdList,
  }
}

export function format<ItemInfo extends DataItem>(
  props: Pick<
    UseDataProps<ItemInfo>,
    'dataSource' | 'idProp' | 'parentProp' | 'root' | 'rowHeight'
  >,
  {
    iteratorFn,
  }: {
    iteratorFn: (rowId: RowId, info?: ItemInfo | null) => void
  },
) {
  const { dataSource, rowHeight } = props
  const { idProp, parentProp, root = ROOT } = props

  const relation = new Map<string, string[]>()
  relation.set(root, [])

  const infoMap = new Map<string, Record<string, any>>()

  const rowSizeMap = new Map<RowId, number>()

  dataSource.forEach((rowInfo, rowIndex) => {
    const path = idProp ? rowInfo[idProp] : `${rowIndex}`
    const parentId = parentProp ? rowInfo[parentProp] || root : root

    infoMap.set(path, rowInfo)

    if (!relation.has(parentId)) {
      relation.set(parentId, [])
    }
    relation.get(parentId)!.push(path)
  })

  const pathList: string[] = []
  const pathRelation = new Map<string, string[]>()
  const levelMap = new Map<string, number>()

  // 共享节点
  function iteratorNode(id: string, parentPath?: string, level: number = 0) {
    const children = relation.get(id) || []

    if (children.length > 0) {
      const childrenPathList: string[] = []
      pathRelation.set(parentPath ? parentPath : root, childrenPathList)
      children.forEach((cId) => {
        const cPath = `${parentPath ? `${parentPath}/` : ''}${cId}`
        levelMap.set(cPath, level)
        pathList.push(cPath)
        rowSizeMap.set(cPath, rowHeight!)
        iteratorFn(cPath, infoMap.get(cId) as ItemInfo)
        childrenPathList.push(cPath)
        iteratorNode(cId, cPath, level + 1)
      })
    }
  }
  iteratorNode(root, '')

  return {
    relation: pathRelation,
    showPathList: pathList,
    isTree: !!parentProp,
    levelMap,
    rowSizeMap,
  }
}
