import type { ColumnType } from '@grid-table/view'

// 订单数据的展开字段
export const orderArrayKeys = ['SalesOrderLine_order_info', 'ShipmentDetail_order_info']

// 订单数据需要展示的列
export const orderColumns = [
  'Status',
  '_allow_data_delete',
  'CustomerName',
  'TotalAmount',
  'order_id',
  '_allow_data_update',
  'OrderDate',
  'Remark',
  '_allow_data_read',
  'SalesOrderLine_order_info||LineID',
  'SalesOrderLine_order_info||ProductName',
  'SalesOrderLine_order_info||Qty',
  'SalesOrderLine_order_info||Amount',
  'SalesOrderLine_order_info||Unit',
  'ShipmentDetail_order_info||ShipmentID',
  'ShipmentDetail_order_info||ShippedAmount',
  'ShipmentDetail_order_info||ProductName',
  'ShipmentDetail_order_info||ShipmentDate',
  'ShipmentDetail_order_info||BatchNo',
  'ShipmentDetail_order_info||ShippedQty',
]

// 订单数据的表格列配置
export const orderTableColumns: (rowIdKey: string) => ColumnType[] = (rowIdKey) => [
  {
    title: 'rowId',
    dataIndex: rowIdKey,
    width: 50,
    fixed: 'left',
    key: 'rowId',
  },
  {
    title: '订单ID',
    dataIndex: 'order_id',
    width: 150,
    fixed: 'left',
    key: 'order_id',
  },
  {
    title: '订单行ID',
    dataIndex: 'SalesOrderLine_order_info||LineID',
    width: 120,
    key: 'SalesOrderLine_order_info||LineID',
  },
  {
    title: '产品名称(订单)',
    dataIndex: 'SalesOrderLine_order_info||ProductName',
    width: 150,
    render: (text: string | undefined) => {
      if (!text) return '-'
      // text 可能是对象或字符串
      if (typeof text === 'object') {
        const productName = text as any
        return productName['zh-cn'] || productName.en || '-'
      }
      return text
    },
    key: 'SalesOrderLine_order_info||ProductName',
  },
  {
    title: '数量',
    dataIndex: 'SalesOrderLine_order_info||Qty',
    width: 80,
    key: 'SalesOrderLine_order_info||Qty',
  },
  {
    title: '单价',
    dataIndex: 'SalesOrderLine_order_info||Amount',
    width: 100,
    render: (text: string | undefined) => {
      const amount = text != null ? Number(text) : null
      return amount ? `¥${amount.toFixed(2)}` : '-'
    },
    key: 'SalesOrderLine_order_info||Amount',
  },
  {
    title: '单位',
    dataIndex: 'SalesOrderLine_order_info||Unit',
    width: 80,
    key: 'SalesOrderLine_order_info||Unit',
  },
  {
    title: '发货ID',
    dataIndex: 'ShipmentDetail_order_info||ShipmentID',
    width: 120,
    key: 'ShipmentDetail_order_info||ShipmentID',
  },
  {
    title: '产品名称(发货)',
    dataIndex: 'ShipmentDetail_order_info||ProductName',
    width: 150,
    render: (text: string | undefined) => {
      if (!text) return '-'
      // text 可能是对象或字符串
      if (typeof text === 'object') {
        const productName = text as any
        return productName['zh-cn'] || productName.en || '-'
      }
      return text
    },
    key: 'ShipmentDetail_order_info||ProductName',
  },
  {
    title: '已发货数量',
    dataIndex: 'ShipmentDetail_order_info||ShippedQty',
    width: 100,
    key: 'ShipmentDetail_order_info||ShippedQty',
  },
  {
    title: '已发货金额',
    dataIndex: 'ShipmentDetail_order_info||ShippedAmount',
    width: 120,
    render: (text: string | undefined) => {
      const amount = text != null ? Number(text) : null
      return amount ? `¥${amount.toFixed(2)}` : '-'
    },
    key: 'ShipmentDetail_order_info||ShippedAmount',
  },
  {
    title: '发货日期',
    dataIndex: 'ShipmentDetail_order_info||ShipmentDate',
    width: 160,
    key: 'ShipmentDetail_order_info||ShipmentDate',
    render: (date: string | undefined) => (date ? date.split('T')[0] : '-'),
  },
  {
    title: '批次号',
    dataIndex: 'ShipmentDetail_order_info||BatchNo',
    width: 150,
    key: 'ShipmentDetail_order_info||BatchNo',
  },
]

