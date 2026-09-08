/**
 * SingleInviteForm — the single-user invite form (Figma node 2188:24356), the
 * body of InviteUserModal. Sources roles/validation/submit from the shared
 * `data/invite` module and uses the shared WorkspaceTree for the
 * "Assign to Workspaces" picker (same tree the bulk flow reuses).
 *
 * Returns a body + footer fragment — InviteUserModal owns the Modal, title,
 * and close button.
 */
import { useState } from 'react'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import Input from '@floqastinc/flow-ui_core/Input'
// @ts-ignore
import InputWrapper from '@floqastinc/flow-ui_core/InputWrapper'
// @ts-ignore
import Select from '@floqastinc/flow-ui_core/Select'
// @ts-ignore
import Toggle from '@floqastinc/flow-ui_core/Toggle'
// @ts-ignore
import Search from '@floqastinc/flow-ui_icons/material/Search'
import { DEFAULT_SELECTED_WORKSPACES } from '../../data/workspaces'
import { INVITE_ROLES, LOGIN_TYPES, validateEmail, submitInvites, type LoginType } from '../../data/invite'
import { WorkspaceTree } from './WorkspaceTree'

const roleSelectOptions = INVITE_ROLES.map((r) => ({ label: r, value: r }))

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 5h5v5M19 5l-8 8M11 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-5" stroke="#186749" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#424867]">
      <span className="w-1 h-1 rounded-full bg-[#d24747]" />
      {children}
    </span>
  )
}

export function SingleInviteForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [loginType, setLoginType] = useState<LoginType | ''>('')
  const [selected, setSelected] = useState<Set<string>>(new Set(DEFAULT_SELECTED_WORKSPACES))
  const [search, setSearch] = useState('')
  const [sendWelcome, setSendWelcome] = useState(true)

  const canSend = email.trim() !== '' && validateEmail(email) === null && role !== '' && loginType !== ''

  function handleSend() {
    submitInvites({ mode: 'single', email, role, loginType, workspaces: [...selected], sendWelcome })
    onClose()
  }

  return (
    <>
      {/* Body */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 flex flex-col gap-6">
        {/* Email */}
        <div className="w-[400px] max-w-full">
          <InputWrapper isRequired className="w-full">
            <InputWrapper.Label>Email</InputWrapper.Label>
            <Input value={email} onChange={setEmail} placeholder="Enter email" type="email" />
          </InputWrapper>
        </div>

        {/* Role */}
        <div className="w-[400px] max-w-full flex flex-col gap-1">
          <InputWrapper isRequired className="w-full">
            <InputWrapper.Label>Role</InputWrapper.Label>
            <Select
              className="w-full"
              selectionMode="single"
              value={role}
              onChange={(v: string | null) => setRole(v ?? '')}
              options={roleSelectOptions}
              buttonLabel={role || 'Select a role'}
              disableFilter
            />
          </InputWrapper>
          <span className="text-[12px] leading-4 text-[#6b7280]">
            For a detailed list of each role's permissions, view the{' '}
            <a href="#" className="inline-flex items-center gap-1 text-[#186749] font-semibold hover:underline">
              User Type Guide
              <ExternalLinkIcon />
            </a>
          </span>
        </div>

        {/* Login Type — native radios (no FlowUI Radio component) */}
        <fieldset className="flex flex-col gap-2">
          <RequiredLabel>Login Type</RequiredLabel>
          <div className="flex flex-col gap-2">
            {LOGIN_TYPES.map((lt) => (
              <label key={lt} className="flex items-center gap-2 text-[13px] text-[#1d2433] cursor-pointer">
                <input
                  type="radio"
                  name="loginType"
                  checked={loginType === lt}
                  onChange={() => setLoginType(lt)}
                  style={{ accentColor: '#1fac76', width: 16, height: 16 }}
                />
                {lt}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Assign to Workspaces */}
        <div className="flex flex-col gap-3">
          <span className="text-[14px] font-semibold text-[#1d2433]">Assign to Workspaces (Optional)</span>
          <div style={{ width: '100%' }}>
            <Input mute placeholder="Search by workspace name" type="search" value={search} onChange={setSearch}>
              <Input.LeftItem>
                <Search size={16} color="var(--flo-sem-color-icon-primary, #6b7280)" />
              </Input.LeftItem>
            </Input>
          </div>
          <WorkspaceTree selected={selected} onChange={setSelected} query={search} />
        </div>

        {/* Send welcome email toggle */}
        <div className="flex items-start gap-3 pt-1">
          <Toggle checked={sendWelcome} onChange={() => setSendWelcome((v) => !v)} />
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-[#1d2433]">Send welcome email</span>
            <span className="text-[12px] text-[#6b7280]">
              Disabling this will prevent the welcome email from automatically being sent to this user
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e1e6ef] shrink-0">
        <Button color="secondary" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button color="primary" variant="filled" disabled={!canSend} onClick={handleSend}>Send</Button>
      </div>
    </>
  )
}
