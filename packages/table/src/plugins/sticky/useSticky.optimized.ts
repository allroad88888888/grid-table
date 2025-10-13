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
  stickyBottomAtom,
  StickyConfig,
  stickyLeftAtom,
  stickyRightAtom,
  stickyTopAtom,
} from './state'

/** 空数组常量，避免重复创建 */
const EmptyArray: string[] = []

/** 错误消息常量 */
const ERROR_MESSAGES = {
  ELEMENT_NOT_FOUND: (id: string) => `无法找到元素 ${id} 的尺寸信息`,
} as const

/**
 * 计算固定元素的位置信息
 * 修复右侧固定列的位置计算问题
 */
const calculatePositions = (
  ids: string[],
  sizeMap: Map<string, number>,
  startPosition: number,
  isReverse: boolean = false,
): { positions: number[]; idOrder: string[] } => {
  const positions: number[] = []
  let currentPosition = startPosition
  const processIds = isReverse ? [...ids].reverse() : ids

  // 为每个元素计算位置
  processIds.forEach((id) => {
    const size = sizeMap.get(id)
    if (size === undefined) {
      throw new Error(ERROR_MESSAGES.ELEMENT_NOT_FOUND(id))
    }

    // 当前位置就是这个元素的定位值
    // 例如：右侧固定列 [A,B,C] -> 处理顺序 [C,B,A] -> 位置 [0, 120, 270]
    positions.push(currentPosition)
    currentPosition += size
  })

  return {
    positions,
    idOrder: processIds, // 返回实际的处理顺序
  }
}

/**
 * 创建sticky样式更新函数
 */
const createStyleUpdater =
  (position: string, positionValue: number, shadowType?: 'left' | 'right') =>
  (getter: any, prevState: any) => {
    const newStyle: CSSProperties = {
      ...prevState.style,
      [position]: positionValue,
    }

    const newClass = [...Array.from(prevState.className), `sticky-${position}`]

    // 添加阴影类
    if (shadowType === 'left') {
      newClass.push('sticky-shadow-left')
    } else if (shadowType === 'right') {
      newClass.push('sticky-shadow-right')
    }

    return {
      ...prevState,
      style: newStyle,
      className: new Set(newClass),
    }
  }

