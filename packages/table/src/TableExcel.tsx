import { useAutoSizer, VGridTable } from '@grid-table/core'
import { useAtomValue, useStore } from '@einfach/state'
import { Fragment, useMemo, useRef } from 'react'
import type { RowId } from '@grid-table/basic'
import { headerRowIndexListAtom, useBasic } from '@grid-table/basic'
import { useTableEvents } from './hooks/useTableEvents'
import { useSticky } from './plugins/sticky'
import { useTableClassNameValue } from './hooks'
import { useAreaSelected } from './plugins/areaSelected'
import { useCopy } from './plugins/copy/useCopy'
import { DragLine } from './plugins/drag'
import { useRowSelection } from './plugins/select'
import { useCellSizeByColumn } from './plugins/calcSizeByColumn/useSizeByColumn'
import type { AntdTableProps } from './types/type'
import { useDataInit } from './core'
import clsx from 'clsx'
import { useHeaderMergeCells, useMergeCells } from './plugins/mergeCells'

import './Table.css'
import { getColumnId } from './utils/getColumnId'
import { useTheadSelected } from './plugins/areaSelected/useTheadSelected'
import { TheadContextMenu } from './plugins/theadContextMenu/TheadContextMenu'
import { useRenderTheadCells } from './components/Cell/renderTheadCells'
import { useRenderTbodyCells } from './components/Cell/renderTbodyCells'
import { Provider } from './Provider'
import './var.css'
export function TableExcel(props: AntdTableProps) {
  const { columns, dataSource } = props
  const { cellDefaultWidth = 80, rowHeight = 36 } = props
  const { enableHeadContextMenu } = props

  const ref = useRef<HTMLDivElement>(null)
  const { width } = useAutoSizer(ref)
  const store = useStore()

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
      wrapWidth: width,
      columns,
    },
  )
  /** tbody每行 新加checkbox */
  useRowSelection(props.rowSelection)
  /** 固定列攻功能 */
  const { stayIndexList } = useSticky(stickyList)

  const tableClassName = useTableClassNameValue()
  /** tbody区域选中功能 */
  useAreaSelected({ enable: props.enableCopy || props.enableSelectArea })

  /** 列选中区域功能 */
  useTheadSelected({ enable: props.enableSelectArea })
  /**
   * 复制功能
   */
  const copy = useCopy({
    enableCopy: props.enableCopy,
    copyGetDataByCellIds: props.copyGetDataByCellIds,
  })

  /** tbody单元格合并功能 */
  useMergeCells()

  /** thead单元格合并功能 */
  useHeaderMergeCells()

  const { renderTheadCells } = useRenderTheadCells()
  const { renderTBodyCells } = useRenderTbodyCells()

  const LoadingComponent = props.loadingComponent || Fragment

  return (
    <div
      style={props.style}
      className={clsx('grid-table-plugin-wrapper', {
        'grid-table-plugin-loading ': loading,
      })}
      ref={ref}
      {...tableEvents}
    >
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          {copy}
          <DragLine dragColumnMinSize={props.cellDefaultWidth} />
          <VGridTable
            className={`grid-table grid-table-border ${tableClassName}`}
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
            theadChildren={<TheadContextMenu enableContextMenu={enableHeadContextMenu} />}
          />
        </>
      )}
    </div>
  )
}

export default (props: AntdTableProps) => {
  return (
    <Provider root={props?.root} store={props.store}>
      <TableExcel {...props} />
    </Provider>
  )
}
