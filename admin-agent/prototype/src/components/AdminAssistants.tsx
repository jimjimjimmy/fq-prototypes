/**
 * AdminAssistants — a stack of AI "Assistant" accordions for the Overview
 * surface. Each assistant expands to show AI Recommendations (a table pairing
 * each finding 1:1 with impacted-item counts and a clickable action) and AI
 * Assisted Actions (one-click actions).
 *
 * Design-system grounding (Storybook):
 *  - Accordion (FlowUI): progressive disclosure; chevron flips for open/closed;
 *    12px gap between stacked accordions; white card + #e1e6ef border.
 *  - Button (FlowUI): list/per-item actions use the Medium (32px) size; AI
 *    actions use the AI Ghost treatment (fill #F8F5FF, purple #6D35DE, AI star
 *    icon); labels are Title Case, verb-first.
 *  - AI Enhancements (FlowUI): purple AI accent (#9E70FA), approved AutoAwesome
 *    star icon, recommendations surfaced with clear titles + one-click actions.
 *  - Findings use the warning semantic (amber) — issues needing attention.
 *
 * Content: the Close Assistant uses the supplied example. Counts and the other
 * two assistants carry analogous illustrative content to be refined.
 */
import { useState } from 'react'
import type { ChatSeed } from './AssistChat'
import type { RecordSet } from './ImpactedRecordsGrid'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import { Table, THead, TBody, TR, TH, TD } from '@floqastinc/flow-ui_core/Table'
// @ts-ignore
import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome'
// @ts-ignore
import Warning from '@floqastinc/flow-ui_icons/material/Warning'

const AI_PURPLE = '#9E70FA' // AI accent (star icon)
const AI_GHOST_TEXT = '#6D35DE' // AI Ghost button text/icon
const AI_GHOST_BG = '#F8F5FF' // AI Ghost button fill

interface Recommendation {
  /** The AI finding (an issue detected). */
  finding: string
  /** The resolution that addresses the finding (1:1 with the finding). */
  resolution: string
  /** Impacted-item counts, ordered to match the assistant's two categories. */
  counts: [number, number]
}

interface Assistant {
  title: string
  context: string
  /** Which impacted-records set its CTAs drill into. */
  recordSet: RecordSet
  /** The two settings areas this assistant analyzes — used as count columns. */
  categories: [string, string]
  recommendations: Recommendation[]
}

const ASSISTANTS: Assistant[] = [
  {
    title: 'Users & Roles Assistant',
    context: 'Analyze Settings › Users and Settings › Roles for the following',
    recordSet: 'users',
    categories: ['Users', 'Roles'],
    recommendations: [
      { finding: 'Users without a Workspace assignment', resolution: 'Assign users to a workspace', counts: [17, 5] },
      { finding: 'Large volume of users with Admin User Type', resolution: 'Review Admin user types', counts: [42, 1] },
    ],
  },
  {
    title: 'Close Assistant',
    context: 'Analyze Settings › Checklists and Settings › Recommendations for the following',
    recordSet: 'close',
    categories: ['Checklist', 'Reconciliation'],
    recommendations: [
      { finding: 'Orphaned items', resolution: 'Assign preparers & reviewers', counts: [12, 3] },
      { finding: 'Missing due dates', resolution: 'Assign due dates', counts: [8, 5] },
      { finding: 'Duplicate items', resolution: 'Merge duplicate items', counts: [4, 2] },
    ],
  },
  {
    title: 'Workflows & Entities Assistant',
    context: 'Analyze Settings › Workflows and Settings › Entities for the following',
    recordSet: 'entities',
    categories: ['Workflows', 'Entities'],
    recommendations: [
      { finding: 'Strict Sign-Off Mode not fully enabled', resolution: 'Enable Strict Sign-Off Mode', counts: [9, 14] },
    ],
  },
]

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="M7 10l5 5 5-5" stroke="#424867" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** AI Ghost action button (FlowUI Button — AI Ghost, Medium 32px). */
function AiActionButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[12px] font-semibold whitespace-nowrap shrink-0 transition-colors hover:brightness-95"
      style={{ backgroundColor: AI_GHOST_BG, color: AI_GHOST_TEXT }}
    >
      <AutoAwesome size={14} color={AI_GHOST_TEXT} />
      {label}
    </button>
  )
}

