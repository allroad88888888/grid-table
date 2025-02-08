import { atom } from '@einfach/state'
import type { GridTreeItemOptions, Id } from '../types'

export function DemoItemComponent({ id }: { id: Id }) {
  return <>{id}</>
}

export const viewOptionAtom = atom<Omit<Required<GridTreeItemOptions>, 'size'>>({
  levelSize: 24,
  itemTag: 'li',
  ContentComponent: DemoItemComponent,
  itemClassName: '',
})
