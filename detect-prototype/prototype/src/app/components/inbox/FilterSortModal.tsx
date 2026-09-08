import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Check, ChevronDown, Plus, CalendarDays, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import type { InboxFilters, SortKey, TransactionType } from '../../../data/types';
import { useAppStore, transactions } from '../../../store/useAppStore';
import { team, getTeamMember } from '../../../data/team';
import { entities, periods } from '../../../data/company';
import { vendors, getVendor } from '../../../data/vendors';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Which surface is mounting the modal. Drives the available
   *  sort + filter options. Defaults to 'transactions' so existing
   *  callers don't need to change. */
  variant?: 'transactions' | 'insights';
}

type FilterKey =
  | 'anomalyType'
  | 'assignee'
  | 'account'
  | 'status'
  | 'txType'
  | 'txDate'
  | 'subsidiary'
  | 'postingPeriod'
  | 'vendor'
  | 'department'
  | 'class'
  | 'location'
  | 'currency'
  | 'createdBy'
  | 'memo';

const SORT_OPTIONS_BY_VARIANT: Record<
  NonNullable<Props['variant']>,
  { value: SortKey; label: string }[]
> = {
  transactions: [
    { value: 'amount', label: 'Amount' },
    { value: 'severity', label: 'Severity Score' },
    { value: 'account', label: 'Account' },
    { value: 'rule-type', label: 'Anomaly type' },
  ],
  // Insights: only amount + account. Amount is the default sort
  // since the dollar callout is the primary scan column. No
  // severity (Insights have no severity score) and no rule-type
  // (Insights aren't rules-based).
  insights: [
    { value: 'amount', label: 'Amount' },
    { value: 'account', label: 'Account' },
  ],
};

// Single source of truth — the master list of every filterable field. Every
// entry can be in the visible row or in the "Add Filter" popover; the X on
// each visible filter moves it back into the popover.
const ALL_FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'anomalyType', label: 'Anomaly Type' },
  { key: 'assignee', label: 'Assignee' },
  { key: 'account', label: 'Account' },
  { key: 'status', label: 'Status' },
  { key: 'txType', label: 'Transaction Type' },
  { key: 'txDate', label: 'Transaction Date' },
  { key: 'subsidiary', label: 'Entity' },
  { key: 'postingPeriod', label: 'Posting Period' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'department', label: 'Department' },
  { key: 'class', label: 'Class' },
  { key: 'location', label: 'Location' },
  { key: 'currency', label: 'Currency' },
  { key: 'createdBy', label: 'Created By' },
  { key: 'memo', label: 'Memo' },
];

const DEFAULT_VISIBLE_BY_VARIANT: Record<
  NonNullable<Props['variant']>,
  FilterKey[]
> = {
  transactions: ['anomalyType', 'assignee', 'account', 'txType', 'txDate'],
  // Insights: drop the Transaction-specific filters (anomaly type
  // isn't applicable — Insights are all AI; transaction type +
  // transaction date aren't useful per the design call).
  insights: ['assignee', 'account'],
};

// Filter keys that are blocked entirely on the Insights variant —
// not visible by default AND not in the "Add Filter" popover.
const INSIGHTS_HIDDEN_FILTERS: FilterKey[] = [
  'anomalyType',
  'status',
  'txType',
  'txDate',
];

// Status is now expressed by the Open · Resolved tab row above the
// inbox list, so it's blocked on Transactions too. Removed from the
// default visible set above and from the addable list below.
const TRANSACTIONS_HIDDEN_FILTERS: FilterKey[] = ['status'];

// Maps a filter key to the InboxFilters state slice it owns. Removing a
// filter via its X clears these fields so it doesn't keep filtering invisibly.
function clearFilterState(draft: InboxFilters, key: FilterKey): InboxFilters {
  switch (key) {
    case 'anomalyType': return { ...draft, source: undefined };
    case 'assignee': return { ...draft, assigneeId: undefined };
    case 'account': return { ...draft, accountCode: undefined };
    case 'status': return { ...draft, view: 'all' };
    case 'txType': return { ...draft, txType: undefined };
    case 'txDate': return { ...draft, dateFrom: undefined, dateTo: undefined };
    case 'subsidiary': return { ...draft, entityId: undefined };
    case 'postingPeriod': return { ...draft, periodId: undefined };
    case 'vendor': return { ...draft, vendorId: undefined };
    case 'department': return { ...draft, department: undefined };
    case 'class': return { ...draft, class: undefined };
    case 'location': return { ...draft, location: undefined };
    case 'currency': return { ...draft, currency: undefined };
    case 'createdBy': return { ...draft, submitterId: undefined };
    case 'memo': return { ...draft, memoQuery: undefined };
  }
}

// ─── Display helpers ──────────────────────────────────────────────────────────

function getAnomalyTypeDisplay(draft: InboxFilters): string {
  if (!draft.source || draft.source.length === 0 || draft.source.length === 2) return '';
  return draft.source[0] === 'ai' ? 'AI only' : 'Rule only';
}

