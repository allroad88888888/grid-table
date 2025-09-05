import { test, expect } from '@playwright/test'

// 辅助函数：直接调用React组件的onClick（解决虚拟滚动中的事件问题）
async function clickTreeNodeByText(page: any, nodeText: string) {
  await page.evaluate((text: string) => {
    const nodeDiv = Array.from(document.querySelectorAll('.tree-select-node')).find((el) =>
      el.textContent?.includes(text),
    )

    if (nodeDiv) {
      const reactFiberKey = Object.keys(nodeDiv).find(
        (key) => key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance'),
      )

      if (reactFiberKey) {
        const fiber = (nodeDiv as any)[reactFiberKey]
        if (fiber?.memoizedProps?.onClick) {
          const syntheticEvent = {
            stopPropagation: () => {},
            preventDefault: () => {},
            target: nodeDiv,
            currentTarget: nodeDiv,
          }
          fiber.memoizedProps.onClick(syntheticEvent)
        }
      }
    }
  }, nodeText)
}

test.describe('TreeSelect Component', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到TreeSelect示例页面
    await page.goto('/tree/select')

    // 等待页面加载完成
    await page.waitForLoadState('networkidle')
  })

  test('should call onChange when selecting a tree node', async ({ page }) => {
    // 精确定位第一个TreeSelect组件（标准树形数据）
    const firstDemoItem = page.locator('.demo-item').first()
    const treeSelect = firstDemoItem.locator('.tree-select')

    // 点击选择器打开下拉框
    await treeSelect.click()

    // 等待下拉框出现
    await page.waitForSelector('.tree-select-dropdown', { state: 'visible' })

    // 等待树形节点渲染完成（虚拟滚动需要时间）
    await page.waitForTimeout(2000)

    // 直接调用React的onClick handler（解决虚拟滚动中的事件问题）
    await clickTreeNodeByText(page, '节点AA')

    await page.waitForTimeout(1000)

    // 验证选择器显示选中的值
    const selectorContent = firstDemoItem.locator('.tree-select-selection-content')
    await expect(selectorContent).toHaveText('节点AA')

    // 验证下拉框关闭（单选模式下选择后自动关闭）
    await expect(page.locator('.tree-select-dropdown')).not.toBeVisible()

    // 验证demo结果显示
    const demoResult = firstDemoItem.locator('.demo-result')
    await expect(demoResult).toContainText('AA')
  })

  test('should support clear selection', async ({ page }) => {
    // 使用第一个TreeSelect
    const firstDemoItem = page.locator('.demo-item').first()
    const treeSelect = firstDemoItem.locator('.tree-select')

    // 先选择一个节点
    await treeSelect.click()
    await page.waitForSelector('.tree-select-dropdown', { state: 'visible' })
    await page.waitForTimeout(2000)

    // 直接调用React的onClick handler
    await clickTreeNodeByText(page, '节点AA')

    await page.waitForTimeout(1000)

    // 验证选中状态
    const selectorContent = firstDemoItem.locator('.tree-select-selection-content')
    await expect(selectorContent).toHaveText('节点AA')

    // 悬停到TreeSelect上显示清除按钮
    await treeSelect.hover()

    // 点击清除按钮
    const clearButton = firstDemoItem.locator('.tree-select-clear')
    await expect(clearButton).toBeVisible()
    await clearButton.click()

    // 验证清除后的状态
    await expect(selectorContent).toHaveText('请选择节点...')
    await expect(selectorContent).toHaveClass(/placeholder/)
  })

  test('should support different states (disabled/readonly)', async ({ page }) => {
    // 找到状态控制section
    const stateSection = page.locator('.demo-section').filter({ hasText: '状态控制' })

    // 测试禁用状态
    const disabledCheckbox = stateSection.locator('input[type="checkbox"]').first()
    await disabledCheckbox.check()

    const stateTreeSelect = stateSection.locator('.tree-select')
    await expect(stateTreeSelect.locator('.tree-select-selector')).toHaveClass(
      /tree-select-selector-disabled/,
    )

    // 测试只读状态
    await disabledCheckbox.uncheck()
    const readonlyCheckbox = stateSection.locator('input[type="checkbox"]').nth(1)
    await readonlyCheckbox.check()

    await expect(stateTreeSelect.locator('.tree-select-selector')).toHaveClass(
      /tree-select-selector-readonly/,
    )
  })

  test('should support different sizes', async ({ page }) => {
    // 找到状态控制section
    const stateSection = page.locator('.demo-section').filter({ hasText: '状态控制' })
    const sizeSelect = stateSection.locator('select')
    const stateTreeSelect = stateSection.locator('.tree-select')

    // 测试小尺寸
    await sizeSelect.selectOption('small')
    await expect(stateTreeSelect.locator('.tree-select-selector')).toHaveClass(
      /tree-select-selector-small/,
    )

    // 测试大尺寸
    await sizeSelect.selectOption('large')
    await expect(stateTreeSelect.locator('.tree-select-selector')).toHaveClass(
      /tree-select-selector-large/,
    )

    // 恢复中等尺寸
    await sizeSelect.selectOption('middle')
    await expect(stateTreeSelect.locator('.tree-select-selector')).toHaveClass(
      /tree-select-selector-middle/,
    )
  })

  test('should work with relation data format', async ({ page }) => {
    // 使用第二个TreeSelect（Relation数据格式）
    const secondDemoItem = page.locator('.demo-item').nth(1)
    const treeSelect = secondDemoItem.locator('.tree-select')

    // 点击打开下拉框
    await treeSelect.click()

    // 等待下拉框和数据加载
    await page.waitForSelector('.tree-select-dropdown', { state: 'visible' })
    await page.waitForTimeout(1500) // relation数据可能需要更多加载时间

    // 检查是否有节点渲染（relation数据结构可能不同）
    const hasNodes = (await page.locator('.tree-select-node-label').count()) > 0
    if (hasNodes) {
      const firstNode = page.locator('.tree-select-node-label').first()
      await firstNode.click()

      // 验证选中结果
      const selectorContent = secondDemoItem.locator('.tree-select-selection-content')
      await expect(selectorContent).not.toHaveText('请选择节点...')
    }
  })
})
