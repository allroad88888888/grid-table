import { createStore, useAtomValue, useSetAtom } from 'einfach-state'
import { Provider, TableWithNoProvider } from '@grid-table/view/src'
import { useEffect, useState } from 'react'
import type { PivotProps } from './type'
import { columnListAtom, dataListAtom, headerDataListAtom, initAtom } from './state'

export function Pivot(props: PivotProps) {
  const { dataConfig } = props

  const dataList = useAtomValue(dataListAtom)
  const columns = useAtomValue(columnListAtom)
  const headerDataList = useAtomValue(headerDataListAtom)

  const init = useSetAtom(initAtom)

  useEffect(() => {
    init({
      dataConfig: props.dataConfig,
    })
  }, [init, props.dataConfig])

  if (columns.length === 0) {
    return <div>loading</div>
  }

  return (
    <TableWithNoProvider
      overRowCount={22}
      dataSource={dataList}
      headerDataSource={headerDataList}
      columns={columns}
      rowHeight={36}
      bordered={false}
    />
  )
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
