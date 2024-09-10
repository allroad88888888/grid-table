import { useMemo } from 'react'
import { useData } from './useData'
import { atom, useAtomValue } from 'einfach-state'

export function useRowInfo({ rowIndex }: { rowIndex: number }) {
  const { showPathListAtom, getRowInfoAtomByPath } = useData()

  const { rowInfoAtom, pathAtom } = useMemo(() => {
    const _pathAtom = atom((_getter) => {
      const pathList = _getter(showPathListAtom)
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
  }, [getRowInfoAtomByPath, rowIndex, showPathListAtom])

  const path = useAtomValue(pathAtom)
  const rowInfo = useAtomValue(rowInfoAtom)
  return {
    path,
    rowIndex,
    rowInfo,
  }
}
