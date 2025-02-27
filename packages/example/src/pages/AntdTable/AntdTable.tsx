import { rowSizeMapAtom, Table } from '@grid-table/view'
import type { UseRowSelectionProps } from '@grid-table/view/src/plugins/select'
import { atom, useAtomValue, createStore } from '@einfach/state'
import { DataList } from './mock'
import { useColumnConfig } from './useColumnConfig'
import './Table.css'
import { useEffect } from 'react'

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

const store = createStore()

export function AntdTableDemo() {
  const dataList = useAtomValue(dataAtom)

  const { columns } = useColumnConfig()

  useEffect(() => {
    store.setter(rowSizeMapAtom, (prev) => {
      const next = new Map(prev)
      next.set('2', 72)
      return next
    })
  }, [])

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
      store={store}
      rowBaseSize={36}
    />
  )
}

export default AntdTableDemo
