import { atom } from '@einfach/react'
import type { SummaryRowConfig } from './types'

export const summaryConfigAtom = atom<SummaryRowConfig[]>([])
export const SUMMARY_ROW_PREFIX = '__summary_'