/**
 * 优化后的固定列/行功能hook
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
  const { setter } = store

  // 缓存计算结果
  const stickyConfig = useMemo(() => {
    const isRow = direction === 'row'
    return {
      isRow,
      listAtom: isRow ? rowIdShowListAtom : columnIdShowListAtom,
      sizeMapAtom: isRow ? rowSizeMapAtom : columnSizeMapAtom,
      getStateAtomByIndex: isRow ? getRowStateAtomById : getColumnStateAtomById,
      topAtom: isRow ? stickyTopAtom : stickyLeftAtom,
      bottomAtom: isRow ? stickyBottomAtom : stickyRightAtom,
    }
  }, [direction])

  /**
   * 设置sticky配置参数 - 优化版
   */
  useEffect(() => {
    const { topAtom, bottomAtom } = stickyConfig
    setter(bottomAtom, bottomIdList)
    setter(topAtom, topIdList)
  }, [bottomIdList, topIdList, setter, stickyConfig])
  /** 获取实际的固定元素ID列表 */
  const realTopIds = useAtomValue(
    StickyConfig[stickyConfig.isRow ? 'rowTop' : 'columnTop'].atomEntity,
    { store },
  )

  const realBottomIds = useAtomValue(
    StickyConfig[stickyConfig.isRow ? 'rowBottom' : 'columnBottom'].atomEntity,
    { store },
  )

  /**
   * 优化的自动排序功能
   */
  const sortFixedElements = useCallback(() => {
    if (!fixed) return

    return setter(stickyConfig.listAtom, (_getter, prev) => {
      // 使用Set提高查找性能
      const existingIds = new Set(prev)
      const allFixedIds = new Set([...realTopIds, ...realBottomIds])

      // 只处理实际存在的固定元素
      const validTopIds = realTopIds.filter((id) => existingIds.has(id))
      const validBottomIds = realBottomIds.filter((id) => existingIds.has(id))

      // 构建新列表
      const newList: RowId[] = [
        ...validTopIds,
        ...prev.filter((id) => !allFixedIds.has(id)),
        ...validBottomIds,
      ]

      return newList
    })
  }, [fixed, stickyConfig.listAtom, setter, realTopIds])

  useEffect(() => {
    return sortFixedElements()
  }, [sortFixedElements])

  /** 监听sizeMap的变化 */
  const sizeMap = useAtomValue(stickyConfig.sizeMapAtom, { store })

  /**
   * 优化的核心处理函数
   */
  const applyStickyStyles = useCallback(
    (type: StickyType, ids: string[]) => {
      if (ids.length === 0) {
        return () => {} // 空的清理函数
      }

      const { position } = StickyConfig[type]
      const { getStateAtomByIndex } = stickyConfig
      const isTop = !type.includes('Bottom')

      try {
        // 计算位置 - 修复右侧固定列位置计算
        // 对于右侧固定列：原始顺序 [A,B,C] -> 处理顺序 [C,B,A] -> CSS位置 [0,120,270]
        const { positions, idOrder } = calculatePositions(
          ids,
          sizeMap,
          isTop ? topSpace : 0,
          !isTop,
        )

        // 批量应用样式 - 使用正确的id和位置对应关系
        // idOrder和positions一一对应，确保位置计算正确
        const cancelFunctions = idOrder.map((id, index) => {
          const atomEntity = getStateAtomByIndex(id)
          const positionValue = positions[index]

          // 确定是否需要添加阴影
          let shadowType: 'left' | 'right' | undefined = undefined

          // 只对列方向的sticky添加阴影，row方向不需要
          if (!stickyConfig.isRow) {
            if (position === 'left' && index === idOrder.length - 1) {
              // 左边最后一列，添加右侧阴影
              shadowType = 'right'
            } else if (position === 'right' && index === 0) {
              // 右边第一列，添加左侧阴影
              shadowType = 'left'
            }
          }

          return setter(atomEntity, createStyleUpdater(position, positionValue, shadowType))!
        })

        // 返回批量清理函数
        return () => {
          cancelFunctions.forEach((cancel) => cancel())
        }
      } catch (error) {
        console.error(`应用sticky样式失败:`, error)
        return () => {} // 返回空的清理函数
      }
    },
    [stickyConfig, topSpace, setter, sizeMap],
  )

  // 应用sticky效果
  useEffect(() => {
    return applyStickyStyles(`${direction}Top`, realTopIds)
  }, [applyStickyStyles, direction, realTopIds])

  useEffect(() => {
    return applyStickyStyles(`${direction}Bottom`, realBottomIds)
  }, [applyStickyStyles, direction, realBottomIds])

  /**
   * 优化的索引计算
   */
  const stayIndexListAtom = useMemo(() => {
    return atom((getter) => {
      const showIds = getter(stickyConfig.listAtom)

      if (showIds.length === 0) {
        return EmptyArray as unknown as number[] // 返回缓存的空数组
      }

      if (fixed) {
        // 优化：减少map调用
        const topIndexes = realTopIds.map((_, index) => index)
        const bottomIndexes = realBottomIds.map((_, index) => showIds.length - 1 - index)
        return [...topIndexes, ...bottomIndexes]
      }

      // 优化：使用更高效的索引映射
      const indexMap = new Map<RowId, number>()
      showIds.forEach((id, index) => {
        indexMap.set(id, index)
      })

      return [...realTopIds, ...realBottomIds]
        .map((id) => indexMap.get(id))
        .filter((index): index is number => index !== undefined)
    })
  }, [stickyConfig.listAtom, fixed, realTopIds, realBottomIds])

  /** 获取需要保持可见的固定元素索引列表 */
  const stayIndexList = useAtomValue(stayIndexListAtom, { store })

  return {
    /** 固定元素的索引列表，用于虚拟滚动等功能 */
    stayIndexList,
  }
}
