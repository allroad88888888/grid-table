import { CellId, getCellId, MergeCellIdItem } from '@grid-table/view'

export const RowIdKey = 'gird_table_row_id'
/**
 * 将包含嵌套数组的数据拍平为单层数组，并收集所有列名
 *
 * 性能优化要点：
 * 1. 减少重复的 Array.isArray 检查和类型转换，只在循环开始前处理一次
 * 2. 预估结果数组长度，减少动态扩容（虽然 JS 引擎优化较好，但在数据量大时仍有意义）
 * 3. 缓存 arrayKeys 的字符串形式，避免重复转换
 * 4. 优化 baseRecord 的生成，避免在内层循环中重复 delete 操作
 * 5. 优化 columnsSet 的操作，尽量减少 Set.add 的调用次数（虽然 Set.add 本身很快，但在大数据量循环中也有开销）
 *
 * @param list 源数据列表
 * @param arrayKeys 需要展开的数组字段名列表
 * @param options 配置项
 * @param options.joinKey 连接键，默认为 '||'
 * @param options.columns 需要返回的列名列表，如果提供则只返回这些列
 * @returns { data: any[], columns: string[], bodyMergeCells: MergeCellIdItem[], maxExpandedRows: number } 包含拍平后的数据列表、列名、合并单元格信息和单条数据最大扩展行数
 */
export function flattenData<T extends Record<string, any>>(
  list: T[],
  arrayKeys: (keyof T)[],
  { joinKey = '||', columns }: { joinKey?: string; columns?: string[] } = {},
): { data: any[]; columns: string[]; bodyMergeCells: MergeCellIdItem[]; maxExpandedRows: number } {
  // 预处理 arrayKeys 字符串
  const keysStr = arrayKeys.map((k) => String(k))
  const arrayKeysLen = keysStr.length
  const targetColumnsSet = columns ? new Set(columns) : null

  // 估算结果数组大小（可选优化，假设平均每个数组扩展 5 倍）
  const result: any[] = []
  const columnsSet = new Set<string>()

  const cellsMap = new Map<CellId, MergeCellIdItem>()

  // 记录单条数据最大扩展行数
  let maxExpandedRows = 0

  const listLen = list.length
  let rowIndex = 0
  for (let idx = 0; idx < listLen; idx++) {
    const record = list[idx]

    // 1. 获取所有数组并计算最大长度
    // 使用数组而不是对象存储临时数组引用，避免对象属性查找开销
    const currentArrays: any[][] = new Array(arrayKeysLen)
    let maxLen = 0

    for (let k = 0; k < arrayKeysLen; k++) {
      const key = arrayKeys[k]
      const val = record[key]
      // 缓存检查结果
      const arr: any[] = Array.isArray(val) ? (val as any[]) : []
      currentArrays[k] = arr
      const len = arr.length
      if (len > maxLen) {
        maxLen = len
      }
    }

    if (maxLen === 0) {
      maxLen = 1
    }

    // 更新最大扩展行数
    if (maxLen > maxExpandedRows) {
      maxExpandedRows = maxLen
    }

    // 2. 准备基础数据
    // 优化：不使用 delete，而是构建一个新的对象只包含非数组字段
    // 如果字段较多，delete 性能通常比 pick 差，且破坏 V8 隐藏类优化
    const baseRecord: Record<string, any> = {}
    // 缓存所有键
    const recordKeys = Object.keys(record)
    for (let k = 0; k < recordKeys.length; k++) {
      const key = recordKeys[k]
      // 检查 key 是否在 arrayKeys 中
      if (!keysStr.includes(key)) {
        // 如果指定了 columns，且当前 key 不在 columns 中，则跳过
        if (targetColumnsSet && !targetColumnsSet.has(key)) {
          continue
        }
        baseRecord[key] = record[key]
        columnsSet.add(key) // 在这里收集基础列名，避免多次 add
      }
    }

    // let mergerCellItem:MergeCellIdItem
    let startCellIdMap: Map<string, CellId>
    // 3. 生成展开后的行
    for (let i = 0; i < maxLen; i++) {
      rowIndex += 1

      if (i === 0) {
        if (maxLen !== 1) {
          startCellIdMap = new Map()
          Object.keys(baseRecord).forEach((columnKey) => {
            const cellId = getCellId({
              rowId: rowIndex.toString(),
              columnId: columnKey,
            })
            startCellIdMap.set(columnKey, cellId)
            cellsMap.set(cellId, {
              cellId: cellId,
              rowIdList: [],
              colIdList: [],
            })
          })
        }
      } else {
        Object.keys(baseRecord).forEach((columnKey) => {
          // const cellId = getCellId({
          //   rowId: rowIndex.toString(),
          //   columnId: columnKey,
          // })
          const mergeCellItem = cellsMap.get(startCellIdMap.get(columnKey)!)!
          mergeCellItem.rowIdList?.push(rowIndex.toString())
        })
      }
      // const startCe mainCellId:MergeCellIdItem = `${rowIndex}${connectKey}${col}`
      // 浅拷贝 baseRecord
      const newRow: Record<string, any> = { ...baseRecord, [RowIdKey]: rowIndex.toString() }

      for (let k = 0; k < arrayKeysLen; k++) {
        const arr = currentArrays[k]
        if (i < arr.length) {
          const item = arr[i]
          if (item !== undefined) {
            const keyStr = keysStr[k]
            let mergedParts: Record<string, any> | null = null

            // 默认逻辑
            if (typeof item === 'object' && item !== null) {
              mergedParts = {}
              const itemKeys = Object.keys(item)
              for (let j = 0; j < itemKeys.length; j++) {
                const subKey = itemKeys[j]
                const newKey = `${keyStr}${joinKey}${subKey}`
                // 如果指定了 columns，且当前 key 不在 columns 中，则跳过
                if (targetColumnsSet && !targetColumnsSet.has(newKey)) {
                  continue
                }
                mergedParts[newKey] = item[subKey]
              }
            } else {
              // 如果指定了 columns，且当前 key 不在 columns 中，则跳过
              if (!targetColumnsSet || targetColumnsSet.has(keyStr)) {
                mergedParts = { [keyStr]: item }
              }
            }

            // 合并数据并收集列名
            if (mergedParts) {
              const partKeys = Object.keys(mergedParts)
              for (let p = 0; p < partKeys.length; p++) {
                const pKey = partKeys[p]
                newRow[pKey] = mergedParts[pKey]
                columnsSet.add(pKey)
              }
            }
          }
        }
      }
      result.push(newRow)
    }
  }

  return {
    data: result,
    columns: Array.from(columnsSet),
    bodyMergeCells: Array.from(cellsMap.values()),
    maxExpandedRows,
  }
}
