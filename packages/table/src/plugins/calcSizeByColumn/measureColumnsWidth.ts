import type { RefObject } from 'react'
import { calculateColumnsMaxWidth, calculateSuggestedColumnWidth } from './calculateChildrenWidth'

/**
 * 可控制的调试日志方法
 * 只有在 window.tpHelp === true 时才输出日志
 */
const debugLog = (...args: any[]) => {
  console.log(...args)
}

export interface AutoColumnsSizeOptions {
  /**
   * 列最小宽度
   * @default 20
   */
  minColumnWidth?: number
  /**
   * 列最大宽度
   * @default 300
   */
  maxColumnWidth?: number
  /**
   * 列宽边距（内边距补偿）
   * @default 8
   */
  columnPadding?: number
  // columnIndexList: number[]
}

export function measureColumnsWidth(
  gridRef: RefObject<HTMLDivElement>,
  columnIndexList: number[],
  options: AutoColumnsSizeOptions,
) {
  if (!gridRef?.current) {
    debugLog('⚠️ 计算被跳过:', { hasGridRef: !!gridRef?.current })
    return []
  }

  const { minColumnWidth = 20, maxColumnWidth = 300, columnPadding = 8 } = options
  debugLog('🚀 开始自动列宽计算')
  debugLog('📋 配置参数:', {
    minColumnWidth,
    maxColumnWidth,
    columnPadding,
    columnIndexList,
  })

  const gridElement = gridRef.current

  // 查找所有具有 grid-row-start 样式的单元格
  const allCells = gridElement.querySelectorAll('.grid-table-cell')
  debugLog(`🔍 找到 ${allCells.length} 个单元格`)

  if (allCells.length === 0) {
    debugLog('⚠️ 无单元格数据，返回空结果')
    return []
  }

  // 第一遍：收集所有不同的列位置值
  const columnPositions = new Set<number>()
  allCells.forEach((cell) => {
    const element = cell as HTMLElement
    const computedStyle = window.getComputedStyle(element)
    const gridColumnStart = parseInt(computedStyle.gridColumnStart) || 1
    columnPositions.add(gridColumnStart)
  })

  // 按大小排序，创建位置到逻辑索引的映射
  const sortedColumnPositions = Array.from(columnPositions).sort((a, b) => a - b)
  const columnPositionToLogicalIndex = new Map<number, number>()
  sortedColumnPositions.forEach((position, logicalIndex) => {
    columnPositionToLogicalIndex.set(position, logicalIndex)
  })

  debugLog('📋 列位置映射:', {
    原始位置: sortedColumnPositions,
    位置到索引: Array.from(columnPositionToLogicalIndex.entries()),
  })

  // 按列分组收集DOM元素
  const columnElements: Element[][] = []

  // 初始化列数组
  columnIndexList.forEach(() => {
    columnElements.push([])
  })

  // 第二遍：按列分组收集单元格DOM元素
  allCells.forEach((cell, index) => {
    const element = cell as HTMLElement
    const computedStyle = window.getComputedStyle(element)

    // 解析 grid-column-start，然后根据排序位置确定逻辑列索引
    const gridColumnStart = parseInt(computedStyle.gridColumnStart) || 1
    const logicalColumnIndex = columnPositionToLogicalIndex.get(gridColumnStart)

    // 如果找不到对应的列索引，跳过这个单元格
    if (logicalColumnIndex === undefined) {
      debugLog(`⚠️ 跳过未知列位置的单元格: gridColumnStart=${gridColumnStart}`)
      return
    }

    // 检查逻辑列索引是否在我们需要计算的列索引列表中
    const arrayIndex = columnIndexList.indexOf(logicalColumnIndex)
    if (arrayIndex !== -1) {
      columnElements[arrayIndex].push(element)
    }

    // 调试前几个单元格的解析过程
    if (index < 5) {
      const rowIndex = (parseInt(computedStyle.gridRowStart) || 1) - 1
      debugLog(
        `  🔎 单元格${index}: 行${rowIndex}, CSS列位置${gridColumnStart} -> 逻辑列${logicalColumnIndex}`,
      )
    }
  })

  debugLog(`✅ 单元格收集完成，共收集 ${columnElements.length} 列数据`)
  columnElements.forEach((column, index) => {
    debugLog(`  📊 列${columnIndexList[index]}: ${column.length} 个单元格`)
  })

  // 使用我们优化的 calculateColumnsMaxWidth 计算每列最大宽度
  const rawColumnWidths = calculateColumnsMaxWidth(columnElements)

  debugLog('📐 原始列宽计算结果:', rawColumnWidths)

  // 应用配置参数调整列宽
  const adjustedColumnWidths = rawColumnWidths.map((rawWidth, index) => {
    const suggestedWidth = calculateSuggestedColumnWidth(
      rawWidth,
      minColumnWidth,
      maxColumnWidth,
      columnPadding,
    )

    debugLog(`  📏 列${columnIndexList[index]}: ${rawWidth}px -> ${suggestedWidth}px`)
    return suggestedWidth
  })

  debugLog('🎉 列宽计算完成!')
  debugLog('📤 最终返回结果:', {
    columnWidths: adjustedColumnWidths,
    columnIndexList,
    appliedColumnsCount: adjustedColumnWidths.length,
  })

  return adjustedColumnWidths
}
