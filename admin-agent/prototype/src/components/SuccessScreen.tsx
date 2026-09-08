/**
 * SuccessScreen — shown after "Save and Finalize Entities". Confirms the entity
 * setup is complete and surfaces the remaining setup steps as AI Assisted CTAs
 * (styled like the main-page assistants). "Create Users" launches the same
 * journey as the main-page CTA; the others open a generic assist chat.
 *
 * Tokens: brand green #1FAC76/#ECFFF8 (success), AI purple #9E70FA/#6D35DE +
 * #e1d6fb border (AI Assisted CTAs), #1d2433 body, #6b7280 muted.
 */
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import CheckCircle from '@floqastinc/flow-ui_icons/material/CheckCircle'
// @ts-ignore
import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome'
import type { ChatSeed } from './AssistChat'
import { createUsersSeed, genericSeed } from './seeds'

const AI_PURPLE = '#9E70FA'
const AI_GHOST_TEXT = '#6D35DE'

const REMAINING: { label: string; seed: () => ChatSeed }[] = [
  { label: 'Create Users', seed: () => createUsersSeed() },
  { label: 'Configure General Ledger', seed: () => genericSeed('Configure General Ledger', 'Entities') },
  { label: 'Configure Storage', seed: () => genericSeed('Configure Storage', 'Entities') },
]

export function SuccessScreen({ onNavigate }: { onNavigate: (seed: ChatSeed) => void }) {
  return (
    <div className="h-full overflow-y-auto flex flex-col items-center justify-center text-center px-6">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#ECFFF8] mb-4">
        <CheckCircle size={32} color="#1FAC76" />
      </div>
      <h2 className="text-[24px] leading-tight font-bold text-[#1d2433]">Entities saved and finalized</h2>
      <p className="mt-2 text-[14px] leading-5 text-[#6b7280] max-w-[520px]">
        Your entities, folders, and reconciliation configuration are all set. Complete your setup
        with these remaining steps:
      </p>

      <div className="mt-7 w-full max-w-[440px] flex flex-col gap-3">
        <div className="flex items-center justify-center gap-1.5">
          <AutoAwesome size={14} color={AI_PURPLE} />
          <span className="text-[13px] font-semibold text-[#1d2433]">AI Assisted Actions</span>
        </div>
        <div className="flex flex-col gap-2">
          {REMAINING.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.seed())}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-[6px] border text-[13px] font-semibold transition-colors hover:bg-[#f9f7fc]"
              style={{ borderColor: '#e1d6fb', color: AI_GHOST_TEXT, backgroundColor: '#ffffff' }}
            >
              <AutoAwesome size={14} color={AI_PURPLE} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
