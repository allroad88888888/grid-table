# @grid-tree/core CSS 变量系统

@grid-tree/core 提供了开箱即用的基础样式和丰富的 CSS 变量支持。

## 快速开始

使用 @grid-tree/core 时，基础样式会自动加载：

```tsx
import GridTree from '@grid-tree/core'

;<GridTree
  className="grid-tree-container" // 使用基础样式类
  itemClassName="grid-tree-item" // 使用基础项样式类
  // ... 其他属性
/>
```

## CSS 变量列表

### 容器样式变量

```css
--grid-tree-bg: #fff /* 背景色 */ --grid-tree-border: 1px solid #e8e8e8 /* 边框 */
  --grid-tree-border-radius: 6px /* 圆角 */ --grid-tree-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06)
  /* 阴影 */;
```

### 树项样式变量

```css
--grid-tree-item-padding: 0 12px /* 内边距 */ --grid-tree-item-border-bottom: 1px solid #f5f5f5
  /* 底部边框 */ --grid-tree-item-hover-bg: #f5f5f5 /* 悬停背景色 */
  --grid-tree-item-selected-bg: #e6f7ff /* 选中背景色 */ --grid-tree-item-text-color: #262626
  /* 文字颜色 */ --grid-tree-item-font-size: 14px /* 字体大小 */ --grid-tree-item-line-height: 1.4
  /* 行高 */ --grid-tree-item-min-height: 32px /* 最小高度 */;
```

### 箭头样式变量

```css
--grid-tree-arrow-size: 8px /* 箭头大小 */ --grid-tree-arrow-color: #666 /* 箭头颜色 */
  --grid-tree-arrow-hover-color: #333 /* 箭头悬停颜色 */ --grid-tree-arrow-padding: 6px
  /* 箭头内边距 */ --grid-tree-arrow-border-width: 1.5px /* 箭头边框宽度 */;
```

### 其他变量

```css
--grid-tree-item-border-radius: 4px /* 项圆角 */ --grid-tree-item-transition: all 0.2s ease
  /* 过渡动画 */ --grid-tree-level-indent: 20px /* 层级缩进 */;
```

## 自定义样式示例

### 基础自定义

```css
.my-tree {
  --grid-tree-bg: #f9f9f9;
  --grid-tree-border: 2px solid #1890ff;
  --grid-tree-item-hover-bg: #e6f7ff;
}
```

### 紧凑模式

```css
.compact-tree {
  --grid-tree-item-min-height: 24px;
  --grid-tree-item-padding: 0 8px;
  --grid-tree-item-font-size: 12px;
}
```

### 暗色主题

```css
.dark-tree {
  --grid-tree-bg: #1f1f1f;
  --grid-tree-border: 1px solid #404040;
  --grid-tree-item-border-bottom: 1px solid #333;
  --grid-tree-item-hover-bg: #2a2a2a;
  --grid-tree-item-text-color: #e8e8e8;
}
```

## 预设样式类

@grid-tree/core 还提供了一些预设的样式类：

- `.grid-tree-container.compact` - 紧凑模式
- `.grid-tree-container.spacious` - 宽松模式
- `.grid-tree-container.borderless` - 无边框模式
- `.grid-tree-container.dark` - 暗色主题

使用方式：

```tsx
<GridTree className="grid-tree-container compact" />
<GridTree className="grid-tree-container dark" />
```
