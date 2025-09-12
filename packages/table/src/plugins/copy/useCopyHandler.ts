import { useCallback } from 'react'
import { useStore, useSetAtom, isPromiseLike } from '@einfach/react'
import { areaCellIdsAtom } from '../areaSelected/state'
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

      showCopyStyle(true)

      let text: string | Promise<string>

      text = copyMixed(areas!)

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
