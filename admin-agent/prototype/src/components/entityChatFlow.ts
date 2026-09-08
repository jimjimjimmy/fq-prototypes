/**
 * Scripted change-capture Q&A for the Create Entities chat — a per-entity LOOP.
 * The chat asks count (custom number), then walks each entity: template-or-scratch
 * → (if copying) what to carry. Answers drive {capture, candidates} and RETURN the
 * next question(s) for AssistChat to enqueue. Chips/number only — no free text.
 */
import type { QuestionDef } from './AssistChat'
import {
  EXISTING_ENTITIES,
  CARRY_ITEMS,
  CARRIED_USER_IDS,
  makeEntityCandidate,
  type CarrySet,
  type EntityCandidate,
} from '../data/entityWorkflow'

export const ENTITY_CAPTURE_COMPLETE_MESSAGE =
  "Got it — I've captured all your entities. Review them on the right, add documentation, then I'll generate the mapping and connect each ledger."

/** Captured chat state that drives the left-panel reveal (restructure 1). */
export interface EntityCapture {
  count: number
  decidedCount: number // entities whose template (+carry if copying) is captured
}
export function initialCapture(): EntityCapture {
  return { count: 1, decidedCount: 0 }
}

const MAX_ENTITIES = 12
const CARRY_LABELS = CARRY_ITEMS.map((c) => c.label) // ['Settings','Folders','Checklists','Users']

const countQuestion = (): QuestionDef => ({
  id: 'count',
  kind: 'number',
  min: 1,
  placeholder: 'e.g. 3',
  options: [],
  prompt: 'How many entities are you setting up?',
})
const templateQuestion = (i: number): QuestionDef => ({
  id: `template-${i}`,
  kind: 'setup',
  layout: 'stack',
  options: [...EXISTING_ENTITIES.map((e) => e.name), 'Start from scratch'],
  prompt: `Entity ${i + 1}: start from an existing entity, or from scratch?`,
})
const carryQuestion = (i: number): QuestionDef => ({
  id: `carry-${i}`,
  kind: 'setup',
  multiSelect: true,
  layout: 'stack',
  options: CARRY_LABELS,
  prompt: `Entity ${i + 1}: what should I copy over?`,
})

export function buildEntityCaptureFlow(): QuestionDef[] {
  return [countQuestion()]
}

const indexOf = (id: string) => parseInt(id.split('-')[1] ?? '0', 10)
const carrySetFrom = (labels: string[]): CarrySet =>
  CARRY_ITEMS.reduce((acc, c) => ({ ...acc, [c.key]: labels.includes(c.label) }), {} as CarrySet)

/** Apply one answer → next state + the follow-up questions to enqueue. */
export function applyEntityAnswer(
  state: { capture: EntityCapture; candidates: EntityCandidate[] },
  id: string,
  value: string | string[],
): { capture: EntityCapture; candidates: EntityCandidate[]; next: QuestionDef[] } {
  const { capture } = state
  let candidates = state.candidates

  if (id === 'count') {
    const raw = parseInt(Array.isArray(value) ? value[0] : value, 10)
    const n = Math.max(1, Math.min(MAX_ENTITIES, Number.isFinite(raw) ? raw : 1))
    candidates = Array.from({ length: n }, (_, i) => candidates[i] ?? makeEntityCandidate())
    return { capture: { count: n, decidedCount: 0 }, candidates, next: [templateQuestion(0)] }
  }

  if (id.startsWith('template-')) {
    const i = indexOf(id)
    const v = Array.isArray(value) ? value[0] : value
    const isScratch = v === 'Start from scratch'
    const tpl = isScratch ? undefined : EXISTING_ENTITIES.find((e) => e.name === v)
    const next = [...candidates]
    const c = next[i] ?? makeEntityCandidate()
    next[i] = { ...c, templateEntityId: tpl?.id ?? '', overrides: tpl ? { ...tpl.settings } : c.overrides }
    if (isScratch) {
      const decidedCount = capture.decidedCount + 1
      return { capture: { ...capture, decidedCount }, candidates: next, next: i + 1 < capture.count ? [templateQuestion(i + 1)] : [] }
    }
    return { capture, candidates: next, next: [carryQuestion(i)] }
  }

  if (id.startsWith('carry-')) {
    const i = indexOf(id)
    const labels = Array.isArray(value) ? value : [value]
    const next = [...candidates]
    const cs = carrySetFrom(labels)
    next[i] = { ...(next[i] ?? makeEntityCandidate()), carrySet: cs, userIds: cs.users ? CARRIED_USER_IDS : [] }
    const decidedCount = capture.decidedCount + 1
    return { capture: { ...capture, decidedCount }, candidates: next, next: i + 1 < capture.count ? [templateQuestion(i + 1)] : [] }
  }

  return { ...state, next: [] }
}

/**
 * Clarifying questions asked after docs upload (Change 3). Per-entity Ops workflow
 * questions, then batch-level questions (folders, deadlines, holiday calendar).
 * Chip-based; injected via AssistChat's injectQuestions. (Answers aren't persisted
 * in phase 1 — SEAM for when they drive the generated mapping.)
 */
export function buildClarifyQuestions(candidates: EntityCandidate[]): QuestionDef[] {
  const ops: QuestionDef[] = candidates.map((c, i) => ({
    id: `ops-${i}`,
    kind: 'setup',
    layout: 'chips',
    options: ['Yes', 'No'],
    prompt: `Does ${c.name.trim() || `Entity ${i + 1}`} use any Ops workflows?`,
  }))
  return [
    ...ops,
    { id: 'folderMode', kind: 'setup', layout: 'stack', options: ['Use folder placeholders', 'Specify per folder'], prompt: 'How should I set up your folders?' },
    { id: 'deadlineMode', kind: 'setup', layout: 'stack', options: ['Keep existing deadlines', 'Use a placeholder (TBD)'], prompt: 'For deadlines, keep the existing ones or use a placeholder?' },
    { id: 'deadlineDays', kind: 'setup', layout: 'stack', options: ['Business days', 'Calendar days'], prompt: 'Should deadlines be counted in business or calendar days?' },
    { id: 'holidayCalendar', kind: 'setup', layout: 'stack', options: ['US Federal', 'Custom', 'None'], prompt: 'Which holiday calendar should apply?' },
  ]
}
