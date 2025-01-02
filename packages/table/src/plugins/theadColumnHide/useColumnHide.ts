import { useEffect } from 'react'

import { useStore, useSetAtom, useAtomValue } from 'einfach-state'
import { columnContextMenuOptionsAtom } from '../theadContextMenu/state'
import { ColumnHide } from './ColumnHide'
import type { ColumnContextMenuOption } from '../theadContextMenu/type'
import { columnIdShowListAtom } from '@grid-table/basic'
import { hideColumnsAtom } from './state'

export function useColumnHide() {
  const store = useStore()
  const setTheadContextMenu = useSetAtom(columnContextMenuOptionsAtom, { store })
  useEffect(() => {
    setTheadContextMenu((prev = []) => {
      return [
        ...prev,
        {
          component: ColumnHide,
        },
      ] as ColumnContextMenuOption[]
    })
  }, [setTheadContextMenu])

  const hideColumns = useAtomValue(hideColumnsAtom, { store })

  useEffect(() => {
    if (hideColumns.length === 0) {
      return
    }
    return store.setter(columnIdShowListAtom, (getter, prev) => {
      const hideColumns = new Set(getter(hideColumnsAtom))

      return prev.filter((tId) => {
        return !hideColumns.has(tId)
      })
    })
  }, [hideColumns, store])
}
