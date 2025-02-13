import { useAtom, useAtomValue } from '@einfach/state'
import { collapsedRowRootsAtom, rowLevelMapAtom, rowRelationAtom } from './state'
import clsx from 'clsx'

export function TreeItem({ id, enable }: { id: string; enable: boolean }) {
  const [collapsedRowRoots, setCollapseNodeList] = useAtom(collapsedRowRootsAtom)

  const levelMap = useAtomValue(rowLevelMapAtom)
  const level = levelMap.get(id)
  const relation = useAtomValue(rowRelationAtom)

  const hasChildren = relation.has(id)
  return (
    <div>
      {(level !== 0 || hasChildren) && enable ? (
        <>
          <span
          // style={{
          //   paddingInlineStart: ((levelMap.get(id) || 0) + 1) * 10,
          // }}
          ></span>
          {hasChildren ? (
            <i
              onClick={() => {
                if (!hasChildren) {
                  return
                }
                setCollapseNodeList((prev) => {
                  const next = new Set(prev)

                  if (next.has(id)) {
                    next.delete(id)
                  } else {
                    next.add(id)
                  }
                  return next
                })
              }}
              className={clsx(
                collapsedRowRoots.has(id) ? 'grid-table-collapse' : 'grid-table-expand',
                'grid-table-expand-item',
              )}
              style={{
                paddingInlineStart: '10px',
                marginInlineEnd: '4px',
              }}
            ></i>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
