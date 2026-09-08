import { useState } from 'react'
import { Select } from '@floqastinc/flow-ui_core'
import type { FieldMapping } from '../../data/field-mappings'

/* ── Mock data ───────────────────────────────────────────────── */
const AVAILABLE_DATES = ['2026-02-28', '2026-01-31', '2025-12-31', '2025-11-30']
const ENTITIES = [
  { id: 'all', name: 'All Entities' },
  { id: 'us-entity-1', name: 'US Entity 1' },
  { id: 'us-entity-2', name: 'US Entity 2' },
  { id: 'us-entity-3', name: 'US Entity 3' },
]

type SourceRow = {
  account_id: string
  entity_code: string
  acct_num: string
  acct_display_name: string
  type_id: string
  iso_currency_code: string
  record_status: string
  amount_usd: string
}

const MOCK_SOURCE_ROWS: SourceRow[] = [
  { account_id: 'ACC-001', entity_code: 'US1', acct_num: '1000', acct_display_name: 'Cash and Cash Equivalents', type_id: 'ASSET', iso_currency_code: 'USD', record_status: 'true', amount_usd: '145200.00' },
  { account_id: 'ACC-002', entity_code: 'US1', acct_num: '1100', acct_display_name: 'Accounts Receivable', type_id: 'ASSET', iso_currency_code: 'USD', record_status: 'true', amount_usd: '89400.00' },
  { account_id: 'ACC-003', entity_code: 'US1', acct_num: '1200', acct_display_name: 'Prepaid Expenses', type_id: 'ASSET', iso_currency_code: 'USD', record_status: 'true', amount_usd: '21300.00' },
  { account_id: 'ACC-004', entity_code: 'US1', acct_num: '1300', acct_display_name: 'Inventory', type_id: 'ASSET', iso_currency_code: 'USD', record_status: 'true', amount_usd: '310750.00' },
  { account_id: 'ACC-005', entity_code: 'US1', acct_num: '1500', acct_display_name: 'Property Plant and Equipment', type_id: 'ASSET', iso_currency_code: 'USD', record_status: 'true', amount_usd: '892000.00' },
  { account_id: 'ACC-006', entity_code: 'US1', acct_num: '1600', acct_display_name: 'Intangible Assets', type_id: 'ASSET', iso_currency_code: 'USD', record_status: 'true', amount_usd: '430000.00' },
  { account_id: 'ACC-007', entity_code: 'US2', acct_num: '2000', acct_display_name: 'Accounts Payable', type_id: 'LIABILITY', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-34200.00' },
  { account_id: 'ACC-008', entity_code: 'US2', acct_num: '2100', acct_display_name: 'Accrued Expenses', type_id: 'LIABILITY', iso_currency_code: 'USD', record_status: 'false', amount_usd: '-12800.00' },
  { account_id: 'ACC-009', entity_code: 'US2', acct_num: '2200', acct_display_name: 'Deferred Revenue', type_id: 'LIABILITY', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-67500.00' },
  { account_id: 'ACC-010', entity_code: 'US2', acct_num: '2300', acct_display_name: 'Short Term Debt', type_id: 'LIABILITY', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-150000.00' },
  { account_id: 'ACC-011', entity_code: 'US2', acct_num: '2400', acct_display_name: 'Long Term Debt', type_id: 'LIABILITY', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-500000.00' },
  { account_id: 'ACC-012', entity_code: 'US2', acct_num: '2500', acct_display_name: 'Tax Payable', type_id: 'LIABILITY', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-28400.00' },
  { account_id: '', entity_code: 'US3', acct_num: '3000', acct_display_name: 'Retained Earnings', type_id: 'EQUITY', iso_currency_code: 'USD', record_status: 'true', amount_usd: '220000.00' },
  { account_id: 'ACC-014', entity_code: 'US3', acct_num: '3100', acct_display_name: 'Common Stock', type_id: 'EQUITY', iso_currency_code: 'USD', record_status: 'true', amount_usd: '500000.00' },
  { account_id: 'ACC-015', entity_code: 'US3', acct_num: '3200', acct_display_name: 'Additional Paid in Capital', type_id: 'EQUITY', iso_currency_code: 'USD', record_status: 'true', amount_usd: '1200000.00' },
  { account_id: 'ACC-016', entity_code: 'US3', acct_num: '3300', acct_display_name: 'Treasury Stock', type_id: 'EQUITY', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-85000.00' },
  { account_id: 'ACC-017', entity_code: 'US3', acct_num: '4000', acct_display_name: 'Product Revenue', type_id: 'REVENUE', iso_currency_code: '', record_status: 'true', amount_usd: '560000.00' },
  { account_id: 'ACC-018', entity_code: 'US3', acct_num: '4100', acct_display_name: 'Service Revenue', type_id: 'REVENUE', iso_currency_code: 'USD', record_status: 'true', amount_usd: '340000.00' },
  { account_id: 'ACC-019', entity_code: 'US3', acct_num: '4200', acct_display_name: 'Subscription Revenue', type_id: 'REVENUE', iso_currency_code: 'USD', record_status: 'true', amount_usd: '892000.00' },
  { account_id: 'ACC-020', entity_code: 'US1', acct_num: '5000', acct_display_name: 'Cost of Goods Sold', type_id: 'EXPENSE', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-210000.00' },
  { account_id: 'ACC-021', entity_code: 'US1', acct_num: '5100', acct_display_name: 'Salaries and Wages', type_id: 'EXPENSE', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-430000.00' },
  { account_id: 'ACC-022', entity_code: 'US1', acct_num: '5200', acct_display_name: 'Rent Expense', type_id: 'EXPENSE', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-48000.00' },
  { account_id: 'ACC-023', entity_code: 'US2', acct_num: '5300', acct_display_name: 'Marketing and Advertising', type_id: 'EXPENSE', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-92000.00' },
  { account_id: '', entity_code: 'US2', acct_num: '5400', acct_display_name: 'Research and Development', type_id: 'EXPENSE', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-175000.00' },
  { account_id: 'ACC-025', entity_code: 'US2', acct_num: '5500', acct_display_name: 'Depreciation Expense', type_id: 'EXPENSE', iso_currency_code: '', record_status: 'true', amount_usd: '-67000.00' },
  { account_id: 'ACC-026', entity_code: 'US3', acct_num: '5600', acct_display_name: 'Interest Expense', type_id: 'EXPENSE', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-18500.00' },
  { account_id: 'ACC-027', entity_code: 'US3', acct_num: '5700', acct_display_name: 'Income Tax Expense', type_id: 'EXPENSE', iso_currency_code: 'USD', record_status: 'true', amount_usd: '-54000.00' },
  { account_id: 'ACC-028', entity_code: 'US1', acct_num: '6000', acct_display_name: 'Other Operating Income', type_id: 'REVENUE', iso_currency_code: 'USD', record_status: 'false', amount_usd: '12400.00' },
  { account_id: 'ACC-029', entity_code: 'US1', acct_num: '6100', acct_display_name: 'Foreign Exchange Gain Loss', type_id: 'REVENUE', iso_currency_code: 'EUR', record_status: 'true', amount_usd: '-3200.00' },
  { account_id: 'ACC-030', entity_code: 'US2', acct_num: '6200', acct_display_name: 'Investment Income', type_id: 'REVENUE', iso_currency_code: 'USD', record_status: 'true', amount_usd: '28900.00' },
]

type TransformedRow = {
  entity: string
  accountId: string
  accountNumber: string
  accountName: string
  accountType: string
  currency: string
  errors: Record<string, string>
  sourceRow: SourceRow
}

function properCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function transformRows(sourceRows: SourceRow[]): TransformedRow[] {
  return sourceRows.map((row) => {
    const errors: Record<string, string> = {}
    if (!row.account_id) errors['Account ID'] = 'Required field is empty'
    if (!row.iso_currency_code) errors['Currency'] = 'Required field is empty'
    return {
      entity: row.entity_code || '—',
      accountId: row.account_id ? `${row.entity_code}-${row.account_id}` : '—',
      accountNumber: row.acct_num.trim(),
      accountName: properCase(row.acct_display_name),
      accountType: row.type_id.toLowerCase(),
      currency: row.iso_currency_code || '—',
      errors,
      sourceRow: row,
    }
  })
}

/* ── Icons ───────────────────────────────────────────────────── */
function IconX() {
  return <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
}
function IconPlay() {
  return <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
}
function IconChevronDown() {
  return <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7"/></svg>
}
function IconChevronRight() {
  return <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7"/></svg>
}
function IconCheck() {
  return <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
}
function IconAlert() {
  return <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/></svg>
}

/* ── Component ───────────────────────────────────────────────── */
interface RunTestModalProps {
  isOpen: boolean
  onClose: () => void
  mappings: FieldMapping[]
}

export default function RunTestModal({ isOpen, onClose, mappings }: RunTestModalProps) {
  const [selectedDate, setSelectedDate] = useState(AVAILABLE_DATES[0])
  const [selectedEntity, setSelectedEntity] = useState('all')
  const [results, setResults] = useState<TransformedRow[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [filterText, setFilterText] = useState('')

  if (!isOpen) return null

  const handleRunTest = () => {
    setIsLoading(true)
    setResults(null)
    setExpandedRows(new Set())
    setTimeout(() => {
      const filtered = selectedEntity === 'all'
        ? MOCK_SOURCE_ROWS
        : MOCK_SOURCE_ROWS.filter(r => r.entity_code === selectedEntity.replace('us-entity-', 'US'))
      setResults(transformRows(filtered))
      setIsLoading(false)
    }, 1200)
  }

  const toggleRow = (i: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(i)) { next.delete(i) } else { next.add(i) }
      return next
    })
  }

  const filteredResults = results
    ? filterText
      ? results.filter(r => {
          const q = filterText.toLowerCase()
          return (
            r.accountId.toLowerCase().includes(q) ||
            r.accountName.toLowerCase().includes(q) ||
            r.accountType.toLowerCase().includes(q) ||
            r.entity.toLowerCase().includes(q) ||
            r.currency.toLowerCase().includes(q)
          )
        })
      : results
    : []

  const errorCount = filteredResults.reduce((n, r) => n + Object.keys(r.errors).length, 0)

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-2xl flex flex-col"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '80vw', maxWidth: '80vw', height: '80vh', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Test Transformation</h2>
            <p className="text-xs text-gray-500 mt-0.5">Run a test against mock source data to preview transformation output</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors">
            <IconX />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-end gap-4 px-5 py-4 border-b border-gray-200 shrink-0 bg-gray-50">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">As-of Date</label>
            <Select
              options={AVAILABLE_DATES.map(d => ({ label: d, value: d }))}
              value={selectedDate}
              onChange={(val) => setSelectedDate(val as string)}
              selectionMode="single"
              disableClear
              disableFilter
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Filter by Entity</label>
            <Select
              options={ENTITIES.map(e => ({ label: e.name, value: e.id }))}
              value={selectedEntity}
              onChange={(val) => setSelectedEntity(val as string)}
              selectionMode="single"
              disableClear
              disableFilter
            />
          </div>
          <button
            onClick={handleRunTest}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#186749] text-white text-sm font-medium rounded-md hover:bg-[#145a3e] transition-colors disabled:opacity-50 shrink-0"
          >
            <IconPlay />
            {isLoading ? 'Running…' : 'Run Test'}
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto px-5 py-4">

          {/* Empty state */}
          {!isLoading && results === null && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <IconPlay />
              <p className="text-sm">Select parameters and click Run Test to preview output</p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-sm text-gray-500 animate-pulse">Running transformation…</div>
            </div>
          )}

          {results && (
            <>
              {/* Filter input */}
              <div className="relative" style={{ marginBottom: '32px' }}>
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Filter rows by account ID, name, type, entity..."
                  value={filterText}
                  onChange={e => setFilterText(e.target.value)}
                  className="w-full border border-gray-300 rounded-md pl-9 pr-16 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#186749]"
                />
                {filterText && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    {filteredResults.length} / {results.length}
                  </span>
                )}
              </div>

              {/* Transformed output */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Transformed Output</h3>
                  <div className="flex items-center gap-2">
                    {errorCount > 0 ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                        <IconAlert />{errorCount} error{errorCount !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        <IconCheck />All passed
                      </span>
                    )}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                      <tr>
                        <th className="w-8 px-3 py-2"></th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Entity</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Account ID</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Account Number</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Account Name</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Type</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Currency</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((row, i) => {
                        const hasErrors = Object.keys(row.errors).length > 0
                        const isExpanded = expandedRows.has(i)
                        return (
                          <>
                            <tr
                              key={`row-${i}`}
                              className={`cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${hasErrors ? 'bg-red-50/40' : ''}`}
                              onClick={() => toggleRow(i)}
                            >
                              <td className="px-3 py-2 text-gray-400">
                                {isExpanded ? <IconChevronDown /> : <IconChevronRight />}
                              </td>
                              <td className="px-3 py-2">{row.entity}</td>
                              <td className={`px-3 py-2 ${hasErrors && row.errors['Account ID'] ? 'text-red-600' : ''}`}>{row.accountId}</td>
                              <td className="px-3 py-2">{row.accountNumber}</td>
                              <td className="px-3 py-2">{row.accountName}</td>
                              <td className="px-3 py-2">{row.accountType}</td>
                              <td className={`px-3 py-2 ${hasErrors && row.errors['Currency'] ? 'text-red-600' : ''}`}>{row.currency}</td>
                              <td className="px-3 py-2">
                                {hasErrors ? (
                                  <span className="flex items-center gap-1 text-red-600 font-medium">
                                    <IconAlert />{Object.keys(row.errors).length} error{Object.keys(row.errors).length !== 1 ? 's' : ''}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-green-600 font-medium">
                                    <IconCheck />OK
                                  </span>
                                )}
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr key={`exp-${i}`}>
                                <td colSpan={8} className="bg-gray-50 px-5 py-4 border-b border-gray-100">
                                  <div className="text-xs font-semibold text-gray-700 mb-3">Field Transformations</div>
                                  <div className="grid grid-cols-3 gap-2.5">
                                    {mappings.filter(m => m.sourceFields.length > 0).map(mapping => {
                                      const resultMap: Record<string, string> = {
                                        'Account ID': row.accountId,
                                        'Account Number': row.accountNumber,
                                        'Account Name': row.accountName,
                                        'Account Type': row.accountType,
                                        'Currency': row.currency,
                                      }
                                      const error = row.errors[mapping.fqFieldName]
                                      const result = resultMap[mapping.fqFieldName]
                                        ?? (row.sourceRow as Record<string, string>)[mapping.sourceFields[0]?.name]
                                        ?? '—'
                                      return (
                                        <div key={mapping.id} className={`rounded border p-2.5 bg-white ${error ? 'border-red-300' : 'border-gray-200'}`}>
                                          {/* Header */}
                                          <div className="flex items-center gap-1.5 mb-2">
                                            <span className="font-semibold text-gray-800 text-[11px]">{mapping.fqFieldName}</span>
                                            {mapping.isMandatory && <span className="text-[9px] font-medium text-gray-400 uppercase tracking-wide">Required</span>}
                                          </div>

                                          {/* Source fields */}
                                          <div className="text-[10px] text-gray-400 mb-1">Source</div>
                                          <div className="flex flex-wrap gap-1 mb-2">
                                            {mapping.sourceFields.map(sf => {
                                              const val = (row.sourceRow as Record<string, string>)[sf.name]
                                              return (
                                                <span key={sf.id} className="inline-flex items-center gap-1 bg-gray-100 rounded px-1.5 py-0.5 text-[10px]">
                                                  <span className="text-gray-500">{sf.name}:</span>
                                                  <span className={`font-medium ${!val ? 'text-red-500 italic' : 'text-gray-700'}`}>{val || 'empty'}</span>
                                                </span>
                                              )
                                            })}
                                          </div>

                                          {/* Transformation rule */}
                                          {mapping.transformation && (
                                            <>
                                              <div className="text-[10px] text-gray-400 mb-1">Transformation</div>
                                              <div className="font-mono text-[10px] bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-700 mb-2 break-all">{mapping.transformation}</div>
                                            </>
                                          )}

                                          {/* Result */}
                                          <div className="text-[10px] text-gray-400 mb-1">Result</div>
                                          {error ? (
                                            <div className="flex items-center gap-1 text-red-600 text-[10px]"><IconAlert />{error}</div>
                                          ) : (
                                            <div className="text-[10px] bg-blue-50 border border-blue-100 rounded px-2 py-1 text-blue-800">{result}</div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
