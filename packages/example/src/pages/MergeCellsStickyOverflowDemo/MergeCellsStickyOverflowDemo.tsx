import { createStore } from '@einfach/react'
import { useEffect, useMemo, useState } from 'react'
import type { ColumnType, MergeCellIdItem } from '@grid-table/view'
import { Table, tbodyMergeCellListAtom, getCellId } from '@grid-table/view'
import './MergeCellsStickyOverflowDemo.css'

type DemoRow = {
  id: string
  rowLabel: string
  scene: string
  owner: string
  chain: string
  phase: string
  status: string
  note: string
}

const BIG_BLOCK_END = 48
const NORMAL_BLOCK_END = 56
const SECOND_MERGE_END = 64
const CHAIN_FIRST_BLOCK_END = 32
const CHAIN_SECOND_BLOCK_END = 72

const baseColumns: ColumnType[] = [
  {
    title: '行号',
    key: 'rowLabel',
    dataIndex: 'rowLabel',
    width: 72,
    fixed: 'left',
    align: 'center',
  },
  {
    title: '场景',
    key: 'scene',
    dataIndex: 'scene',
    width: 240,
    fixed: 'left',
    render: (value) => <div className="merge-sticky-demo__cell-title">{String(value)}</div>,
  },
  {
    title: '负责人',
    key: 'owner',
    dataIndex: 'owner',
    width: 180,
    fixed: 'left',
    render: (value) => <div className="merge-sticky-demo__cell-subtitle">{String(value)}</div>,
  },
  {
    title: '阶段',
    key: 'phase',
    dataIndex: 'phase',
    width: 140,
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: 160,
  },
  {
    title: '备注',
    key: 'note',
    dataIndex: 'note',
    width: 340,
    render: (value) => <div className="merge-sticky-demo__note">{String(value)}</div>,
  },
]

const stickyStressColumn: ColumnType = {
  title: '连续超长 merge 列',
  key: 'chain',
  dataIndex: 'chain',
  width: 260,
  render: (value) => <div className="merge-sticky-demo__chain">{String(value)}</div>,
}

function getColumns(stickyMergeCell: boolean): ColumnType[] {
  if (!stickyMergeCell) {
    return baseColumns
  }

  return [
    baseColumns[0],
    baseColumns[1],
    baseColumns[2],
    stickyStressColumn,
    baseColumns[3],
    baseColumns[4],
    baseColumns[5],
  ]
}

function buildRows(): DemoRow[] {
  return Array.from({ length: 84 }, (_, index) => {
    const rowNumber = index + 1
    const chain =
      index < CHAIN_FIRST_BLOCK_END
        ? '连续 merge C1：rows 1-32，下面立刻接另一个超长 merge'
        : index < CHAIN_SECOND_BLOCK_END
          ? '连续 merge C2：rows 33-72，紧贴在 C1 下方'
          : `尾部普通 chain ${rowNumber}`

    if (index < BIG_BLOCK_END) {
      return {
        id: `sticky-merge-row-${rowNumber}`,
        rowLabel: `${rowNumber}`,
        scene: '超高合并块 A：内容应该一直可见，但不能盖住下面的普通格子',
        owner: 'Block A / rows 1-48 / merge scene + owner',
        chain,
        phase: index < 16 ? '采集' : index < 32 ? '清洗' : '校验',
        status: `A-${rowNumber.toString().padStart(2, '0')}`,
        note:
          index === 0
            ? '向下滚动到合并块末尾，再继续滚动。你应该能在离开 A 之后立即看到普通行和下面的小 merge。'
            : `A 区内部普通辅助列 ${rowNumber}`,
      }
    }

    if (index < NORMAL_BLOCK_END) {
      return {
        id: `sticky-merge-row-${rowNumber}`,
        rowLabel: `${rowNumber}`,
        scene: `普通行 ${rowNumber}`,
        owner: `Owner ${rowNumber}`,
        chain,
        phase: '普通行',
        status: `Normal-${rowNumber}`,
        note: '这几行紧跟在超高 merge 下方，用来确认不会被上面的 sticky 内容遮住。',
      }
    }

    if (index < SECOND_MERGE_END) {
      return {
        id: `sticky-merge-row-${rowNumber}`,
        rowLabel: `${rowNumber}`,
        scene: '下方合并块 B：用来验证“merge 下面还是 merge”也不会被 A 盖住',
        owner: 'Block B / rows 57-64 / merge scene + owner',
        chain,
        phase: '二级合并',
        status: `B-${rowNumber}`,
        note: '如果这里能正常出现，说明上面的超高 merge 没有越界覆盖后续区域。',
      }
    }

    return {
      id: `sticky-merge-row-${rowNumber}`,
      rowLabel: `${rowNumber}`,
      scene: `尾部普通行 ${rowNumber}`,
      owner: `Tail ${rowNumber}`,
      chain,
      phase: '尾部',
      status: `Tail-${rowNumber}`,
      note: '尾部普通行，继续确认离开所有 merge 后表格恢复正常。',
    }
  })
}

