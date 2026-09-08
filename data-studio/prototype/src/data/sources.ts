/**
 * Source Datasets — mock data for the Model View → Source Datasets tab.
 *
 * Grounded in the "Data Studio — For Dev" Figma:
 *   - Empty  frame 738:20280
 *   - Adding frame 3053:49054
 *
 * "Available sources" are the datasets a model can draw from, bucketed by the
 * connector that delivers them. "Selected" sources are the ones chosen for a
 * given model; exactly one is the Primary Dataset.
 *
 * NOTE — connector divergence: the connector set here (JP Morgan, Acme ERP,
 * Dunder Mifflin Sharepoint, Osprey Paper API) matches the Figma frame, NOT
 * src/data/connectors.ts
 * (SAP ERP, Bank Feed, ERP Data). The Connectors L1 tab is still a stub, so there
 * is no live conflict today; when it's built, reconcile the two connector sets.
 *
 * Mock data only — allowed per project conventions (use mock data, not APIs).
 */

/** How a connector delivers its data — shown as a subtitle next to the connector. */
export type SourceTransport = 'SFTP' | 'Direct Connect' | 'File Upload' | 'API' | 'NetSuite'

export type AvailableSource = {
  id: string
  /** File-style dataset name as shown in the panel, e.g. "MTD-Transactions.csv". */
  name: string
  /** Delivering connector (display name). */
  connector: string
  /** How the connector delivers data. */
  transport: SourceTransport
  /**
   * Schema/category subtitle shown under the dataset name. Datasets that share a
   * category have the same schema and so can be grouped (UNION ALL) — the basis
   * for the "Create Group" affordance (wired in Phase B).
   */
  category: string
}

/**
 * All available sources, in display order. The connector grouping below
 * preserves first-seen connector order, so keep same-connector rows together.
 */
export const availableSources: AvailableSource[] = [
  // JP Morgan · SFTP
  { id: 'jpm-mtd-transactions', name: 'MTD-Transactions.csv', connector: 'JP Morgan', transport: 'SFTP', category: 'Transactions' },
  { id: 'jpm-monthly-gl', name: 'Monthly-GL.csv', connector: 'JP Morgan', transport: 'SFTP', category: 'GL Transactions' },
  { id: 'jpm-accounts', name: 'JPM-Accounts.csv', connector: 'JP Morgan', transport: 'SFTP', category: 'Accounts' },
  { id: 'jpm-companies', name: 'JPM-Companies.csv', connector: 'JP Morgan', transport: 'SFTP', category: 'Entities' },
  // Acme ERP · Direct Connect
  // (The Figma "Adding" frame shows "Direct Connect" in one state and "NetSuite"
  //  in another — a design artifact. We use "Direct Connect" consistently.)
  { id: 'acme-transactions-emea', name: 'Transactions_EMEA', connector: 'Acme ERP', transport: 'NetSuite', category: 'Transactions' },
  { id: 'acme-transactions-na', name: 'Transactions_NA', connector: 'Acme ERP', transport: 'NetSuite', category: 'Transactions' },
  // Dunder Mifflin Sharepoint · File Upload
  { id: 'dm-transactions', name: 'DM_Transactions.csv', connector: 'Dunder Mifflin Sharepoint', transport: 'File Upload', category: 'Transactions' },
  { id: 'dm-tb', name: 'DM_TB.csv', connector: 'Dunder Mifflin Sharepoint', transport: 'File Upload', category: 'Trial Balance' },
  // Osprey Paper API · API
  // (For-Dev repeats JPM-Accounts / JPM-Companies under this connector; replicated
  //  faithfully with distinct ids.)
  { id: 'osprey-gl-master', name: 'gl_master.csv', connector: 'Osprey Paper API', transport: 'API', category: 'GL Transactions' },
  { id: 'osprey-chart-of-accounts', name: 'chart_of_accounts.csv', connector: 'Osprey Paper API', transport: 'API', category: 'Accounts' },
  { id: 'osprey-jpm-accounts', name: 'JPM-Accounts.csv', connector: 'Osprey Paper API', transport: 'API', category: 'Accounts' },
  { id: 'osprey-jpm-companies', name: 'JPM-Companies.csv', connector: 'Osprey Paper API', transport: 'API', category: 'Entities' },
]

export type ConnectorGroup = {
  connector: string
  transport: SourceTransport
  sources: AvailableSource[]
}

/**
 * Available sources bucketed by connector, in first-seen order — the shape the
 * "Available Sources" panel renders (collapsible group per connector).
 */
