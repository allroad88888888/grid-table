import { useCallback, useEffect } from 'react'
import { useAtomValue, useStore } from '@einfach/react'
import { columnIdShowListAtom, rowIdShowListAtom, headerRowIndexListAtom } from '@grid-table/basic'
import { getCellId } from '../../utils/getCellId'
import { focusPositionAtom, selectionAnchorAtom, getCellDomId } from './state'
import type { FocusPosition, NavigationDirection, UseKeyboardProps } from './types'

export function useKeyboard(props: UseKeyboardProps = {}) {
  const {
    enableKeyboard = true,
    keyboardHandler,
    onFocusChange,
    scrollToFocus = true,
  } = props

  const store = useStore()

  const rowIdShowList = useAtomValue(rowIdShowListAtom, { store })
  const columnIdShowList = useAtomValue(columnIdShowListAtom, { store })
  const headerRowList = useAtomValue(headerRowIndexListAtom, { store })

  // 导航计算
  const navigate = useCallback(
    (direction: NavigationDirection) => {
      const current = store.getter(focusPositionAtom)

      if (!current) {
        // 无焦点时，导航到第一个单元格
        if (rowIdShowList.length > 0 && columnIdShowList.length > 0) {
          const pos: FocusPosition = {
            rowId: rowIdShowList[0],
            columnId: columnIdShowList[0],
            cellId: getCellId({ rowId: rowIdShowList[0], columnId: columnIdShowList[0] }),
            region: 'tbody',
          }
          store.setter(focusPositionAtom, pos)
          onFocusChange?.(pos)
        }
        return
      }

      const rowList = current.region === 'thead' ? headerRowList : rowIdShowList
      let rowIndex = rowList.indexOf(current.rowId)
      const colIndex = columnIdShowList.indexOf(current.columnId)

      // 聚焦行已被删除/过滤，重置到最近的有效位置
      if (rowIndex === -1) {
        rowIndex = 0
      }
      if (colIndex === -1) {
        return
      }

      let nextRowIndex = rowIndex
      let nextColIndex = colIndex
      let nextRegion = current.region

      switch (direction) {
        case 'up':
          if (rowIndex > 0) {
            nextRowIndex = rowIndex - 1
          } else if (current.region === 'tbody' && headerRowList.length > 0) {
            nextRegion = 'thead'
            nextRowIndex = headerRowList.length - 1
          }
          break
        case 'down':
          if (rowIndex < rowList.length - 1) {
            nextRowIndex = rowIndex + 1
          } else if (current.region === 'thead' && rowIdShowList.length > 0) {
            nextRegion = 'tbody'
            nextRowIndex = 0
          }
          break
        case 'left':
          if (colIndex > 0) nextColIndex = colIndex - 1
          break
        case 'right':
          if (colIndex < columnIdShowList.length - 1) nextColIndex = colIndex + 1
          break
        case 'home':
          nextColIndex = 0
          break
        case 'end':
          nextColIndex = columnIdShowList.length - 1
          break
        case 'ctrlHome':
          nextRowIndex = 0
          nextColIndex = 0
          nextRegion = headerRowList.length > 0 ? 'thead' : 'tbody'
          break
        case 'ctrlEnd':
          nextRegion = 'tbody'
          nextRowIndex = rowIdShowList.length - 1
          nextColIndex = columnIdShowList.length - 1
          break
        case 'pageUp': {
          nextRowIndex = Math.max(0, rowIndex - 20)
          break
        }
        case 'pageDown': {
          const list = nextRegion === 'thead' ? headerRowList : rowIdShowList
          nextRowIndex = Math.min(list.length - 1, rowIndex + 20)
          break
        }
      }

      const targetRowList = nextRegion === 'thead' ? headerRowList : rowIdShowList
      if (nextRowIndex < 0 || nextRowIndex >= targetRowList.length) return
      if (nextColIndex < 0 || nextColIndex >= columnIdShowList.length) return

      const nextRowId = targetRowList[nextRowIndex]
      const nextColId = columnIdShowList[nextColIndex]
      const nextPos: FocusPosition = {
        rowId: nextRowId,
        columnId: nextColId,
        cellId: getCellId({ rowId: nextRowId, columnId: nextColId }),
        region: nextRegion,
      }

      store.setter(focusPositionAtom, nextPos)
      onFocusChange?.(nextPos)

      // 滚动到焦点位置（虚拟滚动时 cell 可能不在 DOM 中，延迟重试一次）
      if (scrollToFocus) {
        const tryScroll = () => {
          const cellEl = document.getElementById(getCellDomId(nextPos.cellId))
          cellEl?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
        }
        tryScroll()
        requestAnimationFrame(tryScroll)
      }
    },
    [store, rowIdShowList, columnIdShowList, headerRowList, onFocusChange, scrollToFocus],
  )

  // 键盘事件处理
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enableKeyboard) return

      const focus = store.getter(focusPositionAtom)

      // 自定义处理器优先
      if (keyboardHandler) {
        const action = keyboardHandler(e.nativeEvent, focus)
        if (action) {
          e.preventDefault()
          if (action.type === 'navigate') {
            navigate(action.direction)
          }
          return
        }
      }

      const { key, shiftKey, ctrlKey, metaKey } = e
      const mod = ctrlKey || metaKey

      switch (key) {
        case 'ArrowUp':
          e.preventDefault()
          if (shiftKey) {
            // 扩展选区：设置锚点
            if (!store.getter(selectionAnchorAtom) && focus) {
              store.setter(selectionAnchorAtom, focus)
            }
          }
          navigate('up')
          break
        case 'ArrowDown':
          e.preventDefault()
          if (shiftKey && !store.getter(selectionAnchorAtom) && focus) {
            store.setter(selectionAnchorAtom, focus)
          }
          navigate('down')
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (shiftKey && !store.getter(selectionAnchorAtom) && focus) {
            store.setter(selectionAnchorAtom, focus)
          }
          navigate('left')
          break
        case 'ArrowRight':
          e.preventDefault()
          if (shiftKey && !store.getter(selectionAnchorAtom) && focus) {
            store.setter(selectionAnchorAtom, focus)
          }
          navigate('right')
          break
        case 'Home':
          e.preventDefault()
          navigate(mod ? 'ctrlHome' : 'home')
          break
        case 'End':
          e.preventDefault()
          navigate(mod ? 'ctrlEnd' : 'end')
          break
        case 'PageUp':
          e.preventDefault()
          navigate('pageUp')
          break
        case 'PageDown':
          e.preventDefault()
          navigate('pageDown')
          break
        case 'Escape':
          store.setter(focusPositionAtom, null)
          store.setter(selectionAnchorAtom, null)
          onFocusChange?.(null)
          break
        case 'Tab':
          // Tab 导航不 preventDefault，允许自然 tab 行为
          break
        default:
          // 不处理的按键直接返回，不 preventDefault
          return
      }

      // 非 Shift 时清除选区锚点
      if (!shiftKey && key.startsWith('Arrow')) {
        store.setter(selectionAnchorAtom, null)
      }
    },
    [enableKeyboard, store, keyboardHandler, navigate, onFocusChange],
  )

  // 注入 onKeyDown — 通过 DOM 事件监听，仅当表格容器或其子元素拥有焦点时处理
  useEffect(() => {
    if (!enableKeyboard) return

    const handler = (e: KeyboardEvent) => {
      // 仅当焦点在 grid-table 容器内时处理，避免多表格互相干扰
      const active = document.activeElement
      if (!active || !active.closest('[data-grid-table]')) return

      onKeyDown(e as unknown as React.KeyboardEvent)
    }

    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [enableKeyboard, onKeyDown])

  // 清理焦点在组件卸载时
  useEffect(() => {
    return () => {
      store.setter(focusPositionAtom, null)
      store.setter(selectionAnchorAtom, null)
    }
  }, [store])

  return { navigate }
}
