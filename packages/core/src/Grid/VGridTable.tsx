import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useAutoSizer } from '../AutoSizer'
import { useVScroll } from '../Basic/useVScroll'
import type { VGridTableProps } from './type'

export function VGridTable(props: VGridTableProps) {
  const { style, className, children, theadChildren, tbodyChildren } = props
  const { rowCalcSize, rowCount, rowBaseSize = 1, overRowCount, rowStayIndexList } = props
  const {
    columnCalcSize,
    columnBaseSize = 1,
    columnCount,
    overColumnCount,
    columnStayIndexList,
    renderTbodyCell,
    tbodyHasRow,
  } = props
  const {
    theadRowCount = 1,
    renderTheadCell,
    theadRowCalcSize: theadRowSize,
    theadBaseSize = 1,
    theadClassName: theadClass,
    theadHasRow,
  } = props

  const { onResize } = props

  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = useAutoSizer(ref)

  const {
    onScroll: onYScroll,
    showIndexList: rowIndexList,
    totalLength: totalHeight,
    sizeList: rowSizeList,
  } = useVScroll({
    width,
    height,
    calcItemSize: rowCalcSize!,
    itemCount: rowCount,
    overscanCount: overRowCount,
    direction: 'row',
    stayIndexList: rowStayIndexList,
  })

  const {
    onScroll: onXScroll,
    showIndexList: columnIndexList,
    totalLength: totalWidth,
    sizeList: columnSizeList,
  } = useVScroll({
    width,
    height,
    calcItemSize: columnCalcSize!,
    itemCount: columnCount,
    overscanCount: overColumnCount,
    direction: 'column',
    stayIndexList: columnStayIndexList,
  })

  useLayoutEffect(() => {
    if (onResize) {
      onResize({ width, height })
    }
  }, [width, height, onResize])

  const onScroll = useCallback(
    (event: Event) => {
      onXScroll(event)
      onYScroll(event)
    },
    [onXScroll, onYScroll],
  )

  useEffect(() => {
    if (!ref.current) {
      return
    }

    ref.current.addEventListener('scroll', onScroll, { passive: true })
  }, [])

  const Empty = props.emptyComponent || Fragment

  const Loading = props.loadingComponent || Fragment

  const [theadHeight, theadSizeList] = useMemo(() => {
    let tempSize = 0
    const tempTheadSizeList: number[] = [0]
    for (let rowIndex = 0; rowIndex < theadRowCount; rowIndex += 1) {
      tempSize += theadRowSize(rowIndex)
      tempTheadSizeList.push(tempSize)
    }
    return [tempSize, tempTheadSizeList]
  }, [])

  const getTheadCellStyle = useCallback(
    (rowIndex: number, columnIndex: number) => {
      const tStyle = {
        gridColumnStart: columnSizeList[columnIndex] / columnBaseSize + 1,
        gridColumnEnd: columnSizeList[columnIndex + 1] / columnBaseSize + 1,
        gridRowStart: theadSizeList[rowIndex] / theadBaseSize + 1,
        gridRowEnd: theadSizeList[rowIndex + 1] / theadBaseSize + 1,
      }
      if (theadHasRow) {
        tStyle.gridRowStart = 1
        tStyle.gridRowEnd =
          (theadSizeList[rowIndex + 1] - theadSizeList[rowIndex]) / theadBaseSize + 1
      }
      return tStyle
    },
    [columnBaseSize, columnSizeList, theadBaseSize, theadHasRow, theadSizeList],
  )

  const getTbodyCellStyle = useCallback(
    (rowIndex: number, columnIndex: number) => {
      const tStyle = {
        gridColumnStart: columnSizeList[columnIndex] / columnBaseSize + 1,
        gridColumnEnd: columnSizeList[columnIndex + 1] / columnBaseSize + 1,
        gridRowStart: rowSizeList[rowIndex] / rowBaseSize + 1,
        gridRowEnd: rowSizeList[rowIndex + 1] / rowBaseSize + 1,
      }
      if (tbodyHasRow) {
        tStyle.gridRowStart = 1
        tStyle.gridRowEnd = (rowSizeList[rowIndex + 1] - rowSizeList[rowIndex]) / rowBaseSize + 1
      }
      return tStyle
    },
    [columnBaseSize, columnSizeList, rowBaseSize, rowSizeList, tbodyHasRow],
  )

  return (
    <div ref={ref} role="table" style={style} className={className}>
      {children}
      {theadRowCount > 0 ? (
        <div
          role="thead"
          key="thead"
          className={theadClass}
          style={{
            display: 'grid',
            width: totalWidth,
            gridTemplateRows: `repeat(${theadHeight / theadBaseSize}, ${theadBaseSize}px)`,
            gridTemplateColumns: `repeat(${totalWidth / columnBaseSize}, ${columnBaseSize}px)`,
            height: theadHeight,
          }}
        >
          {renderTheadCell({
            rowIndexList: Array.from({ length: theadRowCount }, (_, index) => index),
            columnIndexList,
            getCellStyleByIndex: getTheadCellStyle,
          })}
          {theadChildren}
        </div>
      ) : null}
      {props.loading ? (
        <Loading />
      ) : rowIndexList.length === 0 ? (
        <Empty />
      ) : (
        <div
          role="tbody"
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(auto-fill, ${rowBaseSize}px)`,
            gridTemplateColumns: `repeat(auto-fill, ${columnBaseSize}px)`,
            height: totalHeight,
            width: totalWidth,
          }}
          key="tbody"
        >
          {tbodyChildren}
          {renderTbodyCell({
            rowIndexList,
            columnIndexList,
            getCellStyleByIndex: getTbodyCellStyle,
          })}
        </div>
      )}
    </div>
  )
}
