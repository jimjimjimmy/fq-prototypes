import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import type { AnomalyRecord, Transaction } from '../../../data/types';
import { SeverityBadge } from '../shared/SeverityBadge';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { toTitleCase } from '../ui/utils';

interface Props {
  record: AnomalyRecord;
  transaction: Transaction;
  entityShortName?: string;
  selected: boolean;
  onClick: () => void;
  /** Double-click triggers fast sign-off */
  onDoubleClick?: () => void;
  /** When true, the card briefly flashes purple as it appears post-scan */
  flashing?: boolean;
  /** Whether the parent inbox panel is collapsed — suppresses the
   *  truncation tooltip so it can't linger after the panel hides. */
  inboxCollapsed?: boolean;
}

/**
 * Inbox card layout (per design spec).
 *
 *   Line 1: {transactionId} · {date}           {amount — right-anchored}
 *   Line 2: {subsidiary} · {GL account}        {severity — right-anchored}
 *   Line 3: {rule or AI name}                  (subtle, neutral-500)
 *
 * Account moved above the anomaly name based on user feedback — reviewers
 * triage by account first, then care which rule/AI fired. Severity stays
 * pinned to the prominent row so it's never missed.
 *
 * Vendor name is intentionally omitted from the card — it reads in the
 * detail panel. The card stays compact and scan-optimized for triage.
 */
export function InboxCard({
  record,
  transaction,
  entityShortName,
  selected,
  onClick,
  onDoubleClick,
  flashing = false,
  inboxCollapsed = false,
}: Props) {
  // Defensive: a record can theoretically end up with no flags after the
  // rules engine re-evaluates (e.g. its rule was deleted) and won't be
  // dropped if it's already resolved. Skip rendering to avoid a crash.
  if (record.flags.length === 0) return null;
  const primaryFlag = record.flags.reduce((a, b) =>
    a.severity >= b.severity ? a : b,
  );

  const primaryReason =
    primaryFlag.source.kind === 'rule'
      ? primaryFlag.source.ruleName
      : toTitleCase(primaryFlag.source.categoryLabel);

  // Green check stamp shows only when every assigned reviewer/preparer
  // has signed off. Resolved/dismissed status alone isn't enough — a
  // record can be resolved while some assignees still owe a sign-off.
  // The submitter is a special case: their sign-off is implicit (the
  // act of submitting), tracked via `submitterSignOffRevoked` rather
  // than the `record.signOffs` map. So if the submitter is also an
  // assignee, we check that flag instead of the map for that entry.
  const allSignedOff =
    record.assigneeIds.length > 0 &&
    record.assigneeIds.every((id) => {
      if (id === transaction.submitterId) {
        return !record.submitterSignOffRevoked;
      }
      return Boolean(record.signOffs?.[id]);
    });

  // A sign-off is "stale" when a flag was detected on the record AFTER
  // that sign-off — surfaced as an orange/amber toggle in the detail
  // panel. When any sign-off is stale, the record isn't truly closed
  // out, so we keep the severity score visible instead of overlaying
  // the green check stamp.
  const hasStaleSignOff = allSignedOff
    && Object.values(record.signOffs ?? {}).some((so) =>
      record.flags.some(
        (f) => new Date(f.detectedAt).getTime() > new Date(so.at).getTime(),
      ),
    );
  const showResolvedStamp = allSignedOff && !hasStaleSignOff;

  return (
    <button
      type="button"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={[
        'block w-full text-left border-b border-[#e1e6ef] px-6 py-4 transition-colors',
        selected ? 'bg-[#F1F3F9]' : 'bg-white hover:bg-slate-50',
      ].join(' ')}
    >
      {/* keyframes scoped to this card; defined once in the inbox panel
          but kept here too as a fallback in case the panel doesn't mount it */}
      <style>{`
        @keyframes badge-stamp {
          0%   { transform: scale(2.8) translate(2px, -2px); opacity: 0; }
          55%  { transform: scale(0.88); opacity: 1; }
          72%  { transform: scale(1.10); }
          100% { transform: scale(1); }
        }
        @keyframes spark-fly {
          0%   { opacity: 0; transform: rotate(var(--a)) translateY(-2px) scaleY(1); }
          18%  { opacity: 1; }
          100% { opacity: 0; transform: rotate(var(--a)) translateY(-15px) scaleY(0.4); }
        }
      `}</style>
      {/* Outer two-column layout: 3-line content stack on the left,
           amount + severity both pinned flush to the right border on the
           right. The pair is vertically centered against the content
           stack so the right rail reads as a tidy aligned column down
           the inbox. */}
      <div className="flex items-start gap-1">
        <div className="min-w-0 flex-1">
          {/* Line 1: ID · line · date (amount moved to right rail so
               it can stay flush with the severity badge below it).
               Each `·` separator is its own span so the flex `gap-2`
               applies equally on both sides — the dot reads as visually
               centered between the values it separates instead of
               glued to the right value. */}
          <div className="flex min-w-0 items-baseline gap-1 font-['Inter'] text-xs leading-4 text-[#1d2433]">
            <span className="font-semibold">
              {transaction.transactionId}
            </span>
            {transaction.transactionLine && (
              <>
                <span className="font-normal" aria-hidden>·</span>
                <span className="font-normal whitespace-nowrap">
                  {transaction.transactionLine}
                </span>
              </>
            )}
            <span className="font-normal" aria-hidden>·</span>
            <span className="font-normal whitespace-nowrap">
              {formatDate(transaction.date)}
            </span>
          </div>

          {/* Line 2: subsidiary · account.
               Tight margin with line 1 to visually pair the transaction ID
               with its subsidiary/account context. */}
          <div className="mt-0.5 flex items-center">
            <TruncatableAccountLine
              entityShortName={entityShortName}
              accountCode={transaction.glAccountCode}
              accountName={transaction.glAccountName}
              tooltipDisabled={inboxCollapsed}
            />
          </div>

          {/* Line 3: anomaly name. Stale (re-review) state is now
               communicated entirely inside the detail panel's assignees
               card (amber toggle + amber check), so the inbox row reads
               cleanly as "what fired" without a duplicated pill here. */}
          <div className="mt-0.5 flex min-w-0 items-center gap-1.5 font-['Inter'] text-xs font-normal leading-4 text-[#1d2433]/65">
            <span className="truncate">
              {record.flags.length > 1
                ? `${record.flags.length} anomalies`
                : '1 anomaly'}
            </span>
          </div>
        </div>

        {/* Right rail: amount above, severity badge below — both flush
             right, the pair vertically centered against the content
             stack. Keeps the check-stamp + sparks resolution animation
             anchored to the badge. */}
        <div className="flex shrink-0 flex-col items-end gap-0">
          <span className="font-['Inter'] text-[14px] font-semibold leading-5 tabular-nums text-[#1d2433]">
            {formatMoney(transaction.amount)}
          </span>
          <div className="flex items-center gap-1.5">
          <div className="relative">
          {/* Severity badge — vanishes right as the check stamp lands.
                Stays visible when any sign-off is stale (orange toggle). */}
          <span
            className={[
              'block',
              showResolvedStamp
                ? 'opacity-0 transition-opacity duration-75 delay-[200ms]'
                : '',
            ].join(' ')}
          >
            <SeverityBadge
              severity={record.primarySeverity}
              breakdown={primaryFlag.scoreBreakdown}
              size="sm"
              tooltipAlign="right"
            />
          </span>
          {showResolvedStamp && (
            <>
              {/* Outer wrapper centers over severity badge; inner span animates independently */}
              <span className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <span
                  key="check-stamp"
                  className="inline-flex items-center justify-center rounded-full bg-[#1FAC76] p-1 text-white [animation:badge-stamp_380ms_cubic-bezier(0.2,0,0,1)_both]"
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                </span>
              </span>
              {/* Sparks — same centering pattern */}
              <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center" aria-hidden="true">
                <span className="relative h-4 w-4">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <span
                      key={angle}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '1.5px',
                        height: '5px',
                        marginLeft: '-0.75px',
                        marginTop: '-2.5px',
                        background: 'rgb(52 211 153)',
                        borderRadius: '2px',
                        ['--a' as string]: `${angle}deg`,
                        animation: 'spark-fly 380ms ease-out 215ms both',
                      }}
                    />
                  ))}
                </span>
              </span>
            </>
          )}
          </div>
          </div>
        </div>
      </div>
    </button>
  );
}

