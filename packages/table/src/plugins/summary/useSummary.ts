import { useEffect } from 'react'
import { useStore } from '@einfach/react'
import { summaryConfigAtom } from './state'
import type { SummaryRowConfig, UseSummaryProps } from './types'

/**
 * 汇总行插件主 hook
 * 当前版本：状态管理 + 配置同步
 * 汇总行的渲染由 VGridTable 的 footer 区域处理（待实现渲染层）
 */
export function useSummary(
  props: UseSummaryProps = {},
) {
  const { summary } = props
  const store = useStore()

  useEffect(() => {
    if (!summary) {
      store.setter(summaryConfigAtom, [])
      return
    }

    const configs: SummaryRowConfig[] = Array.isArray(summary) ? summary : [summary]
    store.setter(summaryConfigAtom, configs)

    return () => {
      store.setter(summaryConfigAtom, [])
    }
  }, [summary, store])
}
