/**
 * AssistedActionButton — the single AI action primitive, extracted from the
 * original AdminAssistants "Resolve" / assisted-action buttons. Renders one
 * action with the AI treatment (AI Primary = #9E70FA filled, AI Ghost =
 * #F8F5FF/#6D35DE). Shared primitive the MVP panel and any future Resolve
 * buttons reuse.
 */
import type { AssistedAction } from './actions'

const AI_PRIMARY_BG = '#9E70FA'  // AI Primary fill / AI accent
const AI_GHOST_TEXT = '#6D35DE'  // AI Ghost text/icon
const AI_GHOST_BG = '#F8F5FF'    // AI Ghost fill

export function AssistedActionButton({
  action,
  onLaunch,
}: {
  action: Pick<AssistedAction, 'label' | 'icon' | 'variant'>
  onLaunch: () => void
}) {
  const Icon = action.icon
  const isPrimary = action.variant === 'ai-primary'
  const bg = isPrimary ? AI_PRIMARY_BG : AI_GHOST_BG
  const fg = isPrimary ? '#ffffff' : AI_GHOST_TEXT
  return (
    <button
      type="button"
      onClick={onLaunch}
      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] text-[13px] font-semibold whitespace-nowrap shrink-0 transition-[filter] hover:brightness-95"
      style={{ backgroundColor: bg, color: fg }}
    >
      <Icon size={14} color={fg} />
      {action.label}
    </button>
  )
}
