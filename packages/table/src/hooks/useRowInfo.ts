import { useMemo } from 'react'
import { atom, useAtomValue, selectAtom } from '@einfach/react'
import type { RowId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'
import { rowInfoMapAtom } from '../stateCore'

export function useRowInfo({ rowIndex }: { rowIndex: number }) {
  const { rowIdShowListAtom } = useBasic()

  const { rowInfoAtom, pathAtom } = useMemo(() => {
    const _pathAtom = atom<RowId>((_getter) => {
      const pathList = _getter(rowIdShowListAtom)
      return pathList[rowIndex]
    })

    const _rowInfoAtom = atom((_getter) => {
      const path = _getter(_pathAtom)
      const map = _getter(rowInfoMapAtom)
      return map.get(path) ?? null
    })

    return {
      pathAtom: _pathAtom,
      rowInfoAtom: _rowInfoAtom,
    }
  }, [rowIdShowListAtom, rowIndex])

  const path = useAtomValue(pathAtom)
  const rowInfo = useAtomValue(rowInfoAtom)
  return {
    path,
    rowIndex,
    rowInfo,
  }
}

/**
 * 独立 hook：通过 rowId 直接从 rowInfoMapAtom 中 selectAtom 获取行数据
 * 只有该行数据引用变化时才触发重渲染
 */
export function useRowInfoById(rowId: RowId) {
  const infoAtom = useMemo(() => {
    return selectAtom(rowInfoMapAtom, (map) => map.get(rowId) ?? null)
  }, [rowId])

  return useAtomValue(infoAtom)
}
