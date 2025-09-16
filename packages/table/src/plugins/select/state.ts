import { atom } from '@einfach/react'

import type { RowId } from '@grid-table/basic'

export const nodeSelectionSetAtom = atom<Set<RowId>>(new Set<RowId>())
