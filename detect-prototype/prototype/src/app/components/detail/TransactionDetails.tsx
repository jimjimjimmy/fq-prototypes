import { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Check, X, Search, ExternalLink } from 'lucide-react';

/**
 * Material Symbols "table edit" — table grid + pencil overlay.
 * Inlined so we don't pull in a second icon library; path copied from
 * the Figma reference (node 50:9277).
 */
function TableEditIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12.6667 12.6667"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M1.33333 6.66667H5.33333V4H1.33333V6.66667ZM1.33333 2.66667H10.6667V1.33333H1.33333V2.66667ZM1.33333 12C0.966667 12 0.652778 11.8694 0.391667 11.6083C0.130556 11.3472 0 11.0333 0 10.6667V1.33333C0 0.966667 0.130556 0.652778 0.391667 0.391667C0.652778 0.130556 0.966667 0 1.33333 0H10.6667C11.0333 0 11.3472 0.130556 11.6083 0.391667C11.8694 0.652778 12 0.966667 12 1.33333V5.53333C11.7889 5.44444 11.5694 5.38611 11.3417 5.35833C11.1139 5.33056 10.8889 5.33333 10.6667 5.36667C10.4333 5.41111 10.2083 5.48611 9.99167 5.59167C9.775 5.69722 9.57778 5.83889 9.4 6.01667L8.75 6.66667L5.33333 10.0667V12H1.33333ZM1.33333 10.6667H5.33333V8H1.33333V10.6667ZM6.66667 6.66667H8.75L9.4 6.01667C9.57778 5.83889 9.775 5.69722 9.99167 5.59167C10.2083 5.48611 10.4333 5.41111 10.6667 5.36667V4H6.66667V6.66667ZM6.66667 12.6667V10.6167L10.35 6.95C10.45 6.85 10.5611 6.77778 10.6833 6.73333C10.8056 6.68889 10.9278 6.66667 11.05 6.66667C11.1833 6.66667 11.3111 6.69167 11.4333 6.74167C11.5556 6.79167 11.6667 6.86667 11.7667 6.96667L12.3833 7.58333C12.4722 7.68333 12.5417 7.79444 12.5917 7.91667C12.6417 8.03889 12.6667 8.16111 12.6667 8.28333C12.6667 8.40556 12.6444 8.53056 12.6 8.65833C12.5556 8.78611 12.4833 8.9 12.3833 9L8.71667 12.6667H6.66667ZM7.66667 11.6667H8.3L10.3167 9.63333L9.7 9.01667L7.66667 11.0333V11.6667Z" />
    </svg>
  );
}
import type { Transaction } from '../../../data/types';
import { getEntity, getPeriod } from '../../../data/company';
import { getTeamMember } from '../../../data/team';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { TRANSACTION_FIELDS } from '../../../data/transactionFields';

// ─── Field configuration ─────────────────────────────────────────────────────

type TxDetailField = { id: string; label: string; visible: boolean };

// Default visibility + ordering derived from the canonical Transaction
// field catalog. Editing the catalog automatically flows through here
// and into the rule editors. Transaction ID + Line are hidden by
// default since they already appear in the detail header.
const DEFAULT_TX_DETAIL_FIELDS: TxDetailField[] = TRANSACTION_FIELDS.map((f) => ({
  id: f.id,
  label: f.label,
  visible: f.visibleByDefault,
}));

interface Props {
  transaction: Transaction;
  showDivider?: boolean;
}

/**
 * Collapsible transaction metadata section.
 *
 * The cog icon next to the heading opens a modal that lets the reviewer
 * toggle which fields are visible and reorder them via drag-and-drop.
 * Transaction ID and Transaction Line are hidden by default since they
 * already appear in the detail header — toggle them on via the cog if
 * they're useful to surface as fields again.
 */
