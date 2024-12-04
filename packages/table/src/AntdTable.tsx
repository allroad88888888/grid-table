import { useAutoSizer, VGridTable } from '@grid-table/core'
import { useAtomValue, useStore } from 'einfach-state'
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
import { DataCell, DataCellThead, Row } from './components'
import { Provider } from './Provider'
import clsx from 'clsx'
import { useHeaderMergeCells, useMergeCells } from './plugins/mergeCells'

import './Table.css'
import { getColumnId } from './utils/getColumnId'

export function TableWithNoProvider(props: AntdTableProps) {
  const { columns, dataSource } = props
  const { cellDefaultWidth = 80, rowHeight = 36 } = props
  const { bordered = true } = props

  const ref = useRef<HTMLDivElement>(null)
  const { width } = useAutoSizer(ref)

  const tableEvents = useTableEvents()

  const { rowIdShowListAtom, columnIdShowListAtom } = useBasic()
  const store = useStore()

  const rowIdShowList = useAtomValue(rowIdShowListAtom, { store })
  const columnIdShowList = useAtomValue(columnIdShowListAtom, { store })

  const headerRowIndexList = useAtomValue(headerRowIndexListAtom)

  const { loading } = useDataInit({
    ...props,
    /**
     * 默认高度
     */
    rowHeight,
  })

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
        topIndexList: leftFixedColList,
        bottomIndexList: rightFixedColList,
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

  useRowSelection(props.rowSelection)
  const { stayIndexList } = useSticky({
    ...stickyList,
    bordered: bordered,
  })

  const tableClassName = useTableClassNameValue()
  useAreaSelected({ enable: props.enableCopy })

  const copy = useCopy({
    enable: props.enableCopy,
  })

  useMergeCells()

  useHeaderMergeCells()

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
            theadCellComponent={DataCellThead}
            theadRowCalcSize={calcHeadRowSizeByIndex}
            theadBaseSize={props.theadBaseSize}
            theadRowCount={headerRowIndexList.length}
            rowCount={rowIdShowList.length}
            rowCalcSize={calcRowSizeByIndex}
            rowBaseSize={props.rowBaseSize || rowHeight}
            tbodyTrComponent={Row}
            columnCount={columnIdShowList.length}
            columnCalcSize={calcColumnSizeByIndex}
            columnBaseSize={props.columnBaseSize}
            columnStayIndexList={stayIndexList}
            cellComponent={DataCell}
            overColumnCount={props.overColumnCount}
            overRowCount={props.overRowCount}
            emptyComponent={props.emptyComponent}
            loadingComponent={props.loadingComponent}
            loading={props.loading}
          />
        </>
      )}
    </div>
  )
}

export default (props: AntdTableProps) => {
  return (
    <Provider root={props?.root}>
      <TableWithNoProvider {...props} />
    </Provider>
  )
}
