import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar } from 'lucide-react';
import { CollapsedSideNav } from './components/layout/CollapsedSideNav';
import { CloseShell } from './components/close/CloseShell';
import { periods, currentPeriodId, entities } from '../data/company';
import { AIScanningOverlay } from './components/AIScanningOverlay';
import { AIScanBanner } from './components/AIScanBanner';
import { useAppStore, transactions } from '../store/useAppStore';
import { InboxPanel } from './components/inbox/InboxPanel';
import { DetailPanel } from './components/detail/DetailPanel';
import { ResolvePickerModal, type ResolveKind } from './components/resolution/ResolvePickerModal';
import { DismissModal } from './components/resolution/DismissModal';
import { JournalEntryModal } from './components/resolution/JournalEntryModal';
import { CloseTaskModal } from './components/resolution/CloseTaskModal';
import { ThumbsDownModal } from './components/resolution/ThumbsDownModal';
import { RulesListModal } from './components/rules/RulesListModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { InsightsView } from './components/insights/InsightsView';
import { ProfileSettingsPage } from './components/profile/ProfileSettingsPage';
import { RuleDetailModal } from './components/rules/RuleDetailModal';
import { DeactivateRuleDialog } from './components/rules/DeactivateRuleDialog';
import { Toast } from './components/shared/Toast';
import { ActivateRuleDialog } from './components/rules/ActivateRuleDialog';
import { OnboardingWizard, useOnboardingComplete } from './components/OnboardingWizard';

/**
 * Flip to `true` to bring back the AI scanning overlay on initial load.
 *
 * Disabled by default because the prototype's "wow" moment now lives in
 * the inbox + the per-card purple fade-in microanimation, not the
 * full-screen loading state. Kept (not deleted) so we can recall it for
 * demos that benefit from the dramatic reveal.
 *
 * IMPORTANT: even when this is `false`, the post-scan reveal phasing
 * still runs on mount so AI-detected inbox cards get their purple
 * fade-in. The overlay and the fade-in are intentionally decoupled.
 */
const SHOW_SCAN_OVERLAY: boolean = false;

/**
 * Flip to `true` to bring back the first-load onboarding wizard
 * (Ultimate Owner → ERP Field Mapping → Fallback Assignees).
 *
 * Disabled by default so resets land directly in the inbox without
 * forcing the user through setup again. When false, the wizard never
 * renders and the inbox is unlocked from the start — even when the
 * persisted `onboardingDone` flag is still false.
 *
 * Setup is still reachable manually via Settings → General once we're
 * inside the app, so keeping the wizard off doesn't strand the user.
 */
const SHOW_ONBOARDING_WIZARD: boolean = false;

/**
 * Detect — root application component.
 *
 * Thin orchestrator. Domain state lives in the Zustand store; this
 * component only manages which modal is open and the active toast.
 *
 * Layout: left inbox panel + right detail panel. Modals layer on top.
 */
