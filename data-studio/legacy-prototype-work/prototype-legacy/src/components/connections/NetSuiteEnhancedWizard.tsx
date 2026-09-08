import { useState, useEffect, useRef } from 'react'
import { Modal, Button, Input } from '@floqastinc/flow-ui_core'
import { FQ_ENTITIES } from '../../data/connections'

type Step = 0 | 1 | 2 | 3 | 4
const STEP_LABELS = ['Name', 'Credentials', 'Tables', 'Entity Mapping', 'Validate']

const STANDARD_TABLES = [
  'Account',
  'Account Subsidiary Map',
  'Account Type',
  'Accounting Book',
  'Accounting Period',
  'Budgets',
  'Classification',
  'Consolidated Exchange Rate',
  'Currency',
  'Currency Rate',
  'Custom Field',
  'Customer',
  'Department',
  'Entity',
  'Job',
  'Location',
  'Other Name',
  'Partner',
  'Subsidiary',
  'Transaction',
  'Transaction Accounting Line',
  'Transaction Accounting Line Type',
  'Transaction Line',
  'Vendor',
]

const MOCK_NS_SUBSIDIARIES = [
  'Acme Corp (Parent)',
  'Acme — United States',
  'Acme — EMEA',
  'Acme — Canada',
]

interface ValidationCheck {
  label: string
  status: 'pending' | 'checking' | 'done'
}

type FetchState = 'loading' | 'success' | 'failed'

interface Props {
  onClose: () => void
  onComplete: (connectionName: string) => void
}

