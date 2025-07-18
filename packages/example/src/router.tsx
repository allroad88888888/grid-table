import { atom } from '@einfach/react'
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
import ModernDebounceThrottle from './pages/ModernDebounceThrottle'
import TreeTableSizeDemo from './pages/TreeTableSize'
import { AutoSizeDemo } from './pages/AutoSizeDemo'

// 路由映射配置
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
  '/modern-debounce': {
    component: ModernDebounceThrottle,
    label: '现代防抖节流',
  },
  '/tree-table-size': {
    component: TreeTableSizeDemo,
    label: 'tree-table-size',
  },
  '/auto-size': {
    component: AutoSizeDemo,
    label: '自动列宽调整',
  },
}

// 获取初始路由：如果当前路径在路由映射中存在则使用，否则使用默认路由
const getInitialRoute = () => {
  const currentPath = location.pathname
  return RouterMapping[currentPath] ? currentPath : '/tree-table'
}

// 从当前 location.pathname 读取初始路由，如果路径不存在则默认为 /tree-table
export const currentRouterAtom = atom(getInitialRoute())

export function Empty() {
  return <div>empty</div>
}
