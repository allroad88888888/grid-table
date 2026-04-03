import type { ColumnType , OnColumnResizeCallback } from '@grid-table/view'
import { Table } from '@grid-table/view'
import { Tag, Button, Space, message } from 'antd'
import { ResizableContainer } from '../components/ResizableContainer'
import { useCallback, useEffect, useState } from 'react'
import './ColumnResizeCacheDemo.css'

// 本地存储的键名
const COLUMN_WIDTH_CACHE_KEY = 'table-column-widths'

// 获取缓存的列宽
const getColumnWidthCache = (): Record<string, number> => {
  try {
    const cached = localStorage.getItem(COLUMN_WIDTH_CACHE_KEY)
    return cached ? JSON.parse(cached) : {}
  } catch {
    return {}
  }
}

// 保存列宽到缓存
const saveColumnWidthCache = (cache: Record<string, number>) => {
  try {
    localStorage.setItem(COLUMN_WIDTH_CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.error('保存列宽缓存失败:', error)
  }
}

const columns: ColumnType[] = [
  {
    title: '序号',
    dataIndex: 'id',
    width: 80,
    fixed: 'left',
    key: 'id',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
    fixed: 'left',
    key: 'name',
    render: (text: any) => <a>{text}</a>,
  },
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
    width: 140,
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
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
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
]

export function ColumnResizeCacheDemo() {
  const [columnWidthCache, setColumnWidthCache] = useState<Record<string, number>>(() =>
    getColumnWidthCache(),
  )
  const [cacheInfo, setCacheInfo] = useState<string>('')

  // 应用缓存的列宽到 columns
  const columnsWithCache = columns.map((col) => ({
    ...col,
    width: columnWidthCache[col.key as string] || col.width,
  }))

  // 列宽调整回调函数
  const handleColumnResize: OnColumnResizeCallback = useCallback(
    (columnId: string, newWidth: number) => {
      console.log(`列 ${columnId} 宽度调整为: ${newWidth}px`)

      // 更新缓存
      const updatedCache = {
        ...getColumnWidthCache(),
        [columnId]: newWidth,
      }

      // 保存到本地存储
      saveColumnWidthCache(updatedCache)

      // 更新状态
      setColumnWidthCache(updatedCache)

      // 显示提示信息
      message.success(`列宽已缓存: ${columnId} = ${newWidth}px`)

      // 更新缓存信息显示
      setCacheInfo(`最后更新: ${columnId} = ${newWidth}px (${new Date().toLocaleTimeString()})`)
    },
    [],
  )

  // 清除缓存
  const clearCache = useCallback(() => {
    localStorage.removeItem(COLUMN_WIDTH_CACHE_KEY)
    setColumnWidthCache({})
    setCacheInfo('')
    message.success('列宽缓存已清除，刷新页面查看效果')
  }, [])

  // 重置为默认宽度
  const resetToDefault = useCallback(() => {
    const defaultWidths: Record<string, number> = {}
    columns.forEach((col) => {
      if (col.width && col.key) {
        defaultWidths[col.key as string] = col.width
      }
    })
    saveColumnWidthCache(defaultWidths)
    setColumnWidthCache(defaultWidths)
    setCacheInfo('已重置为默认宽度')
    message.success('已重置为默认列宽')
  }, [])

  // 显示当前缓存状态
  useEffect(() => {
    const cacheCount = Object.keys(columnWidthCache).length
    if (cacheCount > 0) {
      setCacheInfo(`已缓存 ${cacheCount} 列的宽度设置`)
    }
  }, [columnWidthCache])

  return (
    <div className="column-resize-cache-demo">
      <div className="demo-header">
        <h1>列宽调整缓存演示</h1>
        <p>拖拽调整列宽后，宽度会自动保存到本地存储，刷新页面后依然保持</p>
      </div>

      <div className="demo-controls">
        <Space>
          <Button onClick={clearCache} type="primary" danger>
            清除缓存
          </Button>
          <Button onClick={resetToDefault}>重置为默认宽度</Button>
        </Space>
        {cacheInfo && <div className="cache-info">{cacheInfo}</div>}
      </div>

      <div className="demo-instructions">
        <h3>使用说明：</h3>
        <ul>
          <li>拖拽表头右侧边缘可以调整列宽</li>
          <li>调整后的列宽会自动保存到浏览器本地存储</li>
          <li>刷新页面后，列宽设置会自动恢复</li>
          <li>可以通过控制台查看回调函数的调用日志</li>
        </ul>
      </div>

      <div className="demo-cache-status">
        <h3>当前缓存状态：</h3>
        <div className="cache-display">
          {Object.keys(columnWidthCache).length === 0 ? (
            <span className="no-cache">暂无缓存数据</span>
          ) : (
            <div className="cache-list">
              {Object.entries(columnWidthCache).map(([columnId, width]) => (
                <span key={columnId} className="cache-item">
                  {columnId}: {width}px
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="demo-table">
        <ResizableContainer
          initialWidth={1000}
          initialHeight={400}
          minWidth={600}
          minHeight={300}
          maxWidth={1400}
          maxHeight={600}
        >
          <Table
            columns={columnsWithCache}
            dataSource={data}
            idProp="id"
            enableSelectArea={true}
            enableHeadContextMenu={true}
            enableColumnResize={true}
            enableCopy={true}
            onColumnResize={handleColumnResize}
            zebra
          />
        </ResizableContainer>
      </div>

      <div className="demo-code-example">
        <h3>代码示例：</h3>
        <pre className="code-block">
          {`// 列宽调整回调函数
const handleColumnResize = useCallback((columnId, newWidth) => {
  console.log(\`列 \${columnId} 宽度调整为: \${newWidth}px\`)
  
  // 保存到本地存储
  const cache = JSON.parse(localStorage.getItem('column-widths') || '{}')
  cache[columnId] = newWidth
  localStorage.setItem('column-widths', JSON.stringify(cache))
}, [])

// 在 Table 组件中使用
<Table
  columns={columns}
  dataSource={data}
  enableColumnResize={true}
  onColumnResize={handleColumnResize}
/>`}
        </pre>
      </div>
    </div>
  )
}

export default ColumnResizeCacheDemo
