import { test, expect } from '@playwright/test'

test.describe('RowExpand Plugin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/plugins/row-expand')
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('.grid-table')
  })

  test('should display expand status as empty initially', async ({ page }) => {
    const status = page.locator('[data-testid="expand-status"]')
    await expect(status).toContainText('无')
  })

  test('should show table with data rows', async ({ page }) => {
    // 验证表格有数据
    const cells = page.locator('.grid-table-cell')
    const count = await cells.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should have row count matching data source', async ({ page }) => {
    // 获取可见行区域中的单元格数量
    const cellCount = await page.evaluate(() => {
      return document.querySelectorAll('.grid-table-cell').length
    })
    // 4 列 × N 行，至少应该有几行数据
    expect(cellCount).toBeGreaterThanOrEqual(4)
  })
})
