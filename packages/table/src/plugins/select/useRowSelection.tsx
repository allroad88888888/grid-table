import { useLayoutEffect, useState } from 'react'
import type { ColumnType } from '../data/type'
import { useData } from '../data'
import { atom, useAtom } from 'einfach-state'
import { useInit } from 'einfach-utils'
import './useRowSelection.css'
import { expandColumnIndexAtom } from '../data/useExpand'
// import { getChildrenNodeList } from '../data/tree'

export interface UseRowSelectionProps
  extends Pick<ColumnType, 'title' | 'fixed' | 'width' | 'render'> {
  selectedRowKeys?: string[]
}

/**
 * 选择框
 * @param props
 */
export function useRowSelection(props: UseRowSelectionProps | undefined) {
  const { store, columnOptionsAtom } = useData()
  useLayoutEffect(() => {
    if (!props) {
      return
    }

    store.setter(expandColumnIndexAtom, 1)
    return store.setter(columnOptionsAtom, (_getter, prev) => {
      const option: ColumnType = {
        title: props.title,
        width: props.width,
        render: props.render || render,
        fixed: props.fixed,
      }
      return [option, ...prev]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])
}

function render(text: string | undefined, rowInfo: Record<string, any>, rowPath: string) {
  return <Checkbox rowPath={rowPath} />
}

const nodeSelectionSetAtom = atom<Set<string>>(new Set<string>())

export function Checkbox({ rowPath }: { rowPath: string }) {
  const checkedAtom = useInit(() => {
    return atom(
      (getter) => {
        const nodeSelectionMap = getter(nodeSelectionSetAtom)
        return nodeSelectionMap.has(rowPath)
      },
      (getter, setter, rowPath: string) => {
        // const relation = getter(relationAtom)
        const nodeSelectionMap = new Set(getter(nodeSelectionSetAtom))

        function checkedNode(node: string) {
          if (nodeSelectionMap.has(node)) {
            nodeSelectionMap.delete(node)
          } else {
            nodeSelectionMap.add(node)
          }
        }
        checkedNode(rowPath)

        // if (relation.has(rowPath)) {
        //   getChildrenNodeList(rowPath, relation, {
        //     iteratorFn: checkedNode,
        //   })
        // }

        setter(nodeSelectionSetAtom, nodeSelectionMap)
      },
    )
  }, [rowPath])
  const [isChecked, handChecked] = useAtom(checkedAtom)

  // const [isChecked,setChecked] = useState()
  return (
    <>
      <input
        type="checkbox"
        checked={isChecked}
        className={'grid-table-row-selection-item'}
        onChange={() => {
          handChecked(rowPath)
        }}
      />
    </>
  )
}
