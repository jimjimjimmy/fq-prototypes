import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, ChevronUp, ChevronRight, Check } from 'lucide-react';

/**
 * Save Rule confirmation dialog.
 *
 * Reference: Figma 2124:90750 (initial), 2124:90864 (with historical
 * dropdown), 2082:60168 (dropdown expanded).
 *
 * Shown when the user clicks Save in the Add Rule form (whether
 * creating or editing). Lets the user pick the scope of the save:
 *   - Current and future periods only (default)
 *   - Current, future and historical periods (requires picking
 *     which historical periods via a multi-select dropdown)
 *
 * Save is disabled when the historical option is selected but no
 * historical periods have been picked.
 */
export function SaveRuleDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (scope: 'current-and-future' | 'with-historical', historicalPeriods: string[]) => void;
}) {
  const [scope, setScope] = useState<'current-and-future' | 'with-historical'>(
    'current-and-future',
  );
  const [historicalPeriods, setHistoricalPeriods] = useState<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const canSave = scope === 'current-and-future' || historicalPeriods.length > 0;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col overflow-visible rounded-md border border-[#e1e6ef] bg-white shadow-[0px_10px_25px_-3px_rgba(0,0,0,0.1),0px_4px_20px_-2px_rgba(0,0,0,0.05)]"
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 px-5 pt-4">
          <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
            Save Rule
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Body */}
        <div className="px-5 pb-5 pt-3">
          <p className="font-['Inter'] text-[12px] font-normal leading-[18px] text-[#1d2433]">
            Saving these changes will create a new version of this rule which
            will be run and be applied to all transactions in the selected
            periods.
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <RadioOption
              checked={scope === 'current-and-future'}
              onClick={() => setScope('current-and-future')}
            >
              Current and future periods only
            </RadioOption>
            <RadioOption
              checked={scope === 'with-historical'}
              onClick={() => setScope('with-historical')}
            >
              Current, future and historical periods
            </RadioOption>
            {scope === 'with-historical' && (
              <div className="ml-7 mt-1">
                <HistoricalPeriodsDropdown
                  values={historicalPeriods}
                  onChange={setHistoricalPeriods}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
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
            onClick={() => canSave && onConfirm(scope, historicalPeriods)}
            disabled={!canSave}
            className="inline-flex h-9 items-center rounded-md bg-[#1FAC76] px-4 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749] disabled:cursor-not-allowed disabled:bg-[#1FAC76]/40 disabled:hover:bg-[#1FAC76]/40"
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}

// ---------- Radio ----------

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
          checked ? 'border-[#1FAC76] bg-white' : 'border-[#cbd2e1] bg-white'
        }`}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-[#1FAC76]" />}
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

// ---------- Historical Periods Dropdown ----------

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

// Users can only trace history back to 2024 for now — earlier years
// aren't supported by the underlying detection lookback. List goes
// from current year (2026) down to 2024 inclusive.
const YEARS = [2026, 2025, 2024];

const periodIdFor = (year: number, monthName: string) =>
  `${year}-${String(MONTH_TO_NUM[monthName]).padStart(2, '0')}`;

const ALL_PERIOD_IDS = YEARS.flatMap((y) =>
  MONTH_NAMES.map((m) => periodIdFor(y, m)),
);

function HistoricalPeriodsDropdown({
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
  // The current year (2026) is expanded by default so the user lands
  // straight on this year's periods — the most common pick when
  // backfilling a rule. Older years stay collapsed until expanded.
  const [expandedYears, setExpandedYears] = useState<Set<number>>(
    () => new Set([2026]),
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

  const allSelected = values.length === ALL_PERIOD_IDS.length;
  const toggleAll = () => {
    if (allSelected) onChange([]);
    else onChange(ALL_PERIOD_IDS);
  };

  const toggleYear = (year: number) => {
    const next = new Set(expandedYears);
    if (next.has(year)) next.delete(year);
    else next.add(year);
    setExpandedYears(next);
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors ${
          open ? 'border-[#3d7bf7]' : 'border-[#cbd2e1] hover:border-[#9aa3b5]'
        }`}
      >
        <span
          className={`font-['Inter'] text-xs font-normal leading-4 ${
            values.length === 0 ? 'text-[#adb2bb]' : 'text-[#1d2433]'
          }`}
        >
          Select Historical Periods
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
            {/* Top header — selected count + Clear link. Only renders
                 when at least one period is selected; matches Figma. */}
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

            {/* Select All Periods checkbox */}
            <div className="border-b border-[#e1e6ef] px-1 py-1">
              <CheckboxRow
                label="Select All Periods"
                checked={allSelected}
                onClick={toggleAll}
              />
            </div>

            {/* Scrollable year list — each year block is separated
                 from the previous one by a top divider so the
                 boundaries between years read clearly, especially
                 when several adjacent years are expanded. */}
            <div className="max-h-[280px] overflow-y-auto">
              {YEARS.map((year) => {
                const expanded = expandedYears.has(year);
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
                          checked={MONTH_NAMES.every((m) =>
                            valueSet.has(periodIdFor(year, m)),
                          )}
                          onClick={() => {
                            const ids = MONTH_NAMES.map((m) => periodIdFor(year, m));
                            const allYearSelected = ids.every((id) => valueSet.has(id));
                            if (allYearSelected) {
                              onChange(values.filter((v) => !ids.includes(v)));
                            } else {
                              onChange(Array.from(new Set([...values, ...ids])));
                            }
                          }}
                        />
                        {MONTH_NAMES.map((m) => {
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
