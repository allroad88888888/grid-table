import { useState } from 'react'
import {Table} from '@grid-table/view'
import type { ColumnType } from '@grid-table/view'
import './TabDemo.css'

type UserRow = {
  id: number
  name: string
  age: number
  city: string
  job: string
}

type OrderRow = {
  id: number
  product: string
  amount: number
  status: string
  date: string
}

const table1Columns: ColumnType[] = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { title: '姓名', dataIndex: 'name', width: 100 },
  { title: '年龄', dataIndex: 'age', width: 80 },
  { title: '城市', dataIndex: 'city', width: 120 },
  { title: '职位', dataIndex: 'job', width: 150 },
]

const table1Data: UserRow[] = [
  { id: 1, name: '张三', age: 28, city: '北京', job: '前端工程师' },
  { id: 2, name: '李四', age: 32, city: '上海', job: '后端工程师' },
  { id: 3, name: '王五', age: 25, city: '广州', job: 'UI设计师' },
  { id: 4, name: '赵六', age: 30, city: '深圳', job: '产品经理' },
  { id: 5, name: '孙七', age: 27, city: '杭州', job: '数据分析师' },
  { id: 6, name: '周八', age: 35, city: '成都', job: '架构师' },
  { id: 7, name: '吴九', age: 29, city: '武汉', job: '测试工程师' },
  { id: 8, name: '郑十', age: 31, city: '西安', job: '运维工程师' },
]

const table2Columns: ColumnType[] = [
  { title: '订单ID', dataIndex: 'id', width: 80 },
  { title: '商品', dataIndex: 'product', width: 150 },
  { title: '金额(元)', dataIndex: 'amount', width: 100 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '日期', dataIndex: 'date', width: 130 },
]

const table2Data: OrderRow[] = [
  { id: 1001, product: '笔记本电脑', amount: 6999, status: '已完成', date: '2024-01-15' },
  { id: 1002, product: '无线鼠标', amount: 129, status: '已发货', date: '2024-01-16' },
  { id: 1003, product: '机械键盘', amount: 499, status: '待付款', date: '2024-01-17' },
  { id: 1004, product: '显示器', amount: 2399, status: '已完成', date: '2024-01-18' },
  { id: 1005, product: '耳机', amount: 799, status: '已取消', date: '2024-01-19' },
  { id: 1006, product: 'USB Hub', amount: 89, status: '已完成', date: '2024-01-20' },
  { id: 1007, product: '摄像头', amount: 399, status: '已发货', date: '2024-01-21' },
  { id: 1008, product: '音箱', amount: 299, status: '待发货', date: '2024-01-22' },
]

type TabKey = 'table1' | 'table2'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'table1', label: '用户列表' },
  { key: 'table2', label: '订单列表' },
]

export function TabDemo() {
  const [activeTab, setActiveTab] = useState<TabKey>('table1')

  return (
    <div className="tab-demo">
      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-item ${activeTab === tab.key ? 'tab-item--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <div style={{ display: activeTab === 'table1' ? 'block' : 'none' }}>
          用户列表
          <Table
            style={{ width: '100%', height: 400 }}
            columns={table1Columns}
            dataSource={table1Data}
            enableColumnResize={true}
            
          />
        </div>

        <div style={{ display: activeTab === 'table2' ? 'block' : 'none' }}>
          订单
          <Table
            style={{ width: '100%', height: 400 }}
            columns={table2Columns}
            dataSource={table2Data}
            enableColumnResize={true}
          />
        </div>
      </div>
    </div>
  )
}

export default TabDemo
