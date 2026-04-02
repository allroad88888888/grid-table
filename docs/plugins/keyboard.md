# keyboard — 键盘导航与可访问性

> 优先级：P1 | 状态：需求设计

## 1. 背景

当前 grid-table 的键盘支持非常有限，仅 `areaSelected` 有少量鼠标相关交互。缺乏完整的键盘导航、焦点管理和 ARIA 语义，不满足 WCAG 无障碍要求。键盘导航是所有其他键盘交互（编辑、选择、复制）的基础设施。

## 2. 功能需求

### 2.1 单元格焦点

- 表格有一个"活动单元格"概念（类似 Excel 的活动单元格）
- 活动单元格显示焦点环（蓝色边框）
- 点击任意单元格设为活动单元格
- 活动单元格状态存储在 atom 中，其他插件可读取

### 2.2 方向键导航

- Arrow Up/Down/Left/Right：在单元格间移动焦点
- Home：移动到当前行第一个单元格
- End：移动到当前行最后一个单元格
- Ctrl + Home：移动到表格左上角
- Ctrl + End：移动到表格右下角
- Page Up/Down：向上/下滚动一页并移动焦点

### 2.3 选区键盘操作

- Shift + Arrow：扩展选区
- Shift + Click：从活动单元格到点击位置创建选区
- Ctrl + A：全选
- Escape：清除选区

### 2.4 Tab 导航

- Tab：移动到下一个可交互单元格
- Shift + Tab：移动到上一个可交互单元格
- 使用 roving tabindex 模式（整个表格只有一个 tabindex=0）

### 2.5 ARIA 语义

- 表格容器：`role="grid"` + `aria-rowcount` + `aria-colcount`
- 表头区域：`role="rowgroup"`
- 数据区域：`role="rowgroup"`
- 行：`role="row"` + `aria-rowindex`
- 表头单元格：`role="columnheader"` + `aria-sort`（有排序时）
- 数据单元格：`role="gridcell"` + `aria-colindex`
- 选中状态：`aria-selected`
- 展开状态：`aria-expanded`

### 2.6 屏幕阅读器

- 活动单元格变化时更新 `aria-activedescendant`
- 排序状态通过 `aria-sort` 通知
- 选区范围通过 `aria-label` 描述
- 空状态和加载状态的 `aria-live` 通知

## 3. 接口类型

```typescript
import type { ColumnId, RowId, CellId, PositionId } from '@grid-table/basic'

// ─── 焦点位置 ───────────────────────────────────────────
export type FocusPosition = {
  rowId: RowId
  columnId: ColumnId
  cellId: CellId
  /** 焦点在 thead 还是 tbody */
  region: 'thead' | 'tbody'
}

// ─── 导航方向 ───────────────────────────────────────────
export type NavigationDirection = 'up' | 'down' | 'left' | 'right'
  | 'home' | 'end' | 'pageUp' | 'pageDown'
  | 'ctrlHome' | 'ctrlEnd'

// ─── 键盘事件处理结果 ──────────────────────────────────
export type KeyboardAction =
  | { type: 'navigate'; direction: NavigationDirection }
  | { type: 'select'; extend: boolean }
  | { type: 'edit'; key?: string }
  | { type: 'copy' }
  | { type: 'selectAll' }
  | { type: 'escape' }
  | { type: 'tab'; reverse: boolean }

// ─── ARIA 属性 ──────────────────────────────────────────
export type GridAriaProps = {
  role: 'grid'
  'aria-rowcount': number
  'aria-colcount': number
  'aria-multiselectable'?: boolean
  'aria-activedescendant'?: string
  'aria-label'?: string
}

export type RowAriaProps = {
  role: 'row'
  'aria-rowindex': number
  'aria-selected'?: boolean
}

export type CellAriaProps = {
  role: 'gridcell' | 'columnheader' | 'rowheader'
  'aria-colindex': number
  'aria-selected'?: boolean
  'aria-sort'?: 'ascending' | 'descending' | 'none'
  'aria-expanded'?: boolean
  id?: string
  tabIndex?: -1 | 0
}

// ─── 插件 Props（合入 AntdTableProps）─────────────────
export type UseKeyboardProps = {
  /**
   * 启用键盘导航
   * @default true
   */
  enableKeyboard?: boolean

  /**
   * 启用 ARIA 属性
   * @default true
   */
  enableAria?: boolean

  /**
   * 自定义快捷键映射
   * 返回 KeyboardAction 或 undefined（不处理）
   */
  keyboardHandler?: (
    event: KeyboardEvent,
    focusPosition: FocusPosition | null,
  ) => KeyboardAction | undefined

  /**
   * 表格 aria-label
   */
  ariaLabel?: string

  /**
   * 焦点变化回调
   */
  onFocusChange?: (position: FocusPosition | null) => void

  /**
   * 是否在焦点移出可视区域时自动滚动
   * @default true
   */
  scrollToFocus?: boolean
}
```

