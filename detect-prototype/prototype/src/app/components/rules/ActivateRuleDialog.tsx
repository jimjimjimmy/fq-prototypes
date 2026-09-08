import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, ChevronUp, ChevronRight, Check } from 'lucide-react';
import CheckCircle from '@floqastinc/flow-ui_icons/material/CheckCircle';
import { useAppStore } from '../../../store/useAppStore';
import { currentPeriodId } from '../../../data/company';

/**
 * Activate Rule confirmation dialog.
 *
 * Mirrors DeactivateRuleDialog in structure (radio scope selector +
 * checkbox multi-select periods + confirm/cancel footer) but inverted
 * in meaning:
 *   - Header uses CheckCircle in brand-success green (success treatment)
 *     vs. Deactivate's AlertTriangle in warning-primary orange
 *   - Body copy is positive — re-running the rule on selected periods
 *   - The period dropdown shows ONLY periods where the rule is NOT
 *     currently active (inverse of the Deactivate dropdown).
 *   - CTA button uses brand green
 */
export function ActivateRuleDialog({
  ruleId,
  onCancel,
  onConfirm,
}: {
  ruleId: string;
  onCancel: () => void;
  onConfirm: (
    scope: 'single-period' | 'current-and-future',
    periodIds?: string[],
  ) => void;
}) {
  const rule = useAppStore((s) => s.rules.find((r) => r.id === ruleId));
  // Default to current+future scope so a quick Enter/Activate matches
  // the most common intent: turn the rule on for now and forward.
  const [scope, setScope] = useState<'single-period' | 'current-and-future'>(
    'current-and-future',
  );
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  // Available periods to activate = all periods up to current that the
  // rule is NOT already active in. This is the inverse of what the
  // Deactivate dialog shows.
  const inactivePeriodIds = useMemo(
    () => (rule ? computeInactivePeriodIds(rule) : []),
    [rule],
  );

  const canSave =
    scope === 'current-and-future' ||
    (scope === 'single-period' && selectedPeriods.length > 0);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_10px_25px_-3px_rgba(0,0,0,0.1),0px_4px_20px_-2px_rgba(0,0,0,0.05)]"
      >
        {/* Header — filled success check + title. Uses FlowUI's
             Material `CheckCircle` (filled variant) tinted brand-600
             (#1FAC76) to signal a positive, non-destructive action. */}
        <header className="flex items-center justify-between gap-3 px-5 pt-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle size={20} color="#1FAC76" /* --flo-sem-color-success-primary */ />
            <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
              Activate Rule
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="px-5 pb-5 pt-3">
          <p className="font-['Inter'] text-[12px] font-normal leading-[18px] text-[#1d2433]">
            Activating{rule ? ` "${rule.name}"` : ' this rule'} will run it on
            transactions in the selected periods and flag any anomalies it
            finds.
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <RadioOption
              checked={scope === 'single-period'}
              onClick={() => setScope('single-period')}
            >
              Apply to current or historical periods
            </RadioOption>
            {scope === 'single-period' && (
              <div className="ml-7 mt-1">
                <PeriodsCheckboxDropdown
                  availablePeriodIds={inactivePeriodIds}
                  values={selectedPeriods}
                  onChange={setSelectedPeriods}
                />
              </div>
            )}
            <RadioOption
              checked={scope === 'current-and-future'}
              onClick={() => setScope('current-and-future')}
            >
              Apply to future periods
            </RadioOption>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-[#e1e6ef] px-5 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 items-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#424867] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              canSave &&
              onConfirm(scope, scope === 'single-period' ? selectedPeriods : undefined)
            }
            disabled={!canSave}
            className="inline-flex h-9 items-center rounded-md bg-[#1FAC76] px-4 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749] disabled:cursor-not-allowed disabled:bg-[rgba(31,172,118,0.3)] disabled:hover:bg-[rgba(31,172,118,0.3)]"
          >
            Activate
          </button>
        </footer>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Period helpers — duplicated from DeactivateRuleDialog to keep this dialog  */
/* self-contained. If a third dialog needs the same pattern, factor these out */
/* into a shared util.                                                        */
/* -------------------------------------------------------------------------- */

