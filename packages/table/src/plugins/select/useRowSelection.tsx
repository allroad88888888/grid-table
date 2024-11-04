import { useEffect } from 'react'
import { atom, useAtom } from 'einfach-state'
import { useInit } from 'einfach-utils'
import './useRowSelection.css'
import type { PositionId, RowId } from '@grid-table/basic'
import { getIdByObj, useBasic } from '@grid-table/basic'
import { useData } from '../../core'
import type { ColumnType } from '../../types'
import clsx from 'clsx'

export interface UseRowSelectionProps<ItemInfo = Record<string, any>>
  extends Pick<ColumnType<ItemInfo>, 'title' | 'fixed' | 'width' | 'render'> {
  // selectedRowKeys?: string[]
  onChange?: (selectedRowKeys: RowId[], rowInfoList: ItemInfo[]) => void
}

/**
 * 选择框
 * @param props
 */
export function useRowSelection<ItemInfo = Record<string, any>>(
  props: UseRowSelectionProps<ItemInfo> | undefined,
) {
  const { columnIndexListAtom, columnSizeMapAtom } = useBasic()
  const { store, getColumnOptionAtomByColumnId, getRowInfoAtomByRowId } = useData()
  /**
   * onChange
   */
  useEffect(() => {
    if (!props?.onChange) {
      return
    }
    store.sub(nodeSelectionSetAtom, () => {
      const selectIds = Array.from(store.getter(nodeSelectionSetAtom))
      const rowInfoList = selectIds.map((tRowId) => {
        return store.getter(getRowInfoAtomByRowId(tRowId)) as ItemInfo
      })
      props?.onChange?.(selectIds, rowInfoList)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.onChange])

  useEffect(() => {
    if (!props) {
      return
    }
    const option: ColumnType<ItemInfo> = {
      title: props.title || <Checkbox />,
      width: props.width,
      render: props.render || render,
      fixed: props.fixed,
    }

    const columnId = getIdByObj(option)

    store.setter(getColumnOptionAtomByColumnId(columnId), option as ColumnType)
    if (props.width) {
      store.setter(columnSizeMapAtom, (prev) => {
        const next = new Map(prev)
        next.set(columnId, props.width!)
        return next
      })
    }

    store.setter(columnIndexListAtom, (prev) => {
      return [columnId, ...prev]
    })
  }, [columnIndexListAtom, columnSizeMapAtom, getColumnOptionAtomByColumnId, props, store])
}

function render(text: string | undefined, rowInfo: any, rowPath: PositionId) {
  return <Checkbox {...rowPath} />
}

export const nodeSelectionSetAtom = atom<Set<RowId>>(new Set<RowId>())

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
