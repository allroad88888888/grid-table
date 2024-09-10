import { useCallback, useEffect, useLayoutEffect } from 'react'
import { useAtomValue } from 'einfach-state'
import type { TableOption, UseBasicInitProps } from './type'
import { useBasic } from './useBasic'
import type { ResizeParam } from '@grid-table/core'

export function useBasicInit(props: UseBasicInitProps) {
  const { rowBaseSize = 1, columnBaseSize = 1, theadBaseSize = 1 } = props as TableOption

  const {
    store,
    columnSizeListAtom,
    rowSizeListAtom,
    resizeAtom,
    columnIndexListAtom,
    rowIndexListAtom,
    clear,
    optionsAtom,
    theadRowSizeListAtom,
  } = useBasic()

  const { setter } = store

  useLayoutEffect(() => {
    setter(optionsAtom, {
      rowBaseSize,
      columnBaseSize,
      theadBaseSize,
    })
  }, [setter, optionsAtom, rowBaseSize, columnBaseSize, theadBaseSize])

  useEffect(() => {
    return clear
  }, [clear])

  const columnIndexList = useAtomValue(columnIndexListAtom, { store })
  const rowIndexList = useAtomValue(rowIndexListAtom, { store })
  const columnSizeList = useAtomValue(columnSizeListAtom, { store })
  const rowSizeList = useAtomValue(rowSizeListAtom, { store })

  const theadRowSizeList = useAtomValue(theadRowSizeListAtom, { store })

  const newRowCalcSize = useCallback(
    (index: number) => {
      const gridIndex = rowIndexList[index] || 0
      return rowSizeList[gridIndex]
    },
    [rowIndexList, rowSizeList],
  )

  const newColumnCalcSize = useCallback(
    (index: number) => {
      const gridIndex = columnIndexList[index] || 0

      return columnSizeList[gridIndex]
    },
    [columnIndexList, columnSizeList],
  )

  const newTheadCalcSize = useCallback(
    (index: number) => {
      return theadRowSizeList[index] || 0
    },
    [theadRowSizeList],
  )

  const onResize = useCallback(
    (param: ResizeParam) => {
      setter(resizeAtom, param)
    },
    [resizeAtom, setter],
  )

  console.log(`rowIndexList.length`, rowIndexList.length)

  return {
    rowCount: rowIndexList.length,
    columnCount: columnIndexList.length,
    rowCalcSize: newRowCalcSize,
    columnCalcSize: newColumnCalcSize,
    theadCalcSize: newTheadCalcSize,
    onResize,
  }
}
