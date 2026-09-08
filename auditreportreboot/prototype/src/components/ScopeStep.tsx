import { useEffect, useState } from 'react'
import { Checkbox, Heading, Input } from '@floqastinc/flow-ui_core'
import { ExpandableGroup } from './ExpandableGroup'

// Step 3 — Scope: Products + Workspaces.
//
// Login Events lives in Step 1 (Event Types) since it's an event type, not a
// scope. When the user selects only Login Events, this whole step is disabled
// — implementing Gaurav's short-circuit pattern from 5.27.
//
// Product selection drives which workspaces are available. If none of a
// workspace's required products is selected, the workspace is disabled.
//
// onSelectionChange bubbles up whether the user has selected at least one
// product and at least one workspace. ReportBuilder uses these flags to gate
// the Download button when config/operational events are in the report.

interface ScopeStepProps {
  disabled?: boolean
  onSelectionChange?: (state: { hasProducts: boolean; hasWorkspaces: boolean }) => void
}

// Every product (including the indented children) lives in a single state
// object so Select-all can flip them all in one go and Workspaces can react
// to which products are selected.
const PRODUCT_IDS = [
  'close-ops', 'close-checklist', 'close-recs',
  'projects', 'compliance', 'intercompany',
  'consolidation', 'reporting',
  'ai-variance', 'classic-variance', 'ai-matching', 'classic-matching',
  'amortization', 'depreciation', 'detect', 'transform', 'request-agent',
  'admin-settings',
  'admin-workflows', 'admin-entities', 'admin-team', 'admin-roles',
  'admin-groups', 'admin-checklist', 'admin-recs', 'admin-api',
  'admin-ai', 'admin-connections', 'admin-fdm', 'admin-upload',
] as const

type ProductId = typeof PRODUCT_IDS[number]
type ProductState = Record<ProductId, boolean>

// Parent → children mapping for cascade behavior.
const CHILDREN_OF: Partial<Record<ProductId, ProductId[]>> = {
  'close-ops': ['close-checklist', 'close-recs'],
  'admin-settings': [
    'admin-workflows', 'admin-entities', 'admin-team', 'admin-roles',
    'admin-groups', 'admin-checklist', 'admin-recs', 'admin-api',
    'admin-ai', 'admin-connections', 'admin-fdm', 'admin-upload',
  ],
}

const PARENT_OF: Partial<Record<ProductId, ProductId>> = Object.fromEntries(
  Object.entries(CHILDREN_OF).flatMap(([parent, children]) =>
    (children ?? []).map((child) => [child, parent]),
  ),
)

// Workspace dependencies. A workspace is available when ANY of its dependent
// products (or any of that product's children) is selected.
const WORKSPACE_DEPS = {
  entities: ['close-ops', 'classic-variance', 'ai-matching'] as ProductId[],
  compliancePrograms: ['compliance'] as ProductId[],
  projects: ['projects'] as ProductId[],
  consolidationProject: ['reporting', 'consolidation'] as ProductId[],
}

function isFamilySelected(state: ProductState, products: ProductId[]): boolean {
  for (const p of products) {
    if (state[p]) return true
    const kids = CHILDREN_OF[p] ?? []
    if (kids.some((k) => state[k])) return true
  }
  return false
}

const ALL_FALSE: ProductState = Object.fromEntries(
  PRODUCT_IDS.map((id) => [id, false]),
) as ProductState

