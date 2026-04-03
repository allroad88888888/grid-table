import { useEffect, useCallback, useRef } from 'react'
import { useStore } from '@einfach/react'
import { useBasic } from '@grid-table/basic'
import type { RowId } from '@grid-table/basic'
import { getRowInfoAtomByRowId } from '../../stateCore'
import { expandedRowKeysAtom, getExpandRowId } from './state'
import type { UseRowExpandProps } from './types'

export function useRowExpand<ItemInfo = Record<string, any>>(
  props: UseRowExpandProps<ItemInfo> = {},
) {
  const {
    expandedRowKeys: controlledKeys,
    defaultExpandedRowKeys,
    onExpand,
    onExpandedRowsChange,
    accordion = false,
  } = props

  const store = useStore()
  const { rowIdShowListAtom } = useBasic()

  const initializedRef = useRef(false)

  // Initialize default expanded keys (only once)
  useEffect(() => {
    if (!initializedRef.current && defaultExpandedRowKeys && controlledKeys === undefined) {
      initializedRef.current = true
      store.setter(expandedRowKeysAtom, new Set(defaultExpandedRowKeys))
    }
  }, [defaultExpandedRowKeys, controlledKeys, store])

  // Sync controlled keys to internal atom
  useEffect(() => {
    if (controlledKeys !== undefined) {
      store.setter(expandedRowKeysAtom, new Set(controlledKeys))
    }
  }, [controlledKeys, store])

  // Insert expand row IDs after expanded rows
  useEffect(() => {
    return store.setter(rowIdShowListAtom, (getter, prev) => {
      const expandedKeys = getter(expandedRowKeysAtom)
      if (expandedKeys.size === 0) return prev

      const next: RowId[] = []
      for (const rowId of prev) {
        next.push(rowId)
        if (expandedKeys.has(rowId)) {
          next.push(getExpandRowId(rowId))
        }
      }
      return next
    })
  }, [rowIdShowListAtom, store])

  // Toggle expand/collapse for a row
  const toggleExpand = useCallback(
    (rowId: RowId) => {
      const currentKeys = store.getter(expandedRowKeysAtom)
      const isExpanded = currentKeys.has(rowId)
      const rowData = store.getter(getRowInfoAtomByRowId(rowId))
      if (!rowData) return

      let nextKeys: Set<RowId>

      if (isExpanded) {
        // Collapse
        nextKeys = new Set(currentKeys)
        nextKeys.delete(rowId)
      } else {
        // Expand
        if (accordion) {
          nextKeys = new Set([rowId])
        } else {
          nextKeys = new Set(currentKeys)
          nextKeys.add(rowId)
        }
      }

      // Update internal state in uncontrolled mode
      if (controlledKeys === undefined) {
        store.setter(expandedRowKeysAtom, nextKeys)
      }

      onExpand?.(!isExpanded, rowId, rowData as ItemInfo)
      onExpandedRowsChange?.([...nextKeys])
    },
    [store, accordion, controlledKeys, onExpand, onExpandedRowsChange],
  )

  return { toggleExpand }
}
