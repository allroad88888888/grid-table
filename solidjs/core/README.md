# Grid Table SolidJS Core

这是基于React版本的Grid Table库的SolidJS实现，提供高性能的虚拟滚动表格组件。

## 安装

```bash
npm install @grid-table-solidjs/core
```

## 主要组件

### VGridList

`VGridList` 是一个基于网格布局的虚拟滚动列表组件，能够高效地展示大量数据。

#### 示例用法

```tsx
import { VGridList } from '@grid-table-solidjs/core';
import { createSignal } from 'solid-js';

const ListItem = (props) => {
  return (
    <div style={props.style}>
      Item {props.index}
    </div>
  );
};

function App() {
  const [items] = createSignal(Array.from({ length: 10000 }, (_, i) => i));
  
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <VGridList
        baseSize={50}
        itemCount={items().length}
        calcItemSize={() => 50}
        children={ListItem}
      />
    </div>
  );
}
```

### VGridTable

`VGridTable` 是一个功能完整的虚拟滚动表格组件，支持固定表头、百万级数据渲染等高级特性。

#### 百万级单元格演示

我们提供了一个百万级单元格渲染的演示示例。要运行此演示，请执行以下步骤：

1. 克隆仓库并进入项目目录：

```bash
git clone https://github.com/yourusername/grid-table.git
cd grid-table/solidjs/core
```

2. 安装依赖：

```bash
npm install
```

3. 启动开发服务器：

```bash
npm run dev
```

4. 在浏览器中打开 http://localhost:3000 查看演示。

演示特性：
- 支持1000x1000（百万级）单元格的高效渲染
- 高性能虚拟滚动，仅渲染可见区域的单元格
- 内存占用优化，数据按需生成
- 固定表头
- 加载状态展示
- 灵活的数据量切换

## API文档

### VGridList Props

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| baseSize | number | 是 | - | 网格单元的基础大小 |
| itemCount | number | 是 | - | 列表项的总数量 |
| calcItemSize | (index: number) => number | 是 | - | 计算指定索引项的大小的函数 |
| children | Component | 是 | - | 渲染列表项的组件 |
| tag | 'div' \| 'ul' | 否 | 'div' | 列表容器的HTML标签 |
| style | CSSProperties | 否 | - | 列表容器的样式 |
| className | string | 否 | - | 列表容器的CSS类名 |
| overscanCount | number | 否 | 10 | 视口外预渲染的项目数量 |
| stayIndexList | number[] | 否 | - | 始终保持渲染的项目索引列表 |
| onItemsRendered | (params: ItemsRenderedProps) => any | 否 | - | 当渲染的项目变化时的回调函数 |
| direction | 'row' \| 'column' | 否 | 'row' | 滚动方向 |
| overCountIncrementTime | number | 否 | 1000 | 首次加载后overscanCount自增一倍的延迟时间(ms) |

### VGridTable Props

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| rowCount | number | 是 | - | 表格行数 |
| columnCount | number | 是 | - | 表格列数 |
| rowCalcSize | (index: number) => number | 是 | - | 计算行高的函数 |
| columnCalcSize | (index: number) => number | 是 | - | 计算列宽的函数 |
| renderTbodyCell | (props: RenderCellsProps) => JSX.Element | 是 | - | 渲染表格单元格的函数 |
| renderTheadCell | (props: RenderCellsProps) => JSX.Element | 是 | - | 渲染表头单元格的函数 |
| theadRowCalcSize | (index: number) => number | 是 | - | 计算表头行高的函数 |
| style | CSSProperties | 否 | - | 表格容器的样式 |
| className | string | 否 | - | 表格容器的CSS类名 |
| rowBaseSize | number | 否 | 1 | 行的基础大小 |
| columnBaseSize | number | 否 | 1 | 列的基础大小 |
| theadBaseSize | number | 否 | 1 | 表头的基础大小 |
| loading | boolean | 否 | false | 是否显示加载状态 |
| emptyComponent | Component | 否 | - | 无数据时显示的组件 |
| loadingComponent | Component | 否 | - | 加载状态时显示的组件 |

