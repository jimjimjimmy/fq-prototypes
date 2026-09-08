import { useMemo, useState } from 'react';
import { Search, Info, ListFilter } from 'lucide-react';
import { getTeamMember } from '../../../data/team';
import { recs } from '../../../data/recs';
import { getRecTransactions, type RecTransaction } from '../../../data/recTransactions';

/**
 * Transactions page (nested under Reconciliations).
 *
 * Per Gaurav's 5.8.26 sync, this page is intentionally lean:
 *   - Breadcrumb-driven context (no big page title)
 *   - Global search at the page header level
 *   - AG Grid–style flat table
 *   - Anomaly badge on rows that have flags; clicking those rows
 *     bridges to Detect (the row-level pass-through)
 *   - Rows without anomalies are not interactive
 */

// Description gets the bulk of the room (long memos read better);
// other columns are sized just-enough for their content, including the
// trailing Anomalies badge column so it doesn't have empty trailing space.
// Column widths sized to fit each column's content with comfortable
// breathing room — Department through Anomalies Status got an extra
// ~20-30px each so longer names ("Engineering", "Travel & Expense",
// "San Francisco", "Anomalies Status" badges) don't truncate.
// Description flexes (1fr) so it still absorbs slack on wide viewports.
// ID · Date · Name · Description · Department · Class · Location · Amount
// · Currency · Created Date · Anomalies Status
// ID column bumped 100→140px so the full ERP-style IDs ("BILL-44022",
// "PO-2026-318") fit without truncation. Other columns unchanged.
const COL_TEMPLATE =
  'grid-cols-[140px_110px_170px_minmax(280px,1fr)_170px_200px_180px_160px_120px_210px_180px]';

