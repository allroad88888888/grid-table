import { useAutoSizer, VGridTable } from '@grid-table/core'
import { useAtomValue } from 'einfach-state'
import { Fragment, useMemo, useRef } from 'react'
import type { RowId } from '@grid-table/basic'
import { getIdByObj, useBasic } from '@grid-table/basic'
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

import './Table.css'

export function TableWithNoProvider(props: AntdTableProps) {
  const { columns, dataSource } = props
  const { cellDefaultWidth = 80, rowHeight = 36 } = props

  const ref = useRef<HTMLDivElement>(null)
  const { width } = useAutoSizer(ref)

  const tableEvents = useTableEvents()

  const { store, rowIdShowListAtom, columnIdShowListAtom } = useBasic()

  const rowIdShowList = useAtomValue(rowIdShowListAtom, { store })
  const columnIdShowList = useAtomValue(columnIdShowListAtom, { store })

  const { loading } = useDataInit({
    dataSource,
    columns,
    parentProp: props.parentProp,
    idProp: props.idProp,
    root: props.root,
  })

  const { stickyList } = useMemo(() => {
    const leftFixedColList: RowId[] = []
    const rightFixedColList: RowId[] = []
    columns.forEach((column, index) => {
      const columnId = getIdByObj(column)
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
  const { stayIndexList } = useSticky(stickyList)

  const tableClassName = useTableClassNameValue()
  useAreaSelected({ enable: props.enableCopy })

  const copy = useCopy({
    enable: props.enableCopy,
  })

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
            rowCount={rowIdShowList.length}
            rowCalcSize={calcRowSizeByIndex}
            rowBaseSize={props.rowBaseSize || props.rowHeight}
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
