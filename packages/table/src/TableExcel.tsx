import { VGridTable } from '@grid-table/core'
import { useAtomValue, useSetAtom, useStore } from '@einfach/react'
import { forwardRef, Fragment, useImperativeHandle, useMemo, useRef, useState } from 'react'
import type { RowId } from '@grid-table/basic'
import { headerRowIndexListAtom, useBasic } from '@grid-table/basic'
import { useTableEvents } from './hooks/useTableEvents'
import { useSticky } from './plugins/sticky/useSticky.optimized'
import { useTableClassNameValue } from './hooks'
import { useAreaSelected } from './plugins/areaSelected'
import { useCopy } from './plugins/copy/useCopy'
import { DragLine } from './plugins/drag'
import { useRowSelection } from './plugins/select'
import { useCellSizeByColumn } from './plugins/calcSizeByColumn/useSizeByColumn'
import type { AntdTableProps, AntdTableRef } from './types/type'
import { useDataInit } from './core'
import clsx from 'clsx'
import { useHeaderMergeCells, useMergeCells } from './plugins/mergeCells'
import { useBorder } from './plugins/border'

import './Table.css'
import { getColumnId } from './utils/getColumnId'
import { useTheadLastRowColumnSelect } from './plugins/areaSelected/useTheadSelected'
import { TheadContextMenu } from './plugins/theadContextMenu/TheadContextMenu'
import { useRenderTheadCells } from './components/Cell/renderTheadCells'
import { useRenderTbodyCells } from './components/Cell/renderTbodyCells'
import { Provider } from './Provider'
import './var.css'
import { useColumnAutoSize } from './plugins/calcSizeByColumn/useColumnAutoSize'
import { optionsAtom } from './state'
import { useRowNumber } from './plugins/rowNumber'

export const TableExcel = forwardRef<AntdTableRef, AntdTableProps>((props, tableRef) => {
  const { columns: originalColumns, dataSource, enableRowNumber } = props
  const { cellDefaultWidth = 80, rowHeight = 36 } = props
  const { enableHeadContextMenu } = props

  // 序号列
  const rowNumberColumns = useRowNumber(originalColumns, {
    enabled: !!enableRowNumber,
    ...(typeof enableRowNumber === 'object' ? enableRowNumber : {}),
  })

  /** tbody每行 新加checkbox */
  const columns = useRowSelection(rowNumberColumns, props.rowSelection)

  const store = useStore()

  const gridRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const autoColumnsSize = useColumnAutoSize(gridRef)

  const showBorder = props.bordered !== false

  useImperativeHandle(tableRef, () => {
    return {
      autoColumnsSize,
    }
  })

  const setOptions = useSetAtom(optionsAtom)
  setOptions(props)

  /** 表格事件功能 */
  const tableEvents = useTableEvents()

  /** 虚拟滚动功能 */
  const { rowIdShowListAtom, columnIdShowListAtom } = useBasic()
  const rowIdShowList = useAtomValue(rowIdShowListAtom, { store })
  const columnIdShowList = useAtomValue(columnIdShowListAtom, { store })
  const headerRowIndexList = useAtomValue(headerRowIndexListAtom)

  /** 数据+列功能 */
  const { loading } = useDataInit({
    ...props,
    /**
     * 默认高度
     */
    rowHeight,
    columns,
  })

  /** 固定列功能 */
  const { stickyList } = useMemo(() => {
    const leftFixedColList: RowId[] = []
    const rightFixedColList: RowId[] = []

    columns.forEach((column, index) => {
      const columnId = getColumnId(column)
      if (column.fixed === 'left') {
        leftFixedColList.push(columnId)
      }
      if (column.fixed === 'right') {
        rightFixedColList.push(columnId)
      }
    })
    return {
      columnCount: columns.length,
      stickyList: {
        topIdList: leftFixedColList,
        bottomIdList: rightFixedColList,
      },
    }
  }, [columns])

  const { calcColumnSizeByIndex, calcHeadRowSizeByIndex, calcRowSizeByIndex } = useCellSizeByColumn(
    {
      rowHeight,
      rowCount: dataSource.length,
      columnMinWidth: cellDefaultWidth,
      wrapWidth: containerSize.width,
      columns,
    },
  )

  /** 固定列攻功能 */
  const { stayIndexList } = useSticky(stickyList)

  const tableClassName = useTableClassNameValue(
    clsx(
      'grid-table grid-table-border',
      {
        'grid-table-plugin-loading ': loading,
        'gpu-scroll': props.gpuScroll,
      },
      'grid-table grid-table-border',
      props.className,
    ),
  )

  /** 列点击选中整列 */
  useTheadLastRowColumnSelect({ enable: props.enableSelectArea })
  /**
   * 复制功能
   */
  const copy = useCopy({
    enableCopy: props.enableCopy,
    copyTbodyCellInfo: props.copyTbodyCellInfo,
  })

  /** tbody单元格合并功能 */
  useMergeCells({ showBorder })

  /** 边框处理功能 */
  useBorder({
    showBorder,
  })

  /** tbody区域选中功能 */
  useAreaSelected({ enable: props.enableCopy || props.enableSelectArea })

  /** thead单元格合并功能 */
  useHeaderMergeCells({
    showBorder,
  })

  const { renderTheadCells } = useRenderTheadCells()
  const { renderTBodyCells } = useRenderTbodyCells()

  const LoadingComponent = props.loadingComponent || Fragment

  return (
    <>
      {loading ? (
        props.loadingComponent ? (
          <LoadingComponent className={tableClassName} style={props.style} />
        ) : null
      ) : (
        <>
          <VGridTable
            {...tableEvents}
            style={props.style}
            minColumnWidth={props.minColumnWidth}
            maxColumnWidth={props.maxColumnWidth}
            ref={gridRef}
            className={tableClassName}
            renderTbodyCell={renderTBodyCells}
            renderTheadCell={renderTheadCells}
            theadRowCalcSize={calcHeadRowSizeByIndex}
            theadBaseSize={props.theadBaseSize}
            theadRowCount={headerRowIndexList.length}
            rowCount={rowIdShowList.length}
            rowCalcSize={calcRowSizeByIndex}
            rowBaseSize={props.rowBaseSize || rowHeight}
            columnCount={columnIdShowList.length}
            columnCalcSize={calcColumnSizeByIndex}
            columnBaseSize={props.columnBaseSize}
            columnStayIndexList={stayIndexList}
            overColumnCount={props.overColumnCount}
            overRowCount={props.overRowCount}
            emptyComponent={props.emptyComponent}
            loadingComponent={props.loadingComponent}
            loading={props.loading}
            onResize={setContainerSize}
            theadChildren={<TheadContextMenu enableContextMenu={enableHeadContextMenu} />}
          >
            <>
              {copy}
              <DragLine
                dragColumnMinSize={props.cellDefaultWidth}
                enableColumnResize={props.enableColumnResize}
              />
            </>
          </VGridTable>
        </>
      )}
    </>
  )
})

const TableExcelWrapper = forwardRef<AntdTableRef, AntdTableProps>((props, tableRef) => {
  return (
    <Provider root={props?.root} store={props.store}>
      <TableExcel {...props} ref={tableRef} />
    </Provider>
  )
})

export default TableExcelWrapper