export function TransactionsPage({
  recId,
  onBack,
  onOpenAnomalies,
}: {
  recId: string;
  onBack: () => void;
  /** Fires when the user clicks an anomalous row. Receives the clicked
   *  transaction's id plus the full list of anomalous transaction ids
   *  visible in this view — the bridge uses the list to restrict the
   *  Detect inbox to exactly those transactions, guaranteeing count
   *  alignment between Close and Detect. */
  onOpenAnomalies: (txId: string, anomalousTxIds: string[]) => void;
}) {
  const rec = recs.find((r) => r.id === recId);
  const allTx = useMemo(() => getRecTransactions(recId), [recId]);

  const [search, setSearch] = useState('');
  const [anomaliesOnly, setAnomaliesOnly] = useState(false);

  const txs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allTx.filter((t) => {
      if (anomaliesOnly && t.anomalyCount === 0) return false;
      if (!q) return true;
      return (
        t.id.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.class.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
      );
    });
  }, [allTx, search, anomaliesOnly]);

  const totalAnomalies = allTx.reduce((sum, t) => sum + t.anomalyCount, 0);
  // The full list of anomalous tx ids in this view — handed to the
  // Detect bridge so the inbox there shows exactly these transactions.
  const anomalousTxIds = useMemo(
    () => allTx.filter((t) => t.anomalyCount > 0).map((t) => t.id),
    [allTx],
  );
  // Banner counts how many *transactions* carry anomalous activity
  // (a single tx may have multiple anomalies — those still count once).
  const txWithAnomaliesCount = allTx.filter((t) => t.anomalyCount > 0).length;

  if (!rec) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="font-['Inter'] text-sm text-[#6b7280]">Reconciliation not found.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-3 font-header text-xs font-bold text-[#1FAC76] hover:underline"
        >
          ← Back to Reconciliations
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Page header — breadcrumb only. The table toolbar moved down
            to the summary row so it sits next to the Rec Details card,
            visually closer to the table it controls. */}
      <div className="bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Breadcrumb rec={rec} onBack={onBack} />
        </div>
      </div>

      {/* Summary row — Rec Details card on the left + table toolbar
            (search, Filters, Edit Columns) on the right. Putting the
            toolbar at this level pairs it spatially with the table
            below and frees the page header to be just the breadcrumb.
            `items-end` aligns the toolbar's bottom edge with the card's
            bottom edge so they share a baseline, reinforcing the
            "controls just above the table" relationship. pb-2 (8px)
            here combines with the table wrapper's pt-4 (16px) below
            for a 24px gap into the table. */}
      <div className="px-6 pb-2">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <AccountStatsStrip
            rec={rec}
            anomalyCount={txWithAnomaliesCount}
            anomaliesOnly={anomaliesOnly}
            onToggleAnomalies={() => setAnomaliesOnly((v) => !v)}
          />
          <div className="flex shrink-0 items-center gap-2">
            <div className="relative w-[280px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#adb2bb]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions"
                className="h-9 w-full rounded-md border border-[#e1e6ef] bg-white pl-8 pr-3 font-['Inter'] text-xs font-medium leading-4 text-[#1d2433] placeholder:text-[#adb2bb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:border-[#3d7bf7] focus:outline-none"
              />
            </div>
            <ToolbarButton icon={<ListFilter className="h-4 w-4" />} label="Filters" />
            <ToolbarButton label="Edit Columns" />
          </div>
        </div>
      </div>

      {/* Table area */}
      <div className="px-6 py-4">
        <div className="overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          {/* Scrollable grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[1880px]">
              <HeaderRow />
              {txs.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <p className="font-['Inter'] text-xs font-medium text-[#6b7280]">
                    No transactions match your filters.
                  </p>
                </div>
              ) : (
                txs.map((tx) => (
                  <TxRow
                    key={tx.id}
                    tx={tx}
                    onOpenAnomalies={(txId) => onOpenAnomalies(txId, anomalousTxIds)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Breadcrumb({
  rec,
  onBack,
}: {
  rec: (typeof recs)[number];
  onBack: () => void;
}) {
  // Per Gaurav's 5.8.26 sync: Reconciliations > [Folder] > [Account] >
  // Transactions. Slash separators + Figma styling (8:22932): muted
  // links, dark bold leaf.
  const folder = rec.periodFolder.split('·').slice(1).join('·').trim() || rec.periodFolder;
  const account = `${rec.accountCode} ${rec.accountName}`;
  const segments: { label: string; clickable?: boolean }[] = [
    { label: 'Reconciliations', clickable: true },
    { label: folder },
    { label: account },
    { label: 'Transactions' },
  ];
  return (
    <div className="flex flex-wrap items-center gap-1.5 font-['Inter'] text-[12px] leading-4">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const isClickable = seg.clickable && !isLast;
        return (
          <div key={`${seg.label}-${i}`} className="flex items-center gap-1.5">
            {isClickable ? (
              <button
                type="button"
                onClick={onBack}
                className="cursor-pointer font-['Inter'] text-[12px] font-medium leading-4 text-[#6b7280] hover:text-[#1d2433] hover:underline"
              >
                {seg.label}
              </button>
            ) : (
              <span
                className={`font-['Inter'] text-[12px] leading-4 ${
                  isLast
                    ? 'font-bold text-[#1d2433]'
                    : 'font-medium text-[#6b7280]'
                }`}
              >
                {seg.label}
              </span>
            )}
            {!isLast && <span className="font-['Inter'] text-[12px] leading-4 text-[#adb2bb]">/</span>}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Account stats strip below the page header — Per NetSuite balance,
 * Reconciled balance, Reconciling Items, Difference, and Preparer /
 * Reviewer assignee blocks. Brings back the rec context Gaurav had
 * stripped in v1.
 */
function AccountStatsStrip({
  rec,
  anomalyCount,
  anomaliesOnly,
  onToggleAnomalies,
}: {
  rec: (typeof recs)[number];
  /** When provided + > 0, renders an Anomalies block on the right of
   *  the stat row, separated by a vertical divider. */
  anomalyCount?: number;
  anomaliesOnly?: boolean;
  onToggleAnomalies?: () => void;
}) {
  const preparers = rec.assignees.filter((a) => a.role === 'Preparer');
  const reviewers = rec.assignees.filter((a) => a.role === 'Reviewer');

  const showAnomalies = (anomalyCount ?? 0) > 0;

  // Header + collapse removed per design feedback — the section now
  // always renders its stats inline. `w-fit` makes the card hug its
  // content width instead of stretching to fill the page row.
  //
  // The Anomalies block (when present) lives inside this same card as
  // the 7th item, separated by a vertical divider so it reads as a
  // distinct "risk" stat alongside the 6 reference stats — combining
  // resolves the height-mismatch problem the two-card layout had.
  return (
    <div className="w-fit rounded-md border border-[#e1e6ef] bg-white px-5 py-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex flex-wrap items-stretch gap-x-8 gap-y-3">
        <StatBlock label="Per NetSuite Balance" value={formatMoney(rec.perNetSuite)} info />
        <StatBlock
          label="Reconciled Balance"
          value={
            rec.recBalanceStatus === 'missing' ? (
              <span className="inline-flex h-5 items-center rounded-[4px] bg-[#fff8eb] px-1.5 font-['Inter'] text-[11px] font-semibold leading-[14px] text-[#db7712]">
                Missing
              </span>
            ) : (
              formatMoney(rec.recBalance)
            )
          }
        />
        <StatBlock label="Reconciling Items" value={String(rec.recItems)} />
        <StatBlock
          label="Difference"
          value={
            <span className={rec.difference === 0 ? 'text-[#1d2433]' : 'text-[#d24747]'}>
              {formatMoney(rec.difference)}
            </span>
          }
        />
        <AssigneeStack label="Preparers" assignees={preparers} />
        <AssigneeStack label="Reviewers" assignees={reviewers} />

        {showAnomalies && (
          <>
            {/* Vertical divider — visually separates the risk affordance
                 from the 6 reference stats. Same neutral border color
                 as the card outline so it reads as "structure" not
                 "decoration". */}
            <div className="self-stretch border-l border-[#e1e6ef]" aria-hidden="true" />
            {/* Anomalies link — single FlowUI text link that doubles
                 as the label, count, and click affordance. Reading the
                 link itself ("View 4 detected anomalies") tells the
                 user exactly what clicking does. Singular form drops
                 the trailing "s" so a count of 1 reads naturally
                 ("View 1 detected anomaly"). */}
            {/* -ml-3 (12px) trims the divider→link gap from the
                 default 32px (gap-x-8) down to 20px so left/right
                 padding around the link match. self-center vertically
                 centers the link within the row's stretched height so
                 it sits at the visual middle of the card rather than
                 aligned to a stat's value position. */}
            <button
              type="button"
              onClick={onToggleAnomalies}
              aria-pressed={anomaliesOnly}
              className="!font-['Inter'] -ml-3 self-center text-left text-[12px] font-semibold leading-4 text-[#1d2433] underline underline-offset-2 decoration-[#1d2433]/40 transition-colors hover:decoration-[#1d2433]"
            >
              View {anomalyCount} detected{' '}
              {(anomalyCount ?? 0) === 1 ? 'anomaly' : 'anomalies'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  info,
}: {
  label: string;
  value: React.ReactNode;
  info?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <span className="font-['Inter'] text-[11px] font-medium leading-4 text-[#6b7280]">
          {label}
        </span>
        {info && <Info className="h-3 w-3 text-[#adb2bb]" />}
      </div>
      <span className="font-['Inter'] text-[12px] font-semibold leading-4 text-[#1d2433] tabular-nums">
        {value || '—'}
      </span>
    </div>
  );
}

function AssigneeStack({
  label,
  assignees,
}: {
  label: string;
  assignees: (typeof recs)[number]['assignees'];
}) {
  if (assignees.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        <span className="font-['Inter'] text-[11px] font-medium leading-4 text-[#6b7280]">
          {label}
        </span>
        <span className="font-['Inter'] text-[12px] font-medium leading-4 text-[#adb2bb]">
          Unassigned
        </span>
      </div>
    );
  }
  const lead = assignees[0];
  const leadMember = getTeamMember(lead.memberId);
  const extra = assignees.length - 1;
  return (
    <div className="flex flex-col gap-1">
      <span className="font-['Inter'] text-[11px] font-medium leading-4 text-[#6b7280]">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <div className="flex">
          {leadMember && (
            <img
              src={leadMember.avatar}
              alt={leadMember.name}
              className="h-6 w-6 shrink-0 rounded-full border border-white object-cover"
            />
          )}
          {extra > 0 && (
            <span className="-ml-1.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#1FAC76] px-1 font-['Inter'] text-[10px] font-bold text-white">
              +{extra}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-['Inter'] text-[12px] font-semibold leading-4 text-[#1d2433]">
            {leadMember?.name ?? '—'}
          </span>
          {assignees.length > 1 && (
            <span className="font-['Inter'] text-[10px] font-medium leading-[14px] text-[#6b7280]">
              +{extra} {extra === 1 ? 'Assignee' : 'Assignees'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AnomaliesFilterChip({
  active,
  count,
  onToggle,
}: {
  active: boolean;
  count: number;
  onToggle: () => void;
}) {
  if (count === 0) {
    return (
      <span className="inline-flex h-6 items-center gap-1.5 rounded-[4px] bg-[#f1f3f9] px-2 font-['Inter'] text-xs font-semibold leading-4 text-[#6b7280]">
        No anomalies detected
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex h-6 items-center gap-1.5 rounded-[4px] px-2 font-['Inter'] text-xs font-semibold leading-4 transition-colors ${
        active
          ? 'bg-[#fdecd1] text-[#db7712]'
          : 'bg-[#fff8eb] text-[#db7712] hover:bg-[#fdecd1]'
      }`}
    >
      <AlertCircle className="h-3 w-3" />
      Anomalies Detected
      <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#db7712] px-1 font-['Inter'] text-[9px] font-bold text-white">
        {count}
      </span>
    </button>
  );
}

function HeaderRow() {
  // Column order from Gaurav 5.8.26 sync. Anomaly badge column trails
  // the data columns (rendered as part of the row, not labeled).
  // Clusters mirror the Reconciliations table grouping pattern:
  // - Identity cluster: ID, Date, Name (the "what" of the transaction)
  // - Description: standalone primary content
  // - Categorization cluster: Department, Class, Location (org metadata)
  // - Money cluster: Amount, Currency
  // - Audit cluster: Created, Anomalies Status (workflow metadata)
  const cols: { label: string; padLeft?: Pad; padRight?: Pad; align?: 'end' }[] = [
    { label: 'ID',                                     padRight: 'tight' },
    { label: 'Date',                  padLeft: 'tight', padRight: 'tight' },
    { label: 'Name',                  padLeft: 'tight', padRight: 'wide' },
    { label: 'Description',           padLeft: 'wide',  padRight: 'wide' },
    // Categorization, money, and audit columns share an even base rhythm
    // (40px gaps) with cluster boundaries marked by wider padding.
    { label: 'Department',            padLeft: 'wide' },
    { label: 'Class' },
    { label: 'Location',                                padRight: 'wide' },
    { label: 'Amount', align: 'end',  padLeft: 'wide' },
    { label: 'Currency',                                padRight: 'wide' },
    { label: 'Created Date',          padLeft: 'wide' },
    { label: 'Anomaly Status' },
  ];
  return (
    <div className={`grid ${COL_TEMPLATE} sticky top-0 z-10 border-b border-[#e1e6ef] bg-[#f8fafc]`}>
      {cols.map(({ label, padLeft = 'base', padRight = 'base', align }, i) => (
        <div
          key={`${label}-${i}`}
          className={`flex h-12 min-w-0 items-center font-['Inter'] text-[13px] font-bold leading-5 text-[#1b1f27] ${PAD_L[padLeft]} ${PAD_R[padRight]}`}
        >
          <span className={`flex-1 truncate ${align === 'end' ? 'text-right' : ''}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}


function TxRow({
  tx,
  onOpenAnomalies,
}: {
  tx: RecTransaction;
  onOpenAnomalies: (txId: string) => void;
}) {
  const hasAnomalies = tx.anomalyCount > 0;
  return (
    <div
      // Any row that carries open or resolved anomalies acts as a
      // shortcut into Detect filtered by this rec's GL account.
      onClick={hasAnomalies ? () => onOpenAnomalies(tx.id) : undefined}
      role={hasAnomalies ? 'button' : undefined}
      tabIndex={hasAnomalies ? 0 : undefined}
      className={`grid ${COL_TEMPLATE} border-b border-[#e1e6ef] bg-white ${
        hasAnomalies ? 'cursor-pointer hover:bg-[#f8fafc]' : ''
      }`}
    >

      {/* Identity cluster: ID + Date + Name read as paired metadata. */}
      <Cell padRight="tight">
        <span className="truncate font-['Inter'] text-[12px] font-semibold leading-4 text-[#1d2433] underline underline-offset-2 decoration-[#1d2433]/40">
          {tx.id}
        </span>
      </Cell>
      <Cell padLeft="tight" padRight="tight">
        <span className="font-['Inter'] text-[12px] font-medium leading-4 text-[#1d2433] tabular-nums">
          {formatDate(tx.date)}
        </span>
      </Cell>
      <Cell padLeft="tight" padRight="wide">
        <span className="truncate font-['Inter'] text-[12px] font-medium leading-4 text-[#1d2433]">
          {tx.name}
        </span>
      </Cell>
      {/* Description — primary content, wide padding on both sides. */}
      <Cell padLeft="wide" padRight="wide">
        <span className="truncate font-['Inter'] text-[12px] font-medium leading-4 text-[#1d2433]">
          {tx.description}
        </span>
      </Cell>
      {/* Categorization, money, and audit columns share an even base
           rhythm — wider padding at the cluster boundaries marks the
           transitions. */}
      <Cell padLeft="wide">
        <span className="truncate font-['Inter'] text-[12px] font-medium leading-4 text-[#424867]">
          {tx.department}
        </span>
      </Cell>
      <Cell>
        <span className="truncate font-['Inter'] text-[12px] font-medium leading-4 text-[#424867]">
          {tx.class}
        </span>
      </Cell>
      <Cell padRight="wide">
        <span className="truncate font-['Inter'] text-[12px] font-medium leading-4 text-[#424867]">
          {tx.location}
        </span>
      </Cell>
      <Cell justify="end" padLeft="wide">
        <span className="font-['Inter'] text-[12px] font-semibold leading-4 text-[#1d2433] tabular-nums">
          {formatMoney(tx.amount)}
        </span>
      </Cell>
      <Cell padRight="wide">
        <span className="font-['Inter'] text-[12px] font-medium leading-4 text-[#424867]">
          {tx.currency}
        </span>
      </Cell>
      <Cell padLeft="wide">
        {/* Date only — timestamp dropped per design feedback. The full
             ISO datetime is sliced to the YYYY-MM-DD portion before
             passing to formatDate, which expects a date string. */}
        <span className="truncate font-['Inter'] text-[11px] font-medium leading-4 text-[#6b7280] tabular-nums">
          {formatDate(tx.createdAt.slice(0, 10))}
        </span>
      </Cell>
      <Cell>
        {hasAnomalies && (
          tx.anomalyStatus === 'resolved' ? (
            <span
              // FlowUI TableStatusBadge — success variant
              // bg: --flo-sem-color-success-background (#ecfff8 / brand-50)
              // text: --flo-sem-color-success (#1fac76 / brand-600)
              className="inline-flex h-6 items-center rounded-[4px] bg-[#ecfff8] px-2 font-['Inter'] text-[12px] font-semibold leading-4 text-[#1fac76]"
            >
              Resolved
            </span>
          ) : (
            <span
              className="inline-flex h-6 items-center rounded-[4px] bg-[#fff8eb] px-2 font-['Inter'] text-[12px] font-semibold leading-4 text-[#db7712]"
            >
              Open
            </span>
          )
        )}
      </Cell>
    </div>
  );
}

/** Mirrors the Reconciliations table's 3-step padding scale so the two
 *  tables read with the same rhythm. tight (12) inside paired columns,
 *  base (20) default, wide (28) at cluster boundaries. */
type Pad = 'tight' | 'base' | 'wide';
const PAD_L: Record<Pad, string> = { tight: 'pl-3', base: 'pl-5', wide: 'pl-7' };
const PAD_R: Record<Pad, string> = { tight: 'pr-3', base: 'pr-5', wide: 'pr-7' };

function Cell({
  children,
  justify = 'start',
  padLeft = 'base',
  padRight = 'base',
}: {
  children: React.ReactNode;
  justify?: 'start' | 'end';
  padLeft?: Pad;
  padRight?: Pad;
  /** Retained for backwards-compat; column dividers are no longer drawn. */
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex h-11 min-w-0 items-center ${PAD_L[padLeft]} ${PAD_R[padRight]} ${
        justify === 'end' ? 'justify-end' : ''
      }`}
    >
      {children}
    </div>
  );
}

function formatMoney(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
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

/**
 * Outlined secondary button — mirrors the ToolbarButton in CloseShell so
 * the Filters + Edit Columns buttons on this page match the styling of
 * the Reconciliations page toolbar. Slightly shorter (h-9) to align
 * vertically with the search input next to it.
 */
function ToolbarButton({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#e1e6ef] bg-white px-3 font-header text-xs font-bold leading-4 text-[#424867] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:border-[#cbd2e1] hover:text-[#1d2433]"
    >
      {icon}
      {label}
    </button>
  );
}
