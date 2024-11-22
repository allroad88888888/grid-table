import type { TilingId } from './buildTreeByService'
import { JoInKey } from './const'

export function buildPathByPathIdList(pathIds: TilingId[]) {
  return pathIds.join(JoInKey)
}
