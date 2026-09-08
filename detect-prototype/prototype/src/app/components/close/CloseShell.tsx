import { useState } from 'react';
import { ChevronDown, Calendar, ListFilter, RotateCw, MoreVertical, Plus } from 'lucide-react';
import { ReconciliationsTable } from './ReconciliationsTable';
import { TransactionsPage } from './TransactionsPage';
import { recs } from '../../../data/recs';

/**
 * Close — top-level shell for the Close product.
 *
 * Currently a visual scaffolding. Tabs render but only Reconciliations
 * has any body content (placeholder for now). Toolbar buttons are
 * inert — they're styled to match the Figma reference but don't wire
 * to functionality yet.
 *
 * Mirrors the Detect shell's chrome: top white bar with product
 * lockup + tab strip, period/subsidiary toolbar, and a body region.
 */

const TABS = [
  { id: 'dashboard', label: 'Dashboard'        },
  { id: 'folders',   label: 'Folders'          },
  { id: 'checklist', label: 'Checklist'        },
  { id: 'recs',      label: 'Reconciliations'  },
  { id: 'notes',     label: 'Notes'            },
  { id: 'analytics', label: 'Analytics'        },
  { id: 'journals',  label: 'Journal Entries'  },
  { id: 'variance',  label: 'Variance Analysis'},
] as const;

type TabId = (typeof TABS)[number]['id'];

export function CloseShell({
  onOpenInDetect,
}: {
  /** Called when the user clicks an anomaly-flagged row in either the
   *  Reconciliations table or the nested Transactions page. The host
   *  (App.tsx) swaps to the Detect surface. The optional `accountCode`
   *  is the GL account the user was scoped to — the host applies it as
   *  a filter and picks the first matching anomaly record so the user
   *  lands on a specific transaction inside Detect. */
  onOpenInDetect?: (accountCode?: string, txId?: string, anomalousTxIds?: string[]) => void;
} = {}) {
  const [activeTab, setActiveTab] = useState<TabId>('recs');
  // When set, the Reconciliations tab renders the nested Transactions
  // page instead of the recs list. Driven by clicks on "View
  // Transactions" in the recs table.
  const [openRecId, setOpenRecId] = useState<string | null>(null);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {/* Top white bar — Close lockup + tab strip */}
      <div className="shrink-0 border-b border-[#e1e6ef] bg-white">
        <div className="flex h-[60px] items-center gap-6 pl-6 pr-6">
          <div className="flex shrink-0 items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}icons/close.svg`}
              alt=""
              width={22}
              height={22}
              className="block"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="font-header text-base font-bold leading-5 text-[#1d2433]">Close</span>
          </div>

          <nav className="flex h-full items-center gap-6">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex h-full items-center border-b-2 px-1 py-2 font-header text-[13px] font-bold leading-[18px] tracking-[-0.13px] transition-colors ${
                    active
                      ? 'border-[#1FAC76] text-[#1d2433]'
                      : 'border-transparent text-[#424867] hover:text-[#1d2433]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Period / subsidiary toolbar — same chrome as Detect */}
      <header className="shrink-0 border-b border-[#e1e6ef] bg-white">
        <div className="flex items-center gap-4 px-6 py-4">
          <div className="relative w-[147px]">
            <select
              defaultValue="all"
              className="h-10 w-full appearance-none rounded-md bg-white pl-2 pr-9 font-['Inter'] text-xs font-medium leading-4 text-[#424867] ring-1 ring-inset ring-[#e1e6ef] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="all">All Entities</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#424867]" />
          </div>
          <div className="relative w-[200px]">
            <Calendar className="pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#424867]" />
            <select
              // Default period bumped to April 2026 so it lines up with
              // the Close seed transactions (BILL-44022 etc., all
              // dated 2026-04) and matches Detect's default period.
              defaultValue="2026-04"
              className="h-10 w-full appearance-none rounded-md bg-white pl-9 pr-9 font-['Inter'] text-xs font-medium leading-4 text-[#424867] ring-1 ring-inset ring-[#e1e6ef] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="2026-04">April 2026</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#424867]" />
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
        {activeTab === 'recs' ? (
          openRecId ? (
            <TransactionsPage
              recId={openRecId}
              onBack={() => setOpenRecId(null)}
              onOpenAnomalies={(txId, anomalousTxIds) => {
                // Look up the rec's GL account so Detect can filter on
                // it; pass the clicked transaction's ID so the bridge
                // can select the exact matching record on the Detect
                // side, plus the full list of anomalous tx ids in the
                // current Close view so the Detect inbox is restricted
                // to exactly those transactions (count-aligned with
                // Close, no surprise extras from the rule engine).
                const openRec = recs.find((r) => r.id === openRecId);
                onOpenInDetect?.(openRec?.accountCode, txId, anomalousTxIds);
              }}
            />
          ) : (
            <ReconciliationsTab onOpenRec={(id) => setOpenRecId(id)} />
          )
        ) : (
          <TabPlaceholder label={TABS.find((t) => t.id === activeTab)!.label} />
        )}
      </main>
    </div>
  );
}

