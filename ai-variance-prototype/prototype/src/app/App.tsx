import { useState } from 'react';
import { ChevronDown, Calendar, TrendingUp, BookOpen } from 'lucide-react';
import {
  COLLECTIONS,
  type Status,
  type Collection,
  allItems,
} from '../data/variances';
import { VarianceInbox } from './components/inbox/VarianceInbox';
import { FocusPanel } from './components/focus/FocusPanel';

const ENTRY_TYPES = ['NS Entry', 'Manual Entry', 'Adjustment'];
const PERIODS = ['2026-03-31', '2026-02-28', '2025-12-31', '2025-09-30'];

export default function App() {
  const [collections, setCollections] = useState<Collection[]>(COLLECTIONS);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedEntryType, setSelectedEntryType] = useState(ENTRY_TYPES[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);

  // ─── Derived selection ────────────────────────────────────────────────────

  const flat = allItems(collections);
  const selectedItem = flat.find((i) => i.id === selectedItemId) ?? null;
  const selectedCollection =
    collections.find((c) => c.items.some((i) => i.id === selectedItemId)) ?? null;

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function handleStatusChange(itemId: string, status: Status, draft?: string) {
    setCollections((prev) =>
      prev.map((col) => ({
        ...col,
        items: col.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                status,
                ...(draft !== undefined ? { draftExplanation: draft } : {}),
                ...(status === 'ready-for-review' || status === 'signed-off'
                  ? { signedOffAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
                  : {}),
              }
            : item,
        ),
      })),
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">

        {/* App top nav */}
        <div className="shrink-0 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2 px-6 py-2.5">
            <TrendingUp className="h-4 w-4 text-indigo-600" strokeWidth={2.5} />
            <span className="font-display text-sm tracking-tight text-neutral-900">Variance Analysis</span>
          </div>
        </div>

        {/* Toolbar */}
        <header className="shrink-0 border-b border-neutral-200 bg-white">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={selectedEntryType}
                  onChange={(e) => setSelectedEntryType(e.target.value)}
                  className="h-8 appearance-none rounded-md bg-neutral-50 pl-3 pr-8 font-display text-xs font-semibold tracking-tight text-neutral-900 ring-1 ring-inset ring-neutral-200 hover:bg-neutral-100 focus:outline-none cursor-pointer"
                >
                  {ENTRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
              </div>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="h-8 appearance-none rounded-md bg-neutral-50 pl-8 pr-8 font-display text-xs font-semibold tracking-tight text-neutral-900 ring-1 ring-inset ring-neutral-200 hover:bg-neutral-100 focus:outline-none cursor-pointer"
                >
                  {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-neutral-50 px-3 font-body text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200 hover:bg-neutral-100 transition-colors">
                <BookOpen className="h-3.5 w-3.5 text-neutral-400" />
                Rules
              </button>
            </div>
          </div>
        </header>

        {/* Main: inbox + focus panel */}
        <main className="flex min-h-0 flex-1 bg-white">
          <VarianceInbox
            collections={collections}
            selectedItemId={selectedItemId}
            onSelectItem={setSelectedItemId}
          />
          <FocusPanel
            item={selectedItem}
            collection={selectedCollection}
            onStatusChange={handleStatusChange}
          />
        </main>

      </div>
    </div>
  );
}
