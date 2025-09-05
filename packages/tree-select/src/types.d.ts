// 类型声明文件，解决构建时的类型问题
declare module '@grid-table/core' {
  export const VGridList: any
  export type VGridListRef = any
}

declare module '@grid-tree/core' {
  const GridTree: any
  export default GridTree
  export type GridTreeProps = any
  export type GridTreeRef = any
}
