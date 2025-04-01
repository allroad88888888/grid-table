export function findLastPerGroup(data: string[]) {
  const groups: Record<string, string[]> = {} // 用于存储各组的元素
  for (const item of data) {
    // 分割组号和内容
    const [group] = item.split('||')
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
  }
  // 提取每组的最后一个元素
  const result: string[] = []
  for (const group in groups) {
    const lastItem = groups[group][groups[group].length - 1]
    result.push(lastItem)
  }
  return result
}
