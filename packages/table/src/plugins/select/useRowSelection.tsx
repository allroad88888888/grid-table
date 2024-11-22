import { useEffect } from 'react'
import { atom, useAtom, useSetAtom, useStore } from 'einfach-state'
import { useInit } from 'einfach-utils'
import './useRowSelection.css'
import type { PositionId, RowId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'
import { useData } from '../../core'
import type { ColumnType } from '../../types'
import clsx from 'clsx'
import { columnAddAtom } from '../../stateColumn'

export interface UseRowSelectionProps<ItemInfo = Record<string, any>>
  extends Pick<
    ColumnType<ItemInfo>,
    'title' | 'fixed' | 'width' | 'render' | 'renderComponent' | 'align'
  > {
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
  const { getRowInfoAtomByRowId } = useData()
  const store = useStore()

  const addColumn = useSetAtom(columnAddAtom)
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

  const { width, title, render, fixed, renderComponent, align } = props || {}

  useEffect(() => {
    if (!props) {
      return
    }
    const option: ColumnType<ItemInfo> = {
      title: title || <Checkbox />,
      width: width,
      render: render || Render,
      renderComponent: renderComponent,
      fixed: fixed,
      align: align,
    }
    addColumn(option as ColumnType, 'top')
  }, [addColumn, align, fixed, props, render, renderComponent, title, width])
}

function Render(text: string | undefined, rowInfo: any, rowPath: PositionId) {
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
