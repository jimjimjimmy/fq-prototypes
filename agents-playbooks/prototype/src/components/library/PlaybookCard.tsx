import { FileText, Share2, Bot } from 'lucide-react'
import type { Playbook } from '../../data/mockData'

interface PlaybookCardProps {
  playbook: Playbook
  onOpen: (playbook: Playbook) => void
  onRun?: (playbook: Playbook) => void
}

export function PlaybookCard({ playbook, onOpen, onRun }: PlaybookCardProps) {
  const isLive = playbook.status === 'Live'

  return (
    <div
      onClick={() => onOpen(playbook)}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F2',
        borderRadius: 8,
        padding: 16,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'box-shadow 150ms, border-color 150ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
        e.currentTarget.style.borderColor = '#C2CDE0'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#E4E9F2'
      }}
    >
      {/* Type label + NEW badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {playbook.type === 'Workflow' ? (
          <Share2 size={12} strokeWidth={1.75} color="#8896B0" />
        ) : playbook.type === 'Agent' ? (
          <Bot size={12} strokeWidth={1.75} color="#8896B0" />
        ) : (
          <FileText size={12} strokeWidth={1.75} color="#8896B0" />
        )}
        <span style={{ fontSize: 11, fontWeight: 600, color: '#8896B0', letterSpacing: '0.04em' }}>
          {playbook.type.toUpperCase()}
        </span>
        {playbook.isNew && (
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            padding: '1px 6px',
            borderRadius: 3,
            background: '#F4A429',
            color: '#fff',
            letterSpacing: '0.04em',
          }}>
            NEW
          </span>
        )}
      </div>

      {/* Title + actions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1D2433', lineHeight: '20px', flex: 1 }}>
          {playbook.name}
        </span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
          {isLive && (
            <button
              onClick={(e) => { e.stopPropagation(); onRun?.(playbook) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 4,
                border: 'none',
                background: '#1FAC76',
                color: '#fff',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <span style={{ fontSize: 10 }}>▶</span> Run
            </button>
          )}
          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#6B7A99',
              fontSize: 18,
              padding: 0,
              lineHeight: 1,
            }}
          >
            ⋯
          </button>
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 12,
          color: '#4A556A',
          lineHeight: '18px',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {playbook.description}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusBadge status={playbook.status} />
          <span style={{ fontSize: 11, color: '#8896B0' }}>
            {isLive ? `Last run ${playbook.lastRun}` : `Last edit ${playbook.lastEdit}`}
          </span>
        </div>
        <AvatarStack owners={playbook.owners} />
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Playbook['status'] }) {
  const styles: Record<Playbook['status'], { bg: string; color: string }> = {
    Live: { bg: '#E6F9F1', color: '#1FAC76' },
    Draft: { bg: '#F3F4F6', color: '#6B7A99' },
    'Pending Approval': { bg: '#FEF3E2', color: '#B07D00' },
    'Approved': { bg: '#EBF4FF', color: '#1557A0' },
  }
  const { bg, color } = styles[status]
  return (
    <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 6px', borderRadius: 3, background: bg, color }}>
      {status}
    </span>
  )
}

function AvatarStack({ owners }: { owners: string[] }) {
  const COLORS = ['#1FAC76', '#3B5BDB', '#E5534B', '#F4A429']
  return (
    <div style={{ display: 'flex' }}>
      {owners.slice(0, 3).map((initials, i) => (
        <div
          key={initials}
          title={initials}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: COLORS[i % COLORS.length],
            border: '2px solid #fff',
            marginLeft: i === 0 ? 0 : -6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 600,
            color: '#fff',
          }}
        >
          {initials}
        </div>
      ))}
    </div>
  )
}
