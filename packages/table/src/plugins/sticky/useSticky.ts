import type { CSSProperties } from 'react'
import { useEffect, useMemo } from 'react'
import type { AtomEntity } from 'einfach-state'
import { atom, useAtomValue, useStore } from 'einfach-state'
import { useMethods, useInit } from 'einfach-utils'
import type { ColumnId, RowId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'

export interface UseStickyProps {
  topIndexList?: RowId[]
  bottomIndexList?: RowId[]
  direction?: 'row' | 'column'
  topSpace?: number
  /**
   * @default true
   */
  bordered?: boolean
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

const EmptyArray: string[] = []
export function useSticky(props: UseStickyProps = {}) {
  const {
    bottomIndexList = EmptyArray,
    topIndexList = EmptyArray,
    direction = 'column',
    topSpace = 0,
    fixed = true,
    bordered: border = true,
  } = props

  const {
    getColumnStateAtomById,
    getRowStateAtomById,
    rowSizeMapAtom,
    columnSizeMapAtom,
    columnIdShowListAtom,
    rowIdShowListAtom,
  } = useBasic()
  const store = useStore()
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

  useEffect(() => {
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
            if (index === tempState.length - 1 && isTop && border && direction == 'column') {
              if (index === 0) {
                /**
                 * 取消最左边border- 不占用1px 让外围的border 1px
                 */
                newStyle.borderLeftWidth = 0
              }
              if (index === tempState.length - 1) {
                newStyle.borderRightWidth = '1px'
                newStyle.borderRightStyle = 'solid'
                /**
                 * 遮第一列的left-border 1px
                 */
                newStyle.marginRight = '-1px'
              }
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

  useEffect(() => {
    return todo(`${direction}Top`, [...topIndexList])
  }, [topIndexList, border])
  useEffect(() => {
    return todo(`${direction}Bottom`, [...bottomIndexList])
  }, [bottomIndexList, border])

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
