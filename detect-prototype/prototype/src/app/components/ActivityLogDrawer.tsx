import { useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { useAppStore, transactions } from '../../store/useAppStore';
import { getTeamMember } from '../../data/team';
import { currentPeriodId, getPeriod } from '../../data/company';

interface Props {
  onClose: () => void;
}

/**
 * Slide-in activity log drawer — mirrors the original Figma Make design.
 * Renders every activity entry in the store with actor + timestamp +
 * message. Fixed right-side drawer over a semi-transparent backdrop.
 */
export function ActivityLogDrawer({ onClose }: Props) {
  const activity = useAppStore((s) => s.activity);
  const records = useAppStore((s) => s.records);
  const period = getPeriod(currentPeriodId);
  const totalAnomalies = records.length;

  // Newest first
  const entries = [...activity].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30 transition-opacity"
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[500px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <header className="flex items-start justify-between gap-3 border-b border-neutral-200 px-8 py-6">
          <div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-neutral-700" />
              <h2 className="font-display text-lg tracking-tight text-neutral-900">
                Activity Log
              </h2>
            </div>
            <div className="ml-8 mt-0.5 space-y-0.5 text-xs font-mono text-neutral-500">
              <p>{period?.label}</p>
              <p>{totalAnomalies} total anomalies</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
          {entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-500">
              No activity yet. Actions you take will appear here.
            </div>
          ) : (
            <ul className="space-y-6">
              {entries.map((entry) => {
                const actor = getTeamMember(entry.byId);
                const rec = records.find((r) => r.id === entry.recordId);
                const tx = rec
                  ? transactions.find((t) => t.id === rec.transactionId)
                  : null;
                return (
                  <li
                    key={entry.id}
                    className="flex gap-3 border-b border-neutral-100 pb-6 last:border-0"
                  >
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-neutral-400" />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-baseline gap-2">
                        <p className="text-sm font-medium text-neutral-900">
                          {actor?.name ?? entry.byId}
                        </p>
                        <span className="font-mono text-xs text-neutral-400">
                          {formatRelative(entry.at)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-700">
                        {entry.message}
                        {tx && (
                          <>
                            {' — '}
                            <span className="font-mono text-neutral-900">
                              {tx.transactionId}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
