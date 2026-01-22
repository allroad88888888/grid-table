import type { ColumnType } from '@grid-table/view'
import { Table, tbodyMergeCellListAtom } from '@grid-table/view'
import { useMemo, useState } from 'react'
import { flattenData, RowIdKey } from './format'
import mockData, { orderArrayKeys, orderColumns, orderTableColumns } from './mock'
import mockRealData, {
  receivableArrayKeys,
  receivableColumns,
  receivableTableColumns,
} from './mock-real'
import './CollapseDemo.css'
import { createStore } from '@einfach/react'

type DataSourceType = 'order' | 'receivable'

export function CollapseDemo() {
  const [store] = useState(() => {
    return createStore()
  })
  const [dataSource, setDataSource] = useState<DataSourceType>('order')

  // 使用 flattenData 处理数据
  const {
    data,
    columns: allColumns,
    rawDataLength,
    maxExpandedRows,
  } = useMemo(() => {
    if (dataSource === 'order') {
      const res = flattenData(mockData.data, orderArrayKeys as any, {
        columns: orderColumns,
      })
      store.setter(tbodyMergeCellListAtom, res.bodyMergeCells)
      return { ...res, rawDataLength: mockData.data.length }
    } else {
      const res = flattenData(mockRealData, receivableArrayKeys as any, {
        columns: receivableColumns,
      })
      console.log(res)
      store.setter(tbodyMergeCellListAtom, res.bodyMergeCells)
      return { ...res, rawDataLength: mockRealData.length }
    }
  }, [dataSource, store])

  // 配置表格列
  const columns: ColumnType[] = useMemo(() => {
    if (dataSource === 'order') {
      return orderTableColumns(RowIdKey)
    } else {
      return receivableTableColumns(RowIdKey)
    }
  }, [dataSource])

  return (
    <div className="collapse-demo">
      <div className="collapse-demo-header">
        <h2>数据展开示例</h2>
        <div className="collapse-demo-controls">
          <button
            className={`data-source-btn ${dataSource === 'order' ? 'active' : ''}`}
            onClick={() => setDataSource('order')}
          >
            订单数据
          </button>
          <button
            className={`data-source-btn ${dataSource === 'receivable' ? 'active' : ''}`}
            onClick={() => setDataSource('receivable')}
          >
            应收数据
          </button>
        </div>
        <div className="collapse-demo-info">
          <div className="info-item">
            <span className="info-label">原始数据条数:</span>
            <span className="info-value">{rawDataLength}</span>
          </div>
          <div className="info-item">
            <span className="info-label">展开后数据条数:</span>
            <span className="info-value">{data.length}</span>
          </div>
          <div className="info-item">
            <span className="info-label">最大扩展行数:</span>
            <span className="info-value">{maxExpandedRows}</span>
          </div>
          <div className="info-item">
            <span className="info-label">总列数:</span>
            <span className="info-value">{allColumns.length}</span>
          </div>
        </div>
        <p className="collapse-demo-desc">
          {dataSource === 'order'
            ? '本示例展示了如何将嵌套的数组数据(订单行和发货明细)拍平为表格数据，每条订单根据订单行和发货明细的最大长度展开为多行。'
            : '本示例展示了如何将应收单的明细数据拍平为表格数据，每条应收单根据明细数量展开为多行。'}
        </p>
      </div>
      <div className="collapse-demo-table">
        <Table
          style={{
            width: '100%',
            height: '600px',
          }}
          idProp={RowIdKey}
          columns={columns}
          dataSource={data}
          enableCopy={true}
          enableHeadContextMenu={true}
          overRowCount={maxExpandedRows+20}
          store={store}
        />
      </div>
    </div>
  )
}

export default CollapseDemo
