import type { ColumnType } from '@grid-table/view'
import { Table, tbodyMergeCellListAtom, getCellId } from '@grid-table/view'
import type { MergeCellIdItem } from '@grid-table/view'
import { createStore } from '@einfach/react'
import { useMemo, useState } from 'react'
import rawData from '../demo.json'
import './MergeCellsDemo.css'

const ROW_ID_KEY = '_merge_row_id'

// 需要展开的子数组 key
const ARRAY_KEYS = ['test0730B_test_0730', 'test0730A_test_0730', 'test0730C_test_0730'] as const

/**
 * 将 demo.json 数据拍平：
 * 1. 取所有子数组最大长度作为展开行数
 * 2. 每行都填充父级字段值
 * 3. 子数组字段按行填入
 */
function flattenData(list: Record<string, any>[]) {
  const result: Record<string, any>[] = []
  let rowIndex = 0

  for (const record of list) {
    // 获取各子数组及最大长度
    const arrays = ARRAY_KEYS.map((key) => {
      const val = record[key]
      return Array.isArray(val) ? val : []
    })
    const maxLen = Math.max(1, ...arrays.map((a) => a.length))

    // 父级字段值
    const dyy = record.dyy ?? {}
    const parentValues: Record<string, any> = {
      idd: record.idd ?? '',
      date: record.date ?? '',
      text: record.text ?? '',
      dyy: dyy['zh-cn'] ?? dyy.en ?? '',
      int: record.int,
      status1: record.status1 ?? '',
    }

    for (let i = 0; i < maxLen; i++) {
      rowIndex += 1
      const row: Record<string, any> = {
        [ROW_ID_KEY]: rowIndex.toString(),
        // 每行都填父级值（用于自动合并检测）
        ...parentValues,
      }

      // 填入子数组字段
      for (let k = 0; k < ARRAY_KEYS.length; k++) {
        const arr = arrays[k]
        const prefix = ARRAY_KEYS[k]
        if (i < arr.length && arr[i]) {
          const child = arr[i]
          row[`${prefix}||idd`] = child.idd ?? ''
          row[`${prefix}||text`] = child.text ?? ''
          const cDyy = child.dyy ?? {}
          row[`${prefix}||dyy`] = cDyy['zh-cn'] ?? cDyy.en ?? ''
          row[`${prefix}||company`] = child.company_0730?.jc ?? ''
        }
      }

      result.push(row)
    }
  }

  return result
}

/**
 * 对拍平后的数据，逐列扫描连续相同值，生成合并单元格配置
 */
function autoMerge(data: Record<string, any>[], columnKeys: string[]): MergeCellIdItem[] {
  const mergeCells: MergeCellIdItem[] = []
  if (data.length === 0) return mergeCells

  for (const col of columnKeys) {
    let startIdx = 0
    let startVal = stringify(data[0][col])

    for (let i = 1; i <= data.length; i++) {
      const curVal = i < data.length ? stringify(data[i][col]) : null
      if (curVal === startVal && curVal !== '') {
        continue
      }
      // 连续相同值区间 [startIdx, i-1]
      const spanLen = i - startIdx
      if (spanLen > 1) {
        const masterRowId = data[startIdx][ROW_ID_KEY]
        const childRowIds: string[] = []
        for (let j = startIdx + 1; j < i; j++) {
          childRowIds.push(data[j][ROW_ID_KEY])
        }
        mergeCells.push({
          cellId: getCellId({ rowId: masterRowId, columnId: col }),
          rowIdList: childRowIds,
          colIdList: [],
        })
      }
      startIdx = i
      startVal = curVal ?? ''
    }
  }

  return mergeCells
}

function stringify(val: any): string {
  if (val === undefined || val === null) return ''
  return String(val)
}

