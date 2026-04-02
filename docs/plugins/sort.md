# sort — 列排序插件

> 优先级：P0 | 状态：需求设计

## 1. 背景

排序是数据表格最基础的功能，几乎所有竞品（AG Grid、TanStack Table、Ant Design Table）都内置支持。当前 grid-table 完全缺失排序能力，用户无法通过点击表头对数据进行排序。

## 2. 功能需求

### 2.1 单列排序

- 点击表头触发排序，循环切换：升序 → 降序 → 取消排序
- 排序后 `rowIdShowListAtom` 按排序结果重新排列
- 表头显示排序方向图标（↑ ↓）

### 2.2 多列排序

- Shift + Click 表头追加次级排序字段
- 多列排序时表头显示排序优先级数字（1, 2, 3...）
- 非 Shift 点击清除已有排序，以当前列为唯一排序列

### 2.3 自定义排序

- `column.sorter`：布尔值或比较函数
  - `true`：使用默认字符串/数字比较
  - `(a, b) => number`：自定义比较函数
- 默认比较策略：先尝试 `Number()`，如果都是数字则数字比较，否则 `localeCompare`

### 2.4 服务端排序

- `onSortChange` 回调：排序状态变化时触发，传递当前排序状态
- 服务端模式下不执行前端排序，仅触发回调由用户自行获取数据

### 2.5 受控模式

- `sortState` prop：外部传入排序状态，完全受控
- 非受控时内部维护 `sortStateAtom`

### 2.6 排序图标

- 内置默认排序图标组件（纯 CSS/SVG，无外部依赖）
- `column.sortIcon`：自定义排序图标渲染

## 3. 接口类型

```typescript
import type { ColumnId, RowId } from '@grid-table/basic'
import type { ComponentType, ReactNode } from 'react'

// ─── 排序方向 ───────────────────────────────────────────
export type SortDirection = 'asc' | 'desc'

// ─── 单列排序状态 ───────────────────────────────────────
export type SortField = {
  /** 排序列 ID */
  columnId: ColumnId
  /** 排序方向 */
  direction: SortDirection
}

// ─── 排序状态（有序数组，索引即优先级）─────────────────
export type SortState = SortField[]

// ─── 排序比较函数 ───────────────────────────────────────
export type SortCompareFn<ItemInfo = Record<string, any>> = (
  a: ItemInfo,
  b: ItemInfo,
) => number

// ─── 排序图标 Props ─────────────────────────────────────
export type SortIconProps = {
  /** 当前排序方向，undefined 表示未排序 */
  direction: SortDirection | undefined
  /** 多列排序时的优先级序号（从 1 开始），单列排序时为 undefined */
  priority: number | undefined
}

// ─── ColumnType 扩展 ───────────────────────────────────
// 需要在 ColumnType 上新增以下可选字段：
export type ColumnSortOptions<ItemInfo = Record<string, any>> = {
  /**
   * 是否启用排序 / 自定义比较函数
   * - true: 使用默认比较（数字优先，fallback localeCompare）
   * - function: 自定义比较函数
   * - false | undefined: 不可排序
   */
  sorter?: boolean | SortCompareFn<ItemInfo>

  /**
   * 默认排序方向，表格初始化时生效
   */
  defaultSortDirection?: SortDirection

  /**
   * 自定义排序图标
   */
  sortIcon?: ComponentType<SortIconProps>
}

// ─── 插件 Props（合入 AntdTableProps）─────────────────
export type UseSortProps<ItemInfo = Record<string, any>> = {
  /**
   * 受控排序状态
   * 传入后表格不再内部维护排序状态
   */
  sortState?: SortState

  /**
   * 排序状态变化回调
   * @param sortState 最新排序状态
   * @param prevState 变更前的排序状态
   */
  onSortChange?: (sortState: SortState, prevState: SortState) => void

  /**
   * 是否为服务端排序模式
   * true: 不执行前端排序，仅触发 onSortChange
   * @default false
   */
  remoteSort?: boolean

  /**
   * 多列排序是否启用
   * @default true
   */
  enableMultiSort?: boolean

  /**
   * 排序循环顺序
   * @default ['asc', 'desc', null]
   */
  sortCycle?: (SortDirection | null)[]
}
```

## 4. Atom 设计

```typescript
// state.ts

/** 内部排序状态 */
export const sortStateAtom = atom<SortState>([])

/**
 * 排序后的 rowId 列表（派生 atom）
 * 依赖：rowIndexListAtom + sortStateAtom + 各列 sorter 配置
 * 非服务端模式下，替换 rowIdShowListAtom 的数据源
 */
export const sortedRowIdListAtom = atom<RowId[]>((getter) => {
  // ...排序逻辑
})

/**
 * 列排序方向查询（派生 atom）
 * 供表头组件读取当前列的排序状态
 */
export const columnSortInfoAtom = atom<Map<ColumnId, { direction: SortDirection; priority: number }>>((getter) => {
  // ...从 sortStateAtom 派生
})
```

## 5. Hook API

```typescript
/**
 * 主 hook，在 TableExcel 中调用
 */
function useSort(props: UseSortProps): {
  /** 排序后的 columns（注入表头点击事件和图标） */
  sortedColumns: ColumnType[]
}

/**
 * 表头单元格内部使用，获取排序交互
 */
function useSortHeader(columnId: ColumnId): {
  direction: SortDirection | undefined
  priority: number | undefined
  onToggleSort: (e: React.MouseEvent) => void
}
```

## 6. 交互规则

| 操作 | 行为 |
|------|------|
| 点击可排序列表头 | 按 sortCycle 循环切换该列排序方向，清除其他列排序 |
| Shift + 点击可排序列表头 | 追加/更新该列到多列排序，不影响已有列 |
| 点击已排序列再点击 | 按 cycle 切换：asc → desc → 取消 |
| 外部设置 sortState | 完全覆盖内部状态 |

## 7. 与现有架构集成

- 排序影响的是 `rowIdShowListAtom`（或其上游），需要在 filter 之后、虚拟滚动之前生效
- 不修改 `dataSource` 原始数据，仅改变行的显示顺序
- 排序状态存储在 atom 中，其他插件（如 copy、areaSelected）可读取排序后的行顺序
- 表头排序图标通过 `titleComponent` 或额外 wrapper 注入，不影响用户自定义 title
