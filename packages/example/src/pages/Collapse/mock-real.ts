import type { ColumnType } from '@grid-table/view'

// 应收数据的展开字段
export const receivableArrayKeys = ['ReceivableDetail_receivable']

// 应收数据需要展示的列
export const receivableColumns = [
  'receivable_id',
  'receivable_date',
  'document_status',
  'subtype',
  'remark',
  'source',
  '_allow_data_delete',
  '_allow_data_update',
  '_allow_data_read',
  'ReceivableDetail_receivable||receivable_detail_id',
  'ReceivableDetail_receivable||quantity',
  'ReceivableDetail_receivable||price',
  'ReceivableDetail_receivable||line_no',
  'ReceivableDetail_receivable||mprsku',
  'ReceivableDetail_receivable||shipping_order',
]

// 应收数据的表格列配置
export const receivableTableColumns: (rowIdKey: string) => ColumnType[] = (rowIdKey) => [
  {
    title: 'rowId',
    dataIndex: rowIdKey,
    width: 50,
    fixed: 'left',
    key: 'rowId',
  },
  {
    title: '应收ID',
    dataIndex: 'receivable_id',
    width: 150,
    fixed: 'left',
    key: 'receivable_id',
  },
  {
    title: '应收日期',
    dataIndex: 'receivable_date',
    width: 180,
    key: 'receivable_date',
    render: (date: string | undefined) => (date ? date.split('T')[0] : '-'),
  },
  {
    title: '单据状态',
    dataIndex: 'document_status',
    width: 100,
    key: 'document_status',
  },
  {
    title: '明细ID',
    dataIndex: 'ReceivableDetail_receivable||receivable_detail_id',
    width: 180,
    key: 'ReceivableDetail_receivable||receivable_detail_id',
  },
  {
    title: 'SKU',
    dataIndex: 'ReceivableDetail_receivable||mprsku',
    width: 180,
    key: 'ReceivableDetail_receivable||mprsku',
  },
  {
    title: '数量',
    dataIndex: 'ReceivableDetail_receivable||quantity',
    width: 80,
    key: 'ReceivableDetail_receivable||quantity',
  },
  {
    title: '价格',
    dataIndex: 'ReceivableDetail_receivable||price',
    width: 100,
    key: 'ReceivableDetail_receivable||price',
    render: (text: string | undefined) => {
      const price = text != null ? Number(text) : null
      return price != null ? `¥${price.toFixed(2)}` : '-'
    },
  },
  {
    title: '行号',
    dataIndex: 'ReceivableDetail_receivable||line_no',
    width: 80,
    key: 'ReceivableDetail_receivable||line_no',
    render: (text: string | undefined) => text ?? '-',
  },
  {
    title: '发货订单ID',
    dataIndex: 'ReceivableDetail_receivable||shipping_order',
    width: 180,
    key: 'ReceivableDetail_receivable||shipping_order',
    render: (text: string | undefined) => {
      if (!text) return '-'
      // text 可能是对象或字符串
      if (typeof text === 'object') {
        const shippingOrder = text as any
        return shippingOrder.shipping_order_id || '-'
      }
      return text
    },
  },
]

