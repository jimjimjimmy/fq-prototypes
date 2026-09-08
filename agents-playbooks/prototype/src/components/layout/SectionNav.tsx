import { useState } from 'react'

const GRADIENT = 'linear-gradient(180deg, #014a3d 0%, #00332a 100%)'
const BORDER = '#1d583f'

type NavItem = { id: string; label: string }
type NavSection = { id: string; label: string | null; items: NavItem[] }

const navSections: NavSection[] = [
  {
    id: 'main',
    label: null,
    items: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'agents',    label: 'Agents' },
    ],
  },
  {
    id: 'library',
    label: 'Library',
    items: [
      { id: 'templates', label: 'Templates' },
      { id: 'shared',    label: 'Shared' },
    ],
  },
]

const wiredItems = new Set(['agents'])
const activeItem = 'agents'

function NavItemButton({ item }: { item: NavItem }) {
  const [hovered, setHovered] = useState(false)
  const isActive = item.id === activeItem
  const isWired = wiredItems.has(item.id)

  const bg = isActive
    ? 'rgba(2, 121, 101, 0.55)'
    : hovered && isWired
    ? 'rgba(2, 121, 101, 0.4)'
    : 'transparent'

  return (
    <button
      disabled={!isWired}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', textAlign: 'left',
        padding: '6px 8px', borderRadius: 6,
        fontSize: 14, lineHeight: '18px', letterSpacing: '-0.12px',
        color: '#f3faf4', background: bg, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        fontWeight: isActive ? 500 : 400,
        opacity: isWired ? 1 : 0.5,
        cursor: isWired ? 'pointer' : 'default',
        transition: 'background 0.15s',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <span>{item.label}</span>
    </button>
  )
}

export function SectionNav() {
  return (
    <nav style={{
      width: 160, height: '100vh', flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      background: GRADIENT, borderRight: `1px solid ${BORDER}`,
    }}>
      <div style={{
        padding: '16px', borderBottom: `1px solid ${BORDER}`,
      }}>
        <h2 style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '1px',
          textTransform: 'uppercase', color: '#769583',
          margin: 0, fontFamily: 'Inter, sans-serif',
        }}>
          Transform
        </h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 12, paddingBottom: 12 }}>
        {navSections.map((section) => (
          <div key={section.id} style={{ padding: '0 8px', marginBottom: 16 }}>
            {section.label && (
              <div style={{
                padding: '6px 8px',
                fontSize: 11, fontWeight: 700, letterSpacing: '1px',
                textTransform: 'uppercase', color: '#769583',
                fontFamily: 'Inter, sans-serif',
              }}>
                {section.label}
              </div>
            )}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {section.items.map((item) => (
                <li key={item.id}>
                  <NavItemButton item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
