import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { FlagFeedback } from '../../../data/types';

interface Props {
  feedback?: FlagFeedback;
  onUp: () => void;
  onDown: () => void;
  onClear: () => void;
}

/**
 * Training-signal control next to AI-flagged items.
 * Icon-only — once clicked, the chosen direction stays highlighted so
 * the reviewer can see they've already voted on this flag.
 */
export function ThumbsControl({ feedback, onUp, onDown, onClear }: Props) {
  const up = feedback?.thumbs === 'up';
  const down = feedback?.thumbs === 'down';

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={up ? onClear : onUp}
        aria-label={up ? 'Clear feedback' : 'Mark as real anomaly'}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
          up
            ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
            : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600'
        }`}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={down ? onClear : onDown}
        aria-label={down ? 'Clear feedback' : 'Mark as false positive'}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
          down
            ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200'
            : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600'
        }`}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
