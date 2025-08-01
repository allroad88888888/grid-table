/**
 * 固定列与合并单元格演示
 *
 * 功能特性：
 * 1. 左侧固定列：序号、姓名 - 横向滚动时保持固定在左侧
 * 2. 右侧固定列：状态、操作 - 横向滚动时保持固定在右侧
 * 3. 中间普通列：年龄、邮箱、电话、部门、职位、薪资、入职日期 - 可正常滚动
 * 4. 合并单元格：
 *    - 表头：部门和职位列可以合并显示
 *    - 表体左侧区域：John 和 Jane 的部门列合并
 *    - 表体中间区域：Bob 的部门和职位列合并；Diana 和 Eva 的薪资和入职日期列合并
 *    - 表体右侧区域：Alice 和 Charlie 的状态列合并
 * 5. 动态控制：通过按钮可以切换是否显示合并单元格
 *
 * 实现原理：
 * - 固定列通过 column.fixed 属性实现
 * - 合并单元格通过 tbodyMergeCellListAtom 和 theadMergeCellListAtom 状态管理
 * - 使用 getCellId 函数生成单元格ID，通过 colIdList 和 rowIdList 指定合并范围
 */
import type { ColumnType } from '@grid-table/view'
import { Table } from '@grid-table/view/src'
import { Tag, Button, Space } from 'antd'
import { useState, useEffect } from 'react'
import { useStore } from '@einfach/react'
import { tbodyMergeCellListAtom, theadMergeCellListAtom } from '@grid-table/view/src/components'
import { getCellId } from '@grid-table/view/src/utils'

const columns: ColumnType[] = [
  // 左侧固定列
  {
    title: '序号',
    dataIndex: 'id',
    width: 80,
    fixed: 'left',
    key: 'index',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
    fixed: 'left',
    key: 'name',
    render: (text: any) => <a>{text}</a>,
  },

  // 中间普通列
  {
    title: '年龄',
    dataIndex: 'age',
    width: 80,
    key: 'age',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 200,
    key: 'email',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    width: 120,
    key: 'phone',
  },
  {
    title: '部门',
    dataIndex: 'department',
    width: 120,
    key: 'department',
  },
  {
    title: '职位',
    dataIndex: 'position',
    width: 150,
    key: 'position',
  },
  {
    title: '薪资',
    dataIndex: 'salary',
    width: 100,
    key: 'salary',
    render: (salary: any) => `$${salary?.toLocaleString()}`,
  },
  {
    title: '入职日期',
    dataIndex: 'startDate',
    width: 120,
    key: 'startDate',
  },

  // 右侧固定列
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    fixed: 'right',
    key: 'status',
    render: (status: any) => {
      const color = status === 'Active' ? 'green' : status === 'Inactive' ? 'red' : 'orange'
      return <Tag color={color}>{status}</Tag>
    },
  },
  {
    title: '操作',
    width: 120,
    fixed: 'right',
    key: 'action',
    render: (_: any, record: any) => (
      <Space>
        <Button size="small" type="link">
          编辑
        </Button>
        <Button size="small" type="link" danger>
          删除
        </Button>
      </Space>
    ),
  },
]

const data = [
  {
    id: '1',
    name: 'John Doe',
    age: 32,
    email: 'john.doe@company.com',
    phone: '+1-555-0101',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 120000,
    startDate: '2020-01-15',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 28,
    email: 'jane.smith@company.com',
    phone: '+1-555-0102',
    department: 'Design',
    position: 'UI/UX Designer',
    salary: 95000,
    startDate: '2021-03-20',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    age: 45,
    email: 'bob.johnson@company.com',
    phone: '+1-555-0103',
    department: 'Engineering',
    position: 'Tech Lead',
    salary: 150000,
    startDate: '2018-07-10',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Alice Brown',
    age: 35,
    email: 'alice.brown@company.com',
    phone: '+1-555-0104',
    department: 'Product',
    position: 'Product Manager',
    salary: 130000,
    startDate: '2019-11-05',
    status: 'Inactive',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    age: 29,
    email: 'charlie.wilson@company.com',
    phone: '+1-555-0105',
    department: 'Engineering',
    position: 'Frontend Developer',
    salary: 85000,
    startDate: '2022-02-14',
    status: 'Active',
  },
  {
    id: '6',
    name: 'Diana Lee',
    age: 31,
    email: 'diana.lee@company.com',
    phone: '+1-555-0106',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 110000,
    startDate: '2020-08-20',
    status: 'Active',
  },
  {
    id: '7',
    name: 'Eva Garcia',
    age: 27,
    email: 'eva.garcia@company.com',
    phone: '+1-555-0107',
    department: 'Design',
    position: 'Graphic Designer',
    salary: 75000,
    startDate: '2021-12-01',
    status: 'Pending',
  },
  {
    id: '8',
    name: 'Frank Miller',
    age: 38,
    email: 'frank.miller@company.com',
    phone: '+1-555-0108',
    department: 'QA',
    position: 'QA Manager',
    salary: 105000,
    startDate: '2019-04-15',
    status: 'Active',
  },
]

