import { test, expect } from '@playwright/test'

test.describe('Keyboard Plugin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/plugins/keyboard')
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('.grid-table')
  })

  test('should display no focus initially', async ({ page }) => {
    const display = page.locator('[data-testid="focus-display"]')
    await expect(display).toContainText('无')
  })

  test('should navigate with arrow keys after focusing table', async ({ page }) => {
    // 先点击表格区域让它获得焦点
    const table = page.locator('.grid-table')
    await table.click()
    await page.waitForTimeout(300)

    // 按下方向键
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(300)

    // 检查焦点显示是否更新
    const display = page.locator('[data-testid="focus-display"]')
    const text = await display.textContent()
    // 应该不再显示"无"，而是显示具体位置
    // 如果键盘导航工作正常，应该有行和列信息
    expect(text).not.toContain('无')
  })

  test('should clear focus on Escape', async ({ page }) => {
    const table = page.locator('.grid-table')
    await table.click()
    await page.waitForTimeout(200)

    // 先导航到某个位置
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(200)

    // 按 Escape
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)

    const display = page.locator('[data-testid="focus-display"]')
    await expect(display).toContainText('无')
  })

  test('should navigate right with ArrowRight', async ({ page }) => {
    const table = page.locator('.grid-table')
    await table.click()
    await page.waitForTimeout(200)

    // 导航到第一个位置
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(200)

    const display = page.locator('[data-testid="focus-display"]')
    const text1 = await display.textContent()

    // 向右移动
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(200)

    const text2 = await display.textContent()

    // 列应该变了
    if (text1 && text2) {
      expect(text2).not.toBe(text1)
    }
  })
})
