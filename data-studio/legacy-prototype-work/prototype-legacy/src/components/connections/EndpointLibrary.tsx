import { useState, useMemo } from 'react'
import type { EndpointDef, LibraryEndpoint } from '../../data/connections'
import { LIBRARY_ENDPOINTS } from '../../data/connections'
import CustomEndpointWizard from './CustomEndpointWizard'
import { Button, Input, Select, SideDrawer, StatusBadge } from '@floqastinc/flow-ui_core'

interface Props {
  connectionEndpoints: EndpointDef[]
  onClose: () => void
  onAddEndpoint: (endpoint: EndpointDef) => void
}

const CATEGORIES = ['All', 'Reports', 'Core Objects', 'Transactions']

function getStatus(libEp: LibraryEndpoint, connectionEndpoints: EndpointDef[]): 'Not Added' | 'Active' | 'Inactive' {
  const found = connectionEndpoints.find(ep => ep.name === libEp.name)
  if (!found) return 'Not Added'
  return found.status === 'Active' ? 'Active' : 'Inactive'
}

export default function EndpointLibrary({ connectionEndpoints, onClose, onAddEndpoint }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [configuringEp, setConfiguringEp] = useState<LibraryEndpoint | null>(null)
  const [showCustomWizard, setShowCustomWizard] = useState(false)
  const [paramValues, setParamValues] = useState<Record<string, Record<string, string>>>({})

  const filtered = useMemo(() => {
    return LIBRARY_ENDPOINTS.filter(ep => {
      const q = search.toLowerCase()
      const matchSearch = !q || ep.name.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q) || ep.dataObjects.some(d => d.toLowerCase().includes(q))
      const matchCat = category === 'All' || ep.category === category
      return matchSearch && matchCat
    })
  }, [search, category])

  const handleActivate = (libEp: LibraryEndpoint) => setConfiguringEp(libEp)

  const handleConfigSave = () => {
    if (!configuringEp) return
    const vals = paramValues[configuringEp.id] ?? {}
    const endpoint: EndpointDef = {
      id: `ep-${configuringEp.id}-${Date.now()}`,
      name: configuringEp.name,
      apiPath: configuringEp.apiPath,
      description: configuringEp.description,
      dataObjects: configuringEp.dataObjects,
      status: 'Active',
      lastRun: '—',
      nextRun: 'Scheduled',
      syncFrequency: '6hr',
      isStandard: false,
      isFromLibrary: true,
      queryParams: configuringEp.queryParams,
      paramValues: vals,
    }
    onAddEndpoint(endpoint)
    setConfiguringEp(null)
  }

  const setParam = (epId: string, key: string, value: string) => {
    setParamValues(prev => ({ ...prev, [epId]: { ...(prev[epId] ?? {}), [key]: value } }))
  }

  if (showCustomWizard) {
    return (
      <CustomEndpointWizard
        onClose={() => setShowCustomWizard(false)}
        onSave={ep => { onAddEndpoint(ep); setShowCustomWizard(false) }}
      />
    )
  }

  return (
    <SideDrawer show={true} onCancel={onClose} width="lg">
      {/* Library panel */}
      <SideDrawer.Body>
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-200 shrink-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-[16px] font-semibold text-gray-900">Endpoint Library</h2>
              <p className="text-[12px] text-gray-500 mt-0.5">Browse and activate available QBO REST API v3 endpoints.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-0.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Search + filter */}
          <div className="flex gap-2.5 mt-3.5">
            <div className="flex-1">
              <Input
                isSearchable
                value={search}
                onChange={(e: unknown) => setSearch((e as React.ChangeEvent<HTMLInputElement>).target.value)}
                placeholder="Search by endpoint name or data object…"
                className="w-full"
              />
            </div>
            <Select
              options={CATEGORIES.map(c => ({ label: c, value: c }))}
              value={category}
              onChange={(val) => setCategory(val as string)}
              selectionMode="single"
              disableClear
              disableFilter
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3 py-1 rounded-full text-[11px] border transition-colors"
                style={{
                  borderColor: category === cat ? '#186749' : '#E5E7EB',
                  backgroundColor: category === cat ? '#ECFDF5' : '#fff',
                  color: category === cat ? '#186749' : '#6B7280',
                  fontWeight: category === cat ? 600 : 400,
                }}
              >
                {cat}
              </button>
            ))}
            <span className="text-[11px] text-gray-400 ml-1">{filtered.length} endpoint{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Table header */}
        <div className="grid px-6 py-2 bg-gray-50 border-b border-gray-200 shrink-0 text-[10px] font-bold text-gray-400 uppercase tracking-wider" style={{ gridTemplateColumns: '2fr 1.6fr 1fr 110px 100px' }}>
          {['Endpoint', 'Description', 'Data Objects', 'Status', ''].map(h => <span key={h}>{h}</span>)}
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-[13px] text-gray-400">No endpoints match your search.</div>
          ) : (
            filtered.map((libEp) => {
              const status = getStatus(libEp, connectionEndpoints)
              const isConfiguring = configuringEp?.id === libEp.id
              return (
                <div
                  key={libEp.id}
                  className="grid px-6 py-3.5 border-b border-gray-50 items-center"
                  style={{ gridTemplateColumns: '2fr 1.6fr 1fr 110px 100px', backgroundColor: isConfiguring ? '#FAFFFE' : '#fff' }}
                >
                  {/* Name + path */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[13px] font-semibold text-gray-900">{libEp.name}</span>
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded">{libEp.category}</span>
                    </div>
                    <code className="text-[11px] text-gray-400 break-all leading-relaxed">{libEp.apiPath}</code>
                  </div>

                  {/* Description */}
                  <div className="pr-3">
                    <span className="text-[12px] text-gray-500 leading-relaxed line-clamp-2">{libEp.description}</span>
                  </div>

                  {/* Data objects */}
                  <div className="flex flex-wrap gap-1">
                    {libEp.dataObjects.map(obj => (
                      <span key={obj} className="text-[11px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">{obj}</span>
                    ))}
                  </div>

                  {/* Status */}
                  <LibraryStatusBadge status={status} />

                  {/* CTA */}
                  <div className="flex justify-end">
                    {status === 'Active' ? (
                      <Button size="sm" variant="outlined" color="dark" onClick={() => handleActivate(libEp)}>
                        Configured
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleActivate(libEp)}>
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* Custom endpoint CTA */}
          <div className="mx-6 my-5 p-5 border-[1.5px] border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-[12px] font-semibold text-gray-700 mb-1">Don't see what you need?</p>
            <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">Configure a connection to any REST API endpoint not listed above.</p>
            <Button size="sm" variant="outlined" color="dark" onClick={() => setShowCustomWizard(true)}>
              Add Custom Endpoint
            </Button>
          </div>
        </div>

      {/* Config panel */}
      {configuringEp && (
        <div className="w-[480px] shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-gray-900">{configuringEp.name}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Configure parameters before activating</p>
            </div>
            <button onClick={() => setConfiguringEp(null)} className="text-gray-400 hover:text-gray-600">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2l-10 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            <div>
              <p className="text-[11px] text-gray-500 mb-0.5">Endpoint path</p>
              <code className="text-[12px] text-gray-700 break-all">{configuringEp.apiPath}</code>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 mb-0.5">Data objects</p>
              <div className="flex gap-1 flex-wrap">
                {configuringEp.dataObjects.map(d => (
                  <span key={d} className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{d}</span>
                ))}
              </div>
            </div>

            {configuringEp.queryParams.length > 0 && (
              <div>
                <p className="text-[13px] font-medium text-gray-700 mb-3">Query Parameters</p>
                <div className="flex flex-col gap-3">
                  {configuringEp.queryParams.map(param => (
                    <div key={param.key}>
                      <label className="block text-[12px] font-medium text-gray-700 mb-1">
                        {param.label}
                        {param.required && <span className="text-red-500 ml-0.5">*</span>}
                      </label>
                      <p className="text-[11px] text-gray-400 mb-1.5">{param.description}</p>
                      {param.type === 'select' ? (
                        <select
                          value={paramValues[configuringEp.id]?.[param.key] ?? param.defaultValue ?? ''}
                          onChange={e => setParam(configuringEp.id, param.key, e.target.value)}
                          className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#186749]"
                        >
                          {param.options?.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type={param.type === 'date' ? 'date' : 'text'}
                          value={paramValues[configuringEp.id]?.[param.key] ?? param.defaultValue ?? ''}
                          onChange={e => setParam(configuringEp.id, param.key, e.target.value)}
                          placeholder={param.formatHint}
                          className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#186749]"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
            <Button size="sm" variant="outlined" color="dark" onClick={() => setConfiguringEp(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfigSave}>
              Activate Endpoint
            </Button>
          </div>
        </div>
      )}
      </SideDrawer.Body>
    </SideDrawer>
  )
}

function LibraryStatusBadge({ status }: { status: 'Not Added' | 'Active' | 'Inactive' }) {
  if (status === 'Not Added') return <span className="text-[11px] text-gray-300 italic">Not Added</span>
  return (
    <StatusBadge color={status === 'Active' ? 'success' : 'neutral'}>
      {status}
    </StatusBadge>
  )
}
