import { atom } from 'einfach-state'
import type { ComponentType } from 'react'
import DemoList from './pages/List'
import BasicTable from './pages/BasicTable'
import Table from './pages/Table'
import Atom from './pages/Atom'

export const currentRouterAtom = atom('index')

export function Empty() {
  return <div>empty</div>
}

export const RouterMapping: Record<string, {
  component: ComponentType
  label: string
}> = { '/list': {
  component: DemoList,
  label: '列表',
}, '/basicTable': {
  component: BasicTable,
  label: '基础表格',
}, '/table': {
  component: Table,
  label: '表格',
}, '/atom': {
  component: Atom,
  label: '表格',
} }
