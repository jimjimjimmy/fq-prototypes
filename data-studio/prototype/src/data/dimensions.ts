export type DimensionStatus = 'active' | 'draft' | 'data-quality' | 'orphaned'

export interface DimensionSource {
  id: string
  name: string
  sourceField?: string
}

export interface DimensionValue {
  id: string
  value: string
  recordCount: number
  warning?: string
}

export interface DimensionModelRef {
  id: string
  name: string
  role: 'primary' | 'linked'
  modelField?: string
}

export interface DimensionModel {
  id: string
  name: string
  description: string
  sources: DimensionSource[]
  records: number | null
  modelsUsing: DimensionModelRef[]
  lastUpdated: string | null
  status: DimensionStatus
  dataQualityIssue?: string
  values: DimensionValue[]
}

export const dimensionData: DimensionModel[] = [
  {
    id: 'd-1',
    name: 'Department',
    description: 'Organizational department classification',
    sources: [{ id: 'c-1', name: 'NetSuite (US Entity)', sourceField: 'department_name' }],
    records: 47,
    modelsUsing: [
      { id: 'm-1', name: 'GL Transactions', role: 'primary', modelField: 'department_id' },
      { id: 'm-2', name: 'Trial Balance',   role: 'linked',  modelField: 'department'    },
      { id: 'm-3', name: 'Accounts',        role: 'linked',  modelField: 'dept_id'       },
    ],
    lastUpdated: '2026-04-22',
    status: 'active',
    values: [
      { id: 'dv-1-1', value: 'Engineering',           recordCount: 12450 },
      { id: 'dv-1-2', value: 'Finance',               recordCount: 8230  },
      { id: 'dv-1-3', value: 'Sales',                 recordCount: 5110  },
      { id: 'dv-1-4', value: 'Product',               recordCount: 4120  },
      { id: 'dv-1-5', value: 'Marketing',             recordCount: 3890  },
      { id: 'dv-1-6', value: 'Operations',            recordCount: 2760  },
      { id: 'dv-1-7', value: 'Information Technology',recordCount: 2310  },
      { id: 'dv-1-8', value: 'Customer Success',      recordCount: 1780  },
      { id: 'dv-1-9', value: 'Human Resources',       recordCount: 1540  },
      { id: 'dv-1-10',value: 'Legal',                 recordCount: 980   },
      { id: 'dv-1-11',value: 'Eng',                  recordCount: 23,   warning: "Possible duplicate of 'Engineering'" },
    ],
  },
  {
    id: 'd-2',
    name: 'Cost Center',
    description: 'Business unit cost allocation groupings',
    sources: [
      { id: 'c-1', name: 'NetSuite (US Entity)', sourceField: 'class_name' },
      { id: 'c-2', name: 'NetSuite (UK Entity)', sourceField: 'class_name' },
    ],
    records: 12,
    modelsUsing: [
      { id: 'm-1', name: 'GL Transactions', role: 'primary', modelField: 'class_id'          },
      { id: 'm-4', name: 'Budget Actuals',  role: 'linked',  modelField: 'cost_center_code'  },
    ],
    lastUpdated: '2026-03-15',
    status: 'active',
    values: [
      { id: 'dv-2-1', value: 'Engineering',     recordCount: 8450 },
      { id: 'dv-2-2', value: 'Sales',           recordCount: 6230 },
      { id: 'dv-2-3', value: 'Marketing',       recordCount: 4110 },
      { id: 'dv-2-4', value: 'Product',         recordCount: 3120 },
      { id: 'dv-2-5', value: 'Operations',      recordCount: 3760 },
      { id: 'dv-2-6', value: 'Finance',         recordCount: 2890 },
      { id: 'dv-2-7', value: 'IT',              recordCount: 2310 },
      { id: 'dv-2-8', value: 'Customer Success',recordCount: 1780 },
      { id: 'dv-2-9', value: 'Human Resources', recordCount: 1540 },
      { id: 'dv-2-10',value: 'G&A',             recordCount: 1230 },
      { id: 'dv-2-11',value: 'Executive',       recordCount: 890  },
      { id: 'dv-2-12',value: 'Legal',           recordCount: 980  },
    ],
  },
  {
    id: 'd-3',
    name: 'Region',
    description: 'Geographic region for reporting',
    sources: [{ id: 'c-3', name: 'SFTP — ERP Export', sourceField: 'region_name' }],
    records: 8,
    modelsUsing: [
      { id: 'm-1', name: 'GL Transactions', role: 'linked', modelField: 'region_code' },
      { id: 'm-2', name: 'Trial Balance',   role: 'linked', modelField: 'region'      },
      { id: 'm-3', name: 'Accounts',        role: 'linked', modelField: 'region_id'   },
      { id: 'm-4', name: 'Budget Actuals',  role: 'linked', modelField: 'region_key'  },
      { id: 'm-5', name: 'Headcount',       role: 'linked', modelField: 'region'      },
    ],
    lastUpdated: '2026-04-20',
    status: 'active',
    values: [
      { id: 'dv-3-1', value: 'North America',     recordCount: 45230 },
      { id: 'dv-3-2', value: 'Europe',            recordCount: 28410 },
      { id: 'dv-3-3', value: 'Asia Pacific',      recordCount: 19870 },
      { id: 'dv-3-4', value: 'United Kingdom',    recordCount: 12340 },
      { id: 'dv-3-5', value: 'Latin America',     recordCount: 8650  },
      { id: 'dv-3-6', value: 'Canada',            recordCount: 6780  },
      { id: 'dv-3-7', value: 'Middle East & Africa',recordCount: 4120 },
      { id: 'dv-3-8', value: 'Australia & NZ',    recordCount: 3290  },
      { id: 'dv-3-9', value: 'NA',               recordCount: 142,  warning: "Possible duplicate of 'North America'" },
      { id: 'dv-3-10',value: 'APAC',             recordCount: 38,   warning: "Possible duplicate of 'Asia Pacific'" },
    ],
  },
  {
    id: 'd-4',
    name: 'Account Type',
    description: 'Classification of account categories',
    sources: [{ id: 'c-3', name: 'SFTP — ERP Export', sourceField: 'account_type_name' }],
    records: 24,
    modelsUsing: [{ id: 'm-3', name: 'Accounts', role: 'primary', modelField: 'acct_type_id' }],
    lastUpdated: '2026-04-18',
    status: 'data-quality',
    dataQualityIssue: '3 duplicate key values detected',
    values: [
      { id: 'dv-4-1', value: 'Revenue',                  recordCount: 15230 },
      { id: 'dv-4-2', value: 'Cost of Revenue',          recordCount: 8410  },
      { id: 'dv-4-3', value: 'Sales & Marketing',        recordCount: 12870 },
      { id: 'dv-4-4', value: 'Research & Development',   recordCount: 9650  },
      { id: 'dv-4-5', value: 'General & Administrative', recordCount: 4120  },
      { id: 'dv-4-6', value: 'Other Operating',          recordCount: 2340  },
      { id: 'dv-4-7', value: 'Interest Expense',         recordCount: 1230  },
      { id: 'dv-4-8', value: 'Tax',                      recordCount: 980   },
      { id: 'dv-4-9', value: 'S&M',                      recordCount: 0,    warning: "Duplicate key — shares key 'SM01' with 'Sales & Marketing'" },
      { id: 'dv-4-10',value: 'R&D',                      recordCount: 0,    warning: "Duplicate key — shares key 'RD01' with 'Research & Development'" },
      { id: 'dv-4-11',value: 'G&A',                      recordCount: 0,    warning: "Duplicate key — shares key 'GA01' with 'General & Administrative'" },
    ],
  },
  {
    id: 'd-5',
    name: 'Product Line',
    description: 'Product and service line groupings',
    sources: [{ id: 'c-4', name: 'Manual Upload', sourceField: 'product_line_name' }],
    records: 15,
    modelsUsing: [],
    lastUpdated: '2026-02-10',
    status: 'orphaned',
    values: [
      { id: 'dv-5-1', value: 'Close Management',    recordCount: 0 },
      { id: 'dv-5-2', value: 'Flux Analysis',       recordCount: 0 },
      { id: 'dv-5-3', value: 'Compliance',          recordCount: 0 },
      { id: 'dv-5-4', value: 'Consolidation',       recordCount: 0 },
      { id: 'dv-5-5', value: 'Data Studio',         recordCount: 0 },
      { id: 'dv-5-6', value: 'Reporting',           recordCount: 0 },
    ],
  },
]

export function getDimensionById(id: string): DimensionModel | undefined {
  return dimensionData.find(d => d.id === id)
}

export function formatDimensionDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
