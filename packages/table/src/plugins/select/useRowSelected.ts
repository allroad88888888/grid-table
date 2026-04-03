import type { Store} from '@einfach/react';
import { atom, useAtom, useAtomValue } from '@einfach/react'
import './checkbox.css'
import type { PositionId, RowId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'
import { nodeSelectionDisabledSetAtom, nodeSelectionSetAtom } from './state'
import { useMemo } from 'react'

export enum CheckedEnum {
  checked = 'checked',
  unChecked = 'unChecked',
  partiallyChecked = 'partiallyChecked',
}

export function useRowChecked({ rowId }: Partial<PositionId>, store?: Store) {
  const { rowIdShowListAtom } = useBasic(store)
  const nodeDisabledSet = useAtomValue(nodeSelectionDisabledSetAtom, { store })
  const checkedAtom = useMemo(() => {
    if (!rowId) {
      return atom(
        (getter) => {
          const nodeSelectionSet = getter(nodeSelectionSetAtom)

          const validateNodeIds = getter(rowIdShowListAtom).filter(
            (tId) => !nodeDisabledSet.has(tId),
          )
          // rowIdShowListAtom 取哪个id是个问题
          return nodeSelectionSet.size === 0
            ? CheckedEnum.unChecked
            : nodeSelectionSet.size === validateNodeIds.length
              ? CheckedEnum.checked
              : CheckedEnum.partiallyChecked
        },
        (getter, setter, tId?: RowId) => {
          const nodeSelectionSet = new Set(getter(nodeSelectionSetAtom))

          if (!tId) {
            if (nodeSelectionSet.size === 0) {
              setter(nodeSelectionSetAtom, new Set(getter(rowIdShowListAtom)))
            } else {
              setter(nodeSelectionSetAtom, new Set())
            }

            return
          }
        },
      )
    }
    return atom(
      (getter) => {
        const nodeSelectionMap = getter(nodeSelectionSetAtom)
        return nodeSelectionMap.has(rowId) ? CheckedEnum.checked : CheckedEnum.unChecked
      },
      (getter, setter, tId?: RowId) => {
        if (!tId) {
          return
        }
        const nodeSelectionSet = new Set(getter(nodeSelectionSetAtom))

        function checkedNode(node: RowId) {
          if (nodeSelectionSet.has(node)) {
            nodeSelectionSet.delete(node)
          } else {
            nodeSelectionSet.add(node)
          }
        }
        checkedNode(tId)

        // if (relation.has(rowPath)) {
        //   getChildrenNodeList(rowPath, relation, {
        //     iteratorFn: checkedNode,
        //   })
        // }

        setter(nodeSelectionSetAtom, nodeSelectionSet)
      },
    )
  }, [rowId])
  const [isChecked, handChecked] = useAtom(checkedAtom, { store })

  return {
    isChecked,
    handChecked,
    disabled: nodeDisabledSet.has(rowId!),
  }
}
