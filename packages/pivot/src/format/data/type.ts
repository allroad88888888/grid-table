export type HeaderItem = {
  label: string
  columnName: string
  children?: HeaderRelation
}

export type HeaderRelation = Record<string, HeaderItem>
