import type { AnomalyFlag } from '../../../data/types';
import { SeverityBadge } from '../shared/SeverityBadge';
import { SourceBadge } from '../shared/SourceBadge';
import { ThumbsControl } from '../shared/ThumbsControl';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { toTitleCase } from '../ui/utils';
import { useAppStore } from '../../../store/useAppStore';
import { getTransaction } from '../../../data/transactions';

interface Props {
  flag: AnomalyFlag;
  onThumbsUp: () => void;
  onThumbsDown: () => void;
}

/**
 * AI-flag card — renders the model's reasoning inline along with three
 * supporting metrics:
 *
 *   1. Flagged transactions  — number of AI-flagged anomalies in this category
 *   2. Peak vendor           — most frequent vendor among those flags + share
 *   3. Lookback              — analysis window (2 months ending the active period)
 *
 * No drill-in link (there's no "AI detail page"). The thumbs controls
 * capture the training signal: 👍 records a positive signal; 👎 opens
 * the reason modal to tell the AI why it was wrong.
 */
export function AIFlagCard({ flag, onThumbsUp, onThumbsDown }: Props) {
  if (flag.source.kind !== 'ai') return null;
  const { modelReasoning, confidence, categoryLabel } = flag.source;
  const allRecords = useAppStore((s) => s.records);

  // ── Metric 1 — same-category AI flags ────────────────────────────────────
  // Cohort: every record carrying an AI flag with the same categoryLabel.
  const cohort = allRecords.filter((r) =>
    r.flags.some(
      (f) => f.source.kind === 'ai' && f.source.categoryLabel === categoryLabel,
    ),
  );
  const flaggedCount = cohort.length;

  // ── Metric 2 — peak vendor across the cohort ─────────────────────────────
  const vendorTally = new Map<string, number>();
  for (const r of cohort) {
    const tx = getTransaction(r.transactionId);
    const v = tx?.vendorName?.trim();
    if (v) vendorTally.set(v, (vendorTally.get(v) ?? 0) + 1);
  }
  const [peakVendor, peakVendorCount] = [...vendorTally.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0] ?? ['—', 0];

  // ── Metric 3 — fixed 2-month lookback ending in the active period ────────
  const lookbackMonths = 2;
  const lookbackRange = 'Mar – Apr 2026';

  return (
    <article className="rounded-lg border border-purple-200/70 bg-gradient-to-br from-purple-50/40 via-white to-fuchsia-50/40 p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex cursor-default">
                  <SourceBadge kind="ai" size="sm" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">{confidence}% confidence</TooltipContent>
            </Tooltip>
            <h3 className="text-sm font-semibold text-slate-900">{toTitleCase(categoryLabel)}</h3>
          </div>
        </div>
        <SeverityBadge severity={flag.severity} size="md" />
      </header>

      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        {takeTwoSentences(modelReasoning)}
      </p>

      {/* ── Three supporting metrics ────────────────────────────────────── */}
      <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
        <Metric
          label="Flagged transactions"
          value={flaggedCount.toString()}
          detail={pluralizeCategory(categoryLabel)}
        />
        <Metric
          label="Peak vendor"
          value={peakVendor}
          detail={`${peakVendorCount} of ${flaggedCount} flagged`}
        />
        <Metric
          label="Lookback"
          value={`${lookbackMonths} months`}
          detail={lookbackRange}
        />
      </div>

      <footer className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">
          Is this a real anomaly?
        </span>
        <ThumbsControl
          feedback={flag.feedback}
          onUp={onThumbsUp}
          onDown={onThumbsDown}
        />
      </footer>
    </article>
  );
}

// ─── Metric tile ─────────────────────────────────────────────────────────────

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-1 truncate font-display text-xl tracking-tight text-slate-900">
        {value}
      </div>
      <div className="mt-0.5 truncate text-xs text-slate-500">
        {detail}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Take the first 1–2 complete sentences from `text`. Sentences are matched
 * greedily against `[.!?]` followed by whitespace or end-of-string.
 */
function takeTwoSentences(text: string): string {
  const matches = text.match(/[^.!?]+[.!?]+/g);
  if (!matches) return text.trim();
  return matches.slice(0, 2).join(' ').trim();
}

/**
 * Turn a category label like "Velocity Anomaly" into a plural like
 * "Velocity anomalies" suitable for the metric subtitle.
 */
function pluralizeCategory(label: string): string {
  const lower = label.toLowerCase();
  // crude pluralization — handles "anomaly" → "anomalies", otherwise + "s"
  if (lower.endsWith('y') && !/[aeiou]y$/.test(lower)) {
    return capitalize(lower.slice(0, -1) + 'ies');
  }
  if (lower.endsWith('s')) return capitalize(lower);
  return capitalize(lower + 's');
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
