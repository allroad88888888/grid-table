# TreeSelect 新增 GridTree 参数支持

## 更新日期

2025-12-25

## 概述

TreeSelect 组件现在完整支持来自 `@grid-tree/core` (GridTree) 的所有配置参数。

使用 `treeProps` 统一传递所有 GridTree 参数，简洁清晰，并且未来 GridTree 新增参数会自动支持。

## 新增参数

### 统一配置参数 ⭐

| 参数        | 类型                     | 默认值 | 说明                                                                                |
| ----------- | ------------------------ | ------ | ----------------------------------------------------------------------------------- |
| `treeProps` | `Partial<GridTreeProps>` | -      | GridTree 的完整配置对象。可以传递所有 GridTree 参数，未来 GridTree 新增参数自动支持 |

### 树形展开控制

| 参数                 | 类型      | 默认值  | 说明                                                           |
| -------------------- | --------- | ------- | -------------------------------------------------------------- |
| `minLengthExpandAll` | `number`  | -       | 整棵树少于多少个节点时，自动全部展开（优先级大于 expendLevel） |
| `isTiling`           | `boolean` | `false` | 是否强制平铺显示                                               |

### 节点禁用控制

| 参数              | 类型       | 默认值  | 说明                 |
| ----------------- | ---------- | ------- | -------------------- |
| `disabledIds`     | `string[]` | -       | 前端禁用的节点 IDs   |
| `keepTopDisabled` | `boolean`  | `false` | 头部禁用 ID 是否保留 |

### 虚拟滚动优化

| 参数            | 类型       | 默认值 | 说明                                       |
| --------------- | ---------- | ------ | ------------------------------------------ |
| `overscanCount` | `number`   | -      | 虚拟滚动的预渲染数量，提高滚动体验         |
| `stayIds`       | `string[]` | -      | 不管虚拟滚动怎么滚，都会保留的节点 ID 列表 |

### 标签定制

| 参数            | 类型            | 默认值 | 说明                   |
| --------------- | --------------- | ------ | ---------------------- |
| `itemTag`       | `'div' \| 'li'` | `'li'` | 每一项的 HTML 标签类型 |
| `tag`           | `'div' \| 'ul'` | `'ul'` | 容器的 HTML 标签类型   |
| `itemClassName` | `string`        | -      | 自定义项目样式类名     |

### 状态管理

| 参数    | 类型    | 默认值 | 说明                                             |
| ------- | ------- | ------ | ------------------------------------------------ |
| `store` | `Store` | -      | @einfach/react 的 Store 实例，用于自定义状态管理 |

## 影响的组件

以下组件都已更新支持这些新参数：

1. **TreeSelect** - 主选择器组件
2. **TreeList** - 独立树形列表组件
3. **DropdownContent** - 下拉内容组件

## 使用示例

```tsx
// 使用 treeProps 传递 GridTree 参数
<TreeSelect
  data={treeData}
  treeProps={{
    minLengthExpandAll: 10,
    disabledIds: ['node-1', 'node-2'],
    overscanCount: 5,
    stayIds: ['important-1'],
    store: myCustomStore,
  }}
  placeholder="使用 treeProps 统一配置"
/>
```

```tsx
// 自定义树形结构
<TreeSelect
  data={treeData}
  treeProps={{
    expendLevel: 3,
    levelSize: 24,
    size: 36,
    tag: 'div',
    itemTag: 'div',
  }}
  placeholder="自定义结构"
/>
```

## 向后兼容性

✅ 完全向后兼容，所有现有代码无需修改即可正常工作。

所有新增参数都是可选的，不提供时使用合理的默认值。

## 测试状态

- ✅ 所有单元测试通过
- ✅ TypeScript 类型检查通过
- ✅ 无 linter 错误
- ✅ 示例页面更新并验证

## 文档更新

- ✅ README.md 已更新，包含完整的 API 文档
- ✅ 示例页面已添加新参数的演示
- ✅ 类型定义文件已更新并添加 JSDoc 注释

## 相关文件

### 核心文件

- `packages/tree-select/src/types.ts` - 类型定义
- `packages/tree-select/src/TreeSelect.tsx` - 主组件
- `packages/tree-select/src/TreeList.tsx` - 列表组件
- `packages/tree-select/src/components/DropdownContent.tsx` - 下拉内容

### 文档和示例

- `packages/tree-select/README.md` - API 文档
- `packages/example/src/pages/TreeSelectDemo/TreeSelectDemo.tsx` - 示例演示

## 性能影响

新增参数主要用于性能优化和功能扩展：

1. **treeProps** - 统一配置入口，未来扩展性强
2. **minLengthExpandAll** - 减少小型树的交互次数
3. **overscanCount** - 提高虚拟滚动的流畅度
4. **stayIds** - 确保重要节点始终可见
5. **disabledIds** - 前端禁用，无需修改数据源
6. **store** - 自定义状态管理，灵活性更高

## 下一步

使用 `treeProps` 方式后，未来 GridTree 新增的任何参数都会自动支持，无需再修改 TreeSelect 代码！

可以考虑添加：

1. 更多的自定义渲染选项
2. 键盘导航支持
3. 拖拽排序功能
4. 更多的树形操作 API
