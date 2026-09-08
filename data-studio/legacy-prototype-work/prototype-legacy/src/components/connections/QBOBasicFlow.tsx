import { useState } from 'react'
import { FQ_ENTITIES } from '../../data/connections'
import { Button, Input, Modal, Select } from '@floqastinc/flow-ui_core'

interface Props {
  onClose: () => void
  onComplete: (connectionName: string) => void
}

const STEPS = ['Name', 'Authorize', 'Validate', 'Configure']
type ValidationState = null | 'validating' | 'success' | 'error'

export default function QBOBasicFlow({ onClose, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [connectionName, setConnectionName] = useState('')
  const [showOAuth, setShowOAuth] = useState(false)
  const [oauthDone, setOAuthDone] = useState(false)
  const [validation, setValidation] = useState<ValidationState>(null)
  const [validationError, setValidationError] = useState('')
  const [dataSetup, setDataSetup] = useState<'standard' | 'custom'>('standard')
  const [selectedEntity, setSelectedEntity] = useState(FQ_ENTITIES[0])

  const canProceed = () => {
    if (step === 0) return connectionName.trim().length > 0
    if (step === 1) return oauthDone
    if (step === 2) return validation === 'success'
    return true
  }

  const handleValidate = (succeed = true) => {
    setValidation('validating')
    setTimeout(() => {
      if (succeed) {
        setValidation('success')
      } else {
        setValidation('error')
        setValidationError('CONN_ERR_401: Could not authenticate with QuickBooks Online. Please verify your credentials and re-authorize.')
      }
    }, 1800)
  }

  return (
    <Modal open={true} onOpenChange={(v: boolean) => !v && onClose()} size="md">
      <Modal.Header>QuickBooks Online Basic</Modal.Header>
      <Modal.Body>
        <div className="px-1">
          {/* Header subtitle */}
          <p className="text-[13px] text-gray-500 mb-5">Standard connection via QBO REST API</p>

          {/* Stepper */}
          <div className="flex items-center mt-5 mb-7">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : undefined }}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{
                      backgroundColor: i < step ? '#186749' : i === step ? '#fff' : '#F3F4F6',
                      border: `2px solid ${i <= step ? '#186749' : '#E5E7EB'}`,
                      color: i < step ? '#fff' : i === step ? '#186749' : '#9CA3AF',
                    }}
                  >
                    {i < step ? (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className="text-[10px] whitespace-nowrap" style={{ fontWeight: i === step ? 600 : 400, color: i === step ? '#111' : i < step ? '#186749' : '#9CA3AF' }}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1.5 mb-4" style={{ backgroundColor: i < step ? '#186749' : '#E5E7EB' }} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div style={{ minHeight: '200px', marginBottom: '24px' }}>
            {/* Step 0 — Name */}
            {step === 0 && (
              <div>
                <Input
                  label="Connection Name"
                  value={connectionName}
                  onChange={(e: unknown) => setConnectionName((e as React.ChangeEvent<HTMLInputElement>).target.value)}
                  placeholder="e.g. Acme Corp QBO Basic"
                  className="w-full"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">Give your connection a descriptive name to identify it later.</p>
              </div>
            )}

            {/* Step 1 — Authorize */}
            {step === 1 && (
              <div className="flex flex-col items-center gap-4 pt-2">
                {!oauthDone ? (
                  <>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                      <QBOLogo size={34} />
                    </div>
                    <div className="text-center">
                      <p className="text-[15px] font-semibold text-gray-900 mb-1.5">Authorize QuickBooks Online</p>
                      <p className="text-[13px] text-gray-500 max-w-sm leading-relaxed">
                        Click below to connect your QuickBooks account. You'll be redirected to Intuit to authorize FloQast's access.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowOAuth(true)}
                      className="flex items-center gap-2.5 px-6 py-2.5 text-sm font-medium text-white rounded-md"
                      style={{ backgroundColor: '#2CA01C' }}
                    >
                      <QBOLogo size={16} white />
                      Connect to QuickBooks Online
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="#15803D" strokeWidth="1.8"/></svg>
                    </div>
                    <p className="text-[15px] font-semibold text-gray-900">Authorization complete</p>
                    <p className="text-[13px] text-gray-500">Your QuickBooks account has been successfully authorized.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2 — Validate */}
            {step === 2 && (
              <div className="flex flex-col items-center gap-4 pt-2">
                {validation === null && (
                  <>
                    <div className="text-center">
                      <p className="text-[15px] font-semibold text-gray-900 mb-1.5">Validate Connection</p>
                      <p className="text-[13px] text-gray-500">Click "Validate" to verify the connection is working correctly.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleValidate(true)}>Validate Connection</Button>
                      <Button variant="outlined" color="dark" onClick={() => handleValidate(false)}>Simulate Error</Button>
                    </div>
                  </>
                )}
                {validation === 'validating' && (
                  <div className="flex flex-col items-center gap-3.5">
                    <div className="animate-spin w-10 h-10 rounded-full border-[3px] border-gray-200" style={{ borderTopColor: '#186749' }} />
                    <p className="text-[13px] text-gray-500">Validating connection…</p>
                  </div>
                )}
                {validation === 'success' && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="#15803D" strokeWidth="1.8"/></svg>
                    </div>
                    <p className="text-[15px] font-semibold text-gray-900">Connection verified</p>
                    <p className="text-[13px] text-gray-500">Your QuickBooks connection is working correctly.</p>
                  </div>
                )}
                {validation === 'error' && (
                  <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2.5 mb-3">
                      <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/></svg>
                      <div>
                        <p className="text-[13px] font-semibold text-red-800 mb-1">Connection failed</p>
                        <p className="text-[12px] text-red-700 font-mono leading-relaxed">{validationError}</p>
                      </div>
                    </div>
                    <Button color="danger" size="sm" onClick={() => { setValidation(null); setValidationError('') }}>
                      Retry
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3 — Configure */}
            {step === 3 && (
              <div>
                <p className="text-[13px] font-medium text-gray-700 mb-3.5">Choose how you want to set up your data:</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { value: 'standard', label: 'Use standard data setup', desc: 'Auto-configure data models for a selected FloQast entity.' },
                    { value: 'custom', label: 'Build my own setup', desc: 'Manually configure data models and endpoints.' },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg cursor-pointer transition-colors"
                      style={{ border: `1.5px solid ${dataSetup === opt.value ? '#186749' : '#E5E7EB'}`, backgroundColor: dataSetup === opt.value ? '#F0FDF9' : '#fff' }}
                    >
                      <input type="radio" value={opt.value} checked={dataSetup === opt.value} onChange={() => setDataSetup(opt.value as 'standard' | 'custom')} className="mt-0.5 accent-[#186749]" />
                      <div>
                        <div className="text-[13px] font-semibold text-gray-900 mb-0.5">{opt.label}</div>
                        <div className="text-[12px] text-gray-500">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {dataSetup === 'standard' && (
                  <div className="mt-3.5">
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">FloQast Entity</label>
                    <Select
                      options={FQ_ENTITIES.map(e => ({ label: e, value: e }))}
                      value={selectedEntity}
                      onChange={(val) => setSelectedEntity(val as string)}
                      selectionMode="single"
                      disableClear
                    />
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-between w-full">
          <Button
            variant="outlined"
            color="dark"
            onClick={step === 0 ? onClose : () => setStep(step - 1)}
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </Button>
          <Button
            disabled={!canProceed() || validation === 'validating'}
            onClick={step === STEPS.length - 1 ? () => onComplete(connectionName) : () => setStep(step + 1)}
          >
            {step === STEPS.length - 1 ? 'Finish →' : 'Next →'}
          </Button>
        </div>
      </Modal.Footer>

      {/* OAuth consent overlay */}
      {showOAuth && (
        <OAuthConsentScreen
          onAllow={() => { setShowOAuth(false); setOAuthDone(true) }}
          onDeny={() => setShowOAuth(false)}
        />
      )}
    </Modal>
  )
}

function OAuthConsentScreen({ onAllow, onDeny }: { onAllow: () => void; onDeny: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/55 z-[200] flex items-center justify-center" onClick={onDeny}>
      <div className="bg-white rounded-2xl p-8 w-[400px] shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0077C5]">
              <span className="text-white text-xs font-bold">IQ</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Intuit</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200 mx-auto mb-3" />
          <p className="text-[15px] font-semibold text-gray-800 mb-1">Connect QuickBooks Online</p>
          <p className="text-[12px] text-gray-500"><strong>FloQast</strong> is requesting access to your QuickBooks account</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">This will allow FloQast to:</p>
          {['Read financial account data', 'Access company information', 'View account balances and transactions', 'Access chart of accounts'].map(perm => (
            <div key={perm} className="flex items-center gap-2 mb-1.5">
              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="#15803D" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span className="text-[12px] text-gray-600">{perm}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2.5">
          <button onClick={onDeny} className="flex-1 py-2.5 text-sm font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Deny</button>
          <button onClick={onAllow} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-md" style={{ backgroundColor: '#2CA01C' }}>Allow</button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-3">By clicking Allow, you agree to Intuit's Developer Terms of Service</p>
      </div>
    </div>
  )
}

function QBOLogo({ size = 28, white = false }: { size?: number; white?: boolean }) {
  const c = white ? '#fff' : '#2CA01C'
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke={c} strokeWidth="2" fill="none" />
      <path d="M10 14h8M14 10v8" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
