import { useCallback } from 'react'
import { useStore, useSetAtom, isPromiseLike } from '@einfach/react'
import { AREA_CELL_IDS_MATERIALIZE_LIMIT, areaCellIdsAtom } from '../areaSelected/state'
import { copyMixedAreaAtom } from './state'
import { hasSelectedAreas } from './copyUtils'
import type { CopyProps } from './types'

export interface UseCopyHandlerProps {
  copyGetDataByCellIds?: CopyProps['copyTbodyCellInfo']
  showCopyStyle: (show: boolean) => void
}

/**
 * 复制处理逻辑的 hook
 */
export function useCopyHandler({ copyGetDataByCellIds, showCopyStyle }: UseCopyHandlerProps) {
  const store = useStore()
  const copyMixed = useSetAtom(copyMixedAreaAtom)

  const handleCopy = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const areas = store.getter(areaCellIdsAtom)

      // 检查是否有选中的区域
      if (!hasSelectedAreas(areas)) {
        return
      }

      // 选区超过物化阈值：剪贴板装不下（20M cells ≈ 100MB+ TSV，多数接收方也吞不下），
      // 直接拒绝并阻断默认行为，避免泄漏占位文本
      if (areas.isLimited) {
        console.warn(
          `[grid-table] selection exceeds copy limit ` +
            `(${areas.totalCellCount} cells > ${AREA_CELL_IDS_MATERIALIZE_LIMIT}); ` +
            `copy cancelled. Shrink the selection and try again.`,
        )
        e.clipboardData.setData('text/plain', '')
        e.stopPropagation()
        e.preventDefault()
        return
      }

      showCopyStyle(true)

      const text: string | Promise<string> = copyMixed({
        ...areas,
        copyTbodyCellInfo: copyGetDataByCellIds,
      })

      // 处理异步文本
      if (isPromiseLike(text)) {
        text.then((resolvedText) => {
          e.clipboardData.setData('text/plain', resolvedText)
          e.stopPropagation()
          e.preventDefault()
        })
        return
      }

      // 处理同步文本
      e.clipboardData.setData('text/plain', text)
      e.stopPropagation()
      e.preventDefault()
    },
    [copyMixed, copyGetDataByCellIds, showCopyStyle, store],
  )

  return { handleCopy }
}
