/**
 * Entity workflow core — framework-free TS, modeled on data/inviteWorkflow.ts.
 * Phase 1: a SINGLE entity, copy-from-existing with a data-driven carry-set,
 * through validate → review → simulated synchronous create.
 *
 * Powers ONLY the Create Entities AI-assisted action. Distinct from the
 * Configure Close doc-upload onboarding flow (createEntitiesSeed), left unchanged.
 */
import { USERS } from './users'

/** Settings that copy from the template (the "Settings" carry item). */
export interface EntityOverrides {
  workflow: string
  frequency: string
  yearEnd: string
  startPeriod: string
  calendarType: string
  workweek: string
}

/** Existing entities to copy from (sample — no real entity store exists yet). */
export interface ExistingEntity {
  id: string
  name: string
  settings: EntityOverrides
}

export const EXISTING_ENTITIES: ExistingEntity[] = [
  { id: 'e-us', name: 'FloQast US, Inc.', settings: { workflow: 'Monthly Close', frequency: 'Monthly', yearEnd: '12/31', startPeriod: '01/2025', calendarType: 'Standard', workweek: 'Mon–Fri' } },
  { id: 'e-emea', name: 'FloQast EMEA Ltd.', settings: { workflow: 'Monthly Close', frequency: 'Monthly', yearEnd: '03/31', startPeriod: '04/2025', calendarType: 'Standard', workweek: 'Mon–Fri' } },
  { id: 'e-apac', name: 'FloQast APAC Pte. Ltd.', settings: { workflow: 'Quarterly Review', frequency: 'Quarterly', yearEnd: '12/31', startPeriod: '01/2025', calendarType: 'Retail', workweek: 'Mon–Fri' } },
  { id: 'e-ca', name: 'FloQast Canada ULC', settings: { workflow: 'Monthly Close', frequency: 'Monthly', yearEnd: '12/31', startPeriod: '01/2025', calendarType: 'Standard', workweek: 'Sun–Thu' } },
]

export const WORKFLOW_OPTIONS = ['Monthly Close', 'Quarterly Review', 'Year-End']
export const FREQUENCY_OPTIONS = ['Monthly', 'Quarterly', 'Annually']
export const YEAR_END_OPTIONS = ['12/31', '03/31', '06/30', '09/30']
export const START_PERIOD_OPTIONS = ['01/2025', '04/2025', '07/2025', '01/2026']
export const CALENDAR_TYPE_OPTIONS = ['Standard', 'Retail', 'Non-close']
export const WORKWEEK_OPTIONS = ['Mon–Fri', 'Sun–Thu', 'Mon–Sat']

/** Already-connected GL connections an entity can reuse (seeded — no real store). */
export interface GlConnection {
  id: string
  name: string
  system: string
  lastSynced: string
}
export const EXISTING_GL_CONNECTIONS: GlConnection[] = [
  { id: 'gl-ns', name: 'NetSuite — Corporate (US)', system: 'NetSuite', lastSynced: 'Jun 24, 2026' },
  { id: 'gl-intacct', name: 'Sage Intacct — EMEA', system: 'Sage Intacct', lastSynced: 'Jun 23, 2026' },
  { id: 'gl-qbo', name: 'QuickBooks Online — APAC', system: 'QuickBooks Online', lastSynced: 'Jun 20, 2026' },
]

/** Read-only recap of other settings that copy with the template. */
export const ADDITIONAL_COPIED_SETTINGS = [
  'Time zone',
  'Default currency symbol',
  'Strict sign-off mode',
  'Strict folder locking',
  'Strict tie-out mode',
  'File share link',
]

/**
 * Data-driven carry-set. `locked` items are always carried (non-toggleable).
 * Append a future carryable aspect here and the UI renders it automatically.
 * GL is intentionally NOT here — it's per-entity (ledger auth) and never carried.
 */
export type CarryKey = 'settings' | 'folders' | 'checklists' | 'users'
export interface CarryItem {
  key: CarryKey
  label: string
  description: string
  defaultOn: boolean
}
// GL is intentionally NOT carryable — it's per-entity (ledger auth), handled by the GL step.
export const CARRY_ITEMS: CarryItem[] = [
  { key: 'settings', label: 'Settings', description: 'Close workflow, frequency, year-end, calendar, workweek.', defaultOn: true },
  { key: 'folders', label: 'Folders', description: 'Reconciliation & document folder structure.', defaultOn: true },
  { key: 'checklists', label: 'Checklists', description: 'Checklist items and reconciliation mappings.', defaultOn: true },
  { key: 'users', label: 'Users', description: 'Preparers and reviewers.', defaultOn: true },
]

