# 合并单元格导致滚动失控问题

## 现象

在合并单元格较多且跨度较大的场景下，用户用鼠标滚轮轻轻向下滚动一下，表格会自动持续滚动到很远的位置，无法停止。

## 根因

浏览器的 **Scroll Anchoring（滚动锚定）** 特性与虚拟滚动 + 合并单元格的 height 溢出产生了冲突。

### 什么是 Scroll Anchoring

Scroll Anchoring 是浏览器的内置特性（Chrome 56+、Firefox 66+），当滚动容器内的内容发生布局变化（元素增删、尺寸改变）时，浏览器会自动调整 `scrollTop`，试图保持用户当前看到的内容位置不变。

这个特性本身是为了解决"页面加载时广告插入导致内容跳动"的问题，但在虚拟滚动场景下会产生副作用。

### 问题链条

```
1. useMergeCells 给合并单元格设置 height = 所有合并行高度之和（可能数千px）
2. 但该 cell 的 gridRowEnd 只覆盖锚行的 1 行（如 40px）
3. 导致 cell 的 height 远超 grid 区域，产生大量溢出（overflow）
4. 用户滚动 → 虚拟滚动增删 cell → 溢出内容出现/消失
5. 浏览器 Scroll Anchoring 检测到视口附近布局变化
6. 自动调整 scrollTop（此操作不经过 JS API，无法被 scrollTo/scrollIntoView 拦截）
7. 调整触发 scroll 事件 → 虚拟滚动重新渲染 → 再次触发锚定调整
8. 形成循环，表格持续自动滚动
```

### 为什么只在大跨度合并单元格时出现

- 合并行数少时，height 溢出量小，锚定调整幅度可忽略
- 合并行数多时（如跨 50+ 行），溢出量达数千 px，锚定调整幅度大，足以触发连锁反应

## 修复方案

在滚动容器 `.grid-table` 上禁用滚动锚定：

```css
.grid-table {
  overflow-anchor: none;
}
```

### 为什么这样做是安全的

虚拟滚动库自身就在管理滚动位置和渲染范围，不依赖浏览器的滚动锚定来维持视觉稳定性。主流虚拟滚动库（react-window、react-virtualized、@tanstack/virtual）均采用相同做法。

### 排查过程中排除的方向

| 排查方向 | 结论 |
|---------|------|
| JS 调用 scrollTo/scrollBy | 拦截后未触发，排除 |
| JS 赋值 scrollTop | 拦截后未触发，排除 |
| 子元素 scrollIntoView | 拦截后未触发，排除 |
| 元素 focus 导致浏览器自动滚动 | 监听 focus 事件未触发，排除 |
| useSpeedAwareCallback 延迟渲染反馈循环 | 日志显示为一次性平滑动画曲线（ease-in → 匀速 → ease-out），非反馈循环 |
| IntersectionObserver 延迟渲染 | 关闭后问题依旧，排除 |

最终通过限制 `useMergeCells` 中的 height 确认溢出是诱因，再通过 `overflow-anchor: none` 确认浏览器滚动锚定是执行者。