export default function NetSuiteEnhancedWizard({ onClose, onComplete }: Props) {
  const [step, setStep] = useState<Step>(0)
  const [connectionName, setConnectionName] = useState('')
  const [dataToken, setDataToken] = useState('')
  const [dataTokenSecret, setDataTokenSecret] = useState('')
  const [subsidiaries, setSubsidiaries] = useState<string[]>([])
  const [entityFetchState, setEntityFetchState] = useState<FetchState>('loading')
  const [entityMappings, setEntityMappings] = useState<Record<string, string>>({})
  const [checks, setChecks] = useState<ValidationCheck[]>([])
  const [validationDone, setValidationDone] = useState(false)

  // Simulate subsidiary fetch when entering entity mapping step
  useEffect(() => {
    if (step !== 3) return
    setEntityFetchState('loading')
    setSubsidiaries([])
    const timer = setTimeout(() => {
      setEntityFetchState('success')
      setSubsidiaries(MOCK_NS_SUBSIDIARIES)
    }, 1500)
    return () => clearTimeout(timer)
  }, [step])

  // Run validation checks when entering validate step
  useEffect(() => {
    if (step !== 4) return

    const CHECK_LABELS = [
      'Connection authenticated',
      'Transactions — accessible',
      'Accounts — accessible',
      'GL Lines — accessible',
    ]

    setChecks(CHECK_LABELS.map(label => ({ label, status: 'pending' })))
    setValidationDone(false)

    let i = 0
    const tick = setInterval(() => {
      if (i < CHECK_LABELS.length) {
        const idx = i
        setChecks(prev => prev.map((c, ci) => ({
          ...c,
          status: ci < idx ? 'done' : ci === idx ? 'checking' : 'pending',
        })))
        i++
      } else {
        setChecks(prev => prev.map(c => ({ ...c, status: 'done' })))
        setValidationDone(true)
        clearInterval(tick)
      }
    }, 750)

    return () => clearInterval(tick)
  }, [step])

  const canNext = () => {
    if (step === 0) return connectionName.trim().length > 0
    if (step === 1) return dataToken.trim().length > 0 && dataTokenSecret.trim().length > 0
    if (step === 3) return subsidiaries.length > 0 && subsidiaries.every(s => !!entityMappings[s])
    return true
  }

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as Step)
  }

  const handleBack = () => {
    if (step > 0) setStep((step - 1) as Step)
  }

  return (
    <Modal open={true} onOpenChange={(v: boolean) => !v && onClose()} size="lg">
      <Modal.Header>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#FFF7ED', border: '1px solid #FDBA74' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12V2l10 10V2" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[14px] font-semibold text-gray-900">NetSuite Enhanced</span>
        </div>
      </Modal.Header>

      <Modal.Body>
        <WizardStepper current={step} />

        <div className="mt-6">
          {step === 0 && (
            <StepName value={connectionName} onChange={setConnectionName} />
          )}
          {step === 1 && (
            <StepCredentials
              dataToken={dataToken}
              setDataToken={setDataToken}
              dataTokenSecret={dataTokenSecret}
              setDataTokenSecret={setDataTokenSecret}
            />
          )}
          {step === 2 && (
            <StepTables />
          )}
          {step === 3 && (
            <StepEntityMapping
              fetchState={entityFetchState}
              subsidiaries={subsidiaries}
              mappings={entityMappings}
              onSubsidiariesChange={setSubsidiaries}
              onFetchStateChange={setEntityFetchState}
              onMappingChange={(sub, entity) =>
                setEntityMappings(prev => ({ ...prev, [sub]: entity }))
              }
            />
          )}
          {step === 4 && (
            <StepValidate checks={checks} done={validationDone} />
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-between w-full">
          <Button variant="outlined" color="dark" onClick={step === 0 ? onClose : handleBack}>
            {step === 0 ? 'Cancel' : '← Back'}
          </Button>
          {step < 4 ? (
            <Button disabled={!canNext()} onClick={handleNext}>Next →</Button>
          ) : (
            <Button disabled={!validationDone} onClick={() => onComplete(connectionName)}>
              Save & Connect
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  )
}

/* ── Stepper ── */

function WizardStepper({ current }: { current: number }) {
  return (
    <div className="flex items-start justify-center">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{
                backgroundColor: i <= current ? '#186749' : '#F3F4F6',
                color: i <= current ? '#fff' : '#9CA3AF',
              }}
            >
              {i < current ? (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className="text-[11px] whitespace-nowrap"
              style={{ color: i <= current ? '#186749' : '#9CA3AF', fontWeight: i === current ? 600 : 400 }}
            >
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div
              className="h-[1.5px] w-10 shrink-0 mb-5"
              style={{ backgroundColor: i < current ? '#186749' : '#E5E7EB' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Step 1: Name ── */

function StepName({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[13px] text-gray-500">Give this connection a name to identify it in Data Studio.</p>
      <div>
        <label className="text-[12px] font-medium text-gray-700 block mb-1.5">Connection Name</label>
        <Input
          value={value}
          onChange={(value: unknown) => onChange(value as string)}
          placeholder="e.g., Acme Corp — NetSuite Enhanced"
        />
        <p className="text-[11px] text-gray-400 mt-1.5">This name will identify your connection in Data Studio.</p>
      </div>
    </div>
  )
}

/* ── Step 2: Credentials ── */

function StepCredentials({ dataToken, setDataToken, dataTokenSecret, setDataTokenSecret }: {
  dataToken: string
  setDataToken: (v: string) => void
  dataTokenSecret: string
  setDataTokenSecret: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[13px] text-gray-500">Enter your NetSuite Enhanced credentials to authenticate the data connection.</p>
      <div>
        <label className="text-[12px] font-medium text-gray-700 block mb-1.5">NetSuite Enhanced Data Token</label>
        <Input
          value={dataToken}
          onChange={(value: unknown) => setDataToken(value as string)}
          placeholder="Enter data token"
        />
      </div>
      <div>
        <label className="text-[12px] font-medium text-gray-700 block mb-1.5">NetSuite Enhanced Data Token Secret</label>
        <Input
          value={dataTokenSecret}
          type="password"
          onChange={(value: unknown) => setDataTokenSecret(value as string)}
          placeholder="Enter data token secret"
        />
      </div>
    </div>
  )
}

/* ── Step 3: Tables ── */

const TABLES_PREVIEW_COUNT = 4

function StepTables() {
  const [expanded, setExpanded] = useState(false)
  const expandRef = useRef<HTMLButtonElement>(null)
  const visibleTables = expanded ? STANDARD_TABLES : STANDARD_TABLES.slice(0, TABLES_PREVIEW_COUNT)
  const hiddenCount = STANDARD_TABLES.length - TABLES_PREVIEW_COUNT

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-gray-700">Standard Tables</span>
        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Required · {STANDARD_TABLES.length} tables</span>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {visibleTables.map((table, i) => (
          <div
            key={table}
            className={`flex items-center gap-3 px-4 py-2.5 bg-gray-50 ${i > 0 ? 'border-t border-gray-100' : ''}`}
          >
            <span className="text-[13px] text-gray-700 flex-1">{table}</span>
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" className="text-gray-300">
              <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3.5 6V4a2.5 2.5 0 115 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        ))}
        <button
          ref={expandRef}
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1.5 w-full px-4 py-2.5 border-t border-gray-100 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            className="text-gray-400"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms' }}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[12px] text-gray-500">
            {expanded ? 'Show fewer tables' : `Show ${hiddenCount} more tables`}
          </span>
        </button>
      </div>
      <p className="text-[11px] text-gray-400">These tables are required for FloQast models and cannot be removed.</p>
    </div>
  )
}

/* ── Step 4: Entity Mapping ── */

function StepEntityMapping({ fetchState, subsidiaries, mappings, onSubsidiariesChange, onFetchStateChange, onMappingChange }: {
  fetchState: FetchState
  subsidiaries: string[]
  mappings: Record<string, string>
  onSubsidiariesChange: (subs: string[]) => void
  onFetchStateChange: (state: FetchState) => void
  onMappingChange: (sub: string, entity: string) => void
}) {
  const [manualInput, setManualInput] = useState('')

  const addManual = () => {
    const name = manualInput.trim()
    if (!name || subsidiaries.includes(name)) return
    onSubsidiariesChange([...subsidiaries, name])
    setManualInput('')
  }

  if (fetchState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-spin text-gray-400">
          <circle cx="12" cy="12" r="10" stroke="#E5E7EB" strokeWidth="2" />
          <path d="M12 2a10 10 0 0110 10" stroke="#186749" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="text-[13px] text-gray-500">Loading subsidiaries from NetSuite…</p>
      </div>
    )
  }

  if (fetchState === 'failed') {
    return (
      <div className="flex flex-col gap-4">
        <div className="p-3 rounded-lg flex items-start gap-2.5" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
            <path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke="#D97706" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M8 6v3.5M8 11v.5" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <div>
            <p className="text-[13px] font-medium text-amber-800">Couldn't load subsidiaries from NetSuite</p>
            <p className="text-[12px] text-amber-700 mt-0.5">Add your subsidiaries manually below and map them to FloQast entities.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={manualInput}
              onChange={(value: unknown) => setManualInput(value as string)}
              placeholder="e.g., Acme — United States"
            />
          </div>
          <Button
            variant="outlined"
            color="dark"
            disabled={!manualInput.trim()}
            onClick={addManual}
          >
            Add
          </Button>
        </div>

        {subsidiaries.length > 0 && (
          <MappingTable subsidiaries={subsidiaries} mappings={mappings} onMappingChange={onMappingChange} />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[13px] text-gray-500">Map each NetSuite subsidiary to a FloQast entity. All subsidiaries must be mapped before you can continue.</p>
      </div>
      <MappingTable subsidiaries={subsidiaries} mappings={mappings} onMappingChange={onMappingChange} />
      <button
        className="text-[12px] text-gray-400 hover:text-gray-600 underline text-left w-fit transition-colors"
        onClick={() => onFetchStateChange('failed')}
      >
        Can't find a subsidiary?
      </button>
    </div>
  )
}

function MappingTable({ subsidiaries, mappings, onMappingChange }: {
  subsidiaries: string[]
  mappings: Record<string, string>
  onMappingChange: (sub: string, entity: string) => void
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">NetSuite Subsidiary</span>
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">FloQast Entity</span>
      </div>
      {subsidiaries.map((sub, i) => {
        const mapped = mappings[sub]
        return (
          <div
            key={sub}
            className={`grid grid-cols-2 items-center px-4 py-2.5 gap-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}
          >
            <span className="text-[13px] text-gray-800 truncate">{sub}</span>
            <select
              value={mapped ?? ''}
              onChange={e => onMappingChange(sub, e.target.value)}
              className="text-[13px] rounded-md border px-2.5 py-1.5 outline-none focus:ring-2 w-full"
              style={{
                borderColor: mapped ? '#D1D5DB' : '#FCA5A5',
                backgroundColor: mapped ? '#fff' : '#FFF5F5',
                color: mapped ? '#111827' : '#9CA3AF',
                boxShadow: 'none',
              }}
            >
              <option value="" disabled>Select entity…</option>
              {FQ_ENTITIES.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        )
      })}
    </div>
  )
}

/* ── Step 5: Validate ── */

function StepValidate({ checks, done }: { checks: ValidationCheck[]; done: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[13px] text-gray-500">Verifying your NetSuite Enhanced connection…</p>

      <div className="flex flex-col gap-3">
        {checks.map(check => (
          <div key={check.label} className="flex items-center gap-3">
            {check.status === 'done' ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
                <circle cx="9" cy="9" r="8.25" stroke="#16a34a" strokeWidth="1.5" />
                <path d="M5.5 9l2.5 2.5 5-5" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : check.status === 'checking' ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 animate-spin">
                <circle cx="9" cy="9" r="8.25" stroke="#E5E7EB" strokeWidth="1.5" />
                <path d="M9 0.75a8.25 8.25 0 018.25 8.25" stroke="#186749" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-200 shrink-0" />
            )}
            <span
              className="text-[13px]"
              style={{
                color: check.status === 'done' ? '#16a34a' : check.status === 'checking' ? '#374151' : '#9CA3AF',
              }}
            >
              {check.label}
            </span>
          </div>
        ))}
      </div>

      {done && (
        <div
          className="mt-2 p-3.5 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: '#F0FDF9', border: '1px solid #A7F3D0' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
            <circle cx="9" cy="9" r="9" fill="#186749" />
            <path d="M5.5 9l2.5 2.5 5-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[13px] font-semibold" style={{ color: '#14532D' }}>Your connection is ready.</span>
        </div>
      )}
    </div>
  )
}
