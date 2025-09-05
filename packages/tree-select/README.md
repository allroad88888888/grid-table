# @grid-tree/select

基于 `@grid-tree/core` 构建的高性能树形选择器组件。

## 特性

- 🌳 基于 @grid-tree/core 的高性能树形渲染
- 🎯 支持单选模式，点击节点直接选择
- 📊 兼容 relation 和标准树形数据格式
- 🎨 开箱即用的美观样式
- 🔧 丰富的 CSS 变量支持主题定制
- 📱 响应式设计，支持不同尺寸
- ♿ 良好的可访问性
- 🔒 支持禁用、只读状态
- 🎭 TypeScript 完整类型支持

## 安装

```bash
npm install @grid-tree/select
# 或
pnpm add @grid-tree/select
```

## 基础使用

### 标准树形数据

```tsx
import { TreeSelect } from '@grid-tree/select'

const treeData = [
  {
    id: 'A',
    label: '节点A',
    children: [
      { id: 'AA', label: '节点AA' },
      { id: 'AB', label: '节点AB' },
    ],
  },
  {
    id: 'B',
    label: '节点B',
    children: [{ id: 'BA', label: '节点BA' }],
  },
]

function App() {
  const [selectedValue, setSelectedValue] = useState('')

  return (
    <TreeSelect
      data={treeData}
      value={selectedValue}
      onChange={(value, node) => {
        setSelectedValue(value)
        console.log('选中:', value, node)
      }}
      placeholder="请选择..."
      style={{ width: 200 }}
      allowClear
    />
  )
}
```

### Relation 数据格式

```tsx
const relationData = {
  _ROOT: ['A', 'B'],
  A: ['AA', 'AB', 'AC'],
  AC: ['ACA', 'ACB'],
  ACB: ['ACBA'],
  B: ['BA', 'BB']
}

<TreeSelect
  relation={relationData}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="请选择..."
  showRoot={false}
  root="_ROOT"
/>
```

## API

### TreeSelect Props

| 属性              | 类型                             | 默认值      | 说明              |
| ----------------- | -------------------------------- | ----------- | ----------------- |
| data              | `TreeNode[]`                     | -           | 标准树形数据      |
| relation          | `TreeRelation`                   | -           | Relation 格式数据 |
| value             | `string`                         | -           | 选中值            |
| defaultValue      | `string`                         | -           | 默认选中值        |
| onChange          | `(value, node) => void`          | -           | 选中变化回调      |
| disabled          | `boolean`                        | `false`     | 是否禁用          |
| readonly          | `boolean`                        | `false`     | 是否只读          |
| placeholder       | `string`                         | '请选择...' | 占位文本          |
| allowClear        | `boolean`                        | `true`      | 显示清除按钮      |
| size              | `'small' \| 'middle' \| 'large'` | `'middle'`  | 尺寸              |
| className         | `string`                         | -           | 自定义样式类      |
| style             | `CSSProperties`                  | -           | 自定义样式        |
| dropdownMaxHeight | `number`                         | `300`       | 下拉最大高度      |
| showRoot          | `boolean`                        | `false`     | 显示根节点        |
| root              | `string`                         | `'_ROOT'`   | 根节点ID          |
| expendLevel       | `number`                         | `2`         | 默认展开层级      |

### TreeNode 类型

```tsx
interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  disabled?: boolean
  [key: string]: any
}
```

## CSS 变量定制

```css
.my-tree-select {
  /* 基础颜色 */
  --tree-select-bg: #fff;
  --tree-select-border: #d9d9d9;
  --tree-select-border-hover: #40a9ff;
  --tree-select-border-focus: #1890ff;

  /* 选中状态 */
  --tree-select-selected-bg: #e6f7ff;
  --tree-select-selected-color: #1890ff;

  /* 尺寸 */
  --tree-select-height-middle: 32px;
  --tree-select-border-radius: 6px;
}
```

## 示例

查看 [在线演示](http://localhost:5173/tree/select) 了解更多使用方式。

## License

MIT
