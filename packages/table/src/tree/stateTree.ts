import { atom } from '@einfach/react'

import { type RowId } from '@grid-table/basic'
import { ROOT } from '../utils/const'

export const relationAtom = atom(new Map<RowId, RowId[]>())

/**
 * 用来计算节点是否有子级
 */
export const parentNodeSetAtom = atom((getter) => {
  return new Set(getter(relationAtom).keys())
})

/**
 * 存储节点level信息
 */
export const nodeLevelAtom = atom<Map<RowId, number>>(new Map())

/**
 * 根节点信息
 */
export const rootAtom = atom<string>(ROOT)
