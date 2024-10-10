import { useMemo } from 'react'
import { atom, useAtomValue } from 'einfach-state'
import type { RowId } from '@grid-table/basic/src'
import { useBasic } from '@grid-table/basic/src'
import { useData } from '../core'

export function useRowInfo({ rowIndex }: { rowIndex: number }) {
  const { getRowInfoAtomByRowId: getRowInfoAtomByPath } = useData()

  const { rowIdShowListAtom } = useBasic()

  const { rowInfoAtom, pathAtom } = useMemo(() => {
    const _pathAtom = atom<RowId>((_getter) => {
      const pathList = _getter(rowIdShowListAtom)
      const path = pathList[rowIndex]

      return path
    })

    const _rowInfoAtom = atom((_getter) => {
      const path = _getter(_pathAtom)
      return _getter(getRowInfoAtomByPath(path))
    })

    return {
      pathAtom: _pathAtom,
      rowInfoAtom: _rowInfoAtom,
    }
  }, [getRowInfoAtomByPath, rowIdShowListAtom, rowIndex])

  const path = useAtomValue(pathAtom)
  const rowInfo = useAtomValue(rowInfoAtom)
  return {
    path,
    rowIndex,
    rowInfo,
  }
}
