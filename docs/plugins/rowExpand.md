# rowExpand — 行展开插件

> 优先级：P0 | 状态：需求设计

## 1. 背景

当前 grid-table 支持树形结构的子节点展开（`useExpand`），但不支持通用的行展开详情（展开行下方插入一整行渲染自定义内容）。这是数据表格的高频使用场景，如订单详情、嵌套子表、附加信息等。

## 2. 功能需求

### 2.1 展开行渲染

- 点击展开图标，在当前行下方插入展开行
- 展开行占满整行宽度（跨所有列），内容由 `expandedRowRender` 自定义
- 展开行高度自适应或指定固定高度

### 2.2 展开控制

- **非受控模式**：内部维护展开状态，默认全部收起
- **受控模式**：外部传入 `expandedRowKeys`，完全控制
- `onExpand` 回调：展开/收起时触发
- `defaultExpandedRowKeys`：初始展开的行

### 2.3 手风琴模式

- `accordion: true` 时同时只允许展开一行
- 展开新行时自动收起之前展开的行

### 2.4 展开列

- 默认在第一列左侧插入展开图标列
- 可配置展开列位置（指定 columnId 旁边）
- 可配置展开图标（自定义 `expandIcon`）
- `rowExpandable`：控制哪些行可以展开

### 2.5 虚拟滚动兼容

- 展开行参与虚拟滚动计算
- 展开行有独立的 rowId（如 `__expand_${rowId}`）参与 sizeList 计算
- 展开/收起时正确更新 `rowIdShowListAtom` 和行高映射

## 3. 接口类型

```typescript
import type { RowId, ColumnId } from '@grid-table/basic'
import type { ComponentType, CSSProperties, ReactNode } from 'react'

// ─── 展开行渲染 Props ───────────────────────────────────
export type ExpandedRowRenderProps<ItemInfo = Record<string, any>> = {
  /** 父行数据 */
  rowData: ItemInfo
  /** 父行 ID */
  rowId: RowId
  /** 父行索引 */
  rowIndex: number
  /** 收起当前行 */
  collapse: () => void
}

// ─── 展开图标 Props ─────────────────────────────────────
export type ExpandIconProps = {
  /** 是否展开 */
  expanded: boolean
  /** 切换展开/收起 */
  onToggle: () => void
  /** 当前行是否可展开 */
  expandable: boolean
}

// ─── 插件 Props（合入 AntdTableProps）─────────────────
export type UseRowExpandProps<ItemInfo = Record<string, any>> = {
  /**
   * 展开行渲染函数
   * 返回 null 表示该行不渲染展开内容
   */
  expandedRowRender?: ComponentType<ExpandedRowRenderProps<ItemInfo>>

  /**
   * 受控展开的行 ID 列表
   */
  expandedRowKeys?: RowId[]

  /**
   * 默认展开的行 ID 列表（非受控模式）
   */
  defaultExpandedRowKeys?: RowId[]

  /**
   * 展开/收起回调
   * @param expanded 是否展开
   * @param rowId 行 ID
   * @param rowData 行数据
   */
  onExpand?: (expanded: boolean, rowId: RowId, rowData: ItemInfo) => void

  /**
   * 展开状态变化回调（所有展开行的 keys）
   */
  onExpandedRowsChange?: (expandedRowKeys: RowId[]) => void

  /**
   * 控制行是否可展开
   * @returns false 则不显示展开图标
   */
  rowExpandable?: (rowData: ItemInfo) => boolean

  /**
   * 手风琴模式，同时只展开一行
   * @default false
   */
  accordion?: boolean

  /**
   * 展开行高度
   * - number：固定高度
   * - 'auto'：自适应内容高度
   * @default 'auto'
   */
  expandedRowHeight?: number | 'auto'

  /**
   * 自定义展开图标
   */
  expandIcon?: ComponentType<ExpandIconProps>

  /**
   * 展开列宽度
   * @default 40
   */
  expandColumnWidth?: number

  /**
   * 展开列固定位置
   * @default 'left'
   */
  expandColumnFixed?: 'left' | 'right'

  /**
   * 展开行的额外 className
   */
  expandedRowClassName?: string | ((rowData: ItemInfo) => string)

  /**
   * 展开行的额外 style
   */
  expandedRowStyle?: CSSProperties | ((rowData: ItemInfo) => CSSProperties)
}
```

## 4. Atom 设计

```typescript
// state.ts

/** 展开行 ID 集合（内部状态） */
export const expandedRowKeysAtom = atom<Set<RowId>>(new Set())

/**
 * 展开行 ID 前缀
 * 展开行在 rowIdShowListAtom 中的 ID 格式
 */
export const EXPAND_ROW_PREFIX = '__expand_'

/**
 * 生成展开行 ID
 */
export function getExpandRowId(rowId: RowId): RowId {
  return `${EXPAND_ROW_PREFIX}${rowId}` as RowId
}

/**
 * 判断是否为展开行 ID
 */
export function isExpandRowId(rowId: RowId): boolean {
  return rowId.startsWith(EXPAND_ROW_PREFIX)
}

/**
 * 包含展开行的 rowIdShowList（派生 atom）
 * 在原始行后面插入展开行的 rowId
 */
export const rowIdShowListWithExpandAtom = atom<RowId[]>((getter) => {
  const rowIdList = getter(filteredAndSortedRowIdListAtom)
  const expandedKeys = getter(expandedRowKeysAtom)
  const result: RowId[] = []
  rowIdList.forEach((rowId) => {
    result.push(rowId)
    if (expandedKeys.has(rowId)) {
      result.push(getExpandRowId(rowId))
    }
  })
  return result
})
```

## 5. Hook API

```typescript
/**
 * 主 hook，在 TableExcel 中调用
 */
function useRowExpand(props: UseRowExpandProps): {
  /** 处理后的 columns（注入展开列） */
  expandColumns: ColumnType[]
}

/**
 * 展开行单元格使用
 */
function useExpandRow(rowId: RowId): {
  /** 父行的原始 rowId */
  parentRowId: RowId
  /** 父行数据 */
  parentRowData: Record<string, any>
  /** 收起当前行 */
  collapse: () => void
}

/**
 * 普通行单元格使用（展开图标所在列）
 */
function useRowExpandToggle(rowId: RowId): {
  expanded: boolean
  expandable: boolean
  toggle: () => void
}
```

## 6. 渲染规则

| 行类型 | rowId 格式 | 渲染方式 |
|--------|------------|----------|
| 普通数据行 | `row_0` | 正常 cell 渲染 |
| 展开详情行 | `__expand_row_0` | 合并所有列，渲染 `expandedRowRender` |

## 7. 与现有架构集成

- 展开行需要在 `rowIdShowListAtom` 中插入额外的 rowId
- 展开行的 rowHeight 需要注册到 `rowSizeMapAtom`
- 展开行渲染时需要特殊处理：跨所有列，使用 `grid-column: 1 / -1`
- 与树形展开（`useExpand`）互不冲突：树形展开是父子节点关系，行展开是详情面板
- 展开行不参与 areaSelected / copy 等选区操作