export default function App() {
  const selectedRecordId = useAppStore((s) => s.selectedRecordId);
  const setFilters = useAppStore((s) => s.setFilters);
  const records = useAppStore((s) => s.records);

  // Which product is the user currently viewing? Driven by the side
  // nav. Defaults to Detect (the prototype's primary surface).
  const [currentApp, setCurrentApp] = useState<'detect' | 'close'>('detect');

  // UI-only state (modals, toast, collapse, period)
  const [inboxCollapsed, setInboxCollapsed] = useState(() => {
    try {
      return localStorage.getItem('detect-inbox-collapsed') === '1';
    } catch {
      return false;
    }
  });
  const toggleInbox = () => {
    setInboxCollapsed((v) => {
      const next = !v;
      try {
        localStorage.setItem('detect-inbox-collapsed', next ? '1' : '0');
      } catch {}
      return next;
    });
  };

  const [resolvingRecordId, setResolvingRecordId] = useState<string | null>(null);
  const [resolveKind, setResolveKind] = useState<ResolveKind | null>(null);
  const [dismissRecordId, setDismissRecordId] = useState<string | null>(null);
  const [thumbsDownFor, setThumbsDownFor] = useState<{ recordId: string; flagId: string } | null>(
    null,
  );
  const [rulesOpen, setRulesOpen] = useState(false);
  // Rules workspace modal — opened by the "Rules" button in the
  // toolbar. Hosts both the rules table AND the Add Rule form (the
  // modal manages the transition internally) so the user stays in
  // one surface for the whole Rules workflow.
  const [rulesListOpen, setRulesListOpen] = useState(false);
  // Settings workspace modal — opened by the "Settings" button in
  // the toolbar. Sibling to the Rules modal: same shell + scale,
  // placeholder body for now.
  const [settingsOpen, setSettingsOpen] = useState(false);
  /** Which Settings section to land on when settingsOpen flips to
   *  true. Defaults to 'general'. The "Enable Notifications" banner
   *  jumps users to 'anomaly-assignment' so the Ultimate Owner picker
   *  is the first thing they see. */
  const [settingsInitialSection, setSettingsInitialSection] =
    useState<'general' | 'anomaly-assignment' | 'transaction-details'>('general');
  /** Whether an Ultimate Owner is configured. Drives the
   *  "Enable Notifications" banner inside the DetailPanel. Hydrated
   *  from localStorage, and re-read on the custom
   *  `detect:ultimate-owner-changed` event that the Settings modal
   *  dispatches on Save. */
  const [hasUltimateOwner, setHasUltimateOwner] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('detect-ultimate-owner');
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const refresh = () => {
      try {
        setHasUltimateOwner(!!localStorage.getItem('detect-ultimate-owner'));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('detect:ultimate-owner-changed', refresh);
    return () => window.removeEventListener('detect:ultimate-owner-changed', refresh);
  }, []);
  /** When true, the main column renders the Profile Settings page
   *  instead of the Detect / Close inbox. The user lands here from
   *  the avatar menu's "Profile Settings" item. */
  const [profileOpen, setProfileOpen] = useState(false);
  /** Bumped each time the user picks "Profile Settings" from the
   *  avatar menu. Used as the `key` on ProfileSettingsPage so the
   *  page always remounts on entry — guarantees the user lands on
   *  the Profile tab even if they were previously on Notifications
   *  before navigating away. */
  const [profileOpenCount, setProfileOpenCount] = useState(0);
  const [viewingRuleId, setViewingRuleId] = useState<string | null>(null);
  /** When true, the per-rule modal opens directly in edit mode with
   *  the title "Duplicate Rule" — used by the Duplicate kebab
   *  action so the user lands straight into the pre-populated form. */
  const [duplicatingRule, setDuplicatingRule] = useState(false);
  /** When true, the per-rule modal opens directly in edit mode
   *  (skipping view). Used by the Edit kebab action. */
  const [editingRule, setEditingRule] = useState(false);
  /** Whether the per-rule modal was opened FROM the Rules list
   *  modal (vs. e.g. an anomaly's View Rule link). Drives the
   *  "Back to Rules" breadcrumb — only relevant when there's a
   *  Rules list to go back to. */
  const [ruleModalFromList, setRuleModalFromList] = useState(false);
  /** Id of the rule the user is in the middle of deactivating —
   *  drives the DeactivateRuleDialog warning. */
  const [deactivatingRuleId, setDeactivatingRuleId] = useState<string | null>(null);
  // Mirror state for the activate confirmation modal — same shape as
  // deactivatingRuleId, opens ActivateRuleDialog with a green CTA and
  // an inverse period picker (periods where the rule isn't active).
  const [activatingRuleId, setActivatingRuleId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(SHOW_SCAN_OVERLAY);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedPeriodId, setSelectedPeriodId] = useState(currentPeriodId);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('all');
  /** Top-nav tab. Transactions is the established surface; Insights
   *  is the new "expected-but-missing activity" surface scaffolded
   *  alongside it. Rules moved into a modal (opened from the toolbar
   *  shortcut button) and Settings is now reached via the toolbar
   *  Settings button. */
  type DetectTab = 'transactions' | 'insights';
  const [activeTab, setActiveTab] = useState<DetectTab>('transactions');
  const { done: onboardingDone, markComplete: completeOnboarding } =
    useOnboardingComplete();

  /**
   * Post-scan reveal phasing for the inbox.
   *
   * Originally a 3-phase reveal ('rule-only' → 'ai-revealing' →
   * 'normal') to tell a "rules caught these / AI added more on
   * top" story. In practice the rule-only phase read as a load
   * glitch — the inbox would render 9 rows, sit there for 1.3s,
   * then flash to a larger set when the AI rows joined.
   *
   * Now: start directly in 'ai-revealing' so every row is on
   * screen from the first paint. AI rows still get their purple
   * fade-in highlight; everything settles to 'normal' after the
   * animation. The 'rule-only' enum value is kept so existing
   * call sites (InboxView) don't need to change.
   */
  type RevealPhase = 'rule-only' | 'ai-revealing' | 'normal';
  const [revealPhase, setRevealPhase] = useState<RevealPhase>('ai-revealing');
  const [aiBannerShown, setAiBannerShown] = useState(false);

  const onScanComplete = () => {
    setScanning(false);
    setRevealPhase('ai-revealing');
    setTimeout(() => {
      setRevealPhase('normal');
      setAiBannerShown(true);
    }, 2500);
  };

  useEffect(() => {
    if (SHOW_SCAN_OVERLAY) return;
    setRevealPhase('ai-revealing');
    const t = setTimeout(() => {
      setRevealPhase('normal');
      setAiBannerShown(true);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  // Count records the AI uniquely caught (open AI-only) — used by the banner.
  const aiOnlyOpenCount = records.filter(
    (r) =>
      (r.status === 'open' || r.status === 'flagged') &&
      r.flags.some((f) => f.source.kind === 'ai') &&
      !r.flags.some((f) => f.source.kind === 'rule'),
  ).length;

  const showToast = (msg: string) => setToast(msg);

  const onStartResolve = (recordId: string) => {
    setResolvingRecordId(recordId);
    setResolveKind(null);
  };
  const onPickResolution = (kind: ResolveKind) => {
    if (kind === 'no-action' && resolvingRecordId) {
      useAppStore.getState().resolveRecord(resolvingRecordId, {
        kind: 'no-action',
        at: new Date().toISOString(),
        byId: 'samantha-sheldon',
      });
      showToast('Signed off — no downstream action taken');
      closeResolve();
    } else {
      setResolveKind(kind);
    }
  };
  const closeResolve = () => {
    setResolvingRecordId(null);
    setResolveKind(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900">
      {/* Collapsed side nav — always visible, matches catalyst shell.
           Click the Close or Detect icon to swap the right column. */}
      <CollapsedSideNav
        activeAppId={currentApp}
        onSelectApp={(appId) => {
          // Picking any product icon exits the Profile Settings page
          // (if open) and takes the user back into the product shell.
          if (profileOpen) setProfileOpen(false);
          // When the user clicks the Detect icon directly (i.e. not
          // via the Close→Detect bridge), reset the inbox to its
          // default state — otherwise stale filters from a previous
          // bridge (accountCode, transactionId whitelist, etc.) keep
          // the inbox visibly filtered, which feels broken since the
          // user expected the icon click to "open the inbox fresh".
          if (appId === 'detect' && currentApp !== 'detect') {
            // `clearFilters` is the store's existing reset — it puts
            // filters back to `defaultFilters()` (view:'all',
            // sortBy:'severity', search:'', everything else undefined).
            useAppStore.getState().clearFilters();
            // Drop the active selection too — the previous bridge may
            // have selected a record that no longer makes sense once
            // the filter is cleared.
            useAppStore.getState().selectRecord(null);
            setActiveTab('transactions');
          }
          setCurrentApp(appId);
        }}
        onOpenProfile={() => {
          setProfileOpen(true);
          // Bump on every menu click so the page remounts and
          // resets to the Profile tab, even when profileOpen was
          // already true (e.g. user was on Notifications and
          // re-picked Profile Settings from the avatar menu).
          setProfileOpenCount((n) => n + 1);
        }}
      />

      {/* Profile Settings — dedicated page outside of any product
           shell. The side rail stays visible (rendered above), but the
           rest of the viewport is taken over by this page. */}
      {profileOpen ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          <ProfileSettingsPage key={profileOpenCount} />
        </div>
      ) : currentApp === 'close' ? (
        <CloseShell
          onOpenInDetect={(accountCode, txId, anomalousTxIds) => {
            // When the user clicks an anomalous transaction in Close,
            // we receive the clicked transaction's ERP-style ID
            // (e.g. "BILL-44022"). Internally Detect keys records and
            // transactions by `tx-${erp.toLowerCase()}` (see
            // /data/transactions.ts and /data/seedAnomalies.ts), so
            // we convert before lookups. Prefer the clicked tx's
            // accountCode to figure out the Detect filter — keeps the
            // bridge aligned even if the rec's accountCode and the
            // transaction's accountCode diverge.
            const internalTxId = txId ? `tx-${txId.toLowerCase()}` : undefined;
            const clickedTx = internalTxId
              ? transactions.find((t) => t.id === internalTxId)
              : undefined;
            const filterAccount = clickedTx?.glAccountCode ?? accountCode;

            if (filterAccount) {
              // Reset the inbox to a clean state and apply ONLY the GL
              // account filter — otherwise stale filters (view='open',
              // hideSignedOff, source=AI-only, etc.) can hide every
              // matching record and make the bridge feel broken.
              setFilters({
                view: 'all',
                search: '',
                severity: undefined,
                source: undefined,
                entityId: undefined,
                periodId: undefined,
                assigneeId: undefined,
                ruleId: undefined,
                accountCode: [filterAccount],
                // Restrict the inbox to the exact list of anomalous
                // transactions from the Close view so counts align.
                // Empty list falls back to undefined (no extra filter).
                transactionId:
                  anomalousTxIds && anomalousTxIds.length > 0
                    ? anomalousTxIds
                    : undefined,
                txType: undefined,
                vendorId: undefined,
                department: undefined,
                class: undefined,
                location: undefined,
                currency: undefined,
                submitterId: undefined,
                memoQuery: undefined,
                commented: undefined,
                dateFrom: undefined,
                dateTo: undefined,
                hideSignedOff: undefined,
              });
              // Select the exact record matching the clicked txId so
              // the user lands on the same transaction they clicked.
              // Falls back to the first record for the account if the
              // bridge was invoked without a specific txId.
              const matchingRecord = internalTxId
                ? records.find((r) => r.transactionId === internalTxId)
                : (() => {
                    const txAccount = transactions.filter(
                      (t) => t.glAccountCode === filterAccount,
                    );
                    const acctTxIds = new Set(txAccount.map((t) => t.id));
                    return records.find((r) => acctTxIds.has(r.transactionId));
                  })();
              if (matchingRecord) {
                useAppStore.getState().selectRecord(matchingRecord.id);
              }
            }
            // Reset the top-level Subsidiary selector to "all" so a
            // previously-chosen entity doesn't accidentally filter out
            // the transactions the bridge is trying to show. (1100
            // AR transactions live in entity-uk, but if a user had
            // entity-us selected when they bridged, the inbox would
            // appear empty even with the account filter correct.)
            setSelectedEntityId('all');
            // Reset Detect's tab to Transactions — otherwise if the
            // user was last on Rules/Settings the bridge would land
            // them there instead of the inbox they came to see.
            setActiveTab('transactions');
            setCurrentApp('detect');
          }}
        />
      ) : (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">

      {/* App top nav — white bar with Detect lockup + tab navigation */}
      <div className="shrink-0 border-b border-[#e1e6ef] bg-white">
        <div className="flex h-[60px] items-center gap-6 pl-6 pr-6">
          {/* Detect lockup */}
          <div className="flex shrink-0 items-center gap-3">
            {/* Use vite's BASE_URL so the icon resolves under
                 `/projects/detect-prototype/` in dev + GitHub Pages
                 builds (where `base` is set in vite.config.ts). A
                 plain `/icons/detect.svg` 404s under the base path. */}
            <img src={`${import.meta.env.BASE_URL}icons/detect.svg`} alt="" width={22} height={22} className="block" />
            <span className="font-header text-base font-bold leading-5 text-[#1d2433]">Detect</span>
          </div>

          {/* Tab navigation — Transactions + Insights live at the
                global nav level. Rules moved into a modal opened
                from the toolbar "Rules" button below; Settings
                opens via its own toolbar button. */}
          <nav className="flex h-full items-center gap-6">
            {(
              [
                { id: 'transactions', label: 'Transactions' },
                { id: 'insights', label: 'Insights' },
              ] as const
            ).map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex h-full items-center border-b-2 px-1 py-2 font-header text-[13px] font-bold leading-[18px] tracking-[-0.13px] transition-colors ${
                    active
                      ? 'border-[#1FAC76] text-[#1d2433]'
                      : 'border-transparent text-[#424867] hover:text-[#1d2433]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Period / Rules toolbar */}
      <header className="shrink-0 border-b border-[#e1e6ef] bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Entity selector */}
            <div className="relative w-[147px]">
              <select
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
                className="h-10 w-full appearance-none rounded-md bg-white pl-2 pr-9 font-['Inter'] text-xs font-medium leading-4 text-[#424867] ring-1 ring-inset ring-[#e1e6ef] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-slate-50 focus:outline-none cursor-pointer"
              >
                <option value="all">All Entities</option>
                {entities.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.shortName}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#424867]" />
            </div>
            {/* Period / month selector */}
            <div className="relative w-[200px]">
              <Calendar className="pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#424867]" />
              <select
                value={selectedPeriodId}
                onChange={(e) => setSelectedPeriodId(e.target.value)}
                className="h-10 w-full appearance-none rounded-md bg-white pl-9 pr-9 font-['Inter'] text-xs font-medium leading-4 text-[#424867] ring-1 ring-inset ring-[#e1e6ef] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-slate-50 focus:outline-none cursor-pointer"
              >
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#424867]" />
            </div>
          </div>

          {/* Right-aligned shortcut buttons — toolbar-level entry
                points. "Rules" opens the rules modal; "Settings"
                opens the workspace settings modal. Both remain
                visible across Transactions and Insights so users
                always have a path back to rules + settings
                regardless of which tab they're on. FlowUI
                ToolbarButton pattern: Museo Sans bold, neutral
                border, soft shadow, hover lifts text + border. */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setRulesListOpen(true)}
              className="inline-flex h-10 items-center rounded-md border border-[#e1e6ef] bg-white px-3 font-header text-xs font-bold leading-4 text-[#424867] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:border-[#cbd2e1] hover:text-[#1d2433]"
            >
              Rules
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="inline-flex h-10 items-center rounded-md border border-[#e1e6ef] bg-white px-3 font-header text-xs font-bold leading-4 text-[#424867] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:border-[#cbd2e1] hover:text-[#1d2433]"
            >
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* AI scan banner — disabled for now, preserved for future use
      <AIScanBanner
        show={aiBannerShown && aiOnlyOpenCount > 0}
        count={aiOnlyOpenCount}
        onDismiss={() => setAiBannerShown(false)}
        onFilterAI={() => setFilters({ source: ['ai'] })}
      />
      */}


      {/* Main: tab-conditional. Transactions renders the inbox +
           detail shell; Insights renders its own scaffolded view
           (will grow into an inbox + detail of its own as the
           Insights phases land). */}
      <main className="relative flex min-h-0 flex-1">
        {activeTab === 'insights' ? (
          <InsightsView selectedEntityId={selectedEntityId} selectedPeriodId={selectedPeriodId} />
        ) : (
          <>
            <InboxPanel
              onOpenRules={() => setRulesOpen(true)}
              collapsed={inboxCollapsed}
              onToggleCollapse={toggleInbox}
              revealPhase={revealPhase}
              selectedEntityId={selectedEntityId}
              locked={SHOW_ONBOARDING_WIZARD && !onboardingDone}
            />

            {/* Floating collapse/expand circle on the inbox border */}
            <button
              type="button"
              onClick={toggleInbox}
              title={inboxCollapsed ? 'Expand inbox' : 'Collapse inbox'}
              className="absolute top-[68px] z-40 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-[left] duration-300 hover:bg-neutral-50 hover:text-neutral-900"
              style={{ left: inboxCollapsed ? '-16px' : 'calc(420px - 16px)' }}
            >
              {inboxCollapsed ? (
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              ) : (
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              )}
            </button>

            <DetailPanel
              recordId={selectedRecordId}
              onStartResolve={onStartResolve}
              onStartDismiss={setDismissRecordId}
              onViewRule={(ruleId) => {
                setViewingRuleId(ruleId);
                setRulesOpen(true);
              }}
              onThumbsDown={(recordId, flagId) => setThumbsDownFor({ recordId, flagId })}
              showUltimateOwnerNotice={!hasUltimateOwner}
              onOpenAnomalyAssignment={() => {
                setSettingsInitialSection('anomaly-assignment');
                setSettingsOpen(true);
              }}
            />
          </>
        )}
      </main>

      {/* Modals */}
      {resolvingRecordId && !resolveKind && (
        <ResolvePickerModal onPick={onPickResolution} onClose={closeResolve} />
      )}
      {resolvingRecordId && resolveKind === 'journal-entry' && (
        <JournalEntryModal
          recordId={resolvingRecordId}
          onDone={showToast}
          onClose={closeResolve}
        />
      )}
      {resolvingRecordId && resolveKind === 'close-task' && (
        <CloseTaskModal recordId={resolvingRecordId} onDone={showToast} onClose={closeResolve} />
      )}

      {dismissRecordId && (
        <DismissModal
          recordId={dismissRecordId}
          onDone={showToast}
          onClose={() => setDismissRecordId(null)}
        />
      )}

      {thumbsDownFor && (
        <ThumbsDownModal
          recordId={thumbsDownFor.recordId}
          flagId={thumbsDownFor.flagId}
          onDone={showToast}
          onClose={() => setThumbsDownFor(null)}
        />
      )}

      {rulesOpen && viewingRuleId && (
        <RuleDetailModal
          ruleId={viewingRuleId}
          // Compute the modal mode from the flags. Duplicate opens
          // in a creation-style form with "(Copy) " prepended to the
          // name and a "Duplicate Rule" title. Edit opens directly
          // in the form with Activity Log still visible. View is the
          // default read-only experience.
          mode={
            duplicatingRule ? 'duplicate' : editingRule ? 'edit' : 'view'
          }
          onSaveSuccess={(info) => {
            // Only existing rules being edited (not duplicates, which
            // create a new rule scaffolded from the source) get a
            // version bump — duplicates would start at v1 if we
            // persisted them, but the prototype doesn't yet.
            if (viewingRuleId && !duplicatingRule) {
              const store = useAppStore.getState();

              // Build before/after snapshots for the Activity Log diff.
              // prevSnapshot captures the rule as it exists in the store
              // right now (before any changes). nextSnapshot comes from
              // the form values the user just saved.
              let prevSnapshot: import('../data/types').RuleSnapshot | undefined;
              let nextSnapshot: import('../data/types').RuleSnapshot | undefined;

              if (info.formSnapshot) {
                const currentRule = store.rules.find((r) => r.id === viewingRuleId);
                if (currentRule) {
                  prevSnapshot = {
                    name: currentRule.name,
                    description: currentRule.description,
                    severity: Math.max(
                      1,
                      Math.min(5, Math.ceil(currentRule.severity / 20)),
                    ),
                    // Exclude foundation (Entity/Account) conditions —
                    // they're locked in the form and never change, so
                    // they'd just noise up the Activity Log diff.
                    conditions: currentRule.conditions
                      .filter((c) => c.field !== 'subsidiary' && c.field !== 'account')
                      .map((c) => ({
                        field: c.field,
                        operator: String(c.operator),
                        value: Array.isArray(c.value)
                          ? `${c.value[0]} and ${c.value[1]}`
                          : String(c.value ?? ''),
                      })),
                  };
                  // Persist the edited name/description/severity to the
                  // store so the rule view reflects the changes after
                  // the user saves. Conditions are too complex to round-
                  // trip through the form's format, so they stay as-is
                  // in the store (the snapshot captures what the user saw).
                  store.updateRule(viewingRuleId, {
                    name: info.formSnapshot.name,
                    description: info.formSnapshot.description,
                    severity: info.formSnapshot.severity * 20,
                  });
                }
                nextSnapshot = {
                  name: info.formSnapshot.name,
                  description: info.formSnapshot.description,
                  severity: info.formSnapshot.severity,
                  conditions: info.formSnapshot.conditions,
                };
              }

              store.bumpRuleVersion(
                viewingRuleId,
                info.scope,
                info.historicalPeriods,
                prevSnapshot,
                nextSnapshot,
              );
            }
            showToast('Your rule has been successfully saved');
          }}
          // Kebab actions inside the view modal — Duplicate flips the
          // same modal into duplicate mode (re-renders with the
          // "(Copy) " prefilled name and "Duplicate Rule" title);
          // Deactivate opens the warning dialog on top of the modal.
          onDuplicate={() => setDuplicatingRule(true)}
          onDeactivate={() => setDeactivatingRuleId(viewingRuleId)}
          onActivate={() => {
            // Open the activate confirmation dialog (mirrors the
            // deactivate dialog). Status flip happens on confirm.
            if (viewingRuleId) setActivatingRuleId(viewingRuleId);
          }}
          // Back-to-Rules breadcrumb only appears when the modal was
          // opened from the Rules list. Reopens the list modal on
          // click; the detail modal closes via its own state reset.
          onBackToList={
            ruleModalFromList
              ? () => {
                  setRulesOpen(false);
                  setViewingRuleId(null);
                  setDuplicatingRule(false);
                  setEditingRule(false);
                  setRuleModalFromList(false);
                  setRulesListOpen(true);
                }
              : undefined
          }
          onClose={() => {
            setRulesOpen(false);
            setViewingRuleId(null);
            setDuplicatingRule(false);
            setEditingRule(false);
            setRuleModalFromList(false);
          }}
        />
      )}

      </div>
      )}

      {/* Modals and overlays sit outside the column structure so they cover everything */}
      {settingsOpen && (
        <SettingsModal
          onClose={() => {
            setSettingsOpen(false);
            // Reset so the next manual open from the toolbar lands on
            // General again instead of remembering the banner's jump.
            setSettingsInitialSection('general');
          }}
          onSaveSuccess={(sectionLabel) =>
            showToast(`${sectionLabel} settings saved`)
          }
          initialSection={settingsInitialSection}
        />
      )}
      {rulesListOpen && (
        <RulesListModal
          onClose={() => setRulesListOpen(false)}
          onSaveSuccess={(_info) => {
            // The Rules list modal hosts the Add Rule form for new
            // rules — those don't have a rule ID to bump (the
            // prototype doesn't persist newly-created rules to the
            // store yet), so no version action here. Just the toast.
            showToast('Your rule has been successfully saved');
          }}
          onOpenRule={(ruleId) => {
            // Per-rule view opens the new RuleDetailModal (Add-Rule
            // form pre-populated with this rule). Close the list
            // modal first so they don't stack visually. The
            // ruleModalFromList flag enables the "Back to Rules"
            // breadcrumb in the detail modal so the user can
            // navigate back here without dismissing the whole modal.
            setRulesListOpen(false);
            setViewingRuleId(ruleId);
            setRuleModalFromList(true);
            setRulesOpen(true);
          }}
          onEditRule={(ruleId) => {
            // Edit from kebab opens the modal directly in edit mode
            // (skipping view). Activity Log stays visible below the
            // form. Back-to-Rules breadcrumb is enabled.
            setRulesListOpen(false);
            setViewingRuleId(ruleId);
            setEditingRule(true);
            setRuleModalFromList(true);
            setRulesOpen(true);
          }}
          onDuplicateRule={(ruleId) => {
            // Duplicate opens the same modal but skips the view-only
            // sections — straight into the form, pre-populated with
            // the source rule's data, titled "Duplicate Rule" so the
            // user knows this is a new rule, not an edit.
            // Back-to-Rules breadcrumb is enabled.
            setRulesListOpen(false);
            setViewingRuleId(ruleId);
            setDuplicatingRule(true);
            setRuleModalFromList(true);
            setRulesOpen(true);
          }}
          onDeactivateRule={(ruleId) => {
            // Deactivate opens a warning dialog on top of the Rules
            // list modal — confirm impact + pick scope (current
            // period only / current + future). Keeps the list modal
            // open underneath so the user can pick another rule
            // after dismissing.
            setDeactivatingRuleId(ruleId);
          }}
          onActivateRule={(ruleId) => {
            // Open the activate confirmation dialog — same pattern as
            // deactivate. Users pick scope (historical vs. future) and
            // periods to activate the rule for. The status flip happens
            // on confirm.
            setActivatingRuleId(ruleId);
          }}
        />
      )}

      {deactivatingRuleId && (
        <DeactivateRuleDialog
          ruleId={deactivatingRuleId}
          onCancel={() => setDeactivatingRuleId(null)}
          onConfirm={() => {
            // Flip the rule's status to inactive in the store so
            // the table's status tag (and any other store-driven UI)
            // reflects the deactivation immediately. Record
            // deactivatedAt so the Activity Log can render a
            // "Deactivated" entry with the correct timestamp.
            const id = deactivatingRuleId;
            setDeactivatingRuleId(null);
            const updated = useAppStore
              .getState()
              .updateRule(id, {
                status: 'inactive',
                deactivatedAt: new Date().toISOString(),
                activatedAt: '',
              });
            if (updated) showToast(`"${updated.name}" deactivated`);
            else showToast('Rule deactivated');
          }}
        />
      )}
      {activatingRuleId && (
        <ActivateRuleDialog
          ruleId={activatingRuleId}
          onCancel={() => setActivatingRuleId(null)}
          onConfirm={() => {
            // Flip status back to active, clear deactivatedAt so the
            // "Deactivated" entry disappears, and set activatedAt so
            // the "Activated" entry appears in the Activity Log.
            const id = activatingRuleId;
            setActivatingRuleId(null);
            const updated = useAppStore
              .getState()
              .updateRule(id, {
                status: 'active',
                deactivatedAt: '',
                activatedAt: new Date().toISOString(),
              });
            if (updated) showToast(`"${updated.name}" activated`);
            else showToast('Rule activated');
          }}
        />
      )}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      {scanning && <AIScanningOverlay onComplete={onScanComplete} />}
      {/* Onboarding sequence — three-step setup wizard
           (Ultimate Owner → ERP Mapping → Fallback Assignees).
           Gated on SHOW_ONBOARDING_WIZARD so resets don't force the user
           through setup again. Flip the constant at the top of the file
           to bring it back. */}
      {SHOW_ONBOARDING_WIZARD && !onboardingDone && (
        <OnboardingWizard
          onComplete={(ultimateOwnerId, mappings, assignments) => {
            completeOnboarding(ultimateOwnerId, mappings, assignments);
            // Hand-off toast on close — confirms setup is done and
            // gives the user a breadcrumb to where the settings live
            // so they can revisit any of the three configurations
            // without re-running the wizard.
            showToast(
              "Setup complete. Change any of these later under Settings → General.",
            );
          }}
        />
      )}
    </div>
  );
}
