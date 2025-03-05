import type { DataConfig } from '@grid-table/pivot'
import { Pivot } from '@grid-table/pivot/src'
// import data1 from './xx.mock'
// import data2 from './single-population-proportion.mock'
// import { mockDataConfig as data3 } from './mock'
import { treeData } from './tree.mock'
import type { Theme } from '@grid-table/pivot/src/theme/types'
// import '@grid-table/pivot/esm/index.css'

const theme: Theme = {
  colCell: {
    backgroundColor: '#800',
    color: 'white',
    textAlign: 'center',
  },
  cornerCell: {
    backgroundColor: '#f00',
  },
  rowCell: {
    backgroundColor: '#a987eb',
  },
  dataCell: {
    backgroundColor: '#00f',
  },
}

export function PivotDemo() {
  return (
    <div>
      <Pivot
        dataConfig={treeData as unknown as DataConfig}
        style={{
          width: 1000,
          height: 600,
        }}
        theme={theme}
      />
      {/* <Pivot
        dataConfig={data1 as unknown as DataConfig}
        style={{
          width: 1000,
          height: 600,
        }}
        theme={theme}
      /> */}
      {/* <Pivot
        dataConfig={data2 as unknown as DataConfig}
        style={{
          width: 1000,
          height: 600,
        }}
        theme={theme}
      />
      <Pivot
        dataConfig={data3 as unknown as DataConfig}
        style={{
          width: 1000,
          height: 600,
        }}
        theme={theme}
      /> */}
    </div>
  )
}
