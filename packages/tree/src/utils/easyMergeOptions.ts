export function easyMergeOptions<T extends Record<string, any>>(
  defaultOptions: T,
  propOptions: Partial<T>, // 传入的 `propOptions` 可以是部分属性
): T {
  const result = { ...defaultOptions }

  for (const key in propOptions) {
    const defaultValue = defaultOptions[key]
    const propValue = propOptions[key]

    if (
      propValue &&
      typeof propValue === 'object' &&
      !Array.isArray(propValue) &&
      defaultValue &&
      typeof defaultValue === 'object' &&
      !Array.isArray(defaultValue)
    ) {
      // 递归合并嵌套对象
      result[key] = easyMergeOptions(defaultValue, propValue as Partial<T[typeof key]>)
    } else if (propValue !== undefined) {
      result[key] = propValue as T[typeof key]
    }
  }

  return result
}
