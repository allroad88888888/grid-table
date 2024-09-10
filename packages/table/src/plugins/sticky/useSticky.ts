/* eslint-disable react-hooks/exhaustive-deps */
import type { CSSProperties } from 'react'
import { useEffect, useLayoutEffect, useMemo } from 'react'
import type { AtomEntity } from 'einfach-state'
import { atom, useAtomValue } from 'einfach-state'
import { useMethods, useInit } from 'einfach-utils'
import { useBasic } from '../../basic'

export interface useStickyProps {
  topIndexList?: number[]
  bottomIndexList?: number[]
  direction?: 'row' | 'column'
  topSpace?: number
  /**
   *
   * @default
   * true
   */
  fixed?: boolean
}

const rowTopAtom = atom<number[]>([])
const rowBottomAtom = atom<number[]>([])
const columnTopAtom = atom<number[]>([])
const columnBottomAtom = atom<number[]>([])

type StickyType = 'rowTop' | 'rowBottom' | 'columnTop' | 'columnBottom'
type PositionType = 'left' | 'right' | 'top' | 'bottom'

const Config: Record<
  StickyType,
  {
    position: PositionType
    atomEntity: AtomEntity<number[]>
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
    getColumnStateAtomByIndex,
    getRowStateAtomByIndex,
    columnIndexListAtom,
    rowIndexListAtom,
    rowSizeListAtom,
    columnSizeListAtom,
  } = useBasic()
  const { setter, getter } = store

  const isRow = direction === 'row'

  const listAtom = isRow ? rowIndexListAtom : columnIndexListAtom

  const idsList = useAtomValue(listAtom, { store })

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
      const newList: number[] = [
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
    todo(type: StickyType, nextState: number[] = []) {
      const { position } = Config[type]
      const getStateAtomByIndex = isRow ? getRowStateAtomByIndex : getColumnStateAtomByIndex
      const sizeAtom = isRow ? rowSizeListAtom : columnSizeListAtom
      const isTop = type.indexOf('Bottom') > 0 ? false : true

      let startPosition: number = isTop ? topSpace : 0
      let tempState = nextState

      if (isTop === false) {
        tempState = nextState.reverse()
      }
      const cancelList: (() => void)[] = []
      const positionList: number[] = [startPosition]
      tempState.forEach((tIndex, index) => {
        const atomEntity = getStateAtomByIndex(tIndex)
        const sizeList = getter(sizeAtom)
        if (tIndex > sizeList.length - 1) {
          throw `can't find index ${tIndex}`
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

        startPosition += sizeList[tIndex]
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

  const stayIndexList = useMemo(() => {
    if (idsList.length === 0) {
      return []
    }
    if (fixed === false) {
      return [...topIndexList, ...bottomIndexList]
    }
    const temp: number[] = []
    topIndexList.forEach((t, index) => {
      temp.push(index)
    })
    bottomIndexList.forEach((t, index) => {
      temp.push(idsList.length - 1 - index)
    })
    return temp
  }, [bottomIndexList, idsList.length, topIndexList])

  return {
    stayIndexList,
  }
}
