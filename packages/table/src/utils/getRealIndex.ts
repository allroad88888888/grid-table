export function getRealIndex(index: number, listMap: Map<number, number>) {
  if (listMap.has(index)) {
    return listMap.get(index)!
  }
  return index
}
