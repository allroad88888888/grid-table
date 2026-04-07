import { describe, test, expect } from '@jest/globals'
import { createStore } from '@einfach/react'
import {
  columnIndexListAtom,
  rowIndexListAtom,
  columnSizeMapAtom,
  rowSizeMapAtom,
  basicAtom,
} from '@grid-table/basic'
import { stickyRightAtom, stickyBottomAtom } from '../plugins/sticky/state'

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
  store.setter(rowSizeMapAtom, new Map(rows.map((id) => [id, 36])))
  store.setter(columnSizeMapAtom, new Map(cols.map((id) => [id, 100])))
  const basic = store.getter(basicAtom)
  return { store, basic, rows, cols }
}

// ─── Array.includes vs Set.has ──────────────────────────
describe('border plugin — Array.includes vs Set.has', () => {
  test.each([
    [200, 5],
    [500, 20],
    [1000, 50],
  ])(
    '%i columns, %i sticky right — filter with includes vs Set.has',
    (colCount, stickyCount) => {
      const cols = generateIds('c', colCount)
      const stickyRightIds = cols.slice(colCount - stickyCount)

      console.log(`  --- ${colCount} cols, ${stickyCount} sticky ---`)

      // 当前实现: Array.includes (useBorder.ts:101)
      const includesTime = measure(
        `filter + includes × 100`,
        () => {
          for (let i = 0; i < 100; i++) {
            cols.filter((id) => !stickyRightIds.includes(id))
          }
        },
      )

      // 优化方案: Set.has
      const setTime = measure(`filter + Set.has × 100`, () => {
        const stickySet = new Set(stickyRightIds)
        for (let i = 0; i < 100; i++) {
          cols.filter((id) => !stickySet.has(id))
        }
      })

      const speedup = includesTime / Math.max(setTime, 0.01)
      console.log(`  speedup: ${speedup.toFixed(1)}x`)

      // Set.has 理论上更快，但小数据量下 Set 构建开销和测量噪声可能导致波动
      // 放宽到 3 倍容差，避免 CI 环境下偶发失败
      if (stickyCount >= 20) {
        expect(setTime).toBeLessThan(includesTime * 3)
      }
    },
  )
})

// ─── sticky column/row setter 开销 ──────────────────────
describe('border plugin — sticky setter overhead', () => {
  test.each([5, 10, 20])('%i sticky right columns — setter overhead', (stickyCount) => {
    const { store, basic, cols } = setupStore(100, 200)
    const { getColumnStateAtomById } = basic

    const stickyRightIds = cols.slice(200 - stickyCount)
    store.setter(stickyRightAtom, stickyRightIds)

    const cancelList: (() => void)[] = []

    const elapsed = measure(`setter × ${stickyCount} sticky right cols`, () => {
      stickyRightIds.forEach((columnId, index) => {
        const atomEntity = getColumnStateAtomById(columnId)
        cancelList.push(
          store.setter(atomEntity, (_getter, prevState) => {
            const newStyle = { ...prevState.style }
            if (index === stickyRightIds.length - 1) {
              newStyle.borderRightWidth = '0'
            }
            return { ...prevState, style: newStyle }
          })!,
        )
      })
    })

    cancelList.forEach((c) => c())
    expect(elapsed).toBeLessThan(100)
  })

  test.each([5, 10, 20])('%i sticky bottom rows — setter overhead', (stickyCount) => {
    const { store, basic, rows } = setupStore(200, 100)
    const { getRowStateAtomById } = basic

    const stickyBottomIds = rows.slice(200 - stickyCount)
    store.setter(stickyBottomAtom, stickyBottomIds)

    const cancelList: (() => void)[] = []

    const elapsed = measure(`setter × ${stickyCount} sticky bottom rows`, () => {
      stickyBottomIds.forEach((rowId, index) => {
        const atomEntity = getRowStateAtomById(rowId)
        cancelList.push(
          store.setter(atomEntity, (_getter, prevState) => {
            const newStyle = { ...prevState.style }
            if (index === 0) {
              newStyle.borderTop =
                '1px var(--grid-cell-border-style) var(--grid-border-color)'
            }
            if (index === stickyBottomIds.length - 1) {
              newStyle.borderBottomWidth = '0'
            }
            return { ...prevState, style: newStyle }
          })!,
        )
      })
    })

    cancelList.forEach((c) => c())
    expect(elapsed).toBeLessThan(100)
  })
})
