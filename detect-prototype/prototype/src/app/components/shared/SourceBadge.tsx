import { Sparkles } from 'lucide-react';

/**
 * The compact source chip displayed on inbox cards and flag headers.
 * Rule flags are neutral; AI flags are subtly purple with a Sparkles icon
 * to drive home that the finding came from ML inference, not a static rule.
 */
interface Props {
  kind: 'rule' | 'ai';
  size?: 'sm' | 'md';
}

export function SourceBadge({ kind, size = 'md' }: Props) {
  const sizeStyles =
    size === 'sm' ? 'h-5 text-[10px] px-1.5 gap-1' : 'h-6 text-xs px-2 gap-1.5';

  if (kind === 'rule') {
    return (
      <span
        className={`inline-flex items-center rounded-md bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 font-medium uppercase tracking-wide ${sizeStyles}`}
      >
        Rule
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium uppercase tracking-wide text-purple-800 ring-1 ring-inset ring-purple-200 bg-gradient-to-r from-purple-50 to-fuchsia-50 ${sizeStyles}`}
    >
      <Sparkles className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      AI detected
    </span>
  );
}