export type CarrySet = Record<CarryKey, boolean>
export function defaultCarrySet(): CarrySet {
  return CARRY_ITEMS.reduce((acc, it) => ({ ...acc, [it.key]: it.defaultOn }), {} as CarrySet)
}

export interface EntityCandidate {
  id: string
  name: string
  templateEntityId: string
  carrySet: CarrySet
  overrides: EntityOverrides
  /** GL target (ledger) — required, never carried (per-entity ledger auth). */
  glTarget: string
  /** Selected user ids for this entity (pre-seeded from carrySet.users at capture). */
  userIds: string[]
}

/** Seeded stand-in for the users carried from a template (no template→users map in seed). */
export const CARRIED_USER_IDS: string[] = USERS.slice(0, 3).map((u) => u.id)

let nextId = 0
export function makeEntityCandidate(template?: ExistingEntity): EntityCandidate {
  return {
    id: `ent-${++nextId}`,
    name: '',
    templateEntityId: template?.id ?? '',
    carrySet: defaultCarrySet(),
    overrides: template
      ? { ...template.settings }
      : {
          workflow: WORKFLOW_OPTIONS[0],
          frequency: FREQUENCY_OPTIONS[0],
          yearEnd: YEAR_END_OPTIONS[0],
          startPeriod: START_PERIOD_OPTIONS[0],
          calendarType: CALENDAR_TYPE_OPTIONS[0],
          workweek: WORKWEEK_OPTIONS[0],
        },
    glTarget: '',
    userIds: [],
  }
}

export type RowStatus = 'empty' | 'ready' | 'warning' | 'error'
export interface CandidateValidation {
  status: RowStatus
  label: string
}

const KNOWN_ENTITY_NAMES = new Set(EXISTING_ENTITIES.map((e) => e.name.trim().toLowerCase()))

/**
 * Validate one entity candidate. Phase 1 passes a single candidate; `allCandidates`
 * is accepted now so bulk (PHASE 3 SEAM) gets in-batch name collision for free.
 */
export function validateEntityCandidate(
  c: EntityCandidate,
  allCandidates: EntityCandidate[] = [c],
): CandidateValidation {
  const name = c.name.trim().toLowerCase()
  if (!name && !c.templateEntityId && !c.glTarget) return { status: 'empty', label: '—' }
  if (!name) return { status: 'warning', label: 'Needs name' }
  if (KNOWN_ENTITY_NAMES.has(name)) return { status: 'error', label: 'Name already exists' }
  if (allCandidates.some((o) => o.id !== c.id && o.name.trim().toLowerCase() === name)) {
    return { status: 'error', label: 'Duplicate in batch' }
  }
  // Template is optional — None means "start from scratch". Validate only if set.
  if (c.templateEntityId && !EXISTING_ENTITIES.some((e) => e.id === c.templateEntityId)) {
    return { status: 'error', label: 'Invalid template' }
  }
  if (!c.glTarget) return { status: 'warning', label: 'Needs GL target' }
  return { status: 'ready', label: 'Ready' }
}

export function summarize(candidates: EntityCandidate[]) {
  let ready = 0
  let incomplete = 0
  let errors = 0
  for (const c of candidates) {
    const s = validateEntityCandidate(c, candidates).status
    if (s === 'ready') ready++
    else if (s === 'warning') incomplete++
    else if (s === 'error') errors++
  }
  return { ready, incomplete, errors }
}

export interface EntityPayload {
  name: string
  templateEntityId: string
  carrySet: CarrySet
  overrides: EntityOverrides
  glTarget: string
  userIds: string[]
}
export interface EntityResult {
  created: number
  entities: EntityPayload[]
}

/**
 * Prototype submit stub — structured + SIMULATED, synchronous for phase 1.
 *
 * PHASE 2 SEAM: the async connection tail (actually connecting the GL target,
 * provisioning carried Folders, inviting carried Team) attaches HERE as a
 * background job. Phase 1 commits synchronously and reports success immediately.
 * "Entity hidden until fully built" also belongs to phase 2 once jobs exist.
 */
export function submitEntities(payload: EntityPayload[]): EntityResult {
  // eslint-disable-next-line no-console
  console.log('submitEntities', payload)
  return { created: payload.length, entities: payload }
}
