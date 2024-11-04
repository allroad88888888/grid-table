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
