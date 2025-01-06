import { createStore, useAtomValue, useSetAtom } from 'einfach-state'
import { Provider, TableExcel } from '@grid-table/view'
import { useEffect, useState } from 'react'
import type { PivotProps } from './type'
import { columnListAtom, copyAtom, dataListAtom, headerDataListAtom, initAtom } from './state'
import { useTheme } from './theme/useTheme'
import '@grid-table/view/esm/index.css'

export function Pivot(props: PivotProps) {
  const dataList = useAtomValue(dataListAtom)
  const columns = useAtomValue(columnListAtom)
  const headerDataList = useAtomValue(headerDataListAtom)

  const init = useSetAtom(initAtom)

  const copy = useSetAtom(copyAtom)

  useEffect(() => {
    init({
      dataConfig: props.dataConfig,
    })
  }, [init, props.dataConfig])

  useTheme(props.theme)

  if (columns.length === 0) {
    return <div>loading</div>
  }

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
      copyGetDataByCellIds={copy}
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
