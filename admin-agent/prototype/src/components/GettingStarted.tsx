/**
 * GettingStarted — MVP-only onboarding panel.
 *
 * A non-linear set of setup tasks completable in ANY order — there is no
 * sequence, no "current" step, and no gating. Each card carries its own
 * independent status (incomplete / complete) shown via a Flow UI status icon.
 * One task is flagged `recommended` purely as data-driven emphasis (accent
 * border + pill); reordering the array never changes which card that is.
 *
 * Flow UI: Button (outlined, equal weight) + Status Icons (RadioButtonUnchecked
 * / CheckCircle). Brand/status greens use --flo-sem-color-*success* tokens.
 */
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import CheckCircle from '@floqastinc/flow-ui_icons/material/CheckCircle'
// @ts-ignore
import RadioButtonUnchecked from '@floqastinc/flow-ui_icons/material/RadioButtonUnchecked'
import type { ChatSeed } from './AssistChat'
import { createEntitiesSeed } from './seeds'
import { ASSISTED_ACTIONS } from './assistant/actions'

type StepStatus = 'incomplete' | 'complete'

interface SetupStep {
  id: string
  title: string
  description: string
  ctaLabel: string
  /** Each step's status is independent — there is no derived "current" step. */
  status: StepStatus
  /** Data-driven emphasis (not positional). Exactly one step sets this. */
  recommended?: boolean
  onAction?: () => void
}

export function GettingStarted({
  onStart,
  onConnectCloudStorage,
  onConnectErp,
}: {
  onStart?: (seed: ChatSeed) => void
  onConnectCloudStorage?: () => void
  onConnectErp?: () => void
}) {
  // Steps are intentionally independent and order-agnostic — no sequence or gating.
  // Flip a `status` to 'complete' to show the completed treatment + raise the count.
  const steps: SetupStep[] = [
    {
      id: 'close',
      title: 'Configure close',
      description: 'Set up your close checklist and templates.',
      ctaLabel: 'Configure',
      status: 'incomplete',
      recommended: true,
      // PLACEHOLDER: Configure close has no real journey yet, so it temporarily
      // borrows the Create Entities seed. This is NOT the shared create-entities
      // registry action — Configure close and Create entities are different
      // actions. Replace with the real close-setup intent when it exists.
      onAction: () => onStart?.(createEntitiesSeed('Getting started · Configure close')),
    },
    {
      id: 'users',
      title: 'Invite users',
      description: 'Add your team and assign their roles.',
      // Genuinely shared with the assistant — label + intent come from the registry.
      ctaLabel: ASSISTED_ACTIONS['invite-users'].label, // "Invite users"
      status: 'incomplete',
      onAction: () => onStart?.(ASSISTED_ACTIONS['invite-users'].intent('Getting started · Invite users')),
    },
    {
      id: 'storage',
      title: 'Connect cloud storage',
      description: 'Link Box, Drive, or SharePoint for documents.',
      ctaLabel: 'Connect',
      status: 'incomplete',
      // Opens the cloud-storage provider picker (not a chat seed).
      onAction: () => onConnectCloudStorage?.(),
    },
    {
      id: 'erp',
      title: 'Connect ERP',
      description: 'Sync your general ledger from your ERP.',
      ctaLabel: 'Connect',
      status: 'incomplete',
      // Opens the ERP provider picker (not a chat seed).
      onAction: () => onConnectErp?.(),
    },
  ]

  const completedCount = steps.filter((s) => s.status === 'complete').length

  return (
    <section className="rounded-[6px] border border-[#e1e6ef] bg-white p-6" aria-label="Getting started">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[16px] font-semibold leading-6 text-[#1d2433]">Getting started</h2>
          <p className="text-[13px] text-[#6b7280]">Complete these in any order.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6b7280] tabular-nums">
          <CheckCircle size={16} color="#6b7280" aria-hidden="true" />
          {completedCount} of {steps.length} complete
        </span>
      </div>

      {/* 2x2 grid — order-agnostic tasks. */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        {steps.map((step) => {
          const isComplete = step.status === 'complete'
          // Recommended emphasis is suppressed once a card is complete.
          const showRecommended = !!step.recommended && !isComplete
          return (
            <div
              key={step.id}
              className="flex flex-col gap-2 rounded-[6px] p-4"
              style={{
                border: showRecommended
                  ? '2px solid var(--flo-sem-color-border-success-medium)'
                  : '0.5px solid #e1e6ef',
              }}
            >
              <div className="flex items-center justify-between min-h-[20px]">
                {/* Independent per-card status */}
                {isComplete ? (
                  <span
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium"
                    style={{ color: 'var(--flo-sem-color-content-success-strong)' }}
                  >
                    <CheckCircle size={16} color="var(--flo-sem-color-content-success-strong)" aria-hidden="true" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6b7280]">
                    <RadioButtonUnchecked size={16} color="#6b7280" aria-hidden="true" />
                    Not started
                  </span>
                )}
                {showRecommended && (
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-[6px]"
                    style={{
                      backgroundColor: 'var(--flo-sem-color-surface-success-weakest)',
                      color: 'var(--flo-sem-color-content-success-strong)',
                    }}
                  >
                    Recommended
                  </span>
                )}
              </div>
              <h3 className="text-[14px] font-semibold leading-5 text-[#1d2433]">{step.title}</h3>
              <p className="text-[13px] leading-5 text-[#6b7280] flex-1">{step.description}</p>
              <div className="mt-auto pt-1">
                {/* All buttons equal weight (outlined) — no single emphasized entry point. */}
                <Button color="primary" variant="outlined" onClick={() => step.onAction?.()}>
                  {isComplete ? 'Manage' : step.ctaLabel}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
