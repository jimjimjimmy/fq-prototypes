/**
 * CreateEntityScreen — left panel for Create Entities (PHASE 1, chat-first).
 * Idle until the chat captures all N entities, then stages (restructure 4):
 *   config → docs → build → mapping → gl → success.
 * Mapping reuses Getting Started's BuildProgressScreen + MappingScreen unchanged.
 *
 * PHASE 2 SEAM: connecting GL / provisioning Folders / inviting Team becomes a
 * background job in submitEntities; here a new GL connection completes inline via
 * the reused Connect ERP screen. LATER: team-assignment-when-not-carried UI.
 */
import {
  validateEntityCandidate,
  summarize,
  makeEntityCandidate,
  EXISTING_ENTITIES,
  CARRY_ITEMS,
  ADDITIONAL_COPIED_SETTINGS,
  WORKFLOW_OPTIONS,
  FREQUENCY_OPTIONS,
  YEAR_END_OPTIONS,
  START_PERIOD_OPTIONS,
  CALENDAR_TYPE_OPTIONS,
  WORKWEEK_OPTIONS,
  type EntityCandidate,
  type EntityOverrides,
  type EntityResult,
  type EntityPayload,
  type GlConnection,
} from '../data/entityWorkflow'
import { UploadDocsScreen } from './UploadDocsScreen'
import { BuildProgressScreen } from './BuildProgressScreen'
import { MappingScreen } from './MappingScreen'
import { UserMultiSelect } from './UserMultiSelect'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'

const inputCls =
  'h-9 w-full min-w-0 box-border rounded-[6px] border border-[#cbd2e1] px-2.5 text-[13px] text-[#1d2433] placeholder:text-[#9ca3af] bg-white focus:outline-none focus:border-[#1e8ae9]'

const COPY_FROM_HELP =
  'This will pre-populate editable fields and copy over entity settings to your new entity. This does not include General Ledger, Folders, or Team Members.'

const SETTING_FIELDS: { key: keyof EntityOverrides; label: string; options: string[] }[] = [
  { key: 'workflow', label: 'Workflow', options: WORKFLOW_OPTIONS },
  { key: 'frequency', label: 'Frequency', options: FREQUENCY_OPTIONS },
  { key: 'yearEnd', label: 'Year end (MM/DD)', options: YEAR_END_OPTIONS },
  { key: 'startPeriod', label: 'Start period (MM/YYYY)', options: START_PERIOD_OPTIONS },
  { key: 'calendarType', label: 'Calendar type', options: CALENDAR_TYPE_OPTIONS },
  { key: 'workweek', label: 'Workweek', options: WORKWEEK_OPTIONS },
]

/** "← Back" affordance shown on steps that can return to a previous step. */
function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#1e8ae9] hover:underline">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Back
    </button>
  )
}

function Field({ label, required, help, children }: { label: string; required?: boolean; help?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[12px] font-semibold text-[#6b7280]">
        {label}
        {required && <span className="ml-1 text-[#d24747]">*</span>}
      </span>
      {children}
      {help && <span className="text-[12px] text-[#6b7280] leading-4">{help}</span>}
    </label>
  )
}

function PlainSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

/* ---- Config card (matched screenshot fields; no status badges here) ---- */
function ConfigCard({ candidate, index, removable, onChange, onRemove }: {
  candidate: EntityCandidate
  index: number
  removable: boolean
  onChange: (next: EntityCandidate) => void
  onRemove: () => void
}) {
  const template = EXISTING_ENTITIES.find((e) => e.id === candidate.templateEntityId) ?? null
  const carried = CARRY_ITEMS.filter((c) => candidate.carrySet[c.key]).map((c) => c.label)
  const set = (patch: Partial<EntityCandidate>) => onChange({ ...candidate, ...patch })
  const setOverride = (key: keyof EntityOverrides, val: string) => onChange({ ...candidate, overrides: { ...candidate.overrides, [key]: val } })
  const pickTemplate = (id: string) => {
    const tpl = EXISTING_ENTITIES.find((e) => e.id === id)
    onChange({ ...candidate, templateEntityId: id, overrides: tpl ? { ...tpl.settings } : candidate.overrides })
  }
  return (
    <div className="rounded-[8px] border border-[#e1e6ef] p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#1d2433]">Entity {index + 1}</span>
        {removable && (
          <button type="button" onClick={onRemove} aria-label="Remove entity" className="text-[#9ca3af] hover:text-[#d24747]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m-9 0v14a1 1 0 001 1h8a1 1 0 001-1V6" />
            </svg>
          </button>
        )}
      </div>

      <Field label="Copy settings from existing entity" help={COPY_FROM_HELP}>
        <select className={inputCls} value={candidate.templateEntityId} onChange={(e) => pickTemplate(e.target.value)}>
          <option value="">None</option>
          {EXISTING_ENTITIES.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </Field>

      {template && carried.length > 0 && (
        <p className="text-[12px] text-[#6b7280] -mt-2">Copying over: {carried.join(' · ')}</p>
      )}

      <Field label="New entity name" required>
        <input className={inputCls} placeholder="e.g. FloQast LATAM S.A." value={candidate.name} onChange={(e) => set({ name: e.target.value })} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        {SETTING_FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <PlainSelect value={candidate.overrides[f.key]} onChange={(val) => setOverride(f.key, val)} options={f.options} />
          </Field>
        ))}
      </div>

      {template && (
        <div className="rounded-[6px] bg-[#f8fafc] border border-[#e1e6ef] p-3">
          <p className="text-[12px] font-semibold text-[#6b7280]">Additional settings copied from {template.name} — editable later in Settings</p>
          <p className="text-[12px] text-[#6b7280] mt-1">{ADDITIONAL_COPIED_SETTINGS.join(' · ')}</p>
        </div>
      )}
    </div>
  )
}