export function ScopeStep({ disabled, onSelectionChange }: ScopeStepProps) {
  const [productState, setProductState] = useState<ProductState>(ALL_FALSE)
  // Workspaces own their own state inside WorkspacesColumn — we just need to
  // know "has any been selected?" so we can bubble up to the Download button.
  const [hasWorkspaces, setHasWorkspaces] = useState(false)

  const checkedCount = PRODUCT_IDS.filter((id) => productState[id]).length
  const allChecked = checkedCount === PRODUCT_IDS.length
  const noneChecked = checkedCount === 0
  const hasProducts = checkedCount > 0

  // Emit selection status upward whenever either side of the scope changes.
  useEffect(() => {
    onSelectionChange?.({ hasProducts, hasWorkspaces })
  }, [hasProducts, hasWorkspaces, onSelectionChange])

  const setAll = (val: boolean) => {
    setProductState(
      Object.fromEntries(PRODUCT_IDS.map((id) => [id, val])) as ProductState,
    )
  }

  const setOne = (id: ProductId) => (checked: boolean | string) => {
    const next = checked === true
    setProductState((s) => {
      const updated: ProductState = { ...s, [id]: next }
      const kids = CHILDREN_OF[id]
      if (kids) for (const child of kids) updated[child] = next
      const parent = PARENT_OF[id]
      if (parent) {
        const siblings = CHILDREN_OF[parent] ?? []
        updated[parent] = siblings.every((sib) => (sib === id ? next : s[sib]))
      }
      return updated
    })
  }

  // Per-workspace availability based on product selection.
  const wsAvailable = {
    entities: isFamilySelected(productState, WORKSPACE_DEPS.entities),
    compliancePrograms: isFamilySelected(productState, WORKSPACE_DEPS.compliancePrograms),
    projects: isFamilySelected(productState, WORKSPACE_DEPS.projects),
    consolidationProject: isFamilySelected(productState, WORKSPACE_DEPS.consolidationProject),
  }

  // Workspaces' "Select all" only makes sense when every product that gates a
  // workspace is in scope. Union the deps and check each is family-selected.
  const APPLICABLE_PRODUCTS = Array.from(
    new Set([
      ...WORKSPACE_DEPS.entities,
      ...WORKSPACE_DEPS.compliancePrograms,
      ...WORKSPACE_DEPS.projects,
      ...WORKSPACE_DEPS.consolidationProject,
    ]),
  )
  const allApplicableProductsSelected = APPLICABLE_PRODUCTS.every((p) =>
    isFamilySelected(productState, [p]),
  )

  return (
    <section
      className={`rb-step${disabled ? ' rb-step-disabled' : ''}`}
      id="step-3"
      aria-disabled={disabled || undefined}
    >
      <header className="rb-step-header">
        <Heading variant="body-base">Select Products and Workspaces</Heading>
      </header>

      {disabled && (
        <div className="rb-step-disabled-banner">
          Select an event type first.
        </div>
      )}

      <div className="rb-step-body rb-grid-2" aria-hidden={disabled || undefined}>
        <ProductsColumn
          state={productState}
          allChecked={allChecked}
          noneChecked={noneChecked}
          setAll={setAll}
          setOne={setOne}
        />
        <WorkspacesColumn
          available={wsAvailable}
          showSelectAll={allApplicableProductsSelected}
          onSelectionChange={setHasWorkspaces}
        />
      </div>
    </section>
  )
}

interface ProductsColumnProps {
  state: ProductState
  allChecked: boolean
  noneChecked: boolean
  setAll: (val: boolean) => void
  setOne: (id: ProductId) => (checked: boolean | string) => void
}

// Search helper — case-insensitive substring.
function matches(label: string, query: string): boolean {
  if (!query.trim()) return true
  return label.toLowerCase().includes(query.trim().toLowerCase())
}

function ProductsColumn({ state, allChecked, noneChecked, setAll, setOne }: ProductsColumnProps) {
  const [query, setQuery] = useState('')
  const isFiltering = query.trim().length > 0

  const cb = (id: ProductId, label: string) =>
    matches(label, query) ? (
      <Checkbox checked={state[id]} onCheckedChange={setOne(id)} label={label} />
    ) : null

  // Group is shown if its label matches OR any child label matches. When the
  // parent matches, ALL children render; when only some children match, the
  // group is force-expanded and only matching children render.
  const renderGroup = (
    parentId: ProductId,
    parentLabel: string,
    children: Array<{ id: ProductId; label: string }>,
  ) => {
    const parentMatch = matches(parentLabel, query)
    const matchingChildren = parentMatch
      ? children
      : children.filter((c) => matches(c.label, query))
    if (!parentMatch && matchingChildren.length === 0) return null
    return (
      <ExpandableGroup
        label={parentLabel}
        parentChecked={state[parentId]}
        onParentChange={(c) => setOne(parentId)(c)}
        forceOpen={isFiltering}
      >
        {matchingChildren.map((c) => (
          <Checkbox
            key={c.id}
            checked={state[c.id]}
            onCheckedChange={setOne(c.id)}
            label={c.label}
          />
        ))}
      </ExpandableGroup>
    )
  }

  return (
    <div>
      <Heading variant="body-base">Products</Heading>
      <div style={{ marginTop: 12 }}>
        <Input
          type="search"
          placeholder="Search products"
          isSearchable
          value={query}
          onChange={(value: string) => setQuery(value)}
        />
      </div>
      <div className="rb-stack rb-stack-with-expandables" style={{ marginTop: 12 }}>
        {!isFiltering && (
          <Checkbox
            checked={allChecked}
            ref={(el: HTMLInputElement | null) => {
              if (el) el.indeterminate = !allChecked && !noneChecked
            }}
            onCheckedChange={(c) => setAll(c === true)}
            label="Select All"
          />
        )}

        {renderGroup('close-ops', 'Close & Ops', [
          { id: 'close-checklist', label: 'Checklist' },
          { id: 'close-recs', label: 'Reconciliations' },
        ])}

        {cb('projects', 'Projects')}
        {cb('compliance', 'Compliance Management')}
        {cb('intercompany', 'Intercompany')}
        {cb('consolidation', 'Consolidation')}
        {cb('reporting', 'Reporting')}
        {cb('ai-variance', 'AI Variance')}
        {cb('classic-variance', 'Classic Variance')}
        {cb('ai-matching', 'AI Matching')}
        {cb('classic-matching', 'Classic Matching')}
        {cb('amortization', 'Amortization')}
        {cb('depreciation', 'Depreciation')}
        {cb('detect', 'Detect')}
        {cb('transform', 'Transform')}
        {cb('request-agent', 'Request Agent')}

        {renderGroup('admin-settings', 'Admin Settings', [
          { id: 'admin-workflows', label: 'Workflows' },
          { id: 'admin-entities', label: 'Entities' },
          { id: 'admin-team', label: 'Team Members' },
          { id: 'admin-roles', label: 'Roles' },
          { id: 'admin-groups', label: 'Groups' },
          { id: 'admin-checklist', label: 'Checklist' },
          { id: 'admin-recs', label: 'Reconciliations' },
          { id: 'admin-api', label: 'API Keys' },
          { id: 'admin-ai', label: 'AI' },
          { id: 'admin-connections', label: 'Connections' },
          { id: 'admin-fdm', label: 'Financial Data Model' },
          { id: 'admin-upload', label: 'File Upload' },
        ])}
      </div>
    </div>
  )
}

