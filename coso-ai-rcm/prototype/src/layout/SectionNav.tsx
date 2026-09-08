import { navSections } from '../data/nav'
import { gapsOpenCount } from '../data/gaps'
import type { ViewId } from '../App'

const openGapsTotal = gapsOpenCount()

// Visual tokens borrowed from the catalyst project sidebar
const GRADIENT = 'linear-gradient(180deg, #014a3d 0%, #00332a 100%)'
const BORDER = '#1d583f'

type Props = {
  currentView: ViewId
  onNavigate: (view: ViewId) => void
  newAgentCount: number
}

// Maps a nav item id to a prototype view (only a few are wired up so far)
const itemToView: Partial<Record<string, ViewId>> = {
  'ai-capabilities': 'ai-capabilities',
  'key-systems': 'key-systems',
  'tests': 'tests',
  'gaps': 'gaps',
}

const viewToItem: Record<ViewId, string> = {
  home: '',
  'key-systems': 'key-systems',
  'agent-details': 'key-systems',
  tests: 'tests',
  gaps: 'gaps',
  'ai-capabilities': 'ai-capabilities',
  'new-agent': 'key-systems',
  'playbook-viewer': 'key-systems',
}

export function SectionNav({ currentView, onNavigate, newAgentCount }: Props) {
  const activeItemId = viewToItem[currentView]

  function handleClick(itemId: string) {
    const view = itemToView[itemId]
    if (view) {
      onNavigate(view)
    }
  }

  return (
    <nav
      className="w-[240px] h-screen flex flex-col border-r"
      style={{ background: GRADIENT, borderColor: BORDER }}
    >
      <div className="px-4 py-4 border-b" style={{ borderColor: BORDER }}>
        <h2
          className="text-xs font-bold tracking-[1px] uppercase text-[#769583]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Compliance
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto py-3">
        {navSections.map((section) => (
          <div key={section.id} className="px-2 mb-4">
            <div
              className="px-2 py-1.5 text-[11px] font-bold tracking-[1px] uppercase text-[#769583]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {section.label}
            </div>
            <ul>
              {section.items.map((item) => {
                const isActive = item.id === activeItemId
                const isWired = !!itemToView[item.id]
                const newAgentBadge = item.id === 'key-systems' && newAgentCount > 0 ? newAgentCount : null
                const gapBadge = item.id === 'gaps' && openGapsTotal > 0 ? openGapsTotal : null
                const badgeCount = newAgentBadge ?? gapBadge
                const badgeBg = item.id === 'gaps' ? '#dc2626' : '#f59e0b'
                const badgeTitle = item.id === 'gaps'
                  ? `${openGapsTotal} open ${openGapsTotal === 1 ? 'gap' : 'gaps'} requiring remediation`
                  : `${newAgentCount} new ${newAgentCount === 1 ? 'agent' : 'agents'} from Transform`
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleClick(item.id)}
                      disabled={!isWired}
                      className={`w-full text-left px-2 py-1.5 rounded-[6px] text-[14px] leading-[18px] tracking-[-0.12px] transition-colors text-[#f3faf4] flex items-center justify-between gap-2 ${
                        isActive
                          ? 'bg-[#027965]/55 font-medium'
                          : isWired
                          ? 'hover:bg-[#027965]/40'
                          : 'opacity-50 cursor-default'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <span>{item.label}</span>
                      {badgeCount && (
                        <span
                          className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold text-white"
                          style={{ background: badgeBg }}
                          title={badgeTitle}
                        >
                          {badgeCount}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
