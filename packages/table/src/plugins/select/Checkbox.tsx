import { atom, useAtom } from '@einfach/react'
import { useInit } from '@einfach/react-utils'
import './checkbox.css'
import type { PositionId, RowId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'
import clsx from 'clsx'
import { nodeSelectionSetAtom } from './state'

export function CheckboxRender(text: string | undefined, rowInfo: any, rowPath: PositionId) {
  return <Checkbox {...rowPath} />
}

export enum CheckedEnum {
  checked = 'checked',
  unChecked = 'unChecked',
  partiallyChecked = 'partiallyChecked',
}

export function Checkbox({ rowId }: Partial<PositionId>) {
  const { rowIdShowListAtom } = useBasic()
  const checkedAtom = useInit(() => {
    if (!rowId) {
      return atom(
        (getter) => {
          const nodeSelectionSet = getter(nodeSelectionSetAtom)
          // rowIdShowListAtom 取哪个id是个问题
          return nodeSelectionSet.size === 0
            ? CheckedEnum.unChecked
            : nodeSelectionSet.size === getter(rowIdShowListAtom).length
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
  const [isChecked, handChecked] = useAtom(checkedAtom)

  return (
    <>
      <input
        type="checkbox"
        name="grid-table-checkbox"
        checked={isChecked === CheckedEnum.checked}
        className={clsx('grid-table-row-selection-item', {
          'grid-table-row-selection-partially': isChecked === CheckedEnum.partiallyChecked,
        })}
        onChange={() => {
          handChecked(rowId)
        }}
      />
    </>
  )
}
