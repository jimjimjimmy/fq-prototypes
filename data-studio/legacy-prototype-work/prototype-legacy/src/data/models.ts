export type RunStatus = 'success' | 'failed' | 'pending' | null

export type Model = {
  id: string
  name: string
  domain: string
  status: 'active' | 'inactive' | 'draft'
  version: string
  records: number
  linkedFiles: number
  lastUpdated: string
  lastRunDate: string | null
  lastRunStatus: RunStatus
}

export type DomainGroup = {
  domain: string
  models: Model[]
  defaultExpanded: boolean
}

export const modelData: DomainGroup[] = [
  {
    domain: 'Accounts, Entities, and Structures',
    defaultExpanded: true,
    models: [
      {
        id: 'us-accounts',
        name: 'US Accounts',
        domain: 'Accounts, Entities, and Structures',
        status: 'active',
        version: 'v1.0',
        records: 5792,
        linkedFiles: 2,
        lastUpdated: '3 Hours Ago',
        lastRunDate: '3 hours ago',
        lastRunStatus: 'success',
      },
    ],
  },
  {
    domain: 'Transactions',
    defaultExpanded: true,
    models: [
      {
        id: 'chase-bank-transactions',
        name: 'Chase Bank Transactions',
        domain: 'Transactions',
        status: 'active',
        version: 'v2.0.1',
        records: 5792,
        linkedFiles: 2,
        lastUpdated: '3 Hours Ago',
        lastRunDate: '11 hours ago',
        lastRunStatus: 'failed',
      },
      {
        id: 'general-ledger',
        name: 'General Ledger',
        domain: 'Transactions',
        status: 'inactive',
        version: 'v1.0',
        records: 5792,
        linkedFiles: 2,
        lastUpdated: '3 Hours Ago',
        lastRunDate: null,
        lastRunStatus: 'pending',
      },
      {
        id: 'subledger',
        name: 'Subledger',
        domain: 'Transactions',
        status: 'active',
        version: 'v1.0',
        records: 5792,
        linkedFiles: 2,
        lastUpdated: '3 Hours Ago',
        lastRunDate: '11 hours ago',
        lastRunStatus: 'success',
      },
    ],
  },
  {
    domain: 'Currencies',
    defaultExpanded: false,
    models: [
      {
        id: 'exchange-rates',
        name: 'Exchange Rates',
        domain: 'Currencies',
        status: 'active',
        version: 'v1.0',
        records: 1200,
        linkedFiles: 1,
        lastUpdated: '1 Day Ago',
        lastRunDate: '1 day ago',
        lastRunStatus: 'success',
      },
    ],
  },
  {
    domain: 'Balances and Summaries',
    defaultExpanded: false,
    models: [
      {
        id: 'trial-balance',
        name: 'Trial Balance',
        domain: 'Balances and Summaries',
        status: 'active',
        version: 'v1.0',
        records: 3400,
        linkedFiles: 1,
        lastUpdated: '2 Days Ago',
        lastRunDate: '2 days ago',
        lastRunStatus: 'success',
      },
    ],
  },
  {
    domain: 'Custom Models',
    defaultExpanded: false,
    models: [],
  },
]

// Flat list for lookups
export const allModels: Model[] = modelData.flatMap((g) => g.models)

export function getModelById(id: string): Model | undefined {
  return allModels.find((m) => m.id === id)
}
