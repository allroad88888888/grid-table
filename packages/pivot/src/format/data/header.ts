import type { DataConfig } from '../types'
import type { HeaderRelation } from './type'

export function getHeaderInfo(
  dataConfig: Pick<DataConfig, 'meta' | 'fields'>,
  headerRelation: HeaderRelation,
  realColumns: string[],
) {
  const { fields, meta } = dataConfig

  const { rows, columns } = fields

  /**
   * meta 字段-desc map
   */
  const metaFieldMap = new Map<string, string>()
  meta?.forEach(({ field, name }) => {
    metaFieldMap.set(field, name)
  })

  /**
   * 获取数据的header头
   * row-column反正看，这样就容易组成一个数组结构
   */
  const headerData: Record<string, any>[] = []
  const headerColumns = new Set<string>()

  function flattenRelation(
    propTree: HeaderRelation,
    parentObj: Record<string, any>,
    parentKey: number,
  ) {
    Object.values(propTree).forEach((item, index) => {
      const newObj = { ...parentObj }
      const tempKey = `headerColumn${parentKey}`
      headerColumns.add(tempKey)
      newObj[tempKey] = item.label
      if ('children' in item) {
        flattenRelation(item.children!, newObj, parentKey + 1)
        return
      }
      headerData.push(newObj)
    })
  }

  flattenRelation(headerRelation, {}, 0)
  /**
   * 获取 rows-header头
   */
  const tHeaderColumns = Array.from(headerColumns)
  rows.forEach((rowKey, index) => {
    const newObj: Record<string, string> = {}
    columns.forEach((t, index) => {
      newObj[tHeaderColumns[index]] = metaFieldMap.get(t)!
    })
    newObj[tHeaderColumns[tHeaderColumns.length - 1]] = metaFieldMap.get(rowKey)!

    headerData.splice(index, 0, newObj)
  })

  const realData: Record<string, string>[] = []
  tHeaderColumns.forEach((key, tIndex) => {
    realData[tIndex] = {}
  })
  headerData.forEach((item, propIndex) => {
    tHeaderColumns.forEach((key, tIndex) => {
      if (!realData[tIndex]) {
        realData[tIndex] = {}
      }
      const obj = realData[tIndex]
      obj[realColumns[propIndex]] = item[key]
    })
  })

  return {
    headerData: realData,
    headerColumns: tHeaderColumns,
  }
}
