import type { SourceType } from '../../data/connections'

export function SourceBadge({ sourceType }: { sourceType: SourceType }) {
  const cfg: Record<SourceType, { bg: string; color: string; border: string }> = {
    'QBO Basic':          { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
    'QBO Enhanced':       { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
    'sFTP':               { bg: '#F9FAFB', color: '#4B5563', border: '#E5E7EB' },
    'API Connector':      { bg: '#ECFDF5', color: '#186749', border: '#A7F3D0' },
    'NetSuite Enhanced':  { bg: '#FFF7ED', color: '#C2410C', border: '#FDBA74' },
  }
  const c = cfg[sourceType]
  return (
    <span style={{ backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, whiteSpace: 'nowrap', lineHeight: 1 }}>
      {sourceType}
    </span>
  )
}

export function ErrorBanner({ type, message, actions }: {
  type: 'error' | 'warning'
  message: string
  actions: { label: string; primary?: boolean; link?: boolean }[]
}) {
  const isError = type === 'error'
  return (
    <div style={{ backgroundColor: isError ? '#FFF1F2' : '#FFFBEB', borderTop: `1px solid ${isError ? '#FECDD3' : '#FDE68A'}`, padding: '8px 16px 8px 52px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '12px', color: isError ? '#991B1B' : '#92400E', flex: 1, minWidth: '200px' }}>{message}</span>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
        {actions.map((action) =>
          action.link ? (
            <button key={action.label} style={{ fontSize: '12px', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
              {action.label}
            </button>
          ) : (
            <button key={action.label} style={{ fontSize: '12px', fontWeight: 600, backgroundColor: action.primary ? (isError ? '#DC2626' : '#D97706') : 'transparent', color: action.primary ? '#fff' : '#374151', border: action.primary ? 'none' : '1px solid #E5E7EB', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer' }}>
              {action.label}
            </button>
          )
        )}
      </div>
    </div>
  )
}
