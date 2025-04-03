/** @jsxImportSource solid-js */
import { createEffect, createMemo, createSignal, onCleanup, Show, Switch, Match } from 'solid-js'

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

  const [ref, setRef] = createSignal<HTMLDivElement>()
  const {width, height} = useAutoSizer({ current: ref })

 

  const yScroll = useVScroll({
    width: width,
    height: height,
    calcItemSize: rowCalcSize!,
    itemCount: rowCount,
    overscanCount: overRowCount,
    direction: 'row',
    stayIndexList: rowStayIndexList,
  })

  const xScroll = useVScroll({
    width: width,
    height: height,
    calcItemSize: columnCalcSize!,
    itemCount: columnCount,
    overscanCount: overColumnCount,
    direction: 'column',
    stayIndexList: columnStayIndexList,
  })



  const onScroll = (event: Event) => {
    xScroll.onScroll(event)
    yScroll.onScroll(event)
  }

  createEffect(() => {
    const element = ref()
    if (!element) {
      return
    }

    element.addEventListener('scroll', onScroll, { passive: true })
    
    onCleanup(() => {
      element?.removeEventListener('scroll', onScroll)
    })
  })

  const Empty = props.emptyComponent || (() => <></>)
  const Loading = props.loadingComponent || (() => <></>)

  const theadDimensions = createMemo(() => {
    let tempSize = 0
    const tempTheadSizeList: number[] = [0]
    for (let rowIndex = 0; rowIndex < theadRowCount; rowIndex += 1) {
      tempSize += theadRowSize(rowIndex)
      tempTheadSizeList.push(tempSize)
    }
    return { theadHeight: tempSize, theadSizeList: tempTheadSizeList }
  })

  // 缓存表头单元格样式计算函数
  const getTheadCellStyle = (rowIndex: number, columnIndex: number) => {
    const columnSizeList = xScroll.sizeList()
    const theadSizeList = theadDimensions().theadSizeList
    
    const tStyle = {
      "grid-column-start": Math.floor(columnSizeList[columnIndex] / columnBaseSize) + 1,
      "grid-column-end": Math.floor(columnSizeList[columnIndex + 1] / columnBaseSize) + 1,
      "grid-row-start": Math.floor(theadSizeList[rowIndex] / theadBaseSize) + 1,
      "grid-row-end": Math.floor(theadSizeList[rowIndex + 1] / theadBaseSize) + 1,
    }
    
    if (theadHasRow) {
      tStyle["grid-row-start"] = 1
      tStyle["grid-row-end"] =
        Math.floor((theadSizeList[rowIndex + 1] - theadSizeList[rowIndex]) / theadBaseSize) + 1
    }
    
    return tStyle
  }

  // 缓存表体单元格样式计算函数
  const getTbodyCellStyle = (rowIndex: number, columnIndex: number) => {
    const columnSizeList = xScroll.sizeList()
    const rowSizeList = yScroll.sizeList()
    
    const tStyle = {
      "grid-column-start": Math.floor(columnSizeList[columnIndex] / columnBaseSize) + 1,
      "grid-column-end": Math.floor(columnSizeList[columnIndex + 1] / columnBaseSize) + 1,
      "grid-row-start": Math.floor(rowSizeList[rowIndex] / rowBaseSize) + 1,
      "grid-row-end": Math.floor(rowSizeList[rowIndex + 1] / rowBaseSize) + 1,
    }
    
    if (tbodyHasRow) {
      tStyle["grid-row-start"] = 1
      tStyle["grid-row-end"] = Math.floor((rowSizeList[rowIndex + 1] - rowSizeList[rowIndex]) / rowBaseSize) + 1
    }
    
    return tStyle
  }

  // 缓存表头内容
  const theadContent = createMemo(() => 
    renderTheadCell({
      rowIndexList: Array.from({ length: theadRowCount }, (_, index) => index),
      columnIndexList: xScroll.showIndexList(),
      getCellStyleByIndex: getTheadCellStyle,
    })
  )

  // 缓存表体内容
  const tbodyContent = createMemo(() => 
    renderTbodyCell({
      rowIndexList: yScroll.showIndexList(),
      columnIndexList: xScroll.showIndexList(),
      getCellStyleByIndex: getTbodyCellStyle,
    })
  )

  // 缓存表头显示状态
  const hasRows = createMemo(() => yScroll.showIndexList().length > 0)

  // 表格主体渲染函数
  const renderTableBody = () => (
    <div
      aria-role="tbody"
      style={{
        display: 'grid',
        "grid-template-rows": `repeat(auto-fill, ${rowBaseSize}px)`,
        "grid-template-columns": `repeat(auto-fill, ${columnBaseSize}px)`,
        height: `${yScroll.totalLength()}px`,
        width: `${xScroll.totalLength()}px`,
      }}
    >
      {tbodyChildren}
      {tbodyContent()}
    </div>
  )

  return (
    <div ref={setRef} aria-role="table" style={style || {}} class={className}>
      {children}
      
      {/* 表头部分 */}
      <Show when={theadRowCount > 0}>
        <div
          aria-role="thead"
          class={theadClass}
          style={{
            display: 'grid',
            width: `${xScroll.totalLength()}px`,
            "grid-template-rows": `repeat(${Math.floor(theadDimensions().theadHeight / theadBaseSize)}, ${theadBaseSize}px)`,
            "grid-template-columns": `repeat(${Math.floor(xScroll.totalLength() / columnBaseSize)}, ${columnBaseSize}px)`,
            height: `${theadDimensions().theadHeight}px`,
          }}
        >
          {theadContent()}
          {theadChildren}
        </div>
      </Show>
      
      {/* 表格主体部分 - 使用Switch/Match代替嵌套Show组件使逻辑更清晰 */}
      <Switch fallback={renderTableBody()}>
        {/* 加载中状态 */}
        <Match when={props.loading}>
          <Loading />
        </Match>
        
        {/* 数据为空状态 */}
        <Match when={!hasRows()}>
          <Empty />
        </Match>
      </Switch>
    </div>
  )
} 