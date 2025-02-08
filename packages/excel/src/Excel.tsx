import { createStore, useAtomValue, useSetAtom } from '@einfach/state'
import { Provider, TableExcel } from '@grid-table/view'
import { useEffect, useState } from 'react'
import { columnListAtom, dataListAtom } from './state/coreState'
import { initExcelAtom } from './state/initState'
import type { ExcelProps } from './type'

export function Excel(props: ExcelProps) {
  const dataList = useAtomValue(dataListAtom)
  const columns = useAtomValue(columnListAtom)

  const init = useSetAtom(initExcelAtom)

  useEffect(() => {
    init({
      rowCount: 1000,
      columnCount: 300,
    })
  }, [init])

  if (columns.length === 0) {
    return <div>loading</div>
  }

  return (
    <TableExcel
      overRowCount={5}
      overColumnCount={5}
      dataSource={dataList}
      columns={columns}
      rowHeight={20}
      bordered={true}
      className={props.className}
      style={props.style}
    />
  )
}

export default (props: ExcelProps) => {
  const [store] = useState(() => {
    return createStore()
  })

  return (
    <Provider store={store}>
      <Excel {...props} />
    </Provider>
  )
}
