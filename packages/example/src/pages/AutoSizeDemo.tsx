import { useState, useRef } from 'react'
import { Table } from '@grid-table/view/src'
import type { AntdTableRef, ColumnType } from '@grid-table/view/src'

// 创建测试数据，包含不同长度的内容
const mockData = [
  {
    id: '1',
    name: 'John',
    description:
      'This is a very long description that should cause overflow in the cell and demonstrate the auto sizing functionality',
    status: 'Active',
    email: 'john@example.com',
    phone: '123-456-7890',
    address: 'New York',
    company: 'TechCorp Inc.',
    role: 'Developer',
  },
  {
    id: '2',
    name: 'Jane Smith With Very Long Name That Exceeds Normal Width',
    description: 'Short desc',
    status: 'Inactive',
    email: 'jane.smith.with.very.long.email@example-company.com',
    phone: '098-765-4321',
    address: 'Los Angeles',
    company: 'Design Studio',
    role: 'Designer',
  },
  {
    id: '3',
    name: 'Bob',
    description:
      'Another extremely long description that contains a lot of text and should definitely overflow the cell width causing horizontal scrolling within the cell',
    status: 'Pending Review for Approval',
    email: 'bob@test.com',
    phone: '555-0123',
    address: 'Chicago, Illinois, United States of America',
    company: 'Mega Corporation International LLC',
    role: 'Senior Software Engineer',
  },
  {
    id: '4',
    name: 'Alice Johnson',
    description: 'Medium length description that fits nicely',
    status: 'Active',
    email: 'alice.johnson@company.org',
    phone: '777-888-9999',
    address: 'Seattle',
    company: 'StartupXYZ',
    role: 'Product Manager',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    description: 'Brief text',
    status: 'Active',
    email: 'charlie@short.co',
    phone: '111-222-3333',
    address: 'Austin',
    company: 'WebTech',
    role: 'QA Engineer',
  },
  {
    id: '6',
    name: 'David Wilson',
    description:
      'This description has a moderate length and should demonstrate how the auto-sizing algorithm handles medium-length content appropriately',
    status: 'On Leave',
    email: 'david.wilson@enterprise-solutions.com',
    phone: '444-555-6666',
    address: 'Denver, Colorado',
    company: 'Enterprise Solutions Group',
    role: 'Technical Lead',
  },
  {
    id: '7',
    name: 'Eva',
    description:
      'Another very very very very very very long description that definitely needs more space than the default column width can provide',
    status: 'Active',
    email: 'eva@example.com',
    phone: '999-888-7777',
    address: 'Miami',
    company: 'Innovation Labs',
    role: 'Research Scientist',
  },
  {
    id: '8',
    name: 'Frank Thompson',
    description: 'Regular description with normal length',
    status: 'Pending',
    email: 'frank.thompson@normal.com',
    phone: '333-444-5555',
    address: 'Portland',
    company: 'Standard Corp',
    role: 'Business Analyst',
  },
]

// 定义列配置
const columns: ColumnType[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 60,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 120,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 200,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 180,
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
    width: 120,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 100,
  },
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
    width: 150,
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    width: 120,
  },
]

export function AutoSizeDemo() {
  const tableRef = useRef<AntdTableRef>(null)
  const [adjustCount, setAdjustCount] = useState(0)

  // 触发自动调整列宽
  const handleAutoSize = () => {
    tableRef.current?.autoColumnsSize?.()
    setAdjustCount((prev) => prev + 1)
    console.log('自动调整列宽已执行')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>自动列宽调整演示</h1>

      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          background: '#f9f9f9',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}
      >
        <h3>功能说明</h3>
        <p>此演示展示了表格自动列宽调整功能：</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>根据单元格内容自动计算最佳列宽</li>
          <li>检测文本溢出情况（scrollWidth &gt; clientWidth）</li>
          <li>支持最小和最大宽度限制</li>
          <li>处理虚拟滚动表格的可见列</li>
          <li>跳过合并列，以列数最多的行为标准</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <button
            onClick={handleAutoSize}
            style={{
              padding: '10px 20px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#40a9ff'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#1890ff'
            }}
          >
            🔧 自动调整列宽
          </button>
        </div>

        <div style={{ fontSize: '14px', color: '#666' }}>
          <span>已调整次数: {adjustCount}</span>
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>操作提示:</strong>
        <ol style={{ marginLeft: '20px', fontSize: '14px', color: '#666' }}>
          <li>观察表格中长文本内容在默认列宽下的显示效果</li>
          <li>点击"自动调整列宽"按钮</li>
          <li>查看列宽如何根据内容长度自动调整</li>
          <li>注意长文本列会变宽，短文本列保持合理宽度</li>
          <li>可以多次点击观察调整效果</li>
        </ol>
      </div>

      <div style={{ border: '2px solid #d9d9d9', borderRadius: '8px', overflow: 'hidden' }}>
        <Table
          ref={tableRef}
          columns={columns}
          dataSource={mockData}
          rowHeight={40}
          cellDefaultWidth={120}
          bordered={true}
          style={{
            width: '100%',
            height: '500px',
          }}
          overColumnCount={10}
          overRowCount={10}
          minColumnWidth={40}
          maxColumnWidth={1000}
        />
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          background: '#e8f4fd',
          borderRadius: '8px',
          border: '1px solid #91d5ff',
        }}
      >
        <h4>技术细节</h4>
        <ul style={{ marginLeft: '20px', fontSize: '14px' }}>
          <li>
            <strong>算法原理:</strong> 通过 DOM 查询找到所有单元格，测量 scrollWidth 和 clientWidth
          </li>
          <li>
            <strong>溢出检测:</strong> 当 scrollWidth &gt; clientWidth 时，表示内容溢出
          </li>
          <li>
            <strong>标准列识别:</strong> 以列数最多的行为标准，跳过合并列的计算
          </li>
          <li>
            <strong>虚拟滚动优化:</strong> 只处理当前可见的列，提升性能
          </li>
          <li>
            <strong>状态管理:</strong> 计算结果自动更新到全局列宽状态
          </li>
        </ul>
      </div>
    </div>
  )
}
