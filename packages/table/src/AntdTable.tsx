import { useAutoSizer, VGridTable } from '@grid-table/core/src'
import { useInit } from 'einfach-utils'
import { Provider as StoreProvider, useAtomValue } from 'einfach-state'
import { useMemo, useRef } from 'react'
import type { RowId } from '@grid-table/basic/src'
import { BasicContext, createCore, getIdByObj, useBasic } from '@grid-table/basic/src'
import { useTableEvents } from './hooks/useTableEvents'
import { useSticky } from './plugins/sticky'
import { useTableClassNameValue } from './hooks'
import { useAreaSelected } from './plugins/areaSelected'
import { useCopy } from './plugins/copy/useCopy'
import { DragLine } from './plugins/drag'
import './Table.css'
import { useRowSelection } from './plugins/select'
import { useCellSizeByColumn } from './plugins/calcSizeByColumn/useSizeByColumn'
import type { AntdTableProps } from './types/type'
import { DataProvider, useDataInit } from './core'
import { DataCell, DataCellThead, Row } from './components'

export function AntdTable(props: AntdTableProps) {
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
        border: '1px solid red',
      }}
      ref={ref}
      {...tableEvents}
    >
      {loading ? (
        <div>loading</div>
      ) : (
        <>
          {copy}
          <DragLine columnBaseSize={1} />
          <VGridTable
            className={`grid-table grid-table-border ${tableClassName}`}
            style={{
              height: '100%',
              width: '100%',
            }}
            theadCellComponent={DataCellThead}
            theadRowCalcSize={calcHeadRowSizeByIndex}
            theadBaseSize={12}
            rowCount={rowIdShowList.length}
            rowCalcSize={calcRowSizeByIndex}
            rowBaseSize={12}
            tbodyTrComponent={Row}
            columnCount={columnIdShowList.length}
            columnCalcSize={calcColumnSizeByIndex}
            columnBaseSize={1}
            columnStayIndexList={stayIndexList}
            cellComponent={DataCell}
            // onResize={onResize}
          />
        </>
      )}
    </div>
  )
}

export default (props: AntdTableProps) => {
  const basicValue = useInit(() => {
    return createCore()
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