function getAssigneeDisplay(draft: InboxFilters): string {
  if (!draft.assigneeId || draft.assigneeId.length === 0) return '';
  if (draft.assigneeId.length === 1) {
    return team.find((m) => m.id === draft.assigneeId![0])?.name ?? draft.assigneeId[0];
  }
  return `${draft.assigneeId.length} selected`;
}

function getAccountDisplay(draft: InboxFilters): string {
  if (!draft.accountCode || draft.accountCode.length === 0) return '';
  if (draft.accountCode.length === 1) {
    const code = draft.accountCode[0];
    const tx = transactions.find((t) => t.glAccountCode === code);
    return tx ? `${code} ${tx.glAccountName}` : code;
  }
  return `${draft.accountCode.length} selected`;
}

function getStatusDisplay(draft: InboxFilters): string {
  if (!draft.view || draft.view === 'all' || draft.view === 'ignored') return '';
  return draft.view === 'open' ? 'Open' : 'Resolved';
}

function getTxTypeDisplay(draft: InboxFilters): string {
  if (!draft.txType || draft.txType.length === 0) return '';
  const fmt = (s: string) =>
    s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  if (draft.txType.length === 1) return fmt(draft.txType[0]);
  return `${draft.txType.length} selected`;
}

function formatDisplayDate(iso: string): string {
  // ISO `yyyy-MM-dd` → `MM/dd/yyyy`
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${m}/${d}/${y}` : iso;
}

function getTxDateDisplay(draft: InboxFilters): string {
  if (!draft.dateFrom && !draft.dateTo) return '';
  if (draft.dateFrom && draft.dateTo) {
    return `${formatDisplayDate(draft.dateFrom)} – ${formatDisplayDate(draft.dateTo)}`;
  }
  if (draft.dateFrom) return `From ${formatDisplayDate(draft.dateFrom)}`;
  return `To ${formatDisplayDate(draft.dateTo!)}`;
}

function getSubsidiaryDisplay(draft: InboxFilters): string {
  if (!draft.entityId || draft.entityId.length === 0) return '';
  if (draft.entityId.length === 1) {
    return entities.find((e) => e.id === draft.entityId![0])?.shortName ?? draft.entityId[0];
  }
  return `${draft.entityId.length} selected`;
}

function getPostingPeriodDisplay(draft: InboxFilters): string {
  if (!draft.periodId || draft.periodId.length === 0) return '';
  if (draft.periodId.length === 1) {
    return periods.find((p) => p.id === draft.periodId![0])?.label ?? draft.periodId[0];
  }
  return `${draft.periodId.length} selected`;
}

function getVendorDisplay(draft: InboxFilters): string {
  if (!draft.vendorId || draft.vendorId.length === 0) return '';
  if (draft.vendorId.length === 1) {
    return getVendor(draft.vendorId[0])?.name ?? draft.vendorId[0];
  }
  return `${draft.vendorId.length} selected`;
}

function getCountDisplay(values: string[] | undefined): string {
  if (!values || values.length === 0) return '';
  if (values.length === 1) return values[0];
  return `${values.length} selected`;
}

function getCreatedByDisplay(draft: InboxFilters): string {
  if (!draft.submitterId || draft.submitterId.length === 0) return '';
  if (draft.submitterId.length === 1) {
    return getTeamMember(draft.submitterId[0])?.name ?? draft.submitterId[0];
  }
  return `${draft.submitterId.length} selected`;
}

// ─── Dropdown wrapper ─────────────────────────────────────────────────────────

interface FilterDropdownProps {
  label: string;
  displayValue: string;
  placeholder: string;
  prefixIcon?: React.ReactNode;
  /** Render-prop receives a `close` callback so single-select panels can
   *  dismiss the popover after a selection. Multi-select panels ignore it. */
  children: (close: () => void) => React.ReactNode;
  className?: string;
  /** When provided, renders an X next to the label that removes this filter
   *  from the visible row and clears its state. */
  onRemove?: () => void;
}

function FilterDropdown({ label, displayValue, placeholder, prefixIcon, children, className, onRemove }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  const close = () => setIsOpen(false);

  const openPanel = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPanelStyle({
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: rect.width,
      });
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const text = displayValue || placeholder;
  const isEmpty = !displayValue;

  return (
    <div className={className ?? 'flex w-[312px] shrink-0 flex-col gap-1'}>
      {label && (
        <div className="flex items-center justify-between gap-2">
          <p className="font-['Inter'] text-[11px] font-medium leading-4 text-[#424867]">{label}</p>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${label} filter`}
              className="flex h-4 w-4 items-center justify-center rounded text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : openPanel())}
        className={`flex h-10 w-full items-center gap-2 overflow-hidden rounded-md border bg-white px-2 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1FAC76]/20 ${
          isOpen
            ? 'border-[#3d7bf7]'
            : 'border-[#cbd2e1] hover:border-[#9aa3b5]'
        }`}
      >
        {prefixIcon}
        <span
          className={`min-w-0 flex-1 truncate font-['Inter'] text-xs font-normal leading-4 ${
            isEmpty ? 'text-[#adb2bb]' : 'text-[#1d2433]'
          }`}
        >
          {text}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#3d7bf7]' : 'text-[#6b7280]'}`} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={panelRef}
            // Stop click propagation so the popover (rendered into document.body
            // via a portal) doesn't bubble through React's synthetic event tree
            // to the parent modal's backdrop onClick={onClose}.
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[200] overflow-hidden rounded-md border border-[#e1e6ef] bg-white font-['Inter'] shadow-[0px_4px_12px_rgba(0,0,0,0.15)]"
            style={panelStyle}
          >
            {children(close)}
          </div>,
          document.body,
        )}
    </div>
  );
}

