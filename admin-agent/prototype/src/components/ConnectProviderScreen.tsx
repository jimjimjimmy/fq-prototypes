/**
 * ConnectProviderScreen — generic provider picker for MVP setup steps
 * (Connect cloud storage, Connect ERP). Mirrors the Create Entities drilldown
 * frame: a breadcrumb header + the docked host-agent chat (AssistChat) on the
 * right, with a provider grid as the main body. Selecting a card gives it a
 * success-token accent border; the primary CTA reflects the chosen provider.
 *
 * Driven entirely by a `ConnectScreenConfig` so each step is just data. Brand
 * marks are lightweight inline approximations (no logo assets in the repo) —
 * swap for real SVGs later. Greens use --flo-sem-color-*success* tokens; the
 * neutral palette matches the rest of the prototype.
 */
import { useState, type ReactNode } from 'react'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'
import { AssistChat, type ChatSeed } from './AssistChat'
import { DelegateStepInvite } from './DelegateStepInvite'
import type { DelegableStepId } from './invites'

export interface ProviderOption {
  id: string
  name: string
  logo: ReactNode
}

export interface ConnectScreenConfig {
  breadcrumbLabel: string
  title: string
  subtitle: string
  providers: ProviderOption[]
  chatSeed: ChatSeed
  /** Label of the filled primary "continue" button (e.g. "Continue to ERP"). */
  continueLabel: string
  /** Identifies the step for the delegate-invite seam. */
  stepId: DelegableStepId
  /** Short label used in delegate-invite copy, e.g. "ERP" / "cloud storage". */
  stepLabel: string
}

