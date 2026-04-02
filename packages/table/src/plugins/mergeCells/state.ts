import { atom } from '@einfach/react'
import type { CSSProperties } from 'react'
import type { CellId } from '@grid-table/basic'

/**
 * 所有合并 cell 的样式 Map
 * useMergeCells 计算后一次性 set，useCell 通过 getter 读取
 * 替代旧的逐 cell store.setter(getCellStateAtomById) 模式
 */
export const mergeCellStyleMapAtom = atom(new Map<CellId, CSSProperties>())
