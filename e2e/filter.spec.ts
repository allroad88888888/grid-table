import { test, expect } from '@playwright/test'

test.describe('Filter Plugin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/plugins/filter')
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('.grid-table')
  })

  test('should display filter status as 0 initially', async ({ page }) => {
    const status = page.locator('[data-testid="filter-status"]')
    await expect(status).toContainText('过滤条件数： 0')
  })

  test('should filter by name when apply is clicked', async ({ page }) => {
    // 获取过滤前的行数
    const getRowCount = async () => {
      return page.evaluate(() => {
        return document.querySelectorAll('.grid-table-cell').length
      })
    }

    const beforeCount = await getRowCount()

    // 输入姓名过滤条件
    const nameInput = page.locator('[data-testid="filter-name-input"]')
    await nameInput.fill('员工1')

    // 点击应用过滤
    await page.locator('[data-testid="filter-apply-btn"]').click()
    await page.waitForTimeout(500)

    // 检查过滤状态更新
    const status = page.locator('[data-testid="filter-status"]')
    await expect(status).toContainText('过滤条件数： 1')

    // 过滤后行数应该减少
    const afterCount = await getRowCount()
    expect(afterCount).toBeLessThan(beforeCount)
  })

  test('should clear filters', async ({ page }) => {
    // 先应用一个过滤条件
    const nameInput = page.locator('[data-testid="filter-name-input"]')
    await nameInput.fill('员工1')
    await page.locator('[data-testid="filter-apply-btn"]').click()
    await page.waitForTimeout(300)

    // 点击清除
    await page.locator('[data-testid="filter-clear-btn"]').click()
    await page.waitForTimeout(300)

    // 过滤状态应该回到 0
    const status = page.locator('[data-testid="filter-status"]')
    await expect(status).toContainText('过滤条件数： 0')
  })

  test('should filter by department checkboxes', async ({ page }) => {
    // 勾选"技术部"
    const techCheckbox = page.getByText('技术部').locator('input[type="checkbox"]')
    await techCheckbox.check()

    // 应用过滤
    await page.locator('[data-testid="filter-apply-btn"]').click()
    await page.waitForTimeout(500)

    // 过滤状态应该显示 1 个条件
    const status = page.locator('[data-testid="filter-status"]')
    await expect(status).toContainText('过滤条件数： 1')
    await expect(status).toContainText('department')

    // 所有可见行的部门列应该是"技术部"
    const deptTexts = await page.evaluate(() => {
      const cells = document.querySelectorAll('.grid-table-cell')
      const depts: string[] = []
      // 4 columns: 姓名,年龄,得分,部门 → 部门在 index 3
      cells.forEach((cell, i) => {
        if (i % 4 === 3 && depts.length < 10) {
          depts.push(cell.textContent?.trim() ?? '')
        }
      })
      return depts
    })

    for (const dept of deptTexts) {
      if (dept) {
        expect(dept).toBe('技术部')
      }
    }
  })
})
