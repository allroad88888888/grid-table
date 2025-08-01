import type { DataConfig } from '@grid-table/pivot'
import { Pivot } from '@grid-table/pivot/src'

// 示例数据
const baseData = [
  {
    region: '华东',
    city: '上海',
    quarter: 'Q1',
    sales: 15000,
    profit: 3000,
    orders: 120,
  },
  {
    region: '华东',
    city: '上海',
    quarter: 'Q2',
    sales: 18000,
    profit: 3600,
    orders: 150,
  },
  {
    region: '华东',
    city: '杭州',
    quarter: 'Q1',
    sales: 12000,
    profit: 2400,
    orders: 100,
  },
  {
    region: '华东',
    city: '杭州',
    quarter: 'Q2',
    sales: 14000,
    profit: 2800,
    orders: 120,
  },
  {
    region: '华北',
    city: '北京',
    quarter: 'Q1',
    sales: 20000,
    profit: 4000,
    orders: 180,
  },
  {
    region: '华北',
    city: '北京',
    quarter: 'Q2',
    sales: 22000,
    profit: 4400,
    orders: 200,
  },
  {
    region: '华北',
    city: '天津',
    quarter: 'Q1',
    sales: 8000,
    profit: 1600,
    orders: 80,
  },
  {
    region: '华北',
    city: '天津',
    quarter: 'Q2',
    sales: 9000,
    profit: 1800,
    orders: 90,
  },
]

// 基础配置
const baseMeta = [
  { field: 'region', name: '地区' },
  { field: 'city', name: '城市' },
  { field: 'quarter', name: '季度' },
  { field: 'sales', name: '销售额' },
  { field: 'profit', name: '利润' },
  { field: 'orders', name: '订单数' },
]

// valueInCols: true 的配置（值字段在列中显示）
const dataConfigHorizontal: DataConfig = {
  fields: {
    rows: ['region', 'city'],
    columns: ['quarter'],
    values: ['sales', 'profit', 'orders'],
    valueInCols: true, // 值字段水平显示
  },
  meta: baseMeta,
  data: baseData,
}

// valueInCols: false 的配置（值字段在行中显示）
const dataConfigVertical: DataConfig = {
  fields: {
    rows: ['region', 'city'],
    columns: ['quarter'],
    values: ['sales', 'profit', 'orders'],
    valueInCols: false, // 值字段垂直显示
  },
  meta: baseMeta,
  data: baseData,
}

export function ValueInColsDemo() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>ValueInCols 属性效果演示</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        本页面展示透视表中 <code>valueInCols</code> 属性的不同效果：
        <br />• <strong>valueInCols: true</strong> - 值字段在列中显示（水平布局，更宽）
        <br />• <strong>valueInCols: false</strong> - 值字段在行中显示（垂直布局，更窄）
      </p>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* valueInCols: true */}
        <div style={{ flex: '1', minWidth: '600px' }}>
          <h2 style={{ marginBottom: '10px', color: '#2c3e50' }}>
            💡 valueInCols: true（水平布局）
          </h2>
          <p style={{ marginBottom: '15px', color: '#7f8c8d', fontSize: '14px' }}>
            值字段（销售额、利润、订单数）在列中展开，适合打印或宽屏显示
          </p>
          <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
            <Pivot dataConfig={dataConfigHorizontal} />
          </div>
        </div>

        {/* valueInCols: false */}
        <div style={{ flex: '1', minWidth: '400px' }}>
          <h2 style={{ marginBottom: '10px', color: '#2c3e50' }}>
            📱 valueInCols: false（垂直布局）
          </h2>
          <p style={{ marginBottom: '15px', color: '#7f8c8d', fontSize: '14px' }}>
            值字段（销售额、利润、订单数）在行中展开，更适合窄屏或移动端显示
          </p>
          <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
            <Pivot dataConfig={dataConfigVertical} />
          </div>
        </div>
      </div>
    </div>
  )
}
