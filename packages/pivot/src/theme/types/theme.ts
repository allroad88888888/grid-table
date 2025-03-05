import type { BodyCellTheme } from './body'
import type { HeaderCellTheme } from './header'

export interface Theme {
  cornerCell?: HeaderCellTheme
  dataCell?: BodyCellTheme
  colCell?: HeaderCellTheme
  rowCell?: HeaderCellTheme
}
