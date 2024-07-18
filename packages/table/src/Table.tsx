import { VGridTable } from '@grid-table/core/src'
import { useInit, useMethods } from 'einfach-utils'
import './Table.css'
import { BasicContext } from './basic/basicContext'
import { buildBasic, useBasicInit } from './basic'
import { useSticky, useTableClassNameValue } from './hooks'
import { CellBasic } from './components/Cell'
import { Row } from './components/Row'
import { THeadCellBasic } from './components/TheadCell'
import { DragLine } from './components/Drag'

const rowIds = Array(30)
  .fill(null)
  .map((temp, index) => {
    return index
  })

const ColumnCount = 4

const stickyList = {
  // topIndexList: [2, 4, 6],
  // bottomIndexList: [16, 18, 19],
  topIndexList: [],
  bottomIndexList: [],
}

function Table() {
  const { calcRowHeight, calcColumnWidth } = useMethods({
    calcRowHeight(index: number) {
      return index % 2 ? 24 : 36
    },
    calcColumnWidth(index: number) {
      return index % 2 ? 100 : 150
    },
  })

  const { columnCalcSize, rowCalcSize } = useBasicInit({
    columnCalcSize: calcColumnWidth,
    columnCount: ColumnCount,
    rowCalcSize: calcRowHeight,
    rowCount: rowIds.length,
  })
  const { stayIndexList } = useSticky(stickyList)

  const { stayIndexList: rowStayIndexList } = useSticky({
    ...stickyList,
    direction: 'row',
    topSpace: 36,
    // fixed: false,
  })

  const tableClassName = useTableClassNameValue()
  return (
    <VGridTable
      className={`grid-table grid-table-border ${tableClassName}`}
      style={{
        // width: 1000,
        width: 'fit-content',
        height: 600,
      }}
      theadCellComponent={THeadCellBasic}
      theadRowCalcSize={rowCalcSize}
      theadBaseSize={12}

      rowCount={rowIds.length}
      rowCalcSize={rowCalcSize}
      rowBaseSize={12}
      tbodyTrComponent={Row}

      columnCount={ColumnCount}
      columnCalcSize={columnCalcSize}
      // columnBaseSize={50}
      columnBaseSize={10}

      columnStayIndexList={stayIndexList}
      rowStayIndexList={rowStayIndexList}

      cellComponent={CellBasic}
      // columnCalcStyle={columnCalcStyle}
      // columnStayIndexList={columnStayIndexList}

    >
      <DragLine columnBaseSize={10} />
    </VGridTable>
  )
}

export default () => {
  const basicValue = useInit(() => {
    return buildBasic()
  })
  return <BasicContext.Provider value={basicValue}><Table /></BasicContext.Provider>
}
