import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { atom, useAtomValue, useStore } from '@einfach/react'
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

/** 空数组常量，避免重复创建 */
const EmptyArray: string[] = []
/**
 * 固定列/行功能的主要逻辑hook
 *
 * @param props 固定功能配置参数
 * @returns 返回固定元素的索引列表
 */
export function useSticky(props: UseStickyProps = {}) {
  const {
    /** 底部/右侧固定的ID列表 */
    bottomIdList = EmptyArray,
    /** 顶部/左侧固定的ID列表 */
    topIdList = EmptyArray,
    /** 固定方向：'column'为固定列，'row'为固定行 */
    direction = 'column',
    /** 顶部固定时的起始空间偏移 */
    topSpace = 0,
    /** 是否启用固定功能并自动排序 */
    fixed = true,
  } = props

  const { getColumnStateAtomById, getRowStateAtomById } = useBasic()
  const store = useStore()
  const { setter, getter } = store

  /** 是否为行方向的固定（固定行） */
  const isRow = direction === 'row'

  /** 根据方向选择对应的显示列表atom */
  const listAtom = isRow ? rowIdShowListAtom : columnIdShowListAtom

  /**
   * 根据固定方向设置对应的sticky配置参数
   * - 行方向：设置顶部和底部固定行
   * - 列方向：设置左侧和右侧固定列
   */
  useEffect(() => {
    if (isRow) {
      // 行方向固定：底部ID列表对应底部固定行，顶部ID列表对应顶部固定行
      setter(stickyBottomOptionAtom, bottomIdList)
      setter(stickyTopOptionAtom, topIdList)
    } else {
      // 列方向固定：底部ID列表对应右侧固定列，顶部ID列表对应左侧固定列
      setter(stickyRightOptionAtom, bottomIdList)
      setter(stickyLeftOptionAtom, topIdList)
    }
  }, [bottomIdList, isRow, setter, topIdList])

  /**
   * 固定元素的自动排序功能
   * 将固定的列/行自动排列到列表的开头和结尾
   */
  useEffect(() => {
    if (fixed === false) {
      return
    }
    return setter(listAtom, (_getter, prev) => {
      // 创建当前显示元素的Set，用于快速查找
      const setIdsList = new Set(prev)
      // 筛选出实际存在的固定元素
      const setList = new Set(
        [...topIdList, ...bottomIdList].filter((index) => {
          return setIdsList.has(index)
        }),
      )

      // 重新排列：固定在顶部的元素 + 非固定元素 + 固定在底部的元素
      const newList: RowId[] = [
        ...topIdList, // 顶部/左侧固定元素
        ...prev.filter((index) => {
          // 非固定的中间元素
          return !setList.has(index)
        }),
        ...bottomIdList, // 底部/右侧固定元素
      ]

      return newList
    })
  }, [bottomIdList, fixed, listAtom, setter, topIdList])

  /** 获取实际的顶部/左侧固定元素ID列表 */
  const realTopIds = useAtomValue(StickyConfig[isRow ? 'rowTop' : 'columnTop'].atomEntity, {
    store,
  })
  /** 获取实际的底部/右侧固定元素ID列表 */
  const realBottomIds = useAtomValue(
    StickyConfig[isRow ? 'rowBottom' : 'columnBottom'].atomEntity,
    { store },
  )

  /**
   * 核心处理函数：为指定类型的元素应用sticky定位样式
   *
   * @param type sticky类型（rowTop/rowBottom/columnTop/columnBottom）
   * @param ids 需要应用sticky的元素ID列表
   * @returns 清理函数，用于取消sticky效果
   */
  const todo = useCallback(
    (type: StickyType, ids: string[]) => {
      // 获取对应的CSS定位属性（top/bottom/left/right）
      const { position } = StickyConfig[type]
      // 根据方向选择对应的状态获取函数
      const getStateAtomByIndex = isRow ? getRowStateAtomById : getColumnStateAtomById

      // 根据方向选择对应的尺寸映射表
      const sizeMapAtom = isRow ? rowSizeMapAtom : columnSizeMapAtom
      // 判断是否为顶部/左侧固定（非底部/右侧）
      const isTop = type.indexOf('Bottom') > 0 ? false : true

      // 设置起始位置：顶部/左侧固定考虑topSpace偏移，底部/右侧固定从0开始
      let startPosition: number = isTop ? topSpace : 0
      let tempState = ids

      // 底部/右侧固定需要反向处理，确保最后一个元素贴着边缘
      if (isTop === false) {
        tempState = [...ids].reverse()
      }

      // 存储取消函数的列表，用于清理
      const cancelList: (() => void)[] = []
      // 存储每个元素的位置列表
      const positionList: number[] = [startPosition]

      // 遍历每个需要固定的元素
      tempState.forEach((tId, index) => {
        const atomEntity = getStateAtomByIndex(tId)
        const sizeMap = getter(sizeMapAtom)

        // 检查元素是否存在尺寸信息
        if (!sizeMap.has(tId)) {
          throw `can't find index ${tId}`
        }

        // 为元素设置sticky样式和类名
        cancelList.push(
          setter(atomEntity, (getter, prevState) => {
            // 添加position样式（top/bottom/left/right）
            const newStyle: CSSProperties = {
              ...prevState.style,
              [position]: positionList[index],
            }

            // 添加sticky相关的CSS类名
            const newClass = [...Array.from(prevState.className), `sticky-${position}`]

            return {
              ...prevState,
              style: newStyle,
              className: new Set(newClass),
            }
          })!,
        )

        // 累加位置，为下一个元素计算位置
        startPosition += sizeMap.get(tId)!
        positionList.push(startPosition)
      })

      // 返回清理函数，用于移除所有sticky效果
      return () => {
        cancelList.forEach((cancel) => {
          return cancel()
        })
      }
    },
    [getColumnStateAtomById, getRowStateAtomById, getter, isRow, setter, topSpace],
  )

  // 应用顶部/左侧固定效果
  useEffect(() => {
    return todo(`${direction}Top`, realTopIds)
  }, [todo, direction, realTopIds])

  // 应用底部/右侧固定效果
  useEffect(() => {
    return todo(`${direction}Bottom`, realBottomIds)
  }, [todo, direction, realBottomIds])

  /**
   * 计算固定元素在表格中的实际索引位置
   * 用于虚拟滚动等功能需要知道哪些索引位置需要保持可见
   */
  const stayIndexListAtom = useMemo(() => {
    return atom((getter) => {
      const showIds = getter(listAtom)
      if (showIds.length === 0) {
        return []
      }

      // 如果启用了自动排序功能
      if (fixed === true) {
        return [
          // 顶部/左侧固定元素的索引（从0开始）
          ...topIdList.map((t, index) => {
            return index
          }),
          // 底部/右侧固定元素的索引（从末尾开始倒数）
          ...bottomIdList.map((t, index) => {
            return showIds.length - 1 - index
          }),
        ]
      }

      // 如果没有启用自动排序，需要根据实际位置计算索引
      const tMap = new Map<RowId, number>()
      showIds.forEach((sId, index) => {
        tMap.set(sId, index)
      })
      // 返回所有固定元素的实际索引位置
      return [...topIdList, ...bottomIdList].map((tId) => {
        return tMap.get(tId)!
      })
    })
  }, [listAtom])

  /** 获取需要保持可见的固定元素索引列表 */
  const stayIndexList = useAtomValue(stayIndexListAtom, { store })

  return {
    /** 固定元素的索引列表，用于虚拟滚动等功能 */
    stayIndexList,
  }
}
