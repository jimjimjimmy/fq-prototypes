/**
 * AG Grid cell renderers for the Users / Team Members admin table.
 *
 * Implements the canonical admin cell-renderer patterns from
 * knowledge/design-system/research/ag-grid-admin-settings/README.md:
 *   - UserIdentityCell  (avatar + name + secondary text)
 *   - CountLinkCell      (clickable count → related collection)
 *   - InlineSelectCell   (caret-affordanced value-from-set dropdown)
 *
 * Color tokens (from knowledge/design-system + Figma get_variable_defs on
 * node 2198:6632) are inlined with a naming comment so intent is auditable.
 */
import type { ICellRendererParams } from '@ag-grid-community/core'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Avatar from '@floqastinc/flow-ui_core/Avatar'
import type { User } from '../data/users'

/** A small downward chevron caret used by the inline dropdown cells. */
function Caret() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* #6b7280 = Colors/Neutral/color-neutral-500 (muted) */}
      <path d="M7 10l5 5 5-5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Shield glyph for the admin-permissions note. */
function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* #6b7280 muted */}
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="#6b7280" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

/** Name column — 32px avatar + name (semibold) + email (muted). */
export function UserIdentityCell(p: ICellRendererParams<User>) {
  if (!p.data) return null
  const u = p.data
  // FlowUI Avatar derives initials from userInfo.first/last (no initials/color prop).
  const [first, ...rest] = u.name.split(' ')
  const last = rest.join(' ')
  return (
    <div className="flex items-center gap-[10px] py-[14px]">
      <Avatar size="md" userInfo={{ first, last }} />
      <div className="flex flex-col leading-[16px]">
        {/* #1d2433 = body-text */}
        <span className="text-[13px] font-semibold text-[#1d2433]">{u.name}</span>
        {/* #6b7280 = muted */}
        <span className="text-[12px] text-[#6b7280]">{u.email}</span>
      </div>
    </div>
  )
}

/** Account Role column — inline borderless dropdown + optional admin note. */
export function RoleCell(p: ICellRendererParams<User>) {
  if (!p.data) return null
  const u = p.data
  return (
    <div className="flex flex-col gap-[6px] py-[14px]">
      <button className="flex items-center gap-[2px] text-[13px] text-[#1d2433] hover:text-[#186749] transition-colors">
        {u.role}
        <Caret />
      </button>
      {u.adminPermissions && (
        <span className="flex items-center gap-[6px] text-[12px] text-[#6b7280]">
          <ShieldIcon />
          Admin Permissions
        </span>
      )}
    </div>
  )
}

/** Workspace Access column — stacked count links (Entities / Compliance / Projects). */
export function WorkspaceAccessCell(p: ICellRendererParams<User>) {
  if (!p.data) return null
  const u = p.data
  const link = 'text-[13px] text-[#1e8ae9] hover:underline text-left' /* #1e8ae9 = Text/link */
  return (
    <div className="flex flex-col gap-[6px] py-[14px] leading-[16px]">
      <button className={link}>
        {u.entities} {u.entities === 1 ? 'Entity' : 'Entities'}
      </button>
      <button className={link}>
        {u.compliancePrograms} Compliance {u.compliancePrograms === 1 ? 'Program' : 'Programs'}
      </button>
      {/* Projects rendered as plain text per Figma */}
      <span className="text-[13px] text-[#1d2433]">
        {u.projects} {u.projects === 1 ? 'Project' : 'Projects'}
      </span>
    </div>
  )
}

/** FloQast Access column — inline borderless dropdown. */
export function FqAccessCell(p: ICellRendererParams<User>) {
  if (!p.data) return null
  return (
    <button className="flex items-center gap-[2px] py-[14px] text-[13px] text-[#1d2433] hover:text-[#186749] transition-colors">
      {p.data.fqAccess}
      <Caret />
    </button>
  )
}

/** Login Type column — inline borderless dropdown. */
export function LoginTypeCell(p: ICellRendererParams<User>) {
  if (!p.data) return null
  return (
    <button className="flex items-center gap-[2px] py-[14px] text-[13px] text-[#1d2433] hover:text-[#186749] transition-colors">
      {p.data.loginType}
      <Caret />
    </button>
  )
}
