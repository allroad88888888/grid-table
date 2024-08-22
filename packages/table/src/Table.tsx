import { VGridTable } from '@grid-table/core/src'
import { useInit, useMethods } from 'einfach-utils'
import './Table.css'
import { BasicContext } from './basic/basicContext'
import { buildBasic, useBasicInit } from './basic'
import { useTableClassNameValue } from './hooks'
import { Cell } from './components/Cell'
import { Row } from './components/Row'
import { THeadCellBasic } from './components/TheadCell'
import { atom, useAtomValue, getDefaultStore, Provider as StoreProvider } from 'einfach-state'
import { useEffect, useRef } from 'react'
import { DragLine } from './plugins/drag'
import { useSticky } from './plugins/sticky'
import { useAreaSelected } from './plugins/areaSelected'
import { useTableEvents } from './hooks/useTableEvents'
import { useCopy } from './plugins/copy/useCopy'

const stickyListAtom = atom({
  // topIndexList: [2, 4, 6],
  // bottomIndexList: [16, 18, 19],
  topIndexList: [],
  bottomIndexList: [],
})

const rowCountAtom = atom(30)
const columnCountAtom = atom(40)
// const headerRowCountAtom = atom(0)
const { setter } = getDefaultStore()

function Table() {
  const rowCount = useAtomValue(rowCountAtom)
  const columnCount = useAtomValue(columnCountAtom)
  const stickyList = useAtomValue(stickyListAtom)

  useEffect(() => {
    // setTimeout(() => {
    //   setter(stickyListAtom, {
    //     topIndexList: [3],
    //     bottomIndexList: [16],
    //   })
    // }, 3000)
    // setTimeout(() => {
    //   setter(columnCountAtom, 10)
    // }, 300)
    // setTimeout(() => {
    //   setter(rowCountAtom, 100)
    // }, 500)
  }, [])

  const tableEvents = useTableEvents()

  const { calcRowHeight, calcColumnWidth } = useMethods({
    calcRowHeight(index: number) {
      return index % 2 ? 24 : 36
    },
    calcColumnWidth(index: number) {
      return index % 2 ? 100 : 150
    },
  })

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
  const { stayIndexList } = useSticky(stickyList)

  // const { stayIndexList: rowStayIndexList } = useSticky({
  //   ...stickyList,
  //   direction: 'row',
  //   topSpace: 36,
  //   // fixed: false,
  // })

  const tableClassName = useTableClassNameValue()

  useAreaSelected()

  // console.log('columnStayIndexList', stayIndexList)

  const tableRef = useRef<HTMLDivElement>(null)

  const copy = useCopy()

  /**
   * 这里加个div
   * 作用1 给拖拽 加个定位容器，不然要算高度
   * 作用2 给未来其他业务使用
   */
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
      ref={tableRef}
      {...tableEvents}
    >
      {copy}
      <DragLine columnBaseSize={10} />
      <VGridTable
        className={`grid-table grid-table-border ${tableClassName}`}
        style={{
          height: '100%',
          width: '100%',
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
        columnBaseSize={10}
        columnStayIndexList={stayIndexList}
        // rowStayIndexList={rowStayIndexList}
        cellComponent={Cell}
        onResize={onResize}
      />
    </div>
  )
}

export default () => {
  const basicValue = useInit(() => {
    return buildBasic()
  })
  return (
    <StoreProvider store={basicValue.store}>
      <BasicContext.Provider value={basicValue}>
        <Table />
      </BasicContext.Provider>
    </StoreProvider>
  )
}
