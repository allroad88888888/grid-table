import { atom } from '@einfach/state'
import type { HeaderCellTheme } from './types/header'
import { basicAtom, columnIndexListAtom, getCellId, headerRowIndexListAtom } from '@grid-table/view'
import { mergeStyles } from '../utils/mergeStyles'

export const initHeaderThemeAtom = atom(0, (getter, setter, headerTheme: HeaderCellTheme) => {
  const headerIds = getter(headerRowIndexListAtom)
  const columnIds = getter(columnIndexListAtom)

  const { getHeaderCellStateAtomById } = getter(basicAtom)
  const cancelList: (() => void)[] = []
  headerIds.forEach((rowId) => {
    columnIds.forEach((columnId) => {
      const cellId = getCellId({
        rowId,
        columnId,
      })

      cancelList.push(
        setter(getHeaderCellStateAtomById(cellId), (getter, prev) => {
          const next = {
            ...prev,
            style: mergeStyles([prev.style, headerTheme]),
          }

          return next
        })!,
      )
    })
  })
  return () => {
    cancelList.forEach((cancel) => {
      cancel()
    })
  }
})
