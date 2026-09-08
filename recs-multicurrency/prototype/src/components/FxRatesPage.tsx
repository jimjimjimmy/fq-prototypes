import { useState } from 'react'
import FileUpload from '@floqastinc/flow-ui_core/FileUpload'

const INTER = 'Inter, sans-serif'
const MUSEO = "'Museo Sans', sans-serif"

// Only rates that were explicitly uploaded by the admin are shown.
// FloQast does not auto-insert 1:1 same-currency rates, and does not
// derive cross-rates (e.g. JPY→MXN from JPY→USD + USD→MXN).
export const RATES = [
  { from: 'MXN', to: 'USD', rate: '0.0464' },
  { from: 'USD', to: 'MXN', rate: '21.5517' },
  { from: 'JPY', to: 'USD', rate: '0.0069' },
  { from: 'USD', to: 'JPY', rate: '144.9275' },
  { from: 'GBP', to: 'USD', rate: '1.2654' },
  { from: 'USD', to: 'GBP', rate: '0.7903' },
  { from: 'EUR', to: 'USD', rate: '1.0821' },
  { from: 'USD', to: 'EUR', rate: '0.9241' },
  { from: 'CAD', to: 'USD', rate: '0.7321' },
  { from: 'USD', to: 'CAD', rate: '1.3659' },
].filter(r => r.from !== r.to) // guard: never show same-currency rates

// Periods available in the picker. Past periods are pre-populated with historical rates;
// Oct 2025's load state follows the fxRatesLoaded prop (Admin scenario starts empty).
const PAST_PERIODS_WITH_RATES = new Set(['Sep 2025', 'Aug 2025', 'Jul 2025', 'Jun 2025'])
// Period-end date used in the table footer "Last updated" line
const PERIOD_END_DATE: Record<string, string> = {
  'Oct 2025': 'Oct 31, 2025',
  'Sep 2025': 'Sep 30, 2025',
  'Aug 2025': 'Aug 31, 2025',
  'Jul 2025': 'Jul 31, 2025',
  'Jun 2025': 'Jun 30, 2025',
}

interface FxRatesPageProps {
  onBack: () => void
  period?: string
  isAdmin?: boolean
  fxRatesLoaded?: boolean
  onUploadComplete?: () => void
}

