import { useEffect } from 'react'
import { useAtomValue } from 'einfach-state'
import type { DataItem, UseDataProps } from '../types'
import { useData } from './useData'
import { columnInit, format } from './format'
import { useBasic } from '@grid-table/basic'
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
  /**
   * 列配置项处理
   */
  useEffect(() => {
    const { columnMap, columnIdList } = columnInit(columns)

    /**
     * 树形处理
     */
    const hasTreeExpand = columns.every((column) => {
      return !column.enabledExpand
    })
    if (hasTreeExpand) {
      columns[0].enabledExpand = true
    }

    for (const [columnId, columnOption] of columnMap) {
      getColumnOptionAtomByColumnId(columnId, columnOption)
    }

    store.setter(columnIndexListAtom, columnIdList)
  }, [columnIndexListAtom, columns, getColumnOptionAtomByColumnId, props.columns, store])

  /**
   * 数据处理
   */
  useEffect(() => {
    store.setter(loadingAtom, true)
    const { showPathList, relation, levelMap } = format(
      {
        dataSource,
        idProp: props.idProp,
        parentProp: props.parentProp,
        root,
      },
      dataCore,
    )

    store.setter(relationAtom, relation)
    store.setter(rowIndexListAtom, showPathList)
    store.setter(nodeLevelAtom, levelMap)
    store.setter(loadingAtom, false)
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

  useEffect(() => {
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
