import { Excel } from '@grid-table/excel'

import '@grid-table/view/esm/index.css'
export function ExcelDemo() {
  return (
    <Excel
      style={{
        width: 1000,
        height: 400,
      }}
    />
  )
}