## 4. Atom 设计

```typescript
// state.ts

/** 当前活动单元格 */
export const focusPositionAtom = atom<FocusPosition | null>(null)

/** 键盘选区锚点（Shift 选区的起点） */
export const selectionAnchorAtom = atom<FocusPosition | null>(null)

/**
 * 生成单元格的 DOM id（供 aria-activedescendant 引用）
 */
export function getCellDomId(cellId: CellId): string {
  return `grid-cell-${cellId}`
}
```

## 5. Hook API

```typescript
/**
 * 主 hook — 注册到 table 容器的 keydown 事件
 */
function useKeyboard(props: UseKeyboardProps): {
  /** 表格容器的 ARIA 属性 */
  gridAriaProps: GridAriaProps
  /** keydown 事件处理器 */
  onKeyDown: (e: React.KeyboardEvent) => void
}

/**
 * 行级别 — 返回 ARIA 属性
 */
function useRowAria(rowId: RowId, rowIndex: number): RowAriaProps

/**
 * 单元格级别 — 返回 ARIA 属性 + 焦点状态
 */
function useCellAria(position: PositionId): {
  ariaProps: CellAriaProps
  isFocused: boolean
}

/**
 * 焦点管理 — 编程式控制焦点
 */
function useFocusControl(): {
  focus: (position: FocusPosition) => void
  blur: () => void
  moveTo: (direction: NavigationDirection) => void
}
```

## 6. 键盘映射表

| 按键 | 行为 |
|------|------|
| Arrow Up/Down/Left/Right | 移动焦点 |
| Shift + Arrow | 扩展选区 |
| Home | 当前行第一列 |
| End | 当前行最后一列 |
| Ctrl + Home | 表格左上角 |
| Ctrl + End | 表格右下角 |
| Page Up | 向上一页 |
| Page Down | 向下一页 |
| Tab | 下一个可交互单元格 |
| Shift + Tab | 上一个可交互单元格 |
| Enter | 进入编辑（如果可编辑） |
| Escape | 退出编辑 / 清除选区 |
| Ctrl + A | 全选 |
| Ctrl + C | 复制选区 |
| F2 | 进入编辑 |
| Space | 切换行选择（checkbox 行） |

## 7. 与现有架构集成

- 焦点管理通过 `focusPositionAtom` 暴露给所有插件
- `areaSelected` 的 Shift + Click 功能与键盘 Shift + Arrow 共享 `selectionAnchorAtom`
- `editCell` 读取 `focusPositionAtom` 确定 Enter 键进入哪个单元格编辑
- `copy` 读取 `focusPositionAtom` 和选区状态确定 Ctrl+C 的范围
- 焦点移动时如果目标单元格在可视区域外，触发 `scrollTo` 滚动
- ARIA 属性通过 `useCell` / `useCellThead` / `useRow` 注入到 DOM 元素
- 虚拟滚动中不可见的行/列不接收焦点，导航时自动跳到可见范围
