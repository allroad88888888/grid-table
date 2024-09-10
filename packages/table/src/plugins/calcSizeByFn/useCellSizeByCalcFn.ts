import { useBasic } from '../../basic'
import { useLayoutEffect } from 'react'
interface CalcCellSizeByFnProps {
  rowCount: number
  columnCount: number
  calcRowSize: (index: number) => number
  calcColumnSize: (index: number) => number
  /**
   * @default 1
   */
  theadRowCount?: number

  calcTheadRowSize: (index: number) => number
}

export function useCellSizeByCalcFn(props: CalcCellSizeByFnProps) {
  const {
    rowSizeListAtom,
    columnSizeListAtom,
    store,
    rowIndexListAtom,
    columnIndexListAtom,
    theadRowSizeListAtom,
  } = useBasic()
  const { rowCount, columnCount, calcRowSize, calcColumnSize, theadRowCount, calcTheadRowSize } =
    props
  useLayoutEffect(() => {
    const sizeList = []
    const indexList = []
    for (let i = 0; i < rowCount; i += 1) {
      sizeList.push(calcRowSize(i))
      indexList.push(i)
    }

    store.setter(rowSizeListAtom, sizeList)
    store.setter(rowIndexListAtom, indexList)
  }, [rowCount, calcRowSize])

  useLayoutEffect(() => {
    const sizeList = []
    const indexList = []
    for (let i = 0; i < columnCount; i += 1) {
      sizeList.push(calcColumnSize(i))
      indexList.push(i)
    }
    store.setter(columnSizeListAtom, sizeList)
    store.setter(columnIndexListAtom, indexList)
  }, [columnCount, calcColumnSize])

  useLayoutEffect(() => {
    const sizeList = []
    for (let i = 0; i < columnCount; i += 1) {
      sizeList.push(calcColumnSize(i))
    }
    store.setter(theadRowSizeListAtom, sizeList)
  }, [theadRowCount, calcTheadRowSize])
}
