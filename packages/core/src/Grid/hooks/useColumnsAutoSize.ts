import { useCallback } from 'react'
import type { RefObject } from 'react'

/**
 * 可控制的调试日志方法
 * 只有在 window.tpHelp === true 时才输出日志
 */
const debugLog = (...args: any[]) => {
  if (typeof window !== 'undefined' && (window as any).tpHelp === true) {
    console.log(...args)
  }
}

export interface UseAutoSizeOptions {
  /**
   * 列最小宽度
   * @default 50
   */
  minColumnWidth?: number
  /**
   * 列最大宽度
   * @default 300
   */
  maxColumnWidth?: number
  /**
   * 列宽边距（内边距补偿）
   * @default 20
   */
  columnPadding?: number
  columnIndexList: number[]
}

interface CellMeasurement {
  columnIndex: number
  rowIndex: number
  scrollWidth: number
  clientWidth: number
  hasOverflow: boolean
}

interface RowInfo {
  rowIndex: number
  columnIndexes: number[]
  cellCount: number
}

/**
 * 找出标准列结构（以最多列的那一行为标准）
 */
function findStandardColumns(measurements: CellMeasurement[]): number[] {
  // 按行分组，统计每行的列信息
  const rowInfoMap = new Map<number, RowInfo>()

  measurements.forEach((measurement) => {
    const { rowIndex, columnIndex } = measurement

    if (!rowInfoMap.has(rowIndex)) {
      rowInfoMap.set(rowIndex, {
        rowIndex,
        columnIndexes: [],
        cellCount: 0,
      })
    }

    const rowInfo = rowInfoMap.get(rowIndex)!
    if (!rowInfo.columnIndexes.includes(columnIndex)) {
      rowInfo.columnIndexes.push(columnIndex)
      rowInfo.cellCount++
    }
  })

  debugLog('📊 按行分组的列信息:', Array.from(rowInfoMap.values()))

  // 找出列数最多的行
  let maxCellCount = 0
  let standardRowInfo: RowInfo | undefined = undefined

  for (const rowInfo of rowInfoMap.values()) {
    if (rowInfo.cellCount > maxCellCount) {
      maxCellCount = rowInfo.cellCount
      standardRowInfo = rowInfo
    }
  }

  // 返回标准列结构，按列索引排序
  if (!standardRowInfo) {
    debugLog('⚠️ 未找到标准行结构')
    return []
  }

  const standardColumns = standardRowInfo.columnIndexes.sort((a: number, b: number) => a - b)
  debugLog(`✅ 标准列结构 (行${standardRowInfo.rowIndex}, ${maxCellCount}列):`, standardColumns)

  return standardColumns
}

/**
 * 计算每列的最佳宽度
 */
function calculateOptimalWidths(
  measurements: CellMeasurement[],
  minWidth: number,
  maxWidth: number,
  padding: number,
): number[] {
  debugLog('🔍 开始计算列宽 - 总测量数据:', measurements.length)

  // 找出标准列结构
  const standardColumns = findStandardColumns(measurements)

  if (standardColumns.length === 0) {
    debugLog('❌ 标准列结构为空，返回空数组')
    return []
  }

  // 只保留符合标准列结构的测量数据（跳过合并列）
  const validMeasurements = measurements.filter((measurement) =>
    standardColumns.includes(measurement.columnIndex),
  )

  debugLog(`📝 有效测量数据: ${validMeasurements.length}/${measurements.length}`)

  // 按列分组测量数据
  const columnMeasurements = new Map<number, CellMeasurement[]>()
  validMeasurements.forEach((measurement) => {
    const { columnIndex } = measurement
    if (!columnMeasurements.has(columnIndex)) {
      columnMeasurements.set(columnIndex, [])
    }
    columnMeasurements.get(columnIndex)!.push(measurement)
  })

  // 初始化列宽数组，按标准列结构的顺序
  const columnWidths: number[] = new Array(standardColumns.length).fill(minWidth)

  debugLog('📐 开始逐列计算最佳宽度:')

  // 计算每列的最佳宽度
  standardColumns.forEach((columnIndex, arrayIndex) => {
    const cellMeasurements = columnMeasurements.get(columnIndex)
    if (!cellMeasurements || cellMeasurements.length === 0) {
      debugLog(`  ⚪ 列${columnIndex}: 无测量数据，使用最小宽度 ${minWidth}px`)
      return
    }

    // 收集该列的详细信息
    const cellDetails = cellMeasurements.map((measurement) => ({
      row: measurement.rowIndex,
      scrollWidth: measurement.scrollWidth,
      clientWidth: measurement.clientWidth,
      hasOverflow: measurement.hasOverflow,
      currentWidth: measurement.clientWidth,
      requiredWidth: measurement.scrollWidth,
    }))

    // 如果是前3列，打印详细的单元格信息
    if (arrayIndex < 3) {
      debugLog(`    🔍 列${columnIndex} 详细单元格信息:`)
      cellDetails.forEach((cell, idx) => {
        debugLog(
          `      行${cell.row}: scroll=${cell.scrollWidth}, client=${cell.clientWidth}, overflow=${cell.hasOverflow}`,
        )
      })
    }

    // 找到该列中实际需要的内容宽度（scrollWidth）和当前显示宽度（clientWidth）
    const maxRequiredContentWidth = Math.max(
      ...cellMeasurements.map((measurement) => measurement.scrollWidth),
    )
    const maxCurrentWidth = Math.max(
      ...cellMeasurements.map((measurement) => measurement.clientWidth),
    )

    // 判断是否需要调整宽度
    const needsAdjustment = maxRequiredContentWidth > maxCurrentWidth

    let optimalWidth: number
    if (needsAdjustment) {
      // 内容溢出，需要扩展到内容宽度 + 边距
      optimalWidth = maxRequiredContentWidth + padding
    } else {
      // 内容没有溢出，当前宽度已经足够，不需要额外边距
      optimalWidth = maxCurrentWidth
    }

    // 应用最小和最大宽度限制
    const finalWidth = Math.ceil(Math.max(minWidth, Math.min(maxWidth, optimalWidth)))

    columnWidths[arrayIndex] = finalWidth

    debugLog(`  📏 列${columnIndex} (数组索引${arrayIndex}):`)
    debugLog(`    - 单元格数量: ${cellMeasurements.length}`)
    debugLog(`    - 单元格详情:`, cellDetails)
    debugLog(`    - 最大内容宽度: ${maxRequiredContentWidth}px`)
    debugLog(`    - 最大当前宽度: ${maxCurrentWidth}px`)
    debugLog(`    - 需要调整: ${needsAdjustment}`)
    debugLog(
      `    - 计算宽度: ${optimalWidth}px ${needsAdjustment ? `(${maxRequiredContentWidth} + ${padding}px边距)` : '(当前宽度已足够)'}`,
    )
    debugLog(`    - 最终宽度: ${finalWidth}px (限制: ${minWidth}-${maxWidth}px)`)
  })

  debugLog('🎯 最终列宽结果:', columnWidths)
  return columnWidths
}