// Workspace state — controlled, with parent → child cascade just like Products.
const WORKSPACE_IDS = [
  'ws-entities', 'ws-entity-1', 'ws-entity-2', 'ws-entity-3',
  'ws-compliance', 'ws-comp-1', 'ws-comp-2', 'ws-comp-3',
  'ws-projects', 'ws-proj-1', 'ws-proj-2', 'ws-proj-3',
  'ws-consolidation',
] as const

type WorkspaceId = typeof WORKSPACE_IDS[number]
type WorkspaceState = Record<WorkspaceId, boolean>

const WS_CHILDREN_OF: Partial<Record<WorkspaceId, WorkspaceId[]>> = {
  'ws-entities': ['ws-entity-1', 'ws-entity-2', 'ws-entity-3'],
  'ws-compliance': ['ws-comp-1', 'ws-comp-2', 'ws-comp-3'],
  'ws-projects': ['ws-proj-1', 'ws-proj-2', 'ws-proj-3'],
}

const WS_PARENT_OF: Partial<Record<WorkspaceId, WorkspaceId>> = Object.fromEntries(
  Object.entries(WS_CHILDREN_OF).flatMap(([parent, children]) =>
    (children ?? []).map((child) => [child, parent]),
  ),
)

const WS_ALL_FALSE: WorkspaceState = Object.fromEntries(
  WORKSPACE_IDS.map((id) => [id, false]),
) as WorkspaceState

// Which availability flag each workspace listens to. Used to auto-clear
// state when the gating product is unchecked.
type AvailabilityKey = 'entities' | 'compliancePrograms' | 'projects' | 'consolidationProject'
const WS_AVAILABILITY_KEY: Record<WorkspaceId, AvailabilityKey> = {
  'ws-entities': 'entities',
  'ws-entity-1': 'entities',
  'ws-entity-2': 'entities',
  'ws-entity-3': 'entities',
  'ws-compliance': 'compliancePrograms',
  'ws-comp-1': 'compliancePrograms',
  'ws-comp-2': 'compliancePrograms',
  'ws-comp-3': 'compliancePrograms',
  'ws-projects': 'projects',
  'ws-proj-1': 'projects',
  'ws-proj-2': 'projects',
  'ws-proj-3': 'projects',
  'ws-consolidation': 'consolidationProject',
}

interface WorkspacesColumnProps {
  available: {
    entities: boolean
    compliancePrograms: boolean
    projects: boolean
    consolidationProject: boolean
  }
  showSelectAll: boolean
  onSelectionChange?: (hasSelection: boolean) => void
}

