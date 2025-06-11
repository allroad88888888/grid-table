import type { UseDataProps } from './types'
import { format } from './core/format'
import { atom } from '@einfach/react'
import { rowIndexListAtom, rowSizeMapAtom } from '@grid-table/basic'
import { nodeLevelAtom, relationAtom, rootAtom } from './tree/stateTree'
import { dataFamilyAtom, loadingAtom } from './stateCore'

//  'idProp' | 'parentProp' | 'dataSource' | 'root' | 'rowHeight
export const dataInitAtom = atom<
  Record<string, any>[],
  [Omit<UseDataProps, 'columns' | 'headerDataSource'>],
  void
>([], (getter, setter, props) => {
  setter(loadingAtom, true)
  const { getRowInfoAtomByRowId } = getter(dataFamilyAtom)
  const { showPathList, relation, levelMap, rowSizeMap } = format(props as UseDataProps, {
    iteratorFn: (rowId, rowInfo) => {
      setter(getRowInfoAtomByRowId(rowId), rowInfo!)
    },
  })

  setter(relationAtom, relation)
  setter(rowIndexListAtom, showPathList)
  setter(nodeLevelAtom, levelMap)
  setter(rowSizeMapAtom, rowSizeMap)
  if (props.root) {
    setter(rootAtom, props.root)
  }

  setter(loadingAtom, false)
})