// ─── Panel contents ───────────────────────────────────────────────────────────

/** Shared className for a single-select option row. Selection is shown via
 *  the row's background fill — no checkmark, matching FlowUI's DropdownButton. */
const optionRowClass = (active: boolean) =>
  `flex h-9 w-full items-center gap-2 px-3 text-left font-['Inter'] text-xs font-normal ${
    active ? 'bg-[#f0f5ff] text-[#1d2433]' : 'text-[#1d2433] hover:bg-[#f1f3f9]'
  }`;

/** Clear link — FlowUI-style text-link action that resets the panel's
 *  filter state. Just the link itself; callers wrap it in a row + divider. */
function ClearLink({ onClear, disabled }: { onClear: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClear}
      disabled={disabled}
      className="font-['Inter'] text-xs font-semibold leading-4 text-[#3d7bf7] transition-colors hover:text-[#1e4eae] disabled:cursor-not-allowed disabled:text-[#adb2bb]"
    >
      Clear
    </button>
  );
}

/** Bottom-aligned Clear row — used by panels that contain inputs rather than
 *  option lists (e.g. Date range, Memo search). */
function ClearFooter({ onClear, disabled }: { onClear: () => void; disabled?: boolean }) {
  return (
    <div className="flex items-center border-t border-[#e1e6ef] px-3 py-2">
      <ClearLink onClear={onClear} disabled={disabled} />
    </div>
  );
}

/** Top-aligned Clear row — used by single-select option panels. The Clear
 *  link sits above the options with no divider between them. */
function ClearHeader({ onClear, disabled }: { onClear: () => void; disabled?: boolean }) {
  return (
    <div className="flex items-center px-3 py-2">
      <ClearLink onClear={onClear} disabled={disabled} />
    </div>
  );
}

