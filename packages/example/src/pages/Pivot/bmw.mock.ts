export default {
  dataCfg: {
    fields: {
      rows: ['level'],
      columns: ['group'],
      values: ['value'],
    },
    meta: [
      {
        field: 'group',
        name: '人群',
      },
      {
        field: 'level',
        name: '收入水平',
      },
    ],
    data: [
      {
        group: '青年',
        level: '高收入',
        value: {
          label: '青年高收入人群',
          values: [
            ['月初信用卡支出', 40000, '+3%', '+500'],
            ['月初信用卡分期', 50000, '+2%', '+100'],
            ['月初信用卡额度', 80000, '+20%', '+1000'],
          ],
        },
      },
      {
        group: '青年',
        level: '中收入',
        value: {
          label: '青年中收入人群',
          values: [
            ['月初信用卡支出', 4000, '+3%', '+500'],
            ['月初信用卡分期', 2000, '-3%', '-1500'],
            ['月初信用卡额度', 3000, '+1%', '+500'],
          ],
        },
      },
      {
        group: '青年',
        level: '低收入',
        value: {
          label: '青年低收入人群',
          values: [
            ['月初信用卡支出', 1000, '-50%', '-1000'],
            ['月初信用卡分期', 2000, '-23%', '-1500'],
            ['月初信用卡额度', 3000, '+1%', '200'],
          ],
        },
      },
      {
        group: '中年',
        level: '高收入',
        value: {
          label: '中年高收入人群',
          values: [
            ['月初信用卡支出', 20000, '+53%', '+1500'],
            ['月初信用卡分期', 50000, '+23%', '+500'],
            ['月初信用卡额度', 400000, '+23%', '+500'],
          ],
        },
      },
      {
        group: '中年',
        level: '中收入',
        value: {
          label: '中年中收入人群',
          values: [
            ['月初信用卡支出', 1000, '+23%', '+500'],
            ['月初信用卡分期', 2000, '+23%', '+500'],
            ['月初信用卡额度', 3000, '+23%', '+500'],
          ],
        },
      },
      {
        group: '中年',
        level: '低收入',
        value: {
          label: '中年低收入人群',
          values: [
            ['月初信用卡支出', 100, '-10%', '-500'],
            ['月初信用卡分期', 2000, '+23%', '+100'],
            ['月初信用卡额度', 4000, '+2%', '100'],
          ],
        },
      },
      {
        group: '老年',
        level: '高收入',
        value: {
          label: '老年高收入人群',
          values: [
            ['月初信用卡支出', 40000, '+20%', '+1500'],
            ['月初信用卡分期', 50000, '+13%', '+2500'],
            ['月初信用卡额度', 90000, '-1%', '1000'],
          ],
        },
      },
      {
        group: '老年',
        level: '中收入',
        value: {
          label: '老年中收入人群',
          values: [
            ['月初信用卡支出', 2000, '-4%', '-2500'],
            ['月初信用卡分期', 1500, '-43%', '-2300'],
            ['月初信用卡额度', 3000, '+1%', '100'],
          ],
        },
      },
      {
        group: '老年',
        level: '低收入',
        value: {
          label: '老年低收入人群',
          values: [
            ['月初信用卡支出', 100, '-30%', '-100'],
            ['月初信用卡分期', 0, '-10%', '-500'],
            ['月初信用卡额度', 1000, '+23%', '+500'],
          ],
        },
      },
    ],
  },
  drillDownDataCfg: {
    fields: {
      rows: ['type'],
      columns: ['level'],
      values: ['value'],
    },
    meta: [
      {
        field: 'type',
        name: '商品类别',
      },
      {
        field: 'level',
        name: '城市等级',
      },
    ],
    data: [
      {
        level: '一线城市',
        type: '服饰鞋包',
        value: {
          label: '一线城市服饰鞋包',
          values: [
            ['月初信用卡支出', 40000, '+3%', '+500'],
            ['月初信用卡分期', 50000, '+2%', '+100'],
            ['月初信用卡额度', 80000, '+20%', '+1000'],
          ],
        },
      },
      {
        level: '一线城市',
        type: '家居家电',
        value: {
          label: '一线城市家居家电',
          values: [
            ['月初信用卡支出', 4000, '+3%', '+500'],
            ['月初信用卡分期', 2000, '-3%', '-1500'],
            ['月初信用卡额度', 3000, '+1%', '+500'],
          ],
        },
      },
      {
        level: '一线城市',
        type: '其他',
        value: {
          label: '一线城市其他',
          values: [
            ['月初信用卡支出', 1000, '-50%', '-1000'],
            ['月初信用卡分期', 2000, '-23%', '-1500'],
            ['月初信用卡额度', 3000, '+1%', '200'],
          ],
        },
      },
      {
        level: '二线城市',
        type: '其他',
        value: {
          label: '二线城市其他',
          values: [
            ['月初信用卡支出', 20000, '+53%', '+1500'],
            ['月初信用卡分期', 50000, '+23%', '+500'],
            ['月初信用卡额度', 400000, '+23%', '+500'],
          ],
        },
      },
      {
        level: '二线城市',
        type: '家居家电',
        value: {
          label: '二线城市家居家电',
          values: [
            ['月初信用卡支出', 1000, '+23%', '+500'],
            ['月初信用卡分期', 2000, '+23%', '+500'],
            ['月初信用卡额度', 3000, '+23%', '+500'],
          ],
        },
      },
      {
        level: '二线城市',
        type: '服饰鞋包',
        value: {
          label: '二线城市服饰鞋包',
          values: [
            ['月初信用卡支出', 100, '-10%', '-500'],
            ['月初信用卡分期', 2000, '+23%', '+100'],
            ['月初信用卡额度', 4000, '+2%', '100'],
          ],
        },
      },
      {
        level: '三线城市',
        type: '其他',
        value: {
          label: '三线城市其他',
          values: [
            ['月初信用卡支出', 40000, '+20%', '+1500'],
            ['月初信用卡分期', 50000, '+13%', '+2500'],
            ['月初信用卡额度', 90000, '-1%', '1000'],
          ],
        },
      },
      {
        level: '三线城市',
        type: '家居家电',
        value: {
          label: '三线城市家居家电',
          values: [
            ['月初信用卡支出', 2000, '-4%', '-2500'],
            ['月初信用卡分期', 1500, '-43%', '-2300'],
            ['月初信用卡额度', 3000, '+1%', '100'],
          ],
        },
      },
      {
        level: '三线城市',
        type: '服饰鞋包',
        value: {
          label: '三线城市服饰鞋包',
          values: [
            ['月初信用卡支出', 100, '-30%', '-100'],
            ['月初信用卡分期', 0, '-10%', '-500'],
            ['月初信用卡额度', 1000, '+23%', '+500'],
          ],
        },
      },
    ],
  },
}
