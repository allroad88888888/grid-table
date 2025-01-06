import { atom } from 'einfach-state'
import { dataFamilyAtom } from './stateCore'
import type { RowId } from '@grid-table/basic'
import { headerRowIndexListAtom, headerRowSizeMaAtom } from '@grid-table/basic'
import { getHeaderRowId } from './utils/getHeaderRowId'

export const headerDataInitAtom = atom(
  0,
  (getter, setter, headerDataSource: Record<string, any>[] = [], { size }: { size: number }) => {
    const { getHeaderRowInfoAtomByRowId } = getter(dataFamilyAtom)
    const headerRowIndexList: RowId[] = []
    const headerRowSizeMap = new Map<RowId, number>()
    headerDataSource.forEach((info, index) => {
      const t = getHeaderRowId(index)
      headerRowIndexList.push(t)
      headerRowSizeMap.set(t, size)
      setter(getHeaderRowInfoAtomByRowId(t), info)
    })
    /**
     * ['0'] 默认有一列
     */
    setter(headerRowIndexListAtom, headerRowIndexList.length === 0 ? ['0'] : headerRowIndexList)

    setter(headerRowSizeMaAtom, headerRowSizeMap)
  },
)
