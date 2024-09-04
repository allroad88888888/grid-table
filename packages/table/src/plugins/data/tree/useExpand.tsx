import type { Position } from '@grid-table/core'
import { atom, useAtom, useAtomValue } from 'einfach-state'
import { useLayoutEffect } from 'react'
import clsx from 'clsx'
import './useExpand.css'
import { useBasic } from '../../../basic'
import { useData } from '../useData'
import { getChildrenNodeList } from './utils'

/**
 * 收缩列有哪些
 */
export const collapseNodeListAtom = atom<Set<string>>(new Set<string>())

type UseExpandProps = {}

export function useExpand({}: UseExpandProps = {}) {
  const { store, rowCountAtom } = useBasic()
  const { showPathListAtom, relationAtom, root } = useData()

  useLayoutEffect(() => {
    return store.setter(showPathListAtom, (_getter, prev) => {
      const collapseNodeList = _getter(collapseNodeListAtom)
      const relation = _getter(relationAtom)
      const next = getChildrenNodeList(root, relation, { collapseNodeSet: collapseNodeList })
      return next
    })
  }, [relationAtom, root, showPathListAtom, store])

  useLayoutEffect(() => {
    return store.setter(rowCountAtom, (_getter, prev) => {
      const showPathList = _getter(showPathListAtom)
      return showPathList.length
    })
  }, [])
}

export function useExpandItem({
  rowIndex,
  columnIndex,
  path,
  enable = false,
}: Position & {
  path: string
  enable?: boolean
}) {
  const { parentNodeSetAtom, nodeLevelAtom } = useData()
  const parentNodeSet = useAtomValue(parentNodeSetAtom)

  const [collapseNodeList, setCollapseNodeList] = useAtom(collapseNodeListAtom)

  const levelMap = useAtomValue(nodeLevelAtom)

  const level = levelMap.get(path) || 0

  const hasChildren = parentNodeSet.has(path)

  return {
    expendDom:
      (level !== 0 || hasChildren) && enable ? (
        <>
          <span
            style={{
              paddingInlineStart: ((levelMap.get(path) || 0) + 1) * 10,
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
                  if (next.has(path)) {
                    next.delete(path)
                  } else {
                    next.add(path)
                  }
                  return next
                })
              }}
              className={clsx(
                collapseNodeList.has(path) ? 'grid-table-collapse' : 'grid-table-expand',
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
