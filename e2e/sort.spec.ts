import { test, expect } from '@playwright/test'

test.describe('Sort Plugin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/plugins/sort')
    await page.waitForLoadState('networkidle')
    // 等待表格渲染
    await page.waitForSelector('.grid-table')
  })

  test('should display sort status as empty initially', async ({ page }) => {
    const status = page.locator('[data-testid="sort-status"]')
    await expect(status).toContainText('无')
  })

  test('should show sortable headers with sort icons', async ({ page }) => {
    // 姓名列应该有 data-sortable 属性
    const sortableHeaders = page.locator('[data-sortable="true"]')
    const count = await sortableHeaders.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should sort ascending on first click', async ({ page }) => {
    // 获取排序前的第一个 tbody 单元格内容
    const firstCellBefore = await page.locator('.grid-table-cell').first().textContent()

    // 点击"年龄"表头进行排序
    const ageHeader = page.locator('[data-sortable="true"]').nth(1) // 年龄是第二个 sortable 列
    await ageHeader.click()

    // 等待状态变化
    await page.waitForTimeout(500)

    // 检查排序状态更新
    const status = page.locator('[data-testid="sort-status"]')
    await expect(status).toContainText('asc')
  })

  test('should sort descending on second click', async ({ page }) => {
    const ageHeader = page.locator('[data-sortable="true"]').nth(1)

    // 第一次点击 → asc
    await ageHeader.click()
    await page.waitForTimeout(300)

    // 第二次点击 → desc
    await ageHeader.click()
    await page.waitForTimeout(300)

    const status = page.locator('[data-testid="sort-status"]')
    await expect(status).toContainText('desc')
  })

  test('should clear sort on third click', async ({ page }) => {
    const ageHeader = page.locator('[data-sortable="true"]').nth(1)

    // 三次点击完成 asc → desc → null 循环
    await ageHeader.click()
    await page.waitForTimeout(300)
    await ageHeader.click()
    await page.waitForTimeout(300)
    await ageHeader.click()
    await page.waitForTimeout(300)

    const status = page.locator('[data-testid="sort-status"]')
    await expect(status).toContainText('无')
  })

  test('should actually reorder table rows when sorted', async ({ page }) => {
    // 收集排序前的年龄数据（第二列）
    const getCellTexts = async () => {
      return page.evaluate(() => {
        const cells = document.querySelectorAll('.grid-table-cell')
        const texts: string[] = []
        // 每行有5列，年龄在第2列(index 1)
        cells.forEach((cell, i) => {
          // 取前5行的年龄列
          if (i % 5 === 1 && texts.length < 5) {
            texts.push(cell.textContent?.trim() ?? '')
          }
        })
        return texts
      })
    }

    const beforeSort = await getCellTexts()

    // 点击年龄列排序
    const ageHeader = page.locator('[data-sortable="true"]').nth(1)
    await ageHeader.click()
    await page.waitForTimeout(500)

    const afterSort = await getCellTexts()

    // 排序后数据应该有变化（除非原始数据碰巧已排序）
    // 验证排序后数据是升序的
    const nums = afterSort.map(Number).filter((n) => !isNaN(n))
    if (nums.length > 1) {
      for (let i = 1; i < nums.length; i++) {
        expect(nums[i]).toBeGreaterThanOrEqual(nums[i - 1])
      }
    }
  })

  test('should clear sort via button', async ({ page }) => {
    // 先排序
    const ageHeader = page.locator('[data-sortable="true"]').nth(1)
    await ageHeader.click()
    await page.waitForTimeout(300)

    // 点击清除按钮
    await page.getByText('清除排序').click()
    await page.waitForTimeout(300)

    const status = page.locator('[data-testid="sort-status"]')
    await expect(status).toContainText('无')
  })
})
