import type { Position } from '@grid-table/core'
import { atom, useAtom, useAtomValue } from 'einfach-state'
import { useLayoutEffect } from 'react'
import { useData } from './useData'
import { useBasic } from '../../basic'
import { getChildrenNodeList } from './tree'
import clsx from 'clsx'
import './useExpand.css'

/**
 * 收缩列有哪些
 */
export const collapseNodeListAtom = atom<Set<string>>(new Set<string>())
/**
 * 树形表格 展开按钮 应该显示在哪一列
 */
export const expandColumnIndexAtom = atom(0)

type UseExpandProps = {
  expandColumnIndex?: number
}

export function useExpand({ expandColumnIndex = 0 }: UseExpandProps = {}) {
  const { store, rowCountAtom } = useBasic()
  const { showPathListAtom, relationAtom, root } = useData()
  useLayoutEffect(() => {
    store.setter(expandColumnIndexAtom, expandColumnIndex)
  }, [expandColumnIndex, store])

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
}: Position & {
  path: string
}) {
  const { parentNodeSetAtom, nodeLevelAtom } = useData()
  const parentNodeSet = useAtomValue(parentNodeSetAtom)
  const expandColIndex = useAtomValue(expandColumnIndexAtom)
  const [collapseNodeList, setCollapseNodeList] = useAtom(collapseNodeListAtom)

  const levelMap = useAtomValue(nodeLevelAtom)

  const level = levelMap.get(path) || 0

  const hasChildren = parentNodeSet.has(path)

  return {
    expendDom:
      (level !== 0 || hasChildren) && expandColIndex === columnIndex ? (
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
                paddingBlockStart: '100%',
              }}
            ></i>
          ) : null}
        </>
      ) : null,
  }
}
