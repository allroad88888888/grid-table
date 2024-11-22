export type SimpleDataItem = string | number

/** mini 图类型 */
export enum MiniChartTypes {
  Line = 'line',
  Bar = 'bar',
  Bullet = 'bullet',
}

export interface BaseChartData {
  type: MiniChartTypes
  data: Data[]
  encode?: {
    x: keyof Data
    y: keyof Data
  }
}

export interface BulletValue {
  type: MiniChartTypes.Bullet
  measure: number | string
  target: number | string
  [key: string]: unknown
}

export type MiniChartData = BaseChartData | BulletValue

/** use for gridAnalysisSheet
 *  eg. { label: '余额女',
 values: [
 ['最近7天登端天数', 1, 3423423, 323],
 ['自然月新登用户数', 1, 3423423, 323],
 ['最近7天登端天数', 1, 3423423, 323],
 ['自然月新登用户数', 1, 3423423, 323],
 ],
 }
 */
export interface MultiData<T = SimpleDataItem[][] | MiniChartData> {
  values: T
  originalValues?: T
  label?: string
  [key: string]: unknown
}

export type DataItem = SimpleDataItem | MultiData

export type Data = Record<string, DataItem>
