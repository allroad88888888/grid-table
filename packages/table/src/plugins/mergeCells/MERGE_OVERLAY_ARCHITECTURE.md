# 超长合并单元格 Overlay 方案

## 现象

在 `stickyMergeCell = true` 且纵向合并跨度很大时，旧实现会出现这几类问题：

- 滚动到合并区域中段时，内容突然变成一大片空白
- 超长 merge 离开自己的区域后，容易盖住下面的普通格子
- 一个长 merge 下面马上接另一个长 merge 时，边界更脆

这些问题在跨几十到几百行的 row merge 上最明显。

## 旧方案为什么根上不稳

旧方案的核心思路是：

1. `useMergeCells` 为 merge 区域内的每一个物理格子都计算一份样式
2. `renderTbodyCells` 再把这些物理格子映射回同一个 anchor cell
3. 最终只渲染一个 DOM，但这个 DOM 会不断借用“当前可见片段”的样式

这会带来一个模型冲突：

- 样式模型是“每个物理片段各算各的”
- 渲染模型却是“整个 merge 只保留一个代表 DOM”

问题链条如下：

```text
1. 一个大 merge 覆盖很多行列
2. 虚拟滚动滚到中段时，可见的是 merge 的某个片段，不是 anchor 行
3. 代表 merge 的 DOM 继续只有一个，但会借用不同 layout cell 的 style
4. 这个 DOM 同时还叠加了 transform / overflow: clip / inner sticky
5. sticky 的 containing block 不再稳定
6. 内容可能被裁掉、漂移，最终表现为中段空白
```

也就是说，问题不只是某个 CSS 参数不对，而是 merge 的真实语义和普通 cell 的虚拟渲染模型本身不一致。

## 新方案

新方案把 `tbody` 渲染拆成两层：

- 普通 cell 层：只渲染未参与 merge 的普通格子
- merge overlay 层：每个 merge 只渲染一个稳定的 overlay DOM

这样之后，一个 merge 对应一个稳定 DOM，不再随着滚动去借用不同物理片段的样式。

## 关键设计

### 1. merge 状态拆分

在 `stateMergeCells.ts` 中保留两份信息：

- `mergeCellBodyMapAtom`
  - 作用：把被 merge 覆盖的物理格子映射到 anchor cell
  - 用途：普通 cell 渲染时直接跳过这些格子

- `mergeCellBodyAnchorSetAtom`
  - 作用：记录所有 merge anchor
  - 用途：普通 cell 渲染时也跳过 anchor，避免和 overlay 重复渲染

### 2. overlay 样式只按 anchor 计算一次

`useMergeCells` 不再为每个可见片段生成样式，而是只为每个 merge anchor 生成一条稳定样式：

- `width = merge 覆盖列宽之和`
- `height = merge 覆盖行高之和`
- `className = grid-table-cell--merge-overlay`

如果高度超过 `tbody` 可视高度，再额外加：

- `grid-table-cell--sticky-merge`
- `--grid-merge-sticky-height`
- `--grid-merge-sticky-top`

这里的 sticky 计算基准不是整个 table 高度，而是：

```text
tbodyViewportHeight = containerHeight - headerHeight
```

这样 sticky 的顶部偏移和可视高度都和真实 `tbody` 对齐。

### 3. 渲染层分成 ordinary + overlay

`renderTbodyCells.tsx` 的职责变成：

- ordinary cells
  - 遍历当前虚拟窗口内的行列
  - 如果 cell 在 `mergeCellBodyMapAtom` 或 `mergeCellBodyAnchorSetAtom` 中，直接跳过
  - 其余格子正常渲染

- merge overlays
  - 遍历 merge 列表
  - 只要这个 merge 和当前可视区域有交集，就渲染一个 overlay
  - overlay 的 `cellId` 永远是 anchor cell，不再随滚动切换

这一步是整个方案最关键的变化：merge 不再伪装成普通 cell，而是作为一类独立渲染对象存在。

### 4. merge overlay 不走 IntersectionObserver

普通格子仍然可以继续使用 `IntersectionObserver` 延迟渲染。

但 merge overlay 和 sticky merge 不再走这条链路，因为：

- merge 数量通常远少于普通 cell
- merge overlay 是结构型元素，不适合再叠加“进入视口后再渲染”的策略
- 这样可以避免超长 merge 在中段出现“外壳还在、内容没出来”的空白现象

## CSS 策略

merge overlay 的外层和内层职责分开：

- 外层 `.grid-table-cell--merge-overlay`
  - 保留真实 merge 区域
  - 宽高等于整个 merge 矩形

- 内层 `.grid-table-cell-content`
  - 在超高 merge 时才做 `position: sticky`
  - sticky 只发生在 merge 自己内部

这样可以保证：

- merge 内容在长区域里始终可见
- 离开 merge 区域后，不会继续盖住下面的普通格子或下一个 merge

## 新渲染链路

```text
1. tbodyMergeCellListAtom 提供 merge 定义
2. useMergeCells 为每个 anchor 生成一条 overlay style
3. renderTbodyCells 渲染 ordinary cells
4. renderTbodyCells 再渲染 merge overlay cells
5. DataCell 对 merge overlay 直接渲染，不走 IntersectionObserver
6. CSS 负责 sticky 内容层的可视保持
```

## 为什么这个模型更稳

相比旧方案，新方案有几个决定性的改进：

- 一个 merge 对应一个稳定 DOM，语义和实现一致
- 不再依赖 layout cell 的 transform 去“拼出”整个 merge
- sticky 的 containing block 固定，不会随着中段滚动切换
- 普通格子和 merge overlay 各自负责自己的渲染职责，边界更清晰

## 已知边界

当前方案优先解决的是：

- `tbody` 的超长纵向 merge
- `stickyMergeCell = true`
- merge 下方紧接普通格子或另一个 merge

仍然需要额外关注的边界是：

- 一个 merge 横跨 `fixed-left` 和非 fixed 区域
- 更复杂的横向大跨度 merge 叠加纵向超长 merge

这些场景不一定有问题，但它们比“纯纵向超长 merge”更容易触发分区渲染边界，需要单独验证。

## 结论

这次的核心不是“把 sticky 参数调对”，而是把 merge 的渲染模型从：

```text
普通 cell + layout 片段借样式
```

改成：

```text
普通 cell 层 + merge overlay 层
```

只有这样，超长 merge 在虚拟滚动中段时才不会再出现结构性空白。
