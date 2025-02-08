import { Table } from '@grid-table/view/src'
import type { UseRowSelectionProps } from '@grid-table/view/src/plugins/select'
import { atom, useAtomValue } from '@einfach/state'
import { DataList } from './mock'
import { useColumnConfig } from './useColumnConfig'
import './Table.css'

const rowSelection: UseRowSelectionProps = {
  width: 42,
  fixed: 'left',
  align: 'center',
}

async function sleep(time = 300) {
  return new Promise((rev) => {
    setTimeout(() => {
      rev(true)
    }, time)
  })
}

const refreshAtom = atom(0, (getter, setter, temp: number) => {
  const prev = getter(refreshAtom)
  setter(refreshAtom, prev + 1)
})

const dataAtom = atom(async (getter) => {
  getter(refreshAtom)
  await sleep()

  return DataList
})

export function AntdTableDemo() {
  const dataList = useAtomValue(dataAtom)

  const { columns } = useColumnConfig()

  return (
    <Table
      style={{
        width: '100%',
        height: '600px',
      }}
      enableCopy={true}
      columns={columns}
      dataSource={dataList}
      rowSelection={rowSelection}
    />
  )
}

export default AntdTableDemo