export default {
  data: [
    {
      Status: 'CREATED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0014',
          ProductName: {
            en: null,
            'zh-cn': '桌面收纳盒',
          },
          Qty: 1,
          Amount: 3,
          Unit: '个',
        },
        {
          LineID: 'line_0019',
          ProductName: {
            en: null,
            'zh-cn': '护手霜',
          },
          Qty: 1,
          Amount: 6.2,
          Unit: '支',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户A',
      TotalAmount: 3,
      order_id: 'order__info_0021',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0002',
          ShippedAmount: 5.6,
          ProductName: {
            en: '洗手液补充包',
            'zh-cn': '洗手液补充包',
          },
          ShipmentDate: '2025-01-09T15:09:00',
          BatchNo: 'BN20250101-01',
          ShippedQty: 2,
        },
        {
          ShipmentID: 'shipment0027',
          ShippedAmount: 6.2,
          ProductName: {
            en: '护手霜',
            'zh-cn': '护手霜',
          },
          ShipmentDate: '2025-01-09T06:06:00',
          BatchNo: 'BN20250111-02',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0045',
          ShippedAmount: 14.8,
          ProductName: {
            en: 'USB扩展坞',
            'zh-cn': 'USB扩展坞',
          },
          ShipmentDate: '2025-01-19T04:00:00',
          BatchNo: 'BN20250118-03',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0058',
          ShippedAmount: 4.3,
          ProductName: {
            en: '坚果混合装',
            'zh-cn': '坚果混合装',
          },
          ShipmentDate: '2025-01-17T14:05:05',
          BatchNo: 'BN20250118-04',
          ShippedQty: 1,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-01T00:00:00',
      Remark: '新订单',
      _allow_data_read: true,
    },
    {
      Status: 'CONFIRMED',
      SalesOrderLine_order_info: [],
      _allow_data_delete: true,
      CustomerName: '客户B',
      TotalAmount: 6.5,
      order_id: 'order__info_0022',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0004',
          ShippedAmount: 1.2,
          ProductName: {
            en: '苏打饼干',
            'zh-cn': '苏打饼干',
          },
          ShipmentDate: '2025-01-09T12:03:00',
          BatchNo: 'BN20250102-01',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0025',
          ShippedAmount: 3.7,
          ProductName: {
            en: '绿茶饮料500ml',
            'zh-cn': '绿茶饮料500ml',
          },
          ShipmentDate: '2025-01-11T13:05:05',
          BatchNo: 'BN20250110-03',
          ShippedQty: 2,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-02T00:00:00',
      Remark: '等待发货',
      _allow_data_read: true,
    },
    {
      Status: 'PART_SHIPPED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0015',
          ProductName: {
            en: null,
            'zh-cn': '燕麦片',
          },
          Qty: 2,
          Amount: 6.5,
          Unit: '袋',
        },
        {
          LineID: 'line_0020',
          ProductName: {
            en: null,
            'zh-cn': '洗洁精1kg',
          },
          Qty: 1,
          Amount: 5.3,
          Unit: '瓶',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户C',
      TotalAmount: 12,
      order_id: 'order__info_0023',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0001',
          ShippedAmount: 3,
          ProductName: {
            en: '抽纸家庭装',
            'zh-cn': '抽纸家庭装',
          },
          ShipmentDate: '2025-01-01T00:00:06',
          BatchNo: 'BatchNo',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0024',
          ShippedAmount: 3.8,
          ProductName: {
            en: '运动护腕',
            'zh-cn': '运动护腕',
          },
          ShipmentDate: '2025-01-10T04:05:05',
          BatchNo: 'BN20250110-02',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0043',
          ShippedAmount: 4.5,
          ProductName: {
            en: '护发素小瓶',
            'zh-cn': '护发素小瓶',
          },
          ShipmentDate: '2025-01-18T03:00:00',
          BatchNo: 'BN20250118-01',
          ShippedQty: 2,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-03T00:00:00',
      Remark: '部分发货',
      _allow_data_read: true,
    },
    {
      Status: 'SHIPPED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0001',
          ProductName: {
            en: null,
            'zh-cn': '抽纸家庭装',
          },
          Qty: 1,
          Amount: 3,
          Unit: '包',
        },
        {
          LineID: 'line_0004',
          ProductName: {
            en: null,
            'zh-cn': '蓝牙耳机',
          },
          Qty: 1,
          Amount: 9.9,
          Unit: '件',
        },
        {
          LineID: 'line_0021',
          ProductName: {
            en: null,
            'zh-cn': '橡皮擦',
          },
          Qty: 2,
          Amount: 0.6,
          Unit: '块',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户D',
      TotalAmount: 8,
      order_id: 'order__info_0024',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0015',
          ShippedAmount: 2.2,
          ProductName: {
            en: '巧克力棒',
            'zh-cn': '巧克力棒',
          },
          ShipmentDate: '2025-01-07T04:04:00',
          BatchNo: 'BN20250107-01',
          ShippedQty: 2,
        },
        {
          ShipmentID: 'shipment0028',
          ShippedAmount: 3.4,
          ProductName: {
            en: '润唇膏',
            'zh-cn': '润唇膏',
          },
          ShipmentDate: '2025-01-12T05:06:00',
          BatchNo: 'BN20250112-01',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0030',
          ShippedAmount: 4.5,
          ProductName: {
            en: '厨房去污剂',
            'zh-cn': '厨房去污剂',
          },
          ShipmentDate: '2025-01-13T06:05:06',
          BatchNo: 'BN20250113-01',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0031',
          ShippedAmount: 0.6,
          ProductName: {
            en: '橡皮擦',
            'zh-cn': '橡皮擦',
          },
          ShipmentDate: '2025-01-13T05:05:00',
          BatchNo: 'BN20250113-02',
          ShippedQty: 2,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-04T00:07:00',
      Remark: '全部发货',
      _allow_data_read: true,
    },
    {
      Status: 'CLOSED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0005',
          ProductName: {
            en: null,
            'zh-cn': '酒精湿巾',
          },
          Qty: 3,
          Amount: 2.1,
          Unit: '包',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户E',
      TotalAmount: 10,
      order_id: 'order__info_0025',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0008',
          ShippedAmount: 8,
          ProductName: {
            en: '厨房垃圾袋',
            'zh-cn': '厨房垃圾袋',
          },
          ShipmentDate: '2025-01-04T00:00:00',
          BatchNo: 'BN20250103-03',
          ShippedQty: 4,
        },
        {
          ShipmentID: 'shipment0022',
          ShippedAmount: 2.9,
          ProductName: {
            en: 'USB充电线',
            'zh-cn': 'USB充电线',
          },
          ShipmentDate: '2025-01-10T02:03:04',
          BatchNo: 'BN20250109-02',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0029',
          ShippedAmount: 5,
          ProductName: {
            en: '洗洁精1kg',
            'zh-cn': '洗洁精1kg',
          },
          ShipmentDate: '2025-01-13T18:07:00',
          BatchNo: 'BN20250112-02',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0035',
          ShippedAmount: 2.1,
          ProductName: {
            en: '茶水过滤器',
            'zh-cn': '茶水过滤器',
          },
          ShipmentDate: '2025-01-15T14:00:00',
          BatchNo: 'BN20250115-01',
          ShippedQty: 1,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-05T00:00:00',
      Remark: '已关闭',
      _allow_data_read: true,
    },
    {
      Status: 'CREATED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0002',
          ProductName: {
            en: null,
            'zh-cn': '有机牛奶1L',
          },
          Qty: 2,
          Amount: 5.2,
          Unit: '瓶',
        },
        {
          LineID: 'line_0003',
          ProductName: {
            en: null,
            'zh-cn': '苏打饼干',
          },
          Qty: 1,
          Amount: 1.3,
          Unit: '包',
        },
        {
          LineID: 'line_0007',
          ProductName: {
            en: null,
            'zh-cn': '黑咖啡速溶',
          },
          Qty: 2,
          Amount: 7.2,
          Unit: '盒',
        },
        {
          LineID: 'line_0013',
          ProductName: {
            en: null,
            'zh-cn': '无线键盘',
          },
          Qty: 1,
          Amount: 12,
          Unit: '套',
        },
        {
          LineID: 'line_0022',
          ProductName: {
            en: null,
            'zh-cn': '纸巾便携装',
          },
          Qty: 3,
          Amount: 3.9,
          Unit: '包',
        },
        {
          LineID: 'line_0023',
          ProductName: {
            en: null,
            'zh-cn': '咖啡挂耳',
          },
          Qty: 1,
          Amount: 9.1,
          Unit: '盒',
        },
        {
          LineID: 'line_0028',
          ProductName: {
            en: null,
            'zh-cn': 'USB扩展坞',
          },
          Qty: 1,
          Amount: 14.8,
          Unit: '个',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户A',
      TotalAmount: 4.2,
      order_id: 'order__info_0026',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0003',
          ShippedAmount: 6.4,
          ProductName: {
            en: '有机牛奶1L',
            'zh-cn': '有机牛奶1L',
          },
          ShipmentDate: '2025-01-02T05:04:00',
          BatchNo: 'BN20250101-02',
          ShippedQty: 2,
        },
        {
          ShipmentID: 'shipment0007',
          ShippedAmount: 3.2,
          ProductName: {
            en: '电池5号',
            'zh-cn': '电池5号',
          },
          ShipmentDate: '2025-01-16T00:00:00',
          BatchNo: 'BN20250103-02',
          ShippedQty: 2,
        },
        {
          ShipmentID: 'shipment0017',
          ShippedAmount: 12.5,
          ProductName: {
            en: '无线键盘',
            'zh-cn': '无线键盘',
          },
          ShipmentDate: '2025-01-08T04:05:00',
          BatchNo: 'BN20250107-03',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0032',
          ShippedAmount: 9.1,
          ProductName: {
            en: '咖啡挂耳',
            'zh-cn': '咖啡挂耳',
          },
          ShipmentDate: '2025-01-14T05:00:00',
          BatchNo: 'BN20250113-03',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0037',
          ShippedAmount: 2.2,
          ProductName: {
            en: '芝士片',
            'zh-cn': '芝士片',
          },
          ShipmentDate: '2025-01-16T03:14:05',
          BatchNo: 'BN20250116-01',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0052',
          ShippedAmount: 2.4,
          ProductName: {
            en: '办公剪刀',
            'zh-cn': '办公剪刀',
          },
          ShipmentDate: '2025-01-08T05:16:07',
          BatchNo: 'BN20250105-03',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0054',
          ShippedAmount: 8.3,
          ProductName: {
            en: '夜用面膜',
            'zh-cn': '夜用面膜',
          },
          ShipmentDate: '2025-01-12T05:06:06',
          BatchNo: 'BN20250110-04',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0057',
          ShippedAmount: 3.6,
          ProductName: {
            en: '烧烤味薯条',
            'zh-cn': '烧烤味薯条',
          },
          ShipmentDate: '2025-01-18T00:06:06',
          BatchNo: 'BN20250117-04',
          ShippedQty: 2,
        },
        {
          ShipmentID: 'shipment0059',
          ShippedAmount: 4.2,
          ProductName: {
            en: '柠檬茶饮料',
            'zh-cn': '柠檬茶饮料',
          },
          ShipmentDate: '2025-01-24T22:04:04',
          BatchNo: 'BN20250120-04',
          ShippedQty: 2,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-06T00:00:00',
      Remark: '新订单',
      _allow_data_read: true,
    },
    {
      Status: 'CONFIRMED',
      SalesOrderLine_order_info: [],
      _allow_data_delete: true,
      CustomerName: '客户F',
      TotalAmount: 7.8,
      order_id: 'order__info_0027',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0016',
          ShippedAmount: 3.8,
          ProductName: {
            en: '能量饮料',
            'zh-cn': '能量饮料',
          },
          ShipmentDate: '2025-01-07T07:04:00',
          BatchNo: 'BN20250107-02',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0034',
          ShippedAmount: 6.5,
          ProductName: {
            en: '保温杯',
            'zh-cn': '保温杯',
          },
          ShipmentDate: '2025-01-15T05:06:00',
          BatchNo: 'BN20250114-02',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0051',
          ShippedAmount: 4.9,
          ProductName: {
            en: '花生牛轧糖',
            'zh-cn': '花生牛轧糖',
          },
          ShipmentDate: '2025-01-05T05:15:06',
          BatchNo: 'BN20250120-03',
          ShippedQty: 2,
        },
        {
          ShipmentID: 'shipment0053',
          ShippedAmount: 1.8,
          ProductName: {
            en: '桌面清洁刷',
            'zh-cn': '桌面清洁刷',
          },
          ShipmentDate: '2025-01-10T23:57:00',
          BatchNo: 'BN20250108-04',
          ShippedQty: 1,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-07T00:00:00',
      Remark: '审核通过',
      _allow_data_read: true,
    },
    {
      Status: 'PART_SHIPPED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0006',
          ProductName: {
            en: null,
            'zh-cn': '厨房垃圾袋',
          },
          Qty: 4,
          Amount: 8,
          Unit: '卷',
        },
        {
          LineID: 'line_0025',
          ProductName: {
            en: null,
            'zh-cn': '原味酸奶',
          },
          Qty: 2,
          Amount: 2.9,
          Unit: '杯',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户G',
      TotalAmount: 15,
      order_id: 'order__info_0028',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0005',
          ShippedAmount: 10.8,
          ProductName: {
            en: '蓝牙耳机',
            'zh-cn': '蓝牙耳机',
          },
          ShipmentDate: '2025-01-18T00:03:00',
          BatchNo: 'BN20250102-02',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0006',
          ShippedAmount: 2.4,
          ProductName: {
            en: '湿巾80抽',
            'zh-cn': '湿巾80抽',
          },
          ShipmentDate: '2025-01-18T00:04:00',
          BatchNo: 'BN20250103-01',
          ShippedQty: 3,
        },
        {
          ShipmentID: 'shipment0019',
          ShippedAmount: 4.5,
          ProductName: {
            en: '数据线Type-C',
            'zh-cn': '数据线Type-C',
          },
          ShipmentDate: '2025-01-08T03:16:13',
          BatchNo: 'BN20250108-02',
          ShippedQty: 2,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-08T00:00:00',
      Remark: '部分出库',
      _allow_data_read: true,
    },
    {
      Status: 'SHIPPED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0027',
          ProductName: {
            en: null,
            'zh-cn': '洗发水小瓶旅行装',
          },
          Qty: 3,
          Amount: 9.9,
          Unit: '瓶',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户H',
      TotalAmount: 9.5,
      order_id: 'order__info_0029',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0009',
          ShippedAmount: 2.8,
          ProductName: {
            en: '保鲜膜',
            'zh-cn': '保鲜膜',
          },
          ShipmentDate: '2025-01-04T00:00:00',
          BatchNo: 'BN20250104-01',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0018',
          ShippedAmount: 2.8,
          ProductName: {
            en: '桌面收纳盒',
            'zh-cn': '桌面收纳盒',
          },
          ShipmentDate: '2025-01-08T04:04:04',
          BatchNo: 'BN20250108-01',
          ShippedQty: 1,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-09T00:00:00',
      Remark: '完成发货',
      _allow_data_read: true,
    },
    {
      Status: 'CLOSED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0008',
          ProductName: {
            en: null,
            'zh-cn': '葡萄干',
          },
          Qty: 1,
          Amount: 2.8,
          Unit: '袋',
        },
        {
          LineID: 'line_0024',
          ProductName: {
            en: null,
            'zh-cn': '保温杯',
          },
          Qty: 1,
          Amount: 6.6,
          Unit: '个',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户B',
      TotalAmount: 5,
      order_id: 'order__info_0030',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0021',
          ShippedAmount: 3.2,
          ProductName: {
            en: '谷物早餐',
            'zh-cn': '谷物早餐',
          },
          ShipmentDate: '2025-01-09T03:04:04',
          BatchNo: 'BN20250109-01',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0033',
          ShippedAmount: 3.9,
          ProductName: {
            en: '便携纸巾',
            'zh-cn': '便携纸巾',
          },
          ShipmentDate: '2025-01-14T03:00:00',
          BatchNo: 'BN20250114-01',
          ShippedQty: 3,
        },
        {
          ShipmentID: 'shipment0049',
          ShippedAmount: 3.1,
          ProductName: {
            en: '芝士蛋糕小盒',
            'zh-cn': '芝士蛋糕小盒',
          },
          ShipmentDate: '2025-01-20T07:07:07',
          BatchNo: 'BN20250120-01',
          ShippedQty: 1,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-10T00:00:00',
      Remark: '客户取消',
      _allow_data_read: true,
    },
    {
      Status: 'CREATED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0009',
          ProductName: {
            en: null,
            'zh-cn': '儿童牙膏',
          },
          Qty: 1,
          Amount: 2.9,
          Unit: '支',
        },
        {
          LineID: 'line_0030',
          ProductName: {
            en: null,
            'zh-cn': '面包切片',
          },
          Qty: 2,
          Amount: 3.5,
          Unit: '袋',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户C',
      TotalAmount: 3.8,
      order_id: 'order__info_0031',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0038',
          ShippedAmount: 1.4,
          ProductName: {
            en: '早安面包',
            'zh-cn': '早安面包',
          },
          ShipmentDate: '2025-01-16T04:05:05',
          BatchNo: 'BN20250116-02',
          ShippedQty: 1,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-11T00:00:00',
      Remark: '新订单',
      _allow_data_read: true,
    },
    {
      Status: 'CONFIRMED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0016',
          ProductName: {
            en: null,
            'zh-cn': 'USB充电线',
          },
          Qty: 1,
          Amount: 2.8,
          Unit: '条',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户D',
      TotalAmount: 6.2,
      order_id: 'order__info_0032',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0039',
          ShippedAmount: 4.5,
          ProductName: {
            en: '运动袜',
            'zh-cn': '运动袜',
          },
          ShipmentDate: '2025-01-17T04:04:05',
          BatchNo: 'BN20250116-03',
          ShippedQty: 2,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-12T00:00:00',
      Remark: '待出库',
      _allow_data_read: true,
    },
    {
      Status: 'PART_SHIPPED',
      SalesOrderLine_order_info: [],
      _allow_data_delete: true,
      CustomerName: '客户I',
      TotalAmount: 11.3,
      order_id: 'order__info_0033',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0036',
          ShippedAmount: 3,
          ProductName: {
            en: '原味酸奶',
            'zh-cn': '原味酸奶',
          },
          ShipmentDate: '2025-01-16T23:06:00',
          BatchNo: 'BN20250115-02',
          ShippedQty: 2,
        },
        {
          ShipmentID: 'shipment0048',
          ShippedAmount: 3.5,
          ProductName: {
            en: '面包切片',
            'zh-cn': '面包切片',
          },
          ShipmentDate: '2025-01-20T05:06:06',
          BatchNo: 'BN20250119-03',
          ShippedQty: 2,
        },
        {
          ShipmentID: 'shipment0060',
          ShippedAmount: 2.4,
          ProductName: {
            en: '键盘清洁泥',
            'zh-cn': '键盘清洁泥',
          },
          ShipmentDate: '2025-01-03T04:08:04',
          BatchNo: 'BN20250111-03',
          ShippedQty: 1,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-13T00:00:00',
      Remark: '正在处理',
      _allow_data_read: true,
    },
    {
      Status: 'SHIPPED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0012',
          ProductName: {
            en: null,
            'zh-cn': '巧克力棒',
          },
          Qty: 2,
          Amount: 2.3,
          Unit: '根',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户J',
      TotalAmount: 13,
      order_id: 'order__info_0034',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0010',
          ShippedAmount: 7.1,
          ProductName: {
            en: '黑咖啡速溶',
            'zh-cn': '黑咖啡速溶',
          },
          ShipmentDate: '2025-01-05T04:00:00',
          BatchNo: 'BN20250104-02',
          ShippedQty: 2,
        },
        {
          ShipmentID: 'shipment0012',
          ShippedAmount: 3.1,
          ProductName: {
            en: '儿童牙膏',
            'zh-cn': '儿童牙膏',
          },
          ShipmentDate: '2025-01-06T03:00:00',
          BatchNo: 'BN20250105-02',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0040',
          ShippedAmount: 2.8,
          ProductName: {
            en: '毛巾',
            'zh-cn': '毛巾',
          },
          ShipmentDate: '2025-01-17T06:06:00',
          BatchNo: 'BN20250117-01',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0042',
          ShippedAmount: 9.8,
          ProductName: {
            en: '旅行装洗发水',
            'zh-cn': '旅行装洗发水',
          },
          ShipmentDate: '2025-01-18T07:00:00',
          BatchNo: 'BN20250117-03',
          ShippedQty: 3,
        },
        {
          ShipmentID: 'shipment0047',
          ShippedAmount: 2.2,
          ProductName: {
            en: '薯片90g',
            'zh-cn': '薯片90g',
          },
          ShipmentDate: '2025-01-19T05:00:00',
          BatchNo: 'BN20250119-02',
          ShippedQty: 1,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-14T00:00:00',
      Remark: '已发完',
      _allow_data_read: true,
    },
    {
      Status: 'CLOSED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0011',
          ProductName: {
            en: null,
            'zh-cn': '运动水杯',
          },
          Qty: 1,
          Amount: 5.5,
          Unit: '个',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户K',
      TotalAmount: 6.6,
      order_id: 'order__info_0035',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0044',
          ShippedAmount: 3.5,
          ProductName: {
            en: '便携剃须刀',
            'zh-cn': '便携剃须刀',
          },
          ShipmentDate: '2025-01-18T04:00:00',
          BatchNo: 'BN20250118-02',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0046',
          ShippedAmount: 9.5,
          ProductName: {
            en: '蓝牙音箱',
            'zh-cn': '蓝牙音箱',
          },
          ShipmentDate: '2025-01-19T05:00:00',
          BatchNo: 'BN20250119-01',
          ShippedQty: 1,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-15T00:00:00',
      Remark: '系统关闭',
      _allow_data_read: true,
    },
    {
      Status: 'CREATED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0010',
          ProductName: {
            en: null,
            'zh-cn': '软毛牙刷',
          },
          Qty: 1,
          Amount: 1.3,
          Unit: '支',
        },
        {
          LineID: 'line_0017',
          ProductName: {
            en: null,
            'zh-cn': '儿童饼干',
          },
          Qty: 1,
          Amount: 2.2,
          Unit: '盒',
        },
        {
          LineID: 'line_0026',
          ProductName: {
            en: null,
            'zh-cn': '运动袜',
          },
          Qty: 2,
          Amount: 4.4,
          Unit: '双',
        },
        {
          LineID: 'line_0029',
          ProductName: {
            en: null,
            'zh-cn': '零食薯片',
          },
          Qty: 1,
          Amount: 2.2,
          Unit: '袋',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户L',
      TotalAmount: 2.9,
      order_id: 'order__info_0036',
      ShipmentDetail_order_info: [],
      _allow_data_update: true,
      OrderDate: '2025-01-16T00:00:00',
      Remark: '新单待审核',
      _allow_data_read: true,
    },
    {
      Status: 'CONFIRMED',
      SalesOrderLine_order_info: [
        {
          LineID: 'line_0018',
          ProductName: {
            en: null,
            'zh-cn': '绿茶饮料500ml',
          },
          Qty: 2,
          Amount: 3.8,
          Unit: '瓶',
        },
        {
          LineID: 'line_0031',
          ProductName: {
            en: null,
            'zh-cn': 'xx',
          },
          Qty: 3,
          Amount: 4,
          Unit: '袋',
        },
      ],
      _allow_data_delete: true,
      CustomerName: '客户M',
      TotalAmount: 4.4,
      order_id: 'order__info_0037',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0011',
          ShippedAmount: 2.9,
          ProductName: {
            en: '葡萄干200g',
            'zh-cn': '葡萄干200g',
          },
          ShipmentDate: '2025-01-05T06:00:00',
          BatchNo: 'BN20250105-01',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0013',
          ShippedAmount: 1.5,
          ProductName: {
            en: '洗脸巾',
            'zh-cn': '洗脸巾',
          },
          ShipmentDate: '2025-01-06T05:00:00',
          BatchNo: 'BN20250106-01',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0014',
          ShippedAmount: 5.4,
          ProductName: {
            en: '运动水杯',
            'zh-cn': '运动水杯',
          },
          ShipmentDate: '2025-01-07T05:06:00',
          BatchNo: 'BN20250106-02',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0041',
          ShippedAmount: 1.9,
          ProductName: {
            en: '运动头带',
            'zh-cn': '运动头带',
          },
          ShipmentDate: '2025-01-17T04:00:00',
          BatchNo: 'BN20250117-02',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0050',
          ShippedAmount: 2.6,
          ProductName: {
            en: '苹果罐头',
            'zh-cn': '苹果罐头',
          },
          ShipmentDate: '2025-01-20T07:07:07',
          BatchNo: 'BN20250120-02',
          ShippedQty: 1,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-17T00:00:00',
      Remark: '等发货',
      _allow_data_read: true,
    },
    {
      Status: 'PART_SHIPPED',
      SalesOrderLine_order_info: [],
      _allow_data_delete: true,
      CustomerName: '客户N',
      TotalAmount: 9.9,
      order_id: 'order__info_0038',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0020',
          ShippedAmount: 6.3,
          ProductName: {
            en: '燕麦片1kg',
            'zh-cn': '燕麦片1kg',
          },
          ShipmentDate: '2025-01-09T03:04:04',
          BatchNo: 'BN20250108-03',
          ShippedQty: 2,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-18T00:00:00',
      Remark: '部分完成',
      _allow_data_read: true,
    },
    {
      Status: 'SHIPPED',
      SalesOrderLine_order_info: [],
      _allow_data_delete: true,
      CustomerName: '客户O',
      TotalAmount: 14.8,
      order_id: 'order__info_0039',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0026',
          ShippedAmount: 2.4,
          ProductName: {
            en: '矿泉水550ml',
            'zh-cn': '矿泉水550ml',
          },
          ShipmentDate: '2025-02-22T15:15:00',
          BatchNo: 'BN20250111-01',
          ShippedQty: 3,
        },
        {
          ShipmentID: 'shipment0055',
          ShippedAmount: 6.2,
          ProductName: {
            en: '抹茶粉',
            'zh-cn': '抹茶粉',
          },
          ShipmentDate: '2025-01-24T05:06:06',
          BatchNo: 'BN20250112-03',
          ShippedQty: 1,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-19T00:00:00',
      Remark: '已出库',
      _allow_data_read: true,
    },
    {
      Status: 'CLOSED',
      SalesOrderLine_order_info: [],
      _allow_data_delete: true,
      CustomerName: '客户P',
      TotalAmount: 3.5,
      order_id: 'order__info_0040',
      ShipmentDetail_order_info: [
        {
          ShipmentID: 'shipment0023',
          ShippedAmount: 2.2,
          ProductName: {
            en: '儿童饼干',
            'zh-cn': '儿童饼干',
          },
          ShipmentDate: '2025-01-10T04:04:04',
          BatchNo: 'BN20250110-01',
          ShippedQty: 1,
        },
        {
          ShipmentID: 'shipment0056',
          ShippedAmount: 3.4,
          ProductName: {
            en: '润肤乳小瓶',
            'zh-cn': '润肤乳小瓶',
          },
          ShipmentDate: '2025-01-17T05:14:06',
          BatchNo: 'BN20250114-03',
          ShippedQty: 1,
        },
      ],
      _allow_data_update: true,
      OrderDate: '2025-01-20T00:00:00',
      Remark: '订单结束',
      _allow_data_read: true,
    },
  ],
}