// 构建列定义（key 必须与 dataIndex 一致，否则 getCellId 匹配不上内部列 ID）
function buildColumns(): ColumnType[] {
  const cols: ColumnType[] = [
    { title: 'ID', key: 'idd', dataIndex: 'idd', width: 100, fixed: 'left' },
    { title: '日期', key: 'date', dataIndex: 'date', width: 160 },
    { title: '文本', key: 'text', dataIndex: 'text', width: 130 },
    { title: '多语言', key: 'dyy', dataIndex: 'dyy', width: 130 },
    { title: '数值', key: 'int', dataIndex: 'int', width: 90, align: 'right' },
    { title: '状态', key: 'status1', dataIndex: 'status1', width: 60, align: 'center' },
  ]

  // test0730B 子项列
  const prefixB = 'test0730B_test_0730'
  cols.push(
    { title: 'B-ID', key: `${prefixB}||idd`, dataIndex: `${prefixB}||idd`, width: 100 },
    { title: 'B-文本', key: `${prefixB}||text`, dataIndex: `${prefixB}||text`, width: 100 },
    { title: 'B-多语言', key: `${prefixB}||dyy`, dataIndex: `${prefixB}||dyy`, width: 110 },
    { title: 'B-公司', key: `${prefixB}||company`, dataIndex: `${prefixB}||company`, width: 100 },
  )

  // test0730A 子项列
  const prefixA = 'test0730A_test_0730'
  cols.push(
    { title: 'A-ID', key: `${prefixA}||idd`, dataIndex: `${prefixA}||idd`, width: 100 },
    { title: 'A-文本', key: `${prefixA}||text`, dataIndex: `${prefixA}||text`, width: 100 },
    { title: 'A-多语言', key: `${prefixA}||dyy`, dataIndex: `${prefixA}||dyy`, width: 110 },
    { title: 'A-公司', key: `${prefixA}||company`, dataIndex: `${prefixA}||company`, width: 100 },
  )

  return cols
}

const columns = buildColumns()
const allColumnKeys = columns.map((c) => c.dataIndex as string)

export function MergeCellsDemo() {
  const [store] = useState(() => createStore())

  const { data, mergeCells, maxExpandedRows } = useMemo(() => {
    const flatData = flattenData(rawData.data as any)

    // 计算最大展开行数（用于 overscan）
    let maxExp = 1
    for (const record of rawData.data as any[]) {
      const len = Math.max(
        1,
        ...ARRAY_KEYS.map((k) => {
          const v = record[k]
          return Array.isArray(v) ? v.length : 0
        }),
      )
      if (len > maxExp) maxExp = len
    }

    const cells = autoMerge(flatData, allColumnKeys)
    return { data: flatData, mergeCells: cells, maxExpandedRows: maxExp }
  }, [])

  useMemo(() => {
    store.setter(tbodyMergeCellListAtom, mergeCells)
  }, [store, mergeCells])

  return (
    <div className="merge-cells-demo">
      <div className="merge-cells-demo__header">
        <h2>合并单元格示例</h2>
        <p className="merge-cells-demo__desc">
          基于 demo.json 数据，将嵌套子数组（test0730A/B/C）展开为多行，
          对每列连续相同值自动纵向合并。
        </p>
        <div className="merge-cells-demo__info">
          <span>原始数据: <strong>{rawData.data.length}</strong> 条</span>
          <span>展开后: <strong>{data.length}</strong> 行</span>
          <span>合并区域: <strong>{mergeCells.length}</strong> 个</span>
          <span>最大展开行数: <strong>{maxExpandedRows}</strong></span>
        </div>
      </div>
      <div className="merge-cells-demo__table">
        <Table
          style={{
            width: '100%',
            height: '300px',
          }}
          idProp={ROW_ID_KEY}
          columns={columns}
          dataSource={data}
          store={store}
          enableCopy={true}
          enableHeadContextMenu={true}
          enableColumnResize={true}
          enableSelectArea={true}
          showHorizontalBorder={true}
          showVerticalBorder={true}
          overRowCount={maxExpandedRows + 10}
          rowHeight={36}
          cellDefaultWidth={120}
        />
      </div>
    </div>
  )
}

export default MergeCellsDemo
