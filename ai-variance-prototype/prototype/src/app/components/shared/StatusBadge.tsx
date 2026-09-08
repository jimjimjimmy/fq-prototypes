import type { Status } from '../../../data/variances';

const CONFIG: Record<Status, { label: string; className: string }> = {
  'not-started':      { label: 'Not Started',      className: 'bg-neutral-100 text-neutral-500' },
  'in-progress':      { label: 'In Progress',       className: 'bg-amber-100 text-amber-800' },
  'ready-for-review': { label: 'Ready for Review',  className: 'bg-blue-100 text-blue-700' },
  'signed-off':       { label: 'Signed Off',        className: 'bg-[#014a3d] text-white' },
};

interface Props {
  status: Status;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const { label, className } = CONFIG[status];
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';
  return (
    <span className={`inline-flex items-center rounded font-semibold uppercase tracking-wide leading-none font-mono ${sizeClass} ${className}`}>
      {label}
    </span>
  );
}
