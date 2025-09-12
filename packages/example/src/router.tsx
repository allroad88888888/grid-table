import { atom } from '@einfach/react'
import type { ComponentType } from 'react'
import DemoList from './pages/List'
import Copy from './pages/Copy'
import AntdTable from './pages/AntdTable'
import TreeTable from './pages/TreeTable'
import { PivotDemo } from './pages/Pivot'
import { CallBackDemo } from './pages/CallBack'
import { TreeDemo } from './pages/Tree'
import { CoreTreeDemo } from './pages/CoreTreeDemo'
import { SimpleTreeDemo } from './pages/SimpleTreeDemo'
import { TreeSelectDemo } from './pages/TreeSelectDemo'
import { TreeSelectMultipleDemo } from './pages/TreeSelectMultipleDemo'
import { TreeSelectConfirmDemo } from './pages/TreeSelectConfirmDemo'
import { TreeListDemo } from './pages/TreeListDemo'
import { GridOverDemo } from './pages/Grid/Over'
import { ExcelDemo } from './pages/Excel'
import { LargeTableDemo } from './pages/LargeTable'
import ModernDebounceThrottle from './pages/ModernDebounceThrottle'
import TreeTableSizeDemo from './pages/TreeTableSize'
import { AutoSizeDemo } from './pages/AutoSizeDemo'
import { ValueInColsDemo } from './pages/ValueInColsDemo'
import { EditTableDemo } from './pages/EditTable'
import { ResizeWidthDemo } from './pages/ResizeWidthDemo'
import { RowNumberDemo } from './pages/RowNumberDemo'

// 路由项目接口定义
export interface RouteItem {
  component: ComponentType
  label: string
  path: string
}

// 路由分组接口定义
export interface RouteGroup {
  label: string
  icon?: string
  routes: RouteItem[]
}

// 分组路由配置
export const RouteGroups: Record<string, RouteGroup> = {
  table: {
    label: '表格组件',
    icon: '📊',
    routes: [
      {
        path: '/table/antd',
        component: AntdTable,
        label: 'Antd 表格',
      },
      {
        path: '/table/edit',
        component: EditTableDemo,
        label: '编辑表格',
      },
      {
        path: '/table/auto-size',
        component: AutoSizeDemo,
        label: '自动列宽',
      },
      {
        path: '/table/tree-table-size',
        component: TreeTableSizeDemo,
        label: '树表尺寸',
      },
      {
        path: '/table/value-in-cols',
        component: ValueInColsDemo,
        label: 'ValueInCols',
      },
      {
        path: '/table/resize-width',
        component: ResizeWidthDemo,
        label: '自适应宽度',
      },
      {
        path: '/table/row-number',
        component: RowNumberDemo,
        label: '序号列功能',
      },
    ],
  },
  tree: {
    label: '树形组件',
    icon: '🌳',
    routes: [
      {
        path: '/tree/demo',
        component: TreeDemo,
        label: '树形增加',
      },
      {
        path: '/tree/core',
        component: CoreTreeDemo,
        label: '核心树组件',
      },
      {
        path: '/tree/simple',
        component: SimpleTreeDemo,
        label: '简洁树形',
      },
      {
        path: '/tree/select',
        component: TreeSelectDemo,
        label: '树形选择器',
      },
      {
        path: '/tree/select-multiple',
        component: TreeSelectMultipleDemo,
        label: '多选树形选择器',
      },
      {
        path: '/tree/select-confirm',
        component: TreeSelectConfirmDemo,
        label: '确认模式选择器',
      },
      {
        path: '/tree/list',
        component: TreeListDemo,
        label: '树形列表',
      },
      {
        path: '/tree/demo-list',
        component: DemoList,
        label: '列表组件',
      },
    ],
  },
  tableHigher: {
    label: '表格-高阶',
    icon: '📊',
    routes: [
      {
        path: '/table-higher/tree-table',
        component: TreeTable,
        label: '树形表格',
      },
      {
        path: '/table-higher/large',
        component: LargeTableDemo,
        label: '百万格子表格',
      },
      {
        path: '/table-higher/pivot',
        component: PivotDemo,
        label: '数据透视',
      },

      {
        path: '/table-higher/excel',
        component: ExcelDemo,
        label: 'Excel 演示',
      },
    ],
  },
  other: {
    label: '其他组件',
    icon: '🔧',
    routes: [
      {
        path: '/other/copy',
        component: Copy,
        label: '复制功能',
      },
      {
        path: '/other/callback',
        component: CallBackDemo,
        label: '回调演示',
      },
      {
        path: '/other/pivot',
        component: PivotDemo,
        label: '数据透视',
      },
      {
        path: '/other/grid-over',
        component: GridOverDemo,
        label: '网格覆盖',
      },
      {
        path: '/other/excel',
        component: ExcelDemo,
        label: 'Excel 演示',
      },
      {
        path: '/other/grid-over',
        component: GridOverDemo,
        label: '网格覆盖',
      },
      {
        path: '/other/modern-debounce',
        component: ModernDebounceThrottle,
        label: '防抖节流',
      },
    ],
  },
}

// 扁平化的路由映射，兼容旧版本
export const RouterMapping: Record<
  string,
  {
    component: ComponentType
    label: string
  }
> = {
  ...Object.values(RouteGroups).reduce(
    (acc, group) => {
      group.routes.forEach((route) => {
        acc[route.path] = {
          component: route.component,
          label: route.label,
        }
      })
      return acc
    },
    {} as Record<string, { component: ComponentType; label: string }>,
  ),
  // 保留旧路由以支持向后兼容
  '/large-table': {
    component: LargeTableDemo,
    label: '百万格子表格',
  },
  '/list': {
    component: DemoList,
    label: '列表',
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
  '/value-in-cols': {
    component: ValueInColsDemo,
    label: 'ValueInCols 演示',
  },
  '/tree': {
    component: TreeDemo,
    label: 'tree-demo',
  },
  '/core-tree': {
    component: CoreTreeDemo,
    label: '核心树组件演示',
  },
  '/gridOver': {
    component: GridOverDemo,
    label: 'GridOverDemo',
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
  '/edit': {
    component: EditTableDemo,
    label: '编辑表格',
  },
  '/resize-width': {
    component: ResizeWidthDemo,
    label: '容器宽度自适应',
  },
}

// 获取初始路由：如果当前路径在路由映射中存在则使用，否则使用默认路由
const getInitialRoute = () => {
  const currentPath = location.pathname
  return RouterMapping[currentPath] ? currentPath : '/table/tree-table'
}

// 从当前 location.pathname 读取初始路由，如果路径不存在则默认为 /table/tree-table
export const currentRouterAtom = atom(getInitialRoute())

// 获取所有路由的扁平化列表，用于搜索和导航
export const getAllRoutes = (): RouteItem[] => {
  return Object.values(RouteGroups).flatMap((group) => group.routes)
}

// 根据路径获取路由信息
export const getRouteByPath = (path: string): RouteItem | undefined => {
  return getAllRoutes().find((route) => route.path === path)
}

export function Empty() {
  return <div>empty</div>
}
