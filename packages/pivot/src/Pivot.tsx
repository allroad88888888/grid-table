import { createStore, useAtomValue, useSetAtom } from '@einfach/react'
import { Provider, TableExcel } from '@grid-table/view'
import { useEffect, useState } from 'react'
import type { PivotProps } from './type'
import { columnListAtom, dataListAtom, headerDataListAtom, initAtom } from './state'
import { useTheme } from './theme/useTheme'
import { useTree } from './tree/useTree'

function PivotData(props: PivotProps) {
  const dataList = useAtomValue(dataListAtom)
  const columns = useAtomValue(columnListAtom)
  const headerDataList = useAtomValue(headerDataListAtom)

  useTree({
    treeRow: props.dataConfig.treeRow,
    treeColumn: props.dataConfig.treeColumn,
  })

  return (
    <TableExcel
      overRowCount={22}
      dataSource={dataList}
      headerDataSource={headerDataList}
      columns={columns}
      rowHeight={36}
      bordered={true}
      className={props.className}
      style={props.style}
      enableSelectArea={true}
    />
  )
}

export function Pivot(props: PivotProps) {
  const columns = useAtomValue(columnListAtom)
  const init = useSetAtom(initAtom)

  useEffect(() => {
    init({
      dataConfig: props.dataConfig,
    })
  }, [init, props.dataConfig])

  useTheme(props.theme)

  if (columns.length === 0) {
    return <div>loading</div>
  }

  return <PivotData {...props} />
}

export default (props: PivotProps) => {
  const [store] = useState(() => {
    return createStore()
  })

  return (
    <Provider store={store}>
      <Pivot {...props} />
    </Provider>
  )
}
