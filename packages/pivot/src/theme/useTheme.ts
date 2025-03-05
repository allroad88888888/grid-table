import { useEffect } from 'react'
import { useSetAtom, useAtomValue } from '@einfach/state'
import type { Theme } from './types'
import { initHeaderThemeAtom } from './header'
import { columnIndexListAtom, headerRowIndexListAtom } from '@grid-table/view'

export function useTheme(theme?: Theme) {
  const initHeaderTheme = useSetAtom(initHeaderThemeAtom)

  const columns = useAtomValue(columnIndexListAtom)
  const headerIds = useAtomValue(headerRowIndexListAtom)

  useEffect(() => {
    if (!theme) {
      return
    }
    return initHeaderTheme(theme)
  }, [initHeaderTheme, theme, columns, headerIds])
}
