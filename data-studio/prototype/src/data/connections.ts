export type SourceType = 'QBO Basic' | 'QBO Enhanced' | 'sFTP' | 'API Connector' | 'NetSuite Enhanced' | 'Intacct Enhanced' | 'Workday'
export type ConnectionStatus = 'Connected' | 'Connecting' | 'Error' | 'Paused' | 'Syncing' | 'Warning' | 'Initial Data Load'
export type ErrorType = 'oauth_expired' | 'auth_error' | 'rate_limit'
export type EndpointStatus = 'Active' | 'Inactive' | 'Error'

export interface QueryParam {
  key: string
  label: string
  description: string
  formatHint?: string
  type: 'text' | 'date' | 'select'
  options?: string[]
  required?: boolean
  defaultValue?: string
}

export interface EndpointDef {
  id: string
  name: string
  apiPath: string
  description: string
  dataObjects: string[]
  status: EndpointStatus
  lastRun: string
  nextRun: string
  syncFrequency: string
  isStandard?: boolean
  isFromLibrary?: boolean
  queryParams: QueryParam[]
  paramValues?: Record<string, string>
}

export interface LibraryEndpoint {
  id: string
  name: string
  apiPath: string
  description: string
  dataObjects: string[]
  category: string
  queryParams: QueryParam[]
}

export interface SyncLogEntry {
  id: string
  timestamp: string
  dataObject: string
  status: 'Success' | 'Error'
  recordCount: number
  errorCode?: string
}

export interface Connection {
  id: string
  name: string
  sourceType: SourceType
  entities: string[]
  status: ConnectionStatus
  lastSync: string
  errorType?: ErrorType
  errorMessage?: string
  endpoint: {
    name: string
    url: string
    syncFrequency: string
  }
  models: string[]
  syncLog: SyncLogEntry[]
  endpoints: EndpointDef[]
}

