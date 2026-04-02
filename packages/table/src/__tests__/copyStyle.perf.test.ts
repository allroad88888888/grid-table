import { describe, test, expect } from '@jest/globals'
import { createStore } from '@einfach/react'
import {
  columnIndexListAtom,
  rowIndexListAtom,
  columnSizeMapAtom,
  rowSizeMapAtom,
  basicAtom,
  headerRowIndexListAtom,
} from '@grid-table/basic'
import { getCellId } from '../utils/getCellId'
import { createCopyBorderStyle } from '../plugins/copy/copyUtils'

function measure(label: string, fn: () => void): number {
  const start = performance.now()
  fn()
  const elapsed = performance.now() - start
  console.log(`  ${label}: ${elapsed.toFixed(2)}ms`)
  return elapsed
}

function generateIds(prefix: string, count: number) {
  return Array.from({ length: count }, (_, i) => `${prefix}_${i}`)
}

function setupStore(rowCount: number, colCount: number) {
  const store = createStore()
  const rows = generateIds('r', rowCount)
  const cols = generateIds('c', colCount)
  store.setter(rowIndexListAtom, rows)
  store.setter(columnIndexListAtom, cols)
  store.setter(headerRowIndexListAtom, ['h_0'])
  store.setter(rowSizeMapAtom, new Map(rows.map((id) => [id, 36])))
  store.setter(columnSizeMapAtom, new Map(cols.map((id) => [id, 100])))
  const basic = store.getter(basicAtom)
  return { store, basic, rows, cols }
}

function buildCellGrid(rows: string[], cols: string[]) {
  return rows.map((rowId) => cols.map((colId) => getCellId({ rowId, columnId: colId })))
}

// ─── createCopyBorderStyle 计算开销 ──────────────────────
describe('createCopyBorderStyle computation', () => {
  test.each([100, 2500, 10000])('%i cells — pure border style computation', (cellCount) => {
    const cols = Math.round(Math.sqrt(cellCount))
    const rows = Math.ceil(cellCount / cols)

    const elapsed = measure(`createCopyBorderStyle × ${rows * cols}`, () => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          createCopyBorderStyle({
            currentRowIndex: r,
            totalRowLength: rows,
            columnIndex: c,
            columnLength: cols,
            prevStyle: {},
          })
        }
      }
    })
    expect(elapsed).toBeLessThan(cellCount > 5000 ? 100 : 50)
  })
})

