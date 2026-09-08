import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { InboxFilters as FiltersShape } from '../../../data/types';
import { useAppStore, transactions } from '../../../store/useAppStore';
import { getTeamMember } from '../../../data/team';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

function getAccountChipLabel(code: string): string {
  const tx = transactions.find((t) => t.glAccountCode === code);
  return tx ? `${code} ${tx.glAccountName}` : code;
}

const SORT_LABELS: Record<string, string> = {
  amount: 'Amount',
  account: 'Account',
  'rule-type': 'Anomaly type',
};

const CHIP_GAP = 6;  // gap-1.5 between chips

interface Chip {
  key: string;
  label: string;
  remove: () => void;
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    setTruncated(el.scrollWidth > el.clientWidth);
  }, [label]);

  const chip = (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex h-7 max-w-[96px] shrink-0 items-center gap-1.5 rounded-full border border-[#e1e6ef] bg-white px-2 font-header text-xs font-medium text-[#1d2433] transition-colors hover:bg-[#f1f3f9]"
    >
      <span ref={spanRef} className="flex-1 truncate text-left">{label}</span>
      <X className="h-3 w-3 shrink-0 text-[#6b7280]" />
    </button>
  );

  if (!truncated) return chip;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{chip}</TooltipTrigger>
      {/* z-[150] sits above the "+N more" popover (z-[100]) so the tooltip
           remains visible when hovering chips inside the overflow popover. */}
      <TooltipContent side="bottom" className="z-[150]">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function ActiveFilterChips({ filters }: { filters: FiltersShape }) {
  const setFilters = useAppStore((s) => s.setFilters);
  const clearFilters = useAppStore((s) => s.clearFilters);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const morePanelRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const stripRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const ghostMoreRef = useRef<HTMLButtonElement>(null);
  const [visibleIndices, setVisibleIndices] = useState<number[] | null>(null); // null = all visible
  // Mirror visibleIndices into a ref so the ResizeObserver-driven
  // `calculate` closure always reads the current value rather than the
  // stale value captured at useLayoutEffect mount time.
  const visibleIndicesRef = useRef(visibleIndices);
  visibleIndicesRef.current = visibleIndices;

  const chips: Chip[] = [];

  // Sort state is intentionally not surfaced as a chip — the sort indicator
  // lives inside the Sort and Filter modal trigger.

  if (filters.search)
    chips.push({ key: 'search', label: `"${filters.search}"`, remove: () => setFilters({ search: '' }) });

  if (filters.source?.length === 1) {
    chips.push({
      key: 'source',
      label: filters.source[0] === 'ai' ? 'AI only' : 'Rule only',
      remove: () => setFilters({ source: undefined }),
    });
  }

  // Open / Resolved status is now expressed by the Open · Resolved
  // tab row above the inbox list, so we don't echo it here as a
  // chip. Other view values ('all', 'ignored') still aren't
  // surfaced as chips.

  (filters.assigneeId ?? []).forEach((id) => {
    const member = getTeamMember(id);
    chips.push({
      key: `assignee-${id}`,
      label: member?.name ?? id,
      remove: () => setFilters({ assigneeId: (filters.assigneeId ?? []).filter((a) => a !== id) }),
    });
  });

  (filters.accountCode ?? []).forEach((code) => {
    chips.push({
      key: `account-${code}`,
      label: getAccountChipLabel(code),
      remove: () => setFilters({ accountCode: (filters.accountCode ?? []).filter((c) => c !== code) }),
    });
  });

  (filters.txType ?? []).forEach((t) => {
    const label = t.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
    chips.push({
      key: `txtype-${t}`,
      label,
      remove: () => setFilters({ txType: (filters.txType ?? []).filter((x) => x !== t) }),
    });
  });

  if (filters.dateFrom || filters.dateTo) {
    const fmt = (iso: string) => {
      const [y, m, d] = iso.split('-');
      return y && m && d ? `${m}/${d}/${y}` : iso;
    };
    const label =
      filters.dateFrom && filters.dateTo
        ? `${fmt(filters.dateFrom)} – ${fmt(filters.dateTo)}`
        : filters.dateFrom
          ? `From ${fmt(filters.dateFrom)}`
          : `To ${fmt(filters.dateTo!)}`;
    chips.push({ key: 'date', label, remove: () => setFilters({ dateFrom: undefined, dateTo: undefined }) });
  }

  if (filters.commented)
    chips.push({
      key: 'commented',
      label: filters.commented === 'yes' ? 'Has comments' : 'No comments',
      remove: () => setFilters({ commented: undefined }),
    });

  // Measure each chip's natural rendered width via a hidden ghost div, then
  // calculate how many fit in the strip. Re-runs when chip set changes or strip resizes.
  useLayoutEffect(() => {
    const strip = stripRef.current;
    const ghost = ghostRef.current;
    if (!strip || !ghost || chips.length === 0) { setVisibleIndices(null); return; }

    const calculate = () => {
      // Skip the ghost overflow badge — only measure the chip widths.
      const chipButtons = Array.from(ghost.querySelectorAll('button')).filter(
        (b) => b !== ghostMoreRef.current,
      );
      const widths = chipButtons.map((el) => el.getBoundingClientRect().width);
      const stripW = strip.clientWidth;
      const allFitW = widths.reduce((s, w, i) => s + w + (i > 0 ? CHIP_GAP : 0), 0);

      if (allFitW <= stripW) { setVisibleIndices(null); return; }

      // When overflow is already rendered, the parent flex layout has
      // shrunk stripW to make room for the "+N more" badge — so the
      // available space for chips equals stripW directly. When overflow
      // ISN'T rendered yet, we need to predict the future shrunk width by
      // subtracting the measured badge width + a chip gap. This avoids
      // double-counting the reservation on resize cycles (which previously
      // caused the algorithm to drop chips that genuinely had room).
      // The "+N more" badge now lives inside the strip, so the strip's
      // flex-1 width doesn't change when overflow is shown. Reserve the
      // measured badge width + a gap for the chip packing.
      const moreBtnW = ghostMoreRef.current?.getBoundingClientRect().width ?? 78;
      const available = stripW - moreBtnW - CHIP_GAP;
      let usedW = 0;
      const indices: number[] = [];
      for (let i = 0; i < widths.length; i++) {
        const gap = indices.length > 0 ? CHIP_GAP : 0;
        const needed = gap + widths[i];
        if (usedW + needed <= available) { usedW += needed; indices.push(i); }
      }
      setVisibleIndices(indices.length > 0 ? indices : [0]);
    };

    calculate();
    const ro = new ResizeObserver(calculate);
    ro.observe(strip);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips.length, chips.map((c) => c.key).join('|')]);

  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!moreBtnRef.current?.contains(t) && !morePanelRef.current?.contains(t))
        setMoreOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moreOpen]);

  if (chips.length === 0) return null;

  const visibleSet = visibleIndices !== null ? new Set(visibleIndices) : null;
  const visible = visibleSet ? chips.filter((_, i) => visibleSet.has(i)) : chips;
  const hidden = visibleSet ? chips.filter((_, i) => !visibleSet.has(i)) : [];

  const openMore = () => {
    const rect = moreBtnRef.current?.getBoundingClientRect();
    if (rect) setPanelPos({ top: rect.bottom + 4, left: rect.left });
    setMoreOpen((v) => !v);
  };

  return (
    <div className="flex items-center gap-1.5 border-b border-[#e1e6ef] bg-white px-4 py-2">
      {/* Ghost strip — off-screen, invisible. Renders all chips and the
           "+N more" badge at natural width for measurement, so the packing
           algorithm reserves the actual badge width rather than a guess. */}
      <div
        ref={ghostRef}
        aria-hidden
        className="pointer-events-none flex items-center gap-1.5"
        style={{ visibility: 'hidden', position: 'fixed', top: -9999, left: 0 }}
      >
        {chips.map((c) => (
          <FilterChip key={c.key} label={c.label} onRemove={() => {}} />
        ))}
        <button
          ref={ghostMoreRef}
          type="button"
          className="inline-flex h-7 shrink-0 items-center rounded-full bg-[#f0f5ff] px-2.5 font-header text-xs font-medium text-[#3d7bf7]"
        >
          +{Math.max(1, chips.length - 1)} more
        </button>
      </div>

      {/* Visible chip strip — the overflow badge sits inside it right after
           the last visible chip so they read as a single packed group. */}
      <div ref={stripRef} className="flex min-w-0 flex-1 items-center gap-1.5">
        {visible.map((c) => (
          <FilterChip key={c.key} label={c.label} onRemove={c.remove} />
        ))}
        {hidden.length > 0 && (
          <button
            ref={moreBtnRef}
            type="button"
            onClick={openMore}
            className="inline-flex h-7 shrink-0 items-center rounded-full bg-[#f0f5ff] px-2.5 font-header text-xs font-medium text-[#3d7bf7] transition-colors hover:bg-[#e5eeff]"
          >
            +{hidden.length} more
          </button>
        )}
      </div>

      {/* Clear all — plain text link, always pinned right */}
      <button
        type="button"
        onClick={clearFilters}
        className="shrink-0 font-header text-xs font-medium text-[#6b7280] underline-offset-2 transition-colors hover:text-[#1d2433] hover:underline"
      >
        Clear all
      </button>

      {/* +N more popover */}
      {moreOpen &&
        createPortal(
          <div
            ref={morePanelRef}
            className="fixed z-[100] w-72 rounded-lg border border-[#e1e6ef] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.15)]"
            style={{ top: panelPos.top, left: panelPos.left }}
          >
            <div className="flex items-center justify-between border-b border-[#e1e6ef] px-4 py-3">
              <h3 className="font-header text-sm font-bold text-[#1d2433]">More filters</h3>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded text-[#6b7280] transition-colors hover:bg-[#f3f4f6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 p-4">
              {hidden.map((c) => (
                <FilterChip
                  key={c.key}
                  label={c.label}
                  onRemove={() => {
                    c.remove();
                    if (hidden.length === 1) setMoreOpen(false);
                  }}
                />
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
