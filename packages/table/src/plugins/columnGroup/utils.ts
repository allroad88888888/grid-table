import type { ColumnType } from '../../types/column'
import type { GroupColumnType, HeaderCell } from './types'

/**
 * 计算最大嵌套深度（header 行数）
 */
export function getMaxDepth(columns: GroupColumnType[]): number {
  let max = 1
  for (const col of columns) {
    if (col.children && col.children.length > 0) {
      const childDepth = getMaxDepth(col.children) + 1
      if (childDepth > max) max = childDepth
    }
  }
  return max
}

/**
 * 将嵌套列定义扁平化为叶子列列表
 */
export function flattenColumns(columns: GroupColumnType[]): ColumnType[] {
  const result: ColumnType[] = []
  for (const col of columns) {
    if (col.children && col.children.length > 0) {
      result.push(...flattenColumns(col.children))
    } else {
      result.push(col)
    }
  }
  return result
}

/**
 * 构建表头网格布局
 */
export function buildHeaderGrid(columns: GroupColumnType[]): HeaderCell[][] {
  const maxDepth = getMaxDepth(columns)
  const grid: HeaderCell[][] = Array.from({ length: maxDepth }, () => [])

  let leafIndex = 0

  function walk(cols: GroupColumnType[], depth: number) {
    for (const col of cols) {
      if (col.children && col.children.length > 0) {
        const startLeaf = leafIndex
        walk(col.children, depth + 1)
        const colSpan = leafIndex - startLeaf

        grid[depth].push({
          column: col,
          rowIndex: depth,
          colStart: startLeaf,
          colSpan,
          rowSpan: 1,
        })
      } else {
        grid[depth].push({
          column: col,
          rowIndex: depth,
          colStart: leafIndex,
          colSpan: 1,
          rowSpan: maxDepth - depth,
        })
        leafIndex++
      }
    }
  }

  walk(columns, 0)
  return grid
}
