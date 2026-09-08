import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { getTeamMember } from '../../../data/team';
import type { ActivityEntry, AnomalyFlag } from '../../../data/types';

interface Props {
  recordId: string;
}

/**
 * Per-transaction activity log card — collapsed by default.
 *
 * Shows every action taken on this specific transaction: the initial
 * flag, assignee changes, comments posted, and resolution events.
 * Entries are shown newest-first (chronological order, reversed).
 */
export function ActivityCard({ recordId }: Props) {
  const [expanded, setExpanded] = useState(false);
  const allActivity = useAppStore((s) => s.activity);
  const recordFlags = useAppStore(
    (s) => s.records.find((r) => r.id === recordId)?.flags ?? [],
  );

  // Newest activity at the top — reviewers care most about what just
  // happened (latest sign-off, latest comment) when they re-open a record.
  const entries = useMemo(
    () =>
      allActivity
        .filter((e) => e.recordId === recordId)
        .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()),
    [allActivity, recordId],
  );

  return (
    <div className="overflow-hidden rounded-md border border-[#e1e6ef] bg-white">
      {/* Collapsed header — always visible, click to toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="group flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-header text-base font-bold leading-5 text-[#1d2433]">
          Activity Log
        </span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#6b7280] group-hover:bg-neutral-100 group-hover:text-neutral-900">
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </button>

      {/* Header divider — only when expanded */}
      {expanded && <div className="border-t border-[#e1e6ef]" />}

      {expanded && (
        <div className="max-h-80 overflow-y-auto px-6 py-4 [scrollbar-color:#cbd2e1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cbd2e1] [&::-webkit-scrollbar-track]:bg-transparent">
          {entries.length === 0 ? (
            <p className="py-5 text-center font-['Inter'] text-xs font-normal leading-4 text-[#6b7280]">
              No activity yet
            </p>
          ) : (
            <ul>
              {entries.map((entry, idx) => (
                <ActivityRow
                  key={entry.id}
                  entry={entry}
                  isLast={idx === entries.length - 1}
                  recordFlags={recordFlags}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function ActivityRow({
  entry,
  isLast,
  recordFlags,
}: {
  entry: ActivityEntry;
  isLast: boolean;
  recordFlags: AnomalyFlag[];
}) {
  const actor = getTeamMember(entry.byId);
  const { title, detail } = formatActivityEntry(entry, actor?.name);
  const isFlagEvent = entry.kind === 'flag-added' || entry.kind === 'flag-removed';
  const isAssignEvent = entry.kind === 'assigned' || entry.kind === 'unassigned';
  const isCommentMutation = entry.kind === 'comment-edited' || entry.kind === 'comment-deleted';
  const isSignOffEvent = entry.kind === 'resolved' || entry.kind === 'reopened';
  const hasBullets =
    isFlagEvent ||
    isAssignEvent ||
    isCommentMutation ||
    (isSignOffEvent && (entry.details?.length ?? 0) > 0);
  const actorLabel = entry.byId === 'system' ? 'FloQast' : (actor?.name ?? 'FloQast');

  // Build the bullet-list lines for flag and assignee events.
  // Prefer stored `details` (always present for new entries). Fall back to
  // a live derivation for flag-added entries written before the details field
  // existed (old localStorage data).
  const bulletLines = useMemo<string[]>(() => {
    if (!hasBullets) return [];
    if (entry.details && entry.details.length > 0) return entry.details;
    // Fallback: derive flag labels from live record flags near this entry's timestamp
    if (entry.kind === 'flag-added' && recordFlags.length > 0) {
      const entryTs = new Date(entry.at).getTime();
      const ONE_HOUR_MS = 60 * 60 * 1000;
      const nearby = recordFlags.filter(
        (f) => Math.abs(new Date(f.detectedAt).getTime() - entryTs) < ONE_HOUR_MS,
      );
      const toShow = nearby.length > 0 ? nearby : recordFlags;
      return toShow.map((f) =>
        f.source.kind === 'rule'
          ? `Rule detected: ${f.source.ruleName}`
          : `AI detected: ${f.source.categoryLabel}`,
      );
    }
    return [];
  }, [hasBullets, entry, recordFlags]);

  return (
    <li className="flex">
      {/* Timeline column */}
      <div className="relative flex w-[26px] shrink-0 flex-col items-center">
        <div className="h-1.5 w-0.5 bg-[#e1e6ef]" />
        <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#adb2bb]" />
        {!isLast && <div className="w-0.5 flex-1 bg-[#e1e6ef]" />}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pb-4 pl-2">
        <p className="font-['Inter'] text-xs font-semibold leading-[18px] text-[#1d2433]">
          {title}
        </p>

        {/* Metadata — "actor · date · time" consistent for all entry types */}
        <div className="mt-0.5 flex items-center gap-1 font-['Inter'] text-[11px] font-normal leading-4 text-[#adb2bb]">
          <span>{actorLabel}</span>
          <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#adb2bb]" aria-hidden />
          <span>{formatDate(entry.at)}</span>
          <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#adb2bb]" aria-hidden />
          <span>{formatTime(entry.at)}</span>
        </div>

        {/* Bullet list — flag and assignee events */}
        {bulletLines.length > 0 && (
          <ul className="mt-1.5 list-disc pl-[18px]">
            {bulletLines.map((line) => (
              <li
                key={line}
                className="font-['Inter'] text-xs font-normal leading-[18px] text-[#1d2433]"
              >
                {line}
              </li>
            ))}
          </ul>
        )}

        {/* Optional detail line for all other event types */}
        {!hasBullets && detail && (
          <p className="mt-1 font-['Inter'] text-xs font-normal leading-[18px] text-[#1d2433]">
            {detail}
          </p>
        )}
      </div>
    </li>
  );
}

function formatActivityEntry(
  entry: ActivityEntry,
  actorName: string | undefined,
): { title: string; detail?: string } {
  const subject = actorName ?? 'FloQast';
  switch (entry.kind) {
    case 'comment-posted':
      return { title: 'Added a comment' };
    case 'comment-edited':
      return { title: 'Edited a comment' };
    case 'comment-deleted':
      return { title: 'Deleted a comment' };
    case 'assigned':
      return { title: 'Added assignees' };
    case 'unassigned':
      return { title: 'Removed assignees' };
    case 'resolved':
      return { title: 'Added signoff' };
    case 'reopened':
      return { title: 'Removed signoff' };
    case 'dismissed':
      return { title: `${subject} dismissed the anomaly`, detail: entry.message };
    case 'flagged-for-review':
      return { title: `${subject} flagged this for review`, detail: entry.message };
    case 'flag-added':
      return { title: 'Flagged anomalies' };
    case 'flag-removed':
      return { title: 'Removed anomalies' };
    case 'rule-updated':
      return { title: `${subject} updated a rule`, detail: entry.message };
    case 'feedback-recorded':
      return { title: `${subject} recorded feedback`, detail: entry.message };
    default:
      return { title: entry.message };
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}
