import { atom, useAtomValue, useStore } from '@einfach/react'
import { useEffect } from 'react'
import { tableClassNameAtom } from '../../hooks'
import type { ColumnId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'

/** 当前被选中拖拽的列ID */
const selectColumnIndexAtom = atom<ColumnId | undefined>(undefined)
/** 拖拽开始时的鼠标位置和初始left值 [clientX, initialLeft] */
const firstEventAtom = atom<[number, number] | undefined>(undefined)
/** 拖拽线的当前left位置 */
const leftAtom = atom<number | undefined>(0)

/** 拖拽中的CSS类名 */
const DragIngClassName = 'grid-drag-ing'

/**
 * 列宽调整回调函数类型
 */
export type OnColumnResizeCallback = (columnId: ColumnId, newWidth: number) => void

/**
 * 拖拽功能的配置属性
 */
export interface UseDragProps {
  /** 拖拽调整列宽时的最小宽度，默认40px */
  dragColumnMinSize?: number
  /**
   * 是否固定宽度，如果为true则禁用列宽调整
   */
  fixedWidth?: boolean
  /** 是否启用列宽调整功能，默认为true */
  enableColumnResize?: boolean
  /**
   * 列宽调整完成时的回调函数
   * 可用于缓存列宽到本地存储
   * @param columnId 被调整的列ID
   * @param newWidth 调整后的新宽度
   */
  onColumnResize?: OnColumnResizeCallback
}

/**
 * 列拖拽调整宽度的主要逻辑hook
 *
 * @param props 拖拽配置参数
 * @returns 返回当前选中的列索引、拖拽线位置和表格高度
 */
export function useDrag({
  dragColumnMinSize = 40,
  fixedWidth = false,
  enableColumnResize = true,
  onColumnResize,
}: UseDragProps) {
  const { columnSizeMapAtom, resizeAtom } = useBasic()
  const store = useStore()
  const selectColumnId = useAtomValue(selectColumnIndexAtom, { store })
  const left = useAtomValue(leftAtom, { store })

  const { height } = useAtomValue(resizeAtom, { store })

  useEffect(() => {
    // 如果没有选中列或禁用了列宽调整，则不处理拖拽
    if (selectColumnId === undefined || enableColumnResize == false) {
      return
    }

    // 获取拖拽开始时的鼠标位置和初始left值
    const [firstX, firstLeft] = store.getter(firstEventAtom)!

    // 获取当前列宽映射表
    const columnSizeMap = store.getter(columnSizeMapAtom)

    // 获取当前被拖拽列的宽度
    const currentWidth = columnSizeMap.get(selectColumnId) || 0

    /**
     * 鼠标松开事件处理函数 - 完成列宽调整
     */
    function mouseup(event: MouseEvent) {
      if (!selectColumnId) {
        return
      }
      // 复制当前列宽映射表
      const nextSizeMap = new Map(columnSizeMap)
      // 计算鼠标移动的距离
      const mvLength = event.clientX - firstX
      // 计算新的列宽，确保不小于最小宽度
      const nextWidth = Math.max(dragColumnMinSize, currentWidth + mvLength)
      // 更新列宽映射表
      nextSizeMap.set(selectColumnId, nextWidth)

      // 保存新的列宽映射
      store.setter(columnSizeMapAtom, nextSizeMap)

      // 调用列宽调整回调函数，让使用方可以缓存到本地
      if (onColumnResize) {
        onColumnResize(selectColumnId, nextWidth)
      }

      // 清空拖拽状态
      store.setter(selectColumnIndexAtom, undefined)
      store.setter(firstEventAtom, undefined)
      /**
       * 移除拖拽中的视觉效果
       */
      const next = new Set(store.getter(tableClassNameAtom))
      next.delete(DragIngClassName)
      store.setter(tableClassNameAtom, next)
    }

    /**
     * 鼠标移动事件处理函数 - 实时更新拖拽线位置
     */
    function mouseMove(event: MouseEvent) {
      // 计算鼠标移动的距离
      const mvLength = event.clientX - firstX

      // 计算拖拽线的新位置，确保不会小于最小宽度对应的位置
      const tLeft = Math.max(firstLeft - currentWidth + dragColumnMinSize, firstLeft + mvLength)
      store.setter(leftAtom, tLeft)
    }

    // 绑定鼠标事件监听器
    document.body.addEventListener('mousemove', mouseMove)
    document.body.addEventListener('mouseup', mouseup)
    document.body.addEventListener('mouseleave', mouseup) // 鼠标离开页面时也结束拖拽

    // 清理函数：移除事件监听器
    return () => {
      document.body.removeEventListener('mouseup', mouseup)
      document.body.removeEventListener('mousemove', mouseMove)
      document.body.removeEventListener('mouseleave', mouseup)
    }
  }, [
    selectColumnId,
    columnSizeMapAtom,
    dragColumnMinSize,
    enableColumnResize,
    onColumnResize,
    store,
  ])

  return {
    /** 当前被选中拖拽的列ID */
    selectIndex: selectColumnId,
    /** 拖拽线的当前left位置 */
    left,
    /** 表格的高度，用于设置拖拽线的高度 */
    height,
  }
}

/**
 * 为指定列创建拖拽项的hook
 *
 * @param columnId 列的唯一标识符
 * @returns 返回鼠标按下事件处理函数
 */
export function useDrayItem(columnId: ColumnId) {
  const store = useStore()

  /**
   * 鼠标按下事件处理函数 - 开始拖拽
   */
  function mousedown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // 设置当前选中的拖拽列
    store.setter(selectColumnIndexAtom, columnId)

    // 使用 getBoundingClientRect 获取精确位置，避免 sticky 定位的影响
    const target = e.target as HTMLDivElement
    const targetRect = target.getBoundingClientRect()

    // 固定向父级查找两层找到定位容器（避免sticky定位影响）
    const tableContainer = target.parentElement?.parentElement as HTMLElement
    const containerRect = tableContainer?.getBoundingClientRect()

    // 计算拖拽线的初始位置（相对于表格容器）
    const left = targetRect.right - containerRect.left

    store.setter(leftAtom, left)

    // 记录拖拽开始时的鼠标位置和初始left值
    store.setter(firstEventAtom, [e.clientX, left])

    // 添加拖拽中的视觉效果类名
    const next = new Set(store.getter(tableClassNameAtom))
    next.add(DragIngClassName)
    store.setter(tableClassNameAtom, next)
  }

  return {
    /** 鼠标按下事件处理函数 */
    mousedown,
  }
}
