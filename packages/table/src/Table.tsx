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
import { atom, useAtomValue, getDefaultStore } from 'einfach-state'
import { useEffect } from 'react'

const stickyList = {
  // topIndexList: [2, 4, 6],
  // bottomIndexList: [16, 18, 19],
  topIndexList: [],
  bottomIndexList: [],
}

const rowCountAtom = atom(0)
const columnCountAtom = atom(8)
// const headerRowCountAtom = atom(0)
const { setter } = getDefaultStore()

function Table() {
  const rowCount = useAtomValue(rowCountAtom)
  const columnCount = useAtomValue(columnCountAtom)

  useEffect(() => {
    setTimeout(() => {
      setter(columnCountAtom, 10)
    }, 1000)

    setTimeout(() => {
      setter(rowCountAtom, 10)
    }, 2000)
  }, [])

  const { calcRowHeight, calcColumnWidth } = useMethods({
    calcRowHeight(index: number) {
      return index % 2 ? 24 : 36
    },
    calcColumnWidth(index: number) {
      return index % 2 ? 100 : 150
    },
  })

  const { columnCalcSize, rowCalcSize, theadCalcSize,
    rowCount: realRowCount, columnCount: realColumnCount } = useBasicInit({
    columnCalcSize: calcColumnWidth,
    columnCount,
    rowCalcSize: calcRowHeight,
    rowCount,
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
      theadRowCalcSize={theadCalcSize}
      theadBaseSize={12}

      rowCount={realRowCount}
      rowCalcSize={rowCalcSize}
      rowBaseSize={12}
      tbodyTrComponent={Row}

      columnCount={realColumnCount}
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