export function ConnectProviderScreen({
  config,
  onBack,
  onContinue,
  onConnect,
  hideChat,
}: {
  config: ConnectScreenConfig
  onBack: () => void
  onContinue: () => void
  /** Optional — reports the chosen provider when "Connect {provider}" is clicked.
   *  Getting Started doesn't pass it, so its behavior is unchanged. */
  onConnect?: (providerName: string) => void
  /** When true, render only the picker (no docked chat) — for embedding inside
   *  another flow that already shows the conversation. Getting Started omits it. */
  hideChat?: boolean
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const selectedProvider = config.providers.find((p) => p.id === selected) ?? null

  return (
    <div className="flex h-full min-h-0 bg-white">
      {/* Main: breadcrumb + provider picker */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="shrink-0 px-6 py-3 border-b border-[#e1e6ef]">
          <nav className="flex items-center gap-1.5 text-[13px]" aria-label="Breadcrumb">
            <button onClick={onBack} className="font-medium text-[#1e8ae9] hover:underline">
              Admin Agent
            </button>
            <span className="text-[#9ca3af]">›</span>
            <span className="font-semibold text-[#1d2433]">{config.breadcrumbLabel}</span>
          </nav>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-[24px] font-bold leading-8 text-[#1d2433]">{config.title}</h1>
              <p className="text-[14px] text-[#6b7280]">{config.subtitle}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {config.providers.map((p) => {
                const isSelected = p.id === selected
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p.id)}
                    aria-pressed={isSelected}
                    className="flex flex-col items-center justify-center gap-3 rounded-[8px] bg-white px-4 py-6 transition-colors hover:bg-[#f9fafb]"
                    style={{
                      border: isSelected
                        ? '2px solid var(--flo-sem-color-border-success-medium)'
                        : '0.5px solid #e1e6ef',
                    }}
                  >
                    <span className="flex items-center justify-center w-12 h-12 rounded-[8px] bg-[#f5f7fa]">
                      {p.logo}
                    </span>
                    <span className="text-[14px] font-medium text-[#1d2433] text-center">{p.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Action bar */}
            <div className="flex justify-end gap-3 pt-2">
              {/* Prototype: actual OAuth connect isn't wired. */}
              <Button color="primary" variant="outlined" disabled={!selectedProvider} onClick={() => selectedProvider && onConnect?.(selectedProvider.name)}>
                {selectedProvider ? `Connect ${selectedProvider.name}` : 'Connect'}
              </Button>
              <Button color="primary" variant="filled" onClick={onContinue}>
                {config.continueLabel}
              </Button>
            </div>

            {/* Delegate this step — secondary alternative below the action row. */}
            <DelegateStepInvite
              stepId={config.stepId}
              stepLabel={config.stepLabel}
              contextLabel={config.chatSeed.contextLabel}
            />
          </div>
        </div>
      </div>

      {/* Right: docked host-agent chat (suppressed when embedded) */}
      {!hideChat && (
        <div className="w-[420px] shrink-0 border-l border-[#e1e6ef]">
          <AssistChat seed={config.chatSeed} onClose={onBack} />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Provider brand marks (lightweight inline approximations)           */
/* ------------------------------------------------------------------ */

function TextMark({ text, color, size = 18 }: { text: string; color: string; size?: number }) {
  return (
    <span className="font-bold leading-none text-center" style={{ color, fontSize: size }}>
      {text}
    </span>
  )
}

function GoogleDriveMark() {
  return (
    <svg width="28" height="25" viewBox="0 0 87.3 78" aria-hidden="true">
      <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
      <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9 9 0 000 53h27.5z" fill="#00ac47" />
      <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.7l5.85 11.5z" fill="#ea4335" />
      <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
      <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
      <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
    </svg>
  )
}

function DropboxMark() {
  return (
    <svg width="26" height="24" viewBox="0 0 24 24" fill="#0061FE" aria-hidden="true">
      <path d="M6 1.5L0 5.25 6 9l6-3.75L6 1.5zm12 0l-6 3.75L18 9l6-3.75L18 1.5zM0 12.75L6 16.5l6-3.75L6 9l-6 3.75zm18-3.75l-6 3.75 6 3.75 6-3.75L18 9zM6 17.75l6 3.75 6-3.75-6-3.75-6 3.75z" />
    </svg>
  )
}

function OneDriveMark() {
  return (
    <svg width="30" height="19" viewBox="0 0 32 20" fill="#0364B8" aria-hidden="true">
      <path d="M19.5 7.5c-.7-3.1-3.5-5.5-6.9-5.5-2.7 0-5 1.5-6.2 3.7C2.8 6 0 8.9 0 12.5 0 16.1 2.9 19 6.5 19h18c3 0 5.5-2.5 5.5-5.5 0-2.9-2.3-5.3-5.2-5.5-.3 0-.5 0-.8.1-1-2.4-3.4-4.1-6.2-4.1-2.3 0-4.4 1.2-5.6 3z" />
    </svg>
  )
}

function EgnyteMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#00B140" aria-hidden="true">
      <path d="M12 1.5l2.9 6.7 7.3.6-5.5 4.8 1.7 7.1L12 17l-6.4 3.9 1.7-7.1L1.8 8.8l7.3-.6z" />
    </svg>
  )
}

function UploadMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V4m0 0L7 9m5-5l5 5" stroke="#1FAC76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#1FAC76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Step configs                                                       */
/* ------------------------------------------------------------------ */

const CLOUD_STORAGE_SEED: ChatSeed = {
  recordSet: 'entities', // placeholder — unused for this view
  title: 'Connect cloud storage',
  contextLabel: 'Getting started · Connect cloud storage',
  opening: "I'll help you connect Cloud Storage.",
  prompts: ['Which platforms can I connect?', 'What permissions are needed?'],
}

export const CLOUD_STORAGE_CONFIG: ConnectScreenConfig = {
  breadcrumbLabel: 'Connect cloud storage',
  title: 'Which cloud storage does your team use?',
  subtitle: 'Choose the platform your team already uses for supporting documents and close files.',
  continueLabel: 'Continue to ERP',
  chatSeed: CLOUD_STORAGE_SEED,
  stepId: 'connect-cloud-storage',
  stepLabel: 'cloud storage',
  providers: [
    { id: 'box', name: 'Box', logo: <TextMark text="box" color="#0061D5" /> },
    { id: 'google-shared', name: 'Google Shared Drive', logo: <GoogleDriveMark /> },
    { id: 'google-mydrive', name: 'Google MyDrive', logo: <GoogleDriveMark /> },
    { id: 'dropbox', name: 'Dropbox', logo: <DropboxMark /> },
    { id: 'onedrive', name: 'OneDrive', logo: <OneDriveMark /> },
    { id: 'onedrive-gcc', name: 'OneDrive Government GCC High', logo: <OneDriveMark /> },
    { id: 'egnyte', name: 'Egnyte', logo: <EgnyteMark /> },
    { id: 'sharepoint', name: 'Sharepoint', logo: <TextMark text="S" color="#036C70" /> },
  ],
}

const ERP_SEED: ChatSeed = {
  recordSet: 'entities', // placeholder — unused for this view
  title: 'Connect ERP',
  contextLabel: 'Getting started · Connect ERP',
  opening: "I'll help you connect your ERP system.",
  prompts: ['Which ERPs can I connect?', 'What access does FloQast need?'],
}

export const ERP_CONFIG: ConnectScreenConfig = {
  breadcrumbLabel: 'Connect ERP',
  title: 'Which ERP does your team use?',
  subtitle: 'Choose the system FloQast will sync your general ledger and trial balance from.',
  continueLabel: 'Finish setup',
  chatSeed: ERP_SEED,
  stepId: 'connect-erp',
  stepLabel: 'ERP',
  providers: [
    { id: 'netsuite', name: 'NetSuite', logo: <TextMark text="NS" color="#1F2A44" size={17} /> },
    { id: 'intacct', name: 'Sage Intacct', logo: <TextMark text="Sage" color="#00875A" size={13} /> },
    { id: 'qbo', name: 'QuickBooks Online', logo: <TextMark text="qb" color="#2CA01C" /> },
    { id: 'workday', name: 'Workday', logo: <TextMark text="W" color="#0061A8" /> },
    { id: 'trial-balance', name: 'Trial Balance Upload', logo: <UploadMark /> },
  ],
}
