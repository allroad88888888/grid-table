import { atom } from 'einfach-state'
import type { ComponentType } from 'react'
import DemoList from './pages/List'
import BasicTable from './pages/BasicTable'
import Table from './pages/Table'
import Atom from './pages/Atom'
import Copy from './pages/Copy'
import AntdTable from './pages/AntdTable'
import TreeTable from './pages/TreeTable'

export const currentRouterAtom = atom('/tree')

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
  // '/list': {
  //   component: DemoList,
  //   label: '列表',
  // },
  // '/basicTable': {
  //   component: BasicTable,
  //   label: '基础表格',
  // },
  // '/table': {
  //   component: Table,
  //   label: '表格',
  // },
  // '/atom': {
  //   component: Atom,
  //   label: '表格',
  // },
  // '/copy': {
  //   component: Copy,
  //   label: '复制',
  // },
  '/antd': {
    component: AntdTable,
    label: 'antd-table',
  },
  '/tree': {
    component: TreeTable,
    label: 'tree-table',
  },
}
