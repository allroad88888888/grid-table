import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import type { Getter } from '@einfach/react'
import { useAtomValue, useStore } from '@einfach/react'
import {
  columnIdShowListAtom,
  rowIdShowListAtom,
  rowIndexListAtom,
  useBasic,
} from '@grid-table/basic'
import { getCellId, getRowIdAndColIdByCellId } from '../../utils/getCellId'
import { tbodyMergeCellListAtom } from '../../components'
import { lastSet } from './utils'

export function useMergeCells({
  showBorder = true,
  containerSize,
}: { showBorder?: boolean; containerSize?: { width: number; height: number } } = {}) {
  const store = useStore()
  const { getCellStateAtomById, columnSizeMapAtom, rowSizeMapAtom } = useBasic()

  const cellList = useAtomValue(tbodyMergeCellListAtom, { store })
  const columnSizeMap = useAtomValue(columnSizeMapAtom, { store })
  const rowSizeMap = useAtomValue(rowSizeMapAtom, { store })
  const rowIdList = useAtomValue(rowIndexListAtom, { store })

  useEffect(() => {
    if (!showBorder) return

    if (!cellList || cellList.length === 0) {
      return
    }

    // 预计算每行的绝对 top 偏移，用于 sticky 定位
    const rowPrefixTopMap = new Map<string, number>()
    let rowTopAcc = 0
    rowIdList.forEach((rowId) => {
      rowPrefixTopMap.set(rowId, rowTopAcc)
      rowTopAcc += rowSizeMap.get(rowId) || 0
    })

    // 初始化 CSS 变量（用于 sticky 合并单元格的动态 top/height 计算）
    const tableContainer = document.querySelector<HTMLElement>('.grid-table')
    const theadElement = tableContainer?.querySelector<HTMLElement>("[role='thead']")
    let lastScrollTop = Number.NaN
    let lastViewportHeight = Number.NaN
    let lastTheadHeight = Number.NaN

    const updateLayoutVars = () => {
      if (!tableContainer) return
      const viewportHeight = tableContainer.offsetHeight || 0
      const nextTheadHeight = theadElement?.offsetHeight || 0
      if (viewportHeight !== lastViewportHeight) {
        tableContainer.style.setProperty('--grid-table-viewport-height', `${viewportHeight}px`)
        lastViewportHeight = viewportHeight
      }
      if (nextTheadHeight !== lastTheadHeight) {
        tableContainer.style.setProperty('--grid-table-thead-height', `${nextTheadHeight}px`)
        lastTheadHeight = nextTheadHeight
      }
    }

    const updateScrollTopVar = () => {
      if (!tableContainer) return
      const scrollTop = tableContainer.scrollTop || 0
      if (Math.abs(scrollTop - lastScrollTop) < 0.5) return
      tableContainer.style.setProperty('--grid-table-scroll-top', `${scrollTop}px`)
      lastScrollTop = scrollTop
    }

    // 检查是否有任何合并单元格需要 sticky（高度超过容器）
    const maxHeight = containerSize?.height || Infinity
    let needsStickyTracking = false

    const clearList: (() => void)[] = []

    cellList?.forEach(({ cellId, rowIdList: mergeRowIdList = [], colIdList = [] }) => {
      const [curRowId, curColId] = getRowIdAndColIdByCellId(cellId)

      // 预计算合并区域的总高度，判断是否需要 sticky
      const allMergedRowIds = [curRowId, ...mergeRowIdList]
      const mergeFullHeight = allMergedRowIds.reduce<number>((prev, rowId) => {
        return prev + (rowSizeMap.get(rowId) || 0)
      }, 0)
      const isHeightOverflow = mergeFullHeight > maxHeight
      if (isHeightOverflow) {
        needsStickyTracking = true
      }

      const curRowAbsoluteTop = rowPrefixTopMap.get(curRowId) || 0
      const curRowAbsoluteBottom = curRowAbsoluteTop + mergeFullHeight

      function getStyle(getter: Getter, rowIndex: number, colIndex: number) {
        let next: CSSProperties = {}
        if (mergeRowIdList.length === 0 && colIdList.length === 0) {
          next = {
            display: 'none',
          }
        } else {
          const rowIdSet = new Set(getter(rowIdShowListAtom))
          const columnIdSet = new Set(getter(columnIdShowListAtom))

          const calculatedWidth = [curColId, ...colIdList]
            .filter((colId) => columnIdSet.has(colId))
            .reduce<number>((prev, colId) => prev + (columnSizeMap.get(colId) || 0), 0)
          const calculatedHeight = [curRowId, ...mergeRowIdList]
            .filter((rowId) => rowIdSet.has(rowId))
            .reduce<number>((prev, rowId) => prev + (rowSizeMap.get(rowId) || 0), 0)

          next = {
            width: calculatedWidth,
            height: calculatedHeight,
          }

          // 合并高度超过容器时，使用 sticky 定位 + z-index 分层
          if (isHeightOverflow && containerSize) {
            const relativeTopExpr = `calc(${curRowAbsoluteTop}px - var(--grid-table-scroll-top, 0px) + var(--grid-table-thead-height, 0px))`
            const clippedTopExpr = `max(${relativeTopExpr}, var(--grid-table-thead-height, 0px))`
            const clippedBottomExpr = `min(calc(${curRowAbsoluteBottom}px - var(--grid-table-scroll-top, 0px) + var(--grid-table-thead-height, 0px)), var(--grid-table-viewport-height, ${containerSize.height}px))`

            next.position = 'sticky'
            next.top = clippedTopExpr
            next.height = `max(0px, calc(${clippedBottomExpr} - ${clippedTopExpr}))`
            next.zIndex = 0
            next.willChange = 'top'
          }

          const lastRowId = lastSet(rowIdSet)
          const lastColumnId = lastSet(columnIdSet)

          const hadColLast = lastRowId ? mergeRowIdList.includes(lastRowId) : false
          const hadRowLast = lastColumnId ? colIdList.includes(lastColumnId) : false

          if (hadColLast) {
            next.borderBottomWidth = 0
          }

          if (hadRowLast) {
            next.borderRightWidth = 0
          }

          if (rowIndex) {
            // sticky 模式下不使用 translateY（由 top 控制位置）
            if (!isHeightOverflow) {
              next = {
                ...next,
                transform: `translateY(${-[curRowId, ...mergeRowIdList]
                  .slice(0, rowIndex)
                  .filter((rowId) => rowIdSet.has(rowId))
                  .reduce<number>((prev, rowId) => prev + (rowSizeMap.get(rowId) || 0), 0)}px)`,
              }
            }
          }
          if (colIndex) {
            next = {
              ...next,
              transform: `translateX(${-[curColId, ...colIdList]
                .slice(0, colIndex)
                .filter((colId) => columnIdSet.has(colId))
                .reduce<number>((prev, colId) => prev + (columnSizeMap.get(colId) || 0), 0)}px)`,
            }
          }
        }

        return next
      }

      ;[curRowId, ...mergeRowIdList].forEach((rowId, rowIndex) => {
        ;[curColId, ...colIdList].forEach((colId, columnIndex) => {
          const tCellId = getCellId({
            rowId,
            columnId: colId,
          })

          clearList.push(
            store.setter(getCellStateAtomById(tCellId), (getter, prev) => {
              const next = getStyle(getter, rowIndex, columnIndex)

              return {
                ...prev,
                style: {
                  ...prev.style,
                  ...next,
                },
              }
            })!,
          )
        })
      })
    })

    // 仅在有 sticky 合并单元格时才启用滚动/resize 监听
    let ticking = false
    let resizeRafId: number | null = null
    let resizeObserver: ResizeObserver | null = null

    if (needsStickyTracking && tableContainer) {
      updateLayoutVars()
      updateScrollTopVar()
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          updateScrollTopVar()
          ticking = false
        })
      }
    }

    const onResize = () => {
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId)
      }
      resizeRafId = requestAnimationFrame(() => {
        updateLayoutVars()
      })
    }

    if (needsStickyTracking) {
      tableContainer?.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize)
      if (typeof ResizeObserver !== 'undefined' && theadElement) {
        resizeObserver = new ResizeObserver(() => {
          onResize()
        })
        resizeObserver.observe(theadElement)
      }
    }

    return () => {
      if (needsStickyTracking) {
        tableContainer?.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        resizeObserver?.disconnect()
        if (resizeRafId !== null) {
          cancelAnimationFrame(resizeRafId)
        }
      }
      clearList.forEach((clear) => {
        clear()
      })
    }
  }, [cellList, columnSizeMap, getCellStateAtomById, rowSizeMap, rowIdList, store, showBorder, containerSize])
}

export default ''
