import { useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from '@einfach/react'
import type { DataItem, UseDataProps } from '../types'
import { useData } from './useData'
import { RowId, useBasic } from '@grid-table/basic'
import { useExpand } from '../tree'
import './useDataInit.css'
import { dataInitAtom } from '../state'
import { columnInitAtom } from '../stateColumn'
import { headerDataInitAtom } from '../stateHeader'
import { getColumnId } from '../utils/getColumnId'

export function useDataInit<ItemInfo extends DataItem>(props: UseDataProps<ItemInfo>) {
  const { dataSource, columns } = props
  const { rowSizeMapAtom } = useBasic()
  const { loadingAtom } = useData()
  const loading = useAtomValue(loadingAtom)

  const initData = useSetAtom(dataInitAtom)
  const initColumns = useSetAtom(columnInitAtom)
  const initHeaderData = useSetAtom(headerDataInitAtom)

  /**
   * 列配置项处理
   */
  useEffect(() => {
    initColumns(columns)
  }, [columns, initColumns])

  /**
   * 数据处理
   */
  useEffect(() => {
    if (props.loading) {
      return
    }
    initData({
      dataSource,
      idProp: props.idProp as string,
      parentProp: props.parentProp,
      relation: props.relation,
      root: props.root,
      rowHeight: props.rowHeight,
    })
  }, [
    dataSource,
    initData,
    props.idProp,
    props.parentProp,
    props.relation,
    props.root,
    props.rowHeight,
    props.loading,
    rowSizeMapAtom,
  ])

  useEffect(() => {
    initHeaderData(props.headerDataSource, { size: props.rowHeight! })
  }, [initHeaderData, props.headerDataSource, props.rowHeight])
  useExpand()

  /** 固定列功能 */
  const { stickyList } = useMemo(() => {
    const leftFixedColList: RowId[] = []
    const rightFixedColList: RowId[] = []

    columns.forEach((column, index) => {
      const columnId = getColumnId(column)
      if (column.fixed === 'left') {
        leftFixedColList.push(columnId)
      }
      if (column.fixed === 'right') {
        rightFixedColList.push(columnId)
      }
    })
    return {
      columnCount: columns.length,
      stickyList: {
        topIdList: leftFixedColList,
        bottomIdList: rightFixedColList,
      },
    }
  }, [columns])

  return {
    loading,
    stickyList,
  }
}