## 性能优化

VGridList/VGridTable组件内置了多种性能优化措施：

1. 使用虚拟滚动仅渲染可见区域内的元素
2. 滚动事件使用passive监听器
3. 使用CSS Grid进行布局，提高渲染性能
4. 通过createMemo缓存计算结果
5. 使用requestAnimationFrame优化滚动性能
6. 预渲染策略可以通过overscanCount配置

# Grid Table SolidJS Core

这是基于React版本的Grid Table库的SolidJS实现，提供高性能的虚拟滚动表格组件。

## 安装

```bash
npm install @grid-table-solidjs/core
```

## 主要组件

### VGridList

`VGridList` 是一个基于网格布局的虚拟滚动列表组件，能够高效地展示大量数据。

#### 示例用法

```tsx
import { VGridList } from '@grid-table-solidjs/core';
import { createSignal } from 'solid-js';

const ListItem = (props) => {
  return (
    <div style={props.style}>
      Item {props.index}
    </div>
  );
};

function App() {
  const [items] = createSignal(Array.from({ length: 10000 }, (_, i) => i));
  
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <VGridList
        baseSize={50}
        itemCount={items().length}
        calcItemSize={() => 50}
        children={ListItem}
      />
    </div>
  );
}
```

### VGridTable

`VGridTable` 是一个功能完整的虚拟滚动表格组件，支持固定表头、百万级数据渲染等高级特性。

#### 百万级单元格演示

我们提供了一个百万级单元格渲染的演示示例。要运行此演示，请执行以下步骤：

1. 克隆仓库并进入项目目录：

```bash
git clone https://github.com/yourusername/grid-table.git
cd grid-table/solidjs/core
```

2. 安装依赖：

```bash
npm install
```

3. 启动开发服务器：

```bash
npm run dev
```

4. 在浏览器中打开 http://localhost:3000 查看演示。

演示特性：
- 支持1000x1000（百万级）单元格的高效渲染
- 高性能虚拟滚动，仅渲染可见区域的单元格
- 内存占用优化，数据按需生成
- 固定表头
- 加载状态展示
- 灵活的数据量切换

## API文档

### VGridList Props

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| baseSize | number | 是 | - | 网格单元的基础大小 |
| itemCount | number | 是 | - | 列表项的总数量 |
| calcItemSize | (index: number) => number | 是 | - | 计算指定索引项的大小的函数 |
| children | Component | 是 | - | 渲染列表项的组件 |
| tag | 'div' \| 'ul' | 否 | 'div' | 列表容器的HTML标签 |
| style | CSSProperties | 否 | - | 列表容器的样式 |
| className | string | 否 | - | 列表容器的CSS类名 |
| overscanCount | number | 否 | 10 | 视口外预渲染的项目数量 |
| stayIndexList | number[] | 否 | - | 始终保持渲染的项目索引列表 |
| onItemsRendered | (params: ItemsRenderedProps) => any | 否 | - | 当渲染的项目变化时的回调函数 |
| direction | 'row' \| 'column' | 否 | 'row' | 滚动方向 |
| overCountIncrementTime | number | 否 | 1000 | 首次加载后overscanCount自增一倍的延迟时间(ms) |

