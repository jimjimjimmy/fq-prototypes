import { useState, useRef, useEffect, useCallback } from 'react'

// ── Types ─────────────────────────────────────────────────────

interface Filter {
  dim: string
  vals: string[]
}

interface AcctFilter {
  targetCompany: string | null
  filters: Filter[]
}

interface AssigneeForm {
  name: string
  role: string
  dueType: string
  dueVal: string
  estTime: string
}

interface FormState {
  folder: string
  account: string | null
  groupName: string
  accounts: string[]
  frequency: string
  assignees: AssigneeForm[]
  acctFilters: AcctFilter[]
  bulkFilters: Filter[]
  bulkTargetCompany: string | null
  bulkAccounts: string[]
}

interface AcctData {
  name: string
  company: string
  bank: string
  book: string
  currency: string
  filters: Filter[]
}

// ── Constants ─────────────────────────────────────────────────

const DD_OPTIONS = {
  folder: ['01 Cash and cash equivalents', '02 Accounts receivable', '03 Prepaid expenses', '04 Other current assets'],
  account: ['1225 - Accounts Receivable: Non-trade', '1400 - Prepaid Expenses', '1010 - Cash in Bank - USD Operating', '1020 - Cash in Bank - USD Payroll', '1030 - Cash in Bank - EUR Operating'],
  accounts: ['1010 - Cash in Bank - USD Operating', '1020 - Cash in Bank - USD Payroll', '1030 - Cash in Bank - EUR Operating', '1030 - Cash in Bank - EUR Operating (1)'],
  frequency: ['Monthly', 'Quarterly', 'Annually'],
  assignee: ['Sean Bean', 'Elijah Wood', 'Viggo Mortensen', 'Sean Astin', 'Orlando Bloom', 'Ian McKellen', 'Liv Tyler', 'Cate Blanchett', 'Karl Urban', 'Andy Serkis'],
  role: ['Monthly Reviewer', 'Preparer', 'Approver'],
  dueType: ['Business Day', 'Calendar Day'],
  dimension: ['Company', 'Bank Account', 'Book Code', 'Currency'],
  dimensionValues: {
    Company: ['Global Modern Services, Inc. (USA)', 'Acme Corp (JPY)', 'Widget LLC (USD)', 'Canada Operations, Inc. (CAD)', 'Mexico Services S.A. (MXN)'],
    'Bank Account': ['Morgan Stanley', '(No Value)', 'Bank of America'],
    'Book Code': ['Book Code A', 'Book Code B', 'Book Code C'],
    Currency: ['CAD (Canadian Dollar)', 'EUR (Euro)', 'GBP (British Pound)', 'JPY (Japanese Yen)', 'MXN (Mexican Peso)', 'USD (US Dollar)'],
  } as Record<string, string[]>,
  targetCompany: ['Global Modern Services, Inc. (USA)', 'Acme Corp (JPY)', 'Widget LLC (USD)', 'Canada Operations, Inc. (CAD)', 'Mexico Services S.A. (MXN)'],
  kebab: ['Edit', 'Delete'],
  kebabGroup: ['Edit', 'Remove from Group', 'Delete'],
}

const INDIVIDUAL_ACCTS: AcctData[] = [
  { name: '1225 - Accounts Receivable: Non-trade', company: 'Global Modern Services, Inc. (USA)', bank: '(No Value)', book: 'Book Code A', currency: 'USD (US Dollar)',
    filters: [{ dim: 'Company', vals: ['Global Modern Services, Inc. (USA)'] }, { dim: 'Bank Account', vals: ['(No Value)'] }, { dim: 'Book Code', vals: ['Book Code A'] }] },
]

