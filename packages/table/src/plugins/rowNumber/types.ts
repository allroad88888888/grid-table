export type UseRowNumberProps = {
  /**
   * 是否启用序号列
   * @default false
   */
  enabled?: boolean

  /**
   * 序号列宽度
   * @default 80
   */
  width?: number

  /**
   * 序号列标题
   * @default "#"
   */
  title?: string

  /**
   * 序号起始值
   * @default 1
   */
  startIndex?: number
}

export type RowNumberColumnConfig = {
  width: number
  title: string
  startIndex: number
}
