import { Pivot } from '@grid-table/pivot'
import { mockDataConfig } from './mock'

import xx from './single-population-proportion.mock'

export function PivotDemo() {
  return (
    <div>
      <Pivot dataConfig={mockDataConfig} />
      {/* @ts-ignore */}
      <Pivot dataConfig={xx} />
    </div>
  )
}
