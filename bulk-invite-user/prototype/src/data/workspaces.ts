/**
 * Mock workspace data for the "Assign to Workspaces" pickers (single modal +
 * bulk multi-select). Grouped by workspace type and spanning multiple FloQast
 * products — not just Close entities — per Figma node 2205:24744. Group counts
 * mirror the design (Entities 4, Compliance Programs 5, Consolidation 1).
 *
 * Note: the Figma shows deeper nesting under Compliance Programs (2025 → SOX →
 * Business Process Controls / Payroll); flattened to one level here for the
 * prototype's reusable two-level tree.
 */
export interface Workspace {
  id: string
  name: string
}

export interface WorkspaceGroup {
  id: string
  label: string
  items: Workspace[]
}

export const WORKSPACE_GROUPS: WorkspaceGroup[] = [
  {
    id: 'entities',
    label: 'Entities',
    items: [
      { id: 'ent-us-east', name: 'FloQast US - East' },
      { id: 'ent-us-west', name: 'FloQast US - West' },
      { id: 'ent-eu', name: 'FloQast EU' },
      { id: 'ent-aus', name: 'FloQast AUS' },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance Programs',
    items: [
      { id: 'cp-internal-audit', name: 'Internal Audit' },
      { id: 'cp-hipaa', name: 'HIPAA Compliance' },
      { id: 'cp-sox', name: 'SOX Compliance' },
      { id: 'cp-iso', name: 'ISO 27001' },
      { id: 'cp-soc2', name: 'SOC 2 Type II' },
    ],
  },
  {
    id: 'consolidation',
    label: 'Consolidation Projects',
    items: [{ id: 'cons-yec-2025', name: 'Year-End Close 2025' }],
  },
]

/** Flat lookup of all workspace items, for summaries and select-all. */
export const ALL_WORKSPACES: Workspace[] = WORKSPACE_GROUPS.flatMap((g) => g.items)
export const ALL_WORKSPACE_IDS = ALL_WORKSPACES.map((w) => w.id)
const NAME_BY_ID = new Map(ALL_WORKSPACES.map((w) => [w.id, w.name]))

/** Human-readable summary for a set of selected workspace ids (cell display). */
export function workspacesSummary(ids: string[]): string {
  if (ids.length === 0) return ''
  if (ids.length === 1) return NAME_BY_ID.get(ids[0]) ?? '1 workspace'
  if (ids.length === ALL_WORKSPACE_IDS.length) return 'All workspaces'
  return `${ids.length} workspaces`
}

const ID_BY_NAME = new Map(ALL_WORKSPACES.map((w) => [w.name.toLowerCase(), w.id]))

/** Resolve workspace display names (e.g. from a CSV) to ids; unknown names are dropped. */
export function workspaceIdsByNames(names: string[]): string[] {
  return names
    .map((n) => ID_BY_NAME.get(n.trim().toLowerCase()))
    .filter((id): id is string => Boolean(id))
}

/** Pre-selected to mirror the single modal's Figma "Entities 2/4" state. */
export const DEFAULT_SELECTED_WORKSPACES = ['ent-us-east', 'ent-us-west']
