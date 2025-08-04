# AntdTableProps API 文档

`AntdTableProps` 是虚拟滚动表格组件的主要配置接口，提供了丰富的自定义选项和功能配置。

## 基础样式属性

### className

- **类型**: `string`
- **可选**: ✅
- **描述**: 自定义 CSS 类名

### style

- **类型**: `CSSProperties`
- **可选**: ✅
- **描述**: 自定义内联样式

### bordered

- **类型**: `boolean | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'`
- **默认值**: `true`
- **可选**: ✅
- **描述**: 表格边框样式，支持布尔值或具体的边框类型

## 尺寸配置

### rowHeight

- **类型**: `number`
- **默认值**: `36`
- **可选**: ✅
- **描述**: 表格行高度，单位为像素

### cellDefaultWidth

- **类型**: `number`
- **默认值**: `80`
- **可选**: ✅
- **描述**: 单元格默认宽度，单位为像素

### minColumnWidth

- **类型**: `number`
- **默认值**: `20`
- **可选**: ✅
- **描述**: 列的最小宽度限制

### maxColumnWidth

- **类型**: `number`
- **默认值**: `300`
- **可选**: ✅
- **描述**: 列的最大宽度限制

### columnPadding

- **类型**: `number`
- **默认值**: `8`
- **可选**: ✅
- **描述**: 列宽边距（内边距补偿），用于自动计算列宽时的补偿值

## 数据配置

### dataSource

- **类型**: `ItemInfo[]`
- **必需**: ✅
- **描述**: 表格数据源，包含所有行数据的数组

### columns

- **类型**: `ColumnType[]`
- **必需**: ✅
- **描述**: 列配置数组，定义表格的列结构和渲染方式

### headerDataSource

- **类型**: `ItemInfo[]`
- **可选**: ✅
- **描述**: 表头数据源，用于复杂表头场景

### idProp

- **类型**: `keyof ItemInfo`
- **可选**: ✅
- **描述**: 指定数据项中作为唯一标识的属性名

### root

- **类型**: `string`
- **可选**: ✅
- **描述**: 根节点标识，用于树形结构

### parentProp

- **类型**: `string`
- **可选**: ✅
- **描述**: 父级关系属性名，用于树形结构
- **注意**: 与 `relation` 属性互斥

### relation

- **类型**: `Record<RowId, RowId[]>`
- **可选**: ✅
- **描述**: 显式的父子关系映射
- **注意**: 与 `parentProp` 属性互斥

## 功能开关

### loading

- **类型**: `boolean`
- **默认值**: `false`
- **可选**: ✅
- **描述**: 表格加载状态

### enableCopy

- **类型**: `boolean`
- **默认值**: `false`
- **可选**: ✅
- **描述**: 是否启用复制功能

### enableSelectArea

- **类型**: `boolean`
- **可选**: ✅
- **描述**: 是否开启区域选中功能

### enableHeadContextMenu

- **类型**: `boolean`
- **可选**: ✅
- **描述**: 是否启用表头右键菜单

### enableColumnResize

- **类型**: `boolean`
- **默认值**: `true`
- **可选**: ✅
- **描述**: 是否启用表头拖拽调整列宽功能

### gpuScroll

- **类型**: `boolean`
- **可选**: ✅
- **描述**: 是否启用 GPU 加速滚动

## 行选择配置

### rowSelection

- **类型**: `UseRowSelectionProps`
- **可选**: ✅
- **描述**: 行选择配置，包含勾选框相关的设置
- **属性包含**:
  - `title`: 选择列标题
  - `fixed`: 固定位置 ('left' | 'right')
  - `width`: 选择列宽度
  - `render`: 自定义渲染函数
  - `renderComponent`: 自定义渲染组件
  - `align`: 对齐方式

## 复制功能配置

### copyGetDataByCellIds

- **类型**: `(cellIds: CellId[][]) => string`
- **可选**: ✅
- **描述**: 自定义复制数据的处理函数，接收选中的单元格 ID 矩阵，返回复制内容

## 虚拟滚动配置

### theadBaseSize

- **类型**: `number`
- **可选**: ✅
- **描述**: 表头基础网格大小

### rowBaseSize

- **类型**: `number`
- **可选**: ✅
- **描述**: 行基础网格大小

### columnBaseSize

- **类型**: `number`
- **可选**: ✅
- **描述**: 列基础网格大小

### overRowCount

- **类型**: `number`
- **可选**: ✅
- **描述**: 行的缓冲区数量，用于优化滚动性能

### overColumnCount

- **类型**: `number`
- **可选**: ✅
- **描述**: 列的缓冲区数量，用于优化滚动性能

## 自定义组件

### emptyComponent

- **类型**: `ComponentType`
- **可选**: ✅
- **描述**: 数据为空时显示的自定义组件

### loadingComponent

- **类型**: `ComponentType<{ className?: string; style?: React.CSSProperties }>`
- **可选**: ✅
- **描述**: 加载状态时显示的自定义组件

## 状态管理

### store

- **类型**: `Store`
- **可选**: ✅
- **描述**: 外部状态管理存储实例，用于与外部状态系统集成

## 使用示例

```typescript
const tableProps: AntdTableProps = {
  // 基础配置
  className: 'my-table',
  bordered: true,
  rowHeight: 40,
  cellDefaultWidth: 100,

  // 数据配置
  dataSource: userData,
  columns: columnConfig,

  // 功能开关
  enableCopy: true,
  enableSelectArea: true,
  enableColumnResize: true,

  // 行选择
  rowSelection: {
    width: 50,
    fixed: 'left',
  },

  // 虚拟滚动优化
  overRowCount: 10,
  overColumnCount: 5,

  // 自动列宽
  minColumnWidth: 50,
  maxColumnWidth: 400,
  columnPadding: 12,
}
```

## 注意事项

1. **数据关系**: `parentProp` 和 `relation` 属性互斥，只能使用其中一种方式定义父子关系
2. **性能优化**: 合理设置 `overRowCount` 和 `overColumnCount` 可以优化大数据量下的滚动性能
3. **状态管理**: 建议使用 `@einfach/react` 进行状态管理，确保最佳性能
4. **自动列宽**: 启用自动列宽计算时，确保 `minColumnWidth` 和 `maxColumnWidth` 的合理设置
