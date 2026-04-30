import type { ColumnType, MergeCellIdItem } from '@grid-table/view'
import { Table, tbodyMergeCellListAtom, getCellId } from '@grid-table/view'
import { createStore } from '@einfach/react'
import { useMemo, useState } from 'react'
// @ts-ignore
import './MergeCellsSortDemo.css'

const ROW_ID_KEY = 'id'

type Person = {
  id: string
  name: string
  department: string
  city: string
  level: string
}

const SOURCE: Person[] = [
  { id: '1', name: 'Alice', department: '研发', city: '北京', level: 'P6' },
  { id: '2', name: 'Bob', department: '产品', city: '上海', level: 'P5' },
  { id: '3', name: 'Cathy', department: '设计', city: '北京', level: 'P5' },
  { id: '4', name: 'David', department: '设计', city: '上海', level: 'P6' },
  { id: '5', name: 'Eve', department: '产品', city: '北京', level: 'P7' },
  { id: '6', name: 'Frank', department: '设计', city: '上海', level: 'P5' },
  { id: '7', name: 'Grace', department: '研发', city: '北京', level: 'P6' },
  { id: '8', name: 'Henry', department: '产品', city: '上海', level: 'P7' },
]

type SortMode = 'default' | 'department' | 'city'

const SORT_OPTIONS: { mode: SortMode; label: string; hint: string }[] = [
  {
    mode: 'default',
    label: '默认顺序',
    hint: 'Alice 的「部门」单元格独立显示，不与上下行合并。',
  },
  {
    mode: 'department',
    label: '按部门排序',
    hint: 'Alice 与 Grace 同为「研发」，相邻后这两行被合并。',
  },
  {
    mode: 'city',
    label: '按城市排序',
    hint: 'Alice 的相邻行变为 Cathy（设计）等，「部门」单元格再次独立。',
  },
]

function sortBy(list: Person[], mode: SortMode): Person[] {
  if (mode === 'default') return list.slice()
  return list.slice().sort((a, b) => {
    const av = a[mode]
    const bv = b[mode]
    if (av === bv) return Number(a.id) - Number(b.id)
    return av < bv ? -1 : 1
  })
}

const MERGE_COLUMNS = ['department', 'city'] as const

function buildMergeCells(rows: Person[]): MergeCellIdItem[] {
  const result: MergeCellIdItem[] = []
  if (rows.length === 0) return result

  for (const col of MERGE_COLUMNS) {
    let startIdx = 0
    let startVal = String(rows[0][col] ?? '')
    for (let i = 1; i <= rows.length; i++) {
      const curVal = i < rows.length ? String(rows[i][col] ?? '') : null
      if (curVal === startVal && curVal !== '') {
        continue
      }
      const span = i - startIdx
      if (span > 1) {
        const masterRowId = rows[startIdx].id
        const childRowIds: string[] = []
        for (let j = startIdx + 1; j < i; j++) {
          childRowIds.push(rows[j].id)
        }
        result.push({
          cellId: getCellId({ rowId: masterRowId, columnId: col }),
          rowIdList: childRowIds,
          colIdList: [],
        })
      }
      startIdx = i
      startVal = curVal ?? ''
    }
  }
  return result
}

const columns: ColumnType[] = [
  { title: 'ID', key: 'id', dataIndex: 'id', width: 70, align: 'center' },
  { title: '姓名', key: 'name', dataIndex: 'name', width: 110 },
  { title: '部门', key: 'department', dataIndex: 'department', width: 130, align: 'center' },
  { title: '城市', key: 'city', dataIndex: 'city', width: 110, align: 'center' },
  { title: '职级', key: 'level', dataIndex: 'level', width: 90, align: 'center' },
]

export function MergeCellsSortDemo() {
  const [store] = useState(() => createStore())
  const [mode, setMode] = useState<SortMode>('default')

  const { rows, mergeCells } = useMemo(() => {
    const sorted = sortBy(SOURCE, mode)
    return { rows: sorted, mergeCells: buildMergeCells(sorted) }
  }, [mode])

  useMemo(() => {
    store.setter(tbodyMergeCellListAtom, mergeCells)
  }, [store, mergeCells])

  const aliceMergedWith = useMemo(() => {
    const aliceIdx = rows.findIndex((r) => r.name === 'Alice')
    if (aliceIdx === -1) return null
    const item = mergeCells.find(
      (m) => m.cellId === getCellId({ rowId: rows[aliceIdx].id, columnId: 'department' }),
    )
    if (!item) return null
    const peers = (item.rowIdList as string[])
      .map((rid: string) => rows.find((r) => r.id === rid)?.name)
      .filter(Boolean) as string[]
    return peers
  }, [rows, mergeCells])

  const activeHint = SORT_OPTIONS.find((o) => o.mode === mode)?.hint ?? ''

  return (
    <div className="merge-cells-sort-demo">
      <div className="merge-cells-sort-demo__header">
        <h2>合并单元格 — 排序联动示例</h2>
        <p className="merge-cells-sort-demo__desc">
          演示同一单元格随数据排序变化在「不合并 → 合并 → 不合并」之间切换：
          列方向上相邻行的相同值会被自动合并。点击下方按钮切换排序方式，
          观察 <strong>Alice</strong> 所在「部门」单元格的合并状态。
        </p>
        <div className="merge-cells-sort-demo__actions">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.mode}
              type="button"
              className={
                'merge-cells-sort-demo__btn' +
                (opt.mode === mode ? ' merge-cells-sort-demo__btn--active' : '')
              }
              onClick={() => setMode(opt.mode)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="merge-cells-sort-demo__info">
          <span>当前模式：<strong>{SORT_OPTIONS.find((o) => o.mode === mode)?.label}</strong></span>
          <span>合并区域：<strong>{mergeCells.length}</strong> 个</span>
          <span>
            Alice 部门单元格：
            <strong>
              {aliceMergedWith && aliceMergedWith.length > 0
                ? `合并（与 ${aliceMergedWith.join('、')}）`
                : '未合并'}
            </strong>
          </span>
        </div>
        <p className="merge-cells-sort-demo__hint">{activeHint}</p>
      </div>
      <div className="merge-cells-sort-demo__table">
        <Table
          style={{ width: '100%', height: 360 }}
          idProp={ROW_ID_KEY}
          columns={columns}
          dataSource={rows}
          store={store}
          enableCopy
          enableSelectArea
          enableHeadContextMenu
          enableColumnResize
          showHorizontalBorder
          showVerticalBorder
          rowHeight={36}
          cellDefaultWidth={120}
        />
      </div>
    </div>
  )
}

export default MergeCellsSortDemo
