import { useState } from 'react'
import { ChevronDown, ChevronRight, ChevronLeft, Plus, Table2, MoreVertical } from 'lucide-react'
import TableStatusBadge from '@floqastinc/flow-ui_core/TableStatusBadge'

// Admin Settings → Financial Data Model inner sidebar.
// All sections collapsed by default except Dimension Grouping.
// Visual styling per FDM Autosave Figma (rows are 45px tall, padded, indents step
// at 16 / 38 / 60 px per depth, label color #424867).
export function InnerSidebar() {
  const [netsuiteOpen, setNetsuiteOpen] = useState(false)
  const [erpDataOpen, setErpDataOpen] = useState(false)
  const [floqastDataOpen, setFloqastDataOpen] = useState(false)
  const [groupingOpen, setGroupingOpen] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-[#e1e6ef] shrink-0 overflow-visible transition-all ${
        collapsed ? 'w-0' : 'w-[260px]'
      }`}
    >
      {/* Floating circle toggle button — Detect pattern */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute top-6 -right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#e1e6ef] bg-white text-[#6b7280] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:bg-[#f8fafc] hover:text-[#1d2433] transition-colors"
      >
        {collapsed ? (
          <ChevronRight size={16} strokeWidth={2} />
        ) : (
          <ChevronLeft size={16} strokeWidth={2} />
        )}
      </button>

      {/* Nav content — hidden when collapsed */}
      {!collapsed && (
        <nav className="flex-1 overflow-auto pl-[8px] pr-[16px] py-[24px] flex flex-col gap-[4px]">
          {/* ERP Connections */}
          <SidebarRow
            label="ERP Connections"
            indent={16}
          />
          <SidebarRow
                label="NetSuite"
                indent={16}
                open={netsuiteOpen}
                onToggle={() => setNetsuiteOpen(!netsuiteOpen)}
                hasChildren
              />
              {netsuiteOpen && (
                <>
                  <SidebarRow
                    label="ERP Data"
                    indent={38}
                    open={erpDataOpen}
                    onToggle={() => setErpDataOpen(!erpDataOpen)}
                    hasChildren
                  />
                  {erpDataOpen && (
                    <>
                      <SidebarRow label="Account" indent={60} icon={<Table2 size={14} />} />
                      <SidebarRow label="Department" indent={60} icon={<Table2 size={14} />} />
                      <SidebarRow label="Location" indent={60} icon={<Table2 size={14} />} />
                      <SidebarRow label="Category" indent={60} icon={<Table2 size={14} />} />
                    </>
                  )}
                  <SidebarRow
                    label="FloQast Data"
                    indent={38}
                    open={floqastDataOpen}
                    onToggle={() => setFloqastDataOpen(!floqastDataOpen)}
                    hasChildren
                  />
                  {floqastDataOpen && (
                    <>
                      <SidebarRow label="Account 1" indent={60} icon={<Table2 size={14} />} />
                      <SidebarRow label="Account 2" indent={60} icon={<Table2 size={14} />} />
                      <SidebarRow label="Department" indent={60} icon={<Table2 size={14} />} />
                      <SidebarRow label="Location" indent={60} icon={<Table2 size={14} />} />
                      <SidebarRow label="Category" indent={60} icon={<Table2 size={14} />} />
                    </>
                  )}
                </>
              )}

          {/* Divider */}
          <div className="my-[8px] h-px bg-[#e1e6ef]" />

          {/* Dimension Grouping */}
          <SidebarRow
            label="Dimension Grouping"
            indent={16}
            open={groupingOpen}
            onToggle={() => setGroupingOpen(!groupingOpen)}
            hasChildren
          />
          {groupingOpen && (
            <>
              <SidebarRow
                label="Financial Statement"
                indent={44}
                active
                badge="Draft"
                hasMenu
              />
              <SidebarRow label="Create" indent={44} icon={<Plus size={14} />} muted />
            </>
          )}
        </nav>
      )}
    </aside>
  )
}

interface SidebarRowProps {
  label: string
  indent: number
  open?: boolean
  onToggle?: () => void
  hasChildren?: boolean
  icon?: React.ReactNode
  active?: boolean
  badge?: string
  hasMenu?: boolean
  muted?: boolean
}

function SidebarRow({
  label,
  indent,
  open,
  onToggle,
  hasChildren,
  icon,
  active,
  badge,
  hasMenu,
  muted,
}: SidebarRowProps) {
  const interactive = hasChildren || !muted

  return (
    <div
      onClick={hasChildren ? onToggle : undefined}
      className={`relative flex items-center h-[36px] gap-[8px] pr-[16px] text-[12px] leading-[18px] ${
        active
          ? 'bg-[#f1f3f9] text-[#424867] font-semibold'
          : muted
          ? 'text-[#6b7280] hover:bg-[#f1f3f9]'
          : 'text-[#424867] hover:bg-[#f1f3f9]'
      } ${interactive ? 'cursor-pointer' : ''} rounded`}
      style={{ paddingLeft: indent, fontWeight: active ? 600 : 600 }}
    >

      {hasChildren && (
        open ? (
          <ChevronDown size={14} className="text-[#6b7280] shrink-0" />
        ) : (
          <ChevronRight size={14} className="text-[#6b7280] shrink-0" />
        )
      )}

      {icon && <span className="text-[#6b7280] shrink-0">{icon}</span>}

      <span className="flex-1 truncate">{label}</span>

      {badge && (
        <span className="shrink-0">
          <TableStatusBadge color="default" size="xs" hasIcon={false}>{badge}</TableStatusBadge>
        </span>
      )}

      {hasMenu && (
        <button
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded text-[#adb2bb] hover:text-[#424867] hover:bg-[#e1e6ef]"
          title="More actions"
        >
          <MoreVertical size={14} />
        </button>
      )}
    </div>
  )
}