export const availableSourceGroups: ConnectorGroup[] = (() => {
  const order: string[] = []
  const byConnector = new Map<string, ConnectorGroup>()
  for (const source of availableSources) {
    let group = byConnector.get(source.connector)
    if (!group) {
      group = { connector: source.connector, transport: source.transport, sources: [] }
      byConnector.set(source.connector, group)
      order.push(source.connector)
    }
    group.sources.push(source)
  }
  return order.map((connector) => byConnector.get(connector)!)
})()

/** A source chosen for a model. `isPrimary` marks the single Primary Dataset. */
export type SelectedSourceSeed = {
  sourceId: string
  isPrimary?: boolean
}

/**
 * Per-model selected sources (initial state for the Selected Datasets panel).
 *
 * Counts match each model's `linkedFiles` in models.ts, so a model's Catalog
 * "N Linked Datasets" count stays consistent with what this tab shows when you
 * navigate in from Catalog. US Accounts mirrors the For-Dev "Adding (2)" frame
 * exactly (Transactions_NA primary + Transactions_EMEA).
 *
 * Models absent from this map fall back to an empty selection, which renders the
 * "Empty" state (frame 738:20280).
 */
export const selectedSourcesByModel: Record<string, SelectedSourceSeed[]> = {
  'us-accounts': [
    { sourceId: 'acme-transactions-na', isPrimary: true },
    { sourceId: 'acme-transactions-emea' },
  ],
  'chase-bank-transactions': [
    { sourceId: 'jpm-mtd-transactions', isPrimary: true },
    { sourceId: 'jpm-monthly-gl' },
  ],
  'general-ledger': [
    { sourceId: 'jpm-monthly-gl', isPrimary: true },
    { sourceId: 'jpm-accounts' },
  ],
  subledger: [
    { sourceId: 'jpm-mtd-transactions', isPrimary: true },
    { sourceId: 'dm-transactions' },
  ],
  'exchange-rates': [
    { sourceId: 'jpm-companies', isPrimary: true },
  ],
  'trial-balance': [
    { sourceId: 'dm-tb', isPrimary: true },
  ],
}

export function getAvailableSource(id: string): AvailableSource | undefined {
  return availableSources.find((source) => source.id === id)
}

/**
 * Mock column/field names per schema category, for the Link Datasets dialog's
 * join-field pickers (Phase B). Datasets in the same category expose the same
 * fields, so a shared key like `account_id` exists across them — the basis for
 * the join. `account_id` leads each list to match the For-Dev "account_id"
 * example. Prototype data only.
 */
const fieldsByCategory: Record<string, string[]> = {
  Transactions: ['account_id', 'account_num', 'amount', 'transaction_date', 'entity'],
  'GL Transactions': ['account_id', 'gl_code', 'debit', 'credit', 'period'],
  Accounts: ['account_id', 'account_name', 'account_type'],
  Entities: ['entity_id', 'entity_name', 'region'],
  'Trial Balance': ['account_id', 'balance', 'period'],
}

/** Mock join-field options for a dataset (falls back to a generic key set). */
export function getDatasetFields(source: AvailableSource): string[] {
  return fieldsByCategory[source.category] ?? ['id', 'name', 'value']
}

/**
 * A group of same-schema datasets created via the Group Datasets dialog
 * (3053:49055). Members are UNION-ed; `primaryMemberId` is the primary within
 * the group. Rendered as a collapsed group card in the Selected Datasets panel.
 */
export type DatasetGroup = {
  id: string
  /** User-entered group name, e.g. "Acme ERP Transactions". */
  name: string
  /** Ids of the datasets rolled into this group. */
  memberIds: string[]
  /** The primary dataset within the group. */
  primaryMemberId: string
}

/** How rows without a match across linked datasets are handled. */
export type UnmatchedMode = 'keep-all' | 'matching-only'

/**
 * Result of the Link Datasets dialog (3053:49056): the join field chosen per
 * dataset plus the unmatched-rows policy. Drives the "Linked on … " summary row
 * and per-row "Linked via:" chips in the Selected Datasets panel.
 */
export type LinkConfig = {
  /** Join field chosen for each dataset id participating in the link. */
  joinFieldByDatasetId: Record<string, string>
  unmatchedMode: UnmatchedMode
}

/** Initial selected-source seed for a model (empty if the model isn't seeded). */
export function getSelectedSourceSeed(modelId: string | undefined): SelectedSourceSeed[] {
  if (!modelId) return []
  return selectedSourcesByModel[modelId] ?? []
}
