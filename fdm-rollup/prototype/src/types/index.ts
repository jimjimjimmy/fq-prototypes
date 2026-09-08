// Hierarchy node in the rollup structure.
// A node may have children (intermediate level) or none (leaf — typically where accounts map).
export interface RollupNode {
  id: string
  name: string
  level: number
  children?: RollupNode[]
  // Number of accounts directly mapped to this node. Computed/denormalized.
  mappedCount?: number
}

// An account from the ERP (e.g. NetSuite) that gets mapped to a destination node.
export interface MappedAccount {
  id: string
  number: string         // FQ_NUMBER — e.g. "5001"
  name: string           // FQ_NAME — e.g. "Cost of Sales"
  destinationId: string  // foreign key to RollupNode.id
  costCenter?: string
  department?: string
  mappingMethod: 'rule' | 'direct' | 'unassigned' | 'do-not-map'
  // Whether the account is active in the source ERP. Inactive accounts
  // remain in the hierarchy (their mapping history matters for reconciliation)
  // but are rendered with a muted treatment and can be filtered out via the
  // "Active only" toggle on the hierarchy pane. Undefined === active.
  isActive?: boolean
  // Secondary dimension splits — each entry is { name: 'Department', value: 'Engineering' }.
  // Undefined or empty array → not split. The split icon + hover tooltip in the hierarchy
  // view surfaces these details. secondaryDimensionCount is kept for backward compat.
  secondaryDimensionCount?: number
  splitDimensions?: Array<{ name: string; value: string }>
}
