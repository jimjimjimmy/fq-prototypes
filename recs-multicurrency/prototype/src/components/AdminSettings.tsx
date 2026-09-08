import { useState, useRef, useEffect } from 'react'
import { EntityCurrenciesSection, CURRENCY_OPTIONS } from './EntityCurrenciesSection.tsx'

const MUSEO = "'Museo Sans', sans-serif"
const INTER = "'Inter', sans-serif"

type AdminTab = 'reconciliation-templates' | 'reconciling-items' | 'multi-currency'

const ADMIN_TABS: { id: AdminTab; label: string }[] = [
  { id: 'reconciliation-templates', label: 'Manage Recs' },
  { id: 'reconciling-items',        label: 'Reconciling Items' },
  { id: 'multi-currency',           label: 'Multi Currency' },
]

// ── Entity list data (Figma: 2-col grid, Beckys Donut pre-checked) ─

type EntityItem = { id: string; name: string; checked: boolean }

const INITIAL_ENTITIES: EntityItem[] = [
  { id: 'april',     name: 'April YE Workday',   checked: false },
  { id: 'beckys',    name: 'Beckys Donut',        checked: false },
  { id: 'christine', name: 'Christine Donuts',    checked: false },
  { id: 'christine2',name: 'Christine Donuts 2',  checked: false },
  { id: 'danielle',  name: 'Danielle Donuts',     checked: false },
  { id: 'donuts',    name: 'Donuts Reporting',    checked: false },
  { id: 'edson',     name: 'Edson Donuts NS',     checked: false },
  { id: 'frank',     name: 'Frank Donuts',        checked: false },
  { id: 'grant',     name: 'Grant Donuts',        checked: false },
  { id: 'hello',     name: 'Hello Workday',       checked: false },
  { id: 'norm',      name: 'Norm Donuts',         checked: false },
  { id: 'nssadl',    name: 'NS SADL',             checked: false },
  { id: 'oauth',     name: 'Oauth Entity',        checked: false },
  { id: 'samantha',  name: 'Samantha Donuts',     checked: false },
  { id: 'wes',       name: 'Wes Donuts',          checked: false },
  { id: 'workday',   name: 'Workday Donuts',      checked: false },
]

// ── Reporting Views ──────────────────────────────────────────
// Admin can define up to 5 reporting currencies. Each auto-named by currency.

