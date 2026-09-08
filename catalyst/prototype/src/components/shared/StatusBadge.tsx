import type { TaskStatus } from '@/types';

const statusStyles: Record<TaskStatus, { bg: string; text: string; border: string }> = {
  'Complete': { bg: 'bg-[#e3f5e6]', text: 'text-[#2a6a39]', border: 'border-[#2a6a39]' },
  'Not Started': { bg: 'bg-[#f2f1f0]', text: 'text-[#555352]', border: 'border-[#555352]' },
  'In Progress': { bg: 'bg-[#e3edf6]', text: 'text-[#507fc0]', border: 'border-[#507fc0]' },
  'Ready for Review': { bg: 'bg-[#f4eef9]', text: 'text-[#73418a]', border: 'border-[#73418a]' },
  'Blocked': { bg: 'bg-[#fdebd7]', text: 'text-[#e15015]', border: 'border-[#e15015]' },
};

const columnBgStyles: Record<TaskStatus, string> = {
  'Complete': 'bg-[rgba(42,106,57,0.08)]',
  'Not Started': 'bg-[rgba(85,83,82,0.08)]',
  'In Progress': 'bg-[rgba(80,127,192,0.08)]',
  'Ready for Review': 'bg-[rgba(115,65,138,0.08)]',
  'Blocked': 'bg-[rgba(225,80,21,0.08)]',
};

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const style = statusStyles[status];
  return (
    <span className={`${style.bg} ${style.text} px-[8px] py-[2px] rounded-full text-[12px] font-medium whitespace-nowrap ${className}`}>
      {status}
    </span>
  );
}

export function getStatusStyles(status: TaskStatus) {
  return statusStyles[status];
}

export function getColumnBg(status: TaskStatus) {
  return columnBgStyles[status];
}