function periodIdFromDate(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function* periodsBetween(start: string, end: string): Generator<string> {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  let y = sy;
  let m = sm;
  while (y < ey || (y === ey && m <= em)) {
    yield `${y}-${String(m).padStart(2, '0')}`;
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
}

/** All periods (2024-01 → currentPeriodId) where the rule is NOT
 *  currently active. Computed as: all-up-to-current MINUS active set. */
function computeInactivePeriodIds(
  rule: { createdAt: string; versionHistory?: { historicalPeriods?: string[] }[] },
): string[] {
  const active = new Set<string>();
  for (const entry of rule.versionHistory ?? []) {
    for (const p of entry.historicalPeriods ?? []) active.add(p);
  }
  const startId = periodIdFromDate(rule.createdAt);
  if (startId) {
    for (const p of periodsBetween(startId, currentPeriodId)) active.add(p);
  }
  // Universe is January 2024 through current period — covers everything
  // the user could conceivably reach back to activate.
  const inactive: string[] = [];
  for (const p of periodsBetween('2024-01', currentPeriodId)) {
    if (!active.has(p)) inactive.push(p);
  }
  return inactive;
}

/* -------------------------------------------------------------------------- */
/* Shared radio option (matches DeactivateRuleDialog)                         */
/* -------------------------------------------------------------------------- */

function RadioOption({
  checked,
  onClick,
  children,
}: {
  checked: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="radio"
      aria-checked={checked}
      className="flex w-full items-center gap-2.5 rounded-md py-1 text-left transition-colors hover:bg-[#f8fafc]"
    >
      <span
        className={`relative inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          checked
            ? 'border-[#1FAC76] bg-white'
            : 'border-[#cbd2e1] bg-white'
        }`}
      >
        {checked && (
          <span className="h-2 w-2 rounded-full bg-[#1FAC76]" />
        )}
      </span>
      <span
        className={`font-['Inter'] text-[12px] leading-4 text-[#1d2433] ${
          checked ? 'font-semibold' : 'font-normal text-[#424867]'
        }`}
      >
        {children}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* PeriodsCheckboxDropdown — same year-grouped checkbox multi-select as       */
/* DeactivateRuleDialog, but accepts an `availablePeriodIds` prop so this     */
/* version renders only periods passed in (the rule's inactive periods).     */
/* -------------------------------------------------------------------------- */

const MONTH_NAMES = [
  'December', 'November', 'October', 'September', 'August', 'July',
  'June', 'May', 'April', 'March', 'February', 'January',
] as const;

const MONTH_TO_NUM: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

const periodIdFor = (year: number, monthName: string) =>
  `${year}-${String(MONTH_TO_NUM[monthName]).padStart(2, '0')}`;

function PeriodsCheckboxDropdown({
  availablePeriodIds,
  values,
  onChange,
}: {
  availablePeriodIds: string[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  // Group available periods by year, in display order (year desc, months desc).
  const yearsWithMonths = useMemo(() => {
    const byYear = new Map<number, Set<string>>();
    for (const id of availablePeriodIds) {
      const [y, m] = id.split('-').map(Number);
      const monthName = MONTH_NAMES.find((mn) => MONTH_TO_NUM[mn] === m);
      if (!monthName) continue;
      if (!byYear.has(y)) byYear.set(y, new Set());
      byYear.get(y)!.add(monthName);
    }
    return Array.from(byYear.entries())
      .sort(([a], [b]) => b - a)
      .map(([year, monthSet]) => ({
        year,
        months: MONTH_NAMES.filter((m) => monthSet.has(m)),
      }));
  }, [availablePeriodIds]);

  const [expandedYears, setExpandedYears] = useState<Set<number>>(
    () => new Set(yearsWithMonths.length > 0 ? [yearsWithMonths[0].year] : []),
  );

  const openPanel = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPanelStyle({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !panelRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const valueSet = useMemo(() => new Set(values), [values]);

  const togglePeriod = (year: number, monthName: string) => {
    const id = periodIdFor(year, monthName);
    if (valueSet.has(id)) onChange(values.filter((v) => v !== id));
    else onChange([...values, id]);
  };

  const allSelected =
    availablePeriodIds.length > 0 && values.length === availablePeriodIds.length;
  const toggleAll = () => {
    if (allSelected) onChange([]);
    else onChange(availablePeriodIds);
  };

  const toggleYear = (year: number) => {
    const next = new Set(expandedYears);
    if (next.has(year)) next.delete(year);
    else next.add(year);
    setExpandedYears(next);
  };

  return (
    <div className="relative w-[260px]">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={availablePeriodIds.length === 0}
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          open ? 'border-[#3d7bf7]' : 'border-[#cbd2e1] hover:border-[#9aa3b5]'
        }`}
      >
        <span
          className={`min-w-0 flex-1 truncate font-['Inter'] text-xs leading-4 ${
            values.length === 0
              ? 'font-normal text-[#adb2bb]'
              : 'font-normal text-[#1d2433]'
          }`}
        >
          {availablePeriodIds.length === 0
            ? 'No inactive periods'
            : values.length === 0
              ? 'Select Periods'
              : `${values.length} period${values.length === 1 ? '' : 's'} selected`}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-[#3d7bf7]" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-[#6b7280]" />
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[200] overflow-hidden rounded-md border border-[#e1e6ef] bg-white font-['Inter'] shadow-[0px_4px_12px_rgba(0,0,0,0.15)]"
            style={panelStyle}
          >
            {values.length > 0 && (
              <div className="flex items-center justify-between border-b border-[#e1e6ef] px-3 py-2">
                <span className="font-['Inter'] text-[12px] font-normal leading-4 text-[#1d2433]">
                  {values.length} period{values.length === 1 ? '' : 's'} selected
                </span>
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="font-['Inter'] text-[12px] font-semibold leading-4 text-[#3d7bf7] transition-colors hover:text-[#1e4eae]"
                >
                  Clear
                </button>
              </div>
            )}

            <div className="border-b border-[#e1e6ef] px-1 py-1">
              <CheckboxRow
                label="Select All Periods"
                checked={allSelected}
                onClick={toggleAll}
              />
            </div>

            <div className="max-h-[280px] overflow-y-auto">
              {yearsWithMonths.map(({ year, months }) => {
                const expanded = expandedYears.has(year);
                const yearIds = months.map((m) => periodIdFor(year, m));
                const yearAllSelected = yearIds.every((id) => valueSet.has(id));
                return (
                  <div
                    key={year}
                    className="border-t border-[#e1e6ef] first:border-t-0"
                  >
                    <button
                      type="button"
                      onClick={() => toggleYear(year)}
                      className="flex h-9 w-full items-center justify-between gap-2 px-3 text-left transition-colors hover:bg-[#f8fafc]"
                    >
                      <span className="font-['Inter'] text-[12px] font-semibold leading-4 text-[#1d2433]">
                        {year}
                      </span>
                      {expanded ? (
                        <ChevronDown className="h-4 w-4 text-[#6b7280]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[#6b7280]" />
                      )}
                    </button>
                    {expanded && (
                      <div className="border-t border-[#f1f3f9] px-1 py-1">
                        <CheckboxRow
                          label="Select All"
                          checked={yearAllSelected}
                          onClick={() => {
                            if (yearAllSelected) {
                              onChange(values.filter((v) => !yearIds.includes(v)));
                            } else {
                              onChange(
                                Array.from(new Set([...values, ...yearIds])),
                              );
                            }
                          }}
                        />
                        {months.map((m) => {
                          const id = periodIdFor(year, m);
                          return (
                            <CheckboxRow
                              key={m}
                              label={m}
                              checked={valueSet.has(id)}
                              onClick={() => togglePeriod(year, m)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-full items-center gap-2 rounded-md px-2 text-left transition-colors hover:bg-[#f1f3f9]"
    >
      <span
        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
          checked ? 'border-[#1FAC76] bg-[#1FAC76]' : 'border-[#cbd2e1] bg-white'
        }`}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </span>
      <span
        className={`min-w-0 flex-1 truncate font-['Inter'] text-xs leading-4 text-[#1d2433] ${
          checked ? 'font-semibold' : 'font-normal'
        }`}
      >
        {label}
      </span>
    </button>
  );
}
