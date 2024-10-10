import { useLayoutEffect } from 'react'
import { atom, useAtom } from 'einfach-state'
import { useInit } from 'einfach-utils'
import './useRowSelection.css'
import type { PositionId, RowId } from '@grid-table/basic/src'
import { getIdByObj } from '@grid-table/basic/src'
import { useData } from '../../core'
import type { ColumnType } from '../../types'

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
  const { store, getColumnOptionAtomByColumnId } = useData()
  useLayoutEffect(() => {
    if (!props) {
      return
    }
    const option: ColumnType = {
      title: props.title,
      width: props.width,
      render: props.render || render,
      fixed: props.fixed,
    }

    const columnId = getIdByObj(option)

    return store.setter(getColumnOptionAtomByColumnId(columnId), option)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])
}

function render(text: string | undefined, rowInfo: Record<string, any>, rowPath: PositionId) {
  return <Checkbox {...rowPath} />
}

const nodeSelectionSetAtom = atom<Set<RowId>>(new Set<RowId>())

export function Checkbox({ rowId }: PositionId) {
  const checkedAtom = useInit(() => {
    return atom(
      (getter) => {
        const nodeSelectionMap = getter(nodeSelectionSetAtom)
        return nodeSelectionMap.has(rowId)
      },
      (getter, setter, rowPath: RowId) => {
        // const relation = getter(relationAtom)
        const nodeSelectionMap = new Set(getter(nodeSelectionSetAtom))

        function checkedNode(node: RowId) {
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
  }, [rowId])
  const [isChecked, handChecked] = useAtom(checkedAtom)

  // const [isChecked,setChecked] = useState()
  return (
    <>
      <input
        type="checkbox"
        checked={isChecked}
        className={'grid-table-row-selection-item'}
        onChange={() => {
          handChecked(rowId)
        }}
      />
    </>
  )
}
