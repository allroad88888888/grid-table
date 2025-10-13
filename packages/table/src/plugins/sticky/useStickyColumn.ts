import { useEffect } from 'react'

import { useStore, useSetAtom } from '@einfach/react'
import { columnContextMenuOptionsAtom } from '../theadContextMenu/state'
import { StickyColumn } from './StickyColumn'
import type { ColumnContextMenuOption } from '../theadContextMenu/type'

export function useStickyColumn(enable: boolean = false) {
  const store = useStore()
  const setTheadContextMenu = useSetAtom(columnContextMenuOptionsAtom, { store })

  useEffect(() => {
    if (!enable) {
      return
    }
    return setTheadContextMenu((prev = []) => {
      return [
        ...prev,
        {
          component: StickyColumn,
        },
      ] as ColumnContextMenuOption[]
    })
  }, [enable, setTheadContextMenu])
}