function buildMergeCells(rows: DemoRow[], stickyMergeCell: boolean): MergeCellIdItem[] {
  const bigBlockRowIds = rows.slice(1, BIG_BLOCK_END).map((row) => row.id)
  const secondBlockStart = NORMAL_BLOCK_END
  const secondBlockRowIds = rows.slice(secondBlockStart + 1, SECOND_MERGE_END).map((row) => row.id)

  const mergeCells: MergeCellIdItem[] = [
    {
      cellId: getCellId({ rowId: rows[0].id, columnId: 'scene' }),
      rowIdList: bigBlockRowIds,
      colIdList: ['owner'],
    },
    {
      cellId: getCellId({ rowId: rows[secondBlockStart].id, columnId: 'scene' }),
      rowIdList: secondBlockRowIds,
      colIdList: ['owner'],
    },
  ]

  if (!stickyMergeCell) {
    return mergeCells
  }

  mergeCells.push(
    {
      cellId: getCellId({ rowId: rows[0].id, columnId: 'chain' }),
      rowIdList: rows.slice(1, CHAIN_FIRST_BLOCK_END).map((row) => row.id),
      colIdList: [],
    },
    {
      cellId: getCellId({ rowId: rows[CHAIN_FIRST_BLOCK_END].id, columnId: 'chain' }),
      rowIdList: rows.slice(CHAIN_FIRST_BLOCK_END + 1, CHAIN_SECOND_BLOCK_END).map((row) => row.id),
      colIdList: [],
    },
  )

  return mergeCells
}

function DemoTable({
  stickyMergeCell,
  title,
  description,
}: {
  stickyMergeCell: boolean
  title: string
  description: string
}) {
  const [store] = useState(() => createStore())
  const rows = useMemo(() => buildRows(), [])
  const mergeCells = useMemo(() => buildMergeCells(rows, stickyMergeCell), [rows, stickyMergeCell])
  const columns = useMemo(() => getColumns(stickyMergeCell), [stickyMergeCell])

  useEffect(() => {
    store.setter(tbodyMergeCellListAtom, mergeCells)
  }, [mergeCells, store])

  return (
    <section className="merge-sticky-demo__panel">
      <div className="merge-sticky-demo__panel-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="merge-sticky-demo__table">
        <Table
          store={store}
          idProp="id"
          columns={columns}
          dataSource={rows}
          rowHeight={40}
          stickyMergeCell={stickyMergeCell}
          showHorizontalBorder={true}
          showVerticalBorder={true}
          enableColumnResize={true}
          enableHeadContextMenu={true}
          zebra={true}
          overRowCount={10}
          style={{
            width: '100%',
            height: 320,
          }}
        />
      </div>
    </section>
  )
}

export function MergeCellsStickyOverflowDemo() {
  return (
    <div className="merge-sticky-demo">
      <header className="merge-sticky-demo__header">
        <h1>超高合并单元格 Demo</h1>
        <p>
          这个页面专门验证“大跨度 row merge 超出容器高度”时的行为。核心观察点是：
          合并块内部内容要始终可见，但不能越过自己的合并区域去盖住后面的普通行或下一个 merge。
        </p>
        <div className="merge-sticky-demo__checklist">
          <span>1. 先在上面的 A 合并块里往下滚</span>
          <span>2. 离开 A 后，应该立即看到普通行 49-56</span>
          <span>3. 再继续往下，应该能正常看到 B 合并块</span>
        </div>
      </header>

      <DemoTable
        stickyMergeCell={true}
        title="修复后：stickyMergeCell = true"
        description="内容 sticky 只发生在 merge 内层。这里额外加了一列“连续超长 merge 列”，专门验证一个超长 merge 下面立刻接另一个超长 merge 的情况。"
      />

      <DemoTable
        stickyMergeCell={false}
        title="对比基线：stickyMergeCell = false"
        description="这个版本不做内容 sticky。你会更容易看到超高 merge 内部出现大片空白，对比更直观。"
      />
    </div>
  )
}

export default MergeCellsStickyOverflowDemo
