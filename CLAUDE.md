# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Grid-table 是一个基于 React 构建的虚拟滚动表格库，使用 CSS Grid 实现高性能渲染。项目采用 monorepo 架构，包含多个实现不同功能的包。

### 核心包架构

- **@grid-table/basic**: 基础包，提供基本的状态管理和核心工具，使用 `@einfach/react` atoms
- **@grid-table/core**: 核心虚拟滚动组件，包括 `VGridTable`、`VGridList`、自动调整大小和网格定位 hooks
- **@grid-table/view**: 主要表格视图组件，包含完整功能集，支持拖拽、固定列、区域选择、复制、过滤等插件
- **@grid-table/excel**: Excel 类似功能，支持单元格编辑
- **@grid-table/pivot**: 透视表实现，包含数据转换和树结构
- **@grid-tree/core**: 树数据结构工具和组件
- **@grid-table/example**: 开发示例和演示

### 关键技术

- **状态管理**: `@einfach/react` (基于 atom 的状态管理，类似 Jotai)
- **UI 框架**: React 18+ + TypeScript
- **构建系统**: 自定义 Gulp 管道，使用 SWC 进行 TypeScript 编译
- **测试**: Jest + React Testing Library + SWC 转换
- **包管理**: pnpm workspace

## 常用开发命令

### 根目录命令
```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm run build

# 运行测试并生成覆盖率报告
pnpm run test

# 代码检查
pnpm run eslint

# 类型检查
pnpm run tsc
```

### 示例开发
```bash
# 运行开发服务器 (从根目录或 packages/example)
cd packages/example && pnpm run dev
```

### 单个包命令
每个包都支持:
```bash
# 构建特定包
cd packages/[包名] && pnpm run build
```

## 状态管理模式

项目使用 `@einfach/react` atoms 进行状态管理。关键模式:

- 使用 `atom()` 管理基础状态
- 使用 `atomFamily()` 管理相关状态集合
- 计算值通过选择器从 atoms 派生
- 状态通常在专门的状态文件中组织 (如 `state.ts`、`stateCore.ts`)

## 架构模式

### 插件系统
表格视图 (`@grid-table/view`) 使用插件架构:
- 插件位于 `packages/table/src/plugins/`，实现拖拽、固定、复制等功能
- 每个插件提供 hooks 和组件
- 插件通过共享状态 atoms 集成

### 虚拟滚动
- 基于 CSS Grid 的网格布局
- 行列虚拟化以提升性能
- 滚动定位 hooks (`useScrollLogicalPosition`、`useScrollTo`)
- 自动调整大小功能 (`useColumnsAutoSize`)

### 组件结构
- 逻辑 (hooks) 和表现 (components) 分离
- 大量使用 React.memo 优化性能
- 自定义 hooks 命名约定: `use[功能]`

## 测试策略

- 使用 Jest + SWC 转换进行单元测试
- React Testing Library 用于组件测试
- 测试文件位于源文件旁边或 `__tests__` 目录
- 在 `coverage/` 目录生成覆盖率报告

## 构建流程

构建使用自定义 Gulp 管道:
- 通过 SWC 编译 TypeScript (比 tsc 更快)
- 输出到各包的 `esm/` 目录
- CSS/资源文件直接复制
- 生产构建时禁用 watch 模式

## 开发规范

基于 `.cursor/rules/always.mdc`:
- 所有状态管理必须使用 `@einfach/react`
- 组件 props 优先使用 `type` 而非 `interface`
- 使用函数组件和 hooks
- 实现正确的 TypeScript 类型 (避免 `any`)
- CSS 类名遵循 BEM 命名规范
- 使用 CSS Grid 实现表格布局
- 实现适当的错误边界和错误处理
- 针对虚拟滚动性能进行优化

## 关键文件位置

- 构建配置: `gulpfile.mjs`
- Jest 配置: `jest.config.mjs`
- TypeScript 配置: `tsconfig*.json` 文件
- 工作空间配置: `pnpm-workspace.yaml`
- Cursor AI 规则: `.cursor/rules/always.mdc`