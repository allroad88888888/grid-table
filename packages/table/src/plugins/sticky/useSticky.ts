import type { CSSProperties } from 'react'
import { useEffect, useLayoutEffect, useMemo } from 'react'
import type { AtomEntity } from 'einfach-state'
import { atom, useAtomValue } from 'einfach-state'
import { useMethods, useInit } from 'einfach-utils'
import type { ColumnId, RowId } from '@grid-table/basic/src'
import { useBasic } from '@grid-table/basic/src'

export interface useStickyProps {
  topIndexList?: RowId[]
  bottomIndexList?: RowId[]
  direction?: 'row' | 'column'
  topSpace?: number
  /**
   *
   * @default
   * true
   */
  fixed?: boolean
}

const rowTopAtom = atom<RowId[]>([])
const rowBottomAtom = atom<RowId[]>([])
const columnTopAtom = atom<ColumnId[]>([])
const columnBottomAtom = atom<ColumnId[]>([])

type StickyType = 'rowTop' | 'rowBottom' | 'columnTop' | 'columnBottom'
type PositionType = 'left' | 'right' | 'top' | 'bottom'

const Config: Record<
  StickyType,
  {
    position: PositionType
    atomEntity: AtomEntity<RowId[]>
  }
> = {
  rowTop: {
    position: 'top',
    atomEntity: rowTopAtom,
  },
  rowBottom: {
    position: 'bottom',
    atomEntity: rowBottomAtom,
  },
  columnTop: {
    position: 'left',
    atomEntity: columnTopAtom,
  },
  columnBottom: {
    position: 'right',
    atomEntity: columnBottomAtom,
  },
}

const EmptyArray: number[] = []
export function useSticky(props: useStickyProps = {}) {
  const {
    bottomIndexList = EmptyArray,
    topIndexList = EmptyArray,
    direction = 'column',
    topSpace = 0,
    fixed = true,
  } = props

  const {
    store,
    getColumnStateAtomById,
    getRowStateAtomById,
    rowSizeMapAtom,
    columnSizeMapAtom,
    columnIdShowListAtom,
    rowIdShowListAtom,
  } = useBasic()
  const { setter, getter } = store

  const isRow = direction === 'row'

  const listAtom = isRow ? rowIdShowListAtom : columnIdShowListAtom

  const [bottomAtom, topAtom] = useInit(() => {
    return [atom(bottomIndexList), atom(topIndexList)]
  }, [])

  useEffect(() => {
    setter(bottomAtom, bottomIndexList)
    setter(topAtom, topIndexList)
  }, [bottomIndexList, topIndexList])

  useLayoutEffect(() => {
    if (fixed === false) {
      return
    }
    return setter(listAtom, (_getter, prev) => {
      const setIdsList = new Set(prev)
      const setList = new Set(
        [...topIndexList, ...bottomIndexList].filter((index) => {
          return setIdsList.has(index)
        }),
      )

      const newList: RowId[] = [
        ...topIndexList,
        ...prev.filter((index) => {
          return !setList.has(index)
        }),
        ...bottomIndexList,
      ]

      return newList
    })
  }, [bottomIndexList, topIndexList])

  const { todo } = useMethods({
    todo(type: StickyType, nextState: RowId[] = []) {
      const { position } = Config[type]
      const getStateAtomByIndex = isRow ? getRowStateAtomById : getColumnStateAtomById
      const sizeMapAtom = isRow ? rowSizeMapAtom : columnSizeMapAtom
      const isTop = type.indexOf('Bottom') > 0 ? false : true

      let startPosition: number = isTop ? topSpace : 0
      let tempState = nextState

      if (isTop === false) {
        tempState = nextState.reverse()
      }
      const cancelList: (() => void)[] = []
      const positionList: number[] = [startPosition]
      tempState.forEach((tId, index) => {
        const atomEntity = getStateAtomByIndex(tId)
        const sizeMap = getter(sizeMapAtom)
        if (!sizeMap.has(tId)) {
          throw `can't find index ${tId}`
        }
        cancelList.push(
          setter(atomEntity, (getter, prevState) => {
            const newStyle: CSSProperties = {
              ...prevState.style,
              position: 'sticky',
              [position]: positionList[index],
            }
            if (isRow) {
              newStyle.zIndex = 1
            }
            if (index === tempState.length - 1 && isTop) {
              newStyle.borderRightWidth = '1px '
              newStyle.borderRightStyle = 'solid'
            }
            return {
              ...prevState,
              style: newStyle,
            }
          })!,
        )

        startPosition += sizeMap.get(tId)!
        positionList.push(startPosition)
      })
      return () => {
        cancelList.forEach((cancel) => {
          return cancel()
        })
      }
    },
  })

  useLayoutEffect(() => {
    return todo(`${direction}Top`, [...topIndexList])
  }, [topIndexList])
  useLayoutEffect(() => {
    return todo(`${direction}Bottom`, [...bottomIndexList])
  }, [bottomIndexList])

  const stayIndexListAtom = useMemo(() => {
    return atom((getter) => {
      const showIds = getter(listAtom)
      if (showIds.length === 0) {
        return []
      }
      if (fixed === true) {
        return [
          ...topIndexList.map((t, index) => {
            return index
          }),
          ...bottomIndexList.map((t, index) => {
            return showIds.length - 1 - index
          }),
        ]
      }

      const tMap = new Map<RowId, number>()
      showIds.forEach((sId, index) => {
        tMap.set(sId, index)
      })
      return [...topIndexList, ...bottomIndexList].map((tId) => {
        return tMap.get(tId)!
      })
    })
  }, [listAtom])

  const stayIndexList = useAtomValue(stayIndexListAtom, { store })

  return {
    stayIndexList,
  }
}