/* ── Shared endpoint definitions ── */
const trialBalanceEndpoint: EndpointDef = {
  id: 'ep-tb',
  name: 'TrialBalance',
  apiPath: '/v3/company/{realmId}/reports/TrialBalance',
  description: 'Retrieves a trial balance report summarizing debit/credit totals per account.',
  dataObjects: ['Trial Balance'],
  status: 'Active',
  lastRun: '2026-03-06T14:23:00Z',
  nextRun: '2026-03-06T20:23:00Z',
  syncFrequency: '6hr',
  isStandard: true,
  isFromLibrary: true,
  queryParams: [
    { key: 'accounting_method', label: 'Accounting Method', description: 'Cash or accrual basis.', type: 'select', options: ['Cash', 'Accrual'], defaultValue: 'Accrual', required: true },
    { key: 'start_date', label: 'Start Date', description: 'Beginning of the reporting period.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
    { key: 'end_date', label: 'End Date', description: 'End of the reporting period.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
    { key: 'summarize_column_by', label: 'Summarize Column By', description: 'How to group report columns.', type: 'select', options: ['Total', 'Month', 'Quarter', 'Year'], defaultValue: 'Total' },
  ],
  paramValues: { accounting_method: 'Accrual', start_date: '2026-01-01', end_date: '2026-03-31', summarize_column_by: 'Total' },
}

const accountEndpoint: EndpointDef = {
  id: 'ep-acct',
  name: 'Account',
  apiPath: '/v3/company/{realmId}/query?entity=Account',
  description: 'Fetches the full chart of accounts including type, classification, and balance.',
  dataObjects: ['Accounts'],
  status: 'Active',
  lastRun: '2026-03-06T14:23:00Z',
  nextRun: '2026-03-06T20:23:00Z',
  syncFrequency: '6hr',
  isStandard: true,
  isFromLibrary: true,
  queryParams: [
    { key: 'minorversion', label: 'Minor Version', description: 'QBO API minor version.', type: 'text', defaultValue: '65' },
    { key: 'AccountType', label: 'Account Type Filter', description: 'Filter by account type.', type: 'select', options: ['All', 'Bank', 'Accounts Receivable', 'Fixed Asset', 'Equity', 'Income', 'Expense'], defaultValue: 'All' },
    { key: 'Active', label: 'Active Status', description: 'Return active, inactive, or all.', type: 'select', options: ['Active', 'Inactive', 'All'], defaultValue: 'Active' },
  ],
  paramValues: { minorversion: '65', AccountType: 'All', Active: 'Active' },
}

export const mockConnections: Connection[] = [
  {
    id: 'c1',
    name: 'Acme Corp QBO',
    sourceType: 'QBO Basic',
    entities: ['Acme Corp', 'Acme Subsidiaries'],
    status: 'Connected',
    lastSync: '2026-03-06T14:23:00Z',
    endpoint: { name: 'QBO REST API — Acme Corp', url: 'https://quickbooks.api.intuit.com/v3/company/1234567890', syncFrequency: 'Every 6 hours' },
    models: ['Accounts and Balances'],
    endpoints: [trialBalanceEndpoint, accountEndpoint],
    syncLog: [
      { id: 'sl1', timestamp: '2026-03-06T14:23:00Z', dataObject: 'Accounts', status: 'Success', recordCount: 412 },
      { id: 'sl2', timestamp: '2026-03-06T08:23:00Z', dataObject: 'Balances', status: 'Success', recordCount: 98 },
    ],
  },
  {
    id: 'c2',
    name: 'Beta LLC Enhanced',
    sourceType: 'QBO Enhanced',
    entities: ['Beta LLC'],
    status: 'Syncing',
    lastSync: '2026-03-06T13:45:00Z',
    endpoint: { name: 'Fivetran — Beta LLC', url: 'https://fivetran.com/connectors/beta-llc-qbo', syncFrequency: 'Real-time' },
    models: ['Accounts and Balances', 'Transactions', 'Journal Entries'],
    endpoints: [],
    syncLog: [
      { id: 'sl6', timestamp: '2026-03-06T13:45:00Z', dataObject: 'Transactions', status: 'Success', recordCount: 1842 },
    ],
  },
  {
    id: 'c3',
    name: 'Transaction Delta Upload',
    sourceType: 'sFTP',
    entities: ['Global Ops'],
    status: 'Error',
    lastSync: '2026-03-05T22:11:00Z',
    errorType: 'oauth_expired',
    errorMessage: 'OAuth token expired. Reconnect to resume syncing.',
    endpoint: { name: 'sFTP — Global Ops', url: 'sftp://files.globalops.com/transactions', syncFrequency: 'Daily at 10:00 PM UTC' },
    models: ['Accounts and Balances'],
    endpoints: [{ ...trialBalanceEndpoint, id: 'ep-tb-c3', status: 'Error', lastRun: '2026-03-05T22:11:00Z', nextRun: 'Pending reconnect' }],
    syncLog: [
      { id: 'sl9', timestamp: '2026-03-05T22:11:00Z', dataObject: 'Transaction Files', status: 'Error', recordCount: 0, errorCode: 'AUTH_401' },
    ],
  },
  {
    id: 'c4',
    name: 'Western Region QBO',
    sourceType: 'QBO Enhanced',
    entities: ['Western Region LLC'],
    status: 'Error',
    lastSync: '2026-03-04T10:00:00Z',
    errorType: 'auth_error',
    errorMessage: 'Authorization error. Reconnect and verify QBO permissions.',
    endpoint: { name: 'Fivetran — Western Region', url: 'https://fivetran.com/connectors/western-region-qbo', syncFrequency: 'Every 12 hours' },
    models: ['Accounts and Balances', 'Transactions'],
    endpoints: [],
    syncLog: [
      { id: 'sl12', timestamp: '2026-03-04T10:00:00Z', dataObject: 'Journal Entries', status: 'Error', recordCount: 0, errorCode: 'PERM_403' },
    ],
  },
  {
    id: 'c5',
    name: 'North America Hub',
    sourceType: 'QBO Basic',
    entities: ['NA Hub Inc'],
    status: 'Warning',
    lastSync: '2026-03-06T09:30:00Z',
    errorType: 'rate_limit',
    errorMessage: 'QBO API rate limit reached. Sync will resume automatically.',
    endpoint: { name: 'QBO REST API — NA Hub', url: 'https://quickbooks.api.intuit.com/v3/company/9876543210', syncFrequency: 'Every 6 hours' },
    models: ['Accounts and Balances'],
    endpoints: [trialBalanceEndpoint, accountEndpoint],
    syncLog: [
      { id: 'sl15', timestamp: '2026-03-06T09:30:00Z', dataObject: 'Accounts', status: 'Success', recordCount: 156 },
    ],
  },
  {
    id: 'c6',
    name: 'Midwest Subsidiary',
    sourceType: 'QBO Basic',
    entities: ['Midwest Sub LLC'],
    status: 'Paused',
    lastSync: '2026-03-01T14:00:00Z',
    endpoint: { name: 'QBO REST API — Midwest', url: 'https://quickbooks.api.intuit.com/v3/company/1122334455', syncFrequency: 'Every 6 hours' },
    models: ['Accounts and Balances'],
    endpoints: [{ ...trialBalanceEndpoint, id: 'ep-tb-c6', status: 'Inactive', lastRun: '2026-03-01T14:00:00Z', nextRun: '—' }],
    syncLog: [],
  },
  {
    id: 'c7',
    name: 'EMEA Region Connect',
    sourceType: 'QBO Enhanced',
    entities: ['EMEA Holdings', 'London Branch'],
    status: 'Connecting',
    lastSync: 'Never',
    endpoint: { name: 'Fivetran — EMEA Holdings', url: 'https://fivetran.com/connectors/emea-holdings-qbo', syncFrequency: 'Real-time' },
    models: ['Accounts and Balances', 'Transactions'],
    endpoints: [],
    syncLog: [],
  },
]

export const FQ_ENTITIES = [
  'Acme Corp', 'Beta LLC', 'Global Ops', 'Midwest Sub LLC',
  'NA Hub Inc', 'Western Region LLC', 'EMEA Holdings', 'London Branch',
]

export const LIBRARY_ENDPOINTS: LibraryEndpoint[] = [
  {
    id: 'lib-tb', name: 'TrialBalance', apiPath: '/v3/company/{realmId}/reports/TrialBalance',
    description: 'Retrieves a trial balance report summarizing debit/credit totals per account.',
    dataObjects: ['Trial Balance'], category: 'Reports',
    queryParams: [
      { key: 'accounting_method', label: 'Accounting Method', description: 'Cash or accrual basis.', type: 'select', options: ['Cash', 'Accrual'], defaultValue: 'Accrual', required: true },
      { key: 'start_date', label: 'Start Date', description: 'Beginning of the reporting period.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
      { key: 'end_date', label: 'End Date', description: 'End of the reporting period.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
    ],
  },
  {
    id: 'lib-acct', name: 'Account', apiPath: '/v3/company/{realmId}/query?entity=Account',
    description: 'Fetches the full chart of accounts including type, classification, and current balance.',
    dataObjects: ['Accounts'], category: 'Core Objects',
    queryParams: [
      { key: 'minorversion', label: 'Minor Version', description: 'API minor version; 65 recommended.', type: 'text', defaultValue: '65' },
      { key: 'AccountType', label: 'Account Type Filter', description: 'Filter by a specific QBO account type.', type: 'select', options: ['All', 'Bank', 'Equity', 'Income', 'Expense'], defaultValue: 'All' },
    ],
  },
  {
    id: 'lib-je', name: 'JournalEntry', apiPath: '/v3/company/{realmId}/query?entity=JournalEntry',
    description: 'Retrieves all journal entries including adjusting entries and line item details.',
    dataObjects: ['Journal Entries'], category: 'Core Objects',
    queryParams: [
      { key: 'start_date', label: 'Start Date', description: 'Filter entries on or after this date.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
      { key: 'end_date', label: 'End Date', description: 'Filter entries on or before this date.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
    ],
  },
  {
    id: 'lib-pnl', name: 'ProfitAndLoss', apiPath: '/v3/company/{realmId}/reports/ProfitAndLoss',
    description: 'Returns a profit and loss (income statement) report for the specified period.',
    dataObjects: ['P&L Report'], category: 'Reports',
    queryParams: [
      { key: 'start_date', label: 'Start Date', description: 'Beginning of the P&L period.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
      { key: 'end_date', label: 'End Date', description: 'End of the P&L period.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
      { key: 'accounting_method', label: 'Accounting Method', description: 'Cash or accrual basis.', type: 'select', options: ['Cash', 'Accrual'], defaultValue: 'Accrual', required: true },
    ],
  },
  {
    id: 'lib-bs', name: 'BalanceSheet', apiPath: '/v3/company/{realmId}/reports/BalanceSheet',
    description: 'Returns a balance sheet report showing assets, liabilities, and equity at a point in time.',
    dataObjects: ['Balance Sheet'], category: 'Reports',
    queryParams: [
      { key: 'start_date', label: 'Start Date', description: 'Report as-of start date.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
      { key: 'end_date', label: 'End Date', description: 'Report as-of end date.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
    ],
  },
  {
    id: 'lib-gl', name: 'GeneralLedger', apiPath: '/v3/company/{realmId}/reports/GeneralLedger',
    description: 'Retrieves the general ledger showing all transactions for each account.',
    dataObjects: ['General Ledger'], category: 'Reports',
    queryParams: [
      { key: 'start_date', label: 'Start Date', description: 'Beginning of the ledger period.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
      { key: 'end_date', label: 'End Date', description: 'End of the ledger period.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
    ],
  },
  {
    id: 'lib-vendor', name: 'Vendor', apiPath: '/v3/company/{realmId}/query?entity=Vendor',
    description: 'Fetches all vendors including contact information, balance, and payment terms.',
    dataObjects: ['Vendors'], category: 'Core Objects',
    queryParams: [
      { key: 'Active', label: 'Active Status', description: 'Return active, inactive, or all vendors.', type: 'select', options: ['Active', 'Inactive', 'All'], defaultValue: 'Active' },
    ],
  },
  {
    id: 'lib-invoice', name: 'Invoice', apiPath: '/v3/company/{realmId}/query?entity=Invoice',
    description: 'Retrieves all invoices including line items, due dates, and payment status.',
    dataObjects: ['Invoices'], category: 'Transactions',
    queryParams: [
      { key: 'start_date', label: 'Start Date', description: 'Filter invoices on or after this date.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
      { key: 'end_date', label: 'End Date', description: 'Filter invoices on or before this date.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
    ],
  },
  {
    id: 'lib-payment', name: 'Payment', apiPath: '/v3/company/{realmId}/query?entity=Payment',
    description: 'Fetches all customer payment records applied to invoices.',
    dataObjects: ['Payments'], category: 'Transactions',
    queryParams: [
      { key: 'start_date', label: 'Start Date', description: 'Filter payments on or after this date.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
      { key: 'end_date', label: 'End Date', description: 'Filter payments on or before this date.', formatHint: 'YYYY-MM-DD', type: 'date', required: true },
    ],
  },
]

export function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === 'Never') return 'Never'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}
