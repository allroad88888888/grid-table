import type { CSSProperties } from 'react'
import type { DataConfig } from './format'
import type { Theme } from './theme/types'

export interface PivotProps {
  dataConfig: DataConfig
  style?: CSSProperties
  className?: string
  theme?: Theme
}
