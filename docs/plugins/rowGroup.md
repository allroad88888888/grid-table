# rowGroup — 行分组插件

> 优先级：P2 | 状态：需求设计

## 1. 背景

行分组是数据分析类表格的常见需求：按某一列或多列的值将行分组，每组有一个可折叠/展开的标题行，组内可显示聚合信息。当前 grid-table 有树形数据支持，但不支持基于数据值的自动分组。

## 2. 功能需求

### 2.1 按列分组

- 指定一个或多个列作为分组依据
- 相同值的行归入同一组
- 分组行显示分组标题和折叠/展开图标

### 2.2 分组行

- 分组行跨所有列，显示分组标题
- 分组行可自定义渲染（显示组名、行数、聚合值）
- 分组行可折叠/展开

### 2.3 多级分组

- 支持嵌套分组（如先按部门分，再按职位分）
- 每级分组独立折叠/展开

### 2.4 分组聚合

- 分组行可显示组内数据的聚合值（sum、avg、count 等）
- 复用 summary 插件的聚合函数类型

### 2.5 虚拟滚动

- 分组行参与虚拟滚动
- 折叠时组内行不渲染，不占虚拟滚动空间

## 3. 接口类型

```typescript
import type { ColumnId, RowId } from '@grid-table/basic'
import type { ComponentType, ReactNode } from 'react'
import type { BuiltinAggregation, AggregationFn } from '../summary/types'

// ─── 分组定义 ───────────────────────────────────────────
export type GroupByConfig = {
  /** 分组列 ID */
  columnId: ColumnId

  /**
   * 分组值提取函数
   * 默认使用 column.dataIndex 取值
   */
  groupValueGetter?: (rowData: Record<string, any>) => unknown

  /**
   * 分组排序
   * - 'asc': 按分组值升序
   * - 'desc': 按分组值降序
   * - function: 自定义分组排序
   */
  sort?: 'asc' | 'desc' | ((a: unknown, b: unknown) => number)
}

// ─── 分组信息 ───────────────────────────────────────────
export type GroupInfo = {
  /** 分组唯一标识 */
  groupKey: string
  /** 分组值 */
  groupValue: unknown
  /** 分组列 ID */
  columnId: ColumnId
  /** 组内行数 */
  rowCount: number
  /** 嵌套层级（从 0 开始） */
  depth: number
  /** 父分组 key */
  parentGroupKey?: string
}

// ─── 分组行渲染 Props ───────────────────────────────────
export type GroupRowRenderProps<ItemInfo = Record<string, any>> = {
  /** 分组信息 */
  groupInfo: GroupInfo
  /** 组内所有行数据 */
  rowDataList: ItemInfo[]
  /** 是否展开 */
  expanded: boolean
  /** 切换展开/折叠 */
  onToggle: () => void
  /** 缩进级别 */
  indentLevel: number
}

// ─── 分组聚合配置 ───────────────────────────────────────
export type GroupAggregation = {
  /** 列 ID */
  columnId: ColumnId
  /** 聚合方式 */
  aggregation: BuiltinAggregation | AggregationFn
}

// ─── 插件 Props（合入 AntdTableProps）─────────────────
export type UseRowGroupProps<ItemInfo = Record<string, any>> = {
  /**
   * 分组配置
   * - GroupByConfig: 单列分组
   * - GroupByConfig[]: 多级分组（数组顺序 = 嵌套层级）
   */
  groupBy?: GroupByConfig | GroupByConfig[]

  /**
   * 自定义分组行渲染
   */
  groupRowRender?: ComponentType<GroupRowRenderProps<ItemInfo>>

  /**
   * 分组行中各列的聚合方式
   */
  groupAggregations?: GroupAggregation[]

  /**
   * 默认展开的分组 keys
   */
  defaultExpandedGroupKeys?: string[]

  /**
   * 受控展开的分组 keys
   */
  expandedGroupKeys?: string[]

  /**
   * 分组展开/折叠回调
   */
  onGroupExpand?: (expanded: boolean, groupInfo: GroupInfo) => void

  /**
   * 是否默认全部展开
   * @default true
   */
  defaultExpandAll?: boolean

  /**
   * 分组行高度
   * @default 与 rowHeight 一致
   */
  groupRowHeight?: number

  /**
   * 分组行 className
   */
  groupRowClassName?: string | ((groupInfo: GroupInfo) => string)

  /**
   * 嵌套缩进宽度（px）
   * @default 20
   */
  indentWidth?: number
}
```

## 4. Atom 设计

```typescript
// state.ts

/** 分组结构（派生 atom） */
export const groupStructureAtom = atom<GroupNode[]>((getter) => {
  // 从 filteredRowIdListAtom + groupBy 配置计算分组树
})

/** 分组展开状态 */
export const expandedGroupKeysAtom = atom<Set<string>>(new Set())

/**
 * 分组后的 rowId 列表（派生 atom）
 * 在 filteredRowIdListAtom 基础上插入分组行 ID，折叠时隐藏组内行
 */
export const groupedRowIdListAtom = atom<RowId[]>((getter) => {
  // ...遍历分组树，生成包含分组行的列表
})

/** 分组行 ID 前缀 */
export const GROUP_ROW_PREFIX = '__group_'
```

## 5. Hook API

```typescript
/**
 * 主 hook
 */
function useRowGroup(props: UseRowGroupProps): void

/**
 * 分组行使用
 */
function useGroupRow(rowId: RowId): {
  groupInfo: GroupInfo
  expanded: boolean
  toggle: () => void
  rowDataList: Record<string, any>[]
}
```

## 6. 渲染规则

```
┌─分组: 技术部 (5人)──────────────────────────┐  ← 分组行 (折叠/展开)
│  张三  |  前端  |  28  |  9500             │  ← 数据行
│  李四  |  后端  |  32  |  12000            │
├─分组: 产品部 (3人)──────────────────────────┤
│  王五  |  PM    |  30  |  11000            │
```

## 7. 与现有架构集成

- 分组操作在 filter 之后、sort 之后（分组内的行可排序）
- 分组行的 rowId 格式：`__group_${depth}_${groupValue}`
- 分组行在 `rowSizeMapAtom` 中注册高度
- 分组行不参与 areaSelected / copy / 编辑等交互
- 与树形数据互斥（不应同时使用 groupBy 和 parentProp/relation）
