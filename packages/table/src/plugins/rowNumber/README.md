# 序号列功能 (Row Number Plugin)

序号列插件为表格提供自动序号显示功能，在表格第一列显示行号。

## 功能特性

- ✅ 自动固定在表格左侧，不受水平滚动影响
- ✅ 支持自定义宽度、标题和起始索引
- ✅ flexGrow 为 0，不参与剩余宽度分配
- ✅ 禁用区域选中功能，居中对齐显示
- ✅ 完美配合勾选框、固定列等功能
- ✅ 支持大数据量场景，性能优异
- ✅ 完整的 TypeScript 类型支持

## 基本使用

```tsx
import { Table } from '@grid-table/view'

function MyTable() {
  return (
    <Table
      enableRowNumber={true} // 开启序号列
      columns={columns}
      dataSource={dataSource}
      // ... 其他 props
    />
  )
}
```

## 配置选项

序号列的配置通过 `AntdTableProps` 中的 `enableRowNumber` 参数控制：

```tsx
type AntdTableProps = {
  /**
   * 是否开启序号列
   * @default false
   */
  enableRowNumber?: boolean
  // ... 其他 props
}
```

## 内部实现

序号列通过 `useRowNumber` Hook 实现，核心特性：

- **自动配置**: 序号列具有固定的配置，确保最佳用户体验
- **memo 优化**: 使用 React.memo 和 useMemo 防止不必要的重渲染
- **智能防重复**: 避免重复添加序号列，保持引用稳定性
- **虚拟滚动**: 支持大数据量场景，仅渲染可视区域内的序号

### 序号列配置

```tsx
const rowNumberColumn: ColumnType = {
  key: '__row_number_column__', // 唯一标识
  title: '#', // 默认标题
  width: 80, // 默认宽度
  flexGrow: 0, // 不参与宽度放大
  fixed: 'left', // 固定在左侧
  enableSelectArea: false, // 禁用区域选中
  align: 'center', // 居中对齐
  renderComponent: RowNumberCell, // 自定义渲染组件
}
```

## API 参考

### useRowNumber

```tsx
function useRowNumber(props?: UseRowNumberProps): {
  processColumns: (columns: ColumnType[]) => ColumnType[]
  rowNumberColumn: ColumnType | null
  isEnabled: boolean
}
```

### UseRowNumberProps

```tsx
type UseRowNumberProps = {
  enabled?: boolean // 是否启用，默认 false
  width?: number // 序号列宽度，默认 80
  title?: string // 序号列标题，默认 "#"
  startIndex?: number // 起始索引，默认 1
}
```

### RowNumberCell

序号单元格组件，负责渲染具体的序号内容：

```tsx
function RowNumberCell({ position, startIndex }: RowNumberCellProps) {
  const rowNumber = startIndex + position.rowIndex
  return <div>{rowNumber}</div>
}
```

## 测试

运行单元测试：

```bash
pnpm test -- packages/table/src/plugins/rowNumber
```

测试覆盖：

- ✅ 基本功能测试
- ✅ 配置参数测试
- ✅ 防重复添加测试
- ✅ 边界情况测试
- ✅ 类型安全测试

## 演示页面

查看完整的演示页面：

```bash
cd packages/example
pnpm dev
```

然后访问 `http://localhost:5173/table/row-number` 查看序号列功能的完整演示。

## 兼容性

- ✅ 与勾选框功能兼容
- ✅ 与固定列功能兼容
- ✅ 与区域选中功能兼容
- ✅ 与复制功能兼容
- ✅ 与拖拽调整列宽功能兼容
- ✅ 与所有表格功能兼容

## 性能考虑

1. **memo 优化**: 使用 React.memo 和 useMemo 进行性能优化
2. **虚拟滚动**: 支持大数据量，仅渲染可视区域
3. **引用稳定**: 智能缓存，避免不必要的重新计算
4. **类型安全**: 完整的 TypeScript 支持，编译时错误检查
