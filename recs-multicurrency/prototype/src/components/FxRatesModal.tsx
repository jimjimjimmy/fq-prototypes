import { useState } from 'react'

const INTER = 'Inter, sans-serif'
const MUSEO = "'Museo Sans', sans-serif"

// FlowUI button styles using CSS tokens loaded by Theme.apply()
const fqBtnPrimary: React.CSSProperties = {
  height: 36, padding: '0 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
  background: 'var(--flo-cmp-color-bg-button-filled-primary, #1fac76)',
  color: 'var(--flo-cmp-color-text-button-filled, #fff)',
  fontFamily: MUSEO, fontWeight: 700, fontSize: 13, flexShrink: 0,
}
const fqBtnBlue: React.CSSProperties = {
  height: 36, padding: '0 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
  background: '#3d7bf7', color: '#fff',
  fontFamily: MUSEO, fontWeight: 700, fontSize: 13, flexShrink: 0,
}
const fqBtnGhost: React.CSSProperties = {
  height: 36, padding: '0 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
  background: 'transparent',
  color: 'var(--flo-sem-color-content-secondary, #6b7280)',
  fontFamily: MUSEO, fontWeight: 700, fontSize: 13,
}

// Only the pairs relevant to the demo: JPY (local) <-> MXN (functional) <-> USD (reporting)
const DEMO_RATES = [
  { from: 'JPY', to: 'MXN', rate: '0.0067' },
  { from: 'MXN', to: 'JPY', rate: '150.00' },
  { from: 'MXN', to: 'USD', rate: '0.0583' },
  { from: 'USD', to: 'MXN', rate: '17.1500' },
]

interface FxRatesModalProps {
  open: boolean
  onClose: () => void
  period?: string
  uploadedAt?: string
  uploadedBy?: string
  hasUploadedRates?: boolean
  onUpload?: () => void
  /** Toggle to demo admin vs. non-admin experience. Admins see upload controls; non-admins see rates read-only. */
  isAdmin?: boolean
}

