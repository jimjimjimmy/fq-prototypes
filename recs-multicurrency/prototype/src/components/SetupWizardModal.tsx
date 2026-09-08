import { useState } from 'react'

const MUSEO = "'Museo Sans', sans-serif"
const INTER = "'Inter', sans-serif"

const STEPS = [
  { num: 1, label: 'Currencies' },
  { num: 2, label: 'FX Rates' },
]

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'MXN', 'CAD', 'AUD', 'CHF']

const ENTITIES = [
  { id: 'beckys', name: "Becky's Donuts", currency: 'USD' },
  { id: 'global', name: 'Global Modern Services, Inc.', currency: 'MXN' },
  { id: 'medium', name: 'Medium Rare Donuts', currency: 'EUR' },
]

// ── Shared tip component ───────────────────────────────────────

function InfoTip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      background: '#f0f5ff', border: '1px solid #3d7bf7', borderRadius: 6,
      padding: '10px 14px',
    }}>
      <span className="material-icons" style={{ fontSize: 16, color: '#3d7bf7', flexShrink: 0, marginTop: 1 }}>info</span>
      <p style={{ fontSize: 12, color: '#1b1f27', fontFamily: INTER, margin: 0, lineHeight: '18px' }}>
        {children}
      </p>
    </div>
  )
}

// Step indicator - matches FlowUI Progress-steps

