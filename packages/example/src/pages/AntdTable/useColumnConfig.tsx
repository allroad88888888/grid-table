import type { ColumnType } from '@grid-table/view'

import { useInit } from '@einfach/utils'
import { ColumnIndex } from './columns/columnIndex'
import { ColumnString } from './columns/columnString'
import { ColumnTrigger } from './columns/columnTriggerType'
import { ColumnToolbar } from './columns/columnToolbar'
import { ColumnTime } from './columns/columnTime'
import { ColumnRunStatus } from './columns/columnRunStatus'
import { ColumnDuration } from './columns/columnDuration'

export function useColumnConfig() {
  const columns = useInit(() => {
    return [
      {
        title: `序号`,
        width: 90,
        align: 'center',
        renderComponent: ColumnIndex,
      },
      {
        width: 170,
        title: `运行实例ID`,
        dataIndex: 'runId',
        renderComponent: ColumnString,
        fixed: 'left',
      },
      {
        width: 85,
        title: `触发类型`,
        dataIndex: 'triggerType',
        renderComponent: ColumnTrigger,
      },
      {
        width: 70,
        title: `发起人`,
        dataIndex: 'initiator.nickName',
      },
      {
        width: 85,
        title: `运行状态`,
        dataIndex: 'status',
        renderComponent: ColumnRunStatus,
      },
      {
        width: 85,
        title: `用时`,
        dataIndex: 'start_time',
        renderComponent: ColumnDuration,
      },
      {
        title: `开始时间`,
        width: 150,
        dataIndex: 'start_time',
        renderComponent: ColumnTime,
      },
      {
        width: 250,
        title: `结束时间`,
        dataIndex: 'end_time',
        renderComponent: ColumnTime,
      },
      {
        width: 305,
        title: `操作`,
        renderComponent: ColumnToolbar,
      },
    ] as ColumnType[]
  })

  return { columns }
}
