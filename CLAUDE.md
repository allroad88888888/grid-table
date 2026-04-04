# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Grid-table 是一个基于 React 构建的虚拟滚动表格库，使用 CSS Grid 实现高性能渲染。项目采用 monorepo 架构（pnpm workspace），包含 `packages/*` 和 `solidjs/*` 两个工作空间。

## 常用命令

```bash
pnpm install                  # 安装依赖
pnpm run build                # 构建所有包（Gulp SWC 转译 + tsc 类型生成）
pnpm run test                 # Jest 单元测试（含覆盖率）
pnpm run eslint               # ESLint 检查（自动修复）
pnpm run tsc                  # TypeScript 类型检查

# 运行单个测试文件
npx jest packages/table/src/__tests__/someFile.test.ts

# E2E 测试（Playwright，需先安装浏览器）
pnpm run test:e2e:install     # 安装浏览器
pnpm run test:e2e             # 运行 E2E 测试（自动启动 dev server）
pnpm run test:e2e:headed      # 有界面模式
pnpm run test:e2e:ui          # Playwright UI 模式

# 开发示例
cd packages/example && pnpm run dev   # Vite dev server，http://localhost:5173

# 构建单个包
cd packages/[包名] && pnpm run build
```

## 包层级架构

```
Layer 0 - 无依赖:
  @grid-table/core    (packages/core)     虚拟滚动引擎：VGridTable, VGridList, useAutoSizer
  @grid-table/paste   (packages/paste)    剪贴板处理：TSV/CSV/HTML/JSON 解析

Layer 1 - 基础状态:
  @grid-table/basic   (packages/basic)    atom 状态管理、createCore()、行列索引/尺寸 atoms
  @grid-tree/core     (packages/tree)     树结构 hooks 和状态

Layer 2 - 视图层:
  @grid-table/view    (packages/table)    完整表格组件 + 插件系统（依赖 basic + core）
  @grid-tree/select   (packages/tree-select)  树选择器组件（依赖 tree）

Layer 3 - 领域功能:
  @grid-table/excel   (packages/excel)    Excel 编辑功能（依赖 view + basic + core）
  @grid-table/pivot   (packages/pivot)    透视表（依赖 view + basic + core）

Solid.js 移植:
  @grid-table-solidjs/core  (solidjs/core)  core 包的 Solid.js 版本，独立于 React
```

所有 `@grid-table/*` 包的 peer dependency 为 `@einfach/react` 和 `@einfach/utils`。

## 核心架构

### 状态管理（@einfach/react）

类似 Jotai 的 atom 模式，三种创建方式：

- **`atom(initialValue)`** — 基础状态（如 `columnIndexListAtom = atom<ColumnId[]>([])`）
- **`incrementAtom(getter)`** — 可变集合的计算状态（如合并后的列列表）
- **`createAtomFamily()`** — 按 ID 动态创建 atom（如每列/每行独立状态）

使用方式：`Store` + `Provider` 包裹组件树，组件内通过 `useAtom()` 订阅。状态通常组织在 `state.ts`、`stateCore.ts`、`stateColumn.ts` 等文件中。

### 虚拟滚动（@grid-table/core）

核心逻辑在 `useVScroll.ts`：
1. 预计算所有行/列的累积尺寸数组（sizeList）
2. 滚动时用 `findIndex()` 定位可见区域的 startIndex/endIndex
3. 默认 overscan=10 缓冲渲染
4. 支持 `stayIndexList` 保持特定行/列始终可见
5. 使用 `useTransition()` 节流批量更新

### 插件系统（@grid-table/view）

插件位于 `packages/table/src/plugins/`，每个插件提供 hooks + 组件：

| 插件 | 功能 |
|------|------|
| sticky | 固定列/表头 |
| drag | 列/行拖拽 |
| areaSelected | 区域选择 |
| copy | 复制到剪贴板 |
| select | 单元格/行选择 |
| filter | 数据过滤 |
| mergeCells | 单元格合并 |
| calcSizeByColumn | 列宽自动计算 |
| border | 单元格边框/冲突处理 |
| rowNumber | 行号显示 |
| theadColumnHide | 列隐藏切换 |
| theadContextMenu | 表头右键菜单 |

主组件 `TableExcel`（别名 `Table`），通过 `Provider` 注入 store。`@grid-table/view` 会 re-export `@grid-table/basic` 和 `@grid-table/core` 的所有导出。

## 构建流程

- **Gulp + SWC**：将 `src/**/*.{ts,tsx}` 编译为 `esm/` 目录下的 `.js`，CSS/图片直接复制
- **tsc --build**：生成 `@types/` 类型定义
- `.swcrc` 配置：TypeScript + TSX，React automatic runtime，ESNext target，ES6 模块
- 开发模式下 Gulp 启用 watch，`DISABLE_WATCH=true` 或 `NODE_ENV=production` 禁用

## 开发规范

- 状态管理必须使用 `@einfach/react`，不使用其他状态库
- 组件 props 优先使用 `type` 而非 `interface`
- 使用函数组件 + hooks，hooks 命名 `use[功能]`
- 避免 `any` 类型，使用 `import type` 导入类型
- CSS 类名遵循 BEM 命名，表格布局使用 CSS Grid
- 大量使用 `React.memo` 优化虚拟滚动性能

## 测试

- 单元测试统一在根目录运行，各包无独立 test 脚本
- Jest + `@swc/jest` 转译，jsdom 环境
- CSS 导入映射到 `rules/empty.ts`（空模块）
- `@testing-library/jest-dom` 在 `rules/setup-jest.ts` 中配置
- E2E 测试用 Playwright，测试文件在 `e2e/` 目录，dev server 自动启动

## Git 提交规范

- commit message 和 commit body 中**禁止**出现任何 AI 相关文字，包括但不限于：claude、anthropic、ai、gpt、copilot、session 链接等
- commit author 使用仓库默认配置，不要使用 AI 相关的 author/email
- commit message 使用 conventional commits 格式（feat/fix/test/style/refactor/ci/docs）
