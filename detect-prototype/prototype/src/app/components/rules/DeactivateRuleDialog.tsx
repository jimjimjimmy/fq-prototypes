import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, ChevronUp, ChevronRight, Check } from 'lucide-react';
import Warning from '@floqastinc/flow-ui_icons/material/Warning';
import { useAppStore } from '../../../store/useAppStore';
import { currentPeriodId } from '../../../data/company';

/**
 * Deactivate Rule warning dialog.
 *
 * Reference: Figma node 2055:104280.
 *
 * Confirmation modal shown when the user picks "Deactivate Rule"
 * from a row's kebab menu. Explains the impact on existing
 * anomalies and asks the user to choose whether the deactivation
 * applies to the current period only or to the current AND future
 * periods. Primary action uses the FlowUI warning treatment (orange)
 * rather than danger red — deactivating is reversible.
 */
export function DeactivateRuleDialog({
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
  // Default to the broader, safer scope so a quick Enter/Deactivate
  // matches the most common user intent (don't let the rule come
  // back next period unless they explicitly opt in to that).
  const [scope, setScope] = useState<'single-period' | 'current-and-future'>(
    'current-and-future',
  );
  // Periods the user picked when scope === 'single-period'. Empty until
  // the user opens the dropdown and checks one or more. Multi-select so
  // users can backfill the deactivation across several historical periods
  // in one pass.
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  // Save is enabled only when the user has a valid scope. For
  // single-period, that means they've also picked at least one period.
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
        {/* Header — filled warning triangle + title on the left, close
             X on the right. Uses FlowUI's Material `Warning` icon
             (filled variant) tinted warning-primary (#db7712) to signal
             "be careful, but not destructive." */}
        <header className="flex items-center justify-between gap-3 px-5 pt-4">
          <div className="flex items-center gap-2.5">
            <Warning size={20} color="#db7712" /* --flo-sem-color-warning-primary */ />
            <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
              Deactivate Rule
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

        {/* Body — impact copy + scope radio group. */}
        <div className="px-5 pb-5 pt-3">
          <p className="font-['Inter'] text-[12px] font-normal leading-[18px] text-[#1d2433]">
            Deactivating{rule ? ` "${rule.name}"` : ' this rule'} will remove any
            anomalies it flagged on transactions. Anomalies with user activity
            will not be impacted.
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

        {/* Footer — Cancel (text link) + Deactivate (warning-primary
             button). Top border separates footer from body. */}
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
            className="inline-flex h-9 items-center rounded-md bg-[#db7712] px-4 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#b25d0a] disabled:cursor-not-allowed disabled:bg-[rgba(219,119,18,0.3)] disabled:hover:bg-[rgba(219,119,18,0.3)]"
          >
            Deactivate
          </button>
        </footer>
      </div>
    </div>
  );
}

function RadioOption({
  checked,
  onClick,
  children,
}: {
  checked: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  // FlowUI radio — 16x16 circle, brand-600 ring + inner dot when
  // checked, neutral border + white surface when not. Whole row is
  // the click target.
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
/* PeriodsCheckboxDropdown — multi-select dropdown grouped by year, with      */
/* checkboxes. Mirrors the HistoricalPeriodsDropdown pattern from             */
/* SaveRuleDialog but only includes periods up to and including the current   */
/* period (since deactivating future periods doesn't apply here — that's      */
/* what the "Apply to future periods" radio handles).                         */
/* -------------------------------------------------------------------------- */

const MONTH_NAMES = [
  'December',
  'November',
  'October',
  'September',
  'August',
  'July',
  'June',
  'May',
  'April',
  'March',
  'February',
  'January',
] as const;

const MONTH_TO_NUM: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const periodIdFor = (year: number, monthName: string) =>
  `${year}-${String(MONTH_TO_NUM[monthName]).padStart(2, '0')}`;

/**
 * Years to render in the dropdown — current year back to 2024 inclusive.
 * Computed from currentPeriodId so the list stays accurate if the demo's
 * "today" moves.
 */
function buildYears(): number[] {
  const currentYear = Number(currentPeriodId.split('-')[0]);
  const years: number[] = [];
  for (let y = currentYear; y >= 2024; y--) years.push(y);
  return years;
}

/**
 * Months for a given year that are ≤ the current period. For past years,
 * all 12 months. For the current year, only months up to and including
 * the current month. Returns months in display order (Dec → Jan).
 */
function monthsForYear(year: number): string[] {
  const [cyStr, cmStr] = currentPeriodId.split('-');
  const currentYear = Number(cyStr);
  const currentMonth = Number(cmStr);
  if (year < currentYear) return [...MONTH_NAMES];
  if (year === currentYear) {
    return MONTH_NAMES.filter((m) => MONTH_TO_NUM[m] <= currentMonth);
  }
  return [];
}

function PeriodsCheckboxDropdown({
  values,
  onChange,
}: {
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const years = useMemo(buildYears, []);
  // Current year is expanded by default so the user lands on the most
  // likely-picked months immediately.
  const [expandedYears, setExpandedYears] = useState<Set<number>>(
    () => new Set([years[0]]),
  );

  const allPeriodIds = useMemo(
    () => years.flatMap((y) => monthsForYear(y).map((m) => periodIdFor(y, m))),
    [years],
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

  const allSelected = values.length === allPeriodIds.length && values.length > 0;
  const toggleAll = () => {
    if (allSelected) onChange([]);
    else onChange(allPeriodIds);
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
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors ${
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
          {values.length === 0
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
            {/* Selected-count + Clear bar — only when something is picked */}
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

            {/* Select All Periods */}
            <div className="border-b border-[#e1e6ef] px-1 py-1">
              <CheckboxRow
                label="Select All Periods"
                checked={allSelected}
                onClick={toggleAll}
              />
            </div>

            {/* Years (each collapsible to its month list) */}
            <div className="max-h-[280px] overflow-y-auto">
              {years.map((year) => {
                const expanded = expandedYears.has(year);
                const months = monthsForYear(year);
                if (months.length === 0) return null;
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
