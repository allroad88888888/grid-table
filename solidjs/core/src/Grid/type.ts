import type { Component, JSX } from 'solid-js'
import type { UseVScrollProps } from '../Basic/type'

export interface ListProps extends UseVScrollProps {
    style?: JSX.CSSProperties
    className?: string
    children: Component<{ index: number; style: JSX.CSSProperties; isPending?: boolean }>
    /**
     * @default div
     */
    tag?: 'div' | 'ul'
}

export interface RenderCellsProps {
    rowIndexList: number[]
    columnIndexList: number[]
    getCellStyleByIndex: (rowIndex: number, columnIndex: number) => Record<string, any>
}

export interface VGridTableProps {
    style?: JSX.CSSProperties
    className?: string
    children?: JSX.Element
    theadChildren?: JSX.Element
    tbodyChildren?: JSX.Element

    rowCalcSize: (index: number) => number
    rowCount: number
    rowBaseSize?: number
    overRowCount?: number
    rowStayIndexList?: number[]

    columnCalcSize: (index: number) => number
    columnCount: number
    columnBaseSize?: number
    overColumnCount?: number
    columnStayIndexList?: number[]
    renderTbodyCell: (props: RenderCellsProps) => JSX.Element
    tbodyHasRow?: boolean

    theadRowCount?: number
    renderTheadCell: (props: RenderCellsProps) => JSX.Element
    theadRowCalcSize: (index: number) => number
    theadBaseSize?: number
    theadClassName?: string
    theadHasRow?: boolean

    onResize?: (size: { width: number; height: number }) => void

    loading?: boolean
    emptyComponent?: Component
    loadingComponent?: Component
} 