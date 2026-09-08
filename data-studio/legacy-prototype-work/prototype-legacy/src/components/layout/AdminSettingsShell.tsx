import { Outlet } from 'react-router-dom'
import { Avatar } from '@floqastinc/flow-ui_core'
import {
  FqLogo,
  HomeIcon,
  TodoIcon,
  CloseIcon,
  ComplianceIcon,
  OpsIcon,
  ProjMgmtIcon,
  ReportingIcon,
  AiIcon,
  ReMindIcon,
  AcademyIcon,
  WorkspaceIcon,
  ExploreIcon,
  SettingsIcon,
} from './nav-icons'

/* ── Product app list ─────────────────────────────────────────── */

const PRODUCT_APPS = [
  { id: 'close', label: 'Close', icon: CloseIcon },
  { id: 'compliance', label: 'Compliance', icon: ComplianceIcon },
  { id: 'ops', label: 'Ops', icon: OpsIcon },
  { id: 'proj-mgmt', label: 'Proj Mgmt', icon: ProjMgmtIcon },
  { id: 'reporting', label: 'Reporting', icon: ReportingIcon },
  { id: 'ai', label: 'AI', icon: AiIcon },
  { id: 'remind', label: 'ReMind', icon: ReMindIcon },
  { id: 'academy', label: 'Academy', icon: AcademyIcon },
] as const

/* ── Admin Settings tab list ──────────────────────────────────── */

const SETTINGS_TABS = [
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
  'Data Studio',
]

/* ── Divider ──────────────────────────────────────────────────── */

function Divider() {
  return (
    <div className="flex items-center w-full py-[24px] max-h-[24px] shrink-0">
      <div className="bg-[#e1e6ef] h-px min-h-px min-w-px flex-[1_0_0]" />
    </div>
  )
}

/* ── Navigation / Side-Navbar ─────────────────────────────────── */

function GlobalNavSidebar() {
  return (
    <div className="w-[56px] bg-[#f8fafc] border-r border-solid border-[#e1e6ef] flex flex-col items-center pb-[24px] shrink-0 h-full shadow-[10px_0px_13px_-7px_rgba(0,0,0,0.04)]">
      {/* Top section: logo, home, todo, divider */}
      <div className="flex flex-col items-center relative shrink-0 w-full">
        <div className="flex h-[59px] w-[38px] items-center justify-center shrink-0 rounded-[6px]">
          <FqLogo />
        </div>
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer">
          <HomeIcon />
        </div>
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer">
          <TodoIcon />
        </div>
        <Divider />
      </div>

      {/* Middle section: product app icons */}
      <div className="flex flex-[1_0_0] flex-col items-center min-h-px min-w-px relative w-full">
        {PRODUCT_APPS.map((app) => (
          <div
            key={app.id}
            className="flex flex-col h-[45px] w-full items-center justify-center overflow-clip relative shrink-0 cursor-pointer"
          >
            <app.icon />
          </div>
        ))}
      </div>

      {/* Bottom section: workspace, divider, explore, settings, avatar */}
      <div className="flex flex-col items-center justify-end relative shrink-0 w-full">
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer overflow-clip">
          <div className="overflow-hidden rounded-[2px]">
            <WorkspaceIcon />
          </div>
        </div>
        <Divider />
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer">
          <ExploreIcon />
        </div>
        {/* Settings — active state with left border */}
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer bg-[#f1f3f9] border-l-[3px] border-solid border-[#adb2bb]">
          <SettingsIcon />
        </div>
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer">
          <Avatar fallback="BE" size="sm" />
        </div>
      </div>
    </div>
  )
}

/* ── Admin Settings Navbar (Single Line) ──────────────────────── */

function AdminSettingsNavbar() {
  return (
    <div className="bg-white border-b border-solid border-[#e1e6ef] flex items-center h-[60px] min-h-[60px] max-h-[60px] px-6 shrink-0">
      {/* Product header */}
      <div className="flex items-center h-full pr-3 shrink-0">
        <p
          className="text-[16px] text-[#1d2433] leading-5 whitespace-nowrap font-semibold"
          style={{ fontFamily: "'Museo Sans', sans-serif" }}
        >
          Admin Settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-1 h-full items-center min-w-0">
        {SETTINGS_TABS.map((tab) => {
          const isActive = tab === 'Data Studio'
          return (
            <div key={tab} className="flex items-center h-full px-3 shrink-0">
              <button
                className={`flex items-center justify-center h-full py-2 text-[12px] tracking-[-0.12px] leading-[18px] whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#1d2433] border-b-2 border-[#186749]'
                    : 'text-[#424867]'
                }`}
                style={{ fontFamily: "'Museo Sans', sans-serif", fontWeight: 600 }}
                disabled={!isActive}
              >
                {tab}
              </button>
            </div>
          )
        })}
      </div>

      {/* Fullscreen button */}
      <div className="flex items-center justify-center w-[26px] h-[26px] border border-[#cbd2e1] rounded-[6px] cursor-pointer hover:bg-[#f8fafc] shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#424867" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
        </svg>
      </div>
    </div>
  )
}

/* ── Main Shell ───────────────────────────────────────────────── */

export default function AdminSettingsShell() {
  return (
    <div className="flex h-screen">
      <GlobalNavSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminSettingsNavbar />

        <div className="flex-1 overflow-hidden bg-white flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
