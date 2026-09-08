import type { ReactNode } from 'react';
import { AlertTriangle, User, Eye } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import type { Task } from '@/types';
import { isTaskOverdue, today } from '@/data/tasks';
import { getTaskDateRange } from './calendar-utils';

const statusColors: Record<string, string> = {
  'Complete': 'bg-[#e3f5e6] text-[#2a6a39]',
  'Not Started': 'bg-[#f2f1f0] text-[#555352]',
  'In Progress': 'bg-[#e3edf6] text-[#507fc0]',
  'Ready for Review': 'bg-[#f4eef9] text-[#73418a]',
  'Blocked': 'bg-[#fdebd7] text-[#e15015]',
};

interface TaskHoverCardProps {
  task: Task;
  onSelectTask: (id: number) => void;
  children: ReactNode;
}

export function TaskHoverCard({ task, onSelectTask, children }: TaskHoverCardProps) {
  const overdue = task.status !== 'Complete' && isTaskOverdue(task.dueDate);
  const daysOverdue = overdue
    ? Math.floor((today.getTime() - getTaskDateRange(task).end.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button onClick={() => onSelectTask(task.id)} className="w-full text-left cursor-pointer">
          {children}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[280px] p-3 z-50" side="top" align="start">
        <div className="space-y-2">
          <p className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828] leading-tight">{task.name}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`${statusColors[task.status]} text-[11px] font-semibold px-1.5 py-0.5 rounded`}>{task.status}</span>
            <span className="bg-[#f2f1f0] text-[#555352] text-[11px] font-medium px-1.5 py-0.5 rounded">{task.type}</span>
          </div>
          {overdue && (
            <div className="flex items-center gap-1 text-[#e15015]">
              <AlertTriangle className="size-3" />
              <span className="text-[11px] font-semibold">{daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue</span>
            </div>
          )}
          <div className="space-y-1 text-[11px] text-[#475467]">
            <div className="flex items-center gap-1.5">
              <User className="size-3 text-[#98a2b3]" />
              <span>{task.preparer}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="size-3 text-[#98a2b3]" />
              <span>{task.reviewer}</span>
            </div>
          </div>
          <p className="text-[10px] text-[#98a2b3] font-medium">Due {task.dueDate}</p>
          <p className="text-[10px] text-[#98a2b3] italic">Click to view details</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
