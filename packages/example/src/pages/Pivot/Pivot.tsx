import { Pivot } from '@grid-table/pivot/src'
import { mockDataConfig } from './mock'

export function PivotDemo() {
  return (
    <div>
      <Pivot dataConfig={mockDataConfig} />
    </div>
  )
}
