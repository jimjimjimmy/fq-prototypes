import { GlobalNavSidebar } from './GlobalNavSidebar'

const MUSEO = "'Museo Sans', 'Inter', sans-serif"

const CLOSE_TABS = [
  'Dashboard',
  'Folders',
  'Checklist',
  'Reconciliations',
  'Notes',
  'Journal Entries',
  'Flux Analysis',
]

interface ShellProps {
  mcMode: boolean
  onMcModeChange: (v: boolean) => void
  children: React.ReactNode
}

export function Shell({ mcMode, onMcModeChange, children }: ShellProps) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Global nav sidebar (56px) */}
      <GlobalNavSidebar activeApp="close" avatarFallback="BE" />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Close sub-nav */}
        <div className="bg-white border-b border-[#e1e6ef] flex items-center pl-[24px] h-[48px] shrink-0">
          <div className="flex items-center h-full shrink-0">
            <div className="flex items-center gap-[12px] h-[29.77px]">
              <CloseAppIcon />
              <p
                className="text-[16px] leading-[20px] text-[#1d2433] text-center whitespace-nowrap"
                style={{ fontFamily: MUSEO, fontWeight: 700 }}
              >
                Close
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-center h-full min-w-0 px-[24px]">
            <div className="flex items-center gap-[24px] h-full">
              {CLOSE_TABS.map((tab) => {
                const isActive = tab === 'Reconciliations'
                return (
                  <div key={tab} className="flex items-center h-full shrink-0">
                    <button
                      className="flex items-center justify-center h-full py-[8px] gap-[8px] cursor-pointer whitespace-nowrap"
                      style={{
                        fontFamily: MUSEO,
                        fontWeight: 700,
                        borderBottom: isActive ? '2px solid #186749' : '2px solid transparent',
                      }}
                    >
                      <p
                        className={`text-[12px] leading-[18px] tracking-[-0.12px] text-center whitespace-nowrap ${
                          isActive ? 'text-[#1d2433]' : 'text-[#424867]'
                        }`}
                      >
                        {tab}
                      </p>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Entity & period selectors */}
        <div className="bg-white px-[24px] pt-[16px] pb-[16px] border-b border-[#e1e6ef] flex items-center gap-[12px]">
          <SelectButton label="All Entities" icon={<CalendarIcon />} />
          <SelectButton label="By Period" icon={<CalendarIcon />} />
          <SelectButton label="March 2025" icon={<CalendarIcon />} />
        </div>

        {/* Page header */}
        <div className="bg-white px-[24px] pt-[20px] pb-[16px]">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col items-start shrink-0">
              <p
                className="text-[24px] leading-[32px] text-black whitespace-nowrap"
                style={{ fontFamily: MUSEO, fontWeight: 700 }}
              >
                Reconciliations
              </p>
              <div className="h-[24px] flex flex-col items-start justify-center">
                <p
                  className="text-[12px] leading-[16px] text-[#adb2bb] capitalize whitespace-nowrap"
                  style={{ fontFamily: MUSEO, fontWeight: 700 }}
                >
                  1/100
                </p>
              </div>
            </div>

            {/* Toolbar buttons */}
            <div className="flex items-center gap-[12px]">
              <HeaderButton icon={<FilterIcon />} label="Filter" />
              <HeaderButton icon={<RefreshIcon />} label="Refresh" hasChevron />

              {/* Standard | Multi Currency segmented toggle */}
              <div
                className="flex items-center h-[40px] border-[1.4px] border-[#cbd2e1] rounded-[6px] overflow-hidden shrink-0"
                style={{ fontFamily: MUSEO, fontWeight: 700 }}
              >
                <button
                  onClick={() => onMcModeChange(false)}
                  className={`flex items-center justify-center h-full px-[12px] text-[12px] leading-[18px] tracking-[-0.12px] whitespace-nowrap cursor-pointer ${
                    !mcMode ? 'bg-[#f0f5ff] text-[#1d2433]' : 'bg-white text-[#6b7280] hover:bg-[#f8fafc]'
                  }`}
                >
                  Standard
                </button>
                <div className="w-px h-full bg-[#cbd2e1]" />
                <button
                  onClick={() => onMcModeChange(true)}
                  className={`flex items-center justify-center h-full px-[12px] text-[12px] leading-[18px] tracking-[-0.12px] whitespace-nowrap cursor-pointer ${
                    mcMode ? 'bg-[#f0f5ff] text-[#1d2433]' : 'bg-white text-[#6b7280] hover:bg-[#f8fafc]'
                  }`}
                >
                  Multi Currency
                </button>
              </div>

              <HeaderButton icon={<CollapseIcon />} label="Collapse All" />
              <HeaderButton icon={<RefreshIcon />} label="Completeness" hasChevron />

              {/* Add button */}
              <button
                className="flex items-center justify-center gap-[8px] h-[40px] bg-[#1fac76] rounded-[6px] px-[12px] overflow-hidden hover:bg-[#17935f]"
                style={{ fontFamily: MUSEO, fontWeight: 700 }}
              >
                <span className="text-[12px] leading-[18px] text-white text-center tracking-[-0.12px] whitespace-nowrap">
                  Add
                </span>
                <ChevronDownIcon color="white" />
              </button>

              {/* More (kebab) */}
              <button
                className="flex items-center justify-center size-[40px] rounded-[50px] shrink-0 hover:bg-[#f1f3f9]"
              >
                <MoreVertIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Table / main content */}
        <div className="flex-1 px-[24px] pb-[24px] min-h-0">
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Close app icon ─────────────────────────────────────────────

function CloseAppIcon() {
  return (
    <svg width={24} height={18} style={{ display: 'block', flexShrink: 0 }} viewBox="0 0 19.9682 20.8142" fill="none">
      <path d="M19.9682 12.5031V12.4947L9.98409 4.18359L0 12.4947V12.5031L9.98409 20.8142L19.9682 12.5031Z" fill="url(#cnav-g1)"/>
      <path d="M19.9682 8.31951V8.31112L9.98409 0L0 8.31112V8.31951L9.98409 16.6306L19.9682 8.31951Z" fill="url(#cnav-g2)"/>
      <path d="M16.3998 2.80273L9.09498 8.95818L6.5063 6.85841L4.92383 8.20574L9.09498 11.6209L17.9708 4.143V4.11193L16.3998 2.80273Z" fill="#224030"/>
      <defs>
        <linearGradient id="cnav-g1" x1="4.98995" y1="17.4931" x2="14.9782" y2="7.50476" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4B834C"/><stop offset="0.999814" stopColor="#A8D6AC"/>
        </linearGradient>
        <linearGradient id="cnav-g2" x1="4.98995" y1="13.3095" x2="14.9782" y2="3.32117" gradientUnits="userSpaceOnUse">
          <stop offset="0.000186" stopColor="#A8D6AC"/><stop offset="1" stopColor="#4B834C"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── Toolbar components ─────────────────────────────────────────

function SelectButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      className="flex items-center gap-[8px] h-[36px] border border-[#cbd2e1] rounded-[6px] px-[12px] bg-white hover:bg-[#f8fafc] text-[12px] text-[#424867] whitespace-nowrap"
      style={{ fontFamily: MUSEO, fontWeight: 700 }}
    >
      {icon}
      {label}
      <ChevronDownIcon color="#6b7280" />
    </button>
  )
}

function HeaderButton({ icon, label, hasChevron }: { icon: React.ReactNode; label: string; hasChevron?: boolean }) {
  return (
    <button
      className="flex items-center justify-center gap-[8px] h-[40px] border-[1.4px] border-[#cbd2e1] rounded-[6px] px-[12px] bg-white hover:bg-[#f8fafc] shrink-0"
      style={{ fontFamily: MUSEO, fontWeight: 700 }}
    >
      {icon}
      <span className="text-[12px] leading-[18px] text-[#6b7280] text-center tracking-[-0.12px] whitespace-nowrap">
        {label}
      </span>
      {hasChevron && <ChevronDownIcon color="#6b7280" />}
    </button>
  )
}

// ── SVG Icons ──────────────────────────────────────────────────

function FilterIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" fill="#6b7280" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="#6b7280" />
    </svg>
  )
}

function CollapseIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" stroke="#6b7280" strokeWidth="1.5" />
      <line x1="4" y1="9.5" x2="20" y2="9.5" stroke="#6b7280" strokeWidth="1.5" />
      <line x1="4" y1="14.5" x2="20" y2="14.5" stroke="#6b7280" strokeWidth="1.5" />
    </svg>
  )
}

function ChevronDownIcon({ color = '#6b7280' }: { color?: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill={color} />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" fill="#6b7280" />
    </svg>
  )
}

function MoreVertIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <circle cx="12" cy="5" r="2" fill="#6b7280" />
      <circle cx="12" cy="12" r="2" fill="#6b7280" />
      <circle cx="12" cy="19" r="2" fill="#6b7280" />
    </svg>
  )
}
