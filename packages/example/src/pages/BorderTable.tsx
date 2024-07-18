import { VGridTable } from '@grid-table/core/src'
import { useMethods } from 'einfach-utils'
import { THeadCellBasic } from '../components/TheadCell'
import { rowIds } from '../mock/rowIds'
import { CellBasic } from '../components/Cell'

function DemoBorderTable() {
  const { calcRowHeight, calcColumnWidth } = useMethods({
    calcRowHeight(index: number) {
      return index % 2 ? 24 : 36
    },
    calcColumnWidth(index: number) {
      return index % 2 ? 100 : 150
    },
  })

  return (
    <VGridTable
      style={{
        width: 1000,
        height: 600,
        overflow: 'auto',
      }}
      theadCellComponent={THeadCellBasic}
      theadRowCalcSize={calcRowHeight}

      rowCount={rowIds.length}
      rowCalcSize={calcRowHeight}
      rowBaseSize={12}

      columnCount={20}
      columnCalcSize={calcColumnWidth}
      columnBaseSize={50}

      cellComponent={CellBasic}
    >
    </VGridTable>
  )
}

export default DemoBorderTable
