import { Sparkles, CheckCircle2 } from 'lucide-react';
import { getTeamMember, currentUserId } from '../../../data/team';
import { getPeriod, currentPeriodId } from '../../../data/company';

/**
 * Inbox-zero celebration — shown when the Open view has no records.
 * Sparkles pulse around a CheckCircle2 that scales in with a bounce.
 * Positive copy addresses the user by first name to feel personal.
 */
export function InboxZero() {
  const user = getTeamMember(currentUserId);
  const firstName = user?.name.split(' ')[0] ?? 'there';
  const period = getPeriod(currentPeriodId);

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
      {/* Check mark with pulsing sparkles */}
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50 [animation:iz-pop_600ms_cubic-bezier(0.34,1.56,0.64,1)_both]">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" strokeWidth={2.5} />
        </div>

        {/* 3 sparkles orbiting the check, each with a staggered pulse */}
        <Sparkles
          className="pointer-events-none absolute -top-2 -right-3 h-4 w-4 text-amber-400 [animation:iz-sparkle_1.8s_ease-in-out_infinite]"
          style={{ animationDelay: '0s' }}
        />
        <Sparkles
          className="pointer-events-none absolute -bottom-2 -left-3 h-3 w-3 text-fuchsia-400 [animation:iz-sparkle_1.8s_ease-in-out_infinite]"
          style={{ animationDelay: '0.6s' }}
        />
        <Sparkles
          className="pointer-events-none absolute -top-3 left-1 h-3 w-3 text-sky-400 [animation:iz-sparkle_1.8s_ease-in-out_infinite]"
          style={{ animationDelay: '1.2s' }}
        />
      </div>

      <h3 className="mt-6 font-display text-2xl tracking-tight text-neutral-900">
        Inbox zero!
      </h3>
      <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-neutral-600">
        Nice work, {firstName}. Every open anomaly for{' '}
        <span className="text-neutral-900">{period?.label ?? 'this period'}</span>{' '}
        has been reviewed.
      </p>
      <p className="mt-1 text-xs text-neutral-400">
        New anomalies will appear here as transactions are scanned.
      </p>

      {/* Keyframes */}
      <style>{`
        @keyframes iz-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes iz-sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.4; }
          50% { transform: scale(1.4) rotate(12deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
