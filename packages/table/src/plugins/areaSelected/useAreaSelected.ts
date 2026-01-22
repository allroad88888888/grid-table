import { useEffect, type RefObject } from 'react'
import { useAtomValue, useStore, useSetAtom } from '@einfach/react'
import { tableClassNameAtom } from '../../hooks'
import './AreaSelected.css'
import { headerLastIdAtom } from '@grid-table/basic'
import { areaColumnIdsAtom } from './state'
import { applyHeaderStyleAtom } from './header'
import { useTheadAreaSelected } from './useTheadAreaSelected'
import { useTbodyAreaSelected } from './useTbodyAreaSelected'
import { useAutoScrollOnDrag } from './useAutoScrollOnDrag'

export interface UseAreaSelectedProps {
  /** 是否启用区域选择 */
  enable?: boolean
  /** 表格容器引用，用于自动滚动 */
  containerRef?: RefObject<HTMLDivElement>
}

export function useAreaSelected({ enable = false, containerRef }: UseAreaSelectedProps = {}) {
  const store = useStore()

  useEffect(() => {
    if (!enable) {
      return
    }
    return store.setter(tableClassNameAtom, (getter, clsList) => {
      return new Set(clsList.add('user-select-none'))
    })
  }, [store, enable])

  const areaColumnIds = useAtomValue(areaColumnIdsAtom, { store })
  const headerLastId = useAtomValue(headerLastIdAtom, { store })
  // 监听选择区域变化，更新表头最后一行的边框样式
  const applyHeaderStyle = useSetAtom(applyHeaderStyleAtom, { store })
  useEffect(() => {
    if (!enable) {
      return
    }

    // applyHeaderStyleAtom 返回清理函数，确保类型安全
    return applyHeaderStyle() || undefined
  }, [applyHeaderStyle, enable, areaColumnIds, headerLastId])
  useTheadAreaSelected({ enable })
  useTbodyAreaSelected({ enable })

  // 拖拽时边缘自动滚动
  useAutoScrollOnDrag({
    enable: enable && !!containerRef,
    containerRef: containerRef!,
  })

  // const onContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   e.preventDefault()
  //   store.setter(areaStartAtom, emptyPosition)
  //   store.setter(areaEndAtom, emptyPosition)
  // }, [])

  // useEffect(() => {
  //   if (!enable) {
  //     return
  //   }
  //   return store.setter(tableEventsAtom, (_getter, prev) => {
  //     const next = { ...prev }

  //     if (!('onContextMenu' in prev)) {
  //       next['onContextMenu'] = new Set()
  //     }
  //     next['onContextMenu']!.add(onContextMenu)
  //     return next
  //   })
  // }, [onContextMenu, store, enable])
}
