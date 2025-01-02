import type { BodyCellTheme } from './body'
import type { HeaderCellTheme } from './header'

export interface Theme {
  headerCell?: HeaderCellTheme
  bodyCell?: BodyCellTheme
}
