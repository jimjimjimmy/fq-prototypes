import { CircleDashed } from 'lucide-react';
import type { AnomalyRecord } from '../../../data/types';

interface Props {
  record: AnomalyRecord;
  selected: boolean;
  onClick: () => void;
}

/**
 * Inbox card for ghost (expected-but-absent) records.
 * Visually distinct from transaction cards: dashed border, muted amber tint,
 * hollow circle icon, no dollar amount, "Expected — not found" label.
 */
export function GhostInboxCard({ record, selected, onClick }: Props) {
  const ctx = record.ghostContext;
  if (!ctx) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'block w-full text-left px-4 py-3',
        'border-b border-slate-200',
        selected
          ? 'bg-indigo-50/60'
          : 'bg-amber-50/40 hover:bg-amber-50/70 transition-colors',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        {/* Left: content stack */}
        <div className="min-w-0 flex-1">
          {/* Line 1: account code + name */}
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="font-mono text-xs font-semibold text-neutral-500">
              {ctx.glAccountCode}
            </span>
            <span className="truncate font-display text-sm font-semibold tracking-tight text-neutral-900">
              {ctx.glAccountName}
            </span>
          </div>

          {/* Line 2: period + vendor if known */}
          <div className="mt-0.5 text-xs text-neutral-500 truncate">
            April 2026
            {ctx.expectedVendor && (
              <span className="text-neutral-400"> · {ctx.expectedVendor}</span>
            )}
          </div>

          {/* Line 3: category label */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-amber-400 bg-amber-50 px-2 py-[3px] text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              <CircleDashed className="h-2.5 w-2.5" />
              Expected — not found
            </span>
          </div>
        </div>

        {/* Right rail: severity badge styled for absence */}
        <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
          <span className="font-display text-sm leading-none tabular-nums text-neutral-400 line-through">
            {ctx.typicalAmount
              ? `$${ctx.typicalAmount.toLocaleString('en-US')}`
              : '—'}
          </span>
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-dashed border-amber-400 text-[10px] font-bold text-amber-600">
            {ctx.severity}
          </span>
        </div>
      </div>
    </button>
  );
}
