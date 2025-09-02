/**
 * 智能地将数据转换为字符串
 * 根据数据类型选择合适的转换方式
 * @param value 要转换的值
 * @returns 转换后的字符串
 */
export function valueToString(value: unknown): string {
  // 处理 null 和 undefined
  // if (value === null || value === undefined) {
  //   return ''
  // }

  // 处理字符串，直接返回
  if (typeof value === 'string') {
    return value
  }

  // 处理数字，转换为字符串
  if (typeof value === 'number') {
    return String(value)
  }

  // 处理布尔值，转换为字符串
  if (typeof value === 'boolean') {
    return String(value)
  }

  // 处理 Date 对象
  if (value instanceof Date) {
    return value.toISOString()
  }

  // 处理对象（包括数组）
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      // 如果 JSON.stringify 失败，尝试调用 toString
      return String(value)
    }
  }

  // 其他类型，尝试调用 toString
  try {
    return String(value)
  } catch {
    return ''
  }
}
