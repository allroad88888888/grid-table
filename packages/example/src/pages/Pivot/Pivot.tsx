import type { DataConfig } from '@grid-table/pivot'
import { Pivot } from '@grid-table/pivot/src'
import { doubleData } from './double.mock'

// import data1 from './xx.mock'
// import data2 from './single-population-proportion.mock'
// import { mockDataConfig as data3 } from './mock'
// import { treeData } from './tree.mock'
// import type { Theme } from '@grid-table/pivot/src/theme/types'
// import '@grid-table/pivot/esm/index.css'

const theme = {
  rowCell: {
    border: '1px solid red',
  },
  colCell: {
    border: '1px solid #f00',
  },
  cornerCell: {
    border: '1px dotted #800',
    color: 'red',
  },
  dataCell: {
    border: '1px dotted #a987eb',
    borderLeft: '1px solid #dadada',
  },
}

export function PivotDemo() {
  return (
    <div style={{ margin: 100 }}>
      <Pivot
        dataConfig={doubleData as unknown as DataConfig}
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