/**
 * Reconciliations tab body. For now: page header + action toolbar
 * + Quick Filters row. The actual table comes in a follow-up step
 * (per Gaurav's 5.8.26 sync).
 */
function ReconciliationsTab({ onOpenRec }: { onOpenRec: (recId: string) => void }) {
  return (
    <div className="flex flex-col">
      {/* Page header — title + action toolbar (Filter, Refresh, Collapse All, Completeness, Add) */}
      <div className="border-b border-[#e1e6ef] bg-white">
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="flex flex-col gap-0.5">
            <h1 className="font-header text-2xl font-bold leading-8 tracking-[-0.24px] text-[#1d2433]">
              Reconciliations
            </h1>
            <span className="font-['Inter'] text-xs font-medium leading-4 text-[#6b7280] tabular-nums">
              100/100
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ToolbarButton icon={<ListFilter className="h-4 w-4" />} label="Filters" />
            <ToolbarButton icon={<RotateCw className="h-4 w-4" />} label="Refresh" />
            <ToolbarButton label="Collapse All" />
            <ToolbarButton label="Completeness" />
            <button
              type="button"
              className="inline-flex h-10 items-center gap-1 rounded-md bg-[#1FAC76] px-3 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749]"
            >
              <Plus className="h-4 w-4" />
              Add
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="More actions"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#6b7280] hover:bg-[#f1f3f9] hover:text-[#1d2433]"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters row — pb-2 here (8px) combines with the
            ReconciliationsTable's own pt-4 (16px) to give a 24px gap to
            the table. Padding is split across the two wrappers because
            each owns its own vertical breathing room; the visible
            section break is the sum. */}
      <div className="bg-white">
        <div className="px-6 pt-4 pb-2">
          <p className="mb-2 font-['Inter'] text-xs font-bold leading-4 text-[#1d2433]">
            Quick Filters
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <QuickFilterChip label="Assigned to You" />
            <QuickFilterChip label="Your Open Items" />
          </div>
        </div>
      </div>

      {/* Reconciliations table */}
      <ReconciliationsTable onOpenRec={onOpenRec} />
    </div>
  );
}

function ToolbarButton({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-1.5 rounded-md border border-[#e1e6ef] bg-white px-3 font-header text-xs font-bold leading-4 text-[#424867] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:border-[#cbd2e1] hover:text-[#1d2433]"
    >
      {icon}
      {label}
    </button>
  );
}

function QuickFilterChip({ label }: { label: string }) {
  // FlowUI quick-filter chip — squared with rounded corners (rounded-md),
  // filled neutral surface, Museo Sans button text. Matches FlowUI's
  // toolbar choice-chip pattern rather than a pill.
  return (
    <button
      type="button"
      className="inline-flex h-8 items-center rounded-md bg-[#f1f3f9] px-3 font-header text-xs font-bold leading-4 text-[#1d2433] transition-colors hover:bg-[#e1e6ef]"
    >
      {label}
    </button>
  );
}

function TabPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="rounded-md border border-dashed border-[#cbd2e1] bg-white px-8 py-12 text-center">
        <p className="font-header text-base font-bold leading-5 text-[#1d2433]">{label}</p>
        <p className="mt-2 font-['Inter'] text-xs leading-[18px] text-[#6b7280]">
          Not yet built in this prototype.
        </p>
      </div>
    </div>
  );
}
