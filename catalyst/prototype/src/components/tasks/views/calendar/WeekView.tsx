import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import type { Task } from '@/types';
import { isTaskOverdue, parseTaskDate, today, type CloseMilestone } from '@/data/tasks';
import { packTasksIntoLanes, isSameDay } from './calendar-utils';
import { TaskHoverCard } from './TaskHoverCard';
import { MilestoneMarker } from './MilestoneMarker';

const statusBarColors: Record<string, string> = {
  'Complete': 'bg-[#2a6a39]',
  'Not Started': 'bg-[#555352]',
  'In Progress': 'bg-[#507fc0]',
  'Ready for Review': 'bg-[#73418a]',
  'Blocked': 'bg-[#e15015]',
};

const LANE_HEIGHT = 36;

interface WeekViewProps {
  currentDate: Date;
  tasks: Task[];
  onSelectTask: (id: number) => void;
  milestones: CloseMilestone[];
}

export function WeekView({ currentDate, tasks, onSelectTask, milestones }: WeekViewProps) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const weekEnd = weekDays[6];
  const lanes = packTasksIntoLanes(tasks, startOfWeek, weekEnd);
  const maxLane = lanes.length > 0 ? Math.max(...lanes.map(l => l.lane)) + 1 : 0;

  const weekMilestones = milestones.filter(m => {
    const d = parseTaskDate(m.deadline);
    return d >= startOfWeek && d <= weekEnd;
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-[#e4e7ec] bg-[#fafafa] sticky top-0 z-20">
        {weekDays.map((date, index) => {
          const isToday = isSameDay(date, today);
          return (
            <div key={index} className="px-3 py-3 border-r border-[#e4e7ec] last:border-r-0 text-center">
              <p className="font-['Inter',sans-serif] font-semibold text-[#6b7280] text-[11px] mb-0.5">{dayNames[index]}</p>
              <p className={`font-['Inter',sans-serif] font-semibold text-[14px] ${
                isToday ? 'bg-[#00332a] text-white size-[28px] rounded-full flex items-center justify-center mx-auto' : 'text-[#101828]'
              }`}>{date.getDate()}</p>
            </div>
          );
        })}
      </div>

      {/* Gantt body */}
      <div className="flex-1 overflow-auto">
        <div className="relative grid grid-cols-7" style={{ minHeight: `${Math.max(maxLane * LANE_HEIGHT + 24, 200)}px` }}>
          {/* Column backgrounds */}
          {weekDays.map((date, i) => (
            <div
              key={i}
              className={`border-r border-[#e4e7ec] last:border-r-0 ${isSameDay(date, today) ? 'bg-[#f0fdf4]' : ''}`}
            />
          ))}

          {/* Milestone markers */}
          {weekMilestones.map(m => {
            const mDate = parseTaskDate(m.deadline);
            const dayIndex = weekDays.findIndex(d => isSameDay(d, mDate));
            if (dayIndex === -1) return null;
            return (
              <MilestoneMarker
                key={m.id}
                name={m.name.split(' ').slice(0, 2).join(' ')}
                color={m.color}
                style={{
                  left: `${(dayIndex / 7) * 100}%`,
                  width: `${100 / 7}%`,
                }}
              />
            );
          })}

          {/* Task bars */}
          {lanes.map(({ task, lane, startCol, endCol, clippedStart, clippedEnd }, index) => {
            const overdue = task.status !== 'Complete' && isTaskOverdue(task.dueDate);
            return (
              <TaskHoverCard key={task.id} task={task} onSelectTask={onSelectTask}>
                <motion.div
                  className={`absolute h-[28px] flex items-center px-2 text-white text-[11px] font-medium truncate cursor-pointer hover:brightness-110 transition-all shadow-sm ${statusBarColors[task.status]} ${
                    clippedStart ? 'rounded-l-none' : 'rounded-l-[4px]'
                  } ${clippedEnd ? 'rounded-r-none' : 'rounded-r-[4px]'}`}
                  style={{
                    top: `${lane * LANE_HEIGHT + 40}px`,
                    left: `${((startCol - 1) / 7) * 100 + 0.5}%`,
                    width: `${((endCol - startCol) / 7) * 100 - 1}%`,
                  }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  {overdue && <AlertTriangle className="size-3 text-red-200 mr-1 shrink-0" />}
                  <span className="truncate">{task.name}</span>
                </motion.div>
              </TaskHoverCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
