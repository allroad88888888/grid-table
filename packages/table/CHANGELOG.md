# @grid-table/view

## 0.6.69

### Patch Changes

- Updated dependencies [e89bc1a]
  - @grid-table/core@0.6.69
  - @grid-table/basic@0.6.69

## 0.6.68

### Patch Changes

- Fix sticky merge overlay behavior across fixed columns.

  This release improves large merged cell rendering by keeping sticky merge content visible
  without covering following cells, restoring fixed-column shadow classes on merge overlays,
  and tightening related regression coverage.

- Updated dependencies
  - @grid-table/basic@0.6.68
  - @grid-table/core@0.6.68

## 0.6.67

### Patch Changes

- fix: 移除合并单元格 sticky 模式下的 zIndex 重置
  - @grid-table/core@0.6.67
  - @grid-table/basic@0.6.67

## 0.6.66

### Patch Changes

- Updated dependencies
  - @grid-table/core@0.6.66
  - @grid-table/basic@0.6.66

## 0.6.65

### Patch Changes

- fix: patch release
  - @grid-table/core@0.6.65
  - @grid-table/basic@0.6.65

## 0.6.64

### Patch Changes

- perf: replace per-cell store.setter in useMergeCells with single mergeCellStyleMapAtom — setter calls from 2.19M to 1
  - @grid-table/core@0.6.64
  - @grid-table/basic@0.6.64

## 0.6.63

### Patch Changes

- perf: replace per-row atomFamily setter with single rowInfoMapAtom in dataInitAtom
- perf: add useRowInfoById hook with selectAtom for efficient per-row data access
- perf: replace findIndexList O(n) with Map O(1) lookup in areaSelected plugin
- perf: optimize useMergeCells — pre-built Sets and offset Maps
  - @grid-table/core@0.6.63
  - @grid-table/basic@0.6.63

## 0.6.62

### Patch Changes

- feat: add stickyMergeCell prop to control sticky positioning for overflow merge cells
  - @grid-table/core@0.6.62
  - @grid-table/basic@0.6.62

## 0.6.61

### Patch Changes

- fix: simplify sticky merge cells — remove scroll/resize listeners, use native sticky positioning with z-index layering
  - @grid-table/core@0.6.61
  - @grid-table/basic@0.6.61

## 0.6.60

### Patch Changes

- fix: sticky positioning for merge cells that exceed viewport height
  - @grid-table/core@0.6.60
  - @grid-table/basic@0.6.60

## 0.6.59

### Patch Changes

- fix: disable scroll anchoring (`overflow-anchor: none`) to prevent content jump during virtual scroll
  - @grid-table/core@0.6.59
  - @grid-table/basic@0.6.59

## 0.6.58

### Patch Changes

- Fix column auto-size measurement under virtual scrolling by using the `--column` CSS custom property instead of discontinuous grid column indices.
  - @grid-table/core@0.6.58
  - @grid-table/basic@0.6.58

## 0.6.55

### Patch Changes

- onColumnResize
- Updated dependencies
  - @grid-table/basic@0.6.55
  - @grid-table/core@0.6.55

## 0.6.54

### Patch Changes

- Updated dependencies
  - @grid-table/core@0.6.54
  - @grid-table/basic@0.6.54

## 0.6.53

### Patch Changes

- Updated dependencies
  - @grid-table/core@0.6.53
  - @grid-table/basic@0.6.53

## 0.6.49

### Patch Changes

- feat:添加cell 延迟渲染
- Updated dependencies
  - @grid-table/core@0.6.49
  - @grid-table/basic@0.6.49

## 0.6.48

### Patch Changes

- Updated dependencies
  - @grid-table/core@0.6.48
  - @grid-table/basic@0.6.48

## 0.6.47

### Patch Changes

- fixed:调整滚动方案
- Updated dependencies
  - @grid-table/core@0.6.47
  - @grid-table/basic@0.6.47

## 0.6.46

### Patch Changes

- fixed:移除vscroll 自身的一些延迟加载
- Updated dependencies
  - @grid-table/core@0.6.46
  - @grid-table/basic@0.6.46

## 0.6.45

### Patch Changes

- useSticky error
- Updated dependencies
  - @grid-table/basic@0.6.45
  - @grid-table/core@0.6.45

## 0.6.44

### Patch Changes

- ColumnResizeCallBack
- Updated dependencies
  - @grid-table/basic@0.6.44
  - @grid-table/core@0.6.44

## 0.6.43

### Patch Changes

- 放开useRowSelected
  - @grid-table/core@0.6.43
  - @grid-table/basic@0.6.43

## 0.6.42

### Patch Changes

- selectrows支持禁用ids
- Updated dependencies
  - @grid-table/core@0.6.42
  - @grid-table/basic@0.6.42

## 0.6.41

### Patch Changes

- Updated dependencies
  - @grid-table/core@0.6.41
  - @grid-table/basic@0.6.41

## 0.6.40

### Patch Changes

- Updated dependencies
  - @grid-table/core@0.6.40
  - @grid-table/basic@0.6.40

## 0.6.39

### Patch Changes

- 添加等比缩小
  - @grid-table/core@0.6.39
  - @grid-table/basic@0.6.39

## 0.6.38

### Patch Changes

- Updated dependencies
  - @grid-table/basic@0.6.38
  - @grid-table/core@0.6.38

## 0.6.37

### Patch Changes

- feat：第二次点击表头，取消选中
  - @grid-table/core@0.6.37
  - @grid-table/basic@0.6.37

## 0.6.36

### Patch Changes

