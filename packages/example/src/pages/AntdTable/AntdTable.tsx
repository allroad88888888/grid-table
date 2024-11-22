import AntdTable from '@grid-table/view/src/AntdTable'
import type { UseRowSelectionProps } from '@grid-table/view/src/plugins/select'
import { atom, useSetAtom, useAtomValue } from 'einfach-state'
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
  const refresh = useSetAtom(refreshAtom)

  const dataList = useAtomValue(dataAtom)

  const { columns } = useColumnConfig()

  return (
    <div
      style={{
        width: '100%',
        height: '600px',
        // border: '1px solid blue',
      }}
    >
      <AntdTable
        enableCopy={true}
        columns={columns}
        dataSource={dataList}
        rowSelection={rowSelection}
      />
    </div>
  )
}

export default AntdTableDemo
