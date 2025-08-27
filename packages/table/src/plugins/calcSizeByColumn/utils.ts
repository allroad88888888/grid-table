export function distributeToNewArray(list: number[], total: number) {
  // 计算数组 A 的总和
  const sumA = list.reduce((acc, num) => acc + num, 0)

  // 计算需要分配的差值
  let remaining = total - sumA

  const space = remaining / sumA

  // 生成新数组，按比例分配整数部分
  const newArray = list.map((num) => {
    const portion = Math.floor(num * space)
    remaining -= portion
    return num + portion
  })

  // 将剩余的部分加到最后一个数字上
  newArray[newArray.length - 1] += remaining

  return newArray
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
    distributedWidth = Math.max(averageWidth, columnMinWidth)
  }

  // 构建最终的宽度数组
  const result: number[] = new Array(columns.length)

  // 设置固定宽度的列
  fixedWidthColumns.forEach(({ index, width }) => {
    result[index] = width
  })

  // 设置灵活宽度的列
  flexibleColumns.forEach((index) => {
    result[index] = distributedWidth
  })

  return result
}
