import type { ColumnType } from '@grid-table/view'
import { Table } from '@grid-table/view'
import { useMemo } from 'react'
import './FinanceTableDemo.css'

// 财会数据类型
type FinanceRecord = {
  id: string
  date: string
  voucherNo: string
  accountName: string
  debitAmount: number
  creditAmount: number
  balance: number
  summary: string
}

// 生成财会模拟数据
const generateFinanceData = (count: number): FinanceRecord[] => {
  const accounts = [
    '银行存款',
    '应收账款',
    '应付账款',
    '固定资产',
    '主营业务收入',
    '主营业务成本',
    '管理费用',
    '财务费用',
    '销售费用',
    '资本公积',
  ]

  const summaries = [
    '收款',
    '付款',
    '转账',
    '工资发放',
    '采购货物',
    '销售收入',
    '费用报销',
    '利息收入',
  ]

  const data: FinanceRecord[] = []
  let balance = 1000000 // 初始余额

  for (let i = 0; i < count; i++) {
    const debit = Math.random() > 0.5 ? Math.round(Math.random() * 100000 * 100) / 100 : 0
    const credit = debit === 0 ? Math.round(Math.random() * 100000 * 100) / 100 : 0
    balance += debit - credit

    data.push({
      id: String(i + 1),
      date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      voucherNo: `记${String(i + 1).padStart(6, '0')}`,
      accountName: accounts[Math.floor(Math.random() * accounts.length)],
      debitAmount: debit,
      creditAmount: credit,
      balance: Math.round(balance * 100) / 100,
      summary: summaries[Math.floor(Math.random() * summaries.length)],
    })
  }

  return data
}

// 格式化金额
const formatAmount = (amount: number): string => {
  if (amount === 0) return '-'
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// 生成1000条财会数据
const FINANCE_DATA = generateFinanceData(1000)

// 列定义
const columns: ColumnType[] = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    width: 120,
    align: 'center',
  },
  {
    title: '凭证号',
    dataIndex: 'voucherNo',
    key: 'voucherNo',
    width: 120,
    align: 'center',
  },
  {
    title: '会计科目',
    dataIndex: 'accountName',
    key: 'accountName',
    width: 150,
  },
  {
    title: '借方金额',
    dataIndex: 'debitAmount',
    key: 'debitAmount',
    width: 140,
    align: 'right',
    render: (text) => <span className="finance-amount">{formatAmount(Number(text) || 0)}</span>,
  },
  {
    title: '贷方金额',
    dataIndex: 'creditAmount',
    key: 'creditAmount',
    width: 140,
    align: 'right',
    render: (text) => <span className="finance-amount">{formatAmount(Number(text) || 0)}</span>,
  },
  {
    title: '余额',
    dataIndex: 'balance',
    key: 'balance',
    width: 140,
    align: 'right',
    render: (text) => (
      <span className="finance-amount finance-balance">{formatAmount(Number(text) || 0)}</span>
    ),
  },
  {
    title: '摘要',
    dataIndex: 'summary',
    key: 'summary',
    width: 120,
  },
]

export function FinanceTableDemo() {
  // 计算总计
  const totals = useMemo(() => {
    const totalDebit = FINANCE_DATA.reduce((sum, record) => sum + record.debitAmount, 0)
    const totalCredit = FINANCE_DATA.reduce((sum, record) => sum + record.creditAmount, 0)
    return {
      debit: formatAmount(totalDebit),
      credit: formatAmount(totalCredit),
      diff: formatAmount(totalDebit - totalCredit),
    }
  }, [])

  return (
    <div className="finance-table-container">
      <div className="finance-table-header">
        <h1>财务数据表格</h1>
        <p className="finance-table-description">
          展示财会凭证数据，包含借方、贷方和余额等数字字段
        </p>
      </div>

      <div className="finance-table-stats">
        <div className="finance-stat-item">
          <span className="finance-stat-label">总记录数：</span>
          <span className="finance-stat-value">{FINANCE_DATA.length.toLocaleString()}</span>
        </div>
        <div className="finance-stat-item">
          <span className="finance-stat-label">借方总额：</span>
          <span className="finance-stat-value finance-stat-debit">{totals.debit}</span>
        </div>
        <div className="finance-stat-item">
          <span className="finance-stat-label">贷方总额：</span>
          <span className="finance-stat-value finance-stat-credit">{totals.credit}</span>
        </div>
        <div className="finance-stat-item">
          <span className="finance-stat-label">差额：</span>
          <span className="finance-stat-value">{totals.diff}</span>
        </div>
      </div>

      <Table
        style={{
          width: '100%',
          height: '600px',
        }}
        className="finance-table"
        columns={columns}
        dataSource={FINANCE_DATA}
        rowHeight={40}
        cellDefaultWidth={100}
      />
    </div>
  )
}
