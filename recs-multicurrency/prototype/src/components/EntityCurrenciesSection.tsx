// Entity Currencies section - inlined inside AdminSettings (PDF Step 2).
// Defines instance-wide Reporting Currency + per-entity Functional Currency.
// isAdmin=true: editable dropdowns. isAdmin=false: locked read-only fields.

import { useState } from 'react'

const MUSEO = "'Museo Sans', sans-serif"
const INTER = 'Inter, sans-serif'

// Locked read-only field - shown for non-admin users
function LockedField({ value }: { value: string }) {
  return (
    <div style={{
      height: 36, padding: '0 12px',
      background: '#f3f4f6',
      border: '1px solid #e1e6ef',
      borderRadius: 6,
      display: 'flex', alignItems: 'center',
      gap: 8,
      cursor: 'not-allowed',
    }}>
      <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: INTER }}>
        {value}
      </span>
      <span className="material-icons-outlined" style={{ fontSize: 16, color: '#9ca3af', flexShrink: 0 }}>lock</span>
    </div>
  )
}

// Editable dropdown - shown for admin users
function CurrencyDropdown({ value, options, onSelect }: { value: string; options: string[]; onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', height: 36, padding: '0 12px',
          background: 'white', border: '1px solid #cbd2e1', borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)', textAlign: 'left',
          fontFamily: INTER,
        }}
      >
        <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: '#1d2433', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </span>
        <span className="material-icons-outlined" style={{ fontSize: 18, color: '#6b7280', flexShrink: 0 }}>expand_more</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 1 }} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: 'white', border: '1px solid #e1e6ef', borderRadius: 6,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)', maxHeight: 240, overflowY: 'auto', zIndex: 2,
          }}>
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onSelect(opt); setOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '8px 12px',
                  fontSize: 12, fontWeight: 500, color: '#1d2433',
                  background: opt === value ? '#f0fdf4' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: INTER,
                }}
                className="hover:bg-[#f3f4f6]"
              >
                <span>{opt}</span>
                {opt === value && (
                  <span className="material-icons-outlined" style={{ fontSize: 16, color: '#1c895f' }}>check</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export const CURRENCY_OPTIONS = [
  'AED: UAE Dirham',
  'AUD: Australian Dollar',
  'BRL: Brazilian Real',
  'CAD: Canadian Dollar',
  'CHF: Swiss Franc',
  'CLP: Chilean Peso',
  'CNY: Chinese Yuan',
  'COP: Colombian Peso',
  'CZK: Czech Koruna',
  'DKK: Danish Krone',
  'EUR: Euro',
  'GBP: British Pound',
  'HKD: Hong Kong Dollar',
  'HUF: Hungarian Forint',
  'IDR: Indonesian Rupiah',
  'ILS: Israeli Shekel',
  'INR: Indian Rupee',
  'JPY: Japanese Yen',
  'KRW: South Korean Won',
  'MXN: Mexican Peso',
  'MYR: Malaysian Ringgit',
  'NOK: Norwegian Krone',
  'NZD: New Zealand Dollar',
  'PHP: Philippine Peso',
  'PLN: Polish Zloty',
  'SAR: Saudi Riyal',
  'SEK: Swedish Krona',
  'SGD: Singapore Dollar',
  'THB: Thai Baht',
  'TRY: Turkish Lira',
  'TWD: Taiwan Dollar',
  'USD: US Dollar',
  'ZAR: South African Rand',
]

interface Entity {
  name: string
  functionalCurrency: string
}

const SAMPLE_ENTITIES: Entity[] = [
  { name: 'Global Modern Services, Inc. (USA)', functionalCurrency: 'USD: US Dollar' },
  { name: 'Acme Mexico, S.A. de C.V.', functionalCurrency: 'MXN: Mexican Peso' },
  { name: 'Widget Limited (UK)', functionalCurrency: 'GBP: British Pound' },
  { name: 'Tokyo Solutions K.K.', functionalCurrency: 'JPY: Japanese Yen' },
  { name: 'Sydney Holdings Pty Ltd', functionalCurrency: 'AUD: Australian Dollar' },
]

export function EntityCurrenciesSection({ isAdmin = false }: { isAdmin?: boolean }) {
  const [reportingCurrency, setReportingCurrency] = useState('USD: US Dollar')
  const [entities, setEntities] = useState<Entity[]>(SAMPLE_ENTITIES)

  return (
    <div className="flex flex-col">
      {/* Reporting Currency */}
      <div className="flex flex-col gap-[8px] pb-[20px]">
        <h3 className="text-[13px] leading-[20px] text-[#1d2433]" style={{ fontFamily: MUSEO, fontWeight: 700 }}>
          Reporting Currency
        </h3>
        <p className="text-[12px] leading-[18px] text-[#6b7280]" style={{ fontFamily: INTER }}>
          Top-level currency for your organization. All entity values translate up to this currency for consolidated reporting.
        </p>
        {isAdmin ? (
          <CurrencyDropdown
            value={reportingCurrency}
            options={CURRENCY_OPTIONS}
            onSelect={setReportingCurrency}
          />
        ) : (
          <LockedField value={reportingCurrency} />
        )}
      </div>

      <div className="h-px bg-[#e1e6ef]" />

      {/* Functional Currency by Entity */}
      <div className="flex flex-col gap-[8px] pt-[20px]">
        <h3 className="text-[13px] leading-[20px] text-[#1d2433]" style={{ fontFamily: MUSEO, fontWeight: 700 }}>
          Functional Currency by Entity
        </h3>
        <p className="text-[12px] leading-[18px] text-[#6b7280]" style={{ fontFamily: INTER }}>
          Each entity's books are kept in its functional currency. Defaults to the reporting currency unless overridden per entity.
        </p>
        <div className="flex flex-col">
          {entities.map((entity, idx) => {
            const isLast = idx === entities.length - 1
            return (
              <div
                key={entity.name}
                className="flex items-center gap-[12px] py-[10px]"
                style={{ borderBottom: isLast ? undefined : '1px solid #eef0f4' }}
              >
                <span
                  className="flex-1 min-w-0 text-[12px] leading-[18px] text-[#1d2433] overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ fontFamily: INTER, fontWeight: 500 }}
                >
                  {entity.name}
                </span>
                <div style={{ width: 240, flexShrink: 0 }}>
                  {isAdmin ? (
                    <CurrencyDropdown
                      value={entity.functionalCurrency}
                      options={CURRENCY_OPTIONS}
                      onSelect={v => setEntities(prev => prev.map((e, i) => i === idx ? { ...e, functionalCurrency: v } : e))}
                    />
                  ) : (
                    <LockedField value={entity.functionalCurrency} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
