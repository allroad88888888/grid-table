import type { DataConfig } from '../types'
import type { HeaderRelation } from './type'

export function getHeaderInfo(
  dataConfig: Pick<DataConfig, 'meta' | 'fields'>,
  headerRelation: HeaderRelation,
  realColumns: string[],
) {
  const { fields, meta } = dataConfig

  const { rows, columns, values, valueInCols = true } = fields

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

  // 只有当 valueInCols 为 true 时才展开 headerRelation
  if (valueInCols) {
    flattenRelation(headerRelation, {}, 0)
  }

  /**
   * 获取 rows-header头
   */
  const tHeaderColumns = Array.from(headerColumns)

  if (valueInCols) {
    // 当 valueInCols 为 true 时的原有逻辑
    rows.forEach((rowKey, index) => {
      const newObj: Record<string, string> = {}
      columns.forEach((t, index) => {
        newObj[tHeaderColumns[index]] = metaFieldMap.has(t) ? metaFieldMap.get(t)! : t
      })
      newObj[tHeaderColumns[tHeaderColumns.length - 1]] = metaFieldMap.has(rowKey)
        ? metaFieldMap.get(rowKey)!
        : rowKey

      headerData.splice(index, 0, newObj)
    })
  } else {
    // 当 valueInCols 为 false 时：为 realColumns 中的每一列生成表头信息
    const headerObj: Record<string, string> = {}

    realColumns.forEach((columnKey) => {
      if (metaFieldMap.has(columnKey)) {
        // 如果在 meta 中有定义，使用 meta 中的名称（针对 rows 字段）
        headerObj[columnKey] = metaFieldMap.get(columnKey)!
      } else if (columnKey === 'Values') {
        // 特殊处理 'Values' 字段，使用第一个 value 的名称
        const firstValue = values[0]
        headerObj[columnKey] = metaFieldMap.has(firstValue)
          ? metaFieldMap.get(firstValue)!
          : firstValue
      } else {
        // 对于其他列（比如 columns 的实际值如 Q1、Q2），直接使用原始值
        headerObj[columnKey] = columnKey
      }
    })

    headerData.push(headerObj)

    // 确保有一个 headerColumn
    headerColumns.add('headerColumn0')
  }

  // 当 valueInCols 为 false 时，重新构建 tHeaderColumns
  const finalHeaderColumns = valueInCols ? tHeaderColumns : Array.from(headerColumns)

  let realData: Record<string, string>[]

  if (valueInCols) {
    // 原有的 valueInCols: true 逻辑
    realData = []
    finalHeaderColumns.forEach((key, tIndex) => {
      realData[tIndex] = {}
    })
    headerData.forEach((item, propIndex) => {
      finalHeaderColumns.forEach((key, tIndex) => {
        if (!realData[tIndex]) {
          realData[tIndex] = {}
        }
        const obj = realData[tIndex]
        obj[realColumns[propIndex]] = item[key]
      })
    })
  } else {
    // 对于 valueInCols: false，直接使用 headerData，因为结构已经正确
    realData = headerData
  }

  return {
    headerData: realData,
    headerColumns: finalHeaderColumns,
  }
}
