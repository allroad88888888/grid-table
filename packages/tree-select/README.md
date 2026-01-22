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

#### 基础属性

| 属性              | 类型                             | 默认值      | 说明              |
| ----------------- | -------------------------------- | ----------- | ----------------- |
| data              | `TreeNode[]`                     | -           | 标准树形数据      |
| relation          | `TreeRelation`                   | -           | Relation 格式数据 |
| value             | `string \| string[]`             | -           | 选中值            |
| defaultValue      | `string \| string[]`             | -           | 默认选中值        |
| onChange          | `(value, node) => void`          | -           | 选中变化回调      |
| disabled          | `boolean`                        | `false`     | 是否禁用          |
| readonly          | `boolean`                        | `false`     | 是否只读          |
| placeholder       | `string`                         | '请选择...' | 占位文本          |
| allowClear        | `boolean`                        | `true`      | 显示清除按钮      |
| multiple          | `boolean`                        | `false`     | 是否多选          |
| confirmSelect     | `boolean`                        | `false`     | 多选时是否需要确认（显示确定/取消按钮） |
| showSelectedPanel | `boolean`                        | `false`     | 是否显示已选中项面板（仅多选模式）|
| size              | `'small' \| 'middle' \| 'large'` | `'middle'`  | 尺寸              |

#### 样式属性

| 属性              | 类型             | 默认值  | 说明              |
| ----------------- | ---------------- | ------- | ----------------- |
| className         | `string`         | -       | 自定义样式类      |
| style             | `CSSProperties`  | -       | 自定义样式        |
| dropdownClassName | `string`         | -       | 下拉菜单样式类    |
| dropdownStyle     | `CSSProperties`  | -       | 下拉菜单样式      |
| dropdownMaxHeight | `number`         | `300`   | 下拉最大高度      |
| maxTagCount       | `number`         | `3`     | 最多显示标签数量  |
| autoMaxTagCount   | `boolean`        | `false` | 自动计算显示标签数 |
| renderInline      | `boolean`        | `false` | 是否在组件内联渲染下拉菜单 |

#### 树形配置（来自 GridTree）

| 属性              | 类型             | 默认值   | 说明              |
| ----------------- | ---------------- | -------- | ----------------- |
| treeProps         | `Partial<GridTreeProps>` | -  | GridTree 的完整配置对象。可以传递所有 GridTree 参数，未来 GridTree 新增参数也会自动支持 |

**treeProps 常用参数：**

| 参数              | 类型             | 默认值   | 说明              |
| ----------------- | ---------------- | -------- | ----------------- |
| showRoot          | `boolean`        | `false`  | 显示根节点        |
| root              | `string`         | `'_ROOT'` | 根节点ID          |
| expendLevel       | `number`         | `2`      | 默认展开层级      |
| levelSize         | `number`         | `20`     | 层级缩进大小（px）|
| size              | `number`         | `32`     | 项目高度（px）    |
| minLengthExpandAll | `number`        | -        | 整棵树少于多少个节点时自动全部展开 |
| isTiling          | `boolean`        | `false`  | 是否强制平铺      |
| disabledIds       | `string[]`       | -        | 前端禁用的节点ids |
| keepTopDisabled   | `boolean`        | `false`  | 头部禁用id是否保留 |
| overscanCount     | `number`         | -        | 虚拟滚动的预渲染数量 |
| stayIds           | `string[]`       | -        | 固定显示的节点列表 |
| itemTag           | `'div' \| 'li'`  | `'li'`   | 每一项的标签类型  |
| tag               | `'div' \| 'ul'`  | `'ul'`   | 容器标签类型      |
| itemClassName     | `string`         | -        | 自定义项目样式类名 |
| store             | `Store`          | -        | @einfach/react 的 Store 实例 |

#### 事件回调

| 属性                  | 类型                     | 说明              |
| --------------------- | ------------------------ | ----------------- |
| onDropdownVisibleChange | `(visible) => void`    | 下拉显示变化回调  |
| onFocus               | `() => void`             | 获得焦点回调      |
| onBlur                | `() => void`             | 失去焦点回调      |

#### 自定义渲染

| 属性              | 类型                     | 说明              |
| ----------------- | ------------------------ | ----------------- |
| suffixIcon        | `ReactNode`              | 自定义后缀图标    |
| clearIcon         | `ReactNode`              | 自定义清除图标    |
| notFoundContent   | `ReactNode`              | 空数据提示        |
| renderCheckbox    | `(params) => ReactNode`  | 自定义复选框渲染（多选模式） |
| renderSelectedIcon | `(params) => ReactNode` | 自定义选中图标渲染（单选模式） |
| renderItem        | `(params) => ReactNode`  | 自定义节点内容渲染 |

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

### 基础使用

```tsx
// 多选 + 已选面板
<TreeSelect
  data={treeData}
  multiple
  showSelectedPanel  // 显示右侧已选面板
  placeholder="请选择..."
  style={{ width: 200 }}
/>
```

### 高级配置示例

```tsx
// 使用 treeProps 传递 GridTree 参数
<TreeSelect
  data={treeData}
  treeProps={{
    minLengthExpandAll: 10,  // 少于10个节点时自动全部展开
    disabledIds: ['A', 'AB'],  // 禁用指定节点
    overscanCount: 5,  // 预渲染5个节点
    stayIds: ['important-1'],  // 固定显示的重要节点
    store: myCustomStore,  // 自定义 store
  }}
  placeholder="使用 treeProps"
/>

// 已选面板 + 确认模式
<TreeSelect
  data={treeData}
  multiple
  confirmSelect  // 确认模式
  showSelectedPanel  // 显示已选面板
  placeholder="多选确认 + 已选面板"
/>

// 自定义树形结构
<TreeSelect
  data={treeData}
  treeProps={{
    expendLevel: 3,  // 默认展开3层
    levelSize: 24,  // 层级缩进24px
    size: 36,  // 每项高度36px
    tag: 'div',  // 使用div容器
    itemTag: 'div',  // 使用div项目
  }}
  placeholder="自定义结构"
/>
```

查看 [在线演示](http://localhost:5173/tree/select) 了解更多使用方式。

## License

MIT
