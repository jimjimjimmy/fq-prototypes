import { useState } from 'react'
import { Home, ListChecks, FolderOpen, ShieldCheck, Sparkles, FileCheck, Eye, BookOpen, Award, Bell, Settings } from 'lucide-react'

const GRADIENT = 'linear-gradient(180deg, #014a3d 0%, #00332a 100%)'
const BORDER = '#1d583f'

interface GlobalNavProps {
  onComplianceClick?: () => void
  onAgentsClick?: () => void
  activePrototype?: 'agents' | 'compliance'
}

function NavButton({
  icon: Icon,
  label,
  active,
  interactive,
  onClick,
}: {
  icon: React.ElementType
  label: string
  active?: boolean
  interactive?: boolean
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const bg = active
    ? 'rgba(2, 121, 101, 0.55)'
    : hovered && interactive
    ? 'rgba(2, 121, 101, 0.4)'
    : 'transparent'
  return (
    <button
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 36, height: 36, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: bg, border: 'none', color: '#f3faf4',
        cursor: interactive ? 'pointer' : 'default',
        opacity: interactive ? 1 : 0.4,
        transition: 'background 0.15s', flexShrink: 0,
      }}
    >
      <Icon size={18} strokeWidth={1.75} />
    </button>
  )
}

export function GlobalNav({ onComplianceClick, onAgentsClick, activePrototype = 'agents' }: GlobalNavProps) {
  const items = [
    { id: 'home',           icon: Home,         label: 'Home',           onClick: undefined as (() => void) | undefined },
    { id: 'tasks',          icon: ListChecks,   label: 'Tasks',          onClick: undefined },
    { id: 'docs',           icon: FolderOpen,   label: 'Documents',      onClick: undefined },
    { id: 'compliance',     icon: ShieldCheck,  label: 'Compliance',     onClick: onComplianceClick },
    { id: 'agents',         icon: Sparkles,     label: 'Agents',         onClick: onAgentsClick },
    { id: 'tests',          icon: FileCheck,    label: 'Tests',          onClick: undefined },
    { id: 'review',         icon: Eye,          label: 'Review',         onClick: undefined },
    { id: 'frameworks',     icon: BookOpen,     label: 'Frameworks',     onClick: undefined },
    { id: 'certifications', icon: Award,        label: 'Certifications', onClick: undefined },
  ]

  return (
    <nav style={{
      width: 60, height: '100vh', flexShrink: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingTop: 16, paddingBottom: 16,
      background: GRADIENT, borderRight: `1px solid ${BORDER}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, background: '#0c1e18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, flexShrink: 0,
      }}>
        <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: '-0.025em', color: '#90E39A' }}>FQ</span>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map(({ id, icon, label, onClick }) => {
          const active =
            id === 'compliance' ? activePrototype === 'compliance' :
            id === 'agents'     ? activePrototype === 'agents'     : false
          const interactive = id === 'compliance' || id === 'agents'
          return (
            <li key={id}>
              <NavButton icon={icon} label={label} active={active} interactive={interactive} onClick={onClick} />
            </li>
          )
        })}
      </ul>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <li><NavButton icon={Bell}     label="Notifications" interactive /></li>
        <li><NavButton icon={Settings} label="Settings"      interactive /></li>
      </ul>
    </nav>
  )
}
