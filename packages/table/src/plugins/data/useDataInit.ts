import { useLayoutEffect } from 'react'
import { useAtomValue } from 'einfach-state'
import type { DataItem, UseDataProps } from './type/common'
import { useData } from './useData'
import { format } from './format'
import { useBasic } from '../../basic'
import { useExpand } from './useExpand'

export function useDataInit<ItemInfo extends DataItem>(props: UseDataProps<ItemInfo>) {
  const { dataSource, columns } = props

  const { store, getColumnStateAtomByIndex } = useBasic()

  const dataCore = useData()
  const {
    clear,
    loadingAtom,
    showPathListAtom,
    relationAtom,
    root,
    nodeLevelAtom,
    columnOptionsAtom,
  } = dataCore
  const loading = useAtomValue(loadingAtom)

  useLayoutEffect(() => {
    store.setter(loadingAtom, true)
    const { showPathList, relation, levelMap } = format(
      {
        dataSource,
        columns,
        idProp: props.idProp,
        parentProp: props.parentProp,
        root,
      },
      dataCore,
    )
    store.setter(columnOptionsAtom, columns)
    store.setter(relationAtom, relation)
    store.setter(showPathListAtom, showPathList)
    store.setter(nodeLevelAtom, levelMap)
    store.setter(loadingAtom, false)

    return clear
  }, [
    clear,
    columnOptionsAtom,
    columns,
    dataCore,
    dataSource,
    loadingAtom,
    nodeLevelAtom,
    props.idProp,
    props.parentProp,
    props.root,
    relationAtom,
    root,
    showPathListAtom,
    store,
  ])

  useLayoutEffect(() => {
    const clearList: (() => void)[] = []
    columns.forEach((column, colIndex) => {
      clearList.push(
        store.setter(getColumnStateAtomByIndex(colIndex), (_getter, prev) => {
          const next = {
            ...prev,
          }
          if (!('className' in next)) {
            next.className = new Set()
          }

          next.className?.add(`gird-table-text-${column.align || 'left'}`)
          return next
        })!,
      )
    })
    return () => {
      clearList.forEach((tClear) => {
        tClear()
      })
    }
  }, [columns, getColumnStateAtomByIndex, store])

  useExpand()

  return {
    loading,
  }
}
