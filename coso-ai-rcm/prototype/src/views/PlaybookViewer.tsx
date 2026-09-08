import { COUPA_PLAYBOOK_CONTENT } from '../data/playbookContent'

interface PlaybookViewerProps {
  onBack: () => void
}

const TOC_SECTIONS = [
  '1. Role and Objective',
  '2. Required Input Data',
  '2.1 Sample PO Input',
  '3. Core Processing Logic',
  '3.1 Date Handling',
  '3.2 Proration Example',
  '3.3 Invoice Matching',
  '3.4 Matching Output',
  '4. Output & JE Format',
  '4.1 Sample JE',
  '5. Validation',
  '6. Exception Handling',
  '7. Approval & Posting',
  '8. Period-End Checklist',
]

const PERMISSIONS = [
  { name: 'Sarah Chen', initials: 'SC', color: '#1FAC76', role: 'Owner' },
  { name: 'Steven James', initials: 'SJ', color: '#3B5BDB', role: 'Edit' },
  { name: 'Maria Kim', initials: 'MK', color: '#E5534B', role: 'View' },
]

export function PlaybookViewer({ onBack }: PlaybookViewerProps) {
  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
      {/* Sub-header */}
      <div
        style={{
          height: 50,
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderBottom: '1px solid #E4E9F2',
          padding: '0 24px',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'transparent',
            border: 'none',
            fontSize: 13,
            color: '#6B7A99',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          ← Back
        </button>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#1D2433' }}>
          Coupa PO Accrual Agent
        </span>

        {/* Version & action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={iconBtnStyle} title="Schedule">🕐</button>
          <button style={{ ...iconBtnStyle, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12 }}>◈</span>
            <span style={{ fontSize: 12, fontWeight: 500 }}>V1</span>
          </button>
          <button style={secondaryBtnStyle}>Test</button>
          <button
            style={{
              padding: '6px 16px',
              borderRadius: 6,
              border: 'none',
              background: '#1FAC76',
              color: '#fff',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Run Agent
          </button>
        </div>
      </div>

      {/* Three-column layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* TOC sidebar */}
        <aside
          style={{
            width: 200,
            background: '#fff',
            borderRight: '1px solid #E4E9F2',
            overflow: 'auto',
            padding: '16px 0',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 16px 12px',
              color: '#6B7A99',
              fontSize: 13,
              borderBottom: '1px solid #E4E9F2',
              marginBottom: 12,
            }}
          >
            ☰ Playbook
          </div>
          <div
            style={{
              fontSize: 10,
              color: '#8896B0',
              fontWeight: 600,
              padding: '0 16px 6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            CONTENT
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {TOC_SECTIONS.map((section) => (
              <a
                key={section}
                href="#"
                style={{
                  fontSize: 12,
                  color: section === '1. Role and Objective' ? '#1FAC76' : '#4A556A',
                  textDecoration: 'none',
                  padding: '4px 16px 4px 20px',
                  borderLeft: section === '1. Role and Objective' ? '2px solid #1FAC76' : '2px solid transparent',
                  lineHeight: '18px',
                  fontWeight: section === '1. Role and Objective' ? 500 : 400,
                }}
              >
                {section}
              </a>
            ))}
          </nav>
        </aside>

        {/* Document body */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px 32px',
            background: '#fff',
            position: 'relative',
          }}
        >
          {/* History / edit icons */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 32,
              display: 'flex',
              gap: 8,
              color: '#8896B0',
              fontSize: 16,
            }}
          >
            <button style={ghostIconBtn}>🕐</button>
            <button style={ghostIconBtn}>✏</button>
          </div>

          <div
            className="playbook-content"
            dangerouslySetInnerHTML={{ __html: COUPA_PLAYBOOK_CONTENT }}
            style={{
              fontSize: 13,
              lineHeight: '20px',
              color: '#1D2433',
              maxWidth: 740,
            }}
          />
        </div>

        {/* Properties panel */}
        <aside
          style={{
            width: 240,
            background: '#FAFBFD',
            borderLeft: '1px solid #E4E9F2',
            overflow: 'auto',
            padding: '16px',
            flexShrink: 0,
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1D2433', margin: '0 0 16px' }}>
            Properties
          </h3>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E4E9F2', marginBottom: 16 }}>
            {['Summary', 'Files', 'Activity'].map((tab) => (
              <button
                key={tab}
                style={{
                  padding: '6px 12px 8px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 12,
                  fontWeight: tab === 'Summary' ? 600 : 400,
                  color: tab === 'Summary' ? '#1D2433' : '#8896B0',
                  borderBottom: tab === 'Summary' ? '2px solid #1D2433' : '2px solid transparent',
                  cursor: 'pointer',
                  marginBottom: -1,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Summary content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PropRow label="Owner" value="Sarah Chen" />
            <PropRow label="Folder" value="Accruals / AP" bold />
            <PropRow label="Last Run" value="Mar 25, 2026" />
            <div>
              <span style={{ fontSize: 11, color: '#8896B0', display: 'block', marginBottom: 2 }}>Run Log</span>
              <a href="#" style={{ fontSize: 12, color: '#1FAC76', textDecoration: 'none', fontWeight: 500 }}>
                47 Runs • 96% Success
              </a>
            </div>
          </div>

          <Divider />

          {/* Workflows */}
          <div>
            <p style={{ fontSize: 12, color: '#6B7A99', margin: '0 0 4px' }}>
              Description: Use workflows for when you need...
            </p>
            <WorkflowRow name="Coupa Accrual America" />
            <WorkflowRow name="Coupa Accrual Asia" />
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: 'none',
                fontSize: 12,
                color: '#6B7A99',
                cursor: 'pointer',
                padding: '6px 0',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              + Create Workflow
            </button>
          </div>

          <Divider />

          {/* Permissions */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#1D2433' }}>Permissions</span>
              <button style={{ ...secondaryBtnStyle, fontSize: 11, padding: '3px 8px' }}>
                Manage
              </button>
            </div>
            {PERMISSIONS.map((p) => (
              <div
                key={p.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Avatar initials={p.initials} color={p.color} />
                <span style={{ flex: 1, fontSize: 12, color: '#1D2433' }}>{p.name}</span>
                <span style={{ fontSize: 11, color: '#6B7A99' }}>{p.role}</span>
              </div>
            ))}
            <a href="#" style={{ fontSize: 11, color: '#6B7A99', textDecoration: 'none' }}>
              + 4 more users • <span style={{ color: '#1FAC76' }}>View all permissions</span>
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}

function PropRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div>
      <span style={{ fontSize: 11, color: '#8896B0', display: 'block', marginBottom: 2 }}>{label}</span>
      <span style={{ fontSize: 12, color: '#1D2433', fontWeight: bold ? 600 : 400 }}>{value}</span>
    </div>
  )
}

function WorkflowRow({ name }: { name: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 8px',
        border: '1px solid #E4E9F2',
        borderRadius: 4,
        marginBottom: 6,
        background: '#fff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12, color: '#9B59B6' }}>◈</span>
        <span style={{ fontSize: 12, color: '#1D2433' }}>{name}</span>
      </div>
      <span style={{ fontSize: 12, color: '#8896B0' }}>↗</span>
    </div>
  )
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9,
        fontWeight: 600,
        color: '#fff',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: '#E4E9F2', margin: '14px 0' }} />
}

const iconBtnStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 6,
  border: '1px solid #D0D9E8',
  background: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  color: '#6B7A99',
}

const secondaryBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid #D0D9E8',
  background: '#fff',
  fontSize: 13,
  color: '#4A556A',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
}

const ghostIconBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#8896B0',
  fontSize: 16,
  padding: 0,
  lineHeight: 1,
}
