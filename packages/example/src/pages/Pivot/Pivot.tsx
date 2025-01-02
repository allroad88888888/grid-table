import type { DataConfig } from '@grid-table/pivot'
import { Pivot } from '@grid-table/pivot/src'
import xx from './xx.mock'
import type { Theme } from '@grid-table/pivot/src/theme/types'
// import '@grid-table/pivot/esm/index.css'

const theme: Theme = {
  headerCell: {
    backgroundColor: '#3447A0',
    color: 'white',
    textAlign: 'center',
  },
}

export function PivotDemo() {
  return (
    <div>
      <Pivot
        dataConfig={xx as unknown as DataConfig}
        style={{
          width: 1000,
          height: 600,
        }}
        theme={theme}
      />
    </div>
  )
}
