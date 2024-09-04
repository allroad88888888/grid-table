import { useInit } from 'einfach-utils'
import { useBasic } from '../../basic'
interface CalcCellSizeByFnProps {
  rowCount: number
  columnCount: number
  calcRowSize: (index: number) => number
  calcColumnSize: (index: number) => number
}

export function useCellSizeByCalcFn(props: CalcCellSizeByFnProps) {
  const { rowSizeListAtom, columnSizeListAtom, store } = useBasic()
  const { rowCount, columnCount, calcRowSize, calcColumnSize } = props
  useInit(() => {
    const sizeList = []
    for (let i = 0; i < rowCount; i += 1) {
      sizeList.push(calcRowSize(i))
    }
    store.setter(rowSizeListAtom, sizeList)
  }, [rowCount, calcRowSize])

  useInit(() => {
    const sizeList = []
    for (let i = 0; i < columnCount; i += 1) {
      sizeList.push(calcColumnSize(i))
    }
    store.setter(columnSizeListAtom, sizeList)
  }, [columnCount, calcColumnSize])
}
