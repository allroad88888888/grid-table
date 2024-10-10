let num = 10000
const cacheMap = new WeakMap<any, string>()
export function getIdByObj(obj: any) {
  if (!cacheMap.has(obj)) {
    cacheMap.set(obj, `${num}`)
    num += 1
  }
  return cacheMap.get(obj)!
}
