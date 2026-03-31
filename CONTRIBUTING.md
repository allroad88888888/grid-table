# Contributing to grid-table

[English](#english) | [中文](#中文)

---

## English

### Prerequisites

- Node.js >= 18
- pnpm >= 9

### Setup

```bash
git clone https://github.com/allroad88888888/grid-table.git
cd grid-table
pnpm install
pnpm run build    # required for workspace cross-references
```

### Development

```bash
# Start the demo dev server
cd packages/example && pnpm run dev

# Run tests
pnpm run test

# Type check
pnpm run tsc

# Lint
pnpm run eslint
```

### Pre-commit Hooks

Husky runs `tsc` and `test` before each commit. If the hook fails, fix the issue before committing.

### Adding a Changeset

If your change affects a published package, add a changeset:

```bash
pnpm changeset
```

Follow the prompts to select the affected packages and describe your change.

### Code Conventions

- State management: `@einfach/react` atoms only (no other state libraries)
- Props: use `type` instead of `interface`
- Components: function components + hooks only
- Types: avoid `any`, use `import type` for type imports
- CSS: BEM naming, CSS Grid for table layout
- Hooks: name as `use[Feature]`

### Pull Request Process

1. Create a branch from `main`
2. Make your changes
3. Add a changeset if the change affects published packages
4. Ensure CI passes (build, type check, test, lint)
5. Submit a pull request

---

## 中文

### 环境要求

- Node.js >= 18
- pnpm >= 9

### 安装

```bash
git clone https://github.com/allroad88888888/grid-table.git
cd grid-table
pnpm install
pnpm run build    # 首次需要，用于工作区包交叉引用
```

### 开发

```bash
# 启动示例开发服务器
cd packages/example && pnpm run dev

# 运行测试
pnpm run test

# 类型检查
pnpm run tsc

# 代码检查
pnpm run eslint
```

### Pre-commit Hooks

Husky 会在每次提交前运行 `tsc` 和 `test`。如果 hook 失败，请先修复问题再提交。

### 添加 Changeset

如果你的修改影响了已发布的包，需要添加 changeset：

```bash
pnpm changeset
```

按提示选择受影响的包并描述你的改动。

### 代码规范

- 状态管理：只使用 `@einfach/react` atoms（不使用其他状态库）
- Props 定义：使用 `type` 而非 `interface`
- 组件：只使用函数组件 + hooks
- 类型：避免 `any`，使用 `import type` 导入类型
- CSS：BEM 命名规范，表格布局使用 CSS Grid
- Hooks：命名为 `use[功能]`

### Pull Request 流程

1. 从 `main` 创建分支
2. 完成修改
3. 如果修改影响已发布的包，添加 changeset
4. 确保 CI 通过（构建、类型检查、测试、代码检查）
5. 提交 Pull Request