/* ---- GL / Integrations (Change 4d — unchanged, now after mapping) ---- */
function GlCard({ candidate, index, existingConnections, onChange, onSelectNew }: {
  candidate: EntityCandidate
  index: number
  existingConnections: GlConnection[]
  onChange: (next: EntityCandidate) => void
  onSelectNew: () => void
}) {
  return (
    <div className="rounded-[8px] border border-[#e1e6ef] p-4 flex flex-col gap-3">
      <span className="text-[13px] font-semibold text-[#1d2433]">{candidate.name || `Entity ${index + 1}`}</span>
      <div className="flex flex-col gap-1">
        <span className="text-[12px] font-semibold text-[#6b7280]">General Ledger</span>
        <span className="text-[13px] text-[#1d2433]">{candidate.glTarget || 'None'}</span>
      </div>
      {candidate.glTarget ? (
        <div>
          <button type="button" onClick={() => onChange({ ...candidate, glTarget: '' })} className="text-[13px] font-semibold text-[#1e8ae9] hover:underline">
            Clear
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <select className={inputCls} value="" onChange={(e) => e.target.value && onChange({ ...candidate, glTarget: e.target.value })}>
            <option value="">Select existing general ledger</option>
            {existingConnections.map((g) => (
              <option key={g.id} value={g.name}>
                {g.name} · last synced {g.lastSynced}
              </option>
            ))}
          </select>
          <div>
            <Button color="primary" variant="outlined" onClick={onSelectNew}>
              Select new general ledger
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function CreateEntityScreen({
  stage,
  candidates,
  onChange,
  existingConnections,
  onConfigContinue,
  onDocsAnalyzed,
  onBuildComplete,
  onMappingFinalize,
  onSelectNewGl,
  onGlContinue,
  onStepBack,
  result,
  onSubmit,
}: {
  stage: 'gathering' | 'config' | 'docs' | 'clarify' | 'build' | 'mapping' | 'gl' | 'users'
  candidates: EntityCandidate[]
  onChange: (next: EntityCandidate[]) => void
  existingConnections: GlConnection[]
  onConfigContinue: () => void
  onDocsAnalyzed: () => void
  onBuildComplete: () => void
  onMappingFinalize: () => void
  onSelectNewGl: (index: number) => void
  onGlContinue: () => void
  /** Navigate to the previous step. Undefined on the first/transient stages. */
  onStepBack?: () => void
  result: EntityResult | null
  onSubmit: (payload: EntityPayload[]) => void
}) {
  const updateAt = (i: number, next: EntityCandidate) => onChange(candidates.map((c, idx) => (idx === i ? next : c)))
  const addEntity = () => onChange([...candidates, makeEntityCandidate()])
  const removeAt = (i: number) => onChange(candidates.filter((_, idx) => idx !== i))
  const entityNames = candidates.map((c, i) => c.name.trim() || `Entity ${i + 1}`)

  // ---- Success ----
  if (result) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-[760px] flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: 'var(--flo-sem-color-surface-success-weakest)', color: 'var(--flo-sem-color-content-success-strong)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <div className="flex flex-col">
              <h2 className="text-[20px] font-bold text-[#1d2433]">
                {result.created} {result.created === 1 ? 'entity' : 'entities'} created
              </h2>
              {/* PHASE 2 SEAM: with background jobs this becomes "creating… / hidden until built". */}
              <p className="text-[13px] text-[#6b7280]">General ledgers are connected; provisioning continues in the background later.</p>
            </div>
          </div>
          <div className="rounded-[8px] border border-[#e1e6ef] divide-y divide-[#f1f3f9]">
            {result.entities.map((e, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 text-[13px]">
                <span className="font-medium text-[#1d2433]">{e.name}</span>
                <span className="text-[#6b7280]">{e.glTarget}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ---- Gathering (idle until chat captures all N) ----
  if (stage === 'gathering') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="max-w-[360px] text-center flex flex-col gap-2">
          <h2 className="text-[16px] font-semibold text-[#1d2433]">Let's set up your entities</h2>
          <p className="text-[13px] text-[#6b7280]">Answer the questions in the chat — your entities will appear here to review.</p>
        </div>
      </div>
    )
  }

  // ---- Docs (reuse onboarding doc-upload, Change 4b) ----
  if (stage === 'docs') {
    return (
      <div className="h-full flex flex-col gap-4">
        {onStepBack && <div className="shrink-0">{<BackLink onBack={onStepBack} />}</div>}
        <p className="shrink-0 text-[13px] text-[#6b7280]">
          Add documentation to fill any remaining gaps. If you copied everything else from an existing entity, this may just be the reconciliation structure.
        </p>
        <div className="flex-1 min-h-0">
          <UploadDocsScreen onAnalyzed={onDocsAnalyzed} />
        </div>
      </div>
    )
  }

  // ---- Clarifying questions (Change 3 — asked in the chat) ----
  if (stage === 'clarify') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="max-w-[380px] text-center flex flex-col gap-2">
          <h2 className="text-[16px] font-semibold text-[#1d2433]">A few clarifying questions</h2>
          <p className="text-[13px] text-[#6b7280]">Answer them in the chat and I'll finalize your mapping.</p>
        </div>
      </div>
    )
  }

  // ---- Mapping analysis + view (reused unchanged) ----
  if (stage === 'build') return <BuildProgressScreen onComplete={onBuildComplete} />
  if (stage === 'mapping') {
    return (
      <div className="h-full flex flex-col gap-3">
        {onStepBack && <div className="shrink-0">{<BackLink onBack={onStepBack} />}</div>}
        <div className="flex-1 min-h-0">
          <MappingScreen entities={entityNames} onFinalize={onMappingFinalize} finalizeLabel="Continue to Integrations" />
        </div>
      </div>
    )
  }

  // ---- Config (Change 4a) ----
  if (stage === 'config') {
    const canContinue = candidates.every((c) => c.name.trim() !== '')
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-[760px] flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-[28px] leading-tight font-bold text-[#1d2433]">Add entity details</h2>
            <p className="text-[14px] text-[#6b7280]">Review and adjust each entity, then continue to add documentation.</p>
          </div>
          {candidates.map((c, i) => (
            <ConfigCard key={c.id} candidate={c} index={i} removable={candidates.length > 1} onChange={(next) => updateAt(i, next)} onRemove={() => removeAt(i)} />
          ))}
          <div>
            <button type="button" onClick={addEntity} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1e8ae9] hover:underline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add another entity
            </button>
          </div>
          <div className="flex items-center justify-end border-t border-[#e1e6ef] pt-4">
            <Button color="primary" variant="filled" disabled={!canContinue} onClick={onConfigContinue}>
              Continue to Mapping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ---- Users step (per entity, after Integrations) ----
  if (stage === 'users') {
    const usersSummary = summarize(candidates)
    const create = () => {
      const ready = candidates.filter((c) => validateEntityCandidate(c, candidates).status === 'ready')
      onSubmit(
        ready.map((c) => ({ name: c.name.trim(), templateEntityId: c.templateEntityId, carrySet: c.carrySet, overrides: c.overrides, glTarget: c.glTarget, userIds: c.userIds })),
      )
    }
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-[760px] flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-[28px] leading-tight font-bold text-[#1d2433]">Add users</h2>
            <p className="text-[14px] text-[#6b7280]">Choose who should have access to each entity. Carried-over users are pre-selected.</p>
          </div>
          {candidates.map((c, i) => (
            <div key={c.id} className="rounded-[8px] border border-[#e1e6ef] p-4 flex flex-col gap-3">
              <span className="text-[13px] font-semibold text-[#1d2433]">{c.name.trim() || `Entity ${i + 1}`}</span>
              <UserMultiSelect selectedIds={c.userIds} onChange={(ids) => updateAt(i, { ...c, userIds: ids })} />
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-[#e1e6ef] pt-4">
            {onStepBack ? <BackLink onBack={onStepBack} /> : <span />}
            <Button color="primary" variant="filled" disabled={usersSummary.ready === 0} onClick={create}>
              {usersSummary.ready > 0 ? `Create ${usersSummary.ready} ${usersSummary.ready === 1 ? 'entity' : 'entities'}` : 'Create entities'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ---- GL / Integrations (now followed by the Users step) ----
  const summary = summarize(candidates)
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[760px] flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-[28px] leading-tight font-bold text-[#1d2433]">Integrations</h2>
          <p className="text-[14px] text-[#6b7280]">Assign a general ledger to each entity — reuse an existing connection or set up a new one.</p>
        </div>
        {candidates.map((c, i) => (
          <GlCard key={c.id} candidate={c} index={i} existingConnections={existingConnections} onChange={(next) => updateAt(i, next)} onSelectNew={() => onSelectNewGl(i)} />
        ))}
        <div className="flex items-center justify-between border-t border-[#e1e6ef] pt-4">
          {onStepBack ? <BackLink onBack={onStepBack} /> : <span />}
          <Button color="primary" variant="filled" disabled={summary.ready === 0} onClick={onGlContinue}>
            Continue to add users
          </Button>
        </div>
      </div>
    </div>
  )
}
