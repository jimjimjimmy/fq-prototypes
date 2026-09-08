import { Tag, MessageSquare, Paperclip, Settings, MoreVertical, AlertCircle } from 'lucide-react';
import type { RecRow, RecBadge, RecAssignee } from '../../../data/recs';
import { getTeamMember } from '../../../data/team';

/**
 * Reconciliations table — flat-row layout matching the FlowUI reference
 * (Figma node 87:43232) with FlowUI design tokens replicated in Tailwind.
 *
 * Rows with anomalies surface a clickable badge that bridges to Detect
 * (Gaurav 5.8.26 sync). Other rows are visual only in this prototype.
 */

// Column widths tuned to each column's content. The four text-heavy
// columns (Entity, Account, Assignees, Completed) all flex (1fr) so
// extra viewport width is distributed evenly across them — no single
// column absorbs the slack. Numeric and icon columns stay at fixed
// widths sized for header + typical data with comfortable breathing
// space between them.
const COL_TEMPLATE =
  'grid-cols-[minmax(200px,1fr)_minmax(200px,1fr)_250px_145px_105px_125px_240px_140px_minmax(205px,1fr)_170px]';

export function ReconciliationsTable({
  onOpenAnomalies,
  onOpenRec,
}: {
  onOpenAnomalies?: (rec: RecRow) => void;
  /** Called when the user clicks "View Transactions" on a row. The
   *  host opens the nested Transactions page for that rec. */
  onOpenRec?: (recId: string) => void;
}) {
  return (
    <div className="px-6 py-4">
      <div className="overflow-x-auto rounded-md border border-[#e1e6ef] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div>
          <HeaderRow />
          {recs.map((rec) => (
            <Row
              key={rec.id}
              rec={rec}
              onOpenAnomalies={onOpenAnomalies}
              onOpenRec={onOpenRec}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import { recs } from '../../../data/recs';

function HeaderRow() {
  // Per-column padding mirrors the body cells exactly so labels stay
  // vertically aligned with the data underneath. Three logical
  // groupings — context (Entity + Account), money (Per NetSuite →
  // Difference), people + workflow (Assignees → Completed) — are
  // expressed by tighter `tight` gaps inside the pair and wider `wide`
  // gaps at the cluster boundaries.
  const cols: {
    label: string;
    align?: 'end';
    padLeft?: Pad;
    padRight?: Pad;
  }[] = [
    { label: 'Entity / Period / Folder',                padRight: 'tight' },
    { label: 'Account',                  padLeft: 'tight', padRight: 'wide' },
    { label: 'Per NetSuite', align: 'end', padLeft: 'wide' },
    { label: 'Rec. Balance' },
    { label: 'Rec. Items', align: 'end' },
    { label: 'Difference', align: 'end',  padRight: 'wide' },
    { label: 'Assignees',                 padLeft: 'wide' },
    { label: 'Due Date' },
    { label: 'Completed' },
    { label: 'Action',                                   padRight: 'tight' },
  ];
  return (
    <div className={`grid ${COL_TEMPLATE} sticky top-0 z-10 border-b border-[#e1e6ef] bg-[#f8fafc]`}>
      {cols.map(({ label, align, padLeft = 'base', padRight = 'base' }) => (
        <div
          key={label}
          className={`flex h-[50px] items-center font-['Inter'] text-[12px] font-semibold leading-4 text-[#1b1f27] ${
            PAD_L[padLeft]
          } ${PAD_R[padRight]} ${align === 'end' ? 'justify-end' : ''}`}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

function Row({
  rec,
  onOpenAnomalies,
  onOpenRec,
}: {
  rec: RecRow;
  onOpenAnomalies?: (rec: RecRow) => void;
  onOpenRec?: (recId: string) => void;
}) {
  return (
    <div
      className={`grid ${COL_TEMPLATE} border-b border-[#e1e6ef] bg-white`}
    >
      {/* Col 1: Entity / Period folder — paired with Account on the right */}
      <Cell padRight="tight">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-['Inter'] text-[12px] font-normal leading-4 text-[#1b1f27]">
              {rec.entityName}
            </span>
            {rec.entityTag && (
              <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#f1f3f9] px-1.5 py-0.5 font-['Inter'] text-[10px] font-medium leading-[14px] text-[#424867]">
                <Tag className="h-2.5 w-2.5" />
                {rec.entityTag}
              </span>
            )}
          </div>
          {/* Period folder styled as a link — same FlowUI text-link
               treatment as "View Transactions" (Inter, body-text,
               underlined with softened decoration), but rendered as a
               non-interactive <span> so it reads as a link visually
               without behaving like one. Kept at 11px to preserve the
               secondary-text hierarchy. */}
          <span className="font-['Inter'] self-start text-[11px] font-semibold leading-4 text-[#1d2433] underline underline-offset-2 decoration-[#1d2433]/40">
            {rec.periodFolder}
          </span>
          <BadgeStack badges={rec.riskBadges} />
        </div>
      </Cell>

      {/* Col 2: Account — paired with Entity (tight left), wide right
           edge marks the context→money cluster boundary. */}
      <Cell padLeft="tight" padRight="wide">
        <div className="flex flex-col gap-1.5">
          <div className="font-['Inter'] text-[12px] font-semibold leading-4 text-[#1b1f27]">
            {rec.accountCode} {rec.accountName}
          </div>
          {rec.accountSubtype && (
            // Account subtype styled as a link — same FlowUI text-link
            // treatment as "View Transactions" and the period folder
            // above, rendered as a non-interactive <span>. Kept at 11px
            // to preserve secondary hierarchy.
            <span className="font-['Inter'] self-start text-[11px] font-semibold leading-4 text-[#1d2433] underline underline-offset-2 decoration-[#1d2433]/40">
              {rec.accountSubtype}
            </span>
          )}
          {rec.workflowBadges.length > 0 && <BadgeStack badges={rec.workflowBadges} />}
        </div>
      </Cell>

      {/* Col 3: Per NetSuite — money cluster start (wide left from Account) */}
      <Cell justify="end" padLeft="wide">
        <div className="flex flex-col items-end gap-1.5">
          <span className="font-['Inter'] text-[12px] font-normal leading-4 text-[#1d2433] tabular-nums">
            {formatMoney(rec.perNetSuite)}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenRec?.(rec.id);
            }}
            // FlowUI text link — Inter, body-text color `#1d2433`
            // (`body-text` / --flo-sem-color-text-primary), underlined
            // with a softened 40% decoration that solidifies on hover.
            // `!font-['Inter']` uses the important prefix to beat the
            // global `button { font-family: inherit }` rule in
            // index.css, which would otherwise pull Newsreader from
            // the body.
            className="!font-['Inter'] text-[12px] font-semibold leading-4 text-[#1d2433] /* body-text */ underline underline-offset-2 decoration-[#1d2433]/40 transition-colors hover:decoration-[#1d2433]"
          >
            View Transactions
          </button>
        </div>
      </Cell>

      {/* Col 4: Rec. Balance — base padding inside the money cluster. */}
      <Cell>
        {rec.recBalanceStatus === 'missing' ? (
          <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#fff8eb] px-1.5 py-1 font-['Inter'] text-[12px] font-semibold leading-[18px] text-[#db7712]">
            Missing
          </span>
        ) : (
          <span className="font-['Inter'] text-[12px] font-normal leading-4 text-[#1d2433] tabular-nums">
            {formatMoney(rec.recBalance)}
          </span>
        )}
      </Cell>

      {/* Col 5: Rec. Items — count of reconciled line items */}
      <Cell justify="end">
        <span className="font-['Inter'] text-[12px] font-normal leading-4 text-[#1d2433] tabular-nums">
          {rec.recItems}
        </span>
      </Cell>

      {/* Col 6: Difference — money cluster end (wide right marks the
           money→people cluster boundary). */}
      <Cell justify="end" padRight="wide">
        {/* Non-zero difference uses warning, not danger — a balance
             mismatch is "needs attention," not "destructive." FlowUI
             `--flo-sem-color-warning` (#db7712 / warning-primary). */}
        <span
          className={`font-['Inter'] text-[12px] font-normal leading-4 tabular-nums ${
            rec.difference === 0 ? 'text-[#1d2433]' : 'text-[#db7712]'
          }`}
        >
          {formatMoney(rec.difference)}
        </span>
      </Cell>

      {/* Col 7: Assignees — people cluster start (wide left from money cluster). */}
      <Cell padLeft="wide">
        <div className="flex w-full flex-col gap-1">
          {rec.assignees.map((a) => (
            <AssigneeRow key={a.memberId + a.role} assignee={a} />
          ))}
        </div>
      </Cell>

      {/* Col 8: Due Date — base padding inside the people cluster. */}
      <Cell>
        <div className="flex flex-col gap-1">
          {rec.assignees.map((a) => (
            <DateOnlyRow key={a.memberId + a.role + 'due'} assignee={a} />
          ))}
        </div>
      </Cell>

      {/* Col 9: Completed — signer panel or "Waiting for sign-off" */}
      <Cell>
        <div className="flex flex-col gap-1">
          {rec.assignees.map((a) => (
            <CompletedCell key={a.memberId + a.role + 'done'} assignee={a} />
          ))}
        </div>
      </Cell>

      {/* Col 10: Actions — last column hugs the table's right edge. */}
      <Cell padRight="tight">
        <div className="flex items-center gap-1">
          <ActionIcon icon={<MessageSquare className="h-4 w-4" />} count={rec.commentCount} tone="danger" />
          <ActionIcon icon={<Paperclip className="h-4 w-4" />} count={rec.attachmentCount} tone="danger" />
          <ActionIcon icon={<Settings className="h-4 w-4" />} />
          <ActionIcon icon={<MoreVertical className="h-4 w-4" />} />
        </div>
      </Cell>
    </div>
  );
}

/** Three-step horizontal padding scale.
 *  - tight (pl/pr-3 = 12px) — paired columns / table-edge
 *  - base  (pl/pr-5 = 20px) — default rhythm
 *  - wide  (pl/pr-7 = 28px) — cluster-boundary breathing room */
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
}) {
  return (
    <div
      className={`flex items-start py-4 ${PAD_L[padLeft]} ${PAD_R[padRight]} ${
        justify === 'end' ? 'justify-end' : ''
      }`}
    >
      {children}
    </div>
  );
}

function BadgeStack({ badges }: { badges: RecBadge[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {badges.map((b, i) => (
        <Badge key={`${b.label}-${i}`} badge={b} />
      ))}
    </div>
  );
}

function Badge({ badge }: { badge: RecBadge }) {
  const toneStyles: Record<RecBadge['tone'], string> = {
    neutral: 'bg-[#f1f3f9] text-[#424867]',
    info:    'bg-[#f0f5ff] text-[#3d7bf7]',
    warning: 'bg-[#fff8eb] text-[#db7712]',
    danger:  'bg-[#fde9e9] text-[#d24747]',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 font-['Inter'] text-[10px] font-semibold leading-[14px] ${toneStyles[badge.tone]}`}
    >
      {badge.label}
      {typeof badge.count === 'number' && (
        <span className="inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-white/60 px-1 text-[9px] font-bold">
          {badge.count}
        </span>
      )}
    </span>
  );
}

// Each per-assignee sub-row is fixed at SUBROW_H so Assignees / Due Date /
// Completed line up across columns regardless of content.
const SUBROW_H = 'h-10';

function AssigneeRow({ assignee }: { assignee: RecAssignee }) {
  const m = getTeamMember(assignee.memberId);
  if (!m) return null;
  // w-full forces every AssigneeRow to span the Cell's full content width
  // so the Toggle (`ml-auto`-pinned) sits at the same x-offset across all
  // rows and recs, regardless of how long the name truncates.
  return (
    <div className={`flex w-full ${SUBROW_H} items-center gap-2`}>
      <img
        src={m.avatar}
        alt={m.name}
        className="h-7 w-7 shrink-0 rounded-full border border-neutral-200 object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-['Inter'] text-[12px] font-semibold leading-4 text-[#1b1f27]">{m.name}</span>
        <span className="font-['Inter'] text-[10px] font-medium leading-[14px] text-[#6b7280]">{assignee.role}</span>
      </div>
      <span className="ml-auto shrink-0">
        <Toggle on={assignee.signedOff} />
      </span>
    </div>
  );
}

function DateOnlyRow({ assignee }: { assignee: RecAssignee }) {
  // Due date text always renders in body color (#1d2433) — uniform
  // regardless of late status. The late signal is carried by the
  // orange AlertCircle icon to the left (FlowUI
  // `--flo-sem-color-warning` / #db7712), not by recoloring the date.
  return (
    <div className={`flex ${SUBROW_H} items-center gap-1`}>
      {assignee.lateFlag && (
        <AlertCircle className="h-3 w-3 shrink-0 text-[#db7712]" />
      )}
      <span className="!font-['Inter'] text-[11px] font-medium leading-4 tabular-nums text-[#1d2433]">
        {formatDate(assignee.dueDate)}
      </span>
    </div>
  );
}

function CompletedCell({ assignee }: { assignee: RecAssignee }) {
  if (!assignee.signedOff) {
    return (
      <div className={`flex ${SUBROW_H} items-center gap-2`}>
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-[#cbd2e1] bg-white">
          <span className="h-3 w-3 rounded-full bg-[#e1e6ef]" />
        </span>
        <div className="flex flex-col">
          <span className="font-['Inter'] text-[12px] font-semibold leading-4 text-[#1b1f27]">{assignee.role}</span>
          <span className="font-['Inter'] text-[10px] font-medium leading-[14px] text-[#6b7280]">Waiting for sign-off</span>
        </div>
      </div>
    );
  }
  const m = getTeamMember(assignee.memberId);
  if (!m) return null;
  return (
    <div className={`flex ${SUBROW_H} items-center gap-2`}>
      <img src={m.avatar} alt={m.name} className="h-7 w-7 shrink-0 rounded-full border border-neutral-200 object-cover" />
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-['Inter'] text-[12px] font-semibold leading-4 text-[#1b1f27]">{m.name}</span>
        {/* Sign-off date text always renders in muted color (#6b7280)
             — uniform regardless of late status. The lateness signal is
             carried by the orange AlertCircle (FlowUI
             `--flo-sem-color-warning` / #db7712) replacing the green
             check, not by recoloring the date text. */}
        <span className="flex items-center gap-1 font-['Inter'] text-[10px] font-medium leading-[14px] text-[#6b7280]">
          {assignee.lateFlag ? (
            <AlertCircle className="h-3 w-3 shrink-0 text-[#db7712]" />
          ) : (
            <span className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#1FAC76] text-white">
              <svg viewBox="0 0 12 12" className="h-2 w-2" fill="none">
                <path d="M2.5 6.5l2.5 2.5L9.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          {formatDate(assignee.signedOffAt!)}
        </span>
      </div>
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={`relative inline-flex h-5 w-10 shrink-0 rounded-full ${
        on ? 'bg-[#1FAC76]' : 'bg-neutral-200'
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          on ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </span>
  );
}

function ActionIcon({
  icon,
  count,
  tone,
}: {
  icon: React.ReactNode;
  count?: number;
  tone?: 'danger' | 'warning';
}) {
  // Icon color is always neutral — only the badge counter is colored.
  return (
    <button
      type="button"
      onClick={(e) => e.stopPropagation()}
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
    >
      {icon}
      {typeof count === 'number' && count > 0 && (
        <span
          className={`absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-['Inter'] text-[9px] font-bold leading-3 text-white ${
            tone === 'danger' ? 'bg-[#d24747]' : 'bg-[#db7712]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
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