const GROUP_ACCTS: AcctData[] = [
  { name: '1010 - Cash in Bank - USD Operating', company: 'Global Modern Services, Inc. (USA)', bank: 'Morgan Stanley', book: 'Book Code A', currency: 'USD (US Dollar)',
    filters: [{ dim: 'Company', vals: ['Global Modern Services, Inc. (USA)'] }, { dim: 'Bank Account', vals: ['Morgan Stanley', '(No Value)'] }, { dim: 'Book Code', vals: ['Book Code A', 'Book Code C'] }] },
  { name: '1020 - Cash in Bank - USD Payroll', company: 'Global Modern Services, Inc. (USA)', bank: 'Morgan Stanley', book: 'Book Code A', currency: 'USD (US Dollar)',
    filters: [{ dim: 'Company', vals: ['Global Modern Services, Inc. (USA)'] }, { dim: 'Bank Account', vals: ['Morgan Stanley'] }, { dim: 'Book Code', vals: ['Book Code A'] }] },
  { name: '1030 - Cash in Bank - EUR Operating', company: 'Global Modern Services, Inc. (USA)', bank: 'Morgan Stanley', book: 'Book Code A', currency: 'USD (US Dollar)',
    filters: [{ dim: 'Company', vals: ['Global Modern Services, Inc. (USA)'] }, { dim: 'Bank Account', vals: ['Morgan Stanley'] }, { dim: 'Book Code', vals: ['Book Code A'] }] },
  { name: '1030 - Cash in Bank - EUR Operating (1)', company: 'Global Modern Services, Inc. (USA)', bank: 'Morgan Stanley', book: 'Book Code C', currency: 'USD (US Dollar)',
    filters: [{ dim: 'Company', vals: ['Global Modern Services, Inc. (USA)'] }, { dim: 'Bank Account', vals: ['Morgan Stanley'] }, { dim: 'Book Code', vals: ['Book Code C'] }] },
]

const PHOTOS: Record<string, string> = {
  'Sean Bean': 'https://i.pravatar.cc/64?img=33',
  'Liv Tyler': 'https://i.pravatar.cc/64?img=47',
  'Elijah Wood': 'https://i.pravatar.cc/64?img=11',
  'Viggo Mortensen': 'https://i.pravatar.cc/64?img=52',
  'Sean Astin': 'https://i.pravatar.cc/64?img=59',
  'Orlando Bloom': 'https://i.pravatar.cc/64?img=14',
  'Ian McKellen': 'https://i.pravatar.cc/64?img=60',
  'Cate Blanchett': 'https://i.pravatar.cc/64?img=44',
  'Karl Urban': 'https://i.pravatar.cc/64?img=53',
  'Andy Serkis': 'https://i.pravatar.cc/64?img=57',
}

const MUSEO = "'Museo Sans', sans-serif"

// ── Currency conversion ──────────────────────────────────────

export const FUNCTIONAL_CURRENCY = 'USD (US Dollar)'

export const FX_RATES: Record<string, { rate: number; sym: string; code: string; rateDisplay: string }> = {
  'USD (US Dollar)': { rate: 1, sym: '$', code: 'USD', rateDisplay: '1.00' },
  'EUR (Euro)': { rate: 0.92, sym: '€', code: 'EUR', rateDisplay: '0.92' },
  'GBP (British Pound)': { rate: 0.79, sym: '£', code: 'GBP', rateDisplay: '0.79' },
  'JPY (Japanese Yen)': { rate: 149.50, sym: '¥', code: 'JPY', rateDisplay: '149.50' },
  'CAD (Canadian Dollar)': { rate: 1.36, sym: 'C$', code: 'CAD', rateDisplay: '1.36' },
  'MXN (Mexican Peso)': { rate: 17.15, sym: 'MX$', code: 'MXN', rateDisplay: '17.15' },
}

export const COMPANY_CURRENCY_MAP: Record<string, string> = {
  'Global Modern Services, Inc. (USA)': 'USD (US Dollar)',
  'Acme Corp (JPY)': 'JPY (Japanese Yen)',
  'Widget LLC (USD)': 'USD (US Dollar)',
  'Canada Operations, Inc. (CAD)': 'CAD (Canadian Dollar)',
  'Mexico Services S.A. (MXN)': 'MXN (Mexican Peso)',
}

