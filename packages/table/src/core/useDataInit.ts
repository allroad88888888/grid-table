import { useLayoutEffect } from 'react'
import { useAtomValue } from 'einfach-state'
import type { DataItem, UseDataProps } from '../types'
import { useData } from './useData'
import { format } from './format'
import { useBasic } from '@grid-table/basic/src'
import { useExpand } from '../Tree'

export function useDataInit<ItemInfo extends DataItem>(props: UseDataProps<ItemInfo>) {
  const { dataSource, columns } = props

  const {
    store,
    getColumnStateAtomById: getColumnStateAtomByIndex,
    rowIndexListAtom,
    rowIdShowListAtom,
    columnIndexListAtom,
  } = useBasic()

  const dataCore = useData()
  const { clear, loadingAtom, relationAtom, root, nodeLevelAtom, getColumnOptionAtomByColumnId } =
    dataCore
  const loading = useAtomValue(loadingAtom)

  useLayoutEffect(() => {
    store.setter(loadingAtom, true)
    const { showPathList, relation, levelMap, columnMap, columnIdList } = format(
      {
        dataSource,
        columns,
        idProp: props.idProp,
        parentProp: props.parentProp,
        root,
      },
      dataCore,
    )
    for (const [columnId, columnOption] of columnMap) {
      getColumnOptionAtomByColumnId(columnId, columnOption)
    }

    const hasTreeExpand = columns.every((column) => {
      return !column.enabledExpand
    })

    if (hasTreeExpand) {
      columns[0].enabledExpand = true
    }

    store.setter(relationAtom, relation)
    store.setter(rowIndexListAtom, showPathList)
    store.setter(columnIndexListAtom, columnIdList)
    store.setter(nodeLevelAtom, levelMap)
    store.setter(loadingAtom, false)

    return clear
  }, [
    clear,
    columnIndexListAtom,
    getColumnOptionAtomByColumnId,
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
    rowIdShowListAtom,
    rowIndexListAtom,
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
