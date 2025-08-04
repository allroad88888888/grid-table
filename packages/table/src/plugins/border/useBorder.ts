import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { useAtomValue, useStore } from '@einfach/react'
import { columnIdShowListAtom, rowIdShowListAtom, useBasic } from '@grid-table/basic'
import { stickyRightAtom, stickyBottomAtom } from '../sticky/state'

export function useBorder({ showBorder = true }: { showBorder?: boolean } = {}) {
  const { getColumnStateAtomById, getRowStateAtomById } = useBasic()
  const store = useStore()
  const { setter } = store

  const columnIdShowList = useAtomValue(columnIdShowListAtom, { store })
  const rowIdShowList = useAtomValue(rowIdShowListAtom, { store })
  const stickyRightIds = useAtomValue(stickyRightAtom, { store })
  const stickyBottomIds = useAtomValue(stickyBottomAtom, { store })

  // 处理右侧固定列的边框
  useEffect(() => {
    if (!showBorder) return

    const cancelList: (() => void)[] = []

    stickyRightIds.forEach((columnId, index) => {
      const atomEntity = getColumnStateAtomById(columnId)

      cancelList.push(
        setter(atomEntity, (getter, prevState) => {
          const newStyle: CSSProperties = {
            ...prevState.style,
          }

          // 第一列添加左边框和阴影
          if (index === 0) {
            newStyle.borderLeft = '1px var(--grid-cell-border-style) var(--grid-border-color)'
            newStyle.boxShadow = '-2px 0 6px rgba(0, 0, 0, 0.08)'
          }
          if (index === stickyRightIds.length - 1) {
            newStyle.borderRightWidth = '0'
          }

          return {
            ...prevState,
            style: newStyle,
          }
        })!,
      )
    })

    return () => {
      cancelList.forEach((cancel) => cancel())
    }
  }, [stickyRightIds, getColumnStateAtomById, setter, showBorder])

  // 处理底部固定行的边框
  useEffect(() => {
    if (!showBorder) return

    const cancelList: (() => void)[] = []

    stickyBottomIds.forEach((rowId, index) => {
      const atomEntity = getRowStateAtomById(rowId)
      cancelList.push(
        setter(atomEntity, (getter, prevState) => {
          const newStyle: CSSProperties = {
            ...prevState.style,
          }

          // 第一行添加上边框
          if (index === 0) {
            newStyle.borderTop = '1px var(--grid-cell-border-style) var(--grid-border-color)'
          }
          if (index === stickyBottomIds.length - 1) {
            newStyle.borderBottomWidth = '0'
          }

          return {
            ...prevState,
            style: newStyle,
          }
        })!,
      )
    })

    return () => {
      cancelList.forEach((cancel) => cancel())
    }
  }, [stickyBottomIds, getRowStateAtomById, setter, showBorder])

  // 处理普通列表最后一列的边框
  useEffect(() => {
    if (!showBorder) return

    if (columnIdShowList.length === 0) return

    const normalColumnIds = columnIdShowList.filter((id) => !stickyRightIds.includes(id))

    const atomEntity = getColumnStateAtomById(normalColumnIds[normalColumnIds.length - 1])

    return setter(atomEntity, (getter, prevState) => {
      const newStyle: CSSProperties = {
        ...prevState.style,
        borderRightWidth: '0',
      }

      return {
        ...prevState,
        style: newStyle,
      }
    })!
  }, [columnIdShowList, getColumnStateAtomById, setter, showBorder])

  // 处理普通行列表最后一行的边框
  useEffect(() => {
    if (!showBorder) return

    if (rowIdShowList.length === 0) return

    const normalRowIds = rowIdShowList.filter((id) => !stickyBottomIds.includes(id))
    const atomEntity = getRowStateAtomById(normalRowIds[normalRowIds.length - 1])

    return setter(atomEntity, (getter, prevState) => {
      const newStyle: CSSProperties = {
        ...prevState.style,
        borderBottomWidth: '0',
      }

      return {
        ...prevState,
        style: newStyle,
      }
    })!
  }, [rowIdShowList, getRowStateAtomById, setter, showBorder])
}