### VGridTable Props

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| rowCount | number | 是 | - | 表格行数 |
| columnCount | number | 是 | - | 表格列数 |
| rowCalcSize | (index: number) => number | 是 | - | 计算行高的函数 |
| columnCalcSize | (index: number) => number | 是 | - | 计算列宽的函数 |
| renderTbodyCell | (props: RenderCellsProps) => JSX.Element | 是 | - | 渲染表格单元格的函数 |
| renderTheadCell | (props: RenderCellsProps) => JSX.Element | 是 | - | 渲染表头单元格的函数 |
| theadRowCalcSize | (index: number) => number | 是 | - | 计算表头行高的函数 |
| style | CSSProperties | 否 | - | 表格容器的样式 |
| className | string | 否 | - | 表格容器的CSS类名 |
| rowBaseSize | number | 否 | 1 | 行的基础大小 |
| columnBaseSize | number | 否 | 1 | 列的基础大小 |
| theadBaseSize | number | 否 | 1 | 表头的基础大小 |
| loading | boolean | 否 | false | 是否显示加载状态 |
| emptyComponent | Component | 否 | - | 无数据时显示的组件 |
| loadingComponent | Component | 否 | - | 加载状态时显示的组件 |

## 性能优化

VGridList/VGridTable组件内置了多种性能优化措施：

1. 使用虚拟滚动仅渲染可见区域内的元素
2. 滚动事件使用passive监听器
3. 使用CSS Grid进行布局，提高渲染性能
4. 通过createMemo缓存计算结果
5. 使用requestAnimationFrame优化滚动性能
6. 预渲染策略可以通过overscanCount配置


# @grid-table-solidjs/core 优化建议

基于对 `@grid-table-solidjs/core` 代码的分析，并与 `solid-virtual` 进行对比，以下是一些可优化的方向：

## 1. 性能优化

- **延迟加载和卸载**：目前的实现已经使用了 `createMemo` 和 `requestAnimationFrame` 来优化渲染，但可以考虑引入更高级的延迟加载和卸载策略，特别是对于非常大的数据集。
- **DOM 回收利用**：考虑实现 DOM 元素池化，复用已渲染的 DOM 元素而不是频繁创建和销毁，这对于大数据集的性能至关重要。

## 2. 滚动优化

- **预测性滚动**：监测用户的滚动速度和方向，预加载即将进入视口的项目，减少滚动过程中的白屏现象。
- **滚动加速度处理**：优化快速滚动时的性能，可以考虑在快速滚动时减少渲染的项目数量，或使用更简化的渲染。

## 3. 内存管理

- **减少闭包**：检查并减少不必要的闭包，特别是在滚动事件处理函数中，这可以减少内存占用。
- **清理未使用的状态**：确保在组件卸载时清理所有的事件监听器和计时器，避免内存泄漏。

## 4. 渲染优化

- **条件渲染**：对于不在视口中的项目，可以使用更简化的渲染策略，甚至可以考虑完全跳过渲染。
- **渲染批处理**：将多个渲染操作批处理在一起，减少 DOM 更新的次数，提高性能。

## 5. 布局计算优化

- **缓存计算**：目前已经使用了 `createMemo` 来缓存一些计算结果，但可以考虑进一步缓存布局计算，特别是对于固定大小的项目。
- **使用局部状态**：确保使用局部状态而不是全局状态，减少不必要的重渲染。

## 6. 事件处理优化

- **事件委托**：考虑使用事件委托模式，减少事件处理器的数量，提高事件处理的效率。
- **优化事件监听器**：确保使用 `passive: true` 选项，并在适当的时候使用 `capture: true`，提高事件处理的性能。

## 7. API 设计优化

- **简化接口**：考虑简化组件的接口，减少必要的配置项，使组件更易于使用。
- **提供更多扩展点**：考虑提供更多的钩子函数，允许用户自定义滚动行为、渲染策略等。

## 8. 调试和性能监控

- **添加性能标记**：在关键的渲染和计算函数中添加性能标记，帮助用户诊断性能问题。
- **提供调试模式**：考虑提供一个调试模式，显示有关虚拟滚动内部状态的详细信息，帮助用户理解和优化其应用程序。

通过以上优化，可以进一步提高 `@grid-table-solidjs/core` 的性能和用户体验，使其更接近或超越 `solid-virtual` 的性能表现。 

## 许可证

MIT 

## 许可证

MIT 