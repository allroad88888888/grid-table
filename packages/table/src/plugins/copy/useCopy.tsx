import { useCallback, useEffect, useRef } from 'react'
import { useAtom, useAtomValue, useStore } from '@einfach/react'
import { tableEventsAtom } from '../../hooks/useTableEvents'
import { areaCellIdsAtom } from '../areaSelected/state'
import { useDocumentHandler } from '../../utils/useDocumentClickHandler'
import { useCopyHandler } from './useCopyHandler'
import { useCopyStyle } from './useCopyStyle'
import { getTotalSelectedCells, HIDDEN_TEXTAREA_STYLE } from './copyUtils'
import type { CopyProps } from './types'
import { showCopyStyleAtom } from './state'

/**
 * 复制功能的主 hook
 * 这里逻辑是弄个隐藏的 textarea 制造能触发 copy 的事件
 */
export function useCopy({
  copyTbodyCellInfo: copyGetDataByCellIds,
  enableCopy: enable = true,
}: CopyProps = {}) {
  const store = useStore()
  const [isShowStyle, showCopyStyle] = useAtom(showCopyStyleAtom, { store })
  const selectedAreas = useAtomValue(areaCellIdsAtom, { store })

  // 使用拆分的复制处理 hook
  const { handleCopy } = useCopyHandler({
    copyGetDataByCellIds,
    showCopyStyle,
  })

  // 使用拆分的样式处理 hook
  useCopyStyle({
    selectedAreas,
    isShowStyle,
    enable,
  })

  // 注册复制事件
  useEffect(() => {
    if (enable === false) {
      return
    }
    return store.setter(tableEventsAtom, (_getter, prev) => {
      const next = { ...prev }
      if (!('onCopy' in prev)) {
        next['onCopy'] = new Set()
      }
      next['onCopy']!.add(handleCopy)
      return next
    })
  }, [enable, handleCopy, store])

  const ref = useRef<HTMLTextAreaElement>(null)

  // 计算总的选中单元格数量
  const totalSelectedCells = getTotalSelectedCells(selectedAreas)

  // 自动选中隐藏的 textarea 以触发复制
  useEffect(() => {
    if (!ref.current || totalSelectedCells === 0) {
      return
    }
    // 模拟选中 触发 onCopy
    ref.current.select()
  }, [totalSelectedCells])

  // 取消复制样式显示
  const cancel = useCallback(() => {
    showCopyStyle(false)
  }, [showCopyStyle])

  useDocumentHandler(cancel, 'mousedown')

  // 如果禁用或没有选中的单元格，不渲染隐藏的 textarea
  if (enable === false || totalSelectedCells === 0) {
    return null
  }

  return <textarea style={HIDDEN_TEXTAREA_STYLE} ref={ref} readOnly value="copy error!!!" />
}