export function FixedColumnsWithMergeCellsDemo() {
  const [showMergeCells, setShowMergeCells] = useState(false)
  const store = useStore()

  // 设置合并单元格
  useEffect(() => {
    if (showMergeCells) {
      // 设置表头合并单元格 - 工程部门合并
      const headerMergeCells = [
        {
          cellId: getCellId({ rowId: 'header-0', columnId: 'department' }), // 部门列的表头
          colIdList: ['position'], // 合并到职位列
          rowIdList: [], // 不跨行
        },
      ]

      // 设置表体合并单元格
      const bodyMergeCells = [
        // 合并 John Doe 和 Jane Smith 的部门列（左侧区域）
        {
          cellId: getCellId({ rowId: '1', columnId: 'department' }), // 第一行部门列
          colIdList: [], // 不跨列
          rowIdList: ['2'], // 合并到第二行
        },

        // 合并 Bob Johnson 的部门和职位列（中间区域）
        {
          cellId: getCellId({ rowId: '3', columnId: 'department' }), // 第三行部门列
          colIdList: ['position'], // 跨到职位列
          rowIdList: [], // 不跨行
        },

        // 合并 Alice Brown 和 Charlie Wilson 的状态列（右侧区域）
        {
          cellId: getCellId({ rowId: '4', columnId: 'status' }), // 第四行状态列
          colIdList: [], // 不跨列
          rowIdList: ['5'], // 合并到第五行
        },

        // 合并 Diana Lee 和 Eva Garcia 的薪资和入职日期列（中间区域跨列）
        {
          cellId: getCellId({ rowId: '6', columnId: 'salary' }), // 第六行薪资列
          colIdList: ['startDate'], // 跨到入职日期列
          rowIdList: ['7'], // 合并到第七行
        },
      ]

      // 应用合并单元格设置
      store.setter(theadMergeCellListAtom, headerMergeCells)
      store.setter(tbodyMergeCellListAtom, bodyMergeCells)
    } else {
      // 清除合并单元格
      store.setter(theadMergeCellListAtom, [])
      store.setter(tbodyMergeCellListAtom, [])
    }
  }, [showMergeCells, store])

  const toggleMergeCells = () => {
    setShowMergeCells(!showMergeCells)
  }

  return (
    <div
      style={{
        width: '100%',
        height: 400,
        padding: 16,
      }}
    >
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={toggleMergeCells}>
          {showMergeCells ? '隐藏合并单元格' : '显示合并单元格'}
        </Button>
        <div style={{ color: '#666', fontSize: 14 }}>
          左侧固定：序号、姓名 | 中间：详细信息 | 右侧固定：状态、操作
        </div>
      </Space>

      {showMergeCells && (
        <div style={{ marginBottom: 16, padding: 8, background: '#f0f2f5', borderRadius: 4 }}>
          <div style={{ fontSize: 12, color: '#666' }}>
            <div>合并单元格示例说明：</div>
            <div>• 表头：部门和职位列合并显示</div>
            <div>• 左侧区域：John 和 Jane 的部门列合并</div>
            <div>• 中间区域：Bob 的部门和职位列合并；Diana 和 Eva 的薪资和入职日期列合并</div>
            <div>• 右侧区域：Alice 和 Charlie 的状态列合并</div>
          </div>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={data}
        idProp="id"
        bordered
        store={store}
        enableSelectArea={true}
        enableHeadContextMenu={true}
        enableColumnResize={true}
        enableCopy={true}
      />
    </div>
  )
}

export default FixedColumnsWithMergeCellsDemo