function StepCircle({ done, active }: { done: boolean; active: boolean }) {
  let inner: React.ReactNode
  if (done) {
    inner = (
      <div style={{
        width: 16, height: 16, borderRadius: '50%', background: '#1FAC76',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 3.5L3.8 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )
  } else if (active) {
    inner = (
      <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #1FAC76', background: 'white' }} />
    )
  } else {
    inner = (
      <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid #cbd2e1', background: 'white' }} />
    )
  }
  return (
    <div style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {inner}
    </div>
  )
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 20 }}>
      {STEPS.map((step, i) => {
        const done = current > step.num
        const active = current === step.num
        const isLast = i === STEPS.length - 1
        return (
          <div key={step.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <div style={{ flex: 1, height: 2, background: i === 0 ? 'transparent' : (done || active ? '#1FAC76' : '#e1e6ef') }} />
              <StepCircle done={done} active={active} />
              <div style={{ flex: 1, height: 2, background: isLast ? 'transparent' : (done ? '#1FAC76' : '#e1e6ef') }} />
            </div>
            <span style={{
              marginTop: 6, textAlign: 'center',
              fontSize: 11, lineHeight: '16px', whiteSpace: 'nowrap',
              color: done || active ? '#1d2433' : '#94a3b8',
              fontFamily: MUSEO, fontWeight: 700,
            }}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Step 1: Currencies ─────────────────────────────────────────

function CurrencySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          height: 36, padding: '0 36px 0 10px', borderRadius: 6,
          border: '1px solid #cbd2e1', fontSize: 12, fontFamily: INTER,
          color: '#1d2433', background: 'white', cursor: 'pointer',
          minWidth: 110, appearance: 'none', WebkitAppearance: 'none',
        } as React.CSSProperties}
      >
        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

function Step1Currencies({
  reportingCurrency, onReportingChange,
  entityCurrencies, onEntityChange,
}: {
  reportingCurrency: string
  onReportingChange: (v: string) => void
  entityCurrencies: Record<string, string>
  onEntityChange: (id: string, v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Reporting currency */}
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1d2433', fontFamily: INTER, marginBottom: 6 }}>
          Reporting currency
        </label>
        <p style={{ fontSize: 12, color: '#6b7280', fontFamily: INTER, marginBottom: 10, lineHeight: '18px' }}>
          All entities will be consolidated into this currency for the Reporting view.
        </p>
        <CurrencySelect value={reportingCurrency} onChange={onReportingChange} />
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #e1e6ef' }} />

      {/* Functional per entity */}
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1d2433', fontFamily: INTER, marginBottom: 6 }}>
          Functional currency per entity
        </label>
        <p style={{ fontSize: 12, color: '#6b7280', fontFamily: INTER, marginBottom: 12, lineHeight: '18px' }}>
          Each entity records transactions in its functional currency. FloQast translates these to the reporting currency.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid #e1e6ef', borderRadius: 6, overflow: 'hidden' }}>
          {ENTITIES.map((entity, i) => (
            <div key={entity.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px',
              borderTop: i > 0 ? '1px solid #e1e6ef' : undefined,
              background: 'white',
            }}>
              <span style={{ fontSize: 12, color: '#1d2433', fontFamily: INTER }}>{entity.name}</span>
              <CurrencySelect value={entityCurrencies[entity.id] ?? entity.currency} onChange={v => onEntityChange(entity.id, v)} />
            </div>
          ))}
        </div>
      </div>
      <InfoTip>You can update these settings at any time from <strong>Admin Settings</strong> in the overflow menu.</InfoTip>
    </div>
  )
}

// ── Step 2: FX Rates ───────────────────────────────────────────

function Step2FxRates({ uploaded, onUpload }: { uploaded: boolean; onUpload: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {uploaded ? (
        <div style={{
          border: '1px solid #1FAC76', borderRadius: 8, padding: '16px 20px',
          background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span className="material-icons" style={{ fontSize: 20, color: '#1FAC76' }}>check_circle</span>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#1d2433', fontFamily: INTER, margin: 0 }}>Rates uploaded for Oct 2025</p>
            <p style={{ fontSize: 11, color: '#6b7280', fontFamily: INTER, margin: '2px 0 0' }}>8 pairs · Last updated just now</p>
          </div>
        </div>
      ) : (
        <div style={{
          border: '1px dashed #1d5bd6', borderRadius: 6,
          minHeight: 160,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: '#f8fafc',
        }}>
          <button
            onClick={onUpload}
            style={{
              height: 40, padding: '0 16px', borderRadius: 6,
              background: '#3d7bf7', color: 'white',
              fontSize: 12, fontFamily: MUSEO, fontWeight: 700,
              border: 'none', cursor: 'pointer', letterSpacing: '-0.12px',
            }}
          >
            Upload Files
          </button>
          <p style={{ fontSize: 11, color: '#6b7280', fontFamily: INTER, fontWeight: 400, margin: 0, lineHeight: '16px' }}>
            drag &amp; drop your CSV file here
          </p>
        </div>
      )}
      <p style={{ fontSize: 12, color: '#6b7280', fontFamily: INTER, margin: 0, lineHeight: '18px' }}>
        Upload a CSV with period-end exchange rates. FloQast auto-fills the inverse for each pair.
      </p>
      <InfoTip>You can view and upload rates at any time from the <strong>FX Rates</strong> button in the toolbar.</InfoTip>
    </div>
  )
}

// ── Main modal ─────────────────────────────────────────────────

interface SetupWizardModalProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
  onRatesUploaded?: () => void
}

export function SetupWizardModal({ open, onClose, onComplete, onRatesUploaded }: SetupWizardModalProps) {
  const [step, setStep] = useState(1)

  // Step 1 state
  const [reportingCurrency, setReportingCurrency] = useState('USD')
  const [entityCurrencies, setEntityCurrencies] = useState<Record<string, string>>(
    Object.fromEntries(ENTITIES.map(e => [e.id, e.currency]))
  )

  // Step 2 state
  const [ratesUploaded, setRatesUploaded] = useState(false)

  function handleNext() {
    if (step < 2) setStep(s => s + 1)
    else handleFinish()
  }

  function handleBack() {
    if (step > 1) setStep(s => s - 1)
  }

  function handleSkip() {
    if (step < 2) setStep(s => s + 1)
    else handleFinish()
  }

  function handleFinish() {
    onComplete()
    onClose()
    // Reset for next open
    setTimeout(() => { setStep(1); setRatesUploaded(false) }, 300)
  }

  if (!open) return null

  const isLastStep = step === 2
  const canSkip = step > 1

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999 }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 540,
          background: 'white', borderRadius: 8,
          boxShadow: '0px 20px 50px -8px rgba(0,0,0,0.18), 0px 0px 0px 1px rgba(0,0,0,0.04)',
          zIndex: 1000,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: 16,
          borderBottom: '1px solid #e1e6ef', flexShrink: 0,
        }}>
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: MUSEO, fontWeight: 700,
            fontSize: 16, lineHeight: '20px', color: '#1d2433',
          }}>
            Multi-Currency Setup
          </h2>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}
            className="hover:bg-[#f3f4f6]"
          >
            <span className="material-icons-outlined" style={{ fontSize: 20, color: '#6b7280' }}>close</span>
          </button>
        </div>

        {/* Stepper - sticky, outside scroll area */}
        <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
          <StepIndicator current={step} />
        </div>

        {/* Body */}
        <div style={{ padding: '0 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>

          {step === 1 && (
            <div style={{ paddingTop: 8, paddingBottom: 24 }}>
              <Step1Currencies
                reportingCurrency={reportingCurrency}
                onReportingChange={setReportingCurrency}
                entityCurrencies={entityCurrencies}
                onEntityChange={(id, v) => setEntityCurrencies(prev => ({ ...prev, [id]: v }))}
              />
            </div>
          )}
          {step === 2 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 24 }}>
              <Step2FxRates uploaded={ratesUploaded} onUpload={() => { setRatesUploaded(true); onRatesUploaded?.() }} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid #e1e6ef', flexShrink: 0,
          background: '#f8fafc',
        }}>
          {/* Left: Back */}
          <div>
            {step > 1 && (
              <button
                onClick={handleBack}
                style={{
                  height: 36, padding: '0 16px', borderRadius: 6,
                  border: '1px solid #cbd2e1', background: 'white',
                  fontSize: 12, fontFamily: MUSEO, fontWeight: 700,
                  color: '#6b7280', cursor: 'pointer',
                }}
                className="hover:bg-[#f3f4f6]"
              >
                Back
              </button>
            )}
          </div>

          {/* Right: Skip + Next/Finish */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {canSkip && (
              <button
                onClick={handleSkip}
                style={{
                  height: 36, padding: '0 16px', borderRadius: 6,
                  border: 'none', background: 'transparent',
                  fontSize: 12, fontFamily: MUSEO, fontWeight: 700,
                  color: '#6b7280', cursor: 'pointer',
                }}
                className="hover:bg-[#f3f4f6]"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                height: 36, padding: '0 20px', borderRadius: 6,
                background: '#1FAC76', color: 'white', border: 'none',
                fontSize: 12, fontFamily: MUSEO, fontWeight: 700,
                cursor: 'pointer',
              }}
              className="hover:bg-[#179e6a]"
            >
              {isLastStep ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