export function FxRatesPage({
  onBack,
  period = 'Oct 2025',
  isAdmin = false,
  fxRatesLoaded = false,
  onUploadComplete,
}: FxRatesPageProps) {
  // Period is inherited from context and no longer user-switchable on this page.
  const selectedPeriod = period
  // Display the period with the full month name in the page title to match the design.
  const fullPeriodLabel = (() => {
    const map: Record<string, string> = {
      'Oct 2025': 'October 2025',
      'Sep 2025': 'September 2025',
      'Aug 2025': 'August 2025',
      'Jul 2025': 'July 2025',
      'Jun 2025': 'June 2025',
    }
    return map[selectedPeriod] ?? selectedPeriod
  })()
  // Track in-session uploads. Oct 2025's loaded state always tracks the fxRatesLoaded
  // prop (so it stays in sync when the scenario switches); other periods are loaded
  // only when the admin uploads to them.
  const [uploadedByPeriod, setUploadedByPeriod] = useState<Record<string, boolean>>({})
  // Timestamp per period for in-session uploads. Used to show a success card after upload.
  const [lastUploadByPeriod, setLastUploadByPeriod] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)

  // Oct 2025's load state follows the fxRatesLoaded prop (Admin scenario starts
  // empty until the admin uploads). Past periods are pre-populated. Admin uploads
  // populate any selected period via uploadedByPeriod.
  const hasRatesForPeriod =
    (selectedPeriod === 'Oct 2025' && fxRatesLoaded)
    || PAST_PERIODS_WITH_RATES.has(selectedPeriod)
    || !!uploadedByPeriod[selectedPeriod]


  function handleFileChange(_file: unknown) {
    // Simulate upload latency to show the uploading state - matches existing demo behavior
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setUploadedByPeriod(prev => ({ ...prev, [selectedPeriod]: true }))
      // Capture timestamp for the success card
      const now = new Date().toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
      })
      setLastUploadByPeriod(prev => ({ ...prev, [selectedPeriod]: now }))
      // Only fire upload-complete callback for the default period (consumed by setup banner)
      if (selectedPeriod === 'Oct 2025') onUploadComplete?.()
    }, 900)
  }

  return (
    <div className="flex-1 overflow-auto bg-white flex flex-col">
      {/* Page header - matches FlowUI Template / Page-header (Figma 5642:23592):
          flex column, padding 16px vertical / 24px horizontal, gap 8 between
          back link and content row. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '16px 24px' }}>
        {/* Back link - FlowUI text-link pattern: 11px Inter semibold, 16px chevron, underlined */}
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            height: 18,
            fontSize: 11, fontWeight: 600, color: '#1d2433',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: INTER, padding: 0,
            alignSelf: 'flex-start',
          }}
        >
          <span className="material-icons-outlined" style={{ fontSize: 16 }}>chevron_left</span>
          <span style={{ textDecoration: 'underline', lineHeight: '16px' }}>Back to Reconciliations</span>
        </button>

        {/* Content row: title + subtitle on the left, button area on the right */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, width: '100%' }}>
          <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontFamily: MUSEO, fontWeight: 700, fontSize: 24, color: '#1d2433', margin: 0, lineHeight: '32px' }}>
              FX Rates - {fullPeriodLabel}
            </h1>
            <p style={{ fontFamily: INTER, fontSize: 12, fontWeight: 500, color: 'rgba(29, 36, 51, 0.9)', margin: 0, lineHeight: '18px' }}>
              Your FX rates must be uploaded as a .xlsx file with From Currency, To Currency and Period-End Rate columns.
            </p>
          </div>
          {/* Add FX Rates - admin, current period only. Clicking simulates the demo
              upload; the native file picker is intentionally skipped. */}
          {/* Header button removed - upload action lives in the drop zone below
              to avoid duplicate affordances. */}
        </div>
      </div>

      {/* Persistent rate-methodology note */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        background: '#f8f9fc', border: '1px solid #e1e6ef',
        borderRadius: 6, padding: '10px 14px',
        margin: '0 24px 16px',
      }}>
        <span className="material-icons-outlined" style={{ fontSize: 14, color: '#6b7280', flexShrink: 0, marginTop: 1 }}>info</span>
        <p style={{ fontSize: 12, color: '#424867', fontFamily: INTER, margin: 0, lineHeight: '18px' }}>
          FloQast applies period-end FX rates to all multi-currency conversions. Average and historical rates are not supported in this release.
        </p>
      </div>

      {/* Page body - table and supporting content. 24px gutters match the Figma
          Content Area > Table inset. */}
      <div style={{ padding: '0 24px 24px' }}>

        {/* Upload success card - only shown after admin uploads in-session */}
        {lastUploadByPeriod[selectedPeriod] && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px',
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 8, marginBottom: 16,
          }}>
            <span className="material-icons-outlined" style={{ fontSize: 20, color: '#16a34a', flexShrink: 0 }}>check_circle</span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#15803d', fontFamily: MUSEO, margin: '0 0 2px' }}>
                Rates uploaded for {selectedPeriod}
              </p>
              <p style={{ fontSize: 11, color: '#166534', fontFamily: INTER, margin: 0 }}>
                Last upload: {lastUploadByPeriod[selectedPeriod]}
              </p>
            </div>
          </div>
        )}

        {hasRatesForPeriod ? (
          <>
            {/* Rates table */}
            <div style={{ border: '1px solid #e1e6ef', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: INTER }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e1e6ef' }}>
                    {['FROM', 'TO', 'PERIOD-END RATE'].map((col, i) => (
                      <th
                        key={col}
                        style={{
                          textAlign: i >= 2 ? 'right' : 'left',
                          fontSize: 11, fontWeight: 600, color: '#6b7280',
                          padding: '10px 20px',
                          letterSpacing: '0.04em', textTransform: 'uppercase',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RATES.map((r, i) => (
                    <tr
                      key={`${r.from}-${r.to}`}
                      style={{ borderBottom: i < RATES.length - 1 ? '1px solid #eef0f4' : undefined }}
                      className="hover:bg-[#f8fafc]"
                    >
                      <td style={{ padding: '12px 20px', fontSize: 12, fontWeight: 700, color: '#1d2433' }}>{r.from}</td>
                      <td style={{ padding: '12px 20px', fontSize: 12, fontWeight: 700, color: '#1d2433' }}>{r.to}</td>
                      <td style={{ padding: '12px 20px', fontSize: 12, color: '#1d2433', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <p style={{ fontSize: 11, color: '#9ca3af', fontFamily: INTER, margin: '0 0 24px' }}>
              Last updated {PERIOD_END_DATE[selectedPeriod] ?? selectedPeriod} - {RATES.length} pairs active
            </p>
          </>
        ) : !isAdmin ? (
          /* Non-admin empty state card. Admin's empty state is the upload UI itself (below). */
          <div style={{
            border: '1px solid #e1e6ef', borderRadius: 8,
            padding: '40px 24px', marginBottom: 24,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            background: '#f8fafc', textAlign: 'center',
          }}>
            <span className="material-icons-outlined" style={{ fontSize: 32, color: '#cbd2e1' }}>currency_exchange</span>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1d2433', fontFamily: MUSEO, margin: 0 }}>
              No rates uploaded for {selectedPeriod}
            </p>
            <p style={{ fontSize: 12, lineHeight: '18px', color: '#6b7280', fontFamily: INTER, margin: 0, maxWidth: 400 }}>
              Contact your admin to upload rates for this period.
            </p>
          </div>
        ) : null}

        {/* Role-based bottom section. Admin upload UI is current-period only -
            past-period rates are historical records and not editable. */}
        {isAdmin && selectedPeriod === 'Oct 2025' ? (
          /* Admin: FlowUI FileUpload drop zone. Used both for empty state
             ("No rates uploaded") and populated state ("Replace rates"). */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ fontFamily: MUSEO, fontWeight: 700, fontSize: 13, color: '#1d2433', margin: 0 }}>
              {hasRatesForPeriod ? 'Replace rates' : `No rates uploaded for ${selectedPeriod}`}
            </h3>
            {/* Capture-phase handler intercepts clicks before they reach FlowUI's
                UploadButton, which would otherwise open the native file picker.
                For the prototype demo we skip real file selection entirely. */}
            <div
              onClickCapture={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!uploading) handleFileChange(null)
              }}
              style={{ cursor: uploading ? 'default' : 'pointer' }}
            >
              <FileUpload onChange={handleFileChange} allowedFileTypes=".xlsx">
                <FileUpload.DropZone>
                  <FileUpload.UploadButton>
                    {uploading ? 'Uploading...' : (hasRatesForPeriod ? 'Replace FX Rates' : 'Add FX Rates')}
                  </FileUpload.UploadButton>
                  <FileUpload.HelperText>
                    drag &amp; drop your .xlsx file here
                  </FileUpload.HelperText>
                </FileUpload.DropZone>
              </FileUpload>
            </div>
            <p style={{ fontSize: 11, color: '#9ca3af', fontFamily: INTER, margin: 0 }}>
              FloQast uses period-end rates for all currency conversions. .xlsx only
            </p>
          </div>
        ) : !isAdmin ? (
          /* Non-admin read-only note */
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', background: '#f8fafc',
            border: '1px solid #e1e6ef', borderRadius: 8,
          }}>
            <span className="material-icons-outlined" style={{ fontSize: 18, color: '#9ca3af', flexShrink: 0 }}>lock</span>
            <p style={{ fontSize: 12, color: '#6b7280', fontFamily: INTER, margin: 0, lineHeight: '18px' }}>
              Managed by admin - contact your admin to update rates.
            </p>
          </div>
        ) : null /* Admin viewing a past period - historical record, no upload UI */}

      </div>
    </div>
  )
}