export function companyToCurrency(company: string | null): string {
  if (!company) return FUNCTIONAL_CURRENCY
  return COMPANY_CURRENCY_MAP[company] || FUNCTIONAL_CURRENCY
}

// ── Dropdown component ────────────────────────────────────────

function Dropdown({
  value,
  options,
  placeholder = 'Select...',
  multi = false,
  selected = [],
  onSelect,
  onMultiToggle,
  showPhoto = false,
}: {
  value?: string | null
  options: string[]
  placeholder?: string
  multi?: boolean
  selected?: string[]
  onSelect?: (val: string) => void
  onMultiToggle?: (val: string) => void
  showPhoto?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const display = multi
    ? (selected.length ? selected.join(', ') : placeholder)
    : (value || placeholder)
  const isPlaceholder = multi ? !selected.length : !value

  const filtered = options.filter(o =>
    !search || o.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: 'white', border: '1px solid #cbd2e1', borderRadius: 6, height: 36,
          padding: '0 8px', display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer',
        }}
      >
        {showPhoto && value && PHOTOS[value] && (
          <img src={PHOTOS[value]} alt="" style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0 }} />
        )}
        <span style={{
          flex: 1, minWidth: 0, fontSize: 12, fontWeight: 500,
          color: isPlaceholder ? '#424867' : '#1d2433',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {display}
        </span>
        <span className="material-icons-outlined" style={{ fontSize: 20, color: '#6b7280', flexShrink: 0 }}>expand_more</span>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          marginTop: 4, background: 'white', border: '1px solid #e1e6ef', borderRadius: 6,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)', maxHeight: 240, overflowY: 'auto',
        }}>
          {multi && options.length >= 3 && (
            <div style={{ padding: '8px 10px', borderBottom: '1px solid #e1e6ef', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
              <input
                type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', fontSize: 12, border: '1px solid #e1e6ef', borderRadius: 4, padding: '4px 8px', outline: 'none' }}
                onClick={e => e.stopPropagation()}
              />
            </div>
          )}
          {filtered.map(opt => {
            const isSelected = multi ? selected.includes(opt) : value === opt
            return (
              <div
                key={opt}
                onClick={(e) => {
                  e.stopPropagation()
                  if (multi) {
                    onMultiToggle?.(opt)
                  } else {
                    onSelect?.(opt)
                    setOpen(false)
                  }
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', fontSize: 12, fontWeight: 500, color: '#1d2433',
                  cursor: 'pointer', background: isSelected ? '#f0fdf4' : undefined,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = isSelected ? '#e6f7ed' : '#f3f4f6')}
                onMouseLeave={e => (e.currentTarget.style.background = isSelected ? '#f0fdf4' : '')}
              >
                {multi ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 3,
                      border: `1.5px solid ${isSelected ? '#1c895f' : '#cbd2e1'}`,
                      background: isSelected ? '#1c895f' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {isSelected && <span className="material-icons-outlined" style={{ fontSize: 12, color: 'white' }}>check</span>}
                    </div>
                    <span>{opt}</span>
                  </div>
                ) : (
                  <>
                    <span>{opt}</span>
                    {isSelected && <span className="material-icons-outlined" style={{ fontSize: 16, color: '#1c895f' }}>check</span>}
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Account inline edit ───────────────────────────────────────

function AccountInlineEdit({
  acct,
  acctFilter,
  onUpdateFilter,
  onAddFilter,
  onRemoveFilter,
  onSetTargetCompany,
  onClose,
}: {
  acct: AcctData
  acctFilter: AcctFilter
  onUpdateFilter: (fi: number, field: 'dim' | 'vals', value: string | string[]) => void
  onAddFilter: () => void
  onRemoveFilter: (fi: number) => void
  onSetTargetCompany: (val: string | null) => void
  onClose: () => void
}) {
  return (
    <div style={{ borderBottom: '1px solid #e1e6ef' }}>
      <div style={{ padding: '16px 24px 0' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#1d2433', marginBottom: 16 }}>{acct.name}</p>

        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Filters</span>
          {acctFilter.filters.map((f, fi) => {
            const dimVals = DD_OPTIONS.dimensionValues[f.dim] || []
            return (
              <div key={fi}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
                  <div style={{ flex: 1, minWidth: 0 }}><label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>Dimension</label></div>
                  <div style={{ flex: 1, minWidth: 0 }}><label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>Value(s)</label></div>
                  <div style={{ width: 32 }} />
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Dropdown value={f.dim} options={DD_OPTIONS.dimension} onSelect={v => onUpdateFilter(fi, 'dim', v)} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Dropdown multi selected={f.vals} options={dimVals} placeholder="Select..." onMultiToggle={v => {
                      const newVals = f.vals.includes(v) ? f.vals.filter(x => x !== v) : [...f.vals, v]
                      onUpdateFilter(fi, 'vals', newVals)
                    }} />
                  </div>
                  <button onClick={() => onRemoveFilter(fi)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}
                    className="hover:bg-[#f3f4f6]">
                    <span className="material-icons-outlined" style={{ fontSize: 18, color: '#adb2bb' }}>delete</span>
                  </button>
                </div>
              </div>
            )
          })}
          <button onClick={onAddFilter} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: '#1c895f', width: 'fit-content' }}>
            <span className="material-icons-outlined" style={{ fontSize: 16, color: '#1c895f' }}>add</span> Add Dimension
          </button>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, paddingBottom: 16 }}>
          <button onClick={onClose} style={{ height: 32, padding: '0 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, color: '#6b7280', fontFamily: MUSEO }} className="hover:bg-gray-200">Cancel</button>
          <button onClick={onClose} style={{ height: 32, padding: '0 12px', borderRadius: 6, border: '1px solid #e1e6ef', fontSize: 12, fontWeight: 700, color: '#1d2433', fontFamily: MUSEO }} className="hover:bg-gray-50">Done</button>
        </div>
      </div>
    </div>
  )
}

function InfoBullet({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, fontSize: 11, lineHeight: '18px', color: '#1d4ed8' }}>
      <span style={{ flexShrink: 0, color: '#1d4ed8' }}>&bull;</span>
      <span>{text}</span>
    </div>
  )
}

// ── Main SideDrawer component ─────────────────────────────────

interface SideDrawerProps {
  open: boolean
  onClose: () => void
  accountName?: string
  isGroup?: boolean
  onApply?: (targetCompanies: (string | null)[]) => void
}

export function SideDrawer({ open, onClose, accountName, isGroup = false, onApply }: SideDrawerProps) {
  const [form, setForm] = useState<FormState>(() => initForm(isGroup))
  const [editingAcctIdx, setEditingAcctIdx] = useState(-1)
  const acctData = isGroup ? GROUP_ACCTS : INDIVIDUAL_ACCTS

  function initForm(group: boolean): FormState {
    const accts = group ? GROUP_ACCTS : INDIVIDUAL_ACCTS
    return {
      folder: '01 Cash and cash equivalents',
      account: group ? null : accts[0].name,
      groupName: group ? 'Hamburger Donuts' : '',
      accounts: group ? [...DD_OPTIONS.accounts] : [],
      frequency: 'Monthly',
      assignees: [{ name: 'Sean Bean', role: 'Monthly Reviewer', dueType: 'Business Day', dueVal: '15', estTime: '05h 45m' }],
      acctFilters: accts.map(a => ({
        targetCompany: null,
        filters: a.filters.map(f => ({ dim: f.dim, vals: [...f.vals] })),
      })),
      bulkFilters: [],
      bulkTargetCompany: null,
      bulkAccounts: [...DD_OPTIONS.accounts],
    }
  }

  // Reset form when drawer opens
  useEffect(() => {
    if (open) {
      setForm(initForm(isGroup))
      setEditingAcctIdx(-1)
    }
  }, [open, isGroup])

  const updateForm = useCallback((updates: Partial<FormState>) => {
    setForm(prev => ({ ...prev, ...updates }))
  }, [])

  const updateAcctFilter = useCallback((acctIdx: number, filterIdx: number, field: 'dim' | 'vals', value: string | string[]) => {
    setForm(prev => {
      const newFilters = [...prev.acctFilters]
      const af = { ...newFilters[acctIdx], filters: [...newFilters[acctIdx].filters] }
      const f = { ...af.filters[filterIdx] }
      if (field === 'dim') {
        f.dim = value as string
        f.vals = []
      } else {
        f.vals = value as string[]
      }
      af.filters[filterIdx] = f
      newFilters[acctIdx] = af
      return { ...prev, acctFilters: newFilters }
    })
  }, [])

  const addAcctFilter = useCallback((acctIdx: number) => {
    setForm(prev => {
      const newFilters = [...prev.acctFilters]
      const af = { ...newFilters[acctIdx], filters: [...newFilters[acctIdx].filters, { dim: '', vals: [] }] }
      newFilters[acctIdx] = af
      return { ...prev, acctFilters: newFilters }
    })
  }, [])

  const removeAcctFilter = useCallback((acctIdx: number, filterIdx: number) => {
    setForm(prev => {
      const newFilters = [...prev.acctFilters]
      const af = { ...newFilters[acctIdx], filters: newFilters[acctIdx].filters.filter((_, i) => i !== filterIdx) }
      newFilters[acctIdx] = af
      return { ...prev, acctFilters: newFilters }
    })
  }, [])

  const setTargetCompany = useCallback((acctIdx: number, val: string | null) => {
    setForm(prev => {
      const newFilters = [...prev.acctFilters]
      newFilters[acctIdx] = { ...newFilters[acctIdx], targetCompany: val }
      return { ...prev, acctFilters: newFilters }
    })
  }, [])

  const addAssignee = useCallback(() => {
    setForm(prev => ({
      ...prev,
      assignees: [...prev.assignees, { name: '', role: '', dueType: 'Business Day', dueVal: '1', estTime: '00h 00m' }],
    }))
  }, [])

  const removeAssignee = useCallback((idx: number) => {
    setForm(prev => ({ ...prev, assignees: prev.assignees.filter((_, i) => i !== idx) }))
  }, [])

  const updateAssignee = useCallback((idx: number, field: keyof AssigneeForm, value: string) => {
    setForm(prev => {
      const newA = [...prev.assignees]
      newA[idx] = { ...newA[idx], [field]: value }
      return { ...prev, assignees: newA }
    })
  }, [])

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 999,
          opacity: 1, transition: 'opacity 0.3s ease',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 500, zIndex: 1000,
        background: 'white', borderLeft: '1px solid #e1e6ef',
        boxShadow: '-4px 0 16px rgba(0,0,0,0.08)',
        display: 'flex', flexDirection: 'column',
        transform: 'translateX(0)', transition: 'transform 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 24px 20px', flexShrink: 0 }}>
          <h2 style={{ flex: 1, fontFamily: MUSEO, fontWeight: 700, fontSize: 16, lineHeight: '20px', color: '#000' }}>
            {accountName || "Becky's Donuts"}
          </h2>
          <button onClick={onClose} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }} className="hover:bg-[#f3f4f6]">
            <span className="material-icons-outlined" style={{ fontSize: 20, color: '#6b7280' }}>close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 160px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Folder */}
          <div>
            <FieldLabel label="Folder" required />
            <Dropdown value={form.folder} options={DD_OPTIONS.folder} onSelect={v => updateForm({ folder: v })} />
          </div>

          {/* Group Name (group only) */}
          {isGroup && (
            <div>
              <FieldLabel label="Group Name" required />
              <div style={{ background: 'white', border: '1px solid #cbd2e1', borderRadius: 6, height: 36, padding: '0 12px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#1d2433' }}>{form.groupName}</span>
              </div>
            </div>
          )}

          {/* Account / Accounts */}
          {isGroup ? (
            <div>
              <FieldLabel label="Accounts" required />
              <Dropdown multi selected={form.accounts} options={DD_OPTIONS.accounts} placeholder={`${form.accounts.length} Accounts Selected`} onMultiToggle={v => {
                const next = form.accounts.includes(v) ? form.accounts.filter(x => x !== v) : [...form.accounts, v]
                updateForm({ accounts: next })
              }} />
            </div>
          ) : (
            <div>
              <FieldLabel label="Account" required />
              <Dropdown value={form.account} options={DD_OPTIONS.account} onSelect={v => updateForm({ account: v })} />
            </div>
          )}

          {/* Account Balance Filters */}
          <div>
            <FieldLabel label="Account Balance Filters" />
            <div style={{ border: '1px solid #e1e6ef', borderRadius: 6, overflow: 'visible' }}>
              {/* Bulk header (group only) */}
              {isGroup && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e1e6ef', padding: '8px 12px' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px', borderRadius: 6 }} className="hover:bg-gray-50">
                    <span className="material-icons-outlined" style={{ fontSize: 16, color: '#6b7280' }}>add</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', fontFamily: MUSEO, lineHeight: '14px' }}>Bulk Account Balance Filters</span>
                  </button>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', padding: '4px 6px', borderRadius: 6, cursor: 'pointer', fontFamily: MUSEO }} className="hover:bg-[#f3f4f6]">Edit</span>
                </div>
              )}
              {acctData.map((a, i) => {
                const isEditing = editingAcctIdx === i
                if (isEditing) {
                  return (
                    <AccountInlineEdit
                      key={i}
                      acct={a}
                      acctFilter={form.acctFilters[i]}
                      onUpdateFilter={(fi, field, val) => updateAcctFilter(i, fi, field, val)}
                      onAddFilter={() => addAcctFilter(i)}
                      onRemoveFilter={(fi) => removeAcctFilter(i, fi)}
                      onSetTargetCompany={(val) => setTargetCompany(i, val)}
                      onClose={() => setEditingAcctIdx(-1)}
                    />
                  )
                }
                const isLast = i === acctData.length - 1
                return (
                  <div key={i} style={{ padding: '12px 12px', borderBottom: isLast ? undefined : '1px solid #eef0f4' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#1d2433', lineHeight: '16px' }}>{a.name}</span>
                        <span style={{ fontSize: 11, color: 'rgba(29,36,51,0.65)', lineHeight: '16px' }}><b>Company:</b> {a.company}</span>
                        <span style={{ fontSize: 11, color: 'rgba(29,36,51,0.65)', lineHeight: '16px' }}><b>Bank Account:</b> {a.bank}</span>
                        <span style={{ fontSize: 11, color: 'rgba(29,36,51,0.65)', lineHeight: '16px' }}><b>Book Code:</b> {a.book}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 2, paddingTop: 2, paddingLeft: 12, flexShrink: 0 }}>
                        <button onClick={() => setEditingAcctIdx(i)} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }} className="hover:bg-[#f3f4f6]">
                          <span className="material-icons-outlined" style={{ fontSize: 18, color: '#9ca3af' }}>edit</span>
                        </button>
                        <button style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }} className="hover:bg-[#f3f4f6]">
                          <span className="material-icons-outlined" style={{ fontSize: 18, color: '#9ca3af' }}>more_vert</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <FieldLabel label="Frequency" required />
            <Dropdown value={form.frequency} options={DD_OPTIONS.frequency} onSelect={v => updateForm({ frequency: v })} />
          </div>

          {/* Assignees */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 20, marginBottom: 4 }}>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: '#1d2433' }}>Assignees</span>
            </div>
            <div style={{ border: '1px solid #e1e6ef', borderRadius: 4, padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {form.assignees.map((asg, ai) => (
                <div key={ai}>
                  {ai > 0 && <div style={{ height: 1, background: '#e1e6ef', marginBottom: 12 }} />}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4, display: 'block' }}>Assignee</label>
                            <Dropdown value={asg.name} options={DD_OPTIONS.assignee} showPhoto onSelect={v => updateAssignee(ai, 'name', v)} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4, display: 'block' }}>Role</label>
                            <Dropdown value={asg.role} options={DD_OPTIONS.role} onSelect={v => updateAssignee(ai, 'role', v)} />
                          </div>
                        </div>
                      </div>
                      <div style={{ paddingTop: 20 }}>
                        <button onClick={() => removeAssignee(ai)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }} className="hover:bg-[#f3f4f6]">
                          <span className="material-icons-outlined" style={{ fontSize: 18, color: '#9ca3af' }}>delete</span>
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <div style={{ flex: 1 }}>
                          <Dropdown value={asg.dueType} options={DD_OPTIONS.dueType} onSelect={v => updateAssignee(ai, 'dueType', v)} />
                        </div>
                        <div style={{ width: 44 }}>
                          <div style={{ background: 'white', border: '1px solid #e1e6ef', borderRadius: 6, height: 36, padding: '0 8px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <span style={{ fontSize: 12, color: '#1d2433' }}>{asg.dueVal}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4, display: 'block' }}>Estimated Time</label>
                        <div style={{ background: 'white', border: '1px solid #e1e6ef', borderRadius: 6, height: 36, padding: '0 8px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                          <span style={{ fontSize: 12, color: '#1d2433' }}>{asg.estTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addAssignee} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '6px 4px', borderRadius: 6 }} className="hover:bg-gray-50">
              <span className="material-icons-outlined" style={{ fontSize: 18, color: '#6b7280' }}>add</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#6b7280' }}>Add Assignee</span>
            </button>
          </div>

          {/* General Settings */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 20, marginBottom: 4 }}>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: '#1d2433' }}>General Settings</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', fontFamily: MUSEO, padding: 6, borderRadius: 6, cursor: 'pointer' }} className="hover:bg-[#f3f4f6]">Edit</span>
            </div>
            <div style={{ border: '1px solid #e1e6ef', borderRadius: 4, padding: 8, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, lineHeight: '18px' }}>
              <SettingsRow label="Currency:" value="USD" />
              <SettingsRow label="Rec Type:" value="AutoRec Disabled" />
              <SettingsRow label="Fixed Balance:" value="NA" />
              <SettingsRow label="Threshold:" value="$100.00" />
            </div>
          </div>

          {/* Controls */}
          <div>
            <FieldLabel label="Controls" />
            <Dropdown value={null} options={[]} placeholder="Select Controls" />
          </div>

          {/* Tags */}
          <div>
            <FieldLabel label="Tags" />
            <Dropdown value={null} options={[]} placeholder="Select Tags" />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16,
          padding: '16px', background: '#f8fafc', height: 72, flexShrink: 0,
        }}>
          <button onClick={onClose} style={{ height: 40, padding: '0 12px', borderRadius: 6, fontWeight: 700, fontSize: 12, color: '#6b7280', letterSpacing: '-0.12px', fontFamily: MUSEO }} className="hover:bg-gray-200">
            Cancel
          </button>
          <button onClick={() => {
            const tcs = form.acctFilters.map(af => af.targetCompany ?? null)
            onApply?.(tcs)
            onClose()
          }} style={{ height: 40, padding: '0 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '-0.12px', fontFamily: MUSEO, background: '#1c895f', cursor: 'pointer' }} className="hover:bg-[#167a53]">
            Done
          </button>
        </div>
      </div>
    </>
  )
}

// ── Small helpers ──────────────────────────────────────────────

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 20, marginBottom: 4 }}>
      {required && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D24747', flexShrink: 0 }} />}
      <label style={{ fontSize: 12, fontWeight: 500, lineHeight: '18px', color: required ? '#1d2433' : '#424867' }}>{label}</label>
    </div>
  )
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      <span style={{ fontWeight: 600, color: 'rgba(29,36,51,0.9)', maxWidth: 88, flexShrink: 0, whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontWeight: 400, color: '#1d2433' }}>{value}</span>
    </div>
  )
}
