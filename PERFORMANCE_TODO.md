# Performance TODO

基于 perf test 的量化数据，按优先级排列的优化清单。

---

## P0 — 已完成

### ~~1. vscroll findIndex 线性搜索 → 二分查找~~

- **文件**: `packages/core/src/Basic/useDelayScroll.ts`, `useVScroll.ts`
- **问题**: `sizeList.findIndex()` O(n) + `sizeList.slice().findIndex()` 数组拷贝
- **数据**: 100k items 滚到尾部 linear 37ms vs binary 0.01ms (**3745x**)；1000 次连续滚动 229ms vs 0.36ms
- **方案**: 抽出 `binarySearchGte()` (`packages/core/src/utils/binarySearch.ts`)，替换 findIndex + slice
- **状态**: ✅ 已完成

### ~~2. dataInitAtom 逐行 atomFamily setter → Map 批量 set~~

- **文件**: `packages/table/src/state.ts`, `stateCore.ts`
- **问题**: 每行调用 `setter(getRowInfoAtomByRowId(rowId), rowInfo)` = N 次 setter
- **数据**: 10k 行 setter overhead 从瓶颈降到 14% (0.2ms)
- **方案**: 新增 `rowInfoMapAtom`，`dataInitAtom` 收集到 Map 后一次 setter；`getRowInfoAtomByRowId` 改为 selectAtom 从 map 读取
- **状态**: ✅ 已完成

---

## P1 — 已完成

### ~~3. areaSelected 逐 cell setter → Set atom 方案~~

- **文件**: `packages/table/src/plugins/areaSelected/state.ts`, `useTbodyAreaSelected.ts`, `useTheadAreaSelected.ts`, `hooks/useCell.ts`, `hooks/useCellThead.ts`
- **问题**: 嵌套 `cellTbodyList.forEach` 对每个 cell 调用 `store.setter(getCellStateAtomById(cellId), ...)`
- **数据**: 100×100 选区 = 10k 次 setter = 24ms，setter 占总开销 **98%**
- **方案**: 新增 `areaSelectedTbodyCellSetAtom` / `areaSelectedTheadCellSetAtom`（selectAtom 从 areaCellIdsAtom 派生 Set），cell 端通过 selectAtom + `set.has(cellId)` 判断是否选中，移除逐 cell setter 循环
- **状态**: ✅ 已完成

### ~~4. areaCellIdsAtom 中的 findIndexList 线性搜索~~

- **文件**: `packages/table/src/plugins/areaSelected/state.ts`
- **问题**: `findIndexList` 遍历整个 rowIdShowList 数组找 start/end 的 index
- **数据**: 100k 行尾部查找 7.5ms
- **方案**: 新增 `columnIdIndexMapAtom` / `rowTbodyIdIndexMapAtom` / `rowTheadIdIndexMapAtom`，`lookupIndices()` 直接 Map.get() = O(1)
- **状态**: ✅ 已完成

---

## P2 — 用户触发操作

### 5. copyStyle 逐 cell setter → 同上 Map atom 思路

- **文件**: `packages/table/src/plugins/copy/useCopyStyle.ts:32-77`
- **问题**: 与 areaSelected 相同的嵌套 setter 模式
- **数据**: 2500 cells = 5ms，setter 占 96%
- **思路**: 与 #3 类似，新增 `copyCellStyleMapAtom = atom(new Map<CellId, CSSProperties>())`，一次性计算所有 cell 的 border style 写入 Map，cell 端 selectAtom 读取

### 6. useHeaderMergeCells 移植 body 版优化

- **文件**: `packages/table/src/plugins/mergeCells/useHeaderMergeCells.tsx`
- **问题**:
  - 每次 setter 回调内 `new Set(getter(rowIdShowListAtom))` — 重复创建 Set
  - `.slice(0, rowIndex).filter().reduce()` — O(n²) 偏移量计算
- **数据**: `new Set()` 500 次 = 140ms vs 预构建 0.35ms (**404x**)；header/body 比 = 2.6x
- **思路**: 直接照搬 `useMergeCells.tsx` 的优化：
  1. 预构建 `visibleRowSet` / `visibleColSet`（只做一次）
  2. 预计算 `rowOffsetMap` / `colOffsetMap`（只做一次）
  3. 内层循环只查 Map

---

## P3 — 低优先级

### 7. border 插件 Array.includes → Set.has

- **文件**: `packages/table/src/plugins/border/useBorder.ts:101,124`
- **问题**: `columnIdShowList.filter(id => !stickyRightIds.includes(id))` — includes O(n)
- **数据**: 500 列 + 20 sticky 时 2.5x 差距，绝对值很小 (1.9ms vs 0.8ms)
- **思路**: `const stickySet = new Set(stickyRightIds)` 然后 `!stickySet.has(id)`

### 8. headerDataInitAtom 逐行 setter → Map 方案

- **文件**: `packages/table/src/stateHeader.ts:13-18`
- **问题**: 与旧 dataInitAtom 相同模式
- **数据**: 20 行 = 0.02ms，**不是瓶颈**，因为 header 行数很少
- **思路**: 暂不需要优化，除非未来 header 行数增多

---

## 通用优化思路：消除逐 cell setter

当前 areaSelected / copyStyle / mergeCells / border 都用了同一个模式：

```ts
// 当前：O(n) 次 setter，每次创建订阅
cells.forEach(cellId => {
  store.setter(getCellStateAtomById(cellId), (getter, prev) => ({
    ...prev,
    style: { ...prev.style, ...newStyle },
  }))
})
```

统一的优化方向是**数据下沉到一个 Map atom + 消费端 selectAtom**：

```ts
// 生产端：一次 setter
store.setter(featureStyleMapAtom, new Map([
  [cellId1, style1],
  [cellId2, style2],
  ...
]))

// 消费端（useCell 内）：selectAtom 自动精准更新
const featureStyle = selectAtom(featureStyleMapAtom, map => map.get(cellId))
```

好处：
- 生产端从 N 次 setter → 1 次
- 消费端 selectAtom 做引用比较，只有该 cell 的值变了才触发重渲染
- 清除时直接 set 空 Map，一次操作

可以考虑在 `useCell.ts` 中合并读取多个 feature Map atom（areaSelected / copy / mergeCell），统一输出 style + className。
