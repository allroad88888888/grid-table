import type {
  MutableRefObject} from 'react';
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  forwardRef
} from 'react'
import {  useMemoCallback, useVDelayScroll } from '../Basic'
import type { VGridTableProps } from './type'
import { useAutoSizer } from '../AutoSizer'

function getCellStyleKey(rowIndex: number, columnIndex: number) {
  return `${rowIndex}-${columnIndex}`
}


export const VGridTable = forwardRef<HTMLDivElement, VGridTableProps>((props, gridRef) => {
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

  const {
    onResize,
    onMouseDown,
    onMouseUp,
    onClick,
    onMouseOver,
    onMouseEnter,
    onMouseOut,
    onContextMenu,
    onCopy,
  } = props


  const internalRef = useRef<HTMLDivElement>(null)

  const ref = (gridRef as MutableRefObject<HTMLDivElement>) || internalRef

  const { width, height } = useAutoSizer(ref)

  const {
    onScroll: onYScroll,
    showIndexList: rowIndexList,
    totalLength: totalHeight,
    sizeList: rowSizeList,
  } = useVDelayScroll({
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
  } = useVDelayScroll({
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

  const onScrollRef = useRef(onScroll)
  onScrollRef.current = onScroll

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    const handler = (event: Event) => onScrollRef.current(event)
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
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
  }, [theadRowCount, theadRowSize])



  const computeTheadCellStyle = useCallback(
    (rowIndex: number, columnIndex: number) => {
      const tStyle: Record<string, number | string> = {
        gridColumnStart: columnSizeList[columnIndex] / columnBaseSize + 1,
        gridColumnEnd: columnSizeList[columnIndex + 1] / columnBaseSize + 1,
        gridRowStart: theadSizeList[rowIndex] / theadBaseSize + 1,
        gridRowEnd: theadSizeList[rowIndex + 1] / theadBaseSize + 1,
        '--row': rowIndex,
        '--column': columnIndex,
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

  const computeTbodyCellStyle = useCallback(
    (rowIndex: number, columnIndex: number) => {
      const tStyle: Record<string, number | string> = {
        gridColumnStart: columnSizeList[columnIndex] / columnBaseSize + 1,
        gridColumnEnd: columnSizeList[columnIndex + 1] / columnBaseSize + 1,
        gridRowStart: rowSizeList[rowIndex] / rowBaseSize + 1,
        gridRowEnd: rowSizeList[rowIndex + 1] / rowBaseSize + 1,
        '--row': rowIndex,
        '--column': columnIndex,
      }
      if (tbodyHasRow) {
        tStyle.gridRowStart = 1
        tStyle.gridRowEnd = (rowSizeList[rowIndex + 1] - rowSizeList[rowIndex]) / rowBaseSize + 1
      }
      return tStyle
    },
    [columnBaseSize, columnSizeList, rowBaseSize, rowSizeList, tbodyHasRow],
  )

  const getTheadCellStyle = useMemoCallback(computeTheadCellStyle, getCellStyleKey)

  const getTbodyCellStyle = useMemoCallback(computeTbodyCellStyle, getCellStyleKey)

  const RenderTbodyCell = renderTbodyCell
  const RenderTheadCell = renderTheadCell

  const theadRowIndexList = useMemo(
    () => Array.from({ length: theadRowCount }, (_, index) => index),
    [theadRowCount],
  )

  return (
    <div
      ref={ref}
      role="table"
      data-grid-table=""
      tabIndex={0}
      style={style}
      className={className}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseEnter={onMouseEnter}
      onMouseOut={onMouseOut}
      onContextMenu={onContextMenu}
      onCopy={onCopy}
    >
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
          <RenderTheadCell rowIndexList={theadRowIndexList} columnIndexList={columnIndexList} getCellStyleByIndex={getTheadCellStyle} />
          {theadChildren}
        </div>
      ) : null}
      {props.loading ? (
        <Loading />
      ) : rowIndexList.length === 0 || columnIndexList.length === 0 ? (
        <Empty />
      ) : (
        <div
          role="tbody"
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(auto-fill, ${rowBaseSize}px)`,
            // 与 thead 保持一致使用显式轨道数，避免非整数 DPR/浏览器缩放下
            // auto-fill 由容器宽度推断出的轨道数与 thead 显式轨道数差 ±1，
            // 导致越靠右的列在 thead/tbody 之间错位累积越大
            gridTemplateColumns: `repeat(${totalWidth / columnBaseSize}, ${columnBaseSize}px)`,
            height: totalHeight,
            width: totalWidth,
          }}
          key="tbody"
        >
          {tbodyChildren}
          <RenderTbodyCell rowIndexList={rowIndexList} columnIndexList={columnIndexList} getCellStyleByIndex={getTbodyCellStyle} />
        </div>
      )}
    </div>
  )
})