function WorkspacesColumn({ available, showSelectAll, onSelectionChange }: WorkspacesColumnProps) {
  const [wsState, setWsState] = useState<WorkspaceState>(WS_ALL_FALSE)
  const [query, setQuery] = useState('')
  const isFiltering = query.trim().length > 0

  // Auto-uncheck workspaces whose gating product is no longer selected.
  // Keeps the UI honest: what's checked is what's in the report.
  useEffect(() => {
    setWsState((s) => {
      let changed = false
      const updated: WorkspaceState = { ...s }
      for (const id of WORKSPACE_IDS) {
        const key = WS_AVAILABILITY_KEY[id]
        if (!available[key] && updated[id]) {
          updated[id] = false
          changed = true
        }
      }
      return changed ? updated : s
    })
  }, [available])

  const checkedCount = WORKSPACE_IDS.filter((id) => wsState[id]).length
  const allChecked = checkedCount === WORKSPACE_IDS.length
  const noneChecked = checkedCount === 0
  const hasSelection = checkedCount > 0

  // Bubble selection presence to ScopeStep so the Download button can react.
  useEffect(() => {
    onSelectionChange?.(hasSelection)
  }, [hasSelection, onSelectionChange])

  const setAll = (val: boolean) => {
    setWsState(
      Object.fromEntries(WORKSPACE_IDS.map((id) => [id, val])) as WorkspaceState,
    )
  }

  const setOne = (id: WorkspaceId) => (checked: boolean | string) => {
    const next = checked === true
    setWsState((s) => {
      const updated: WorkspaceState = { ...s, [id]: next }
      const kids = WS_CHILDREN_OF[id]
      if (kids) for (const child of kids) updated[child] = next
      const parent = WS_PARENT_OF[id]
      if (parent) {
        const siblings = WS_CHILDREN_OF[parent] ?? []
        updated[parent] = siblings.every((sib) => (sib === id ? next : s[sib]))
      }
      return updated
    })
  }

  // Workspace group renderer with search filtering.
  const renderGroup = (
    parentId: WorkspaceId,
    parentLabel: string,
    children: Array<{ id: WorkspaceId; label: string }>,
    groupDisabled: boolean,
  ) => {
    const parentMatch = matches(parentLabel, query)
    const matchingChildren = parentMatch
      ? children
      : children.filter((c) => matches(c.label, query))
    if (!parentMatch && matchingChildren.length === 0) return null
    return (
      <ExpandableGroup
        label={parentLabel}
        parentChecked={wsState[parentId]}
        onParentChange={(c) => setOne(parentId)(c)}
        disabled={groupDisabled}
        forceOpen={isFiltering}
      >
        {matchingChildren.map((c) => (
          <Checkbox
            key={c.id}
            checked={wsState[c.id]}
            onCheckedChange={setOne(c.id)}
            label={c.label}
            disabled={groupDisabled}
          />
        ))}
      </ExpandableGroup>
    )
  }

  return (
    <div>
      <Heading variant="body-base">Workspaces</Heading>
      <div style={{ marginTop: 12 }}>
        <Input
          type="search"
          placeholder="Search workspaces"
          isSearchable
          value={query}
          onChange={(value: string) => setQuery(value)}
        />
      </div>

      <div className="rb-stack rb-stack-with-expandables" style={{ marginTop: 12 }}>
        {!isFiltering && (
          <Checkbox
            checked={allChecked}
            ref={(el: HTMLInputElement | null) => {
              if (el) el.indeterminate = !allChecked && !noneChecked
            }}
            onCheckedChange={(c) => setAll(c === true)}
            label="Select All"
            disabled={!showSelectAll}
          />
        )}

        {renderGroup(
          'ws-entities',
          'Entities (3)',
          [
            { id: 'ws-entity-1', label: 'Entity 1' },
            { id: 'ws-entity-2', label: 'Entity 2' },
            { id: 'ws-entity-3', label: 'Entity 3' },
          ],
          !available.entities,
        )}

        {renderGroup(
          'ws-compliance',
          'Compliance Programs (3)',
          [
            { id: 'ws-comp-1', label: 'Compliance Program 1' },
            { id: 'ws-comp-2', label: 'Compliance Program 2' },
            { id: 'ws-comp-3', label: 'Compliance Program 3' },
          ],
          !available.compliancePrograms,
        )}

        {renderGroup(
          'ws-projects',
          'Projects (3)',
          [
            { id: 'ws-proj-1', label: 'Project 1' },
            { id: 'ws-proj-2', label: 'Project 2' },
            { id: 'ws-proj-3', label: 'Project 3' },
          ],
          !available.projects,
        )}

        {matches('Consolidation Project', query) && (
          <Checkbox
            checked={wsState['ws-consolidation']}
            onCheckedChange={setOne('ws-consolidation')}
            label="Consolidation Project"
            disabled={!available.consolidationProject}
          />
        )}
      </div>
    </div>
  )
}
