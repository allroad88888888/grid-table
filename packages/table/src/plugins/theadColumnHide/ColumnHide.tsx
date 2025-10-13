import { atom, useStore, useAtomValue, useSetAtom } from '@einfach/react'
import { useCallback, useMemo } from 'react'
import { areaColumnIdsAtom } from '../areaSelected'
import { hideColumnAtom, hideColumnsAtom } from './state'
import { columnIndexListAtom } from '@grid-table/basic'
import { localeAtom } from '../../state'

export function ColumnHide() {
  const store = useStore()

  const currentHideColumnIdAtom = useMemo(() => {
    return atom((getter) => {
      const selectColumns = getter(areaColumnIdsAtom)

      const columnIds = getter(columnIndexListAtom)

      let filter = false
      const areColumnIds = new Set(
        columnIds.filter((tId) => {
          if (tId === selectColumns[0]) {
            filter = true
          } else if (tId === selectColumns[selectColumns.length - 1]) {
            filter = false
          }
          return filter
        }),
      )

      const hideColumns = getter(hideColumnsAtom)

      return hideColumns.filter((tId) => {
        return areColumnIds.has(tId)
      })
    })
  }, [])

  const hideColumns = useAtomValue(currentHideColumnIdAtom, { store })
  const locale = useAtomValue(localeAtom, { store })

  const onHideClick = useSetAtom(hideColumnAtom, { store })

  const onShowClick = useCallback(() => {
    store.setter(hideColumnsAtom, (prev) => {
      const next = new Set(prev)
      hideColumns.forEach((tColumnId) => {
        next.delete(tColumnId)
      })

      return Array.from(next)
    })
  }, [hideColumns, store])

  return (
    <>
      <li onClick={onHideClick} key="hide">
        {locale.hideColumn}
      </li>
      {hideColumns.length > 0 ? (
        <li onClick={onShowClick} key="show">
          {locale.showHiddenColumns}
        </li>
      ) : null}
    </>
  )
}
