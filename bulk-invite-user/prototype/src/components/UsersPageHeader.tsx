/**
 * UsersPageHeader — the "Users" page title block + right-aligned toolbar.
 * Mirrors Figma node 2198:6637 (Page Header).
 *
 * Left: title, a workspace-scope summary line with info icon, and a
 *   "User Type Guide" external link.
 * Right (toolbar): search input, Export split-button, primary Invite button
 *   (the entry point for the bulk-invite flow), and an overflow kebab.
 */
import { useState } from 'react'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import Input from '@floqastinc/flow-ui_core/Input'
// @ts-ignore
import Search from '@floqastinc/flow-ui_icons/material/Search'
// @ts-ignore
import Add from '@floqastinc/flow-ui_icons/material/Add'
// @ts-ignore
import SubpanelDropdown from '@floqastinc/flow-ui_core/SubpanelDropdown'

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* #adb2bb = mute-icon */}
      <circle cx="12" cy="12" r="9" stroke="#adb2bb" strokeWidth="1.6" />
      <path d="M12 11v5" stroke="#adb2bb" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="#adb2bb" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* #186749 = brand-800 */}
      <path d="M14 5h5v5M19 5l-8 8M11 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-5" stroke="#186749" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CaretDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10l5 5 5-5" stroke="#424867" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function KebabIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#424867" aria-hidden="true">
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  )
}

export function UsersPageHeader({
  onInvite,
  onBulkInvite,
}: {
  onInvite?: () => void
  onBulkInvite?: () => void
}) {
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  // eslint-disable-next-line no-console
  const noop = (label: string) => () => console.log(`${label} clicked`)

  return (
    <div className="flex items-start justify-between gap-6">
      {/* Title group */}
      <div className="flex flex-col gap-2 min-w-0">
        {/* Museo Sans in Figma; falls back to Inter (no Museo Sans in FlowUI bundle) */}
        <h1 className="text-[24px] leading-8 font-semibold text-[#1d2433]">Users</h1>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] leading-4 text-[#6b7280]">
            Showing 45 of 50 users based on your workspace access.
          </span>
          <InfoIcon />
        </div>
        <div className="flex items-center gap-1 text-[12px] leading-4 text-[#6b7280]">
          <span>View the</span>
          <a href="#" className="inline-flex items-center gap-1 text-[#186749] font-semibold hover:underline">
            User Type Guide
            <ExternalLinkIcon />
          </a>
          <span>to understand role permissions.</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 shrink-0">
        <div style={{ width: 312 }}>
          <Input mute placeholder="Search" type="search" value={search} onChange={setSearch}>
            <Input.LeftItem>
              <Search size={16} color="var(--flo-sem-color-icon-primary, #6b7280)" />
            </Input.LeftItem>
          </Input>
        </div>

        {/* Export — outlined secondary split-button (custom for outlined fidelity) */}
        <button className="flex items-center gap-1.5 h-10 px-3 rounded-[6px] border border-[#cbd2e1] bg-white text-[12px] font-semibold text-[#1d2433] hover:bg-[#f8fafc] transition-colors">
          Export
          <CaretDown />
        </button>

        {/* Invite — primary action; entry point for the bulk-invite flow */}
        <Button color="primary" variant="filled" onClick={onInvite}>
          <span className="inline-flex items-center gap-1">
            <Add size={16} color="#ffffff" />
            Invite
          </span>
        </Button>

        {/* Overflow menu — kebab with a nested "Bulk Actions" submenu */}
        <SubpanelDropdown open={menuOpen} onOpenChange={setMenuOpen} side="bottom" align="end" sideOffset={4}>
          <SubpanelDropdown.Trigger>
            <button
              aria-label="More actions"
              className="flex items-center justify-center w-10 h-10 rounded-[6px] hover:bg-[#f8fafc] transition-colors"
            >
              <KebabIcon />
            </button>
          </SubpanelDropdown.Trigger>
          <SubpanelDropdown.Content>
            <SubpanelDropdown.Item onSelect={noop('One Time Code Settings')}>
              <SubpanelDropdown.ItemText>One Time Code Settings</SubpanelDropdown.ItemText>
            </SubpanelDropdown.Item>

            <SubpanelDropdown.Sub>
              <SubpanelDropdown.SubTrigger>
                <SubpanelDropdown.ItemText>Bulk Actions</SubpanelDropdown.ItemText>
              </SubpanelDropdown.SubTrigger>
              <SubpanelDropdown.SubContent>
                <SubpanelDropdown.Item onSelect={() => onBulkInvite?.()}>
                  <SubpanelDropdown.ItemText>Invite Users</SubpanelDropdown.ItemText>
                </SubpanelDropdown.Item>
                <SubpanelDropdown.Item onSelect={noop('Bulk Invite to Workspaces')}>
                  <SubpanelDropdown.ItemText>Bulk Invite to Workspaces</SubpanelDropdown.ItemText>
                </SubpanelDropdown.Item>
                <SubpanelDropdown.Item onSelect={noop('Resend All Invites')}>
                  <SubpanelDropdown.ItemText>Resend All Invites</SubpanelDropdown.ItemText>
                </SubpanelDropdown.Item>
              </SubpanelDropdown.SubContent>
            </SubpanelDropdown.Sub>
          </SubpanelDropdown.Content>
        </SubpanelDropdown>
      </div>
    </div>
  )
}
