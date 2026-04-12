import { atom } from '@einfach/react'
import type { CSSProperties } from 'react'
import type { CellId } from '@grid-table/basic'

export type MergeCellStyleItem = CSSProperties & { className?: string }

/**
 * tbody merge overlay 的样式 Map，key 为 merge anchor cellId
 * useMergeCells 计算后一次性 set，overlay DataCell 通过 getter 读取
 */
export const mergeCellStyleMapAtom = atom(new Map<CellId, MergeCellStyleItem>())

/**
 * 表头合并 cell 的样式 Map
 * useHeaderMergeCells 计算后一次性 set，useCellThead 通过 getter 读取
 */
export const mergeHeaderCellStyleMapAtom = atom(new Map<CellId, CSSProperties>())
