/**
 * OverviewPage — the Admin Agent landing surface.
 *
 * Foundation adapted from Project Catalyst's task "Drilldown" frame
 * (Figma R8wAdMhnYPt0WHZoNSIsOW, node 871:30736). The page title matches
 * Catalyst's title component (node 871:30766): 20px / 30px, weight 700,
 * #1d2433 (Museo Sans → Inter fallback).
 *
 * Resolve / AI Assisted Action CTAs drill into a subpage (DrilldownPage) that
 * shows the impacted records plus the host-agent chat, seeded by the CTA.
 */
import { useState } from 'react'
import { ConfigurationHealth } from './ConfigurationHealth'
import { GettingStarted } from './GettingStarted'
import { AdminAssistants } from './AdminAssistants'
import { DrilldownPage } from './DrilldownPage'
import {
  ConnectProviderScreen,
  CLOUD_STORAGE_CONFIG,
  ERP_CONFIG,
} from './ConnectProviderScreen'
import { AssistChat, type ChatSeed } from './AssistChat'
import { MVP_ACTIONS, FUTURE_IDEATION_ACTIONS } from './assistant/actions'
import type { AppVersion } from '../version/VersionContext'

/** Page-context for the persistent main-page chat. */
const MAIN_CHAT_SEED: ChatSeed = {
  recordSet: 'users', // placeholder — no records view on the main page
  title: 'Admin Agent',
  contextLabel: 'Admin Agent',
  opening: 'Hi — I can help you set up and manage FloQast. What would you like to do?',
  prompts: [],
}

export function OverviewPage({ variant = 'future-ideation' }: { variant?: AppVersion }) {
  const [drilldown, setDrilldown] = useState<ChatSeed | null>(null)
  // MVP-only: the provider-picker setup screens (not chat drilldowns).
  const [connectScreen, setConnectScreen] = useState<'cloud-storage' | 'erp' | null>(null)

  if (drilldown) {
    // Key by title so navigating between CTAs (e.g. a remaining setup step) remounts fresh.
    return (
      <DrilldownPage
        key={drilldown.title}
        seed={drilldown}
        onBack={() => setDrilldown(null)}
        onNavigate={setDrilldown}
      />
    )
  }

  if (connectScreen) {
    const config = connectScreen === 'erp' ? ERP_CONFIG : CLOUD_STORAGE_CONFIG
    return (
      <ConnectProviderScreen
        // Key by step so switching cloud-storage → ERP remounts (resets selection + chat).
        key={connectScreen}
        config={config}
        onBack={() => setConnectScreen(null)}
        // Cloud storage advances to ERP; ERP finishes back to Getting started.
        onContinue={() => setConnectScreen(connectScreen === 'cloud-storage' ? 'erp' : null)}
      />
    )
  }

  const actions = variant === 'mvp' ? MVP_ACTIONS : FUTURE_IDEATION_ACTIONS
  return (
    <div className="flex h-full min-h-0 bg-white">
      <div className="flex-1 min-w-0 overflow-y-auto px-6 pt-6 pb-16">
        <div className="flex flex-col gap-6">
          <h1 className="text-[20px] leading-[30px] font-bold text-[#1d2433]">Admin Agent</h1>
          {variant === 'mvp' ? (
            <GettingStarted
              onStart={setDrilldown}
              onConnectCloudStorage={() => setConnectScreen('cloud-storage')}
              onConnectErp={() => setConnectScreen('erp')}
            />
          ) : (
            <ConfigurationHealth />
          )}
          {/* Future Ideation keeps its recommendations assistants; the AI Assisted
              Actions now live in the docked chat. MVP shows no static panel. */}
          {variant === 'future-ideation' && <AdminAssistants onAssist={setDrilldown} />}
        </div>
      </div>
      {/* Persistent docked chat — same AssistChat component, main-page context. */}
      <div className="w-[420px] shrink-0 border-l border-[#e1e6ef]">
        <AssistChat
          seed={MAIN_CHAT_SEED}
          actions={actions}
          onLaunchAction={(a) => setDrilldown(a.intent())}
        />
      </div>
    </div>
  )
}
