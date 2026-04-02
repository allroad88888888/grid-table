# summary — 汇总行插件

> 优先级：P2 | 状态：需求设计

## 1. 背景

数据表格经常需要在底部或顶部显示汇总信息（合计、平均值、计数等）。当前 grid-table 没有汇总行能力。汇总行应固定在表格底部/顶部，不随数据行滚动消失。

## 2. 功能需求

### 2.1 固定汇总行

- 支持底部汇总行（默认）和顶部汇总行
- 汇总行使用 sticky 定位，始终可见
- 支持多行汇总（如合计行 + 平均行）

### 2.2 内置聚合函数

- sum：求和
- avg：平均值
- count：计数（非空值数量）
- min：最小值
- max：最大值
- 可扩展自定义聚合函数

### 2.3 自定义汇总渲染

- `column.summary`：指定该列在汇总行中的渲染方式
- 可以是聚合函数名（字符串）或自定义渲染函数
- 汇总行可以完全由用户自定义渲染

### 2.4 数据驱动

- 汇总值根据当前可见数据（过滤后）自动计算
- 过滤条件变化时汇总值自动更新

## 3. 接口类型

```typescript
import type { ColumnId, RowId } from '@grid-table/basic'
import type { ComponentType, CSSProperties, ReactNode } from 'react'

// ─── 内置聚合函数名 ─────────────────────────────────────
export type BuiltinAggregation = 'sum' | 'avg' | 'count' | 'min' | 'max'

// ─── 自定义聚合函数 ─────────────────────────────────────
export type AggregationFn<ItemInfo = Record<string, any>> = (
  /** 当前列所有可见行的值 */
  values: unknown[],
  /** 当前列所有可见行的完整数据 */
  rowDataList: ItemInfo[],
) => ReactNode

// ─── 汇总单元格 Props ───────────────────────────────────
export type SummaryCellProps<ItemInfo = Record<string, any>> = {
  columnId: ColumnId
  /** 当前列所有可见行的值 */
  values: unknown[]
  /** 所有可见行数据 */
  rowDataList: ItemInfo[]
  /** 汇总行索引（多行汇总时区分） */
  summaryIndex: number
}

// ─── 汇总行配置 ─────────────────────────────────────────
export type SummaryRowConfig<ItemInfo = Record<string, any>> = {
  /** 汇总行唯一标识 */
  key?: string

  /**
   * 各列的汇总方式
   * - string: 内置聚合函数名
   * - function: 自定义聚合函数
   * - 未指定的列显示空
   */
  cells?: Record<string, BuiltinAggregation | AggregationFn<ItemInfo>>

  /**
   * 完全自定义整行渲染（优先级高于 cells）
   */
  render?: ComponentType<{
    rowDataList: ItemInfo[]
    summaryIndex: number
  }>

  /** 汇总行 className */
  className?: string

  /** 汇总行 style */
  style?: CSSProperties
}

// ─── ColumnType 扩展 ───────────────────────────────────
export type ColumnSummaryOptions<ItemInfo = Record<string, any>> = {
  /**
   * 汇总方式
   * - BuiltinAggregation: 使用内置聚合函数
   * - AggregationFn: 自定义聚合函数
   * - ComponentType<SummaryCellProps>: 完全自定义渲染
   */
  summary?: BuiltinAggregation | AggregationFn<ItemInfo> | ComponentType<SummaryCellProps<ItemInfo>>
}

// ─── 插件 Props（合入 AntdTableProps）─────────────────
export type UseSummaryProps<ItemInfo = Record<string, any>> = {
  /**
   * 汇总行配置
   * - SummaryRowConfig: 单行汇总
   * - SummaryRowConfig[]: 多行汇总
   */
  summary?: SummaryRowConfig<ItemInfo> | SummaryRowConfig<ItemInfo>[]

  /**
   * 汇总行位置
   * @default 'bottom'
   */
  summaryPosition?: 'top' | 'bottom'

  /**
   * 汇总行固定（sticky）
   * @default true
   */
  summarySticky?: boolean

  /**
   * 汇总行高度
   * @default 与 rowHeight 一致
   */
  summaryRowHeight?: number
}
```

## 4. Atom 设计

```typescript
// state.ts

/** 汇总行配置 */
export const summaryConfigAtom = atom<SummaryRowConfig[]>([])

/**
 * 汇总数据（派生 atom）
 * 依赖：filteredRowIdListAtom + rowInfoMapAtom + column 配置
 * 每列计算一次聚合值
 */
export const summaryDataAtom = atom<Map<ColumnId, ReactNode>[]>((getter) => {
  // 遍历每个 summaryRow 配置
  // 对每列执行聚合函数
  // 返回 [row0: Map<colId, value>, row1: Map<colId, value>, ...]
})

/** 汇总行 rowId 列表 */
export const SUMMARY_ROW_PREFIX = '__summary_'
```

## 5. Hook API

```typescript
/**
 * 主 hook
 */
function useSummary(props: UseSummaryProps): void

/**
 * 汇总单元格使用
 */
function useSummaryCell(rowId: RowId, columnId: ColumnId): {
  value: ReactNode
  isSummaryRow: true
}
```

## 6. 渲染规则

- 汇总行使用 CSS `position: sticky` + `bottom: 0`（底部）或 `top: theadHeight`（顶部）
- 汇总行的 z-index 高于普通数据行，低于 sticky 列
- 汇总行背景色区别于数据行（通过 CSS 变量控制）
- 汇总行不参与选区、拖拽、编辑等交互

## 7. 与现有架构集成

- 汇总行类似 sticky bottom row，可复用 sticky 插件的定位机制
- 汇总值在 `filteredRowIdListAtom` 变化时重算（过滤后数据的汇总）
- 汇总行不纳入虚拟滚动范围，始终渲染