function ReportingViewsSection({ onViewsChange }: { onViewsChange?: () => void }) {
  const MAX_VIEWS = 5
  const [views, setViews] = useState<string[]>([
    'USD: US Dollar',
    'MXN: Mexican Peso',
    'JPY: Japanese Yen',
  ])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Extract short currency code for display: "USD: Us Dollar" -> "USD"
  function currencyCode(opt: string) { return opt.split(':')[0].trim() }

  function addView(currency: string) {
    if (views.length >= MAX_VIEWS) return
    if (!views.includes(currency)) {
      setViews(prev => [...prev, currency])
      onViewsChange?.()
    }
    setPickerOpen(false)
  }

  function removeView(currency: string) {
    setViews(prev => prev.filter(v => v !== currency))
    onViewsChange?.()
  }

  const available = CURRENCY_OPTIONS.filter(o =>
    !views.includes(o) &&
    o.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="border border-[#e1e6ef] rounded-[8px] px-[24px] py-[24px] flex flex-col gap-[16px]">
      {views.length === 0 && (
        <p style={{ fontSize: 12, color: '#6b7280', fontFamily: INTER, margin: 0 }}>
          No reporting views configured. Add up to {MAX_VIEWS}.
        </p>
      )}
      {views.map(view => (
        <div
          key={view}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px',
            border: '1px solid #e1e6ef', borderRadius: 6,
            background: 'white',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="material-icons-outlined" style={{ fontSize: 18, color: '#6b7280' }}>description</span>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#1d2433', fontFamily: INTER, margin: 0 }}>
              Reporting ({currencyCode(view)}) - {view.split(': ')[1]}
            </p>
          </div>
          <button
            onClick={() => removeView(view)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', padding: 4, borderRadius: 4,
              color: '#9ca3af',
            }}
            className="hover:text-[#ef4444] hover:bg-[#fef2f2]"
            title="Remove view"
          >
            <span className="material-icons-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>
      ))}

      {views.length < MAX_VIEWS && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setPickerOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 36, padding: '0 14px',
              background: 'white', border: '1px dashed #cbd2e1',
              borderRadius: 6, cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: '#6b7280',
              fontFamily: INTER,
            }}
          >
            <span className="material-icons-outlined" style={{ fontSize: 16 }}>add</span>
            Add Reporting View
          </button>
          {pickerOpen && (
            <>
              <div onClick={() => { setPickerOpen(false); setSearch('') }} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                background: 'white', border: '1px solid #e1e6ef', borderRadius: 6,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                minWidth: 240, zIndex: 11, overflow: 'hidden',
              }}>
                <div style={{ padding: '8px 10px', borderBottom: '1px solid #e1e6ef' }}>
                  <input
                    autoFocus
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search currencies..."
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      height: 30, padding: '0 8px',
                      fontSize: 12, fontFamily: INTER, color: '#1d2433',
                      border: '1px solid #cbd2e1', borderRadius: 4,
                      outline: 'none', background: 'white',
                    }}
                  />
                </div>
                <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {available.length === 0 ? (
                  <p style={{ padding: '10px 12px', fontSize: 12, color: '#6b7280', fontFamily: INTER, margin: 0 }}>
                    {search ? 'No matches' : 'All currencies added'}
                  </p>
                ) : available.map(opt => (
                  <button
                    key={opt}
                    onClick={() => addView(opt)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      width: '100%', padding: '8px 12px',
                      fontSize: 12, fontWeight: 500, color: '#1d2433',
                      background: 'transparent', border: 'none',
                      cursor: 'pointer', textAlign: 'left', fontFamily: INTER,
                    }}
                    className="hover:bg-[#f3f4f6]"
                  >
                    <span style={{ fontWeight: 700, color: '#3d7bf7', minWidth: 36 }}>{opt.split(':')[0]}</span>
                    <span style={{ color: '#6b7280' }}>{opt.split(': ')[1]}</span>
                  </button>
                ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <p style={{ fontSize: 11, color: '#9ca3af', fontFamily: INTER, margin: 0 }}>
        {views.length} of {MAX_VIEWS} reporting views configured
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────

interface AdminSettingsProps {
  onBack: () => void
  isAdmin?: boolean
  onSettingsSaved?: () => void
}

export function AdminSettings({ onBack, isAdmin = false, onSettingsSaved }: AdminSettingsProps) {
  const [entities, setEntities] = useState<EntityItem[]>(INITIAL_ENTITIES)
  const [entitySearch, setEntitySearch] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  // Tab navigation
  const [activeTab, setActiveTab] = useState<AdminTab>('multi-currency')

  // Detect changes after mount - StrictMode-safe
  // Separate cleanup into its own effect so it only fires on real unmount,
  // not before every dependency-change re-run.
  const isMounted = useRef(false)
  useEffect(() => {
    return () => { isMounted.current = false }
  }, [])
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    setHasChanges(true)
  }, [entities])

  function toggleEntity(id: string) {
    setEntities(prev => prev.map(e => e.id === id ? { ...e, checked: !e.checked } : e))
  }

  const checkedCount  = entities.filter(e => e.checked).length
  const allChecked    = checkedCount === entities.length
  const someChecked   = checkedCount > 0 && !allChecked

  // Filter + split into 2 columns (column-first order, matching Figma layout)
  const filtered = entities.filter(e =>
    e.name.toLowerCase().includes(entitySearch.toLowerCase())
  )
  const half = Math.ceil(filtered.length / 2)
  const col1 = filtered.slice(0, half)
  const col2 = filtered.slice(half)

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">

      {/* Admin Settings header - matches Figma node 5620:40848 */}
      <div className="bg-white shrink-0" style={{ borderBottom: '1px solid #e1e6ef' }}>
        {/* H1 title */}
        <div style={{ paddingTop: 12, paddingLeft: 24, paddingRight: 24, paddingBottom: 0 }}>
          <h1 style={{
            fontFamily: MUSEO, fontWeight: 700, fontSize: 32, lineHeight: '40px',
            color: '#000', margin: 0,
          }}>
            Admin Settings
          </h1>
        </div>
        {/* Horizontal tab bar */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          height: 50, gap: 24,
          paddingLeft: 24, paddingRight: 24,
          overflowX: 'auto',
        }}>
            <button
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#6b7280',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              Workflows
            </button>
            <button
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#6b7280',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              Entities
            </button>
            <button
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#6b7280',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              Team Members
            </button>
            <button
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#6b7280',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              Roles
            </button>
            <button
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#6b7280',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              Groups
            </button>
            <button
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#6b7280',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              Checklist
            </button>
            <button
              onClick={onBack}
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#1d2433',
                borderBottom: '2px solid #186749',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              Reconciliations
            </button>
            <button
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#6b7280',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              API Keys
            </button>
            <button
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#6b7280',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              Reports
            </button>
            <button
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#6b7280',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              AI
            </button>
            <button
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#6b7280',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              Connections
            </button>
            <button
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#6b7280',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              Financial Data Model
            </button>
            <button
              style={{
                height: 40, padding: '0', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: MUSEO, fontWeight: 700, fontSize: 12,
                color: '#6b7280',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
            >
              File Upload
            </button>
        </div>
      </div>

      {/* Body: left sidenav + content */}
      <div className="flex-1 flex overflow-hidden">

      {/* Left sidenav - matches Figma Sidebar component (node 5620:40867) */}
      <div style={{
        width: 260, minWidth: 260,
        background: 'white',
        borderRight: '1px solid #e1e6ef',
        flexShrink: 0,
        overflowY: 'auto',
        padding: 24,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {ADMIN_TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={tab.id === 'multi-currency' ? () => setActiveTab(tab.id) : undefined}
                style={{
                  display: 'block', width: '100%', border: 'none',
                  cursor: tab.id === 'multi-currency' ? 'pointer' : 'default',
                  background: 'transparent', textAlign: 'left',
                  padding: isActive ? '9px 6px' : '0',
                  borderRadius: isActive ? 8 : 0,
                }}
              >
                {isActive ? (
                  // Active: inner gray pill, h-43px, px-10px, rounded-6px per Figma
                  <div style={{
                    background: '#e1e6ef', borderRadius: 6,
                    padding: '0 10px', height: 43,
                    display: 'flex', alignItems: 'center',
                  }}>
                    <span style={{
                      fontFamily: INTER, fontSize: 12, lineHeight: '18px',
                      fontWeight: 600, color: '#0a0d14',
                    }}>
                      {tab.label}
                    </span>
                  </div>
                ) : (
                  // Inactive: h-45px, p-16px per Figma
                  <div style={{
                    height: 45, display: 'flex', alignItems: 'center',
                    padding: '0 16px',
                  }}>
                    <span style={{
                      fontFamily: INTER, fontSize: 12, lineHeight: '18px',
                      fontWeight: 600, color: '#424867',
                    }}>
                      {tab.label}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page header - matches Figma Template / Page-header */}
        <div style={{
          borderBottom: '1px solid #e1e6ef',
          padding: '16px 24px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <h1 style={{
            fontFamily: "'Museo Sans', sans-serif", fontWeight: 700,
            fontSize: 24, lineHeight: '28px',
            color: '#1d2433', margin: 0,
          }}>
            {ADMIN_TABS.find(t => t.id === activeTab)?.label}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button
              disabled={!hasChanges}
              onClick={hasChanges ? () => { onSettingsSaved?.(); onBack() } : undefined}
              style={{
                height: 40, padding: '0 12px',
                borderRadius: 6, border: 'none',
                fontFamily: MUSEO, fontWeight: 700,
                fontSize: 12, letterSpacing: '-0.12px',
                backgroundColor: hasChanges ? '#1fac76' : 'rgba(28, 137, 95, 0.3)',
                color: 'white',
                cursor: hasChanges ? 'pointer' : 'default',
                whiteSpace: 'nowrap',
              }}
            >
              Save Changes
            </button>
            <button
              onClick={onBack}
              style={{
                height: 40, padding: '0 12px',
                borderRadius: 6, border: 'none',
                fontFamily: MUSEO, fontWeight: 700,
                fontSize: 12, letterSpacing: '-0.12px',
                color: '#6b7280',
                background: 'transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
        <div style={{ maxWidth: 640, padding: '32px 24px' }}>

            {/* ── Manage Recs tab ─────────────────────────── */}
            {activeTab === 'reconciliation-templates' && <div id="reconciliation-templates">
            <h1
              className="text-[24px] leading-[32px] text-[#1d2433]"
              style={{ fontFamily: MUSEO, fontWeight: 700, marginBottom: 32 }}
            >
              Manage Entities: Beckys Donuts
            </h1>

            {/* ── Entity configuration fields ──────────────────── */}
            <div className="flex flex-col gap-[32px]" style={{ paddingBottom: 40, borderBottom: '1px solid #e1e6ef' }}>

              {/* Entity Name */}
              <div className="flex flex-col gap-[4px]">
                <label
                  className="text-[12px] leading-[16px] text-[#1d2433] font-[500]"
                  style={{ fontFamily: INTER }}
                >
                  Entity Name
                </label>
                <input
                  type="text"
                  defaultValue="Beckys Donuts"
                  className="h-[40px] p-[8px] box-border border border-[#e1e6ef] rounded-[6px] text-[12px] leading-[16px] text-[#1d2433] bg-white focus:outline-none"
                  style={{ fontFamily: INTER, boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
                />
              </div>

              {/* Entity Details */}
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center gap-[4px]">
                  <label
                    className="text-[12px] leading-[16px] text-[#1d2433] font-[500]"
                    style={{ fontFamily: INTER }}
                  >
                    Entity Details
                  </label>
                  <InfoIcon />
                </div>
                <textarea
                  placeholder="Add Entity Details"
                  className="h-[108px] p-[8px] box-border border border-[#e1e6ef] rounded-[6px] text-[12px] leading-[18px] text-[#1d2433] bg-white resize-none focus:outline-none placeholder:text-[#adb2bb]"
                  style={{ fontFamily: INTER, boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
                />
              </div>

              {/* Workflow row: Workflow Name + Folder Structure + Year End */}
              <div className="flex flex-wrap gap-[16px]">
                <div className="flex flex-col gap-[4px] flex-1 min-w-[160px]">
                  <label
                    className="text-[12px] leading-[16px] text-[#1d2433] font-[500]"
                    style={{ fontFamily: INTER }}
                  >
                    Entity Name
                  </label>
                  <div
                    className="h-[40px] p-[8px] box-border flex items-center justify-between border border-[#e1e6ef] rounded-[6px] bg-white cursor-pointer"
                    style={{ boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
                  >
                    <span className="text-[12px] leading-[16px] text-[#1d2433]" style={{ fontFamily: INTER }}>1 - Close US</span>
                    <ChevronDownSm />
                  </div>
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-[140px]">
                  <label
                    className="text-[12px] leading-[16px] text-[#1d2433] font-[500]"
                    style={{ fontFamily: INTER }}
                  >
                    Folder Structure
                  </label>
                  <div
                    className="h-[40px] p-[8px] box-border flex items-center justify-between border border-[#e1e6ef] rounded-[6px] bg-white cursor-pointer"
                    style={{ boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
                  >
                    <span className="text-[12px] leading-[16px] text-[#1d2433]" style={{ fontFamily: INTER }}>Monthly</span>
                    <ChevronDownSm />
                  </div>
                </div>
                <div className="flex flex-col gap-[4px] w-[80px]">
                  <label
                    className="text-[12px] leading-[16px] text-[#1d2433] font-[500]"
                    style={{ fontFamily: INTER }}
                  >
                    Year End
                  </label>
                  <input
                    type="text"
                    defaultValue="12/31"
                    className="h-[40px] p-[8px] box-border border border-[#e1e6ef] rounded-[6px] text-[12px] leading-[16px] text-[#1d2433] bg-white focus:outline-none"
                    style={{ fontFamily: INTER, boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
                  />
                </div>
              </div>

              {/* Time Zone */}
              <div className="flex flex-col gap-[4px]">
                <label
                  className="text-[12px] leading-[16px] text-[#1d2433] font-[500]"
                  style={{ fontFamily: INTER }}
                >
                  Time Zone
                </label>
                <div
                  className="h-[40px] p-[8px] box-border flex items-center justify-between border border-[#e1e6ef] rounded-[6px] bg-white cursor-pointer"
                  style={{ boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
                >
                  <span className="text-[12px] leading-[16px] text-[#1d2433]" style={{ fontFamily: INTER }}>Pacific Time</span>
                  <ChevronDownSm />
                </div>
              </div>

              {/* Default Currency Symbol */}
              <div className="flex flex-col gap-[4px]">
                <label
                  className="text-[12px] leading-[16px] text-[#1d2433] font-[500]"
                  style={{ fontFamily: INTER }}
                >
                  Default Currency Symbol
                </label>
                <div
                  className="h-[40px] p-[8px] box-border flex items-center justify-between border border-[#e1e6ef] rounded-[6px] bg-white cursor-pointer"
                  style={{ boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
                >
                  <span className="text-[12px] leading-[16px] text-[#1d2433]" style={{ fontFamily: INTER }}>MXN: Mexican Peso (MX$)</span>
                  <ChevronDownSm />
                </div>
              </div>

            </div>
            </div>}
            {/* end reconciliation-templates tab */}

            {/* ── Reconciling Items tab ───────────────────────── */}
            {activeTab === 'reconciling-items' && (
              <div className="flex flex-col gap-[24px]">
                <div>
                  <h1 className="text-[24px] leading-[32px] text-[#1d2433] mb-[8px]" style={{ fontFamily: MUSEO, fontWeight: 700 }}>
                    Reconciling Items
                  </h1>
                  <p className="text-[12px] leading-[18px] text-[#6b7280]" style={{ fontFamily: INTER }}>
                    Configure reconciling item types, custom fields, and approval workflows.
                  </p>
                </div>
                <div style={{ border: '1px solid #e1e6ef', borderRadius: 8, padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
                  <span className="material-icons-outlined" style={{ fontSize: 32, color: '#cbd2e1' }}>receipt_long</span>
                  <p style={{ fontSize: 13, color: '#6b7280', fontFamily: INTER, fontWeight: 500, margin: 0 }}>Reconciling item settings coming soon</p>
                  <p style={{ fontSize: 12, color: '#adb2bb', fontFamily: INTER, margin: 0 }}>Configure item types, fields, and workflows from this tab.</p>
                </div>
              </div>
            )}

            {/* ── Multi Currency tab ──────────────────────────── */}
            {activeTab === 'multi-currency' && <div className="flex flex-col [&>*]:py-[40px] [&>*:first-child]:pt-[20px] [&>*+*]:[border-top:1px_solid_#e1e6ef]">

              {/* Persistent rate-methodology note */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                background: '#f8f9fc', border: '1px solid #e1e6ef',
                borderRadius: 6, padding: '10px 14px',
                marginBottom: 0,
              }}>
                <span className="material-icons-outlined" style={{ fontSize: 14, color: '#6b7280', flexShrink: 0, marginTop: 1 }}>info</span>
                <p style={{ fontSize: 12, color: '#424867', fontFamily: INTER, margin: 0, lineHeight: '18px' }}>
                  FloQast applies period-end FX rates to all multi-currency conversions. Average and historical rates are not supported in this release.
                </p>
              </div>

              {/* 1. Enable for Entities */}
              <div id="enable-for-entities">
                <h2
                  className="text-[16px] leading-[24px] text-[#1d2433] mb-[4px]"
                  style={{ fontFamily: MUSEO, fontWeight: 700 }}
                >
                  Workbook to Tie Out Currency
                </h2>
                <p
                  className="text-[12px] leading-[18px] text-[#6b7280] mb-[20px]"
                  style={{ fontFamily: INTER }}
                >
                  Selected entities gain a multi-currency view toggle on the Reconciliations table &mdash; surfacing workbook-tagged amounts and their FX-converted equivalents alongside the tie-out.
                </p>

                {/* Entity checklist card */}
                <div className="border border-[#e1e6ef] rounded-[8px] px-[24px] py-[24px]">
                  <div className="flex flex-col gap-[16px]">
                    {/* Select All row */}
                    <div className="flex items-center gap-[8px]">
                      <CheckboxControl
                        checked={allChecked}
                        indeterminate={someChecked}
                        onChange={() =>
                          setEntities(prev => prev.map(e => ({ ...e, checked: !allChecked })))
                        }
                      />
                      <span
                        className="text-[12px] leading-[18px] font-[500] text-[#1d2433]"
                        style={{ fontFamily: INTER }}
                      >
                        Select All
                      </span>
                    </div>

                    {/* Search */}
                    <div
                      className="flex items-center gap-[4px] h-[40px] w-full box-border border border-[#e1e6ef] rounded-[6px] bg-white px-[8px] overflow-hidden"
                      style={{ boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
                    >
                      <div className="shrink-0 w-[20px] h-[20px] flex items-center justify-center">
                        <SearchIcon />
                      </div>
                      <input
                        type="text"
                        value={entitySearch}
                        onChange={e => setEntitySearch(e.target.value)}
                        placeholder="Search by Entity"
                        className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[12px] leading-[16px] text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none focus:ring-0"
                        style={{ fontFamily: INTER }}
                      />
                    </div>

                    {/* 2-column entity grid */}
                    <div className="flex gap-[16px]">
                      <div className="flex-1 flex flex-col gap-[12px]">
                        {col1.map(e => (
                          <EntityCheckRow
                            key={e.id}
                            entity={e}
                            onToggle={() => toggleEntity(e.id)}
                          />
                        ))}
                      </div>
                      <div className="flex-1 flex flex-col gap-[12px]">
                        {col2.map(e => (
                          <EntityCheckRow
                            key={e.id}
                            entity={e}
                            onToggle={() => toggleEntity(e.id)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Reporting Views */}
              <div id="reporting-views">
                <h2
                  className="text-[16px] leading-[24px] text-[#1d2433] mb-[4px]"
                  style={{ fontFamily: MUSEO, fontWeight: 700 }}
                >
                  Reporting Views
                </h2>
                <p
                  className="text-[12px] leading-[18px] text-[#6b7280] mb-[20px]"
                  style={{ fontFamily: INTER }}
                >
                  Define up to 5 reporting currencies. Each view normalizes all rec balances into that currency for consolidated review.
                </p>
                <ReportingViewsSection onViewsChange={() => setHasChanges(true)} />
              </div>

            </div>}
            {/* end multi-currency tab */}


          </div>
        </div>{/* end overflow-auto */}
      </div>{/* end tab content */}
      </div>{/* end body flex */}
    </div>
  )
}

// ── Entity checkbox row ──────────────────────────────────────────

function EntityCheckRow({
  entity,
  onToggle,
}: {
  entity: EntityItem
  onToggle: () => void
}) {
  return (
    <label className="flex items-center gap-[8px] cursor-pointer">
      <button
        role="checkbox"
        aria-checked={entity.checked}
        onClick={onToggle}
        className="shrink-0 w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center transition-colors"
        style={{
          borderColor: entity.checked ? '#1fac76' : '#cbd2e1',
          backgroundColor: entity.checked ? '#1fac76' : 'white',
        }}
      >
        {entity.checked && (
          <svg width={10} height={8} viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <span
        className="text-[13px] leading-[18px]"
        style={{
          fontFamily: INTER,
          fontWeight: entity.checked ? 600 : 400,
          color: entity.checked ? '#186749' : '#424867',
        }}
      >
        {entity.name}
      </span>
    </label>
  )
}

// ── FQ Toggle (h-[28px] w-[57px] per Figma) ─────────────────────

function FQToggle({
  on,
  onChange,
}: {
  on: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="relative inline-flex items-center shrink-0 rounded-full transition-colors duration-150 focus-visible:outline-none"
      style={{
        height: 28,
        width: 57,
        backgroundColor: on ? '#1fac76' : '#cbd2e1',
      }}
    >
      <span
        className="inline-block bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-150"
        style={{
          width: 22,
          height: 22,
          transform: on ? 'translateX(32px)' : 'translateX(3px)',
        }}
      />
    </button>
  )
}

// ── Checkbox control (general: dark green when checked) ──────────

function CheckboxControl({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
}) {
  return (
    <button
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      onClick={onChange}
      className="shrink-0 w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center transition-colors"
      style={{
        borderColor: checked || indeterminate ? '#1fac76' : '#cbd2e1',
        backgroundColor: checked || indeterminate ? '#1fac76' : 'white',
      }}
    >
      {indeterminate ? (
        <svg width={8} height={2} viewBox="0 0 8 2" fill="none">
          <rect width={8} height={2} rx={1} fill="white" />
        </svg>
      ) : checked ? (
        <svg width={10} height={8} viewBox="0 0 10 8" fill="none">
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </button>
  )
}

// ── Radio control ─────────────────────────────────────────────────

function RadioControl({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      role="radio"
      aria-checked={checked}
      onClick={onChange}
      className="shrink-0 w-[16px] h-[16px] rounded-full border-[2px] flex items-center justify-center transition-colors"
      style={{ borderColor: checked ? '#1fac76' : '#cbd2e1' }}
    >
      {checked && (
        <span className="w-[8px] h-[8px] rounded-full bg-[#1fac76]" />
      )}
    </button>
  )
}

// ── SVG icons ─────────────────────────────────────────────────────

function ArrowBackIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <path
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        fill="#6b7280"
      />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 20 20"
      fill="none"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <circle cx={10} cy={10} r={9} stroke="#adb2bb" strokeWidth={1.5} />
      <rect x={9.25} y={9} width={1.5} height={6} rx={0.75} fill="#adb2bb" />
      <circle cx={10} cy={6.5} r={1} fill="#adb2bb" />
    </svg>
  )
}

function ChevronDownSm() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
        fill="#6b7280"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <path
        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        fill="#adb2bb"
      />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        fill="var(--flo-sem-color-content-success-medium, #1fac76)"
      />
    </svg>
  )
}

function RemoveIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        fill="#e53935"
      />
    </svg>
  )
}
