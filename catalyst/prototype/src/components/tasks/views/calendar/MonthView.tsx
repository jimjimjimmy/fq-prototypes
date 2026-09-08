import type { Task } from '@/types';
import { isTaskOverdue, parseTaskDate, today, type CloseMilestone } from '@/data/tasks';
import { getWeekRows, packTasksIntoLanes, isSameDay } from './calendar-utils';
import { TaskHoverCard } from './TaskHoverCard';
import { MilestoneMarker } from './MilestoneMarker';

const statusBarColors: Record<string, string> = {
  'Complete': 'bg-[#2a6a39]',
  'Not Started': 'bg-[#555352]',
  'In Progress': 'bg-[#507fc0]',
  'Ready for Review': 'bg-[#73418a]',
  'Blocked': 'bg-[#e15015]',
};

interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
  onSelectTask: (id: number) => void;
  milestones: CloseMilestone[];
}

const MAX_VISIBLE_LANES = 4;
const LANE_HEIGHT = 20;
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthView({ currentDate, tasks, onSelectTask, milestones }: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const weekRows = getWeekRows(year, month);

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b border-[#e4e7ec] bg-[#fafafa]">
        {weekDays.map((day) => (
          <div key={day} className="px-3 py-2.5 border-r border-[#e4e7ec] last:border-r-0">
            <p className="font-['Inter',sans-serif] font-semibold text-[#6b7280] text-[11px] tracking-[0.5px] uppercase">{day}</p>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        {weekRows.map((week, weekIndex) => {
          const weekStart = week[0];
          const weekEnd = week[6];
          const lanes = packTasksIntoLanes(tasks, weekStart, weekEnd);
          const visibleLanes = lanes.filter(l => l.lane < MAX_VISIBLE_LANES);
          const overflowCount = lanes.length - visibleLanes.length;
          const maxLane = Math.min(
            lanes.length > 0 ? Math.max(...lanes.map(l => l.lane)) + 1 : 0,
            MAX_VISIBLE_LANES,
          );

          // Find milestones in this week
          const weekMilestones = milestones.filter(m => {
            const d = parseTaskDate(m.deadline);
            return d >= weekStart && d <= weekEnd;
          });

          return (
            <div key={weekIndex} className="border-b border-[#e4e7ec] flex-1 min-h-[100px]">
              <div className="grid grid-cols-7 relative">
                {/* Day number headers */}
                {week.map((date, dayIndex) => {
                  const isCurrentMonth = date.getMonth() === month;
                  const isToday = isSameDay(date, today);
                  return (
                    <div
                      key={dayIndex}
                      className={`px-2 pt-1.5 pb-0.5 border-r border-[#e4e7ec] last:border-r-0 ${!isCurrentMonth ? 'bg-[#f9fafb]' : ''}`}
                    >
                      <p className={`font-['Inter',sans-serif] font-semibold text-[12px] w-fit ${
                        isToday ? 'bg-[#00332a] text-white size-[22px] rounded-full flex items-center justify-center text-[11px]' :
                        isCurrentMonth ? 'text-[#101828]' : 'text-[#c0c5cc]'
                      }`}>
                        {date.getDate()}
                      </p>
                    </div>
                  );
                })}

                {/* Task bars layer */}
                <div
                  className="col-span-7 grid grid-cols-7 relative"
                  style={{ minHeight: `${maxLane * LANE_HEIGHT + (overflowCount > 0 ? 16 : 4)}px` }}
                >
                  {/* Background column dividers */}
                  {week.map((date, dayIndex) => (
                    <div
                      key={`bg-${dayIndex}`}
                      className={`border-r border-[#e4e7ec] last:border-r-0 ${date.getMonth() !== month ? 'bg-[#f9fafb]' : ''}`}
                    />
                  ))}

                  {/* Milestone markers */}
                  {weekMilestones.map(m => {
                    const mDate = parseTaskDate(m.deadline);
                    const dayIndex = week.findIndex(d => isSameDay(d, mDate));
                    if (dayIndex === -1) return null;
                    const hasDrift = tasks.some(t => {
                      const dueDate = parseTaskDate(t.dueDate);
                      return isSameDay(dueDate, mDate) && t.status !== 'Complete' && isTaskOverdue(t.dueDate);
                    });
                    return (
                      <MilestoneMarker
                        key={m.id}
                        name={`P${m.phase}`}
                        color={m.color}
                        isDrift={hasDrift}
                        style={{
                          left: `${(dayIndex / 7) * 100}%`,
                          width: `${100 / 7}%`,
                        }}
                      />
                    );
                  })}

                  {/* Task bars */}
                  {visibleLanes.map(({ task, lane, startCol, endCol, clippedStart, clippedEnd }) => {
                    const overdue = task.status !== 'Complete' && isTaskOverdue(task.dueDate);
                    return (
                      <TaskHoverCard key={task.id} task={task} onSelectTask={onSelectTask}>
                        <div
                          className={`absolute h-[16px] flex items-center px-1.5 text-white text-[10px] font-medium truncate cursor-pointer hover:brightness-110 transition-all ${statusBarColors[task.status]} ${
                            clippedStart ? 'rounded-l-none' : 'rounded-l-[3px]'
                          } ${clippedEnd ? 'rounded-r-none' : 'rounded-r-[3px]'}`}
                          style={{
                            top: `${lane * LANE_HEIGHT + 2}px`,
                            left: `${((startCol - 1) / 7) * 100}%`,
                            width: `${((endCol - startCol) / 7) * 100}%`,
                            paddingLeft: clippedStart ? '2px' : undefined,
                          }}
                        >
                          {overdue && <span className="inline-block size-1.5 rounded-full bg-red-300 mr-1 shrink-0" />}
                          <span className="truncate">{task.name}</span>
                        </div>
                      </TaskHoverCard>
                    );
                  })}

                  {/* Overflow indicator */}
                  {overflowCount > 0 && (
                    <div
                      className="absolute left-2 text-[10px] font-medium text-[#6b7280]"
                      style={{ top: `${MAX_VISIBLE_LANES * LANE_HEIGHT + 2}px` }}
                    >
                      +{overflowCount} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
