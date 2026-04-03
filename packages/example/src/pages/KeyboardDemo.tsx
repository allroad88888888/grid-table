import { Table, focusPositionAtom } from '@grid-table/view'
import type { ColumnType } from '@grid-table/view'
import { useAtomValue, createStore } from '@einfach/react'

type DataItem = {
  id: number
  col1: string
  col2: string
  col3: string
  col4: string
  col5: string
}

const dataSource: DataItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  col1: `A${i + 1}`,
  col2: `B${i + 1}`,
  col3: `C${i + 1}`,
  col4: `D${i + 1}`,
  col5: `E${i + 1}`,
}))

const columns: ColumnType[] = [
  { title: '列 A', dataIndex: 'col1', width: 100 },
  { title: '列 B', dataIndex: 'col2', width: 100 },
  { title: '列 C', dataIndex: 'col3', width: 100 },
  { title: '列 D', dataIndex: 'col4', width: 100 },
  { title: '列 E', dataIndex: 'col5', width: 100 },
]

const sharedStore = createStore()

function FocusDisplay() {
  const focus = useAtomValue(focusPositionAtom, { store: sharedStore })

  return (
    <div data-testid="focus-display" style={{ marginBottom: 16, padding: 8, background: '#f5f5f5', borderRadius: 4, fontSize: 13 }}>
      <strong>当前焦点：</strong>
      {focus
        ? `行=${focus.rowId}, 列=${focus.columnId}, 区域=${focus.region}`
        : ' 无（点击单元格或按方向键开始导航）'}
    </div>
  )
}

export function KeyboardDemo() {
  return (
    <div style={{ padding: 16 }}>
      <h2>键盘导航演示</h2>

      <div style={{ marginBottom: 16, fontSize: 13 }}>
        <strong>快捷键：</strong>
        <span style={{ marginLeft: 8 }}>↑↓←→ 移动焦点</span>
        <span style={{ marginLeft: 8 }}>| Home/End 行首/行尾</span>
        <span style={{ marginLeft: 8 }}>| Ctrl+Home/End 表格首/尾</span>
        <span style={{ marginLeft: 8 }}>| PageUp/Down 翻页</span>
        <span style={{ marginLeft: 8 }}>| Esc 清除焦点</span>
      </div>

      <FocusDisplay />

      <Table
        style={{ width: '100%', height: 500 }}
        columns={columns}
        dataSource={dataSource}
        idProp="id"
        store={sharedStore}
        enableKeyboard
        enableAria
        ariaLabel="键盘导航演示表格"
        rowHeight={36}
        cellDefaultWidth={100}
        enableSelectArea
      />
    </div>
  )
}

export default KeyboardDemo
