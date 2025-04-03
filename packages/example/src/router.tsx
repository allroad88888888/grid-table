import { atom } from '@einfach/state'
import type { ComponentType } from 'react'
import DemoList from './pages/List'
import Atom from './pages/Atom'
import Copy from './pages/Copy'
import AntdTable from './pages/AntdTable'
import TreeTable from './pages/TreeTable'
import { PivotDemo } from './pages/Pivot'
import { CallBackDemo } from './pages/CallBack'
import { TreeDemo } from './pages/Tree'
import { GridOverDemo } from './pages/Grid/Over'
import { ExcelDemo } from './pages/Excel'
import { LargeTableDemo } from './pages/LargeTable'

// 设置默认路由为百万表格
export const currentRouterAtom = atom('/large-table')

export function Empty() {
  return <div>empty</div>
}

export const RouterMapping: Record<
  string,
  {
    component: ComponentType
    label: string
  }
> = {
  '/large-table': {
    component: LargeTableDemo,
    label: '百万格子表格',
  },
  '/list': {
    component: DemoList,
    label: '列表',
  },

  '/atom': {
    component: Atom,
    label: '表格',
  },
  '/copy': {
    component: Copy,
    label: '复制',
  },
  '/antd': {
    component: AntdTable,
    label: 'antd-table',
  },
  '/tree-table': {
    component: TreeTable,
    label: 'tree-table',
  },
  '/callback': {
    component: CallBackDemo,
    label: 'CallBackDemo',
  },
  '/pivot': {
    component: PivotDemo,
    label: 'pivot-demo',
  },
  '/tree': {
    component: TreeDemo,
    label: 'tree-demo',
  },
  '/gridOver': {
    component: GridOverDemo,
    label: 'tree-demo',
  },
  '/excel': {
    component: ExcelDemo,
    label: 'excel-demo',
  },
}
