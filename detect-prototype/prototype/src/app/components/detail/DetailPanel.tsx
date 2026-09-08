import { Fragment, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import type { AnomalyRecord, AccountFingerprintMonth, GLLine, GhostContext, Rule, Transaction } from '../../../data/types';
import { useAppStore, transactions, isRecordFullyResolved } from '../../../store/useAppStore';
import { getTeamMember, currentUserId } from '../../../data/team';
import { TransactionDetails } from './TransactionDetails';
import { CommentsCard } from './CommentsCard';
import { ActivityCard } from './ActivityCard';
import { InboxZeroSummary } from './InboxZeroSummary';
import { ThumbsControl } from '../shared/ThumbsControl';
import { AssigneeReasonPopover } from '../shared/AssigneeReasonPopover';
import type { AnomalyFlag, FlagFeedback, MatchedCondition, RuleCondition, RuleConditionOperator } from '../../../data/types';
import { Sparkles, CircleDashed, Check, Pencil, X, Plus, AlertCircle, UserCheck, ChevronDown, ChevronRight, Search, Trash2 } from 'lucide-react';
import Info from '@floqastinc/flow-ui_icons/material/Info';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { team } from '../../../data/team';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { ConfirmDialog } from './ConfirmDialog';
import { getTransactionFieldLabel } from '../../../data/transactionFields';
import { SeverityBadge } from '../shared/SeverityBadge';

interface Props {
  recordId: string | null;
  onStartResolve: (recordId: string) => void;
  onStartDismiss: (recordId: string) => void;
  onViewRule: (ruleId: string) => void;
  onThumbsDown: (recordId: string, flagId: string) => void;
  /** Renders the "Enable Notifications" banner above the detail content
   *  when no Ultimate Owner is configured. When a transaction is loaded
   *  the banner constrains to the main article column (not the
   *  Assignees / Comments sidebar); when no transaction is selected it
   *  spans the empty-state body. The banner can be temporarily dismissed
   *  for the current view via its X button — that dismissal is in-memory
   *  only and resets when the user navigates to another transaction or
   *  reloads. Setting an Ultimate Owner clears the banner permanently. */
  showUltimateOwnerNotice?: boolean;
  /** Opens the Settings modal directly on Anomaly Assignment so the
   *  user can pick an Ultimate Owner. */
  onOpenAnomalyAssignment?: () => void;
}

/**
 * Detail panel rebuilt to match the original Figma Make visual design:
 *
 *   - Neutral gray background (neutral-50)
 *   - Main content sits in a single white rounded card with soft border
 *   - Header inside the card: anomaly type in Playfair + Risk pill,
 *     transaction ID · date · amount, subsidiary · account, ownership line
 *   - "Why was this flagged" renders below with stacked flag cards
 *   - Transaction details below that
 *   - Sticky action footer at the bottom of the panel
 *
 * Flags-first order and all interactive behavior preserved from the
 * prior version.
 */
export function DetailPanel({
  recordId,
  onStartResolve,
  onStartDismiss,
  onViewRule,
  onThumbsDown,
  showUltimateOwnerNotice = false,
  onOpenAnomalyAssignment,
}: Props) {
  // "Enable Notifications" banner — rendered above the detail content
  // when no Ultimate Owner is configured. The dismissed flag is local
  // state, intentionally non-persisted: clicking the X tucks the banner
  // away to free up space in the current view, but the banner reappears
  // on navigation (recordId change) or page reload. Setting an Ultimate
  // Owner in Settings clears the banner permanently via the parent's
  // `showUltimateOwnerNotice` prop.
  const [ultimateOwnerNoticeDismissed, setUltimateOwnerNoticeDismissed] = useState(false);
  useEffect(() => {
    // Reset dismissal whenever the user navigates to a different record
    // (including back to the empty state), so the banner reappears in
    // each new view until they configure notifications.
    setUltimateOwnerNoticeDismissed(false);
  }, [recordId]);
  const ultimateOwnerBanner = showUltimateOwnerNotice && !ultimateOwnerNoticeDismissed ? (
    <div className="flex items-start gap-3 rounded-md border border-[#3D7BF7] bg-[#F0F5FF] px-4 py-3">
      <Info
        size={16}
        color="#3D7BF7" /* --flo-sem-color-info-primary */
        style={{ flexShrink: 0, marginTop: 1 }}
      />
      <p className="flex-1 font-['Inter'] text-[12px] font-normal leading-[18px] text-[#1d2433]">
        <span className="font-semibold">Enable Notifications:</span>{' '}
        Set up Anomaly Assignments to alert users about transaction
        assignments, anomalies, and comments.{' '}
        <button
          type="button"
          onClick={() => onOpenAnomalyAssignment?.()}
          className="font-['Inter'] text-[12px] font-semibold leading-[18px] text-[#1d2433] underline underline-offset-2 transition-colors hover:text-[#424867]"
          /* Text-link color matches the body copy (#1d2433), bold +
             underlined to read as a link. Hover lightens to neutral-700
             (#424867) to signal interactivity. */
        >
          Configure in Settings
        </button>
      </p>
      <button
        type="button"
        onClick={() => setUltimateOwnerNoticeDismissed(true)}
        aria-label="Dismiss notification"
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#6b7280] transition-colors hover:bg-[#dde7ff] hover:text-[#1d2433]"
      >
        <X size={14} />
      </button>
    </div>
  ) : null;

  // Two-phase transition: when the selected record changes, recede the
  // old one into the background, then lift the new one up from the bottom.
  // `displayedId` is what's actually being rendered; it trails `recordId`
  // during the exit phase.
  const [displayedId, setDisplayedId] = useState<string | null>(recordId);
  const [stage, setStage] = useState<'idle' | 'exit' | 'enter'>('idle');
  // Anomalies section is collapsible — expanded by default, mirrors the
  // Transaction Details / GL Impact pattern (chevron toggle on the right).
  const [anomaliesExpanded, setAnomaliesExpanded] = useState(true);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    // Skip animation on first mount — `displayedId` was just
    // initialized from `recordId` via useState, so there's nothing
    // to fade out or in. Mounting from a cross-app navigation (e.g.
    // Close → Detect via the bridge) hits this path and used to get
    // stuck at stage='exit' with opacity 0; the early return below
    // keeps stage='idle' until the user actually switches records.
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (recordId === displayedId) return;

    // Snap (no exit phase) when transitioning from "no record"
    // to a record (or vice versa). The exit animation only makes
    // sense as a fade-between-two-records gesture.
    if (displayedId == null || recordId == null) {
      setDisplayedId(recordId);
      setStage('idle');
      return;
    }

    setStage('exit');
    const t1 = setTimeout(() => {
      setDisplayedId(recordId);
      setStage('enter');
      const t2 = setTimeout(() => setStage('idle'), 340);
      return () => clearTimeout(t2);
    }, 240);
    return () => clearTimeout(t1);
  }, [recordId, displayedId]);

  const record = useAppStore(
    (s) => s.records.find((r) => r.id === displayedId) ?? null,
  );
  const rules = useAppStore((s) => s.rules);
  const records = useAppStore((s) => s.records);
  const view = useAppStore((s) => s.filters.view);
  const recordFeedback = useAppStore((s) => s.recordFeedback);
  const clearFeedback = useAppStore((s) => s.clearFeedback);
  const resolveRecord = useAppStore((s) => s.resolveRecord);
  const reopenRecord = useAppStore((s) => s.reopenRecord);

  const transaction = useMemo(
    () => (record ? transactions.find((t) => t.id === record.transactionId) : null),
    [record],
  );

  const stageClass =
    stage === 'exit'
      ? '[animation:detail-exit_240ms_cubic-bezier(0.4,0,1,1)_both]'
      : stage === 'enter'
        ? '[animation:detail-enter_340ms_cubic-bezier(0.2,0,0,1)_both]'
        : '';

  // Ghost records have no underlying transaction — show a different panel
  // (must come before the !transaction guard below)
  if (record && record.kind === 'ghost' && record.ghostContext) {
    return (
      <section className={`flex h-full flex-1 flex-col overflow-hidden bg-white ${stageClass}`}>
        <style>{`
          @keyframes detail-exit {
            0%   { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
            100% { opacity: 0; transform: scale(0.96) translateY(-8px); filter: blur(4px); }
          }
          @keyframes detail-enter {
            0%   { opacity: 0; transform: translateY(48px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 px-6 pb-6 pt-4">
            <GhostReviewHeader record={record} />
            <div className="flex flex-col items-stretch gap-6 xl:flex-row xl:items-start">
              <article className="min-w-0 flex-1 rounded-lg border border-amber-200 bg-white p-8">
                <GhostDetailContent record={record} ctx={record.ghostContext} />
              </article>
              <aside className="w-full shrink-0 space-y-6 xl:w-[560px]">
                <CommentsCard recordId={record.id} />
                <ActivityCard recordId={record.id} />
              </aside>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!record || !transaction) {
    const myOpenCount = records.filter(
      (r) =>
        (r.status === 'open' || r.status === 'flagged') &&
        r.assigneeIds.includes(currentUserId),
    ).length;
    if (myOpenCount === 0) {
      return <InboxZeroSummary />;
    }
    return (
      <section className="flex h-full flex-1 flex-col bg-white">
        {/* Banner spans the full empty-state container. Outer padding
             (px-6 pt-4) matches the loaded-state container so the banner
             starts at the same x/y position regardless of selection. */}
        {ultimateOwnerBanner && <div className="px-6 pt-4">{ultimateOwnerBanner}</div>}
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          {/* Stacked cards illustration — mirrors Figma node 391:20148 */}
          <div className="relative h-[150px] w-[360px] shrink-0 overflow-hidden">
            {/* Inner wrapper centered in container, matching Figma structure */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[150px] w-[360px] overflow-clip">
              {/* Card 3 — bottom */}
              <div className="absolute left-[101px] top-[104px] h-[41px] w-[158px] rounded-[6px] border border-[#e1e6ef] bg-white">
                <div className="absolute left-2 h-[6px] w-[38px] rounded-[3px] bg-[#e1e6ef] -translate-y-1/2" style={{ top: 'calc(50% - 5.5px)' }} />
                <div className="absolute left-2 h-[6px] w-[87px] rounded-[3px] bg-[#e1e6ef] -translate-y-1/2" style={{ top: 'calc(50% + 6.5px)' }} />
                <div className="absolute right-[4px] size-[24px] -translate-y-1/2" style={{ top: 'calc(50% - 0.5px)' }}>
                  <img alt="" className="absolute inset-0 block size-full max-w-none" src="https://www.figma.com/api/mcp/asset/a983189f-b8f1-43c2-aa16-b9de8e093d9d" />
                </div>
              </div>
              {/* Card 2 — middle (Figma image asset: avatar + lines + toggle) */}
              <div className="absolute left-1/2 top-[54px] -translate-x-1/2 h-[41px] w-[158px]">
                <img alt="" className="absolute inset-0 block size-full max-w-none" src="https://www.figma.com/api/mcp/asset/a4c159e2-9faf-47bf-a5ae-30d0926391b6" />
              </div>
              {/* Card 1 — top, empty */}
              <div className="absolute left-1/2 top-[4px] -translate-x-1/2 h-[41px] w-[158px] rounded-[6px] border border-[#e1e6ef] bg-white" />
              {/* Plus icon (⊕) — right edge of Card 1 */}
              <div className="absolute left-[249px] top-[15px] size-[20px]">
                <img alt="" className="absolute inset-0 block size-full max-w-none" src="https://www.figma.com/api/mcp/asset/32d51eaa-8465-4f3b-b444-298f09570c01" />
              </div>
            </div>
          </div>
          {/* Caption */}
          <div className="flex flex-col items-center p-6 w-full">
            <p className="font-medium text-[13px] leading-[18px] text-[#424867] text-center">
              Select a transaction from the list to review its anomalies
            </p>
          </div>
        </div>
      </section>
    );
  }

  const rulesById = new Map(rules.map((r) => [r.id, r]));

  const flagsSorted = [...record.flags].sort((a, b) => b.severity - a.severity);

  return (
    <section className="flex h-full flex-1 flex-col overflow-hidden bg-white">
      {/* Scrolling body with two-phase transition: exit (recede + dissolve)
           then enter (slide up from bottom) */}
      <div className={`min-h-0 flex-1 overflow-y-auto ${stageClass}`}>
        <style>{`
          @keyframes detail-exit {
            0%   { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
            100% { opacity: 0; transform: scale(0.96) translateY(-8px); filter: blur(4px); }
          }
          @keyframes detail-enter {
            0%   { opacity: 0; transform: translateY(48px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div className="flex flex-col gap-6 px-6 pb-6 pt-4">
          {/* Two-column layout: main card + sidebar */}
          <div className="flex flex-col items-stretch gap-6 xl:flex-row xl:items-start">
          {/* Main column — wraps the article (and the "Enable
               Notifications" banner when no Ultimate Owner is set). The
               banner shares this column's width so it spans only the
               transaction details, not the Assignees / Comments sidebar
               to the right. */}
          <div className="flex min-w-0 flex-1 flex-col gap-6">
          {ultimateOwnerBanner}
          {/* Main card — anomaly header, ordered to mirror the inbox card */}
          <article className="min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-white">
            {/* Header — mirrors the Comments / Activity Log card header
                 pattern: title row inside a px-6 py-4 box, full-width
                 divider directly below. */}
            {/* Header — title only. Per-record sign-off lives in the
                 Assignees card, so the header no longer carries a toggle. */}
            <header className="flex items-center gap-2 px-6 py-4">
              {/* Title: ID + (Line N), bold, underlined. Rendered as an
                   anchor — in production this opens the transaction in
                   the ERP. The hover treatment matches the rule-fired
                   anomaly title elsewhere on this card (subtle: only
                   the underline darkens; no text-colour shift, no
                   external-link icon). */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-1.5 font-header text-base font-bold leading-5 text-[#1d2433] underline underline-offset-2 decoration-[#1d2433]/40 hover:decoration-[#1d2433]"
                title="Open in ERP"
              >
                {transaction.transactionId}
                {transaction.transactionLine && ` · ${transaction.transactionLine}`}
              </a>
              {/* Severity badge — sits inline with the transaction title so it
                   reads as an attribute of this record, matching the inbox
                   card's right-rail score. */}
              <SeverityBadge
                severity={record.primarySeverity}
                breakdown={record.flags[0]?.scoreBreakdown}
                size="sm"
              />
              {/* Status badge — surfaced only when the record is in a
                   non-default state. Resolved gets the same green
                   check-stamp visual the inbox uses so the two
                   surfaces feel of-a-piece; "Re-review" surfaces when
                   a sign-off is stale (a flag landed after the
                   attestation, so the record is back in the Open
                   queue until the assignee re-confirms). Plain Open
                   renders nothing — it's the default state and
                   doesn't need to call itself out. */}
              {(() => {
                const isResolved = isRecordFullyResolved(record);
                const hasAnyStale = record.signOffs
                  ? Object.values(record.signOffs).some((so) =>
                      record.flags.some(
                        (f) =>
                          new Date(f.detectedAt).getTime() >
                          new Date(so.at).getTime(),
                      ),
                    )
                  : false;
                const needsReReview = !isResolved && hasAnyStale;
                if (isResolved) {
                  return (
                    <span className="ml-auto inline-flex items-center rounded-[4px] bg-[#ecfff8] px-1.5 py-0.5 font-['Inter'] text-[10px] font-semibold leading-[14px] text-[#1FAC76]">
                      Resolved
                    </span>
                  );
                }
                if (needsReReview) {
                  return (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-[4px] bg-[#fff8eb] px-1.5 py-0.5 font-['Inter'] text-[10px] font-semibold leading-[14px] text-[#db7712]">
                      <AlertCircle className="h-2.5 w-2.5" strokeWidth={2.5} />
                      Redo
                    </span>
                  );
                }
                return null;
              })()}
            </header>

            <div className="border-t border-[#e1e6ef]" />

            <div className="px-6 py-4">
              <TransactionDetails
                transaction={transaction}
                showDivider={false}
              />

            <GLImpactSection transaction={transaction} />

            {/* Why was this flagged — section header outside the gray box,
                 mirroring the Transaction details / GL Impact treatment.
                 Collapsible chevron on the right; expanded by default. */}
            <section className="mt-6 border-t border-[#e1e6ef] pt-6">
              <div className="flex w-full items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setAnomaliesExpanded((v) => !v)}
                  className="flex flex-1 items-center text-left"
                >
                  <h3 className="font-['Inter'] text-[14px] font-semibold leading-5 text-[#1d2433]">
                    Anomalies
                    {flagsSorted.length > 0 && (
                      <span className="font-normal"> ({flagsSorted.length})</span>
                    )}
                  </h3>
                </button>
                <button
                  type="button"
                  onClick={() => setAnomaliesExpanded((v) => !v)}
                  className="text-neutral-500 hover:text-neutral-900"
                  aria-label={anomaliesExpanded ? 'Collapse Anomalies' : 'Expand Anomalies'}
                >
                  {anomaliesExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
              {anomaliesExpanded && (
                <div className="mt-4">
                  {flagsSorted.map((f) => (
                    <FlagBlock
                      key={f.id}
                      flag={f}
                      rule={f.source.kind === 'rule' ? rulesById.get(f.source.ruleId) : undefined}
                      transaction={transaction}
                      isPrimary={false}
                      onViewRule={onViewRule}
                      onThumbsUp={() => recordFeedback(record.id, f.id, 'up')}
                      onThumbsDown={() => onThumbsDown(record.id, f.id)}
                      onThumbsClear={() => clearFeedback(record.id, f.id)}
                    />
                  ))}
                </div>
              )}
            </section>
            </div>
          </article>
          </div>

          {/* Right column — assignees, comments, activity (stacked on
                narrow viewports). Width tightened to 480px so the
                Assignees card hugs its content (no trailing space after
                the signer block). Comments + Activity still have plenty
                of horizontal room for their content at this width. */}
          <aside className="w-full shrink-0 space-y-6 xl:w-[480px]">
            <AssigneesCard
              record={record}
              transaction={transaction}
              onStartResolve={onStartResolve}
            />
            <CommentsCard recordId={record.id} />
            <ActivityCard recordId={record.id} />
          </aside>
          </div>{/* end two-column */}
        </div>
      </div>

    </section>
  );
}

// ── Ghost record components ──────────────────────────────────────────────

function GhostReviewHeader({ record }: { record: AnomalyRecord }) {
  const assignees = record.assigneeIds
    .map((id) => getTeamMember(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getTeamMember>>[];

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-6 py-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {assignees.map((member) => (
            <div key={member.id} className="flex shrink-0 items-center gap-2.5">
              <img
                src={member.avatar}
                alt={member.name}
                className="h-7 w-7 rounded-full border border-neutral-200 object-cover"
              />
              <p className="text-sm font-medium text-neutral-900">{member.name}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                <span className="h-2 w-2 rounded-full bg-neutral-400 inline-block" />
                Pending
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GhostDetailContent({ record, ctx }: { record: AnomalyRecord; ctx: GhostContext }) {
  const currentMonth = ctx.fingerprint[ctx.fingerprint.length - 1];
  const priorMonths = ctx.fingerprint.slice(0, -1);
  const streak = priorMonths.filter((m) => m.hasEntry).length;

  return (
    <>
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CircleDashed className="h-5 w-5 text-amber-500" />
            <span className="font-display text-xl font-semibold tracking-tight text-neutral-900">
              {ctx.glAccountCode} {ctx.glAccountName}
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-500">{ctx.categoryLabel} · April 2026</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-amber-400 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
          <CircleDashed className="h-3.5 w-3.5" />
          Expected — not found
        </span>
      </header>

      {/* AI reasoning */}
      <div className="mt-6 rounded-lg bg-purple-50 px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span className="text-xs font-semibold uppercase tracking-wide text-purple-600">AI detected</span>
        </div>
        <p className="text-sm leading-relaxed text-neutral-700">{ctx.modelReasoning}</p>
        {ctx.expectedVendor && ctx.typicalAmount && (
          <div className="mt-3 grid grid-cols-3 gap-4 rounded-lg bg-white/70 px-4 py-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Expected vendor</p>
              <p className="mt-1 font-display text-sm tracking-tight text-neutral-900">{ctx.expectedVendor}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Typical amount</p>
              <p className="mt-1 font-display text-sm tracking-tight text-neutral-900">${ctx.typicalAmount.toLocaleString('en-US')}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Consecutive months</p>
              <p className="mt-1 font-display text-sm tracking-tight text-neutral-900">{streak}</p>
            </div>
          </div>
        )}
      </div>

      {/* Account fingerprint timeline */}
      <section className="mt-6 border-t border-neutral-200 pt-6">
        <div className="flex items-baseline gap-2">
          <h3 className="font-display text-base tracking-tight text-neutral-900">Account Fingerprint</h3>
          <span className="text-sm text-neutral-400">{ctx.fingerprint.length} months</span>
        </div>
        <AccountFingerprintTimeline fingerprint={ctx.fingerprint} />
      </section>
    </>
  );
}

function AccountFingerprintTimeline({ fingerprint }: { fingerprint: AccountFingerprintMonth[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 w-24">Period</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Entry</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 w-28">Vendor</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500 w-28">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {fingerprint.map((month) => {
            const isCurrent = month === fingerprint[fingerprint.length - 1];
            return (
              <tr
                key={month.periodLabel}
                className={isCurrent ? 'bg-amber-50' : 'bg-white'}
              >
                <td className="px-4 py-3 text-xs font-medium text-neutral-700 whitespace-nowrap">
                  {month.periodLabel}
                  {isCurrent && (
                    <span className="ml-1.5 rounded bg-amber-100 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                      current
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {month.hasEntry ? (
                    <span className="font-mono text-xs text-neutral-600">{month.transactionId}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                      <CircleDashed className="h-3 w-3" />
                      Not posted
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500 truncate max-w-[120px]">
                  {month.vendorName ?? '—'}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-neutral-900">
                  {month.amount ? `$${month.amount.toLocaleString('en-US')}` : (
                    <span className="text-neutral-300">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Derives plausible double-entry GL lines from a transaction. Uses
 * `transaction.glLines` if explicitly set; otherwise builds an entry where:
 *   - The flagged line (matching `tx.transactionLine`) sits at the correct
 *     position with the transaction's amount as a debit to its GL account.
 *   - Lines before the flagged line are small filler debit allocations.
 *   - The final line is a balancing credit to a type-appropriate offset
 *     account (AP, cash, accrued, retained earnings).
 *
 * This keeps the inbox-card "Line N" reference internally consistent with
 * the GL Impact table — Line N always exists, and it's the row that was
 * flagged.
 */
function deriveGLLines(tx: Transaction): GLLine[] {
  if (tx.glLines && tx.glLines.length > 0) return tx.glLines;

  const amount = tx.amount;
  const desc = tx.memo || tx.vendorName || tx.transactionId;

  // Parse "Line N" → N. Default to 1 if absent / unparseable.
  const flaggedLineNum = (() => {
    const m = tx.transactionLine?.match(/Line\s+(\d+)/i);
    const n = m ? parseInt(m[1], 10) : 1;
    return Math.max(1, n);
  })();

  // Type-appropriate offsetting credit account
  const offset = (() => {
    switch (tx.type) {
      case 'payment':
        return { code: '1010', name: 'Cash - Operating (JPMorgan)', desc };
      case 'expense-report':
        return { code: '2100', name: 'Accrued Expenses', desc: 'Employee reimbursable' };
      case 'journal-entry':
        return { code: '3000', name: 'Retained Earnings', desc: 'Offsetting entry' };
      case 'vendor-bill':
      case 'purchase-order':
      default:
        return { code: '2000', name: 'Accounts Payable', desc };
    }
  })();

  // For payments, the flagged line is itself a debit to AP being cleared,
  // not the GL account on the transaction. Preserve the original semantics.
  const flaggedLine: Omit<GLLine, 'lineNumber'> =
    tx.type === 'payment'
      ? { accountCode: '2000', accountName: 'Accounts Payable', description: desc, debit: amount, credit: 0 }
      : { accountCode: tx.glAccountCode, accountName: tx.glAccountName, description: desc, debit: amount, credit: 0 };

  const lines: GLLine[] = [];

  // Filler debit lines before the flagged line. Small, plausible
  // allocations to a generic operating expense bucket so the entry reads
  // like a multi-line allocation. Each filler is ~3% of the flagged amount.
  for (let i = 1; i < flaggedLineNum; i++) {
    const fillerAmount = Math.max(50, Math.round(amount * 0.03 * i));
    lines.push({
      lineNumber: i,
      accountCode: '6000',
      accountName: 'Operating Expenses — Allocation',
      description: 'Allocated portion',
      debit: fillerAmount,
      credit: 0,
    });
  }

  // The flagged line at its correct position
  lines.push({ lineNumber: flaggedLineNum, ...flaggedLine });

  // Balancing credit line for the entire entry
  const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
  lines.push({
    lineNumber: flaggedLineNum + 1,
    accountCode: offset.code,
    accountName: offset.name,
    description: offset.desc,
    debit: 0,
    credit: totalDebit,
  });

  return lines;
}

function GLImpactLineCount({ transaction }: { transaction: Transaction }) {
  const count = deriveGLLines(transaction).length;
  return (
    <span className="ml-1 font-normal text-[#1d2433]/65">
      · {count} {count === 1 ? 'Line' : 'Lines'}
    </span>
  );
}

/**
 * Collapsible GL Impact section. Mirrors the Transaction Details
 * collapse pattern: chevron toggle on the right, click anywhere on the
 * header row to expand / collapse.
 */
function GLImpactSection({ transaction }: { transaction: Transaction }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="mt-6 border-t border-[#e1e6ef] pt-6">
      <div className="flex w-full items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex flex-1 items-center text-left"
        >
          <h3 className="font-['Inter'] text-[14px] font-semibold leading-5 text-[#1d2433]">
            GL Impact
          </h3>
        </button>
        <div className="flex items-center gap-2">
          {/* Export — outlined secondary button (FlowUI Button variant="outlined") */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // Stub action for now — in production this would emit a CSV
              // or PDF of the GL impact lines.
            }}
            className="inline-flex h-8 items-center justify-center rounded-md border-[1.4px] border-[#cbd2e1] bg-transparent px-3 font-header text-xs font-bold leading-4 tracking-[-0.12px] text-[#6b7280] transition-colors hover:border-[#6b7280] hover:text-[#1d2433]"
          >
            Export
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-neutral-500 hover:text-neutral-900"
            aria-label={expanded ? 'Collapse GL Impact' : 'Expand GL Impact'}
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {expanded && <GLImpactTable transaction={transaction} />}
    </section>
  );
}

function GLImpactTable({ transaction }: { transaction: Transaction }) {
  const lines = deriveGLLines(transaction);
  const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
  const totalCredit = lines.reduce((s, l) => s + l.credit, 0);
  const lastLineIdx = lines.length - 1;

  // Cap at 10 data rows (header 50px + 10 * 42px) before vertical scroll kicks in.
  return (
    <div className="mt-4 max-h-[470px] overflow-auto rounded-md border border-[#e1e6ef] bg-white">
      <table className="w-full min-w-[520px] font-['Inter']">
        <thead>
          <tr>
            <th className="sticky top-0 z-10 h-[50px] w-[75px] border-b border-[#e1e6ef] bg-[#f8fafc] px-4 text-left text-[12px] font-semibold leading-4 text-[#1b1f27]">Line</th>
            <th className="sticky top-0 z-10 h-[50px] w-[194px] border-b border-[#e1e6ef] bg-[#f8fafc] px-4 text-left text-[12px] font-semibold leading-4 text-[#1b1f27]">Account</th>
            <th className="sticky top-0 z-10 h-[50px] border-b border-[#e1e6ef] bg-[#f8fafc] px-4 text-left text-[12px] font-semibold leading-4 text-[#1b1f27]">Memo</th>
            <th className="sticky top-0 z-10 h-[50px] w-[150px] border-b border-[#e1e6ef] bg-[#f8fafc] px-4 text-right text-[12px] font-semibold leading-4 text-[#1b1f27]">Debit</th>
            <th className="sticky top-0 z-10 h-[50px] w-[125px] border-b border-[#e1e6ef] bg-[#f8fafc] px-4 text-right text-[12px] font-semibold leading-4 text-[#1b1f27]">Credit</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, idx) => {
            const borderClass = idx === lastLineIdx
              ? 'border-b-2 border-[#181d1f]'
              : 'border-b border-[#e1e6ef]';
            return (
              <tr key={line.lineNumber} className="bg-white">
                <td className={`${borderClass} h-[42px] px-4 py-3 text-[12px] font-medium leading-4 text-[#1d2433] tabular-nums`}>{line.lineNumber}</td>
                <td className={`${borderClass} h-[42px] px-4 py-3 text-[12px] font-semibold leading-4 text-[#424867] truncate`}>
                  {line.accountCode} {line.accountName}
                </td>
                <td className={`${borderClass} h-[42px] px-4 py-3 text-[12px] font-semibold leading-4 text-[#424867] truncate max-w-[260px]`}>{line.description}</td>
                <td className={`${borderClass} h-[42px] px-4 py-3 text-right text-[12px] font-medium leading-4 text-[#1d2433] tabular-nums`}>
                  {line.debit > 0 ? formatMoney(line.debit) : ''}
                </td>
                <td className={`${borderClass} h-[42px] px-4 py-3 text-right text-[12px] font-medium leading-4 text-[#1d2433] tabular-nums`}>
                  {line.credit > 0 ? formatMoney(line.credit) : ''}
                </td>
              </tr>
            );
          })}
          {/* Total row — no `border-b` on the cells; the container
               already has an outer border, so a cell-level bottom border
               here would render as a duplicate line just inside it. */}
          <tr className="bg-white">
            <td className="h-[42px] px-4 py-3 text-[12px] font-semibold leading-4 text-[#1d2433]">Total</td>
            <td className="h-[42px] px-4 py-3"></td>
            <td className="h-[42px] px-4 py-3"></td>
            <td className="h-[42px] px-4 py-3 text-right text-[12px] font-semibold leading-4 text-[#1d2433] tabular-nums">{formatMoney(totalDebit)}</td>
            <td className="h-[42px] px-4 py-3 text-right text-[12px] font-semibold leading-4 text-[#1d2433] tabular-nums">{formatMoney(totalCredit)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/**
 * Original-style flag block — a soft neutral-50 box with a simple
 * heading + source chip and a prose explanation. Thumbs render inline
 * for AI flags. Rule flags show the rule name as a hyperlink into the
 * Rule Detail modal.
 */
function FlagBlock({
  flag,
  rule,
  transaction,
  isPrimary,
  onViewRule,
  onThumbsUp,
  onThumbsDown,
  onThumbsClear,
}: {
  flag: AnomalyFlag;
  rule?: Rule;
  transaction: Transaction;
  isPrimary: boolean;
  onViewRule: (ruleId: string) => void;
  onThumbsUp: () => void;
  onThumbsDown: () => void;
  onThumbsClear: () => void;
}) {
  const isAI = flag.source.kind === 'ai';
  const title =
    flag.source.kind === 'rule'
      ? flag.source.ruleName
      : flag.source.categoryLabel;

  return (
    <div
      className={`rounded-md border border-[#e1e6ef] bg-[#f8fafc] p-4 ${
        isPrimary ? '' : 'mt-3'
      }`}
    >
      {/* Title + badge on the left, thumbs (AI) on the right; date sits below title */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
          {flag.source.kind === 'rule' ? (
            <button
              type="button"
              onClick={() =>
                flag.source.kind === 'rule' && onViewRule(flag.source.ruleId)
              }
              className="font-header text-[14px] font-bold leading-5 text-[#1d2433] underline underline-offset-2 decoration-[#1d2433]/40 hover:decoration-[#1d2433] text-left"
            >
              {title}
            </button>
          ) : (
            <span className="font-header text-[14px] font-bold leading-5 text-[#1d2433]">{title}</span>
          )}
          {flag.source.kind === 'rule' && (
            <span className="shrink-0 font-['Inter'] text-[11px] font-normal leading-4 text-[#6b7280]">
              Version {rule?.version ?? 1}
            </span>
          )}
          </div>
          {/* Subline. Source badge (AI Detected / Rule Detected)
               leads the line so the provenance is the first piece
               of metadata under the title, immediately to the left
               of the Detected date. Rule cards also include the
               version after a middle-dot separator. */}
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            {isAI && flag.source.kind === 'ai' ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="shrink-0 inline-flex cursor-default items-center gap-1 rounded-[4px] bg-purple-100 px-1 py-0.5 font-['Inter'] text-[10px] font-semibold leading-[14px] text-purple-700"
                  >
                    <Sparkles className="h-3 w-3" />
                    AI Detected
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">{formatConfidence(flag.source.confidence)}% confidence</TooltipContent>
              </Tooltip>
            ) : (
              <span className="shrink-0 inline-flex items-center gap-1 rounded-[4px] bg-blue-100 px-1 py-0.5 font-['Inter'] text-[10px] font-semibold leading-[14px] text-blue-700">
                <CircleDashed className="h-3 w-3" />
                Rule Detected
              </span>
            )}
            <span className="font-['Inter'] text-xs font-normal leading-4 text-[#adb2bb]">
              Detected {formatDate(flag.detectedAt)}
            </span>
          </div>
        </div>
        {isAI && (
          <ThumbsControl
            feedback={flag.feedback as FlagFeedback | undefined}
            onUp={onThumbsUp}
            onDown={onThumbsDown}
            onClear={onThumbsClear}
          />
        )}
      </div>

      {/* Explanation — AI flags only, capped at the lead sentence */}
      {isAI && flag.source.kind === 'ai' && (
        <p className="mt-3 font-['Inter'] text-xs font-normal leading-[18px] text-[#1d2433]">
          {takeFirstSentence(flag.source.modelReasoning)}
        </p>
      )}

      {/* Description — Rule flags only */}
      {!isAI && rule?.description && (
        <p className="mt-3 font-['Inter'] text-xs font-normal leading-[18px] text-[#1d2433]">
          {rule.description}
        </p>
      )}

      {/* Three supporting metrics — AI flags only */}
      {isAI && flag.source.kind === 'ai' && (
        <AIFlagMetrics flag={flag as AnomalyFlag & { source: { kind: 'ai'; categoryLabel: string; modelReasoning: string; confidence: number } }} transaction={transaction} />
      )}

      {/* Rule parameters — Rule flags only */}
      {!isAI && flag.source.kind === 'rule' && flag.source.matchedConditions.length > 0 && (
        <RuleFlagParams conditions={flag.source.matchedConditions} rule={rule} />
      )}
    </div>
  );
}

/**
 * Three category-specific metrics shown beneath an AI flag's reasoning,
 * inside a slick rounded gray panel. Each metric is just a small label
 * with a value below — see `getMetricsForAIFlag` for the per-category
 * mapping.
 */
function AIFlagMetrics({
  flag,
  transaction,
}: {
  flag: AnomalyFlag & { source: { kind: 'ai'; categoryLabel: string; modelReasoning: string; confidence: number } };
  transaction: Transaction;
}) {
  const allRecords = useAppStore((s) => s.records);
  const metrics = getMetricsForAIFlag(flag, transaction, allRecords);

  return (
    <div className="mt-4 rounded-md border border-[#e1e6ef] bg-white p-4">
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((m) => (
          <MetricTile key={m.label} label={m.label} value={m.value} />
        ))}
      </div>
    </div>
  );
}

// Resolved against the canonical Transaction field catalog so labels
// here always match the Transaction Details panel and rule editor
// dropdowns. Legacy field ids (date, vendorName, description, etc.)
// are aliased to their canonical counterparts before lookup.
function formatFieldName(field: string): string {
  const label = getTransactionFieldLabel(field);
  if (label !== field) return label;
  return field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
}

// Mirrors OPERATOR_OPTIONS in RuleDetail.tsx — must stay in sync
function formatOperator(
  operator: RuleConditionOperator,
  value: RuleCondition['value'],
): { operatorText: string; valueBadge: string | null } {
  const formatVal = (v: RuleCondition['value']): string =>
    Array.isArray(v) ? `${v[0]}–${v[1]}` : String(v);

  switch (operator) {
    // ── Figma-canonical kebab-case operator labels ─────────────────
    case 'is':
      return value === '' || value === null || value === undefined
        ? { operatorText: 'Is Blank', valueBadge: null }
        : { operatorText: 'Is', valueBadge: formatVal(value) };
    case 'is-not':                   return { operatorText: 'Is Not', valueBadge: formatVal(value) };
    case 'contains':                 return { operatorText: 'Contains', valueBadge: formatVal(value) };
    case 'does-not-contain':         return { operatorText: 'Does Not Contain', valueBadge: formatVal(value) };
    case 'starts-with':              return { operatorText: 'Starts With', valueBadge: formatVal(value) };
    case 'ends-with':                return { operatorText: 'Ends With', valueBadge: formatVal(value) };
    case 'is-on-or-after':           return { operatorText: 'Is On or After', valueBadge: formatVal(value) };
    case 'is-on-or-before':          return { operatorText: 'Is On or Before', valueBadge: formatVal(value) };
    case 'is-greater-than':          return { operatorText: 'Is Greater Than', valueBadge: formatVal(value) };
    case 'is-greater-than-or-equal': return { operatorText: 'Is Greater Than or Equal To', valueBadge: formatVal(value) };
    case 'is-less-than':             return { operatorText: 'Is Less Than', valueBadge: formatVal(value) };
    case 'is-less-than-or-equal':    return { operatorText: 'Is Less Than or Equal To', valueBadge: formatVal(value) };
    case 'is-blank':                 return { operatorText: 'Is Blank', valueBadge: null };
    case 'is-not-blank':             return { operatorText: 'Is Not Blank', valueBadge: null };
    case 'between':                  return { operatorText: 'Between', valueBadge: formatVal(value) };
    case 'is-any-of':                return { operatorText: 'Is Any Of', valueBadge: Array.isArray(value) ? value.join(', ') : formatVal(value) };
    // ── Legacy camelCase still emitted by seeded rules ─────────────
    case 'equals':
      return value === '' || value === null || value === undefined
        ? { operatorText: 'Is Blank', valueBadge: null }
        : { operatorText: 'Is', valueBadge: formatVal(value) };
    case 'notEquals':      return { operatorText: 'Is Not', valueBadge: formatVal(value) };
    case 'greaterThan':    return { operatorText: 'Is Greater Than', valueBadge: formatVal(value) };
    case 'lessThan':       return { operatorText: 'Is Less Than', valueBadge: formatVal(value) };
    case 'matches':        return { operatorText: 'Contains', valueBadge: formatVal(value) };
    case 'doesNotContain': return { operatorText: 'Does Not Contain', valueBadge: formatVal(value) };
    case 'startsWith':     return { operatorText: 'Starts With', valueBadge: formatVal(value) };
    case 'endsWith':       return { operatorText: 'Ends With', valueBadge: formatVal(value) };
    case 'isEmpty':        return { operatorText: 'Is Blank', valueBadge: null };
    case 'isNotEmpty':     return { operatorText: 'Is Not Blank', valueBadge: null };
    case 'outside':        return { operatorText: 'Outside', valueBadge: typeof value === 'string' ? value : null };
    case 'in':             return { operatorText: 'Is Any Of', valueBadge: Array.isArray(value) ? value.join(', ') : formatVal(value) };
    default:               return { operatorText: operator, valueBadge: value !== '' ? formatVal(value) : null };
  }
}

function RuleFlagParams({ rule }: { conditions: MatchedCondition[]; rule?: Rule }) {
  const ruleConditions = rule?.conditions ?? [];
  return (
    <div className="mt-4 rounded-md border border-[#e1e6ef] bg-white px-4 py-3">
      <p className="mb-3 font-['Inter'] text-xs font-medium leading-4 text-[#424867]">
        Rule Parameters
      </p>
      <div className="space-y-2">
        {ruleConditions.map((rc) => {
          const { operatorText, valueBadge } = formatOperator(rc.operator, rc.value);
          return (
            <div key={rc.id} className="flex items-center gap-1.5 flex-wrap">
              <span className="font-['Inter'] text-xs font-bold leading-[18px] text-[#1d2433]">
                {formatFieldName(rc.field)}
              </span>
              <span className="font-['Inter'] text-xs font-normal leading-[18px] text-[#424867]">
                {operatorText}
              </span>
              {valueBadge && (
                <span className="rounded-[4px] px-1 py-0.5 bg-[#f1f3f9] font-['Inter'] text-[10px] font-semibold leading-[14px] text-[#6b7280]">
                  {valueBadge}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="font-['Inter'] text-xs font-medium leading-4 text-[#424867]">
        {label}
      </div>
      <div className="mt-0.5 truncate font-['Inter'] text-xs font-semibold leading-[18px] text-[#1d2433]">
        {value}
      </div>
    </div>
  );
}

type AIMetric = { label: string; value: string };

/**
 * Per-category metric mapping for AI flags.
 *
 * Layout rule: Lookback Period is always the first tile. The two remaining
 * tiles are specific to the anomaly type — they surface the most decision-
 * relevant comparison facts for that category.
 */
function getMetricsForAIFlag(
  flag: AnomalyFlag & { source: { kind: 'ai'; categoryLabel: string } },
  tx: Transaction,
  records: AnomalyRecord[],
): [AIMetric, AIMetric, AIMetric] {
  const category = flag.source.categoryLabel;

  switch (category) {
    case 'Vendor payment velocity spike':
      return [
        { label: 'Lookback period', value: '12 months' },
        { label: 'Vendor avg / period', value: '$95,200' },
        { label: 'This period', value: formatMoney(tx.amount) },
      ];

    case 'Elevated reversal rate':
      return [
        { label: 'Lookback period', value: '12 months' },
        { label: 'Avg reversals / month', value: '0.8' },
        { label: 'This period reversals', value: '4' },
      ];

    case 'Interquartile range outlier':
      return [
        { label: 'Lookback period', value: '6 months' },
        { label: 'IQR upper fence', value: '$67,400' },
        { label: 'This amount', value: formatMoney(tx.amount) },
      ];

    case 'New vendor, large first payment': {
      return [
        { label: 'Lookback period', value: '24 months' },
        { label: 'Median first payment', value: '$8,400' },
        { label: 'This amount', value: formatMoney(tx.amount) },
      ];
    }

    case 'Backdated entry': {
      const glMs = new Date(tx.date + 'T00:00:00Z').getTime();
      const sysMs = tx.createdAt ? new Date(tx.createdAt).getTime() : glMs;
      const daysDiff = Math.round((sysMs - glMs) / 86_400_000);
      return [
        { label: 'Lookback period', value: '12 months' },
        { label: 'Days backdated', value: `${daysDiff} days` },
        { label: 'GL date', value: tx.date },
      ];
    }

    case 'Duplicate transaction fingerprint':
      return [
        { label: 'Lookback period', value: '3 months' },
        { label: 'Match score', value: '94%' },
        { label: 'Prior invoice', value: 'BILL-44020' },
      ];

    case 'Round-trip transaction':
      return [
        { label: 'Lookback period', value: '3 months' },
        { label: 'Counter entry', value: 'JE-2026-043' },
        { label: 'Net effect', value: '$0' },
      ];

    case 'Unusual posting user for account':
      return [
        { label: 'Lookback period', value: '18 months' },
        { label: 'Account', value: `${tx.glAccountCode} ${tx.glAccountName}` },
        { label: 'Established users', value: 'Emily Chen, Priya Patel' },
      ];

    case 'Posting timing': {
      const raw = tx.submittedAt ?? tx.createdAt;
      let timeStr = '—';
      if (raw) {
        const d = new Date(raw);
        const h = d.getUTCHours().toString().padStart(2, '0');
        const m = d.getUTCMinutes().toString().padStart(2, '0');
        timeStr = `${h}:${m} UTC`;
      }
      return [
        { label: 'Lookback period', value: '12 months' },
        { label: 'Submission time', value: timeStr },
        { label: 'Normal range', value: '08:00 – 20:00' },
      ];
    }

    case 'Amount distribution': {
      const vendorAvg = 12_400;
      const multiple = (tx.amount / vendorAvg).toFixed(1);
      return [
        { label: 'Lookback period', value: '12 months' },
        { label: 'Vendor avg invoice', value: '$12,400' },
        { label: 'This amount', value: `${multiple}× avg` },
      ];
    }

    case 'Counterparty pattern':
      return [
        { label: 'Lookback period', value: '24 months' },
        { label: 'Expected entity', value: 'PwC US' },
        { label: 'Actual entity', value: 'PwC Canada' },
      ];

    case 'Frequency anomaly':
      return [
        { label: 'Lookback period', value: '12 months' },
        { label: 'Avg invoices / month', value: '1.1' },
        { label: 'This period invoices', value: '3' },
      ];

    case 'Reversal pattern':
      return [
        { label: 'Lookback period', value: '12 months' },
        { label: 'Avg reversal lag', value: '11 days' },
        { label: 'This reversal lag', value: '65 days' },
      ];

    case 'Entry source':
      return [
        { label: 'Lookback period', value: '14 months' },
        { label: 'Expected source', value: 'System (auto-sync)' },
        { label: 'Manual entries', value: '0 of 218 prior' },
      ];

    case 'Preparer / approver pattern':
      return [
        { label: 'Lookback period', value: '24 months' },
        { label: 'Max prior approval', value: '$95,000' },
        { label: 'This amount', value: formatMoney(tx.amount) },
      ];

    case 'Currency anomaly':
      return [
        { label: 'Lookback period', value: '24 months' },
        { label: 'Expected currency', value: 'USD' },
        { label: 'Invoice currency', value: 'EUR' },
      ];

    default: {
      const cohort = records.filter((r) =>
        r.flags.some((f) => f.source.kind === 'ai' && f.source.categoryLabel === category),
      );
      return [
        { label: 'Lookback period', value: '24 months' },
        { label: 'Detected transactions', value: cohort.length.toString() },
        { label: 'Vendor', value: tx.vendorName?.trim() || '—' },
      ];
    }
  }
}

/** Take just the first complete sentence from `text` (the headline / lead). */
function takeFirstSentence(text: string): string {
  const match = text.match(/[^.!?]+[.!?]+/);
  if (!match) return text.trim();
  return match[0].trim();
}

/**
 * V2 sticky reviewer header — locked above the scrollable transaction body.
 *
 * Shows every assignee (Preparer first, then Reviewers) in a single row with
 * a "Mark as Reviewed" button next to each name. Only the currently logged-in
 * user (samantha-sheldon / currentUserId) has an enabled button. All other
 * buttons are visible but disabled so the test participant can see the state
 * of the full review workflow at a glance.
 *
 * Reviewed state is stored in the store's ephemeral `reviewedMap` and resets
 * on every page load — this is a usability-test toggle only.
 */
/**
 * V2 approval-chain header — purely informational, no actions.
 *
 * Shows the transaction's position in the review workflow:
 *   Preparer (submitter, always signed off)  →  Reviewers (assignees, mixed state)
 *
 * Samantha (currentUserId) always appears as Pending here — she is the
 * active reviewer, not the preparer. Other reviewers derive their state
 * from the activity log.
 */
/**
 * Right-column card wrapping the assignees (sign-off chain) with a
 * collapsible "Assignees (N)" header — matches the Comments / Activity
 * Log card pattern.
 */
function AssigneesCard({
  record,
  transaction,
  onStartResolve,
}: {
  record: AnomalyRecord;
  transaction: Transaction;
  onStartResolve: (recordId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [editingAssignees, setEditingAssignees] = useState(false);
  const assignRecord = useAppStore((s) => s.assignRecord);
  const count = record.assigneeIds.length;

  return (
    <div className="overflow-hidden rounded-md border border-[#e1e6ef] bg-white">
      {editingAssignees && (
        <AssigneeModal
          record={record}
          transaction={transaction}
          onClose={() => setEditingAssignees(false)}
          onSave={(ids) => {
            assignRecord(record.id, ids);
            setEditingAssignees(false);
          }}
        />
      )}
      <div className="flex items-center justify-between gap-2 px-6 py-4">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex flex-1 items-center text-left"
        >
          <span className="font-header text-base font-bold leading-5 text-[#1d2433]">
            Assignees
          </span>
        </button>
        <div className="flex items-center gap-2">
          {/* Edit Assignees — only shown when assignees exist */}
          {count > 0 && (
            <button
              type="button"
              onClick={() => setEditingAssignees(true)}
              className="inline-flex h-8 items-center justify-center rounded-md border-[1.4px] border-[#cbd2e1] bg-transparent px-3 font-header text-xs font-bold leading-4 tracking-[-0.12px] text-[#6b7280] transition-colors hover:border-[#6b7280] hover:text-[#1d2433]"
            >
              Edit Assignees
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Collapse assignees' : 'Expand assignees'}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#6b7280] hover:bg-neutral-100 hover:text-neutral-900"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {expanded && <div className="border-t border-[#e1e6ef]" />}
      {expanded && count === 0 && (
        <div className="flex flex-col items-center px-4 pb-4 pt-4">
          <p className="font-body text-xs font-normal leading-[18px] text-[#424867]">
            No assignees yet
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setEditingAssignees(true)}
              className="inline-flex h-8 items-center justify-center rounded-md border-[1.4px] border-[#cbd2e1] bg-transparent px-3 font-header text-xs font-bold leading-4 text-[#6b7280] transition-colors hover:border-[#6b7280] hover:text-[#1d2433]"
            >
              Add Assignees
            </button>
          </div>
        </div>
      )}
      {expanded && count > 0 && (
        <ReviewHeader record={record} transaction={transaction} onStartResolve={onStartResolve} />
      )}
    </div>
  );
}

function ReviewHeader({
  record,
  transaction,
  onStartResolve,
}: {
  record: AnomalyRecord;
  transaction: Transaction;
  onStartResolve: (recordId: string) => void;
}) {
  const allActivity = useAppStore((s) => s.activity);
  const resolveRecord = useAppStore((s) => s.resolveRecord);
  const reopenRecord = useAppStore((s) => s.reopenRecord);
  const signOffForMember = useAppStore((s) => s.signOffForMember);
  const removeOverrideSignOff = useAppStore((s) => s.removeOverrideSignOff);
  const removeMemberSignOff = useAppStore((s) => s.removeMemberSignOff);
  const togglePreparerSignOff = useAppStore((s) => s.togglePreparerSignOff);

  // Confirmation dialog for any sign-off removal — see ConfirmDialog below.
  // The pending action runs only after the user confirms.
  const [pendingRemove, setPendingRemove] = useState<{ run: () => void } | null>(null);

  function hasSignedOff(memberId: string): boolean {
    return allActivity.some(
      (e) =>
        e.recordId === record.id &&
        e.byId === memberId &&
        (e.kind === 'comment-posted' ||
          e.kind === 'feedback-recorded' ||
          e.kind === 'flagged-for-review'),
    );
  }

  // Latest sign-off activity timestamp for a member, or null if none exists
  function getReviewerSignOffDate(memberId: string): string | null {
    const entries = allActivity
      .filter(
        (e) =>
          e.recordId === record.id &&
          e.byId === memberId &&
          (e.kind === 'comment-posted' ||
            e.kind === 'feedback-recorded' ||
            e.kind === 'flagged-for-review'),
      )
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
    return entries[0]?.at ?? null;
  }

  // No more preparer / reviewer distinction (Carmen 5.28.26). Every
  // user in record.assigneeIds is an assignee — but the transaction
  // submitter is explicitly hidden from this section, since their
  // role is "submitter," not one of the four assignment categories
  // (rule / dynamic-fallback / manual / ultimate-owner).
  const reviewers = record.assigneeIds
    .filter((id) => id !== transaction.submitterId)
    .map((id) => getTeamMember(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getTeamMember>>[];

  return (
    <div className="px-6 py-4">
      {/* ── People — single 3-column grid spanning every assignee row.
            All three columns use `auto`; the COLUMN WIDTHS are pinned by
            explicit `w-[…]` on the cell wrappers below. Doing it this
            way (rather than fixed-length tracks like `11rem`) avoids
            CSS grid's implicit `minmax(auto, X)` behavior, which would
            silently expand the track when a long name's min-content
            exceeded `X` and break toggle alignment.
              - Col 1 cells: w-44 (11rem / 176px) — fits the longest
                team name with avatar + gap; `truncate` is a safety net
                for any future longer names.
              - Col 2: toggle (40px).
              - Col 3 cells: w-40 (10rem / 160px) — fits the longest
                signer block (avatar + gap + name + date row). Both the
                rendered SignerPanel and the unsigned placeholder use
                this width, so col 3 doesn't change width when toggling
                sign-off → no horizontal shift on revoke. ── */}
      <div className="grid grid-cols-[auto_auto_auto] items-center gap-x-3 gap-y-4">

          {/* Every assignee in record.assigneeIds gets a row — no
               separate preparer slot anymore (Carmen 5.28.26). The
               submitter still has implicit sign-off semantics but is
               surfaced in this section only if they're in the
               assigneeIds list. */}
          {reviewers.map((member) => {
            const isCurrentUser = member.id === currentUserId;

            // Per-member sign-off state drives the badge. The single
            // record.resolution field no longer determines individual
            // assignee status — only this map does.
            const signOff = record.signOffs?.[member.id];
            const memberSignedOff = !!signOff && signOff.byId === member.id;
            const isOverride = !!signOff && signOff.byId !== member.id;
            const overrideSigner = isOverride
              ? getTeamMember(signOff!.byId)
              : null;
            const overrideReason = isOverride ? signOff!.reason : null;
            const signOffDate = signOff?.at ?? null;

            // Stale = a flag was detected on this record AFTER this member's
            // sign-off, meaning their attestation didn't account for it.
            // Applies to both self sign-offs and overrides.
            const staleFlag = signOff
              ? record.flags.find(
                  (f) => new Date(f.detectedAt).getTime() > new Date(signOff.at).getTime(),
                )
              : null;
            const isStale = !!staleFlag;
            const newFlagsSinceSignOff = signOff
              ? record.flags.filter(
                  (f) => new Date(f.detectedAt).getTime() > new Date(signOff.at).getTime(),
                ).length
              : 0;

            const signer = signOff ? getTeamMember(signOff.byId) : null;

            return (
              <Fragment key={member.id}>
                {/* Cell 1: avatar + name. `w-44` pins the col 1 width;
                     truncate is safety. Avatar wrapped in
                     AssigneeReasonPopover — click to see why this
                     reviewer is on the transaction (rule, account
                     fallback, manual, or ultimate owner). */}
                <div className="flex w-40 min-w-0 items-center gap-3 overflow-hidden">
                  <AssigneeReasonPopover
                    memberId={member.id}
                    reason={record.assigneeReasons?.[member.id]}
                  >
                    <button
                      type="button"
                      aria-label={`Why is ${member.name} assigned?`}
                      // No hover/focus visual states — the cursor
                      // pointer alone signals clickability (Carmen
                      // 5.28.26). Native browser focus outline still
                      // appears on keyboard nav for accessibility.
                      className="shrink-0 rounded-full"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-7 w-7 rounded-full border border-neutral-200 object-cover"
                      />
                    </button>
                  </AssigneeReasonPopover>
                  <p className="truncate font-['Inter'] text-xs font-semibold leading-[18px] text-[#1b1f27]">{member.name}</p>
                </div>
                {/* Cell 2: toggle (column-aligned with every other row) */}
                <div className="flex shrink-0 flex-col items-center gap-1">
                  {isStale && signOff ? (
                    // Re-review needed: an existing sign-off has been
                    // superseded by a new flag. Render as an amber
                    // signed-off toggle (instead of a separate
                    // "Re-review" pill) — the colour itself signals
                    // "signed off, but stale". Clicking re-attests with
                    // a fresh timestamp via signOffForMember (treated
                    // as an override if signer !== member, otherwise a
                    // refreshed self sign-off).
                    <MemberSignOffToggle
                      signedOff
                      stale
                      onClick={() => signOffForMember(record.id, member.id, '')}
                      title={
                        isCurrentUser
                          ? 'Re-attest your sign-off (a new flag landed since)'
                          : `Re-attest sign-off for ${member.name}`
                      }
                    />
                  ) : isOverride && overrideSigner ? (
                    // Override sign-offs render as a normal signed-off
                    // toggle — the SignerPanel on the right already shows
                    // who actually signed off (different from the
                    // assignee), so a separate "Override" badge would be
                    // redundant. Click revokes: removeOverrideSignOff for
                    // the current user's own overrides, removeMemberSignOff
                    // for someone else's.
                    <MemberSignOffToggle
                      signedOff
                      onClick={() =>
                        setPendingRemove({
                          run: () =>
                            signOff!.byId === currentUserId
                              ? removeOverrideSignOff(record.id, member.id)
                              : removeMemberSignOff(record.id, member.id),
                        })
                      }
                      title={
                        signOff!.byId === currentUserId
                          ? `Remove your sign-off for ${member.name}`
                          : `Remove ${overrideSigner.name}'s sign-off for ${member.name}`
                      }
                    />
                  ) : memberSignedOff && isCurrentUser ? (
                    // Current user has signed off — toggle in ON state.
                    // Click un-signs off.
                    <MemberSignOffToggle
                      signedOff
                      onClick={() => setPendingRemove({ run: () => reopenRecord(record.id) })}
                      title="Click to remove your sign-off"
                    />
                  ) : memberSignedOff ? (
                    // Another assignee has signed off — toggle in ON state.
                    // Clicking replaces their sign-off with the current
                    // user's (signOffForMember treats this as an override
                    // when byId !== memberId). No reason prompt — the
                    // activity log captures who/when.
                    <MemberSignOffToggle
                      signedOff
                      onClick={() => signOffForMember(record.id, member.id, '')}
                      title={`Override ${member.name}'s sign-off`}
                    />
                  ) : !isCurrentUser ? (
                    // Other assignee not yet signed off — toggle in OFF
                    // state. Click signs off on their behalf directly.
                    <MemberSignOffToggle
                      signedOff={false}
                      onClick={() => signOffForMember(record.id, member.id, '')}
                      title={`Sign off for ${member.name}`}
                    />
                  ) : (
                    // Current user not yet signed off — toggle in OFF state.
                    // Click signs off (mirrors the main toggle's onSignOff).
                    <MemberSignOffToggle
                      signedOff={false}
                      onClick={() => {
                        if (transaction.id === 'tx-exp-44722') {
                          onStartResolve(record.id);
                        } else {
                          resolveRecord(record.id, {
                            kind: 'no-action',
                            at: new Date().toISOString(),
                            byId: currentUserId,
                          });
                        }
                      }}
                      title="Click to sign off"
                    />
                  )}
                </div>
                {/* Cell 3: signer info (only when signed off). h-8
                     placeholder reserves the SignerPanel's height so
                     toggling sign-off doesn't shift the row. */}
                {signOff && signer ? (
                  <SignerPanel signer={signer} date={signOff.at} stale={isStale} />
                ) : (
                  <div className="h-8 w-40" />
                )}
              </Fragment>
            );
          })}
      </div>
      <ConfirmDialog
        open={!!pendingRemove}
        title="Remove Sign-off"
        description="Removing this sign-off will also remove the completed date associated with it. Do you wish to remove sign-off?"
        confirmLabel="Remove"
        variant="warning"
        onConfirm={() => {
          pendingRemove?.run();
          setPendingRemove(null);
        }}
        onCancel={() => setPendingRemove(null)}
      />
    </div>
  );
}

/**
 * Right-side block of an assignee row showing who actually signed off
 * (avatar + name) with a green check + date below the name.
 *
 * For self sign-offs, this displays the same person as the assignee.
 * For overrides, this displays the override-er — making it clear who
 * applied the sign-off when it differs from the assignee.
 */
function SignerPanel({
  signer,
  date,
  stale = false,
}: {
  signer: { name: string; avatar: string };
  date: string;
  /** When true, the check pill renders amber instead of green to match
   *  the stale toggle — visually communicates "signed off, but a new
   *  flag has been detected since; needs another look". */
  stale?: boolean;
}) {
  const checkBg = stale ? 'bg-[#D97706]' : 'bg-[#1FAC76]';
  const nameColor = stale ? 'text-[#9CA3AF]' : 'text-[#1b1f27]';
  return (
    // gap-2 (8px) — slightly tighter than the assignee row's gap-3 so
    // the signer block doesn't visually float away from its assignee.
    // `w-40` (10rem / 160px) pins col 3's width via the cell wrapper
    // (see grid comment in ReviewHeader). The unsigned placeholder uses
    // the same `w-40`, so col 3 width is invariant under sign-off
    // toggling — no horizontal shift on revoke. `overflow-hidden` +
    // `truncate` on the name keep long names from breaking the width.
    // When stale, the whole block is dimmed (opacity-60) to read as a
    // "previous sign-off, no longer counts" footnote — the amber colour
    // still pops through, just muted.
    <div className={`flex w-40 min-w-0 items-center gap-2 overflow-hidden ${stale ? 'opacity-60' : ''}`}>
      <img
        src={signer.avatar}
        alt={signer.name}
        className="h-7 w-7 shrink-0 rounded-full border border-neutral-200 object-cover"
      />
      {/* Stacked text column. The two rows now sit flush (no `mt-0.5`)
           so the column is exactly 18 + 14 = 32px tall — matching the
           h-8 placeholder reserved in unsigned rows. Removes the layout
           shift that used to happen when toggling sign-off, and tightens
           the visual spacing after the signoff details. */}
      <div className="min-w-0">
        <p className={`truncate font-['Inter'] text-xs font-semibold leading-[18px] ${nameColor}`}>
          {signer.name}
        </p>
        <div className="flex items-center gap-1 font-['Inter'] text-[10px] font-medium leading-[14px] text-[#6b7280]">
          <span className={`inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full ${checkBg}`}>
            <Check className="h-2 w-2 text-white" strokeWidth={3} />
          </span>
          <span>{formatDate(date)}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal for editing the assignee list (preparer excluded — read-only).
 * Shows the full team roster; selected members are reviewers on this record.
 */
/**
 * Edit Assignees modal — FlowUI-styled.
 *
 * Each currently-assigned member renders as its own dropdown row (avatar
 * + name + chevron). Clicking a row opens a multiselect popover where
 * the user can toggle which team members are assigned. "Add assignee"
 * appends a new empty row that opens its dropdown for selection.
 */
function AssigneeModal({
  record,
  transaction,
  onClose,
  onSave,
}: {
  record: AnomalyRecord;
  transaction: Transaction;
  onClose: () => void;
  onSave: (ids: string[]) => void;
}) {
  const isAddMode = record.assigneeIds.length === 0;

  // In add mode (no existing assignees): start empty with one blank row.
  // In edit mode: mirror the Assignees container ordering — preparer first,
  // then reviewers from record.assigneeIds in their original order.
  const initialSelected = useMemo<string[]>(() => {
    if (isAddMode) return [];
    const ids = [transaction.submitterId];
    for (const id of record.assigneeIds) {
      if (id !== transaction.submitterId) ids.push(id);
    }
    return ids;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — captures the state at mount only

  const [selected, setSelected] = useState<string[]>(initialSelected);
  // When > 0, render that many extra "empty" dropdown rows so the user
  // can pick someone new from each. Each empty row collapses back into
  // the selected list once they choose someone.
  const [pendingEmptyRows, setPendingEmptyRows] = useState(isAddMode ? 1 : 0);
  const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null);

  // Disable Save/Add until the user actually makes a change.
  const hasChanged = isAddMode
    ? selected.length > 0
    : selected.length !== initialSelected.length ||
      selected.some(id => !initialSelected.includes(id)) ||
      initialSelected.some(id => !selected.includes(id));

  // Members who have signed off cannot be reassigned or removed — their
  // attestation is bound to their identity. Includes the preparer (whose
  // implicit submission sign-off is intact) and any reviewer with a
  // recorded sign-off.
  const signedOffIds = useMemo(() => {
    const set = new Set<string>();
    if (!record.submitterSignOffRevoked) set.add(transaction.submitterId);
    Object.entries(record.signOffs ?? {}).forEach(([memberId, signoff]) => {
      if (signoff) set.add(memberId);
    });
    return set;
  }, [record.submitterSignOffRevoked, record.signOffs, transaction.submitterId]);

  // Look up the {byId, at} for any signed-off member so we can render the
  // signer panel inside locked rows. Mirrors the resolution logic the
  // Assignees container uses.
  function getSignOffInfo(memberId: string): { byId: string; at: string } | null {
    if (memberId === transaction.submitterId && !record.submitterSignOffRevoked) {
      const reattested = record.submitterSignOffReattested;
      return {
        byId: reattested?.byId ?? transaction.submitterId,
        at: reattested?.at ?? (transaction.approvedAt || transaction.submittedAt),
      };
    }
    const so = record.signOffs?.[memberId];
    return so ? { byId: so.byId, at: so.at } : null;
  }

  function pickMember(rowIdx: number, newId: string) {
    // Single-select swap. If the row already has a member, replace them.
    // If it's an empty row appended via "Add assignee", append the new
    // member to `selected` and consume one pendingEmptyRow.
    setSelected((prev) => {
      const next = [...prev];
      if (rowIdx < prev.length) {
        next[rowIdx] = newId;
      } else {
        next.push(newId);
      }
      return next;
    });
    if (rowIdx >= selected.length && pendingEmptyRows > 0) {
      setPendingEmptyRows((n) => Math.max(0, n - 1));
    }
    setOpenDropdownIdx(null);
  }

  function removeMember(id: string) {
    setSelected((prev) => prev.filter((x) => x !== id));
  }

  function addEmptyRow() {
    setPendingEmptyRows((n) => n + 1);
  }

  function removeEmptyRow(rowIdx: number) {
    // Empty rows live after `selected` in the rows array, so subtract
    // selected.length to find which empty slot to remove.
    const emptyIdx = rowIdx - selected.length;
    setPendingEmptyRows((n) => Math.max(0, n - 1));
    if (openDropdownIdx === rowIdx) setOpenDropdownIdx(null);
    void emptyIdx;
  }

  // Build the row list: each selected member gets a row, plus N empty rows.
  const rows: { memberId: string | null; key: string }[] = [
    ...selected.map((id) => ({ memberId: id, key: id })),
    ...Array.from({ length: pendingEmptyRows }, (_, i) => ({
      memberId: null as string | null,
      key: `empty-${i}`,
    })),
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e1e6ef] px-6 py-4">
          <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
            {isAddMode ? 'Add Assignees' : 'Edit Assignees'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#6b7280] hover:bg-neutral-100 hover:text-[#1d2433]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Assignee dropdowns */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            {rows.map((row, idx) => {
              const member = row.memberId ? getTeamMember(row.memberId) : null;
              const isLocked = !!row.memberId && signedOffIds.has(row.memberId);
              const removeDisabled = isLocked || selected.length === 1;
              const removeTooltip = isLocked
                ? 'This user has already signed off and cannot be removed.'
                : 'At least one assignee is required.';
              const lockedSignOff = isLocked && row.memberId ? getSignOffInfo(row.memberId) : null;
              const lockedSigner = lockedSignOff ? getTeamMember(lockedSignOff.byId) : null;

              if (isLocked && member) {
                // Locked row: mirror the Assignees container's row layout
                // (avatar + name | toggle | signer panel) using auto-sized
                // columns and gap-3 so spacing matches the container's
                // grid layout exactly — no extra gap between toggle and
                // signer.
                return (
                  <div
                    key={row.key}
                    className="flex h-10 cursor-not-allowed items-center gap-3 px-1 opacity-70"
                    aria-disabled="true"
                  >
                    {/* Col 1: avatar + name — fixed width so toggles in Col 2
                         line up vertically across rows regardless of name
                         length. Matches the Assignees container's column 1. */}
                    <div className="flex w-44 min-w-0 items-center gap-2">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-7 w-7 shrink-0 rounded-full border border-neutral-200 object-cover"
                      />
                      <span className="truncate font-['Inter'] text-xs font-semibold leading-[18px] text-[#6b7280]">
                        {member.name}
                      </span>
                    </div>
                    {/* Col 2: disabled signed-off toggle (visual only) */}
                    <span className="relative inline-flex h-5 w-10 shrink-0 rounded-full bg-[#1FAC76]">
                      <span className="absolute top-0.5 h-4 w-4 translate-x-[22px] rounded-full bg-white shadow-sm" />
                    </span>
                    {/* Col 3: signer panel — sits right next to the
                         toggle with the standard gap-3, matching the
                         Assignees container's natural row layout. */}
                    {lockedSignOff && lockedSigner ? (
                      <div className="flex min-w-0 items-center gap-2">
                        <img
                          src={lockedSigner.avatar}
                          alt={lockedSigner.name}
                          className="h-7 w-7 shrink-0 rounded-full border border-neutral-200 object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-['Inter'] text-xs font-semibold leading-[18px] text-[#1b1f27]">
                            {lockedSigner.name}
                          </p>
                          <div className="flex items-center gap-1 font-['Inter'] text-[10px] font-medium leading-[14px] text-[#6b7280]">
                            <span className="inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#1FAC76]">
                              <Check className="h-2 w-2 text-white" strokeWidth={3} />
                            </span>
                            <span>
                              {new Date(lockedSignOff.at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', timeZone: 'UTC' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span />
                    )}
                  </div>
                );
              }

              return (
                <Popover
                  key={row.key}
                  open={openDropdownIdx === idx}
                  onOpenChange={(open) => setOpenDropdownIdx(open ? idx : null)}
                >
                  <div className="flex items-center gap-2">
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex h-10 flex-1 items-center justify-between rounded-md border border-[#e1e6ef] bg-white px-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:border-[#cbd2e1]"
                      >
                        {member ? (
                          <div className="flex min-w-0 items-center gap-2">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="h-6 w-6 shrink-0 rounded-full border border-neutral-200 object-cover"
                            />
                            <span className="truncate font-['Inter'] text-xs font-medium leading-4 text-[#1d2433]">
                              {member.name}
                            </span>
                          </div>
                        ) : (
                          <span className="font-['Inter'] text-xs font-normal leading-4 text-[#adb2bb]">
                            Select an assignee
                          </span>
                        )}
                        <ChevronDown className="h-4 w-4 shrink-0 text-[#6b7280]" />
                      </button>
                    </PopoverTrigger>
                    {row.memberId ? (
                      removeDisabled ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              disabled
                              className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-md text-[#cbd2e1]"
                              aria-label={removeTooltip}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="z-[80]">{removeTooltip}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeMember(row.memberId!)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-neutral-100 hover:text-[#1d2433]"
                          aria-label={`Remove ${member?.name ?? 'assignee'}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )
                    ) : (
                      // Empty (newly-added) row — trash removes the slot.
                      <button
                        type="button"
                        onClick={() => removeEmptyRow(idx)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-neutral-100 hover:text-[#1d2433]"
                        aria-label="Remove empty assignee row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <PopoverContent
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    className="z-[80] w-[var(--radix-popover-trigger-width)] rounded-md border border-[#e1e6ef] bg-white p-0 shadow-xl"
                  >
                    <AssigneePickerPanel
                      currentId={row.memberId}
                      assignedIds={selected}
                      onPick={(id) => pickMember(idx, id)}
                    />
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>

          {/* Add Assignee — ghost button (FlowUI variant="ghost") */}
          <button
            type="button"
            onClick={addEmptyRow}
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-md bg-transparent px-3 font-header text-xs font-bold leading-4 tracking-[-0.12px] text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Assignee
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#e1e6ef] bg-[#f8fafc] px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center justify-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#6b7280] hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(selected)}
            disabled={!hasChanged}
            className="inline-flex h-8 items-center justify-center rounded-md bg-[#1FAC76] px-3 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1FAC76]"
          >
            {isAddMode ? 'Add' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Single-select panel that opens from a row's dropdown trigger.
 * Lists every team member; clicking one swaps the row's current member
 * with the selected one (via onPick). Members already assigned to a
 * different row are disabled to prevent duplicates. The current row's
 * member is highlighted with a check.
 */
function AssigneePickerPanel({
  currentId,
  assignedIds,
  onPick,
}: {
  currentId: string | null;
  assignedIds: string[];
  onPick: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  // Any member already picked for any row (including this one) is removed
  // from the list. The trigger button already shows the current selection,
  // so the picker only needs to surface members that are still unassigned.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return team.filter((m) => {
      if (assignedIds.includes(m.id)) return false;
      if (!q) return true;
      return m.name.toLowerCase().includes(q);
    });
  }, [search, assignedIds]);

  return (
    <div className="flex flex-col">
      <div className="border-b border-[#e1e6ef] p-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#adb2bb]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="h-8 w-full rounded-md border border-[#e1e6ef] bg-white pl-8 pr-2 font-['Inter'] text-xs font-normal leading-4 text-[#1d2433] placeholder:text-[#adb2bb] focus:border-[#3d7bf7] focus:outline-none"
          />
        </div>
      </div>
      <div className="max-h-56 overflow-y-auto p-1">
        {filtered.length === 0 && (
          <p className="px-2 py-2 font-['Inter'] text-[11px] text-[#adb2bb]">No matches</p>
        )}
        {filtered.map((member) => (
          <button
            key={member.id}
            type="button"
            onClick={() => onPick(member.id)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[#f8fafc]"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="h-6 w-6 shrink-0 rounded-full border border-neutral-200 object-cover"
            />
            <span className="min-w-0 flex-1 truncate font-['Inter'] text-xs font-medium leading-4 text-[#1d2433]">
              {member.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Large-area sign-off toggle. Replaces the old "Mark as Reviewed" + "Reopen"
 * pair with a single control:
 *   OFF → label "Sign off",   toggle left,  neutral border
 *   ON  → label "Signed off", toggle right, filled dark background
 */
function SignOffToggle({
  signedOff,
  onSignOff,
  onReopen,
}: {
  signedOff: boolean;
  onSignOff: () => void;
  onReopen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => (signedOff ? onReopen() : onSignOff())}
      className="inline-flex items-center gap-4"
    >
      <span className="font-['Inter'] text-xs font-medium leading-[18px] text-[#1d2433]">
        Sign off
      </span>
      {/* Toggle track — 40x20 to match Figma */}
      <span
        className={`relative inline-flex h-5 w-10 shrink-0 rounded-full transition-colors ${
          signedOff ? 'bg-[#1FAC76]' : 'bg-neutral-200'
        }`}
      >
        {/* Toggle thumb */}
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            signedOff ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
}

/**
 * Compact toggle used per-assignee in the sign-off row. Mirrors the main
 * SignOffToggle's track and thumb but without the "Sign off" label —
 * the assignee's name is shown next to it instead.
 *
 * Uses forwardRef so Radix's Tooltip / Popover with `asChild` can attach
 * its event handlers and trigger ref to the underlying button.
 */
const MemberSignOffToggle = forwardRef<
  HTMLButtonElement,
  {
    signedOff: boolean;
    /** When true, renders the ON state in amber instead of green to
     *  signal "signed off, but a new flag landed since — needs another
     *  look". Click semantics still flow through the parent's onClick. */
    stale?: boolean;
    onClick?: () => void;
    title?: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function MemberSignOffToggle({ signedOff, stale = false, onClick, title, ...rest }, ref) {
  // Stale takes precedence over signedOff: the track stays orange (so
  // the row is visually flagged for re-review) but the thumb sits in
  // the OFF position to communicate "their previous sign-off no longer
  // counts — click to re-attest". This intentionally breaks the usual
  // "track colour ↔ thumb side" coupling because the state is itself
  // unusual.
  const trackBg = stale
    ? 'bg-[#D97706]'
    : signedOff
      ? 'bg-[#1FAC76]'
      : 'bg-neutral-200';
  const thumbX = stale
    ? 'translate-x-0.5'
    : signedOff
      ? 'translate-x-[22px]'
      : 'translate-x-0.5';
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      title={title}
      {...rest}
      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full transition-colors ${trackBg}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${thumbX}`}
      />
    </button>
  );
});

function StatusChip({ status }: { status: AnomalyRecord['status'] }) {
  if (status === 'open') return null;
  const map: Record<Exclude<AnomalyRecord['status'], 'open'>, { label: string; cls: string }> = {
    flagged: { label: 'In review', cls: 'bg-amber-100 text-amber-800' },
    resolved: { label: 'Reviewed', cls: 'bg-green-100 text-green-700' },
    dismissed: { label: 'Ignored', cls: 'bg-neutral-200 text-neutral-700' },
  };
  const { label, cls } = map[status];
  return (
    <span
      className={`inline-flex h-5 items-center rounded px-1.5 text-[10px] font-semibold uppercase tracking-wide font-mono ${cls}`}
    >
      {label}
    </span>
  );
}

function ResolutionNotice({ record }: { record: AnomalyRecord }) {
  if (!record.resolution) return null;
  const by = getTeamMember(record.resolution.byId);
  let label = '';
  let artifact = '';
  switch (record.resolution.kind) {
    case 'journal-entry':
      label = 'Resolved with a correcting journal entry';
      artifact = record.resolution.jeNumber;
      break;
    case 'reconciliation':
      label = 'Added to a reconciliation';
      artifact = record.resolution.reconName;
      break;
    case 'close-task':
      label = 'Close task created';
      artifact = record.resolution.taskId;
      break;
    case 'flux-explanation':
      label = 'Flux explanation attached';
      artifact = record.resolution.fluxId;
      break;
    case 'dismissed':
      label = `Ignored — ${record.resolution.reason}`;
      artifact = record.resolution.note ?? '';
      break;
    case 'no-action':
      label = 'Resolved — no downstream action taken';
      artifact = record.resolution.note ?? '';
      break;
  }
  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm">
      <div className="font-medium text-emerald-900">{label}</div>
      {artifact && (
        <div className="mt-1 text-emerald-800">
          <span className="font-mono">{artifact}</span>
        </div>
      )}
      {by && (
        <div className="mt-1 text-xs text-emerald-700">
          by {by.name} · {formatDate(record.resolution.at)}
        </div>
      )}
    </section>
  );
}

function formatMoney(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Normalize confidence to a whole-number percent. Seed data mixes
 * fractions (0–1) and percentages (0–100), so values ≤ 1 are scaled.
 */
function formatConfidence(c: number): number {
  return Math.round(c <= 1 ? c * 100 : c);
}
function formatDate(iso: string | undefined | null): string {
  if (!iso) return '—';
  const d = new Date(iso.includes('T') ? iso : iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
