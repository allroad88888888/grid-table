import type { DataConfig } from '@grid-table/pivot'
import { Pivot } from '@grid-table/pivot/src'
import { doubleData } from './double.mock'

// const theme = {
//   rowCell: {
//     border: '1px solid red',
//   },
//   colCell: {
//     border: '1px solid #f00',
//   },
//   cornerCell: {
//     border: '1px dotted #800',
//     color: 'red',
//   },
//   dataCell: {
//     border: '1px dotted #a987eb',
//     borderLeft: '1px solid #dadada',
//   },
// }
const theme = {
  cornerCell: {
    fontSize: 'var(--ux-font-size-base, 12px)',
    borderType: 'border',
    borderStyle: 'solid',
    borderWidth: '1px',
    backgroundColor: '#8666E1',
    color: '#FFFFFF',
    fontWeight: 'bold',
    borderColor: '#d9d9d9',
  },
  colCell: {
    fontSize: 'var(--ux-font-size-base, 12px)',
    borderType: 'border',
    borderStyle: 'solid',
    borderWidth: '1px',
    backgroundColor: '#8666E1',
    color: '#FFFFFF',
    fontWeight: 'bold',
    borderColor: '#d9d9d9',
  },
  rowCell: {
    fontSize: 'var(--ux-font-size-base, 12px)',
    color: 'var(--ux-text-color, rgba(0, 0, 0, 0.65)',
    // borderType: 'border',
    // borderStyle: 'solid',
    // borderWidth: '1px',
    // backgroundColor: 'var(--ux-primary-1,#eeefff)',
    // borderColor: 'var(--ux-primary-color,#555FFF)',
    border: '1px dotted #8666E1',
    borderLeft: '1px solid #d9d9d9',
  },
  dataCell: {
    fontSize: '12px',
    color: 'rgba(0, 0, 0, 0.65)',
    border: '1px dotted #8666E1',
    borderLeft: '1px solid #d9d9d9',
  },
}
export function PivotDemo() {
  return (
    <div style={{ margin: 100 }}>
      <Pivot
        dataConfig={doubleData as unknown as DataConfig}
        style={{
          width: 1000,
          height: 300,
        }}
        theme={theme}
        rowHeight={20}
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
