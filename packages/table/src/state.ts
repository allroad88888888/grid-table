import type { UseDataProps } from './types'
import { format } from './core/format'
import { atom } from 'einfach-state'
import { rowIndexListAtom, rowSizeMapAtom } from '@grid-table/basic'
import { nodeLevelAtom, relationAtom, rootAtom } from './tree/stateTree'
import { dataFamilyAtom } from './stateCore'

export const loadingAtom = atom(true)

export const dataInitAtom = atom<
  Record<string, any>[],
  [Pick<UseDataProps, 'idProp' | 'parentProp' | 'dataSource' | 'root' | 'rowHeight'>],
  void
>([], (getter, setter, props) => {
  setter(loadingAtom, true)
  const { getRowInfoAtomByRowId } = getter(dataFamilyAtom)
  const { showPathList, relation, levelMap, rowSizeMap } = format(props, {
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
