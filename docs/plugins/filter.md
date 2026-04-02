# filter — 列过滤插件

> 优先级：P1 | 状态：需求设计

## 1. 背景

当前 `useFilterColumn` 仅提供 `getSelectOption()` 获取列的唯一值列表，没有过滤逻辑、过滤状态管理和过滤 UI。需要补全为完整的过滤系统。

## 2. 功能需求

### 2.1 过滤状态管理

- 全局过滤状态 atom，存储所有列的过滤条件
- 过滤后生成过滤后的 `rowIdShowListAtom`（在排序之前生效）
- 支持受控模式（外部传入 filterState）和非受控模式

### 2.2 内置过滤类型

| 类型 | 操作符 | 适用场景 |
|------|--------|----------|
| text | contains / equals / startsWith / endsWith / regex | 文本列 |
| number | eq / ne / gt / gte / lt / lte / between | 数字列 |
| select | include（多选） | 枚举列 |
| date | before / after / between | 日期列 |

### 2.3 过滤 UI

- 表头过滤图标（漏斗），有过滤条件时高亮
- 点击图标弹出过滤面板（Dropdown）
- 面板内容根据过滤类型不同：
  - text：输入框
  - number：输入框 + 操作符下拉
  - select：搜索框 + 多选 checkbox 列表
  - date：日期范围选择器（需要用户提供组件）
- 面板底部：确认 / 重置按钮

### 2.4 自定义过滤

- `column.filterFn`：完全自定义过滤函数
- `column.filterRender`：自定义过滤面板 UI
- `column.filterOptions`：静态过滤选项（不从数据推断）

### 2.5 服务端过滤

- `remoteFilter: true` 时不执行前端过滤
- 仅触发 `onFilterChange` 回调，由用户获取新数据

### 2.6 多列过滤

- 多列过滤条件之间为 AND 关系（行需满足所有列的过滤条件）
- 清除单列过滤 / 清除所有过滤

## 3. 接口类型

```typescript
import type { ColumnId, RowId } from '@grid-table/basic'
import type { ComponentType, ReactNode } from 'react'

// ─── 过滤操作符 ─────────────────────────────────────────
export type TextFilterOperator = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'regex'
export type NumberFilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'between'
export type SelectFilterOperator = 'include'
export type DateFilterOperator = 'before' | 'after' | 'between'

// ─── 过滤条件值 ─────────────────────────────────────────
export type TextFilterValue = {
  type: 'text'
  operator: TextFilterOperator
  value: string
}

export type NumberFilterValue = {
  type: 'number'
  operator: NumberFilterOperator
  /** between 时为 [min, max]，其他为单值 */
  value: number | [number, number]
}

export type SelectFilterValue = {
  type: 'select'
  operator: SelectFilterOperator
  /** 选中的值列表 */
  value: unknown[]
}

export type DateFilterValue = {
  type: 'date'
  operator: DateFilterOperator
  /** between 时为 [start, end]，其他为单值 */
  value: string | [string, string]
}

export type FilterValue = TextFilterValue | NumberFilterValue | SelectFilterValue | DateFilterValue

// ─── 过滤状态 ───────────────────────────────────────────
/** columnId → 该列的过滤条件 */
export type FilterState = Map<ColumnId, FilterValue>

// ─── 过滤函数 ───────────────────────────────────────────
export type FilterFn<ItemInfo = Record<string, any>> = (
  /** 当前行数据 */
  rowData: ItemInfo,
  /** 该列的过滤条件值 */
  filterValue: FilterValue,
) => boolean

// ─── 过滤选项 ───────────────────────────────────────────
export type FilterOption = {
  label: ReactNode
  value: unknown
}

// ─── 过滤面板 Props ─────────────────────────────────────
export type FilterPanelProps = {
  columnId: ColumnId
  /** 当前过滤值 */
  value: FilterValue | undefined
  /** 更新过滤值 */
  onChange: (value: FilterValue | undefined) => void
  /** 关闭面板 */
  onClose: () => void
  /** 从数据推断的可选值（select 类型用） */
  options: FilterOption[]
}

// ─── ColumnType 扩展 ───────────────────────────────────
export type ColumnFilterOptions<ItemInfo = Record<string, any>> = {
  /**
   * 过滤类型
   * - 指定类型时使用内置过滤逻辑和 UI
   * - 不指定则该列不可过滤
   */
  filterType?: 'text' | 'number' | 'select' | 'date'

  /**
   * 自定义过滤函数
   * 设置后忽略 filterType 的内置逻辑
   */
  filterFn?: FilterFn<ItemInfo>

  /**
   * 自定义过滤面板组件
   */
  filterRender?: ComponentType<FilterPanelProps>

  /**
   * 静态过滤选项（不从数据推断）
   * 仅 select 类型有效
   */
  filterOptions?: FilterOption[]

  /**
   * 默认过滤值，表格初始化时生效
   */
  defaultFilterValue?: FilterValue
}

// ─── 插件 Props（合入 AntdTableProps）─────────────────
export type UseFilterProps = {
  /**
   * 受控过滤状态
   */
  filterState?: FilterState

  /**
   * 过滤状态变化回调
   */
  onFilterChange?: (filterState: FilterState) => void

  /**
   * 服务端过滤模式
   * @default false
   */
  remoteFilter?: boolean
}
```

## 4. Atom 设计

```typescript
// state.ts

/** 内部过滤状态 */
export const filterStateAtom = atom<FilterState>(new Map())

/**
 * 过滤后的 rowId 列表（派生 atom）
 * 依赖：rowIndexListAtom + filterStateAtom + 各列 filterFn/filterType
 * 在 sort 之前、原始数据之后
 */
export const filteredRowIdListAtom = atom<RowId[]>((getter) => {
  // ...过滤逻辑
})

/**
 * 列过滤选项缓存（派生 atom family）
 * 从数据中提取唯一值，供 select 类型面板使用
 */
export const columnFilterOptionsAtomFamily = createAtomFamily<ColumnId, FilterOption[]>(...)

/** 当前打开的过滤面板的 columnId */
export const activeFilterColumnAtom = atom<ColumnId | null>(null)
```

## 5. Hook API

```typescript
/**
 * 主 hook，在 TableExcel 中调用
 */
function useFilter(props: UseFilterProps): void

/**
 * 表头单元格使用，获取过滤交互
 */
function useColumnFilter(columnId: ColumnId): {
  /** 当前列是否有过滤条件 */
  isFiltered: boolean
  /** 打开过滤面板 */
  openFilterPanel: () => void
  /** 清除当前列过滤 */
  clearFilter: () => void
}

/**
 * 过滤面板内部使用
 */
function useFilterPanel(columnId: ColumnId): {
  value: FilterValue | undefined
  options: FilterOption[]
  onChange: (value: FilterValue | undefined) => void
  onConfirm: () => void
  onReset: () => void
}
```

## 6. 数据流

```
dataSource (原始数据)
  → rowIndexListAtom (原始行ID列表)
  → filteredRowIdListAtom (过滤后)
  → sortedRowIdListAtom (排序后)
  → rowIdShowListAtom (虚拟滚动可见)
```

## 7. 与现有架构集成

- 保留现有 `useFilterColumn.tsx` 的 `getSelectOption`，内部使用它生成 select 类型的候选选项
- 过滤面板通过 Portal 渲染到 table container 外，避免被 overflow hidden 截断
- 过滤图标通过 `titleComponent` wrapper 注入，不影响用户自定义 title
- 多列过滤条件之间为 AND 关系
