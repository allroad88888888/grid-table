import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { atom, useAtomValue, useStore } from 'einfach-state'
import type { RowId } from '@grid-table/basic'
import {
  columnIdShowListAtom,
  columnSizeMapAtom,
  rowIdShowListAtom,
  rowSizeMapAtom,
  useBasic,
} from '@grid-table/basic'
import './sticky.css'
import type { StickyType, UseStickyProps } from './type'
import {
  stickyBottomOptionAtom,
  StickyConfig,
  stickyLeftOptionAtom,
  stickyRightOptionAtom,
  stickyTopOptionAtom,
} from './state'

const EmptyArray: string[] = []
export function useSticky(props: UseStickyProps = {}) {
  const {
    bottomIdList = EmptyArray,
    topIdList = EmptyArray,
    direction = 'column',
    topSpace = 0,
    fixed = true,
  } = props

  const { getColumnStateAtomById, getRowStateAtomById } = useBasic()
  const store = useStore()
  const { setter, getter } = store

  const isRow = direction === 'row'

  const listAtom = isRow ? rowIdShowListAtom : columnIdShowListAtom

  /**
   * 设置参数
   */
  useEffect(() => {
    if (isRow) {
      setter(stickyBottomOptionAtom, bottomIdList)
      setter(stickyTopOptionAtom, topIdList)
    } else {
      setter(stickyRightOptionAtom, bottomIdList)
      setter(stickyLeftOptionAtom, topIdList)
    }
  }, [bottomIdList, isRow, setter, topIdList])

  /**
   * 固定列排序
   */
  useEffect(() => {
    if (fixed === false) {
      return
    }
    return setter(listAtom, (_getter, prev) => {
      const setIdsList = new Set(prev)
      const setList = new Set(
        [...topIdList, ...bottomIdList].filter((index) => {
          return setIdsList.has(index)
        }),
      )

      const newList: RowId[] = [
        ...topIdList,
        ...prev.filter((index) => {
          return !setList.has(index)
        }),
        ...bottomIdList,
      ]

      return newList
    })
  }, [bottomIdList, fixed, listAtom, setter, topIdList])

  const realTopIds = useAtomValue(StickyConfig[isRow ? 'rowTop' : 'columnTop'].atomEntity, {
    store,
  })
  const realBottomIds = useAtomValue(
    StickyConfig[isRow ? 'rowBottom' : 'columnBottom'].atomEntity,
    { store },
  )

  const todo = useCallback(
    (type: StickyType, ids: string[]) => {
      const { position } = StickyConfig[type]
      const getStateAtomByIndex = isRow ? getRowStateAtomById : getColumnStateAtomById

      const sizeMapAtom = isRow ? rowSizeMapAtom : columnSizeMapAtom
      const isTop = type.indexOf('Bottom') > 0 ? false : true

      let startPosition: number = isTop ? topSpace : 0
      let tempState = ids

      if (isTop === false) {
        tempState = ids.reverse()
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
              [position]: positionList[index],
            }
            const newClass = [...Array.from(prevState.className), `sticky-${position}`]

            return {
              ...prevState,
              style: newStyle,
              className: new Set(newClass),
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
    [getColumnStateAtomById, getRowStateAtomById, getter, isRow, setter, topSpace],
  )

  useEffect(() => {
    return todo(`${direction}Top`, realTopIds)
  }, [todo, direction, realTopIds])
  useEffect(() => {
    return todo(`${direction}Bottom`, realBottomIds)
  }, [todo, direction, realBottomIds])

  /**
   * 根据id 换算成table接受的index
   */
  const stayIndexListAtom = useMemo(() => {
    return atom((getter) => {
      const showIds = getter(listAtom)
      if (showIds.length === 0) {
        return []
      }
      if (fixed === true) {
        return [
          ...topIdList.map((t, index) => {
            return index
          }),
          ...bottomIdList.map((t, index) => {
            return showIds.length - 1 - index
          }),
        ]
      }

      const tMap = new Map<RowId, number>()
      showIds.forEach((sId, index) => {
        tMap.set(sId, index)
      })
      return [...topIdList, ...bottomIdList].map((tId) => {
        return tMap.get(tId)!
      })
    })
  }, [listAtom])

  const stayIndexList = useAtomValue(stayIndexListAtom, { store })

  return {
    stayIndexList,
  }
}
