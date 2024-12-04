import { atom } from 'einfach-state'
import type { GridTreeItemOptions } from '../types'
import { DemoItemComponent } from './TreeItem'

export const viewOptionAtom = atom<Omit<Required<GridTreeItemOptions>, 'size'>>({
  levelSize: 24,
  itemTag: 'li',
  Component: DemoItemComponent,
  itemClassName: '',
})