/**
 * Subsidiary · GL account line that surfaces a tooltip with the full text
 * only when the rendered span is actually overflowing. Avoids redundant
 * tooltips on cards where everything fits.
 *
 * The Tooltip + TooltipTrigger always render so the span's lifecycle is
 * stable; the TooltipContent only mounts when `truncated` is true so
 * hovering a non-overflowing span doesn't show a redundant tooltip.
 *
 * `min-w-0` is essential — without it the flex parent's default
 * `min-width: auto` lets the span grow to its intrinsic min-content
 * width, so `truncate` never engages and `scrollWidth === clientWidth`.
 */
function TruncatableAccountLine({
  entityShortName,
  accountCode,
  accountName,
  tooltipDisabled = false,
}: {
  entityShortName?: string;
  accountCode: string;
  accountName: string;
  /** When true (e.g. inbox is collapsed), the tooltip is force-closed so
   *  it can't linger over an off-screen / 0-width card. */
  tooltipDisabled?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setTruncated(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [entityShortName, accountCode, accountName]);

  // Belt-and-suspenders: if the parent disables tooltips mid-hover (e.g.
  // user collapses the inbox), eagerly close any open tooltip so it
  // doesn't outlive its trigger.
  useEffect(() => {
    if (tooltipDisabled && open) setOpen(false);
  }, [tooltipDisabled, open]);

  const fullText = `${entityShortName ? `${entityShortName} · ` : ''}${accountCode} ${accountName}`;

  return (
    <Tooltip open={tooltipDisabled ? false : open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <span
          ref={ref}
          className="min-w-0 flex-1 truncate font-['Inter'] text-xs font-normal leading-4 text-[#adb2bb]"
        >
          {entityShortName && <span>{entityShortName}</span>}
          {entityShortName && ' · '}
          <span>
            {accountCode} {accountName}
          </span>
        </span>
      </TooltipTrigger>
      {truncated && !tooltipDisabled && (
        <TooltipContent side="top">
          {fullText}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

function formatMoney(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
