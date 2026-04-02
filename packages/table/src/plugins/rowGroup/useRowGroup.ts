import { useEffect } from 'react'
import { useStore } from '@einfach/react'
import { expandedGroupKeysAtom } from './state'
import type { UseRowGroupProps } from './types'

/**
 * 行分组插件主 hook
 * 当前版本：状态管理 + 配置
 * 分组行的注入和渲染待实现渲染层
 */
export function useRowGroup<ItemInfo = Record<string, any>>(
  props: UseRowGroupProps<ItemInfo> = {},
) {
  const { expandedGroupKeys, defaultExpandAll = true } = props
  const store = useStore()

  // 受控模式
  useEffect(() => {
    if (expandedGroupKeys !== undefined) {
      store.setter(expandedGroupKeysAtom, new Set(expandedGroupKeys))
    }
  }, [expandedGroupKeys, store])

  // 默认全部展开
  useEffect(() => {
    if (defaultExpandAll && expandedGroupKeys === undefined) {
      // 全部展开 = 空集合 + 默认展开逻辑（由渲染层处理）
    }
  }, [defaultExpandAll, expandedGroupKeys])
}
