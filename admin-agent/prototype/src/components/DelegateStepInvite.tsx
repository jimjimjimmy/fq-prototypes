/**
 * DelegateStepInvite — "delegate this step" invite band for the MVP connect
 * pages (Connect ERP / Connect cloud storage). A user without the access or
 * credentials to finish a connection can invite the person who does.
 *
 * Reuses the single-user invite seam (invites.ts) with userType fixed to
 * "Admin" and the step's task context attached — it does NOT render a role
 * picker (absent, not disabled). All page-specific wording derives from props,
 * so there are no per-page forks of this component.
 *
 * Neutral hex palette matches the surrounding files; success uses the
 * --flo-sem-color-*success* tokens (no hardcoded green hex).
 */
import { useState } from 'react'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'
import { sendUserInvite, type DelegableStepId } from './invites'

interface DelegateStepInviteProps {
  stepId: DelegableStepId
  /** Used in copy, e.g. "ERP" / "cloud storage". */
  stepLabel: string
  /** Task context passed onto the invite, e.g. "Getting started · Connect ERP". */
  contextLabel: string
}

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

function UserPlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#424867" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}

export function DelegateStepInvite({ stepId, stepLabel, contextLabel }: DelegateStepInviteProps) {
  const [email, setEmail] = useState('')
  // Local delegated/pending status for MVP. SEAM: this could later surface back
  // in the Getting Started panel (e.g. "Connect ERP — invited sam@acme.com");
  // not wired cross-surface for MVP.
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null)
  const valid = isValidEmail(email)

  const fire = (to: string) =>
    sendUserInvite({ email: to.trim(), userType: 'Admin', contextLabel, stepId })

  const send = () => {
    if (!valid) return
    fire(email)
    setInvitedEmail(email.trim())
  }

  return (
    <div className="flex flex-col gap-4">
      {/* "or" divider — marks this as a secondary alternative to the action row above. */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-[#e1e6ef]" />
        <span className="text-[12px] font-medium text-[#9ca3af]">or</span>
        <div className="h-px flex-1 bg-[#e1e6ef]" />
      </div>

      {invitedEmail ? (
        /* Pending confirmation */
        <div
          className="rounded-[8px] p-4"
          style={{
            backgroundColor: 'var(--flo-sem-color-surface-success-weakest)',
            border: '0.5px solid var(--flo-sem-color-border-success-medium)',
          }}
        >
          <div className="flex items-start gap-3">
            <span className="shrink-0 mt-0.5" style={{ color: 'var(--flo-sem-color-content-success-strong)' }}>
              <MailIcon />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-semibold" style={{ color: 'var(--flo-sem-color-content-success-strong)' }}>
                Invitation sent — waiting on {invitedEmail}
              </span>
              <span className="text-[13px] text-[#6b7280]">
                They were invited as an Admin and emailed a link to this step. You can still connect{' '}
                {stepLabel} yourself anytime.
              </span>
              <div className="flex items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => fire(invitedEmail)}
                  className="text-[13px] font-semibold text-[#1e8ae9] hover:underline"
                >
                  Resend
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInvitedEmail(null)
                    setEmail('')
                  }}
                  className="text-[13px] font-semibold text-[#1e8ae9] hover:underline"
                >
                  Invite someone else
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Default band */
        <div className="flex items-center justify-between gap-6 rounded-[8px] border border-[#e1e6ef] p-4">
          <div className="flex items-start gap-3">
            <span className="shrink-0 mt-0.5">
              <UserPlusIcon />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-semibold text-[#1d2433]">
                Don't have the access to connect your {stepLabel} yourself?
              </span>
              <span className="text-[13px] text-[#6b7280]">
                Invite the person who manages it — they'll be taken straight to this step to finish.
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-[#9ca3af]">
                <InfoIcon />
                They'll be invited as an Admin so they have the access to complete setup.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="name@company.com"
              aria-label="Invitee email"
              className="h-10 w-[240px] rounded-[6px] border border-[#cbd2e1] px-3 text-[14px] text-[#1d2433] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1e8ae9]"
            />
            <Button color="primary" variant="filled" disabled={!valid} onClick={send}>
              Send invite
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
