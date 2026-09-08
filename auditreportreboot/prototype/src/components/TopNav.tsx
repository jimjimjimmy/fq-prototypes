// FloQast Admin Settings top nav. Uses Museo Sans + the green underline
// active state pattern from FlowUI (matches Close app sub-nav).
const MUSEO = "'Museo Sans', sans-serif"

const TABS = [
  'Workflows',
  'Entities',
  'Team Members',
  'Roles',
  'Groups',
  'Checklist',
  'Reconciliations',
  'API Keys',
  'Reports',
  'AI',
  'Connections',
  'Financial Data Model',
  'File Upload',
] as const

export function TopNav() {
  return (
    <header className="bg-white border-b border-[#e1e6ef] shrink-0">
      <nav className="flex items-center px-[24px] h-[48px]">
        <span
          className="text-[16px] leading-[20px] text-[#1d2433] whitespace-nowrap shrink-0 pr-[12px]"
          style={{ fontFamily: MUSEO, fontWeight: 700 }}
        >
          Admin Settings
        </span>
        {TABS.map((tab) => {
          const active = tab === 'Reports'
          return (
            <button
              key={tab}
              className="flex items-center justify-center h-full px-[12px] cursor-pointer whitespace-nowrap"
              style={{
                fontFamily: MUSEO,
                fontWeight: 700,
                borderBottom: active ? '2px solid #186749' : '2px solid transparent',
              }}
            >
              <span
                className={`text-[12px] leading-[18px] tracking-[-0.12px] text-center whitespace-nowrap ${
                  active ? 'text-[#1d2433]' : 'text-[#424867]'
                }`}
              >
                {tab}
              </span>
            </button>
          )
        })}
      </nav>
    </header>
  )
}