export function TransactionDetails({ transaction: t, showDivider = true }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [showFieldSettings, setShowFieldSettings] = useState(false);
  const [txDetailFields, setTxDetailFields] = useState<TxDetailField[]>(DEFAULT_TX_DETAIL_FIELDS);
  const [pendingTxFields, setPendingTxFields] = useState<TxDetailField[]>(DEFAULT_TX_DETAIL_FIELDS);
  const [fieldSearch, setFieldSearch] = useState('');
  const [dragFieldIdx, setDragFieldIdx] = useState<number | null>(null);

  const entity = getEntity(t.entityId);
  const period = getPeriod(t.periodId);
  const submitter = getTeamMember(t.submitterId);

  const visibleFields = txDetailFields.filter((f) => f.visible);

  const openSettings = () => {
    setPendingTxFields([...txDetailFields]);
    setFieldSearch('');
    setShowFieldSettings(true);
  };

  return (
    <section>
      {showDivider && <div className="-mx-6 mb-4 border-t border-[#e1e6ef]" />}
      <div className="flex w-full items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="group flex flex-1 items-center justify-between gap-2 text-left"
        >
          <h3 className="font-['Inter'] text-[14px] font-semibold leading-5 text-[#1d2433]">
            Transaction Details
          </h3>
        </button>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={openSettings}
                aria-label="Customize Fields"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <TableEditIcon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Customize Fields
            </TooltipContent>
          </Tooltip>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-neutral-500 hover:text-neutral-900"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <dl
          className="mt-4 grid max-h-[240px] grid-cols-2 gap-x-4 gap-y-4 overflow-y-auto pr-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 [scrollbar-color:#cbd2e1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cbd2e1] [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {/* All fields are configurable now — both Transaction ID and
               Transaction Line live in the detail header and are hidden
               here by default; the cog icon brings them back if a
               reviewer wants them surfaced. */}
          {visibleFields.map((field) => {
            const data = getFieldData(field.id, t, entity, period, submitter);
            if (!data) return null;
            const asLink =
              field.id === 'transactionId' ||
              (field.id === 'reversalId' && data.value !== '—');
            return (
              <Field
                key={field.id}
                label={data.label}
                value={data.value}
                asLink={asLink}
              />
            );
          })}
        </dl>
      )}

      {/* ─── Field settings modal ───────────────────────────────────────── */}
      {showFieldSettings && (
        <FieldSettingsModal
          pending={pendingTxFields}
          search={fieldSearch}
          dragIdx={dragFieldIdx}
          onSearchChange={setFieldSearch}
          onPendingChange={setPendingTxFields}
          onDragIdxChange={setDragFieldIdx}
          onCancel={() => setShowFieldSettings(false)}
          onApply={() => {
            setTxDetailFields(pendingTxFields);
            setShowFieldSettings(false);
          }}
        />
      )}
    </section>
  );
}

// ─── Field value resolver ────────────────────────────────────────────────────

function getFieldData(
  id: string,
  t: Transaction,
  entity: ReturnType<typeof getEntity>,
  period: ReturnType<typeof getPeriod>,
  submitter: ReturnType<typeof getTeamMember>,
): { label: string; value: string } | null {
  switch (id) {
    case 'transactionId':   return { label: 'Transaction ID',   value: t.transactionId };
    case 'transactionLine': return { label: 'Transaction Line', value: t.transactionLine ?? '—' };
    case 'transactionDate': return { label: 'Transaction Date', value: formatDate(t.date) };
    case 'postingPeriod':   return { label: 'Posting Period',   value: period?.label ?? t.periodId };
    case 'amount':          return { label: 'Amount',           value: formatMoney(t.amount) };
    case 'currency':        return { label: 'Currency',         value: t.currency };
    case 'type':            return { label: 'Type',             value: formatType(t.type) };
    case 'subsidiary':      return { label: 'Entity',           value: entity?.shortName ?? t.entityId };
    case 'account':         return { label: 'Account',          value: `${t.glAccountCode} ${t.glAccountName}` };
    case 'vendor':          return { label: 'Vendor',           value: t.vendorName ?? '—' };
    case 'memo':            return { label: 'Memo',             value: t.memo || '—' };
    case 'reversalId':      return { label: 'Reversal #',       value: t.reversalId ?? '—' };
    case 'department':      return { label: 'Department',       value: t.department ?? '—' };
    case 'class':           return { label: 'Class',            value: t.class || '—' };
    case 'location':        return { label: 'Location',         value: t.location || '—' };
    case 'createdDate':     return { label: 'Created Date',     value: formatDate(t.submittedAt) };
    case 'createdBy':       return { label: 'Created By',       value: submitter?.name ?? t.submitterId };
    case 'customField1':    return { label: 'Custom Field 1',   value: '—' };
    case 'customField2':    return { label: 'Custom Field 2',   value: '—' };
    case 'customField3':    return { label: 'Custom Field 3',   value: '—' };
    default: return null;
  }
}

// ─── Field settings modal ────────────────────────────────────────────────────

