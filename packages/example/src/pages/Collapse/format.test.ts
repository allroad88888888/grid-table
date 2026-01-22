import { flattenData } from './format'
import mockData from './mock'

describe('flattenData', () => {
  it('should flatten the first item correctly based on user requirement', () => {
    const firstItem = mockData.data[0]

    const { data: result, columns } = flattenData(
      [firstItem],
      ['SalesOrderLine_order_info', 'ShipmentDetail_order_info'],
    )

    expect(result).toHaveLength(4)

    // 验证返回的 columns 是否包含预期的列名
    expect(columns).toContain('Status')
    expect(columns).toContain('SalesOrderLine_order_info||LineID')
    expect(columns).toContain('ShipmentDetail_order_info||ShipmentID')
    // 验证不应该包含被移除的数组列名
    expect(columns).not.toContain('SalesOrderLine_order_info')
    expect(columns).not.toContain('ShipmentDetail_order_info')

    // 验证第一行，包含 Sales[0] 和 Shipment[0]
    // Sales[0] ProductName 是 桌面收纳盒
    // Shipment[0] ProductName 是 洗手液补充包
    expect(result[0]).toMatchObject({
      Status: 'CREATED',
      'SalesOrderLine_order_info||LineID': 'line_0014',
      'SalesOrderLine_order_info||Amount': 3,
      'SalesOrderLine_order_info||ProductName': {
        en: null,
        'zh-cn': '桌面收纳盒',
      },
      'ShipmentDetail_order_info||ShipmentID': 'shipment0002',
      'ShipmentDetail_order_info||ShippedAmount': 5.6,
      'ShipmentDetail_order_info||ProductName': {
        en: '洗手液补充包',
        'zh-cn': '洗手液补充包',
      },
    })

    // 验证第二行，包含 Sales[1] 和 Shipment[1]
    expect(result[1]).toMatchObject({
      Status: 'CREATED',
      'SalesOrderLine_order_info||LineID': 'line_0019',
      'ShipmentDetail_order_info||ShipmentID': 'shipment0027',
    })

    // 验证第三行，Sales 用完，只有 Shipment[2]
    expect(result[2]).toMatchObject({
      Status: 'CREATED',
      'ShipmentDetail_order_info||ShipmentID': 'shipment0045',
    })
    // 确认 Sales 字段不存在
    expect(result[2]['SalesOrderLine_order_info||LineID']).toBeUndefined()

    // 验证第四行，Sales 用完，只有 Shipment[3]
    expect(result[3]).toMatchObject({
      Status: 'CREATED',
      'ShipmentDetail_order_info||ShipmentID': 'shipment0058',
    })
  })
})
