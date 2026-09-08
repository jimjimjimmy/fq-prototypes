export type RunStatus = 'success' | 'failed' | 'pending' | null

/**
 * Model lifecycle state shown in the Catalog Status column + Model View header.
 * Aligned with the Catalog Search & Filter PRD (Active / Draft / Archived).
 * "inactive" from the v1 mock was remapped to "archived".
 */
export type ModelStatus = 'active' | 'draft' | 'archived'

export type Model = {
  id: string
  name: string
  domain: string
  status: ModelStatus
  /** Active version number. Rendered as "Version N" (see formatVersion). */
  version: number
  records: number
  linkedFiles: number
  created: string
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
        version: 1,
        records: 5792,
        linkedFiles: 2,
        created: '2026-03-01',
        lastUpdated: '2026-03-22',
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
        version: 2,
        records: 5792,
        linkedFiles: 2,
        created: '2025-11-01',
        lastUpdated: '2025-12-15',
        lastRunDate: '11 hours ago',
        lastRunStatus: 'failed',
      },
      {
        id: 'general-ledger',
        name: 'General Ledger',
        domain: 'Transactions',
        status: 'archived',
        version: 1,
        records: 5792,
        linkedFiles: 2,
        created: '2025-12-01',
        lastUpdated: '2026-01-12',
        lastRunDate: null,
        lastRunStatus: 'pending',
      },
      {
        id: 'subledger',
        name: 'Subledger',
        domain: 'Transactions',
        status: 'active',
        version: 1,
        records: 5792,
        linkedFiles: 2,
        created: '2025-12-05',
        lastUpdated: '2026-01-13',
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
        version: 1,
        records: 1200,
        linkedFiles: 1,
        created: '2026-02-15',
        lastUpdated: '2026-03-20',
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
        version: 1,
        records: 3400,
        linkedFiles: 1,
        created: '2026-02-10',
        lastUpdated: '2026-03-19',
        lastRunDate: '2 days ago',
        lastRunStatus: 'success',
      },
    ],
  },
  {
    domain: 'Custom',
    defaultExpanded: false,
    models: [],
  },
]

// Flat list for lookups
export const allModels: Model[] = modelData.flatMap((g) => g.models)

export function getModelById(id: string): Model | undefined {
  return allModels.find((m) => m.id === id)
}