export function useColumnsAutoSize(gridRef: RefObject<HTMLElement>, options: UseAutoSizeOptions) {
  const { minColumnWidth = 50, maxColumnWidth = 300, columnPadding = 20, columnIndexList } = options

  const measureCells = useCallback(() => {
    debugLog('🚀 开始自动列宽计算')
    debugLog('📋 配置参数:', {
      minColumnWidth,
      maxColumnWidth,
      columnPadding,
      columnIndexList,
    })

    if (!gridRef.current) {
      debugLog('⚠️ 计算被跳过:', { hasGridRef: !!gridRef.current })
      return
    }

    const gridElement = gridRef.current
    const measurements: CellMeasurement[] = []

    // 查找所有具有 grid-row-start 样式的单元格
    const allCells = gridElement.querySelectorAll('.grid-table-cell')
    debugLog(`🔍 找到 ${allCells.length} 个单元格`)

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

    // 第二遍：处理每个单元格
    allCells.forEach((cell, index) => {
      const element = cell as HTMLElement
      const computedStyle = window.getComputedStyle(element)

      // 解析 grid-row-start 来确定行位置
      const gridRowStart = parseInt(computedStyle.gridRowStart) || 1
      const rowIndex = gridRowStart - 1

      // 解析 grid-column-start，然后根据排序位置确定逻辑列索引
      const gridColumnStart = parseInt(computedStyle.gridColumnStart) || 1
      const columnIndex = columnPositionToLogicalIndex.get(gridColumnStart)

      // 如果找不到对应的列索引，跳过这个单元格
      if (columnIndex === undefined) {
        debugLog(`⚠️ 跳过未知列位置的单元格: gridColumnStart=${gridColumnStart}`)
        return
      }

      // 测量单元格的滚动和客户端宽度，并计算border宽度
      const scrollWidth = element.scrollWidth
      const clientWidth = element.clientWidth
      const hasOverflow = scrollWidth > clientWidth

      // 获取border宽度
      const borderLeftWidth = parseFloat(computedStyle.borderLeftWidth) || 0
      const borderRightWidth = parseFloat(computedStyle.borderRightWidth) || 0
      const totalBorderWidth = borderLeftWidth + borderRightWidth

      measurements.push({
        columnIndex,
        rowIndex,
        scrollWidth: scrollWidth + totalBorderWidth,
        clientWidth: clientWidth + totalBorderWidth,
        hasOverflow,
      })

      // 每10个单元格打印一次进度
      if ((index + 1) % 10 === 0) {
        debugLog(`  📈 已处理 ${index + 1}/${allCells.length} 个单元格`)
      }

      // 调试前几个单元格的解析过程
      if (index < 5) {
        debugLog(
          `  🔎 单元格${index}: 行${rowIndex}, CSS列位置${gridColumnStart} -> 逻辑列${columnIndex}`,
        )
        debugLog(
          `    📐 原始宽度: scroll=${scrollWidth - totalBorderWidth}, client=${clientWidth - totalBorderWidth}`,
        )
        debugLog(
          `    🔲 border宽度: ${totalBorderWidth}px (${borderLeftWidth}+${borderRightWidth})`,
        )
        debugLog(`    📏 最终宽度: scroll=${scrollWidth}, client=${clientWidth}`)
      }
    })

    debugLog(`✅ 单元格测量完成，共收集 ${measurements.length} 条数据`)

    // 如果有测量数据，计算最佳宽度
    if (measurements.length > 0) {
      const columnWidths = calculateOptimalWidths(
        measurements,
        minColumnWidth,
        maxColumnWidth,
        columnPadding,
      )

      debugLog('🎉 列宽计算完成!')
      debugLog('📤 最终返回结果:', {
        columnWidths,
        columnIndexList,
        appliedColumnsCount: columnWidths.length,
      })

      return { columnWidths, columnIndexList: columnIndexList }
    }

    debugLog('⚠️ 无测量数据，返回空结果')
    return {
      columnWidths: [],
      columnIndexList: [],
    }
  }, [gridRef, minColumnWidth, maxColumnWidth, columnPadding, columnIndexList])

  return measureCells
}