function AssistantItem({
  assistant,
  onAssist,
}: {
  assistant: Assistant
  onAssist: (seed: ChatSeed) => void
}) {
  const [open, setOpen] = useState(false)
  const [cat1, cat2] = assistant.categories
  const context = assistant.title.replace(/ Assistant$/, '')

  // Auto-start the host-agent chat seeded by the clicked CTA.
  const resolveSeed = (rec: Recommendation): ChatSeed => ({
    recordSet: assistant.recordSet,
    title: rec.finding,
    contextLabel: context,
    opening: `I can help you resolve "${rec.finding}". I found ${rec.counts[0]} ${cat1.toLowerCase()} and ${rec.counts[1]} ${cat2.toLowerCase()} items impacted. The recommended fix is to ${rec.resolution.toLowerCase()}. How would you like to proceed?`,
    prompts: [
      rec.resolution,
      `Show the ${rec.counts[0] + rec.counts[1]} impacted items`,
      'Explain why these were flagged',
    ],
  })

  return (
    <div className="rounded-[6px] border border-[#e1e6ef] bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 h-14 text-left hover:bg-[#f9f7fc] transition-colors"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#f4eef9] shrink-0">
          <AutoAwesome size={16} color={AI_PURPLE} />
        </span>
        <span className="flex-1 text-[14px] font-semibold text-[#1d2433]">{assistant.title}</span>
        <Chevron open={open} />
      </button>

      {/* Content */}
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-[#e1e6ef]">
          {/* AI Recommendations — table: finding · counts by category · action */}
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex items-center gap-1.5">
              <AutoAwesome size={14} color={AI_PURPLE} />
              <span className="text-[13px] font-semibold text-[#1d2433]">AI Recommendations</span>
            </div>
            <p className="text-[12px] text-[#6b7280]">{assistant.context}</p>

            {/* fixed layout + explicit widths = even column spacing */}
            <Table fixed middleBorders outerRoundedBorder highlightRowsOnHover>
              <THead>
                <TR>
                  <TH alignLeft width="30%">Finding</TH>
                  <TH alignLeft width="30%">Resolution</TH>
                  <TH alignCenter width="13%">{cat1}</TH>
                  <TH alignCenter width="13%">{cat2}</TH>
                  <TH alignCenter width="14%"> </TH>
                </TR>
              </THead>
              <TBody>
                {assistant.recommendations.map((rec) => (
                  <TR key={rec.finding}>
                    {/* Typography (size/color/weight) inherited from FlowUI TD — not overridden */}
                    <TD alignLeft>
                      <span className="flex items-center gap-2">
                        <span className="shrink-0">
                          <Warning size={16} color="#DB7712" />
                        </span>
                        {rec.finding}
                      </span>
                    </TD>
                    <TD alignLeft>{rec.resolution}</TD>
                    <TD alignCenter>
                      <span className="tabular-nums whitespace-nowrap">
                        {rec.counts[0]} <span className="text-[#6b7280]">items</span>
                      </span>
                    </TD>
                    <TD alignCenter>
                      <span className="tabular-nums whitespace-nowrap">
                        {rec.counts[1]} <span className="text-[#6b7280]">items</span>
                      </span>
                    </TD>
                    <TD alignCenter>
                      <AiActionButton label="Resolve" onClick={() => onAssist(resolveSeed(rec))} />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>

        </div>
      )}
    </div>
  )
}

/** Placeholder accordion for assistants that aren't built yet. */
function ComingSoonItem({ title }: { title: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-[6px] border border-[#e1e6ef] bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 h-14 text-left hover:bg-[#f9f7fc] transition-colors"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#f4eef9] shrink-0">
          <AutoAwesome size={16} color={AI_PURPLE} />
        </span>
        <span className="flex-1 text-[14px] font-semibold text-[#1d2433]">{title}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-4 border-t border-[#e1e6ef]">
          <p className="text-[13px] text-[#6b7280]">
            This assistant is coming soon. It will help admins review and manage data sources and
            connected integrations.
          </p>
        </div>
      )}
    </div>
  )
}

export function AdminAssistants({ onAssist }: { onAssist: (seed: ChatSeed) => void }) {
  // 12px gap between stacked accordions (FlowUI Accordion guidance).
  return (
    <div className="flex flex-col gap-3">
      {ASSISTANTS.map((a) => (
        <AssistantItem key={a.title} assistant={a} onAssist={onAssist} />
      ))}
      <ComingSoonItem title="Data & Connections Assistant" />
    </div>
  )
}