function FieldSettingsModal({
  pending,
  search,
  dragIdx,
  onSearchChange,
  onPendingChange,
  onDragIdxChange,
  onCancel,
  onApply,
}: {
  pending: TxDetailField[];
  search: string;
  dragIdx: number | null;
  onSearchChange: (v: string) => void;
  onPendingChange: (v: TxDetailField[]) => void;
  onDragIdxChange: (v: number | null) => void;
  onCancel: () => void;
  onApply: () => void;
}) {
  const allVisible = pending.every((f) => f.visible);
  const trimmedSearch = search.trim().toLowerCase();
  const filtered = trimmedSearch
    ? pending.filter((f) => f.label.toLowerCase().includes(trimmedSearch))
    : pending;

  const toggleField = (id: string) => {
    onPendingChange(pending.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)));
  };

  const toggleAll = () => {
    const next = allVisible ? false : true;
    onPendingChange(pending.map((f) => ({ ...f, visible: next })));
  };

  // Drag handlers — work on the unfiltered list since reordering during a search is disabled.
  const handleDragStart = (idx: number) => onDragIdxChange(idx);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const next = [...pending];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    onPendingChange(next);
    onDragIdxChange(null);
  };
  const handleDragEnd = () => onDragIdxChange(null);

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[600px] w-full max-w-sm flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e1e6ef] px-6 py-4">
          <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
            Customize Fields
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#6b7280] hover:bg-neutral-100 hover:text-[#1d2433]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Subtitle */}
        <p className="px-6 pb-4 pt-3 font-['Inter'] text-xs font-normal leading-[18px] text-[#424867]">
          Select the fields you want visible on the transaction details page
        </p>

        {/* Search — matches the inbox transactions search bar styling */}
        <div className="px-6 pb-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#adb2bb]" />
            <input
              type="text"
              placeholder="Search for..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 w-full rounded-md border border-[#e1e6ef] bg-white pl-9 pr-2 font-['Inter'] text-xs font-normal leading-4 text-[#1d2433] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] placeholder:text-[#adb2bb] focus:border-[#3d7bf7] focus:outline-none"
            />
          </div>
        </div>

        {/* Field list — scrollable with always-visible scrollbar */}
        <div className="flex-1 min-h-0 overflow-y-scroll px-3 pb-3 pt-2 [scrollbar-color:#cbd2e1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cbd2e1] [&::-webkit-scrollbar-track]:bg-transparent">
          {!trimmedSearch && (
            <div className="flex items-center gap-2 rounded-md px-3 py-2">
              <span className="w-4" />
              <CheckBox checked={allVisible} onClick={toggleAll} />
              <span className="font-['Inter'] text-xs font-normal leading-[18px] text-[#1d2433]">
                Select all
              </span>
            </div>
          )}

          {filtered.map((field) => {
            const realIdx = pending.findIndex((f) => f.id === field.id);
            const isDragging = dragIdx === realIdx;
            return (
              <div
                key={field.id}
                draggable={!trimmedSearch}
                onDragStart={() => handleDragStart(realIdx)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(realIdx)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                  isDragging ? 'bg-neutral-100 opacity-50' : 'hover:bg-[#f8fafc]'
                } ${!trimmedSearch ? 'cursor-grab' : 'cursor-default'}`}
              >
                <span className="flex w-4 items-center justify-center text-[#cbd2e1]">
                  <GripVertical className="h-4 w-4" />
                </span>
                <CheckBox checked={field.visible} onClick={() => toggleField(field.id)} />
                <span
                  className={`font-['Inter'] text-xs leading-[18px] text-[#1d2433] ${
                    field.visible ? 'font-semibold' : 'font-normal'
                  }`}
                >
                  {field.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#e1e6ef] bg-[#f8fafc] px-6 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-8 items-center justify-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#6b7280] hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onApply}
            className="inline-flex h-8 items-center justify-center rounded-md bg-[#1FAC76] px-3 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable checkbox ───────────────────────────────────────────────────────

function CheckBox({ checked, onClick, locked }: { checked: boolean; onClick?: () => void; locked?: boolean }) {
  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
        checked
          ? locked
            ? 'border-[#cbd2e1] bg-[#cbd2e1] cursor-default'
            : 'border-[#1FAC76] bg-[#1FAC76] cursor-pointer'
          : 'border-[#cbd2e1] bg-white cursor-pointer'
      }`}
    >
      {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
    </button>
  );
}

// ─── Field row (re-used from before) ─────────────────────────────────────────

function Field({
  label,
  value,
  mono,
  className,
  emphasize,
  asLink,
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
  emphasize?: 'warn';
  asLink?: boolean;
}) {
  return (
    <div className={className ?? ''}>
      <dt className="font-['Inter'] text-xs font-medium leading-4 text-[#424867]">
        {label}
      </dt>
      <dd
        className={[
          "mt-0.5 font-['Inter'] text-xs font-semibold leading-[18px] text-[#1d2433]",
          mono ? 'font-mono' : '',
          emphasize === 'warn' ? 'text-rose-700' : '',
        ].join(' ')}
      >
        {asLink ? (
          <span className="inline-flex items-center gap-1.5">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[#1d2433] underline underline-offset-2 decoration-[#1d2433]/40 hover:decoration-[#1d2433]"
            >
              {value}
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Open in a new tab"
              title="Open in a new tab"
              className="inline-flex h-5 w-5 items-center justify-center rounded text-[#6b7280] transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatMoney(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso.includes('T') ? iso : iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatType(t: string): string {
  return t.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
