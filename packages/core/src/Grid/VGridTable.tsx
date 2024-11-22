import type { ReactNode } from 'react'
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useAutoSizer } from '../AutoSizer'
import type { VGridTableProps } from './type'
import { useVScroll } from '../Basic/useVScroll'

export function VGridTable(props: VGridTableProps) {
  const { style, className, children } = props
  const { rowCalcSize, rowCount, rowBaseSize = 1, overRowCount, rowStayIndexList } = props
  const {
    columnCalcSize,
    columnBaseSize = 1,
    columnCount,
    overColumnCount,
    columnStayIndexList,
  } = props
  const {
    theadRowCount = 1,
    theadCellComponent,
    theadRowCalcSize: theadRowSize,
    theadBaseSize = 1,
    theadClassName: theadClass,
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

  const CellTbody = props.cellComponent

  const CellThead = theadCellComponent

  const Empty = props.emptyComponent || Fragment

  const Loading = props.loadingComponent || Fragment

  const $headRows: ReactNode[] = []

  const [theadHeight, theadSizeList] = useMemo(() => {
    let tempSize = 0
    const tempTheadSizeList: number[] = [0]
    for (let rowIndex = 0; rowIndex < theadRowCount; rowIndex += 1) {
      tempSize += theadRowSize(rowIndex)
      tempTheadSizeList.push(tempSize)
    }
    return [tempSize, tempTheadSizeList]
  }, [])

  for (let rowIndex = 0; rowIndex < theadRowCount; rowIndex += 1) {
    const columnList = columnIndexList.map((columnIndex) => {
      return (
        <CellThead
          key={`${rowIndex}-${columnIndex}`}
          style={{
            gridColumnStart: columnSizeList[columnIndex] / columnBaseSize + 1,
            gridColumnEnd: columnSizeList[columnIndex + 1] / columnBaseSize + 1,
            gridRowStart: theadSizeList[rowIndex] / theadBaseSize + 1,
            gridRowEnd: theadSizeList[rowIndex + 1] / theadBaseSize + 1,
          }}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
        />
      )
    })

    $headRows.push(<Fragment key={rowIndex}>{columnList}</Fragment>)
  }

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
          {$headRows}
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
          {rowIndexList.map((rowIndex) => {
            const trChildren = columnIndexList.map((columnIndex) => {
              return (
                <CellTbody
                  key={`${rowIndex}-${columnIndex}`}
                  style={{
                    gridColumnStart: columnSizeList[columnIndex] / columnBaseSize + 1,
                    gridColumnEnd: columnSizeList[columnIndex + 1] / columnBaseSize + 1,
                    gridRowStart: rowSizeList[rowIndex] / rowBaseSize + 1,
                    gridRowEnd: rowSizeList[rowIndex + 1] / rowBaseSize + 1,
                  }}
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                />
              )
            })
            return <Fragment key={rowIndex}>{trChildren}</Fragment>
          })}
        </div>
      )}
    </div>
  )
}
