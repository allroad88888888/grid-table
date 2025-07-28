import type { DataConfig } from '../types'
import { JoinKey, ValueJoinKey } from './const'
import { getHeaderInfo } from './header'
import { mergeCells } from './mergeCells'
import { mergeCellsForTree } from './mregeCellsForTree'
import type { HeaderRelation } from './type'

export function formatToTable(dataConfig: DataConfig) {
  const { fields, meta, data } = dataConfig

  const { rows, columns, values, valueInCols = true } = fields

  /**
   * meta 字段-desc map
   */
  const metaFieldMap = new Map<string, string>()
  meta?.forEach(({ field, name }) => {
    metaFieldMap.set(field, name)
  })

  /**
   * 最终数据会输出多少列
   * 当 valueInCols 为 false 时，需要添加一个字段来标识值类型
   */
  const realColumns = valueInCols ? [...rows] : [...rows, 'Values']

  /**
   * 缓存数据
   */
  const dataMap = new Map<string, any>()
  /**
   * 最终输出的数据
   */
  const transformedData: Record<string, any>[] = []

  /**
   * 存储新的列名
   */
  const newColumnNameMap = new Map<string, string>()
  // 列名索引 column0 column1 column2
  let columnIndex = 0

  /**
   * 存储 列头的 树形关系
   */
  // const columnPropTree: PropTree = new Map()
  const headerRelation: HeaderRelation = {}

  let indexId = 0

  data.forEach((item) => {
    const rowKey = rows
      .map((rowField) => {
        return item[rowField]
      })
      .join(JoinKey)

    // 当 valueInCols 为 false 时，values 字段作为行，columns 的值作为列
    if (!valueInCols) {
      const columnKey = columns.map((columnKey) => item[columnKey]).join(JoinKey)

      values.forEach((val) => {
        const extendedRowKey = `${rowKey}${JoinKey}${val}`

        if (!dataMap.has(extendedRowKey)) {
          const dataItem: Record<string, any> = {}
          indexId += 1

          // 复制行字段
          rows.forEach((rowField) => (dataItem[rowField] = item[rowField]))
          // 使用 'Values' 字段来标识值类型
          dataItem['Values'] = metaFieldMap.has(val) ? metaFieldMap.get(val)! : val

          dataMap.set(extendedRowKey, dataItem)
          transformedData.push(dataItem)
        }

        const dataItem = dataMap.get(extendedRowKey)!

        // 判断是否为整条数据
        const isFull = columns.every((colField) => colField in item)

        if (isFull) {
          // 直接使用 columnKey 作为列名（如 Q1, Q2）
          if (!realColumns.includes(columnKey)) {
            realColumns.push(columnKey)
          }

          // 设置该列的值
          dataItem[columnKey] = item[val]
        }
      })
      return
    }

    // 原有的 valueInCols: true 逻辑
    const columnKey = columns.map((columnKey) => item[columnKey]).join(JoinKey)

    /**
     * 每一条 rowKey 对应一条数据
     *
     * 设置rowKey到 新的数据
     */
    if (!dataMap.has(rowKey)) {
      const dataItem: Record<string, any> = {
        // id: indexId.toString(),
      }
      indexId += 1
      rows.forEach((rowField) => (dataItem[rowField] = item[rowField]))
      dataMap.set(rowKey, dataItem)
      transformedData.push(dataItem)
    }

    const dataItem = dataMap.get(rowKey)

    /**
     * 判断是否为整条数据，有的可能是汇总数据，暂不处理
     */
    const isFull = columns.every((colField) => colField in item)

    if (isFull) {
      values.forEach((val) => {
        const tempKey = `${columnKey}${ValueJoinKey}${val}`
        /**
         * 根据columns 获取新的列名
         */
        if (!newColumnNameMap.has(tempKey)) {
          const tName = `column${(columnIndex += 1)}`
          newColumnNameMap.set(tempKey, tName)
          realColumns.push(tName)
        }
        const newColumnName = newColumnNameMap.get(tempKey)!

        let prevHeaderRelation: HeaderRelation = headerRelation
        /**
         * 构建列的树形关系
         */
        columns.forEach((colField) => {
          const label = item[colField] as string

          if (!(label in prevHeaderRelation)) {
            prevHeaderRelation[label] = {
              label: label,
              columnName: colField,
              children: {},
            }
          }
          prevHeaderRelation = prevHeaderRelation[label]!.children as HeaderRelation
        })

        /**
         * 把columns的最后一列的值设置
         */
        prevHeaderRelation[newColumnName] = {
          label: metaFieldMap.has(val) ? metaFieldMap.get(val)! : val,
          columnName: newColumnName,
        }

        /**
         * 根据values-设置新列名的值
         */

        dataItem[newColumnName] = item[val]
      })
    }
    // TODO:汇总数据处理
  })

  /**
   * header头处理
   */
  const { headerData, headerColumns } = getHeaderInfo(
    {
      meta,
      fields,
    },
    headerRelation,
    realColumns,
  )

  /**
   * 单元格合并
   *
   * 0-1 列头 最后一行 需要保持不合并，rows最后一列 需要保持不跟前面的合并
   */
  const headerMergeCellList = mergeCells(realColumns, headerData.slice(0, -1))

  // const bodyMergeCelList = mergeCells(rows, transformedData)

  const bodyMergeCelList = mergeCellsForTree(rows, transformedData)

  return {
    data: transformedData,
    columns: realColumns,
    headerData,
    headerColumns,
    headerMergeCellList,
    bodyMergeCelList,
    newColumnNameMap,
    /**
     * for-test
     */
    columnPropTree: headerRelation,
    metaFieldMap,
  }
}
