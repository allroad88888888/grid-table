# columnGroup — 列分组（多级表头）插件

> 优先级：P2 | 状态：需求设计

## 1. 背景

复杂业务表格经常需要多级表头来组织列的层级关系，如"基本信息"下包含"姓名"和"年龄"。当前 grid-table 通过 `headerDataSource` + `mergeCells` 可以实现多级表头，但需要用户手动计算合并信息，没有声明式的列分组 API。

## 2. 功能需求

### 2.1 嵌套列定义

- `columns` 支持 `children` 嵌套，自动生成多级表头
- 嵌套层级不限，自动计算每级 header 行数
- 父列标题自动横跨其所有子列（合并单元格）

### 2.2 分组交互

- 分组标题行可折叠/展开其子列（可选功能）
- 折叠时隐藏子列，仅显示分组标题列
- 展开/折叠不影响数据行渲染

### 2.3 与现有功能兼容

- 列宽调整：调整子列宽度时父列标题自动跟随
- 列固定：分组内的列可以 fixed
- 列隐藏：隐藏分组内的列时自动更新父列 colspan
- 列拖拽：分组内的列可以互相拖拽交换位置

## 3. 接口类型

```typescript
import type { ColumnId } from '@grid-table/basic'
import type { ColumnType } from '../../types'
import type { ReactNode, ComponentType, CSSProperties } from 'react'

// ─── 分组列定义（扩展 ColumnType）──────────────────────
export type GroupColumnType<ItemInfo = Record<string, any>> = ColumnType<ItemInfo> & {
  /**
   * 子列列表
   * 有 children 的列视为分组列，只在 header 渲染，不参与 tbody
   */
  children?: GroupColumnType<ItemInfo>[]

  /**
   * 分组标题对齐
   * @default 'center'
   */
  groupAlign?: 'left' | 'center' | 'right'

  /**
   * 是否可折叠
   * @default false
   */
  collapsible?: boolean

  /**
   * 折叠时显示的列宽度
   * @default 40
   */
  collapsedWidth?: number

  /**
   * 折叠时显示的标题
   */
  collapsedTitle?: ReactNode
}

// ─── 扁平化后的列信息 ──────────────────────────────────
export type FlattenedColumn = {
  /** 原始列定义 */
  column: ColumnType
  /** 深度（从 0 开始） */
  depth: number
  /** 叶子列索引 */
  leafIndex: number
}

// ─── 表头单元格信息 ────────────────────────────────────
export type HeaderCell = {
  /** 列定义 */
  column: GroupColumnType
  /** 行索引 */
  rowIndex: number
  /** 列起始索引 */
  colStart: number
  /** 列跨度 */
  colSpan: number
  /** 行跨度（叶子列会向下延伸到最底层） */
  rowSpan: number
}

// ─── 插件 Props（合入 AntdTableProps）─────────────────
export type UseColumnGroupProps<ItemInfo = Record<string, any>> = {
  /**
   * 支持嵌套 children 的列配置
   * 如果使用此 prop，则替代原有 columns
   */
  groupColumns?: GroupColumnType<ItemInfo>[]
}
```

## 4. 工具函数

```typescript
/**
 * 将嵌套列定义扁平化为叶子列列表（用于 tbody 渲染）
 */
function flattenColumns(groupColumns: GroupColumnType[]): ColumnType[]

/**
 * 计算表头网格布局
 * @returns headerCells 二维数组 [row][col]
 */
function buildHeaderGrid(groupColumns: GroupColumnType[]): HeaderCell[][]

/**
 * 计算最大嵌套深度（即 header 行数）
 */
function getMaxDepth(groupColumns: GroupColumnType[]): number
```

## 5. Atom 设计

```typescript
// state.ts

/** 折叠状态：columnKey → boolean */
export const collapsedGroupsAtom = atom<Set<string>>(new Set())

/**
 * 处理后的叶子列列表（派生 atom）
 * 折叠的分组只保留一个占位列
 */
export const effectiveColumnsAtom = atom<ColumnType[]>((getter) => {
  // ...flattenColumns + 折叠处理
})

/**
 * 表头网格布局（派生 atom）
 * 供 thead 渲染使用
 */
export const headerGridAtom = atom<HeaderCell[][]>((getter) => {
  // ...buildHeaderGrid
})
```

## 6. Hook API

```typescript
/**
 * 主 hook
 */
function useColumnGroup(props: UseColumnGroupProps): {
  /** 扁平化后的叶子列（供 tbody 使用） */
  flatColumns: ColumnType[]
  /** header 行数据（供 thead 使用） */
  headerRows: HeaderCell[][]
  /** header 行数 */
  headerRowCount: number
}

/**
 * 分组折叠控制
 */
function useGroupCollapse(groupKey: string): {
  collapsed: boolean
  toggle: () => void
}
```

## 7. 渲染规则

假设列定义：
```typescript
const columns = [
  {
    title: '基本信息', key: 'basic',
    children: [
      { title: '姓名', dataIndex: 'name' },
      { title: '年龄', dataIndex: 'age' },
    ]
  },
  { title: '得分', dataIndex: 'score' }
]
```

生成的表头布局：
```
┌─────────基本信息─────────┬──得分──┐  ← header row 0 (基本信息 colSpan=2)
├────姓名────┬────年龄────┤        │  ← header row 1 (得分 rowSpan=2)
```

## 8. 与现有架构集成

- 替换 `headerDataSource` + `mergeCells` 的手动配置方式
- 自动生成 `headerRowIndexListAtom`（header 行数 = 最大嵌套深度）
- 自动生成 `theadMergeCellListAtom`（从 headerGrid 计算合并信息）
- 叶子列保持与现有 `ColumnType` 完全兼容
- 如果用户同时传入 `columns` 和 `groupColumns`，以 `groupColumns` 优先
