/**
 * Custom Endpoint Setup Wizard
 *
 * 5-step wizard for configuring a custom REST API endpoint.
 * Steps: Integration Type → Connection Basics → Authentication → Endpoint & Params → Review & Save
 */
import { useState } from 'react'
import type { EndpointDef, QueryParam } from '../../data/connections'
import { Button, Input, Modal, Select } from '@floqastinc/flow-ui_core'

interface Props {
  onClose: () => void
  onSave: (endpoint: EndpointDef) => void
}

type IntegrationType = 'Pull' | 'Push' | 'Both'
type AuthType = 'API Key' | 'Bearer Token' | 'Basic Auth' | 'None'

const STEPS = ['Type', 'Basics', 'Auth', 'Endpoint', 'Review']

export default function CustomEndpointWizard({ onClose, onSave }: Props) {
  const [step, setStep] = useState(0)

  // Step 1
  const [integrationType, setIntegrationType] = useState<IntegrationType>('Pull')

  // Step 2
  const [apiName, setApiName] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [environment, setEnvironment] = useState<'Production' | 'Sandbox'>('Production')

  // Step 3
  const [authType, setAuthType] = useState<AuthType>('API Key')
  const [apiKey, setApiKey] = useState('')
  const [bearerToken, setBearerToken] = useState('')
  const [basicUser, setBasicUser] = useState('')
  const [basicPass, setBasicPass] = useState('')
  const [showSecret, setShowSecret] = useState(false)

  // Step 4
  const [endpointPath, setEndpointPath] = useState('')
  const [httpMethod, setHttpMethod] = useState('GET')
  const [queryParams, setQueryParams] = useState<{ key: string; label: string; value: string }[]>([])
  const [newParamKey, setNewParamKey] = useState('')
  const [newParamLabel, setNewParamLabel] = useState('')

  // Step 5 — test
  const [testStatus, setTestStatus] = useState<null | 'testing' | 'success' | 'error'>(null)

  const canProceed = () => {
    if (step === 0) return true
    if (step === 1) return apiName.trim().length > 0 && baseUrl.trim().length > 0
    if (step === 2) {
      if (authType === 'API Key') return apiKey.trim().length > 0
      if (authType === 'Bearer Token') return bearerToken.trim().length > 0
      if (authType === 'Basic Auth') return basicUser.trim().length > 0 && basicPass.trim().length > 0
      return true
    }
    if (step === 3) return endpointPath.trim().length > 0
    return true
  }

  const addParam = () => {
    if (!newParamKey.trim()) return
    setQueryParams(prev => [...prev, { key: newParamKey, label: newParamLabel || newParamKey, value: '' }])
    setNewParamKey('')
    setNewParamLabel('')
  }

  const removeParam = (i: number) => setQueryParams(prev => prev.filter((_, idx) => idx !== i))

  const handleTest = (succeed = true) => {
    setTestStatus('testing')
    setTimeout(() => setTestStatus(succeed ? 'success' : 'error'), 1800)
  }

  const handleSave = () => {
    const endpoint: EndpointDef = {
      id: `custom-${Date.now()}`,
      name: apiName,
      apiPath: `${baseUrl}${endpointPath}`,
      description: `Custom ${integrationType} endpoint via ${authType}`,
      dataObjects: [apiName],
      status: 'Active',
      lastRun: '—',
      nextRun: '—',
      syncFrequency: '24hr',
      isStandard: false,
      isFromLibrary: false,
      queryParams: queryParams.map<QueryParam>(p => ({ key: p.key, label: p.label, description: '', type: 'text' })),
      paramValues: Object.fromEntries(queryParams.map(p => [p.key, p.value])),
    }
    onSave(endpoint)
  }

  return (
    <Modal open={true} onOpenChange={(v: boolean) => !v && onClose()} size="lg">
      <div className="flex overflow-hidden" style={{ minHeight: '600px' }}>
        {/* Left sidebar stepper */}
        <div className="w-48 shrink-0 bg-gray-50 border-r border-gray-200 p-6 flex flex-col gap-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Setup Steps</p>
          {STEPS.map((s, i) => (
            <div
              key={s}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px]"
              style={{
                backgroundColor: i === step ? '#F0FDF9' : 'transparent',
                color: i === step ? '#186749' : i < step ? '#374151' : '#9CA3AF',
                fontWeight: i === step ? 600 : i < step ? 500 : 400,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0"
                style={{
                  backgroundColor: i < step ? '#186749' : i === step ? '#186749' : '#E5E7EB',
                  color: i <= step ? '#fff' : '#9CA3AF',
                }}
              >
                {i < step ? (
                  <svg width="8" height="7" viewBox="0 0 8 7" fill="none"><path d="M1 3.5l2 2 4-4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : i + 1}
              </div>
              {s}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200 shrink-0">
            <div>
              <h2 className="text-[16px] font-semibold text-gray-900">Custom Endpoint Setup</h2>
              <p className="text-[12px] text-gray-500 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Step body */}
          <div className="flex-1 overflow-y-auto px-7 py-6">

            {/* Step 0 — Integration Type */}
            {step === 0 && (
              <div>
                <p className="text-[13px] font-medium text-gray-700 mb-4">How will data flow between FloQast and this API?</p>
                <div className="flex flex-col gap-3">
                  {([
                    { type: 'Pull', label: 'Pull (Inbound)', desc: 'FloQast fetches data from the external API on a schedule.' },
                    { type: 'Push', label: 'Push (Webhook)', desc: 'The external system sends data to FloQast via webhook.' },
                    { type: 'Both', label: 'Both', desc: 'Support both inbound fetching and webhook ingestion.' },
                  ] as { type: IntegrationType; label: string; desc: string }[]).map(opt => (
                    <label
                      key={opt.type}
                      className="flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors"
                      style={{ border: `1.5px solid ${integrationType === opt.type ? '#186749' : '#E5E7EB'}`, backgroundColor: integrationType === opt.type ? '#F0FDF9' : '#fff' }}
                    >
                      <input type="radio" checked={integrationType === opt.type} onChange={() => setIntegrationType(opt.type)} className="mt-0.5 accent-[#186749]" />
                      <div>
                        <div className="text-[13px] font-semibold text-gray-900 mb-0.5">{opt.label}</div>
                        <div className="text-[12px] text-gray-500">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 — Connection Basics */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <Field label="API / Connection Name" value={apiName} onChange={setApiName} placeholder="e.g. Netsuite GL API" />
                <Field label="Base URL" value={baseUrl} onChange={setBaseUrl} placeholder="https://api.example.com" mono />
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Environment</label>
                  <div className="flex gap-2">
                    {(['Production', 'Sandbox'] as const).map(env => (
                      <button
                        key={env}
                        onClick={() => setEnvironment(env)}
                        className="px-4 py-1.5 text-[12px] font-medium rounded-full border transition-colors"
                        style={{ borderColor: environment === env ? '#186749' : '#E5E7EB', backgroundColor: environment === env ? '#F0FDF9' : '#fff', color: environment === env ? '#186749' : '#6B7280' }}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Authentication */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-2">Authentication Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['API Key', 'Bearer Token', 'Basic Auth', 'None'] as AuthType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setAuthType(t)}
                        className="px-3 py-2.5 text-[12px] font-medium rounded-lg border text-left transition-colors"
                        style={{ borderColor: authType === t ? '#186749' : '#E5E7EB', backgroundColor: authType === t ? '#F0FDF9' : '#fff', color: authType === t ? '#186749' : '#374151' }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {authType === 'API Key' && (
                  <SecretField label="API Key" value={apiKey} onChange={setApiKey} show={showSecret} onToggle={() => setShowSecret(!showSecret)} />
                )}
                {authType === 'Bearer Token' && (
                  <SecretField label="Bearer Token" value={bearerToken} onChange={setBearerToken} show={showSecret} onToggle={() => setShowSecret(!showSecret)} />
                )}
                {authType === 'Basic Auth' && (
                  <>
                    <Field label="Username" value={basicUser} onChange={setBasicUser} placeholder="username" />
                    <SecretField label="Password" value={basicPass} onChange={setBasicPass} show={showSecret} onToggle={() => setShowSecret(!showSecret)} />
                  </>
                )}
                {authType === 'None' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[12px] text-amber-700">
                    No authentication configured. Only use this for public endpoints.
                  </div>
                )}
              </div>
            )}

            {/* Step 3 — Endpoint & Params */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                  <div className="w-28 shrink-0">
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Method</label>
                    <Select
                      options={['GET', 'POST', 'PUT', 'PATCH'].map(m => ({ label: m, value: m }))}
                      value={httpMethod}
                      onChange={(val) => setHttpMethod(val as string)}
                      selectionMode="single"
                      disableClear
                      disableFilter
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Endpoint Path</label>
                    <input
                      value={endpointPath}
                      onChange={e => setEndpointPath(e.target.value)}
                      placeholder="/v1/records"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-[#186749]"
                    />
                  </div>
                </div>
                {baseUrl && endpointPath && (
                  <p className="text-[11px] text-gray-400 -mt-3 font-mono break-all">{baseUrl}{endpointPath}</p>
                )}

                {/* Query Params */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-2">Query Parameters</label>
                  {queryParams.length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
                      {queryParams.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5 border-b last:border-b-0 border-gray-100 text-[12px]">
                          <code className="text-[#186749] bg-green-50 px-1.5 py-0.5 rounded font-mono shrink-0">{p.key}</code>
                          <span className="text-gray-500 flex-1">{p.label || p.key}</span>
                          <button onClick={() => removeParam(i)} className="text-gray-300 hover:text-red-400 transition-colors">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input value={newParamKey} onChange={e => setNewParamKey(e.target.value)} placeholder="key" className="w-32 border border-gray-300 rounded px-2 py-1.5 text-[12px] font-mono focus:outline-none focus:ring-1 focus:ring-[#186749]" />
                    <input value={newParamLabel} onChange={e => setNewParamLabel(e.target.value)} placeholder="label (optional)" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#186749]" />
                    <Button size="sm" variant="outlined" color="dark" disabled={!newParamKey.trim()} onClick={addParam}>+ Add</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 — Review & Save */}
            {step === 4 && (
              <div className="flex flex-col gap-5">
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 text-[13px]">
                  <ReviewRow label="Integration Type" value={integrationType} />
                  <ReviewRow label="API Name" value={apiName} />
                  <ReviewRow label="Base URL" value={baseUrl} mono />
                  <ReviewRow label="Environment" value={environment} />
                  <ReviewRow label="Authentication" value={authType} />
                  <ReviewRow label="Endpoint Path" value={`${httpMethod} ${endpointPath}`} mono />
                  <ReviewRow label="Query Params" value={queryParams.length > 0 ? queryParams.map(p => p.key).join(', ') : 'None'} />
                </div>

                {/* Test connection */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-[13px] font-medium text-gray-700 mb-3">Test Connection</p>
                  {testStatus === null && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleTest(true)}>Test Connection</Button>
                      <Button size="sm" variant="outlined" color="dark" onClick={() => handleTest(false)}>Simulate Error</Button>
                    </div>
                  )}
                  {testStatus === 'testing' && (
                    <div className="flex items-center gap-2.5">
                      <div className="animate-spin w-4 h-4 rounded-full border-2 border-gray-200" style={{ borderTopColor: '#186749' }} />
                      <span className="text-[12px] text-gray-500">Testing connection…</span>
                    </div>
                  )}
                  {testStatus === 'success' && (
                    <div className="flex items-center gap-2 text-[12px] text-green-700">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="#15803D" strokeWidth="2"/></svg>
                      Connection successful — endpoint is reachable
                    </div>
                  )}
                  {testStatus === 'error' && (
                    <div className="flex items-center gap-2 text-[12px] text-red-700">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" stroke="#DC2626" strokeWidth="2"/></svg>
                      Connection failed — check URL and credentials
                      <Button size="sm" variant="ghost" color="dark" onClick={() => setTestStatus(null)}>Retry</Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between px-7 py-4 border-t border-gray-200 shrink-0 bg-white">
            <Button
              variant="outlined"
              color="dark"
              onClick={step === 0 ? onClose : () => setStep(step - 1)}
            >
              {step === 0 ? 'Cancel' : '← Back'}
            </Button>
            <Button
              disabled={!canProceed()}
              onClick={step === STEPS.length - 1 ? handleSave : () => setStep(step + 1)}
            >
              {step === STEPS.length - 1 ? 'Save Endpoint' : 'Next →'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

/* ── Shared form helpers ── */
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <Input
      label={label}
      value={value}
      onChange={(e: unknown) => onChange((e as React.ChangeEvent<HTMLInputElement>).target.value)}
      placeholder={placeholder}
      className="w-full"
    />
  )
}

function SecretField({ label, value, onChange, show, onToggle }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="••••••••••••"
          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#186749]"
        />
        <button type="button" onClick={onToggle} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
          )}
        </button>
      </div>
    </div>
  )
}

function ReviewRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <span className="text-[12px] text-gray-500 w-36 shrink-0">{label}</span>
      <span className={`text-[12px] text-gray-900 ${mono ? 'font-mono' : ''}`}>{value || '—'}</span>
    </div>
  )
}
