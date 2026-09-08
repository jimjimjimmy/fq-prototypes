import { motion } from 'motion/react';
import { AlertTriangle, User, Eye, Bot, CalendarX } from 'lucide-react';
import type { Task } from '@/types';
import { isTaskOverdue, parseTaskDate, today, type CloseMilestone } from '@/data/tasks';
import { getTaskDateRange, isDateInRange, isSameDay } from './calendar-utils';

const statusColors: Record<string, { bg: string; text: string }> = {
  'Complete': { bg: 'bg-[#e3f5e6]', text: 'text-[#2a6a39]' },
  'Not Started': { bg: 'bg-[#f2f1f0]', text: 'text-[#555352]' },
  'In Progress': { bg: 'bg-[#e3edf6]', text: 'text-[#507fc0]' },
  'Ready for Review': { bg: 'bg-[#f4eef9]', text: 'text-[#73418a]' },
  'Blocked': { bg: 'bg-[#fdebd7]', text: 'text-[#e15015]' },
};

const statusBorderColors: Record<string, string> = {
  'Complete': 'border-l-[#2a6a39]',
  'Not Started': 'border-l-[#555352]',
  'In Progress': 'border-l-[#507fc0]',
  'Ready for Review': 'border-l-[#73418a]',
  'Blocked': 'border-l-[#e15015]',
};

interface DayViewProps {
  currentDate: Date;
  tasks: Task[];
  onSelectTask: (id: number) => void;
  milestones: CloseMilestone[];
}

function TaskCard({ task, onSelectTask, index, muted = false }: { task: Task; onSelectTask: (id: number) => void; index: number; muted?: boolean }) {
  const overdue = task.status !== 'Complete' && isTaskOverdue(task.dueDate);
  const sc = statusColors[task.status];

  return (
    <motion.button
      onClick={() => onSelectTask(task.id)}
      className={`w-full text-left p-3 rounded-lg border border-[#e4e7ec] bg-white hover:shadow-md transition-shadow border-l-[4px] ${statusBorderColors[task.status]} ${muted ? 'opacity-75' : ''}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828] leading-tight">{task.name}</p>
        {overdue && (
          <div className="flex items-center gap-1 text-[#e15015] shrink-0">
            <AlertTriangle className="size-3.5" />
            <span className="text-[11px] font-semibold">
              {Math.floor((today.getTime() - getTaskDateRange(task).end.getTime()) / (1000 * 60 * 60 * 24))}d overdue
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        <span className={`${sc.bg} ${sc.text} text-[11px] font-semibold px-1.5 py-0.5 rounded`}>{task.status}</span>
        <span className="bg-[#f2f1f0] text-[#555352] text-[11px] font-medium px-1.5 py-0.5 rounded">{task.type}</span>
        {task.tags?.slice(0, 2).map(tag => (
          <span key={tag} className="bg-[#f0f9ff] text-[#0369a1] text-[10px] font-medium px-1.5 py-0.5 rounded">{tag}</span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-[11px] text-[#475467]">
        <span className="flex items-center gap-1"><User className="size-3 text-[#98a2b3]" />{task.preparer}</span>
        <span className="flex items-center gap-1"><Eye className="size-3 text-[#98a2b3]" />{task.reviewer}</span>
        {task.agentStatus && (
          <span className="flex items-center gap-1"><Bot className="size-3 text-[#98a2b3]" />{task.agentStatus}</span>
        )}
      </div>
    </motion.button>
  );
}

export function DayView({ currentDate, tasks, onSelectTask, milestones }: DayViewProps) {
  const dueTodayTasks = tasks.filter(task => {
    const { end } = getTaskDateRange(task);
    return isSameDay(end, currentDate);
  });

  const activeTodayTasks = tasks.filter(task => {
    const { start, end } = getTaskDateRange(task);
    return isDateInRange(currentDate, start, end) && !isSameDay(end, currentDate);
  });

  const dayMilestone = milestones.find(m => isSameDay(parseTaskDate(m.deadline), currentDate));
  const isEmpty = dueTodayTasks.length === 0 && activeTodayTasks.length === 0;

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Milestone banner */}
      {dayMilestone && (
        <motion.div
          className="mx-6 mt-4 rounded-lg p-3 flex items-center gap-3"
          style={{ backgroundColor: `${dayMilestone.color}15`, borderLeft: `4px solid ${dayMilestone.color}` }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="size-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold" style={{ backgroundColor: dayMilestone.color }}>
            P{dayMilestone.phase}
          </div>
          <div>
            <p className="font-['Inter',sans-serif] font-semibold text-[13px]" style={{ color: dayMilestone.color }}>{dayMilestone.name}</p>
            <p className="font-['Inter',sans-serif] text-[11px] text-[#475467]">Phase {dayMilestone.phase} deadline</p>
          </div>
        </motion.div>
      )}

      {/* Due Today section */}
      {dueTodayTasks.length > 0 && (
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-2 rounded-full bg-[#e15015]" />
            <p className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828]">Due Today</p>
            <span className="font-['Inter',sans-serif] text-[12px] text-[#6b7280]">({dueTodayTasks.length})</span>
          </div>
          <div className="space-y-2">
            {dueTodayTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} onSelectTask={onSelectTask} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Active Today section */}
      {activeTodayTasks.length > 0 && (
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-2 rounded-full bg-[#507fc0]" />
            <p className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828]">Active Today</p>
            <span className="font-['Inter',sans-serif] text-[12px] text-[#6b7280]">({activeTodayTasks.length})</span>
          </div>
          <div className="space-y-2">
            {activeTodayTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} onSelectTask={onSelectTask} index={i + dueTodayTasks.length} muted />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <CalendarX className="size-10 text-[#c0c5cc] mx-auto mb-3" />
            <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#475467]">No tasks scheduled</p>
            <p className="font-['Inter',sans-serif] text-[12px] text-[#98a2b3] mt-1">No tasks are due or active on this day</p>
          </div>
        </div>
      )}

      <div className="h-6" />
    </div>
  );
}
