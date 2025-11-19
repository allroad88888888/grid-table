import { useCallback, useEffect } from 'react'
import { atom, useAtomValue, useSetAtom, useStore } from '@einfach/react'
import {
  ColumnId,
  columnIdShowListAtom,
  columnSizeMapAtom,
  rowIdShowListAtom,
  rowSizeMapAtom,
  useBasic,
} from '@grid-table/basic'
import type { ColumnType } from '../../types'
import { distributeByFlexGrow } from './utils'
import { initColumnsSizeByColumnsAtom } from './state'
import { getColumnId } from '../../utils/getColumnId'

export interface UseSizeByColumnProps {
  /**
   * 列最小宽度
   * @default 25
   */
  columnMinWidth?: number
  rowHeight: number
  rowCount: number
  wrapWidth: number
  columns: ColumnType[]
  /**
   * 基于当前列宽进行缩小
   * @default false
   */
  shrinkFromCurrent?: boolean
  /**
   * 基于当前列宽进行放大
   * @default true
   */
  expandFromCurrent?: boolean
}

const initSizeAtom = atom<Map<ColumnId, number> | undefined>(undefined)
const prevWrapperWidthAtom = atom<number | undefined>(undefined)

const proportionalResizeColumnAtom = atom(
  false,
  (
    getter,
    setter,
    props: {
      wrapWidth: number
      columns: ColumnType[]
      shrinkFromCurrent?: boolean
      expandFromCurrent?: boolean
    },
  ) => {
    const { wrapWidth, columns, shrinkFromCurrent = false, expandFromCurrent = true } = props
    const prevColumns = getter(columnSizeMapAtom)
    const remainingLength = wrapWidth - 2

    const columnShowIdList = getter(columnIdShowListAtom)
    const currentTotalWidth = columnShowIdList.reduce<number>((prev, tId) => {
      return prev + prevColumns.get(tId)!
    }, 0)

    // 记录初始值
    const initSizeMap = getter(initSizeAtom) || prevColumns
    if (!getter(initSizeAtom)) {
      setter(initSizeAtom, new Map(prevColumns))
    }

    const prevWrapperWidth = getter(prevWrapperWidthAtom) || remainingLength
    if (getter(prevWrapperWidthAtom) !== remainingLength) {
      setter(prevWrapperWidthAtom, remainingLength)
    }

    // 等比缩放
    function scaleProportionally(widthList: number[]) {
      // 创建 columnId 到列配置的映射
      const columnIdToColumnMap = new Map<string, ColumnType>()
      columns.forEach((column) => {
        const columnId = getColumnId(column)
        columnIdToColumnMap.set(columnId, column)
      })

      // 获取各列的 flexGrow 值
      const flexGrowList = columnShowIdList.map((tId) => {
        const column = columnIdToColumnMap.get(tId)
        return column?.flexGrow ?? 1 // 默认为 1
      })

      // 使用基于 flexGrow 的分配函数
      const newWidthList = distributeByFlexGrow(widthList, flexGrowList, remainingLength)
      // console.log('计算前列宽', widthList)
      // console.log('计算后列宽', newWidthList)
      // 更新列宽映射，确保宽度为正整数
      const next = new Map(prevColumns)
      columnShowIdList.forEach((tId, index) => {
        next.set(tId, Math.max(1, Math.round(newWidthList[index])))
      })

      setter(columnSizeMapAtom, next)
    }
    //  初始话宽度
    const initWidths = columnShowIdList.map((tId) => {
      return initSizeMap.get(tId)!
    })
    // 获取当前列宽数组
    const currentWidths = columnShowIdList.map((tId) => {
      return prevColumns.get(tId)!
    })

    // 当上次容器宽度 大于当前容器宽度，根据 initSizeMap 进行等比缩放
    if (prevWrapperWidth > remainingLength) {
      scaleProportionally(shrinkFromCurrent === false ? initWidths : currentWidths)
      return
    }

    // 当容器宽度 大于列总宽，根据当前列进行放大
    if (currentTotalWidth < remainingLength) {
      scaleProportionally(expandFromCurrent === false ? initWidths : currentWidths)
      return
    }
  },
)

export function useCellSizeByColumn(props: UseSizeByColumnProps) {
  const { rowHeight, columnMinWidth = 25, wrapWidth, columns } = props
  const { columnIdShowListAtom } = useBasic()
  const store = useStore()
  const initColumnsSizeByColumns = useSetAtom(initColumnsSizeByColumnsAtom)

  const proportionalResizeColumn = useSetAtom(proportionalResizeColumnAtom)

  /**
   * 监听columns变动
   */
  useEffect(() => {
    initColumnsSizeByColumns(columns, { columnMinWidth, wrapWidth: wrapWidth })
  }, [columns, columnMinWidth, initColumnsSizeByColumns])

  /**
   * 监听 容器宽度
   */
  useEffect(() => {
    if (wrapWidth <= 0) {
      return
    }
    proportionalResizeColumn({
      wrapWidth,
      columns,
      shrinkFromCurrent: props.shrinkFromCurrent,
      expandFromCurrent: props.expandFromCurrent,
    })
  }, [
    columnIdShowListAtom,
    columnMinWidth,
    columnSizeMapAtom,
    store,
    wrapWidth,
    columns,
    props.shrinkFromCurrent,
    props.expandFromCurrent,
  ])

  const columnIdShowList = useAtomValue(columnIdShowListAtom, { store })

  const columnSizeMap = useAtomValue(columnSizeMapAtom, { store })
  const calcColumnSizeByIndex = useCallback(
    (index: number) => {
      const columnId = columnIdShowList[index]
      return columnSizeMap.has(columnId) ? columnSizeMap.get(columnId)! : columnMinWidth
    },
    [columnIdShowList, columnMinWidth, columnSizeMap],
  )

  const rowSizeMap = useAtomValue(rowSizeMapAtom, { store })
  const rowIdShowList = useAtomValue(rowIdShowListAtom, { store })

  const calcRowSizeByIndex = useCallback(
    (index: number) => {
      const rowId = rowIdShowList[index]
      return rowSizeMap.get(rowId)!
    },
    [rowIdShowList, rowSizeMap],
  )

  const calcHeadRowSizeByIndex = useCallback(() => {
    return rowHeight
  }, [rowHeight])

  return {
    calcColumnSizeByIndex,
    calcRowSizeByIndex,
    calcHeadRowSizeByIndex,
  }
}
