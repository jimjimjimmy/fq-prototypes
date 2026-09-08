import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { InboxFilters as FiltersShape } from '../../../data/types';
import { useAppStore } from '../../../store/useAppStore';
import { getTeamMember } from '../../../data/team';
import { entities, periods } from '../../../data/company';
import { chartOfAccounts } from '../../../data/chartOfAccounts';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

/**
 * Active filter chips for the Insights inbox. Mirrors the Transactions
 * ActiveFilterChips look + overflow behavior, but only renders chips
 * for filters that map onto an Insight record:
 *   • Assignee
 *   • Account
 *   • Status (view)
 *   • Entity (subsidiary)
 *   • Posting Period
 * Other filter slices (source / txType / date / vendor / department /
 * etc.) have no equivalent field on Insights, so even if the modal
 * leaves them set in the shared store we don't surface a chip for
 * them on this surface.
 */

function getAccountChipLabel(code: string): string {
  const acct = chartOfAccounts.find((a) => a.code === code);
  return acct ? `${code} ${acct.name}` : code;
}

const CHIP_GAP = 6; // gap-1.5 between chips

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
      <span ref={spanRef} className="flex-1 truncate text-left">
        {label}
      </span>
      <X className="h-3 w-3 shrink-0 text-[#6b7280]" />
    </button>
  );

  if (!truncated) return chip;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{chip}</TooltipTrigger>
      <TooltipContent side="bottom" className="z-[150]">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function InsightsFilterChips({ filters }: { filters: FiltersShape }) {
  const setFilters = useAppStore((s) => s.setFilters);
  const clearFilters = useAppStore((s) => s.clearFilters);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const morePanelRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const stripRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const ghostMoreRef = useRef<HTMLButtonElement>(null);
  const [visibleIndices, setVisibleIndices] = useState<number[] | null>(null);
  const visibleIndicesRef = useRef(visibleIndices);
  visibleIndicesRef.current = visibleIndices;

  const chips: Chip[] = [];

  // Open / Resolved status is expressed by the Open · Resolved
  // tab row above the inbox list, so we don't also echo it here
  // as a chip. Keeps the active-filter strip focused on filters
  // that aren't already surfaced by the tab UI.

  // Assignee chips — one per selected assignee id, named.
  (filters.assigneeId ?? []).forEach((id) => {
    const member = getTeamMember(id);
    chips.push({
      key: `assignee-${id}`,
      label: member?.name ?? id,
      remove: () =>
        setFilters({
          assigneeId: (filters.assigneeId ?? []).filter((a) => a !== id),
        }),
    });
  });

  // Account chips — one per selected GL account code, "{code} {name}".
  (filters.accountCode ?? []).forEach((code) => {
    chips.push({
      key: `account-${code}`,
      label: getAccountChipLabel(code),
      remove: () =>
        setFilters({
          accountCode: (filters.accountCode ?? []).filter((c) => c !== code),
        }),
    });
  });

  // Entity (subsidiary) chips.
  (filters.entityId ?? []).forEach((id) => {
    const entity = entities.find((e) => e.id === id);
    chips.push({
      key: `entity-${id}`,
      label: entity?.shortName ?? id,
      remove: () =>
        setFilters({
          entityId: (filters.entityId ?? []).filter((e) => e !== id),
        }),
    });
  });

  // Posting period chips.
  (filters.periodId ?? []).forEach((id) => {
    const period = periods.find((p) => p.id === id);
    chips.push({
      key: `period-${id}`,
      label: period?.label ?? id,
      remove: () =>
        setFilters({
          periodId: (filters.periodId ?? []).filter((p) => p !== id),
        }),
    });
  });

  useLayoutEffect(() => {
    const strip = stripRef.current;
    const ghost = ghostRef.current;
    if (!strip || !ghost || chips.length === 0) {
      setVisibleIndices(null);
      return;
    }

    const calculate = () => {
      const chipButtons = Array.from(ghost.querySelectorAll('button')).filter(
        (b) => b !== ghostMoreRef.current,
      );
      const widths = chipButtons.map((el) => el.getBoundingClientRect().width);
      const stripW = strip.clientWidth;
      const allFitW = widths.reduce(
        (s, w, i) => s + w + (i > 0 ? CHIP_GAP : 0),
        0,
      );

      if (allFitW <= stripW) {
        setVisibleIndices(null);
        return;
      }

      const moreBtnW =
        ghostMoreRef.current?.getBoundingClientRect().width ?? 78;
      const available = stripW - moreBtnW - CHIP_GAP;
      let usedW = 0;
      const indices: number[] = [];
      for (let i = 0; i < widths.length; i++) {
        const gap = indices.length > 0 ? CHIP_GAP : 0;
        const needed = gap + widths[i];
        if (usedW + needed <= available) {
          usedW += needed;
          indices.push(i);
        }
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
      if (
        !moreBtnRef.current?.contains(t) &&
        !morePanelRef.current?.contains(t)
      )
        setMoreOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moreOpen]);

  if (chips.length === 0) return null;

  const visibleSet = visibleIndices !== null ? new Set(visibleIndices) : null;
  const visible = visibleSet
    ? chips.filter((_, i) => visibleSet.has(i))
    : chips;
  const hidden = visibleSet
    ? chips.filter((_, i) => !visibleSet.has(i))
    : [];

  const openMore = () => {
    const rect = moreBtnRef.current?.getBoundingClientRect();
    if (rect) setPanelPos({ top: rect.bottom + 4, left: rect.left });
    setMoreOpen((v) => !v);
  };

  return (
    <div className="flex items-center gap-1.5 border-b border-[#e1e6ef] bg-white px-4 py-2">
      {/* Ghost strip — off-screen, measures natural chip widths so the
           pack algorithm reserves the actual "+N more" badge width. */}
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

      {/* Visible chip strip + overflow badge inline. */}
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

      {/* Clear all — pinned right. */}
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
              <h3 className="font-header text-sm font-bold text-[#1d2433]">
                More filters
              </h3>
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
