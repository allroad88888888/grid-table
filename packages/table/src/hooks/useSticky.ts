/* eslint-disable react-hooks/exhaustive-deps */
import type { CSSProperties } from 'react'
import { useLayoutEffect, useMemo } from 'react'
import type { AtomEntity } from 'einfach-state'
import { atom, useAtomValue } from 'einfach-state'
import { useMethods } from 'einfach-utils'
import { useBasic } from '../basic'

export interface useStickyProps {
  topIndexList?: number[]
  bottomIndexList?: number[]
  direction?: 'row' | 'column'
  topSpace?: number
  fixed?: boolean
}

const rowTopAtom = atom<number[]>([])
const rowBottomAtom = atom<number[]>([])
const columnTopAtom = atom<number[]>([])
const columnBottomAtom = atom<number[]>([])

type StickyType = 'rowTop' | 'rowBottom' | 'columnTop' | 'columnBottom'
type PositionType = 'left' | 'right' | 'top' | 'bottom'

const Config: Record<StickyType, {
  position: PositionType
  atomEntity: AtomEntity<number[]>
}> = {
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
export function useSticky(props: useStickyProps = { }) {
  const { bottomIndexList = EmptyArray, topIndexList = EmptyArray, direction = 'column',
    topSpace = 0, fixed = true } = props

  const { store, getCellStateAtomByIndex: getColumnStateAtomByIndex,
    getRowStateAtomByIndex, columnListAtom, rowListAtom,
    rowSizeMapAtom, columnSizeMapAtom } = useBasic()
  const { getter, setter } = store

  const isRow = direction === 'row'

  const listAtom = isRow ? rowListAtom : columnListAtom

  const idsList = useAtomValue(listAtom, { store })

  useLayoutEffect(() => {
    if (fixed === false) {
      return
    }
    const setIdsList = new Set(idsList)
    const setList = new Set([...topIndexList, ...bottomIndexList].filter((index) => {
      return setIdsList.has(index)
    }))
    const newList = [...topIndexList, ...idsList.filter((index) => {
      return !setList.has(index)
    }), ...bottomIndexList]
    setter(listAtom, newList)
  }, [bottomIndexList, topIndexList])

  const { todo } = useMethods({
    todo(type: StickyType, nextState: number[] = []) {
      const { position, atomEntity } = Config[type]
      const prevState = getter(atomEntity)
      const getStateAtomByIndex = isRow ? getRowStateAtomByIndex : getColumnStateAtomByIndex
      const sizeAtom = isRow ? rowSizeMapAtom : columnSizeMapAtom
      const isTop = type.indexOf('Bottom') > 0 ? false : true
      // clear prevState
      prevState.forEach((tIndex, index) => {
        const atomEntity = getStateAtomByIndex(tIndex)
        const state = getter(atomEntity)
        const newStyle = {
          ...state.style,
        }
        if (newStyle['position'] === 'sticky') {
          delete newStyle['position']
          delete newStyle[position]
        }

        if (index === prevState.length - 1 && isTop) {
          delete newStyle.borderRightWidth
          delete newStyle.borderRightStyle
        }
        if (isRow) {
          delete newStyle.zIndex
        }

        setter(atomEntity, {
          ...state,
          style: newStyle,
        })
      })
      let startPosition: number = isTop ? topSpace : 0
      let tempState = nextState

      if (isTop === false) {
        tempState = nextState.reverse()
      }
      tempState.forEach((tIndex, index) => {
        const atomEntity = getStateAtomByIndex(tIndex)
        const sizeList = getter(sizeAtom)
        if (!sizeList.has(tIndex)) {
          throw `can't find index ${tIndex}`
        }

        setter(atomEntity, (prevState) => {
          const newStyle: CSSProperties = {
            ...prevState.style,
            position: 'sticky',
            [position]: startPosition,
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
        })
        startPosition += sizeList.get(tIndex)!
      })
    },
  })

  useLayoutEffect(() => {
    todo(`${direction}Top`, topIndexList)
  }, [topIndexList])
  useLayoutEffect(() => {
    todo(`${direction}Bottom`, bottomIndexList)
  }, [bottomIndexList])

  const stayIndexList = useMemo(() => {
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
