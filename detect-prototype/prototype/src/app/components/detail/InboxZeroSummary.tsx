import {
  Activity,
  BookOpen,
  CheckSquare,
  LineChart,
  Scale,
  CircleCheck,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { getPeriod, currentPeriodId } from '../../../data/company';
import { getTeamMember, currentUserId } from '../../../data/team';

/**
 * Detail-area companion to the inbox-zero state in the inbox list.
 *
 * Instead of the generic "Select an anomaly…" placeholder when there's
 * nothing to select, show a reflective wrap-up: how many anomalies got
 * reviewed this period and a breakdown by resolution type.
 */
export function InboxZeroSummary() {
  const records = useAppStore((s) => s.records);
  const period = getPeriod(currentPeriodId);
  const user = getTeamMember(currentUserId);
  const firstName = user?.name.split(' ')[0] ?? 'there';

  // Breakdown by resolution kind
  const resolved = records.filter((r) => r.status === 'resolved');
  const ignored = records.filter((r) => r.status === 'dismissed');
  const total = resolved.length + ignored.length;

  const byKind = {
    'journal-entry': resolved.filter((r) => r.resolution?.kind === 'journal-entry').length,
    reconciliation: resolved.filter((r) => r.resolution?.kind === 'reconciliation').length,
    'close-task': resolved.filter((r) => r.resolution?.kind === 'close-task').length,
    'flux-explanation': resolved.filter((r) => r.resolution?.kind === 'flux-explanation').length,
    'no-action': resolved.filter((r) => r.resolution?.kind === 'no-action').length,
    ignored: ignored.length,
  };

  const statCards = [
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: 'Journal entries',
      count: byKind['journal-entry'],
      color: 'text-indigo-700 bg-indigo-50',
    },
    {
      icon: <Scale className="h-4 w-4" />,
      label: 'Reconciliation items',
      count: byKind['reconciliation'],
      color: 'text-cyan-700 bg-cyan-50',
    },
    {
      icon: <CheckSquare className="h-4 w-4" />,
      label: 'Close tasks created',
      count: byKind['close-task'],
      color: 'text-emerald-700 bg-emerald-50',
    },
    {
      icon: <LineChart className="h-4 w-4" />,
      label: 'Flux explanations',
      count: byKind['flux-explanation'],
      color: 'text-violet-700 bg-violet-50',
    },
    {
      icon: <CircleCheck className="h-4 w-4" />,
      label: 'No action needed',
      count: byKind['no-action'],
      color: 'text-neutral-700 bg-neutral-100',
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: 'Ignored',
      count: byKind['ignored'],
      color: 'text-slate-700 bg-slate-100',
    },
  ];

  return (
    <section className="flex h-full flex-1 items-center justify-center overflow-y-auto bg-neutral-50 p-8">
      <div className="mx-auto max-w-lg [animation:iz-card-in_500ms_cubic-bezier(0.2,0,0,1)_both]">
        <style>{`
          @keyframes iz-card-in {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          {/* Kicker */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500">
            <Activity className="h-3.5 w-3.5" />
            <span>{period?.label ?? 'This period'} · Period summary</span>
          </div>

          <h2 className="mt-3 font-display text-3xl tracking-tight text-neutral-900">
            Well done, {firstName}.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            You&rsquo;ve reviewed every anomaly Detect raised for{' '}
            {period?.label ?? 'this period'}. Here&rsquo;s how the resolutions
            shook out.
          </p>

          {/* Headline stat */}
          <div className="mt-6 flex items-baseline gap-3 border-b border-neutral-100 pb-5">
            <span className="font-display text-5xl tabular-nums text-neutral-900">
              {total}
            </span>
            <span className="text-sm text-neutral-600">
              anomal{total === 1 ? 'y' : 'ies'} reviewed
            </span>
          </div>

          {/* Breakdown grid */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-white px-3 py-2.5"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${s.color}`}
                >
                  {s.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-lg tabular-nums leading-none text-neutral-900">
                    {s.count}
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-neutral-500">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next */}
          <div className="mt-6 flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <TrendingUp className="h-4 w-4 text-neutral-500" />
              The AI is still scanning. New anomalies land here as they&rsquo;re found.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
