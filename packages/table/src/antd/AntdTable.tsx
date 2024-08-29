import type { AntdTableProps } from './type'
import { useAutoSizer, VGridTable } from '@grid-table/core/src'
import { useInit } from 'einfach-utils'
import { Provider as StoreProvider } from 'einfach-state'
import { useCallback, useMemo, useRef } from 'react'
import { BasicContext, buildBasic, useBasicInit } from '../basic'
import { useTableEvents } from '../hooks/useTableEvents'
import { useSticky } from '../plugins/sticky'
import { useTableClassNameValue } from '../hooks'
import { useAreaSelected } from '../plugins/areaSelected'
import { useCopy } from '../plugins/copy/useCopy'
import { DragLine } from '../plugins/drag'
import { Row } from '../components'
import { useAutoWidth } from '../plugins/autoWidth'
import './../Table.css'
import { DataCell } from '../plugins/data/Cell'
import { DataProvider } from '../plugins/data/provider'
import { useDataInit } from '../plugins/data/useDataInit'
import { DataCellThead } from '../plugins/data'
import { useRowSelection } from '../plugins/select'

export function AntdTable(props: AntdTableProps) {
  const { columns, dataSource } = props
  const { cellDefaultWidth = 80, rowHeight = 36 } = props

  const ref = useRef<HTMLDivElement>(null)
  const { width } = useAutoSizer(ref)

  const tableEvents = useTableEvents()

  const calcRowHeight = useCallback(
    (index: number) => {
      return rowHeight
    },
    [rowHeight],
  )

  const calcColumnWidth = useAutoWidth({
    width,
    defaultItemWidth: cellDefaultWidth,
    columns,
  })

  const { loading } = useDataInit({
    dataSource,
    columns,
    parentProp: props.parentProp,
    idProp: props.idProp,
    root: props.root,
  })

  const { columnCount, stickyList } = useMemo(() => {
    const leftFixedColList: number[] = []
    const rightFixedColList: number[] = []
    columns.forEach((column, index) => {
      if (column.fixed === 'left') {
        leftFixedColList.push(index)
      }
      if (column.fixed === 'right') {
        rightFixedColList.push(index)
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

  const { rowCount } = useMemo(() => {
    return {
      rowCount: dataSource.length,
    }
  }, [dataSource])

  const {
    columnCalcSize,
    rowCalcSize,
    theadCalcSize,
    onResize,
    rowCount: realRowCount,
    columnCount: realColumnCount,
  } = useBasicInit({
    columnCalcSize: calcColumnWidth,
    columnCount,
    rowCalcSize: calcRowHeight,
    rowCount,
  })

  useRowSelection(props.rowSelection)
  const { stayIndexList } = useSticky(stickyList)

  const tableClassName = useTableClassNameValue()
  useAreaSelected()

  const copy = useCopy()

  return (
    <div
      style={{
        maxWidth: '100%',
        width: loading ? '100%' : 'fit-content',
        height: 'auto',
        maxHeight: '100%',
        position: 'relative',
      }}
      ref={ref}
      {...tableEvents}
    >
      {loading ? (
        <div>loading</div>
      ) : (
        <>
          {copy}
          <DragLine columnBaseSize={1} width={width} />
          <VGridTable
            className={`grid-table grid-table-border ${tableClassName}`}
            style={{
              height: '100%',
              width: '100%',
            }}
            theadCellComponent={DataCellThead}
            theadRowCalcSize={theadCalcSize}
            theadBaseSize={12}
            rowCount={realRowCount}
            rowCalcSize={rowCalcSize}
            rowBaseSize={12}
            tbodyTrComponent={Row}
            columnCount={realColumnCount}
            columnCalcSize={columnCalcSize}
            columnBaseSize={1}
            columnStayIndexList={stayIndexList}
            cellComponent={DataCell}
            onResize={onResize}
          />
        </>
      )}
    </div>
  )
}

export default (props: AntdTableProps) => {
  const basicValue = useInit(() => {
    return buildBasic()
  })
  return (
    <StoreProvider store={basicValue.store}>
      <BasicContext.Provider value={basicValue}>
        <DataProvider store={basicValue.store} root={props?.root}>
          <AntdTable {...props} />
        </DataProvider>
      </BasicContext.Provider>
    </StoreProvider>
  )
}
