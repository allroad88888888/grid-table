# editCell — 单元格编辑插件

> 优先级：P2 | 状态：需求设计

## 1. 背景

当前 `@grid-table/excel` 包提供了 Excel 式的编辑能力，但核心 `@grid-table/view` 层缺少轻量级的单元格编辑插件。许多业务场景只需要简单的行内编辑（如修改名称、切换状态），不需要完整的 Excel 编辑器。

## 2. 功能需求

### 2.1 编辑触发

- 双击进入编辑（默认）
- 可配置为单击进入编辑
- 按 Enter 键进入当前焦点单元格的编辑
- 按 Escape 键取消编辑
- 按 Tab 键保存并跳到下一个可编辑单元格

### 2.2 内置编辑器

- **input**：文本输入框（默认）
- **number**：数字输入框（带 min/max/step）
- **select**：下拉选择器
- **textarea**：多行文本
- 编辑器自动聚焦，自动选中内容

### 2.3 自定义编辑器

- `column.editRender`：完全自定义编辑器组件
- 编辑器接收当前值和保存/取消回调

### 2.4 编辑验证

- `column.editValidator`：保存前校验
- 校验失败时阻止保存，显示错误信息
- 支持异步校验

### 2.5 编辑回调

- `onCellEditEnd`：单元格编辑完成回调
- `onCellEditStart`：进入编辑时回调
- 可在回调中阻止编辑（返回 false）

### 2.6 编辑控制

- `column.editable`：控制列是否可编辑
- `cellEditable`：按行+列控制是否可编辑
- 只读模式：全局禁用编辑

## 3. 接口类型

```typescript
import type { ColumnId, RowId, CellId, PositionId } from '@grid-table/basic'
import type { ComponentType, ReactNode } from 'react'

// ─── 编辑器类型 ─────────────────────────────────────────
export type EditorType = 'input' | 'number' | 'select' | 'textarea'

// ─── 选择器选项 ─────────────────────────────────────────
export type EditSelectOption = {
  label: ReactNode
  value: unknown
  disabled?: boolean
}

// ─── 编辑器 Props ───────────────────────────────────────
export type CellEditorProps<ItemInfo = Record<string, any>> = {
  /** 当前值 */
  value: unknown
  /** 行数据 */
  rowData: ItemInfo
  /** 位置信息 */
  position: PositionId
  /** 保存编辑值 */
  onSave: (value: unknown) => void
  /** 取消编辑 */
  onCancel: () => void
  /** 校验错误信息（校验失败时存在） */
  error?: string
}

// ─── 校验函数 ───────────────────────────────────────────
export type EditValidator = (
  value: unknown,
  rowData: Record<string, any>,
  position: PositionId,
) => string | undefined | Promise<string | undefined>
// 返回 string 表示错误信息，undefined 表示通过

// ─── 编辑触发方式 ───────────────────────────────────────
export type EditTrigger = 'click' | 'dblclick'

// ─── ColumnType 扩展 ───────────────────────────────────
export type ColumnEditOptions<ItemInfo = Record<string, any>> = {
  /**
   * 是否可编辑
   * - boolean: 全部行可/不可编辑
   * - function: 按行判断
   */
  editable?: boolean | ((rowData: ItemInfo) => boolean)

  /**
   * 编辑器类型
   * @default 'input'
   */
  editType?: EditorType

  /**
   * 自定义编辑器组件（优先级高于 editType）
   */
  editRender?: ComponentType<CellEditorProps<ItemInfo>>

  /**
   * 编辑验证函数
   */
  editValidator?: EditValidator

  /**
   * select 类型的选项列表
   */
  editSelectOptions?: EditSelectOption[] | ((rowData: ItemInfo) => EditSelectOption[])

  /**
   * number 类型配置
   */
  editNumberConfig?: {
    min?: number
    max?: number
    step?: number
    precision?: number
  }
}

// ─── 编辑事件 ───────────────────────────────────────────
export type CellEditEvent<ItemInfo = Record<string, any>> = {
  rowId: RowId
  columnId: ColumnId
  cellId: CellId
  /** 编辑前的值 */
  oldValue: unknown
  /** 编辑后的值 */
  newValue: unknown
  /** 行数据 */
  rowData: ItemInfo
}

// ─── 插件 Props（合入 AntdTableProps）─────────────────
export type UseEditCellProps<ItemInfo = Record<string, any>> = {
  /**
   * 编辑触发方式
   * @default 'dblclick'
   */
  editTrigger?: EditTrigger

  /**
   * 单元格编辑完成回调
   * @returns false 阻止值更新
   */
  onCellEditEnd?: (event: CellEditEvent<ItemInfo>) => void | false | Promise<void | false>

  /**
   * 进入编辑时回调
   * @returns false 阻止进入编辑
   */
  onCellEditStart?: (position: PositionId, rowData: ItemInfo) => void | false

  /**
   * 全局控制单元格是否可编辑
   */
  cellEditable?: (rowData: ItemInfo, columnId: ColumnId) => boolean

  /**
   * 编辑模式
   * - 'cell': 单元格级编辑（默认）
   * - 'row': 行级编辑（整行进入编辑态，有保存/取消按钮）
   */
  editMode?: 'cell' | 'row'
}
```

## 4. Atom 设计

```typescript
// state.ts

/** 当前正在编辑的单元格 */
export const editingCellAtom = atom<PositionId | null>(null)

/** 编辑中的临时值 */
export const editingValueAtom = atom<unknown>(undefined)

/** 编辑校验错误 */
export const editingErrorAtom = atom<string | undefined>(undefined)

/** 行编辑模式下，正在编辑的行 */
export const editingRowAtom = atom<RowId | null>(null)

/** 行编辑模式下，行的临时值 */
export const editingRowDataAtom = atom<Map<ColumnId, unknown>>(new Map())
```

## 5. Hook API

```typescript
/**
 * 主 hook
 */
function useEditCell(props: UseEditCellProps): void

/**
 * 单元格级别使用
 */
function useCellEditor(position: PositionId): {
  isEditing: boolean
  value: unknown
  error: string | undefined
  startEdit: () => void
  save: (value: unknown) => Promise<boolean>
  cancel: () => void
}
```

## 6. 交互规则

| 操作 | 行为 |
|------|------|
| 双击可编辑单元格 | 进入编辑，显示编辑器 |
| Enter | 保存当前编辑 |
| Escape | 取消编辑，恢复原值 |
| Tab | 保存并跳到下一个可编辑单元格 |
| Shift + Tab | 保存并跳到上一个可编辑单元格 |
| 点击其他区域 | 保存当前编辑（blur） |

## 7. 与现有架构集成

- 编辑器通过 cell 的 `renderComponent` 机制或覆盖层渲染
- 编辑完成后更新 `rowInfoMapAtom` 中对应行的数据
- 编辑态的单元格不参与 areaSelected 的拖拽选择
- 与 `@grid-table/excel` 互斥：同一张表不应同时启用两套编辑系统
- 编辑值的变更通过 `onCellEditEnd` 通知外部，由用户决定是否同步到 dataSource
