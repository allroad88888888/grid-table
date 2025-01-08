import { atom } from 'einfach-state'
import type { ExcelInitProps } from './type'
import { createEmptyExcel } from '../init/createEmptyExcel'
import { columnListAtom, dataListAtom } from './coreState'

export const initExcelAtom = atom(undefined, (getter, setter, props: ExcelInitProps) => {
  const { columns, dataList } = createEmptyExcel(props)

  setter(columnListAtom, columns)
  setter(dataListAtom, dataList)
})
