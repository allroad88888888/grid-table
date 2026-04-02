# tooltip — 单元格提示插件

> 优先级：P3 | 状态：需求设计

## 1. 背景

表格中文字溢出是常见情况，用户需要 hover 时看到完整内容。当前 grid-table 没有内置 tooltip 能力，用户需要自行在 `renderComponent` 中实现。需要提供一个轻量的、零外部依赖的 tooltip 插件。

## 2. 功能需求

### 2.1 自动省略检测

- 单元格内容溢出时（`scrollWidth > clientWidth`）自动显示 tooltip
- 无溢出时不显示 tooltip（避免多余交互）
- 检测时机：hover 进入时检测

### 2.2 自定义 tooltip

- `column.tooltip`：自定义 tooltip 内容
- 可以是字符串/ReactNode 或函数
- 函数模式接收行数据和单元格值，可动态生成内容

### 2.3 tooltip 行为

- 延迟显示（默认 300ms）
- 延迟隐藏（默认 100ms，鼠标移到 tooltip 上时保持显示）
- 定位：自动检测空间，优先显示在上方，空间不足时切换到下方
- 最大宽度限制

### 2.4 全局配置

- 可全局启用/禁用自动 tooltip
- 可全局配置延迟时间和最大宽度

## 3. 接口类型

```typescript
import type { ColumnId, RowId, PositionId } from '@grid-table/basic'
import type { ComponentType, CSSProperties, ReactNode } from 'react'

// ─── tooltip 位置 ───────────────────────────────────────
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto'

// ─── tooltip 内容函数 ───────────────────────────────────
export type TooltipContent<ItemInfo = Record<string, any>> = (
  value: unknown,
  rowData: ItemInfo,
  position: PositionId,
) => ReactNode

// ─── ColumnType 扩展 ───────────────────────────────────
export type ColumnTooltipOptions<ItemInfo = Record<string, any>> = {
  /**
   * tooltip 配置
   * - true: 启用自动溢出检测 tooltip（显示单元格文本）
   * - false: 禁用
   * - string | ReactNode: 固定 tooltip 内容
   * - function: 动态 tooltip 内容
   */
  tooltip?: boolean | ReactNode | TooltipContent<ItemInfo>

  /**
   * tooltip 位置
   * @default 'auto'
   */
  tooltipPlacement?: TooltipPlacement
}

// ─── tooltip 组件 Props ─────────────────────────────────
export type TooltipProps = {
  /** tooltip 内容 */
  content: ReactNode
  /** 锚点元素的位置信息 */
  anchorRect: DOMRect
  /** 位置偏好 */
  placement: TooltipPlacement
  /** 最大宽度 */
  maxWidth: number
}

// ─── 插件 Props（合入 AntdTableProps）─────────────────
export type UseTooltipProps = {
  /**
   * 全局启用自动溢出检测 tooltip
   * 启用后所有列默认检测溢出并显示 tooltip
   * 列级 tooltip 配置优先级更高
   * @default false
   */
  enableAutoTooltip?: boolean

  /**
   * 显示延迟（ms）
   * @default 300
   */
  tooltipShowDelay?: number

  /**
   * 隐藏延迟（ms）
   * @default 100
   */
  tooltipHideDelay?: number

  /**
   * tooltip 最大宽度
   * @default 300
   */
  tooltipMaxWidth?: number

  /**
   * 自定义 tooltip 容器组件
   * 用于替换内置 tooltip UI（如使用 Ant Design Tooltip）
   */
  tooltipComponent?: ComponentType<TooltipProps>
}
```

## 4. Atom 设计

```typescript
// state.ts

/** 当前显示 tooltip 的单元格信息 */
export const activeTooltipAtom = atom<{
  position: PositionId
  content: ReactNode
  anchorRect: DOMRect
  placement: TooltipPlacement
} | null>(null)
```

## 5. Hook API

```typescript
/**
 * 主 hook，注册到 cell 事件系统
 */
function useTooltip(props: UseTooltipProps): {
  /** tooltip 渲染组件（Portal，放在 Table 根节点） */
  TooltipPortal: ComponentType
}

/**
 * 单元格级别 — 注册 hover 事件
 * 在 cellEventsAtom 中注入 onMouseEnter / onMouseLeave
 */
function useCellTooltip(position: PositionId): void
```

## 6. 渲染规则

- tooltip 通过 React Portal 渲染到 `document.body`，避免被 table `overflow: hidden` 截断
- 内置 tooltip 组件为纯 CSS 实现（箭头 + 背景 + 阴影），无外部依赖
- 暗色背景 + 白色文字，与主流 UI 库风格一致
- CSS 变量控制样式：`--grid-tooltip-bg`、`--grid-tooltip-color`、`--grid-tooltip-radius`

## 7. 溢出检测算法

```typescript
function isOverflow(element: HTMLElement): boolean {
  return element.scrollWidth > element.clientWidth
    || element.scrollHeight > element.clientHeight
}
```

hover 进入时通过 `cellRef` 获取 DOM 元素判断。为避免重复检测，tooltip 显示后在 hover leave 前不再检测。

## 8. 与现有架构集成

- 通过 `tbodyCellEventsAtom` / `theadCellEventsAtom` 注入 hover 事件
- 不影响其他插件的 hover 事件（areaSelected 等）
- 虚拟滚动时，单元格移出可视区域自动隐藏 tooltip
- tooltip 内容自动从 `renderComponent` / `render` 的文本内容提取（纯文本模式下）
