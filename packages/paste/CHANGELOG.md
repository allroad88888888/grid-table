# @grid-table/paste

## 0.1.6

### Patch Changes

- 7fa3df2: - 修正 `headerRowSizeMaAtom` 拼写为 `headerRowSizeMapAtom`（旧名为 typo，与 `columnSizeMapAtom` / `rowSizeMapAtom` 命名风格统一）
  - 超大选区（>100k cells）不再物化 cellId 矩阵，避免内存爆炸；超额时 copy 拒绝执行并 warn，避免触发二次 OOM
  - `@grid-table/paste` 顶层导出 `useTablePasteWithFormatter` 及 `ColumnFormatter` / `UseTablePasteWithFormatterResult` 类型

## 0.1.5

### Patch Changes

- 6b5b57d: windows下缩放列错位

## 0.1.4

### Patch Changes

- onColumnResize
