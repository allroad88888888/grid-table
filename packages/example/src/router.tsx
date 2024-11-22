import { atom } from 'einfach-state'
import type { ComponentType } from 'react'
import DemoList from './pages/List'
import Atom from './pages/Atom'
import Copy from './pages/Copy'
import AntdTable from './pages/AntdTable'
import TreeTable from './pages/TreeTable'
import { PivotDemo } from './pages/Pivot'
import { CallBackDemo } from './pages/CallBack'

export const currentRouterAtom = atom('/pivot')

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
  '/tree': {
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
}
