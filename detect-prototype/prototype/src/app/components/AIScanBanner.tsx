import { useEffect, useRef } from 'react';
import { Sparkles, X } from 'lucide-react';

interface Props {
  show: boolean;
  count: number;
  onDismiss: () => void;
  onFilterAI: () => void;
}

/**
 * Banner that slides down between the app header and the main content
 * after the post-scan reveal completes. Tells the user how many anomalies
 * the AI uniquely caught during the initial scan (records flagged ONLY
 * by AI — not also caught by a configured rule).
 *
 * Animates via max-height + opacity so the layout reflows smoothly
 * rather than snapping when it appears or disappears.
 *
 * Auto-dismisses after 6 seconds. Includes a filter link that scopes
 * the inbox to AI-only flagged records.
 */
export function AIScanBanner({ show, count, onDismiss, onFilterAI }: Props) {
  // Keep a stable ref to onDismiss so the timer isn't reset on every
  // parent render (inline arrow functions create a new reference each time).
  const onDismissRef = useRef(onDismiss);
  useEffect(() => { onDismissRef.current = onDismiss; });

  // Auto-dismiss after 6 seconds once shown
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => onDismissRef.current(), 6000);
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <div
      className={`shrink-0 overflow-hidden transition-all duration-500 ease-out ${
        show ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="border-b border-purple-200/80 bg-gradient-to-r from-purple-50 via-fuchsia-50 to-purple-50">
        <div className="flex items-center justify-between gap-4 px-6 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-purple-700 ring-1 ring-purple-200">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <p className="truncate text-sm text-purple-950">
              AI detected{' '}
              <strong className="font-semibold">
                {count} {count === 1 ? 'transaction' : 'transactions'}
              </strong>{' '}
              during this scan that {count === 1 ? "wasn't" : "weren't"} caught by
              your rules.{' '}
              <button
                type="button"
                onClick={() => { onFilterAI(); onDismiss(); }}
                className="text-sm font-medium text-purple-950 underline underline-offset-2 decoration-purple-950/40 hover:decoration-purple-950"
              >
                View AI detected only
              </button>
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded p-1 text-purple-700 transition-colors hover:bg-white hover:text-purple-900"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