export function FxRatesModal({
  open,
  onClose,
  period = 'October 2025',
  uploadedAt = 'Nov 1, 2025',
  uploadedBy = 'Sean Bean',
  hasUploadedRates = false,
  onUpload,
  isAdmin = true,
}: FxRatesModalProps) {
  const [uploading, setUploading] = useState(false)

  function handleUpload() {
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      onUpload?.()
    }, 900)
  }

  if (!open) return null

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999 }} />

      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 560, maxHeight: '85vh',
          background: 'white', borderRadius: 8,
          boxShadow: '0px 20px 50px -8px rgba(0,0,0,0.18), 0px 0px 0px 1px rgba(0,0,0,0.04)',
          zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #e1e6ef', flexShrink: 0 }}>
          <h2 style={{ flex: 1, margin: 0, fontFamily: MUSEO, fontWeight: 700, fontSize: 16, lineHeight: '20px', color: '#1d2433' }}>
            FX Rates
          </h2>
          <button onClick={onClose} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }} className="hover:bg-[#f3f4f6]">
            <span className="material-icons-outlined" style={{ fontSize: 20, color: '#6b7280' }}>close</span>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Period-end disclaimer - always visible */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: '#f8fafc', border: '1px solid #e1e6ef', borderRadius: 6 }}>
            <span className="material-icons-outlined" style={{ fontSize: 16, color: '#9ca3af', flexShrink: 0, marginTop: 1 }}>info</span>
            <p style={{ fontSize: 11, lineHeight: '16px', color: '#6b7280', margin: 0, fontFamily: INTER }}>
              FloQast only supports period-end rates. All currency conversions use the rate as of the last day of the selected period.
            </p>
          </div>

          {hasUploadedRates ? (
            <>
              {/* Rates table */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1d2433', margin: '0 0 2px', fontFamily: MUSEO }}>
                      {period}
                    </h3>
                    <span style={{ fontSize: 11, color: '#6b7280', fontFamily: INTER }}>
                      Last updated {uploadedAt} by {uploadedBy} - via CSV upload
                    </span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: '#1c895f',
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    borderRadius: 4, padding: '2px 8px', whiteSpace: 'nowrap',
                    fontFamily: INTER,
                  }}>
                    Active
                  </span>
                </div>
                <div style={{ border: '1px solid #e1e6ef', borderRadius: 6, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: INTER }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e1e6ef' }}>
                        <th style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6b7280', padding: '8px 16px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>From</th>
                        <th style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6b7280', padding: '8px 16px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>To</th>
                        <th style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: '#6b7280', padding: '8px 16px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Period-End Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_RATES.map((r, i) => (
                        <tr key={`${r.from}-${r.to}`} style={{ borderBottom: i === DEMO_RATES.length - 1 ? undefined : '1px solid #eef0f4' }}>
                          <td style={{ fontSize: 12, color: '#1d2433', padding: '10px 16px', fontWeight: 500 }}>{r.from}</td>
                          <td style={{ fontSize: 12, color: '#1d2433', padding: '10px 16px', fontWeight: 500 }}>{r.to}</td>
                          <td style={{ fontSize: 12, color: '#1d2433', padding: '10px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '8px 0 0', fontFamily: INTER }}>
                  Inverse rates auto-calculated by FloQast. Period end: Oct 31, 2025.
                </p>
              </div>

              {/* Replace upload - admin only */}
              {isAdmin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h3 style={{ fontSize: 12, fontWeight: 600, color: '#1d2433', margin: 0, fontFamily: MUSEO }}>Replace rates</h3>
                  <div style={{ border: '1px dashed #e1e6ef', borderRadius: 6, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, background: '#f8fafc' }}>
                    <button onClick={handleUpload} disabled={uploading} style={{ ...fqBtnBlue, opacity: uploading ? 0.7 : 1 }}>
                      {uploading ? 'Uploading...' : 'Browse File'}
                    </button>
                    <span style={{ fontSize: 12, color: '#6b7280', fontFamily: INTER }}>Or drag & drop your CSV file here</span>
                  </div>
                </div>
              )}
            </>
          ) : isAdmin ? (
            // Admin - no rates yet: show upload card
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 12, lineHeight: '18px', color: '#6b7280', margin: 0, fontFamily: INTER }}>
                Upload a CSV with period-end exchange rates for <strong style={{ color: '#1d2433' }}>{period}</strong>. FloQast auto-calculates the inverse rate for each pair.
              </p>
              <div style={{
                border: '1.5px dashed #3d7bf7', borderRadius: 8,
                minHeight: 140, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 10,
                background: '#f8fafc', padding: 24,
              }}>
                {uploading ? (
                  <>
                    <span className="material-icons-outlined animate-spin" style={{ fontSize: 28, color: '#3d7bf7' }}>autorenew</span>
                    <span style={{ fontSize: 12, color: '#6b7280', fontFamily: INTER }}>Uploading rates...</span>
                  </>
                ) : (
                  <>
                    <button onClick={handleUpload} style={fqBtnPrimary}>
                      Upload FX Rates
                    </button>
                    <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: INTER }}>drag & drop your CSV file here</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            // Non-admin - no rates yet: read-only message
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '32px 24px', textAlign: 'center' }}>
              <span className="material-icons-outlined" style={{ fontSize: 32, color: '#cbd2e1' }}>currency_exchange</span>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1d2433', margin: 0, fontFamily: MUSEO }}>No rates uploaded for {period}</p>
              <p style={{ fontSize: 12, lineHeight: '18px', color: '#6b7280', margin: 0, fontFamily: INTER }}>
                Contact your administrator to upload FX rates for this period.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e1e6ef', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
          <button onClick={onClose} style={hasUploadedRates ? fqBtnPrimary : fqBtnGhost}>
            {hasUploadedRates ? 'Done' : 'Cancel'}
          </button>
        </div>
      </div>
    </>
  )
}
