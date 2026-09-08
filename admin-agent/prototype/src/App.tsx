/**
 * Admin Agent — prototype app shell.
 *
 * Recreates the FloQast Admin Settings surface as it ships today: the 56px
 * global FQ rail + the horizontal Admin Settings nav (13 sub-sections), with a
 * switchable content area below.
 *
 * Scope (starting point): the shell is fully navigable across all 13 tabs.
 *   • Users — the real Team Members page (table, filters, header), reused from
 *     the bulk-invite-user project and reflecting the current shipping page
 *     (invite actions are inert here — this project isn't about the invite flow).
 *   • All other tabs — a placeholder stub until they're built from Figma.
 *
 * The AI agent layer will be added on top of this shell later.
 */
import { useState } from 'react'
import { GlobalRail, AdminSettingsNav, type SettingsTab } from './scaffold/global'
import { OverviewPage } from './components/OverviewPage'
import { UsersPage } from './components/UsersPage'
import { useVersion, type AppVersion } from './version/VersionContext'

/** Placeholder shown for admin sections that haven't been built out yet. */
function TabStub({ tab }: { tab: SettingsTab }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-6">
      <h1 className="text-[20px] font-semibold text-[#1d2433]">{tab}</h1>
      <p className="text-[13px] text-[#6b7280] max-w-md">
        This Admin Settings page isn't built yet. The shell and navigation are in
        place — content will be added from Figma.
      </p>
    </div>
  )
}

/**
 * The Admin Agent shell as it ships today — the 56px global FQ rail + the
 * horizontal Admin Settings nav + a switchable content area.
 *
 * This is the single source of truth for the prototype's current behavior.
 * Both version entry points below render it, so "Future Ideation" and "MVP"
 * are exact mirror images until MVP is intentionally pared down.
 */
function AdminAgentShell({ version }: { version: AppVersion }) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Admin Agent')

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <GlobalRail activeBottomNav="settings" avatarInitials="GA" />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminSettingsNav
          activeTab={activeTab}
          onTabClick={(tab) => setActiveTab(tab as SettingsTab)}
        />
        {/* min-h-0 lets each page own its own scroll (Overview keeps a persistent
            right pane; Users/stubs scroll as a whole). */}
        <main className="flex-1 min-h-0 bg-white">
          {activeTab === 'Admin Agent' ? (
            <OverviewPage variant={version} />
          ) : activeTab === 'Users' ? (
            <div className="h-full overflow-y-auto">
              <UsersPage />
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <TabStub tab={activeTab} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

/**
 * "Future Ideation" — the full feature set, exactly as the prototype is today.
 */
function FutureIdeationApp() {
  return <AdminAgentShell version="future-ideation" />
}

/**
 * "MVP" — the pared-down, initial implementation.
 *
 * Shares the shell with Future Ideation but passes version="mvp", which the
 * Overview surface reads to swap the ConfigurationHealth card for the
 * "Getting Started" setup checklist. Further MVP-only divergences should hang
 * off this version flag rather than forking the whole tree.
 */
function MvpApp() {
  return <AdminAgentShell version="mvp" />
}

/**
 * Entry point. Swaps the entire app between versions based on the active version
 * in VersionContext (driven by the floating PrototypeController). Canonical
 * component-swap pattern — branch at the top, keep each version's tree fully
 * self-contained below it.
 */
export default function App() {
  const { version } = useVersion()
  return version === 'mvp' ? <MvpApp /> : <FutureIdeationApp />
}
