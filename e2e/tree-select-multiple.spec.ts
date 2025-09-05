import { test, expect } from '@playwright/test'

/**
 * 直接调用React的onClick处理器来选择树节点
 * 用于解决虚拟滚动中的点击事件问题
 */
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

test.describe('TreeSelect Multiple Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tree/select-multiple')
    await page.waitForLoadState('networkidle')
  })

  test('should display multiple selection demo page', async ({ page }) => {
    // 验证页面标题
    await expect(page.locator('h1')).toContainText('TreeSelect 多选模式演示')

    // 验证各个demo部分存在
    await expect(page.locator('h2').first()).toContainText('基础多选')
    await expect(page.locator('h2').nth(1)).toContainText('预设默认值')
    await expect(page.locator('h2').nth(2)).toContainText('禁用状态')
  })

  test('should support multiple selection with checkboxes', async ({ page }) => {
    // 点击第一个多选组件
    const firstDemo = page.locator('.demo-item').first()
    const treeSelect = firstDemo.locator('.tree-select')

    await treeSelect.click()
    await page.waitForTimeout(500)

    // 验证下拉框打开
    await expect(page.locator('.tree-select-dropdown')).toBeVisible()

    // 选择第一个节点
    await clickTreeNodeByText(page, '技术部')
    await page.waitForTimeout(200)

    // 验证下拉框仍然打开（多选模式）
    await expect(page.locator('.tree-select-dropdown')).toBeVisible()

    // 选择第二个节点
    await clickTreeNodeByText(page, '产品部')
    await page.waitForTimeout(200)

    // 验证结果显示
    const resultDiv = firstDemo.locator('.demo-result')
    await expect(resultDiv).toContainText('tech')
    await expect(resultDiv).toContainText('product')
  })

  test('should display tags for selected items', async ({ page }) => {
    // 点击第二个demo（预设默认值）
    const secondDemo = page.locator('.demo-section').nth(1).locator('.demo-item')
    const treeSelect = secondDemo.locator('.tree-select')

    // 验证预设的标签存在
    await expect(treeSelect.locator('.tree-select-tag')).toHaveCount(2)
    await expect(treeSelect.locator('.tree-select-tag').first()).toContainText('管理后台系统')
    await expect(treeSelect.locator('.tree-select-tag').nth(1)).toContainText('iOS应用')
  })

  test('should remove tags when clicking close button', async ({ page }) => {
    // 点击第二个demo（预设默认值）
    const secondDemo = page.locator('.demo-section').nth(1).locator('.demo-item')
    const treeSelect = secondDemo.locator('.tree-select')

    // 点击第一个标签的关闭按钮
    await treeSelect.locator('.tree-select-tag-close').first().click()
    await page.waitForTimeout(200)

    // 验证标签数量减少
    await expect(treeSelect.locator('.tree-select-tag')).toHaveCount(1)

    // 验证结果更新
    const resultDiv = secondDemo.locator('.demo-result')
    await expect(resultDiv).not.toContainText('admin-system')
    await expect(resultDiv).toContainText('ios-app')
  })

  test('should show checkboxes in multiple mode', async ({ page }) => {
    // 点击第一个多选组件
    const firstDemo = page.locator('.demo-item').first()
    const treeSelect = firstDemo.locator('.tree-select')

    await treeSelect.click()
    await page.waitForTimeout(500)

    // 验证复选框存在
    const checkboxes = page.locator('.tree-select-node-checkbox')
    await expect(checkboxes.first()).toBeVisible()

    // 验证复选框显示正确符号
    const firstCheckbox = checkboxes.first()
    const checkboxText = await firstCheckbox.textContent()
    expect(checkboxText).toMatch(/[☐☑]/)
  })

  test('should respect maxTagCount property', async ({ page }) => {
    // 找到"最多显示1个标签"的demo
    const tagLimitDemo = page.locator('.demo-section').last().locator('.demo-item').first()
    const treeSelect = tagLimitDemo.locator('.tree-select')

    await treeSelect.click()
    await page.waitForTimeout(500)

    // 选择多个项目
    await clickTreeNodeByText(page, 'Web项目')
    await page.waitForTimeout(200)
    await clickTreeNodeByText(page, '移动端项目')
    await page.waitForTimeout(200)
    await clickTreeNodeByText(page, '后端项目')
    await page.waitForTimeout(200)

    // 验证只显示1个标签和"+数量"提示
    const tags = treeSelect.locator('.tree-select-tag')
    await expect(tags).toHaveCount(2) // 1个实际标签 + 1个"+more"标签
    await expect(tags.last()).toContainText('+')
  })

  test('should work in disabled state', async ({ page }) => {
    // 找到禁用状态的demo
    const disabledDemo = page.locator('.demo-section').nth(2).locator('.demo-item')
    const treeSelect = disabledDemo.locator('.tree-select')

    // 验证组件被禁用
    await expect(treeSelect.locator('.tree-select-selector')).toHaveClass(
      /tree-select-selector-disabled/,
    )

    // 验证预设的标签存在且没有关闭按钮
    await expect(treeSelect.locator('.tree-select-tag')).toHaveCount(2)
    await expect(treeSelect.locator('.tree-select-tag-close')).toHaveCount(0)

    // 尝试点击应该没有反应
    await treeSelect.click()
    await page.waitForTimeout(300)
    await expect(page.locator('.tree-select-dropdown')).not.toBeVisible()
  })

  test('should not select disabled nodes', async ({ page }) => {
    // 找到"禁用节点"demo区域
    const disabledNodesDemo = page.locator('.demo-section').nth(3).locator('.demo-item')
    const treeSelect = disabledNodesDemo.locator('.tree-select')

    await treeSelect.click()
    await page.waitForTimeout(500)

    // 验证下拉框打开
    await expect(page.locator('.tree-select-dropdown')).toBeVisible()

    // 尝试点击一个禁用节点（Vue开发组）
    await clickTreeNodeByText(page, 'Vue开发组')
    await page.waitForTimeout(200)

    // 验证没有标签被添加到选择器中
    await expect(treeSelect.locator('.tree-select-tag')).toHaveCount(0)

    // 点击一个正常节点（React开发组）
    await clickTreeNodeByText(page, 'React开发组')
    await page.waitForTimeout(200)

    // 验证正常节点可以被选中
    await expect(treeSelect.locator('.tree-select-tag')).toHaveCount(1)
    await expect(treeSelect.locator('.tree-select-tag').first()).toContainText('React开发组')

    // 再次尝试点击禁用节点（Python开发组）
    await clickTreeNodeByText(page, 'Python开发组')
    await page.waitForTimeout(200)

    // 验证标签数量没有增加
    await expect(treeSelect.locator('.tree-select-tag')).toHaveCount(1)
  })

  test('should show disabled node styles', async ({ page }) => {
    // 找到"禁用节点"demo区域
    const disabledNodesDemo = page.locator('.demo-section').nth(3).locator('.demo-item')
    const treeSelect = disabledNodesDemo.locator('.tree-select')

    await treeSelect.click()
    await page.waitForTimeout(500)

    // 查找禁用节点并验证样式
    const disabledNode = page.locator('.tree-select-node-disabled').first()
    await expect(disabledNode).toBeVisible()

    // 验证禁用节点有正确的CSS类
    await expect(disabledNode).toHaveClass(/tree-select-node-disabled/)

    // 验证禁用的复选框样式
    const disabledCheckbox = disabledNode.locator('.tree-select-node-checkbox-disabled')
    await expect(disabledCheckbox).toBeVisible()
  })
})
