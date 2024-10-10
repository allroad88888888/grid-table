import { atom, useAtom, useAtomValue } from 'einfach-state'
import { useLayoutEffect } from 'react'
import clsx from 'clsx'
import './useExpand.css'

import { getChildrenNodeList } from './utils'
import type { PositionId, RowId } from '@grid-table/basic/src'
import { useBasic } from '@grid-table/basic/src'
import { useData } from '../core'

/**
 * 收缩列有哪些
 */
export const collapseNodeListAtom = atom<Set<RowId>>(new Set<RowId>())

type UseExpandProps = {}

export function useExpand({}: UseExpandProps = {}) {
  const { store, rowIdShowListAtom } = useBasic()
  const { relationAtom, root } = useData()

  useLayoutEffect(() => {
    return store.setter(rowIdShowListAtom, (_getter, prev) => {
      const collapseNodeList = _getter(collapseNodeListAtom)
      const relation = _getter(relationAtom)
      const next = getChildrenNodeList(root, relation, { collapseNodeSet: collapseNodeList })
      return next
    })
  }, [relationAtom, root, rowIdShowListAtom, store])

  // useLayoutEffect(() => {
  //   return store.setter(rowCountAtom, (_getter, prev) => {
  //     const showPathList = _getter(showPathListAtom)
  //     return showPathList.length
  //   })
  // }, [])
}

export function useExpandItem({
  rowIndex,
  columnIndex,
  rowId,
  enable = false,
}: PositionId & {
  enable?: boolean
}) {
  const { parentNodeSetAtom, nodeLevelAtom } = useData()
  const parentNodeSet = useAtomValue(parentNodeSetAtom)

  const [collapseNodeList, setCollapseNodeList] = useAtom(collapseNodeListAtom)

  const levelMap = useAtomValue(nodeLevelAtom)

  const level = levelMap.get(rowId) || 0

  const hasChildren = parentNodeSet.has(rowId)

  return {
    expendDom:
      (level !== 0 || hasChildren) && enable ? (
        <>
          <span
            style={{
              paddingInlineStart: ((levelMap.get(rowId) || 0) + 1) * 10,
            }}
          ></span>
          {hasChildren ? (
            <i
              onClick={() => {
                if (!hasChildren) {
                  return
                }
                setCollapseNodeList((prev) => {
                  const next = new Set(prev)

                  if (next.has(rowId)) {
                    next.delete(rowId)
                  } else {
                    next.add(rowId)
                  }
                  return next
                })
              }}
              className={clsx(
                collapseNodeList.has(rowId) ? 'grid-table-collapse' : 'grid-table-expand',
                'grid-table-expand-item',
              )}
              style={{
                paddingInlineStart: '10px',
                marginInlineEnd: '4px',
              }}
            ></i>
          ) : null}
        </>
      ) : null,
  }
}