// ─── 嵌套 setter 循环（模拟 useCopyStyle）───────────────
describe('copy style — nested setter loop', () => {
  test.each([
    [10, 10],
    [50, 50],
  ])('%ix%i cells — store.setter per cell (tbody)', (rowCount, colCount) => {
    const { store, basic, rows, cols } = setupStore(rowCount * 2, colCount * 2)
    const { getCellStateAtomById } = basic

    const selectedRows = rows.slice(0, rowCount)
    const selectedCols = cols.slice(0, colCount)
    const cellGrid = buildCellGrid(selectedRows, selectedCols)
    const total = rowCount * colCount

    const cancelList: (() => void)[] = []
    const elapsed = measure(`copy setter × ${total} cells`, () => {
      let currentRowIndex = 0
      cellGrid.forEach((rowCellIds) => {
        const columnLength = rowCellIds.length
        rowCellIds.forEach((cellId, columnIndex) => {
          cancelList.push(
            store.setter(getCellStateAtomById(cellId), (_getter, prev) => {
              return {
                ...prev,
                style: createCopyBorderStyle({
                  currentRowIndex,
                  totalRowLength: rowCount,
                  columnIndex,
                  columnLength,
                  prevStyle: prev.style || {},
                }),
              }
            })!,
          )
        })
        currentRowIndex++
      })
    })

    cancelList.forEach((cancel) => cancel())
    expect(elapsed).toBeLessThan(total > 1000 ? 5000 : 1000)
  })

  test('开销拆解：border computation vs setter (50×50)', () => {
    const rowCount = 50
    const colCount = 50
    const { store, basic, rows, cols } = setupStore(rowCount * 2, colCount * 2)
    const { getCellStateAtomById } = basic

    const selectedRows = rows.slice(0, rowCount)
    const selectedCols = cols.slice(0, colCount)
    const cellGrid = buildCellGrid(selectedRows, selectedCols)
    console.log('  --- 2500 cells copy style overhead breakdown ---')

    // Step 1: 纯 border style 计算
    const computeTime = measure('border computation × 2500', () => {
      let r = 0
      cellGrid.forEach((rowCellIds) => {
        rowCellIds.forEach((_, c) => {
          createCopyBorderStyle({
            currentRowIndex: r,
            totalRowLength: rowCount,
            columnIndex: c,
            columnLength: colCount,
            prevStyle: {},
          })
        })
        r++
      })
    })

    // Step 2: 完整 setter（含计算）
    const cancelList: (() => void)[] = []
    const fullTime = measure('full setter + compute × 2500', () => {
      let currentRowIndex = 0
      cellGrid.forEach((rowCellIds) => {
        rowCellIds.forEach((cellId, columnIndex) => {
          cancelList.push(
            store.setter(getCellStateAtomById(cellId), (_getter, prev) => {
              return {
                ...prev,
                style: createCopyBorderStyle({
                  currentRowIndex,
                  totalRowLength: rowCount,
                  columnIndex,
                  columnLength: colCount,
                  prevStyle: prev.style || {},
                }),
              }
            })!,
          )
        })
        currentRowIndex++
      })
    })

    cancelList.forEach((cancel) => cancel())
    const setterOverhead = fullTime - computeTime
    console.log(
      `  computation: ${((computeTime / fullTime) * 100).toFixed(0)}%, setter: ${((setterOverhead / fullTime) * 100).toFixed(0)}%`,
    )
  })

  test('thead + tbody 混合: 3 thead rows + 50 tbody rows × 20 cols', () => {
    const { store, basic, rows, cols } = setupStore(200, 40)
    const { getCellStateAtomById, getTheadCellStateAtomById } = basic

    const theadRows = ['h_0', 'h_1', 'h_2']
    const tbodyRows = rows.slice(0, 50)
    const selectedCols = cols.slice(0, 20)

    const theadGrid = buildCellGrid(theadRows, selectedCols)
    const tbodyGrid = buildCellGrid(tbodyRows, selectedCols)
    const totalRows = theadRows.length + tbodyRows.length
    const total = totalRows * selectedCols.length

    const cancelList: (() => void)[] = []
    const elapsed = measure(`mixed copy setter × ${total} cells`, () => {
      let currentRowIndex = 0

      // thead
      theadGrid.forEach((rowCellIds) => {
        rowCellIds.forEach((cellId, columnIndex) => {
          cancelList.push(
            store.setter(getTheadCellStateAtomById(cellId), (_getter, prev) => {
              return {
                ...prev,
                style: createCopyBorderStyle({
                  currentRowIndex,
                  totalRowLength: totalRows,
                  columnIndex,
                  columnLength: selectedCols.length,
                  prevStyle: prev.style || {},
                }),
              }
            })!,
          )
        })
        currentRowIndex++
      })

      // tbody
      tbodyGrid.forEach((rowCellIds) => {
        rowCellIds.forEach((cellId, columnIndex) => {
          cancelList.push(
            store.setter(getCellStateAtomById(cellId), (_getter, prev) => {
              return {
                ...prev,
                style: createCopyBorderStyle({
                  currentRowIndex,
                  totalRowLength: totalRows,
                  columnIndex,
                  columnLength: selectedCols.length,
                  prevStyle: prev.style || {},
                }),
              }
            })!,
          )
        })
        currentRowIndex++
      })
    })

    cancelList.forEach((cancel) => cancel())
    expect(elapsed).toBeLessThan(2000)
  })
})
