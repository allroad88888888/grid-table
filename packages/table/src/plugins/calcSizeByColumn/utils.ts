export function distributeToNewArray(list: number[], total: number) {
  // 计算数组 A 的总和
  const sumA = list.reduce((acc, num) => acc + num, 0)

  // 计算需要分配的差值
  let remaining = total - sumA

  const space = remaining / sumA

  // 生成新数组，按比例分配，先计算精确值再四舍五入
  const newArray = list.map((num) => {
    const portion = num * space
    return Math.round(num + portion)
  })

  // 计算实际分配的总宽度
  const actualTotal = newArray.reduce((acc, num) => acc + num, 0)

  // 如果总宽度不匹配，调整最后一个元素
  const diff = total - actualTotal
  if (diff !== 0) {
    newArray[newArray.length - 1] = Math.max(1, newArray[newArray.length - 1] + diff)
  }

  // 确保所有值都是正整数
  return newArray.map((width) => Math.max(1, Math.round(width)))
}

/**
 * 分配列宽度，处理只有部分列设置宽度的情况
 * @param columns 列配置数组，包含可选的 width 属性
 * @param containerWidth 容器总宽度
 * @param columnMinWidth 列最小宽度
 * @returns 每列的计算宽度
 */
export function distributeColumnWidths<T extends { width?: number }>(
  columns: T[],
  containerWidth: number,
  columnMinWidth: number,
): number[] {
  if (columns.length === 0) {
    return []
  }

  // 分离有宽度和无宽度的列
  const fixedWidthColumns: { index: number; width: number }[] = []
  const flexibleColumns: number[] = []

  columns.forEach((column, index) => {
    if (column.width && column.width > 0) {
      fixedWidthColumns.push({ index, width: column.width })
    } else {
      flexibleColumns.push(index)
    }
  })

  // 计算已设置宽度的列的总宽度
  const fixedWidth = fixedWidthColumns.reduce((sum, col) => sum + col.width, 0)

  // 如果总的固定宽度已经大于等于容器宽度，使用现有逻辑
  if (fixedWidth >= containerWidth) {
    return columns.map((column) => column.width || columnMinWidth)
  }

  // 计算剩余可分配的宽度
  const remainingWidth = containerWidth - fixedWidth

  // 计算无宽度列的数量
  const flexibleColumnCount = flexibleColumns.length

  // 计算每个无宽度列应该分配的宽度
  let distributedWidth = columnMinWidth
  if (flexibleColumnCount > 0) {
    const averageWidth = remainingWidth / flexibleColumnCount
    distributedWidth = Math.max(Math.round(averageWidth), columnMinWidth)
  }

  // 构建最终的宽度数组
  const result: number[] = new Array(columns.length)

  // 设置固定宽度的列，确保为正整数
  fixedWidthColumns.forEach(({ index, width }) => {
    result[index] = Math.max(1, Math.round(width))
  })

  // 设置灵活宽度的列，确保为正整数
  flexibleColumns.forEach((index) => {
    result[index] = Math.max(1, Math.round(distributedWidth))
  })

  return result
}

/**
 * 根据 flexGrow 参数分配剩余宽度
 * @param currentWidths 当前各列宽度数组
 * @param flexGrowList 各列的 flexGrow 值数组
 * @param totalWidth 目标总宽度
 * @returns 分配后的宽度数组
 */
export function distributeByFlexGrow(
  currentWidths: number[],
  flexGrowList: number[],
  totalWidth: number,
): number[] {
  if (currentWidths.length !== flexGrowList.length) {
    throw new Error('currentWidths 和 flexGrowList 长度必须相同')
  }

  // 计算当前总宽度
  const currentTotalWidth = currentWidths.reduce((sum, width) => sum + width, 0)

  // 如果当前总宽度已经大于等于目标宽度，则不进行分配
  if (currentTotalWidth >= totalWidth) {
    return currentWidths.slice()
  }

  // 计算剩余空间
  const remainingSpace = totalWidth - currentTotalWidth

  // 处理 flexGrow 值，undefined 使用默认值 1，0 表示不参与分配
  const normalizedFlexGrowList = flexGrowList.map((grow) => {
    if (grow === undefined || grow === null) return 1 // 默认为 1
    return Math.max(0, grow) // 确保非负数
  })

  // 计算有效的 flexGrow 总和（排除 0）
  const totalFlexGrow = normalizedFlexGrowList.reduce((sum, grow) => sum + grow, 0)

  // 如果没有可分配的 flexGrow，则平均分配剩余空间
  if (totalFlexGrow === 0) {
    const averageIncrease = remainingSpace / currentWidths.length
    return currentWidths.map((width) => Math.max(1, Math.round(width + averageIncrease)))
  }

  // 根据 flexGrow 比例分配剩余空间
  const newWidths = currentWidths.map((currentWidth, index) => {
    const flexGrow = normalizedFlexGrowList[index]
    const additionalWidth = (flexGrow / totalFlexGrow) * remainingSpace
    return currentWidth + additionalWidth
  })

  // 四舍五入并确保最小宽度为 1
  const roundedWidths = newWidths.map((width) => Math.max(1, Math.round(width)))

  // 计算实际分配的总宽度
  const actualTotal = roundedWidths.reduce((sum, width) => sum + width, 0)

  // 如果总宽度不匹配，调整最后一个有 flexGrow > 0 的元素
  const diff = totalWidth - actualTotal
  if (diff !== 0) {
    // 找到最后一个有效的 flexGrow 列
    for (let i = roundedWidths.length - 1; i >= 0; i--) {
      if (normalizedFlexGrowList[i] > 0) {
        roundedWidths[i] = Math.max(1, roundedWidths[i] + diff)
        break
      }
    }
  }

  return roundedWidths
}