function SortPanel({
  draft,
  setDraft,
  close,
  options,
}: {
  draft: InboxFilters;
  setDraft: (v: InboxFilters) => void;
  close: () => void;
  /** Sort options the parent variant supports. The first entry is
   *  treated as the implicit default — it renders as active when
   *  `draft.sortBy` is unset so the user always sees a selection. */
  options: { value: SortKey; label: string }[];
}) {
  const defaultValue = options[0]?.value;
  return (
    <div className="py-1">
      {options.map((o) => {
        const active =
          draft.sortBy === o.value || (o.value === defaultValue && !draft.sortBy);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => {
              setDraft({ ...draft, sortBy: o.value });
              close();
            }}
            className={optionRowClass(active)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** FlowUI-style segmented button group for the sort direction. Two
 *  equal-width buttons joined by a shared inner border; active option uses
 *  a light blue fill with bold text, inactive stays white with normal text. */
function DirButtonGroup({
  draft,
  setDraft,
}: {
  draft: InboxFilters;
  setDraft: (v: InboxFilters) => void;
}) {
  const current = draft.sortDir ?? 'desc';
  const baseBtn =
    'flex h-full w-10 items-center justify-center text-[#1d2433] transition-colors';
  const active = 'bg-[#e8edf5]';
  const inactive = 'bg-white hover:bg-[#f8fafc]';
  return (
    <div className="inline-flex h-10 items-stretch overflow-hidden rounded-md border border-[#d4d8e0] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setDraft({ ...draft, sortDir: 'asc' })}
            className={`${baseBtn} ${current === 'asc' ? active : inactive}`}
            aria-pressed={current === 'asc'}
            aria-label="Ascending"
          >
            <ArrowUp className="h-4 w-4 shrink-0" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="z-[70]">Ascending</TooltipContent>
      </Tooltip>
      <div className="w-px shrink-0 self-stretch bg-[#d4d8e0]" />
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setDraft({ ...draft, sortDir: 'desc' })}
            className={`${baseBtn} ${current === 'desc' ? active : inactive}`}
            aria-pressed={current === 'desc'}
            aria-label="Descending"
          >
            <ArrowDown className="h-4 w-4 shrink-0" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="z-[70]">Descending</TooltipContent>
      </Tooltip>
    </div>
  );
}

function AnomalyTypePanel({ draft, setDraft, close }: ListPanelProps) {
  const options = [
    { id: 'ai', label: 'AI only' },
    { id: 'rule', label: 'Rule only' },
  ];
  return (
    <SmartListPanel
      options={options}
      selected={draft.source ?? []}
      onChange={(ids) =>
        setDraft({
          ...draft,
          source: ids.length === 0 ? undefined : (ids as ('rule' | 'ai')[]),
        })
      }
      close={close}
    />
  );
}

function StatusPanel({ draft, setDraft, close }: ListPanelProps) {
  const options = [
    { id: 'open', label: 'Open' },
    { id: 'resolved', label: 'Resolved' },
  ];
  // The store's `view` is a single value, so we project Open/Resolved
  // multi-select selections back: both or none → 'all', single → that value.
  const selected =
    draft.view === 'open' ? ['open'] : draft.view === 'resolved' ? ['resolved'] : [];

  return (
    <SmartListPanel
      options={options}
      selected={selected}
      onChange={(ids) => {
        let view: InboxFilters['view'] = 'all';
        if (ids.length === 1) view = ids[0] as InboxFilters['view'];
        setDraft({ ...draft, view });
      }}
      close={close}
    />
  );
}

// ─── Transaction Date — range calendar ───────────────────────────────────────

function parseDate(s: string | undefined): Date | undefined {
  if (!s) return undefined;
  return new Date(s + 'T00:00:00');
}

function formatDateISO(d: Date | undefined): string | undefined {
  return d ? format(d, 'yyyy-MM-dd') : undefined;
}

function TxDatePanel({
  draft,
  setDraft,
  close,
}: {
  draft: InboxFilters;
  setDraft: (v: InboxFilters) => void;
  close: () => void;
}) {
  // Internal temp range — committed to draft only on Apply, so Cancel can
  // discard. Initialised from current draft on each mount.
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = parseDate(draft.dateFrom);
    const to = parseDate(draft.dateTo);
    return from || to ? { from, to } : undefined;
  });

  const apply = () => {
    setDraft({
      ...draft,
      dateFrom: formatDateISO(range?.from),
      dateTo: formatDateISO(range?.to ?? range?.from),
    });
    close();
  };

  return (
    <div className="flex flex-col font-['Inter']">
      <div className="flex">
        {/* Two-month calendar */}
        <div className="p-3">
          <DayPicker
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={setRange}
            defaultMonth={range?.from ?? new Date()}
            showOutsideDays={false}
            classNames={{
              months: 'flex gap-6',
              month: 'flex flex-col gap-2',
              caption: 'flex items-center justify-center px-2 py-1 relative',
              caption_label: 'text-xs font-semibold text-[#1d2433]',
              nav: 'flex items-center gap-1',
              nav_button:
                'inline-flex h-6 w-6 items-center justify-center rounded text-[#6b7280] hover:bg-[#f1f3f9] hover:text-[#1d2433]',
              nav_button_previous: 'absolute left-0',
              nav_button_next: 'absolute right-0',
              table: 'w-full border-collapse',
              head_row: 'flex',
              head_cell:
                'w-8 text-center text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]',
              row: 'flex w-full',
              cell: 'relative h-8 w-8 p-0 text-center text-xs',
              day: 'inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-normal text-[#1d2433] hover:bg-[#f1f3f9] aria-selected:opacity-100',
              // Range middle dates keep dark text on a light blue band so
              // they stay readable; declared after day_selected so its
              // colours win when both classes are applied.
              day_range_middle:
                '!bg-[#f0f5ff] !text-[#1d2433] !rounded-none hover:!bg-[#eaf0fe]',
              // Endpoints stay solid brand-green with white text.
              day_selected:
                'bg-[#1FAC76] text-white hover:bg-[#1C895F] hover:text-white focus:bg-[#1FAC76] focus:text-white',
              day_today: 'font-semibold',
              day_outside: 'text-[#adb2bb]',
              day_disabled: 'text-[#adb2bb] cursor-not-allowed',
              day_range_start: 'rounded-r-none',
              day_range_end: 'rounded-l-none',
              day_hidden: 'invisible',
            }}
            components={{
              IconLeft: () => <ChevronLeft className="h-4 w-4" />,
              IconRight: () => <ChevronRight className="h-4 w-4" />,
            }}
          />
        </div>
      </div>

      {/* Footer — Cancel + Apply */}
      <div className="flex items-center justify-end gap-2 border-t border-[#e1e6ef] px-3 py-2">
        <button
          type="button"
          onClick={close}
          className="inline-flex h-8 items-center justify-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#6b7280] transition-colors hover:bg-[#f3f4f6]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={apply}
          disabled={!range?.from}
          className="inline-flex h-8 items-center justify-center rounded-md bg-[#1FAC76] px-3 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#1C895F] disabled:cursor-not-allowed disabled:bg-[#1FAC76]/40"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── List panels ──────────────────────────────────────────────────────────────

/** Single-select list panel — used when the option count is ≤ 5. Click an
 *  option to select; the panel closes on click. Has a Clear link at the top. */
function SingleSelectListPanel({
  options,
  selected,
  onChange,
  close,
}: {
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
  close: () => void;
}) {
  const current = selected[0];
  return (
    <div>
      <ClearHeader
        disabled={!current}
        onClear={() => {
          onChange([]);
          close();
        }}
      />
      <div className="py-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              onChange([o.id]);
              close();
            }}
            className={optionRowClass(current === o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Picks single- vs multi-select based on the option count: > 1 options →
 *  multi-select checkboxes. Select all is only added once the list exceeds
 *  5 options. Exactly 1 option → single-select. */
function SmartListPanel({
  options,
  selected,
  onChange,
  close,
}: {
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
  close: () => void;
}) {
  if (options.length > 1) {
    return (
      <MultiSelectPanel
        options={options}
        selected={selected}
        onChange={onChange}
        showSelectAll={options.length > 5}
      />
    );
  }
  return (
    <SingleSelectListPanel
      options={options}
      selected={selected}
      onChange={onChange}
      close={close}
    />
  );
}

function MultiSelectPanel({
  options,
  selected,
  onChange,
  showSelectAll,
}: {
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
  /** When true, renders a "Select all" checkbox above the search input that
   *  toggles every option on/off at once. */
  showSelectAll?: boolean;
}) {
  const [search, setSearch] = useState('');
  // Snapshot of what was selected when this panel mounted. Items in this
  // set stay pinned to the top (with a Clear/divider below them); newly
  // checked items during this session remain in their original position
  // below the divider. This prevents items from "jumping" around as the
  // user multi-selects. The snapshot resets on each open because the
  // parent FilterDropdown unmounts the panel when closed.
  const initialSelectedSet = useMemo(() => new Set(selected), []);
  const hadInitialSelection = initialSelectedSet.size > 0;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, search]);

  const topOptions = filtered.filter((o) => initialSelectedSet.has(o.id));
  const bottomOptions = filtered.filter((o) => !initialSelectedSet.has(o.id));

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const toggle = (id: string) => {
    if (selectedSet.has(id)) onChange(selected.filter((s) => s !== id));
    else onChange([...selected, id]);
  };

  // "Select all" considers the currently-filtered list — when a search is
  // active this toggles only the matching options, leaving others alone.
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((o) => selectedSet.has(o.id));
  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      onChange(selected.filter((id) => !filtered.some((o) => o.id === id)));
    } else {
      const next = new Set(selected);
      filtered.forEach((o) => next.add(o.id));
      onChange(Array.from(next));
    }
  };

  return (
    <div className="w-full">
      <div className="relative border-b border-[#e1e6ef] px-2 py-2">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#adb2bb]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="h-7 w-full rounded-md bg-transparent pl-6 pr-2 font-['Inter'] text-xs font-normal text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none"
          autoFocus
        />
      </div>
      <div className="max-h-56 overflow-y-auto">
        {hadInitialSelection && (
          <>
            <div className="p-1">
              {topOptions.map((o) => (
                <CheckboxRow
                  key={o.id}
                  label={o.label}
                  checked={selectedSet.has(o.id)}
                  onClick={() => toggle(o.id)}
                />
              ))}
            </div>
            <div className="flex items-center border-b border-[#e1e6ef] px-3 py-2">
              <ClearLink onClear={() => onChange([])} disabled={selected.length === 0} />
            </div>
          </>
        )}
        <div className="p-1">
          {showSelectAll && filtered.length > 0 && (
            <CheckboxRow
              label="Select all"
              checked={allFilteredSelected}
              onClick={toggleSelectAll}
            />
          )}
          {filtered.length === 0 && (
            <p className="px-2 py-2 font-['Inter'] text-[11px] text-[#adb2bb]">No matches</p>
          )}
          {bottomOptions.map((o) => (
            <CheckboxRow
              key={o.id}
              label={o.label}
              checked={selectedSet.has(o.id)}
              onClick={() => toggle(o.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type ListPanelProps = {
  draft: InboxFilters;
  setDraft: (v: InboxFilters) => void;
  close: () => void;
};

function AssigneePanel({ draft, setDraft, close }: ListPanelProps) {
  const options = useMemo(
    () => team.map((m) => ({ id: m.id, label: m.name })).sort((a, b) => a.label.localeCompare(b.label)),
    [],
  );
  return (
    <SmartListPanel
      options={options}
      selected={draft.assigneeId ?? []}
      onChange={(ids) => setDraft({ ...draft, assigneeId: ids.length ? ids : undefined })}
      close={close}
    />
  );
}

function AccountPanel({ draft, setDraft, close }: ListPanelProps) {
  const options = useMemo(() => {
    const seen = new Map<string, string>();
    for (const tx of transactions) {
      if (!seen.has(tx.glAccountCode)) seen.set(tx.glAccountCode, tx.glAccountName);
    }
    return Array.from(seen.entries())
      .map(([code, name]) => ({ id: code, label: `${code} ${name}` }))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, []);
  return (
    <SmartListPanel
      options={options}
      selected={draft.accountCode ?? []}
      onChange={(ids) => setDraft({ ...draft, accountCode: ids.length ? ids : undefined })}
      close={close}
    />
  );
}

function TxTypePanel({ draft, setDraft, close }: ListPanelProps) {
  const options: { id: TransactionType; label: string }[] = [
    { id: 'vendor-bill', label: 'Vendor bill' },
    { id: 'purchase-order', label: 'Purchase order' },
    { id: 'expense-report', label: 'Expense report' },
    { id: 'journal-entry', label: 'Journal entry' },
    { id: 'payment', label: 'Payment' },
  ];
  return (
    <SmartListPanel
      options={options}
      selected={draft.txType ?? []}
      onChange={(ids) => setDraft({ ...draft, txType: ids.length ? (ids as TransactionType[]) : undefined })}
      close={close}
    />
  );
}

function SubsidiaryPanel({ draft, setDraft, close }: ListPanelProps) {
  const options = useMemo(
    () => entities.map((e) => ({ id: e.id, label: e.shortName })),
    [],
  );
  return (
    <SmartListPanel
      options={options}
      selected={draft.entityId ?? []}
      onChange={(ids) => setDraft({ ...draft, entityId: ids.length ? ids : undefined })}
      close={close}
    />
  );
}

function PostingPeriodPanel({ draft, setDraft, close }: ListPanelProps) {
  const options = useMemo(
    () => periods.map((p) => ({ id: p.id, label: p.label })),
    [],
  );
  return (
    <SmartListPanel
      options={options}
      selected={draft.periodId ?? []}
      onChange={(ids) => setDraft({ ...draft, periodId: ids.length ? ids : undefined })}
      close={close}
    />
  );
}

function VendorPanel({ draft, setDraft, close }: ListPanelProps) {
  // Only show vendors that actually appear on a transaction in the inbox.
  const options = useMemo(() => {
    const used = new Set<string>();
    for (const tx of transactions) if (tx.vendorId) used.add(tx.vendorId);
    return vendors
      .filter((v) => used.has(v.id))
      .map((v) => ({ id: v.id, label: v.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);
  return (
    <SmartListPanel
      options={options}
      selected={draft.vendorId ?? []}
      onChange={(ids) => setDraft({ ...draft, vendorId: ids.length ? ids : undefined })}
      close={close}
    />
  );
}

/** Build a sorted, de-duplicated option list from a transaction field. */
function useTxStringFieldOptions(pick: (tx: typeof transactions[number]) => string | undefined) {
  return useMemo(() => {
    const set = new Set<string>();
    for (const tx of transactions) {
      const v = pick(tx);
      if (v) set.add(v);
    }
    return Array.from(set).sort().map((v) => ({ id: v, label: v }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function DepartmentPanel({ draft, setDraft, close }: ListPanelProps) {
  const options = useTxStringFieldOptions((tx) => tx.department);
  return (
    <SmartListPanel
      options={options}
      selected={draft.department ?? []}
      onChange={(ids) => setDraft({ ...draft, department: ids.length ? ids : undefined })}
      close={close}
    />
  );
}

function ClassPanel({ draft, setDraft, close }: ListPanelProps) {
  const options = useTxStringFieldOptions((tx) => tx.class);
  return (
    <SmartListPanel
      options={options}
      selected={draft.class ?? []}
      onChange={(ids) => setDraft({ ...draft, class: ids.length ? ids : undefined })}
      close={close}
    />
  );
}

function LocationPanel({ draft, setDraft, close }: ListPanelProps) {
  const options = useTxStringFieldOptions((tx) => tx.location);
  return (
    <SmartListPanel
      options={options}
      selected={draft.location ?? []}
      onChange={(ids) => setDraft({ ...draft, location: ids.length ? ids : undefined })}
      close={close}
    />
  );
}

function CurrencyPanel({ draft, setDraft, close }: ListPanelProps) {
  const options = useTxStringFieldOptions((tx) => tx.currency);
  return (
    <SmartListPanel
      options={options}
      selected={draft.currency ?? []}
      onChange={(ids) => setDraft({ ...draft, currency: ids.length ? ids : undefined })}
      close={close}
    />
  );
}

function CreatedByPanel({ draft, setDraft, close }: ListPanelProps) {
  // Restrict to team members who actually submitted at least one tx.
  const options = useMemo(() => {
    const used = new Set<string>();
    for (const tx of transactions) used.add(tx.submitterId);
    return team
      .filter((m) => used.has(m.id))
      .map((m) => ({ id: m.id, label: m.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);
  return (
    <SmartListPanel
      options={options}
      selected={draft.submitterId ?? []}
      onChange={(ids) => setDraft({ ...draft, submitterId: ids.length ? ids : undefined })}
      close={close}
    />
  );
}

/** Memo is a free-text substring filter — rendered as an inline search
 *  text box (not a dropdown) since it doesn't have a discrete option list. */
function MemoSearchField({
  value,
  onChange,
  onRemove,
}: {
  value: string;
  onChange: (v: string) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="flex w-[312px] shrink-0 flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <p className="font-['Inter'] text-[11px] font-medium leading-4 text-[#424867]">Memo</p>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove Memo filter"
            className="flex h-4 w-4 items-center justify-center rounded text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#adb2bb]" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search memo text…"
          className="h-10 w-full rounded-md border border-[#cbd2e1] bg-white pl-8 pr-2 font-['Inter'] text-xs font-normal leading-4 text-[#1d2433] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] placeholder:text-[#adb2bb] focus:border-[#3d7bf7] focus:outline-none"
        />
      </div>
    </div>
  );
}

// ─── Checkbox row ─────────────────────────────────────────────────────────────

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
      className="flex h-9 w-full items-center gap-2 px-2 text-left transition-colors hover:bg-[#f1f3f9]"
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

// ─── Main modal ───────────────────────────────────────────────────────────────

export function FilterSortModal({ open, onClose, variant = 'transactions' }: Props) {
  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);

  // Variant-scoped option sets. Computed via useMemo so identity is
  // stable across renders — referenced by effects + downstream
  // filtering logic below.
  const sortOptions = useMemo(
    () => SORT_OPTIONS_BY_VARIANT[variant],
    [variant],
  );
  const defaultVisible = useMemo(
    () => DEFAULT_VISIBLE_BY_VARIANT[variant],
    [variant],
  );
  const allowedFilters = useMemo(
    () =>
      variant === 'insights'
        ? ALL_FILTERS.filter((f) => !INSIGHTS_HIDDEN_FILTERS.includes(f.key))
        : ALL_FILTERS.filter((f) => !TRANSACTIONS_HIDDEN_FILTERS.includes(f.key)),
    [variant],
  );

  const [draft, setDraft] = useState<InboxFilters>(filters);
  const [visibleFilters, setVisibleFilters] = useState<FilterKey[]>(defaultVisible);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addMenuSearch, setAddMenuSearch] = useState('');
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  useMemo(() => {
    if (open) {
      setDraft(filters);
      setVisibleFilters(defaultVisible);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!showAddMenu) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!addBtnRef.current?.contains(target) && !addMenuRef.current?.contains(target)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showAddMenu]);

  if (!open) return null;

  const apply = () => {
    setFilters(draft);
    onClose();
  };

  const openAddMenu = () => {
    const rect = addBtnRef.current?.getBoundingClientRect();
    if (rect) setMenuPos({ top: rect.bottom + 4, left: rect.left });
    setAddMenuSearch('');
    setShowAddMenu(true);
  };

  const availableToAdd = allowedFilters.filter(
    (f) =>
      !visibleFilters.includes(f.key) &&
      f.label.toLowerCase().includes(addMenuSearch.toLowerCase()),
  );

  const removeFilter = (key: FilterKey) => {
    setVisibleFilters(visibleFilters.filter((k) => k !== key));
    setDraft(clearFilterState(draft, key));
  };

  // Default filters are persistent — only filters added via "Add Filter"
  // can be removed. This helper returns undefined for default keys so the
  // FilterDropdown omits the X.
  const getRemoveHandler = (key: FilterKey): (() => void) | undefined =>
    defaultVisible.includes(key) ? undefined : () => removeFilter(key);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[800px] flex-col rounded-[8px] bg-white shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.05),0px_10px_25px_-3px_rgba(0,0,0,0.1),0px_0px_0px_1px_rgba(0,0,0,0.05)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start gap-6 border-b border-[#e1e6ef] px-6 pb-4 pt-6">
          <h2 className="flex-1 font-header text-[18px] font-bold leading-6 text-[#1d2433]">
            Sort and Filter
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-[#1d2433]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-6">
          {/* Sort By */}
          <div className="flex items-end gap-2">
            <FilterDropdown
              label="Sort By"
              displayValue={
                sortOptions.find(
                  (o) =>
                    o.value ===
                    (draft.sortBy ?? 'amount'),
                )?.label ?? ''
              }
              placeholder=""
              className="flex w-[220px] shrink-0 flex-col gap-1"
            >
              {(close) => (
                <SortPanel
                  draft={draft}
                  setDraft={setDraft}
                  close={close}
                  options={sortOptions}
                />
              )}
            </FilterDropdown>
            <div className="flex shrink-0 flex-col gap-1">
              <DirButtonGroup draft={draft} setDraft={setDraft} />
            </div>
          </div>

          {/* Filter Options */}
          <div className="flex flex-col gap-4">
            <p className="font-header text-xs font-bold leading-[18px] text-[#1d2433]">
              Filter Options
            </p>

            <div className="flex flex-wrap gap-4">
              {visibleFilters.map((key) => {
                switch (key) {
                  case 'anomalyType':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Anomaly Type"
                        displayValue={getAnomalyTypeDisplay(draft)}
                        placeholder="Select Anomaly Type(s)"
                        onRemove={getRemoveHandler('anomalyType')}
                      >
                        {(close) => <AnomalyTypePanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'assignee':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Assignee"
                        displayValue={getAssigneeDisplay(draft)}
                        placeholder="Select Assignee(s)"
                        onRemove={getRemoveHandler('assignee')}
                      >
                        {(close) => <AssigneePanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'account':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Account"
                        displayValue={getAccountDisplay(draft)}
                        placeholder="Select Account(s)"
                        onRemove={getRemoveHandler('account')}
                      >
                        {(close) => <AccountPanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'status':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Status"
                        displayValue={getStatusDisplay(draft)}
                        placeholder="Select Status(s)"
                        onRemove={getRemoveHandler('status')}
                      >
                        {(close) => <StatusPanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'txType':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Transaction Type"
                        displayValue={getTxTypeDisplay(draft)}
                        placeholder="Select Transaction Type(s)"
                        onRemove={getRemoveHandler('txType')}
                      >
                        {(close) => <TxTypePanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'txDate':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Transaction Date"
                        displayValue={getTxDateDisplay(draft)}
                        placeholder="Select date range"
                        prefixIcon={<CalendarDays className="h-5 w-5 shrink-0 text-[#6b7280]" />}
                        onRemove={getRemoveHandler('txDate')}
                      >
                        {(close) => <TxDatePanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'subsidiary':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Entity"
                        displayValue={getSubsidiaryDisplay(draft)}
                        placeholder="Select entities"
                        onRemove={getRemoveHandler('subsidiary')}
                      >
                        {(close) => <SubsidiaryPanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'postingPeriod':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Posting Period"
                        displayValue={getPostingPeriodDisplay(draft)}
                        placeholder="Select Posting Period(s)"
                        onRemove={getRemoveHandler('postingPeriod')}
                      >
                        {(close) => <PostingPeriodPanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'vendor':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Vendor"
                        displayValue={getVendorDisplay(draft)}
                        placeholder="Select Vendor(s)"
                        onRemove={getRemoveHandler('vendor')}
                      >
                        {(close) => <VendorPanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'department':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Department"
                        displayValue={getCountDisplay(draft.department)}
                        placeholder="Select Department(s)"
                        onRemove={getRemoveHandler('department')}
                      >
                        {(close) => <DepartmentPanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'class':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Class"
                        displayValue={getCountDisplay(draft.class)}
                        placeholder="Select Class(es)"
                        onRemove={getRemoveHandler('class')}
                      >
                        {(close) => <ClassPanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'location':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Location"
                        displayValue={getCountDisplay(draft.location)}
                        placeholder="Select Location(s)"
                        onRemove={getRemoveHandler('location')}
                      >
                        {(close) => <LocationPanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'currency':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Currency"
                        displayValue={getCountDisplay(draft.currency)}
                        placeholder="Select Currency(s)"
                        onRemove={getRemoveHandler('currency')}
                      >
                        {(close) => <CurrencyPanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'createdBy':
                    return (
                      <FilterDropdown
                        key={key}
                        label="Created By"
                        displayValue={getCreatedByDisplay(draft)}
                        placeholder="Select Created By"
                        onRemove={getRemoveHandler('createdBy')}
                      >
                        {(close) => <CreatedByPanel draft={draft} setDraft={setDraft} close={close} />}
                      </FilterDropdown>
                    );
                  case 'memo':
                    return (
                      <MemoSearchField
                        key={key}
                        value={draft.memoQuery ?? ''}
                        onChange={(v) => setDraft({ ...draft, memoQuery: v || undefined })}
                        onRemove={getRemoveHandler('memo')}
                      />
                    );
                }
              })}
            </div>

            {/* Add Filter — pinned bottom-left, separate row from the filter grid */}
            <div className="flex">
              <button
                ref={addBtnRef}
                type="button"
                onClick={openAddMenu}
                className="flex h-10 items-center justify-center gap-2 rounded-[6px] border border-[#cbd2e1] bg-white px-3 font-header text-[13px] font-bold leading-[18px] tracking-[-0.13px] text-[#6b7280] transition-colors hover:border-[#b0bac8] hover:bg-[#f3f4f6]"
              >
                <Plus className="h-[18px] w-[18px]" />
                Add Filter
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-4 border-t border-[#e1e6ef] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-[6px] px-4 font-header text-xs font-bold leading-[18px] tracking-[-0.12px] text-[#6b7280] transition-colors hover:bg-[#f3f4f6]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={apply}
            className="inline-flex h-10 items-center justify-center rounded-[6px] bg-[#1FAC76] px-4 font-header text-xs font-bold leading-[18px] tracking-[-0.12px] text-white transition-colors hover:bg-[#1C895F] active:bg-[#186749]"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Add Filter popover */}
      {showAddMenu &&
        createPortal(
          <div
            ref={addMenuRef}
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[200] min-w-[220px] overflow-hidden rounded-md border border-[#e1e6ef] bg-white font-['Inter'] shadow-[0px_4px_12px_rgba(0,0,0,0.15)]"
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            {/* Search */}
            <div className="relative border-b border-[#e1e6ef] px-2 py-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#adb2bb]" />
              <input
                type="text"
                value={addMenuSearch}
                onChange={(e) => setAddMenuSearch(e.target.value)}
                placeholder="Search field"
                autoFocus
                className="h-7 w-full rounded-md bg-transparent pl-6 pr-2 font-['Inter'] text-xs font-normal text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none"
              />
            </div>
            {/* Options */}
            <div className="max-h-48 overflow-y-auto py-1">
              {availableToAdd.length === 0 ? (
                <p className="px-3 py-2 font-['Inter'] text-xs font-normal leading-4 text-[#adb2bb]">
                  {addMenuSearch ? 'No matches' : 'All filters added'}
                </p>
              ) : (
                availableToAdd.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => {
                      setVisibleFilters([...visibleFilters, f.key]);
                      setShowAddMenu(false);
                    }}
                    className={optionRowClass(false)}
                  >
                    {f.label}
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
