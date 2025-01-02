export default {
  json: [
    {
      budget_plan: 'Simulation_1',
      position: 'CPB-006',
      organization: '60020281',
      fiscal_year: '2024',
      amount: 200.0,
    },
    {
      budget_plan: 'Simulation_1',
      position: 'CPB-006',
      organization: '60020281',
      fiscal_year: '2025',
      amount: 1200.0,
    },
  ],
  description: {
    position: {
      'CPB-006': '销售总监',
    },
    organization: {
      '60020281': '西品全国销售',
    },
  },
  dataCfg: {
    fields: {
      rows: ['organization', 'position'],
      columns: ['fiscal_year'],
      values: ['amount'],
    },
    meta: [
      {
        field: 'position',
        name: 'position',
      },
      {
        field: 'organization',
        name: 'organization',
      },
    ],
    data: [
      {
        budget_plan: 'Simulation_1',
        position: '销售总监',
        organization: '西品全国销售',
        fiscal_year: '2024',
        amount: 200.0,
      },
      {
        budget_plan: 'Simulation_1',
        position: '销售总监',
        organization: '西品全国销售',
        fiscal_year: '2025',
        amount: 1200.0,
      },
    ],
  },
}