- 修复0的时候 也要计算 比如loading 切换为false的时候，这里时候length为0 不计算，导致空被渲染
- Updated dependencies
  - @grid-table/core@0.6.36
  - @grid-table/basic@0.6.36

## 0.6.35

### Patch Changes

- 如果数据在laoding 不处理
- Updated dependencies
  - @grid-table/core@0.6.35
  - @grid-table/basic@0.6.35

## 0.6.34

### Patch Changes

- 不做全局loading了
- Updated dependencies
  - @grid-table/core@0.6.34
  - @grid-table/basic@0.6.34

## 0.6.33

### Patch Changes

- 支持奇数行 偶数行
- Updated dependencies
  - @grid-table/core@0.6.33
  - @grid-table/basic@0.6.33

## 0.6.32

### Patch Changes

- fixed:高度滚动条不用管
  - @grid-table/core@0.6.32
  - @grid-table/basic@0.6.32

## 0.6.31

### Patch Changes

- fixed:checkbox flowgrow:0
  - @grid-table/core@0.6.31
  - @grid-table/basic@0.6.31

## 0.6.30

### Patch Changes

- fixed修复鼠标右键 没计算滚动条偏移量
  - @grid-table/core@0.6.30
  - @grid-table/basic@0.6.30

## 0.6.29

### Patch Changes

- 支持多语言
  - @grid-table/core@0.6.29
  - @grid-table/basic@0.6.29

## 0.6.28

### Patch Changes

- feat:右键新增 固定到左边
  - @grid-table/core@0.6.28
  - @grid-table/basic@0.6.28

## 0.6.27

### Patch Changes

- fixed:修复表头拖拽宽度实效问题
  - @grid-table/core@0.6.27
  - @grid-table/basic@0.6.27

## 0.6.26

### Patch Changes

- feat:左边固定列支持boxshadow
  - @grid-table/core@0.6.26
  - @grid-table/basic@0.6.26

## 0.6.25

### Patch Changes

- 修复列头拖拽点击 不触发选中
  - @grid-table/core@0.6.25
  - @grid-table/basic@0.6.25

## 0.6.24

### Patch Changes

- 选中样式
  - @grid-table/core@0.6.24
  - @grid-table/basic@0.6.24

## 0.6.23

### Patch Changes

- fixed: 自定义copy没有生效
  - @grid-table/core@0.6.23
  - @grid-table/basic@0.6.23

## 0.6.22

### Patch Changes

- fixed export checkbox
  - @grid-table/core@0.6.22
  - @grid-table/basic@0.6.22

## 0.6.21

### Patch Changes

- fixed nodeSelectionSetAtom export
  - @grid-table/core@0.6.21
  - @grid-table/basic@0.6.21

## 0.6.20

### Patch Changes

- 选中列在最左边
  - @grid-table/core@0.6.20
  - @grid-table/basic@0.6.20

## 0.6.19

### Patch Changes

- 选中区域支持thead
- Updated dependencies
  - @grid-table/basic@0.6.19
  - @grid-table/core@0.6.19

## 0.6.18

### Patch Changes

- copy支持异步
  - @grid-table/core@0.6.18
  - @grid-table/basic@0.6.18

## 0.6.17

### Patch Changes

- remove log
  - @grid-table/core@0.6.17
  - @grid-table/basic@0.6.17

## 0.6.16

### Patch Changes

- 修复列不能被选中
  - @grid-table/core@0.6.16
  - @grid-table/basic@0.6.16

## 0.6.15

### Patch Changes

- cell id key change
  - @grid-table/core@0.6.15
  - @grid-table/basic@0.6.15

## 0.6.14

### Patch Changes

- 列的计算取正整数
  - @grid-table/core@0.6.14
  - @grid-table/basic@0.6.14

## 0.6.13

### Patch Changes

- hooks放开
  - @grid-table/core@0.6.13
  - @grid-table/basic@0.6.13

## 0.6.12

### Patch Changes

- 暴露更多api
  - @grid-table/core@0.6.12
  - @grid-table/basic@0.6.12

## 0.6.11

### Patch Changes

- 暴露更多的状态
  - @grid-table/core@0.6.11
  - @grid-table/basic@0.6.11

## 0.6.10

### Patch Changes

- 暴露更多plugins api
  - @grid-table/core@0.6.10
  - @grid-table/basic@0.6.10

## 0.5.19

### Patch Changes

- 复制支持对象

## 0.5.18

### Patch Changes

- remove log
- Updated dependencies
  - @grid-table/core@0.6.9

## 0.5.17

### Patch Changes

- 优化useAutoSizer 修复父容器 自动列宽
- Updated dependencies
  - @grid-table/core@0.6.8

## 0.5.16

### Patch Changes

- copy使用json.stringify

## 0.5.15

### Patch Changes

- 支持minColumnWidth maxColumnWidth columnPadding

## 0.5.14

### Patch Changes

- Updated dependencies
  - @grid-table/basic@0.5.2
  - @grid-table/core@0.6.7

## 0.5.13

### Patch Changes

- 移除外层div

## 0.5.11

### Patch Changes

- fixed 样式变更

## 0.5.10

### Patch Changes

- 支持valueInCols 移除border 用css实现，改用 js

## 0.5.6

### Patch Changes

- 自动调整宽度
- Updated dependencies
  - @grid-table/core@0.6.5

## 0.5.5

### Patch Changes

- 修复🚢columns 改变宽度
- Updated dependencies
  - @grid-table/core@0.6.4

## 0.5.4

### Patch Changes

- 移除module
- Updated dependencies
  - @grid-table/basic@0.5.1
  - @grid-table/core@0.5.3
