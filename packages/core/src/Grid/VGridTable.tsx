import type { ReactNode } from 'react'
import React, { Fragment, useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { useAutoSizer } from '../AutoSizer'
import type { VGridTableProps } from './type'
import { useVScroll } from '../Basic/useVScroll'

export function VGridTable(props: VGridTableProps) {
  const { style, className, children } = props
  const {
    rowCalcSize,
    rowCount,
    rowBaseSize = 1,
    overRowCount,
    rowStayIndexList,
    tbodyTrComponent,
  } = props
  const {
    columnCalcSize,
    columnBaseSize = 1,
    columnCount,
    overColumnCount,
    columnStayIndexList,
  } = props
  const {
    theadRowCount: headerRowCount = 1,
    theadCellComponent,
    theadRowCalcSize: theadRowSize,
    theadBaseSize = 1,
    theadClass,
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
    (event: React.UIEvent<HTMLElement, UIEvent>) => {
      onXScroll(event)
      onYScroll(event)
    },
    [onXScroll, onYScroll],
  )

  const CellTbody = props.cellComponent

  const CellThead = theadCellComponent

  const TBodyTr = tbodyTrComponent

  const TheadTr = props.theadTrComponent

  const Empty = props.emptyComponent || Fragment

  const $headRows: ReactNode[] = []

  const theadHeight = useMemo(() => {
    let tempSize = 0
    for (let rowIndex = 0; rowIndex < headerRowCount; rowIndex += 1) {
      tempSize += theadRowSize(rowIndex)
    }
    return tempSize
  }, [])

  for (let rowIndex = 0; rowIndex < headerRowCount; rowIndex += 1) {
    const columnList = columnIndexList.map((columnIndex) => {
      return (
        <CellThead
          key={`${rowIndex}-${columnIndex}`}
          style={{
            gridColumnStart: columnSizeList[columnIndex] / columnBaseSize + 1,
            gridColumnEnd: columnSizeList[columnIndex + 1] / columnBaseSize + 1,
            gridRowStart: 1,
            gridRowEnd: theadRowSize(rowIndex) / theadBaseSize + 1,
          }}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
        />
      )
    })
    const theadRowStyle = {
      display: 'grid',
      gridTemplateRows: `repeat(${theadHeight / theadBaseSize}, ${theadBaseSize}px)`,
      gridTemplateColumns: `repeat(${totalWidth / columnBaseSize}, ${columnBaseSize}px)`,
    }
    if (TheadTr) {
      $headRows.push(
        <TheadTr key={rowIndex} rowIndex={rowIndex} style={theadRowStyle}>
          {columnList}
        </TheadTr>,
      )
    } else {
      $headRows.push(
        <div key={rowIndex} role="row" style={theadRowStyle}>
          {columnList}
        </div>,
      )
    }
  }

  return (
    <div ref={ref} role="table" style={style} className={className} onScroll={onScroll}>
      {children}
      <div role="thead" className={theadClass}>
        {$headRows}
      </div>
      {rowIndexList.length === 0 ? (
        <Empty />
      ) : (
        <div
          role="tbody"
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(auto-fill, ${rowBaseSize}px)`,
            height: totalHeight,
            width: totalWidth,
          }}
        >
          {rowIndexList.map((rowIndex) => {
            const trStyle = {
              gridColumnStart: 1,
              gridColumnEnd: 1,
              gridRowStart: rowSizeList[rowIndex] / rowBaseSize + 1,
              gridRowEnd: rowSizeList[rowIndex + 1] / rowBaseSize + 1,
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, ${columnBaseSize}px)`,
              gridTemplateRows: `repeat(auto-fill, ${
                rowSizeList[rowIndex + 1] - rowSizeList[rowIndex]
              }px)`,
            }
            const trChildren = columnIndexList.map((columnIndex) => {
              return (
                <CellTbody
                  key={`${rowIndex}-${columnIndex}`}
                  style={{
                    gridColumnStart: columnSizeList[columnIndex] / columnBaseSize + 1,
                    gridColumnEnd: columnSizeList[columnIndex + 1] / columnBaseSize + 1,
                    gridRowStart: 1,
                    gridRowEnd: 1,
                  }}
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                />
              )
            })
            if (TBodyTr) {
              return (
                <TBodyTr rowIndex={rowIndex} style={trStyle} key={rowIndex}>
                  {trChildren}
                </TBodyTr>
              )
            }
            return (
              <div role="row" key={rowIndex} style={trStyle}>
                {trChildren}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