export default [
  {
    receivable_id: 'a5fa013c2dd7_0001',
    ReceivableDetail_receivable: [
      {
        receivable_detail_id: 'a5fa013c2dd7_0001_001',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1364082966',
        },
        line_no: null,
        mprsku: 'USIM51841',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0001_002',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO22SP1078729585',
        },
        line_no: null,
        mprsku: 'DEMO22',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0001_003',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO23SP1078729585',
        },
        line_no: null,
        mprsku: 'DEMO23',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0001_004',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO24SP1078729585',
        },
        line_no: null,
        mprsku: 'DEMO24',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0001_005',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO30SP1078729585',
        },
        line_no: null,
        mprsku: 'DEMO30',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0001_006',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO29SP1078729585',
        },
        line_no: null,
        mprsku: 'DEMO29',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0001_007',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO28SP1078729585',
        },
        line_no: null,
        mprsku: 'DEMO28',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0001_008',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO27SP1078729585',
        },
        line_no: null,
        mprsku: 'DEMO27',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0001_009',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO26SP1078729585',
        },
        line_no: null,
        mprsku: 'DEMO26',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0001_010',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO25SP1078729585',
        },
        line_no: null,
        mprsku: 'DEMO25',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0001_011',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO21SP1078729585',
        },
        line_no: null,
        mprsku: 'DEMO21',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0001_012',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1364083813',
        },
        line_no: null,
        mprsku: 'USKSK186BLR-C',
      },
    ],
    receivable_date: '2025-10-24T17:54:44',
    document_status: 'approved',
    subtype: 'revenue_cost_recognized',
    _allow_data_delete: true,
    remark: null,
    source: null,
    store: {
      code: '1',
      name: {
        en: 'YHT-US',
        'zh-cn': 'amazon_YTAUTOPARTS',
      },
    },
    _allow_data_update: true,
    _allow_data_read: true,
  },
  {
    receivable_id: 'a5fa013c2dd7_0002',
    ReceivableDetail_receivable: [
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_001',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010974',
        },
        line_no: null,
        mprsku: 'USFFFOOE004T-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_002',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011024',
        },
        line_no: null,
        mprsku: 'USSPLK0FD003-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_003',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO01SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_004',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO02SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_005',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO03SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_006',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO04SP1078729585',
        },
        line_no: null,
        mprsku: 'USCS32240-C1',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_007',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO05SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_008',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO06SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_009',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011083',
        },
        line_no: null,
        mprsku: 'USWSP54505B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_010',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011071',
        },
        line_no: null,
        mprsku: 'USSPLK0FD004-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_011',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011064',
        },
        line_no: null,
        mprsku: 'USCS32240-C1',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_012',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011045',
        },
        line_no: null,
        mprsku: 'USFFCHOE004S-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_013',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011042',
        },
        line_no: null,
        mprsku: 'USFLW67575-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_014',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010831',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_015',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010834',
        },
        line_no: null,
        mprsku: 'USFI12128-6-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_016',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO07SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_017',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO08SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_018',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO09SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_019',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO10SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_020',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011035',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-4-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_021',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010837',
        },
        line_no: null,
        mprsku: 'USSPLK0FD004-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_022',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010840',
        },
        line_no: null,
        mprsku: 'USSPLK0TO004-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_023',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010846',
        },
        line_no: null,
        mprsku: 'USSGTO065-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_024',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010876',
        },
        line_no: null,
        mprsku: 'USKS98148L-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_025',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010879',
        },
        line_no: null,
        mprsku: 'USFSU03341-C1',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_026',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010882',
        },
        line_no: null,
        mprsku: 'USTCV17200HU-2-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_027',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010892',
        },
        line_no: null,
        mprsku: 'USLHA0B396A0-2-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_028',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010897',
        },
        line_no: null,
        mprsku: 'USFI55710-6-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_029',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010925',
        },
        line_no: null,
        mprsku: 'USWSP55002B1-4-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_030',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010928',
        },
        line_no: null,
        mprsku: 'USFI81800-6-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_031',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010933',
        },
        line_no: null,
        mprsku: 'USCAK12040-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_032',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010937',
        },
        line_no: null,
        mprsku: 'USSPLK0FD004-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_033',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010944',
        },
        line_no: null,
        mprsku: 'USSA349071GFR-C1',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_034',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO12SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_035',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010977',
        },
        line_no: null,
        mprsku: 'USWSP54721B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_036',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010987',
        },
        line_no: null,
        mprsku: 'USMI0TO038LR-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_037',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010990',
        },
        line_no: null,
        mprsku: 'USCAKFT012-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_038',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010993',
        },
        line_no: null,
        mprsku: 'USGS44780B',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_039',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011027',
        },
        line_no: null,
        mprsku: 'USWSP86702B0-4-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_040',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO19SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_041',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO17SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_042',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO16SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_043',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO14SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_044',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO13SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_045',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO11SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_046',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO18SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0002_047',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO20SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
    ],
    receivable_date: '2025-10-24T17:54:44',
    document_status: 'approved',
    subtype: 'revenue_cost_recognized',
    _allow_data_delete: true,
    remark: null,
    source: null,
    store: null,
    _allow_data_update: true,
    _allow_data_read: true,
  },
  {
    receivable_id: 'a5fa013c2dd7_0003',
    ReceivableDetail_receivable: [
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_001',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367468854',
        },
        line_no: null,
        mprsku: 'DEBPS95575-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_002',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521618',
        },
        line_no: null,
        mprsku: 'DEBCN44094-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_003',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521620',
        },
        line_no: null,
        mprsku: 'DEET1407AHU-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_004',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521630',
        },
        line_no: null,
        mprsku: 'DECON24000-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_005',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521628',
        },
        line_no: null,
        mprsku: 'DESTR32711',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_006',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521626',
        },
        line_no: null,
        mprsku: 'DEGS8H31AJ-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_007',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521624',
        },
        line_no: null,
        mprsku: 'DECSH3298-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_008',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521598',
        },
        line_no: null,
        mprsku: 'DEABS0D010',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_009',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521622',
        },
        line_no: null,
        mprsku: 'DECSA6219-C1',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_010',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521602',
        },
        line_no: null,
        mprsku: 'DECSH5550-FC1',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_011',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521604',
        },
        line_no: null,
        mprsku: 'DECSA6655-FC1',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_012',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521606',
        },
        line_no: null,
        mprsku: 'DEDLA76319-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_013',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521634',
        },
        line_no: null,
        mprsku: 'DESKA07256L-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_014',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521636',
        },
        line_no: null,
        mprsku: 'DEGS15025-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_015',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521638',
        },
        line_no: null,
        mprsku: 'DEDLA47699-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_016',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521640',
        },
        line_no: null,
        mprsku: 'DECSH3559-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_017',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521642',
        },
        line_no: null,
        mprsku: 'DEGSM3378-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_018',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521644',
        },
        line_no: null,
        mprsku: 'DECSC5422',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_019',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521632',
        },
        line_no: null,
        mprsku: 'DEFP16347Z1',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_020',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521608',
        },
        line_no: null,
        mprsku: 'DEDLA11302-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_021',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521610',
        },
        line_no: null,
        mprsku: 'DEGS60682B-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_022',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521612',
        },
        line_no: null,
        mprsku: 'DEGS00429LR',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_023',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521614',
        },
        line_no: null,
        mprsku: 'DECSH3488-C1',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_024',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521616',
        },
        line_no: null,
        mprsku: 'DEB-OF71810-MF2',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0003_025',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521600',
        },
        line_no: null,
        mprsku: 'DEGS94322TB',
      },
    ],
    receivable_date: '2025-10-24T17:54:44',
    document_status: 'approved',
    subtype: 'revenue_cost_recognized',
    _allow_data_delete: true,
    remark: null,
    source: null,
    store: null,
    _allow_data_update: true,
    _allow_data_read: true,
  },
  {
    receivable_id: 'a5fa013c2dd7_0004',
    ReceivableDetail_receivable: [
      {
        receivable_detail_id: 'a5fa013c2dd7_0004_001',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1418822130',
        },
        line_no: null,
        mprsku: 'USCAF12159R-C',
      },
    ],
    receivable_date: '2025-10-24T17:54:44',
    document_status: 'approved',
    subtype: 'revenue_cost_recognized',
    _allow_data_delete: true,
    remark: null,
    source: null,
    store: null,
    _allow_data_update: true,
    _allow_data_read: true,
  },
  {
    receivable_id: 'a5fa013c2dd7_0005',
    ReceivableDetail_receivable: [
      {
        receivable_detail_id: 'a5fa013c2dd7_0005_001',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1364168360',
        },
        line_no: null,
        mprsku: 'USCAK01092-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0005_002',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1364168356',
        },
        line_no: null,
        mprsku: 'USATF31728-C',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0005_003',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1364168358',
        },
        line_no: null,
        mprsku: 'USDHO80874-C',
      },
    ],
    receivable_date: '2025-10-24T17:54:44',
    document_status: 'approved',
    subtype: 'revenue_cost_recognized',
    _allow_data_delete: true,
    remark: null,
    source: null,
    store: null,
    _allow_data_update: true,
    _allow_data_read: true,
  },
  {
    receivable_id: 'a5fa013c2dd7_0006',
    ReceivableDetail_receivable: [
      {
        receivable_detail_id: 'a5fa013c2dd7_0006_001',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1364158666',
        },
        line_no: null,
        mprsku: 'USDS46840-C',
      },
    ],
    receivable_date: '2025-10-24T17:54:44',
    document_status: 'approved',
    subtype: 'revenue_cost_recognized',
    _allow_data_delete: true,
    remark: null,
    source: null,
    store: null,
    _allow_data_update: true,
    _allow_data_read: true,
  },
  {
    receivable_id: 'a5fa013c2dd7_0007',
    ReceivableDetail_receivable: [
      {
        receivable_detail_id: 'a5fa013c2dd7_0007_001',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1364158619',
        },
        line_no: null,
        mprsku: 'DEHHS93700-FC',
      },
      {
        receivable_detail_id: 'a5fa013c2dd7_0007_002',
        quantity: 1.0,
        price: null,
        shipping_order: {
          shipping_order_id: '1364161612',
        },
        line_no: null,
        mprsku: 'DECAKMB009-FC',
      },
    ],
    receivable_date: '2025-10-24T17:54:44',
    document_status: 'approved',
    subtype: 'revenue_cost_recognized',
    _allow_data_delete: true,
    remark: null,
    source: null,
    store: null,
    _allow_data_update: true,
    _allow_data_read: true,
  },
  {
    receivable_id: '95b519c3c0cf_0001',
    ReceivableDetail_receivable: [
      {
        receivable_detail_id: '95b519c3c0cf_0001_001',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1364082966',
        },
        line_no: null,
        mprsku: 'USIM51841',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0001_002',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1364083813',
        },
        line_no: null,
        mprsku: 'USKSK186BLR-C',
      },
    ],
    receivable_date: '2025-10-22T12:06:20',
    document_status: 'approved',
    subtype: 'revenue_cost_recognized',
    _allow_data_delete: true,
    remark: null,
    source: null,
    store: null,
    _allow_data_update: true,
    _allow_data_read: true,
  },
  {
    receivable_id: '95b519c3c0cf_0002',
    ReceivableDetail_receivable: [
      {
        receivable_detail_id: '95b519c3c0cf_0002_001',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010846',
        },
        line_no: null,
        mprsku: 'USSGTO065-C',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_002',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011024',
        },
        line_no: null,
        mprsku: 'USSPLK0FD003-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_003',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010892',
        },
        line_no: null,
        mprsku: 'USLHA0B396A0-2-C',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_004',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011027',
        },
        line_no: null,
        mprsku: 'USWSP86702B0-4-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_005',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011035',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-4-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_006',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011042',
        },
        line_no: null,
        mprsku: 'USFLW67575-C',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_007',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011045',
        },
        line_no: null,
        mprsku: 'USFFCHOE004S-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_008',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011064',
        },
        line_no: null,
        mprsku: 'USCS32240-C1',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_009',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011071',
        },
        line_no: null,
        mprsku: 'USSPLK0FD004-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_010',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367011083',
        },
        line_no: null,
        mprsku: 'USWSP54505B1-2-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_011',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO01SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_012',
        quantity: 2,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO02SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_013',
        quantity: 0,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO03SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_014',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO04SP1078729585',
        },
        line_no: null,
        mprsku: 'USCS32240-C1',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_015',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO05SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_016',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO06SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_017',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO07SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_018',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO08SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_019',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010882',
        },
        line_no: null,
        mprsku: 'USTCV17200HU-2-C',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_020',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO10SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_021',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010944',
        },
        line_no: null,
        mprsku: 'USSA349071GFR-C1',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_022',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010937',
        },
        line_no: null,
        mprsku: 'USSPLK0FD004-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_023',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010933',
        },
        line_no: null,
        mprsku: 'USCAK12040-C',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_024',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010928',
        },
        line_no: null,
        mprsku: 'USFI81800-6-C',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_025',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010831',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_026',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010837',
        },
        line_no: null,
        mprsku: 'USSPLK0FD004-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_027',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010879',
        },
        line_no: null,
        mprsku: 'USFSU03341-C1',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_028',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010876',
        },
        line_no: null,
        mprsku: 'USKS98148L-C',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_029',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010925',
        },
        line_no: null,
        mprsku: 'USWSP55002B1-4-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_030',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010897',
        },
        line_no: null,
        mprsku: 'USFI55710-6-C',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_031',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010834',
        },
        line_no: null,
        mprsku: 'USFI12128-6-C',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_032',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010840',
        },
        line_no: null,
        mprsku: 'USSPLK0TO004-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_033',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010974',
        },
        line_no: null,
        mprsku: 'USFFFOOE004T-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_034',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010977',
        },
        line_no: null,
        mprsku: 'USWSP54721B1-2-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_035',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010987',
        },
        line_no: null,
        mprsku: 'USMI0TO038LR-YC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_036',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010990',
        },
        line_no: null,
        mprsku: 'USCAKFT012-C',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_037',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367010993',
        },
        line_no: null,
        mprsku: 'USGS44780B',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0002_038',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: 'DEMO09SP1078729585',
        },
        line_no: null,
        mprsku: 'USWSP54547B1-2-YC',
      },
    ],
    receivable_date: '2025-10-22T12:06:20',
    document_status: 'approved',
    subtype: 'revenue_cost_recognized',
    _allow_data_delete: true,
    remark: null,
    source: null,
    store: null,
    _allow_data_update: true,
    _allow_data_read: true,
  },
  {
    receivable_id: '95b519c3c0cf_0003',
    ReceivableDetail_receivable: [
      {
        receivable_detail_id: '95b519c3c0cf_0003_001',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521626',
        },
        line_no: null,
        mprsku: 'DEGS8H31AJ-FC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_002',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521630',
        },
        line_no: null,
        mprsku: 'DECON24000-FC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_003',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521632',
        },
        line_no: null,
        mprsku: 'DEFP16347Z1',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_004',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521642',
        },
        line_no: null,
        mprsku: 'DEGSM3378-FC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_005',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521640',
        },
        line_no: null,
        mprsku: 'DECSH3559-FC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_006',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521638',
        },
        line_no: null,
        mprsku: 'DEDLA47699-FC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_007',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367468854',
        },
        line_no: null,
        mprsku: 'DEBPS95575-FC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_008',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521598',
        },
        line_no: null,
        mprsku: 'DEABS0D010',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_009',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521636',
        },
        line_no: null,
        mprsku: 'DEGS15025-FC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_010',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521602',
        },
        line_no: null,
        mprsku: 'DECSH5550-FC1',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_011',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521604',
        },
        line_no: null,
        mprsku: 'DECSA6655-FC1',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_012',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521606',
        },
        line_no: null,
        mprsku: 'DEDLA76319-C',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_013',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521608',
        },
        line_no: null,
        mprsku: 'DEDLA11302-FC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_014',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521610',
        },
        line_no: null,
        mprsku: 'DEGS60682B-FC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_015',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521612',
        },
        line_no: null,
        mprsku: 'DEGS00429LR',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_016',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521644',
        },
        line_no: null,
        mprsku: 'DECSC5422',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_017',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521628',
        },
        line_no: null,
        mprsku: 'DESTR32711',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_018',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521634',
        },
        line_no: null,
        mprsku: 'DESKA07256L-FC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_019',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521614',
        },
        line_no: null,
        mprsku: 'DECSH3488-C1',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_020',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521616',
        },
        line_no: null,
        mprsku: 'DEB-OF71810-MF2',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_021',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521618',
        },
        line_no: null,
        mprsku: 'DEBCN44094-FC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_022',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521620',
        },
        line_no: null,
        mprsku: 'DEET1407AHU-C',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_023',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521622',
        },
        line_no: null,
        mprsku: 'DECSA6219-C1',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_024',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521624',
        },
        line_no: null,
        mprsku: 'DECSH3298-FC',
      },
      {
        receivable_detail_id: '95b519c3c0cf_0003_025',
        quantity: 1,
        price: null,
        shipping_order: {
          shipping_order_id: '1367521600',
        },
        line_no: null,
        mprsku: 'DEGS94322TB',
      },
    ],
    receivable_date: '2025-10-22T12:06:20',
    document_status: 'approved',
    subtype: 'revenue_cost_recognized',
    _allow_data_delete: true,
    remark: null,
    source: null,
    store: null,
    _allow_data_update: true,
    _allow_data_read: true,
  },
]
