import { useState } from 'react';
import { BarChart3, GitBranch } from 'lucide-react';
import type { Task } from '@/types';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DependencyFlowView } from './DependencyFlowView';

interface TimelineViewProps {
  tasks: Task[];
  onSelectTask: (id: number) => void;
}

export function TimelineView({ tasks, onSelectTask }: TimelineViewProps) {
  const [mode, setMode] = useState<'timeline' | 'dependencies'>('timeline');

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Mode toggle */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#e4e7ec] bg-white shrink-0">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(v) => v && setMode(v as 'timeline' | 'dependencies')}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="timeline" className="flex items-center gap-1.5 text-[12px] px-3">
            <BarChart3 size={13} />
            Timeline
          </ToggleGroupItem>
          <ToggleGroupItem value="dependencies" className="flex items-center gap-1.5 text-[12px] px-3">
            <GitBranch size={13} />
            Dependencies
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Content */}
      {mode === 'dependencies' ? (
        <DependencyFlowView tasks={tasks} onSelectTask={onSelectTask} />
      ) : (
        <GanttTimeline tasks={tasks} onSelectTask={onSelectTask} />
      )}
    </div>
  );
}

/** The original Gantt-style timeline, extracted to its own sub-component */
function GanttTimeline({ tasks, onSelectTask }: { tasks: Task[]; onSelectTask: (id: number) => void }) {
  const startDate = new Date('2026-02-01');
  const endDate = new Date('2026-03-31');
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const weeks: string[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weeks.push(`${weekStart.getMonth() === 1 ? 'Feb' : 'Mar'} ${weekStart.getDate()}-${weekEnd.getDate()}`);
    currentDate.setDate(currentDate.getDate() + 7);
  }

  const getTaskBarStyle = (task: Task) => {
    if (!task.startDate) return { left: '0%', width: '10%' };
    const taskStart = new Date(`2026-${task.startDate}`);
    const taskEnd = new Date(`2026-${task.dueDate}`);
    const startOffset = Math.ceil((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    };
  };

  const statusColors = {
    'Complete': 'bg-[#e3f5e6] border-[#2a6a39]',
    'Not Started': 'bg-[#f2f1f0] border-[#555352]',
    'In Progress': 'bg-[#e3edf6] border-[#507fc0]',
    'Ready for Review': 'bg-[#f4eef9] border-[#73418a]',
    'Blocked': 'bg-[#fdebd7] border-[#e15015]',
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-[350px] border-r border-[#e4e7ec] flex flex-col shrink-0">
        <div className="bg-[rgba(245,245,245,0.6)] h-[48px] flex items-center px-[16px] border-b border-[#e4e7ec]">
          <p className="font-['Inter',sans-serif] font-semibold leading-[18px] text-[#00332a] text-[11px] tracking-[0.44px] uppercase">Tasks</p>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="h-[56px] flex items-center px-[16px] border-b border-[#e4e7ec] hover:bg-[#fafafa] transition-colors cursor-pointer"
              onClick={() => onSelectTask(task.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="font-['Inter',sans-serif] font-medium leading-[18px] text-[#101828] text-[12px] truncate">{task.name}</p>
                <p className="font-['Inter',sans-serif] font-medium leading-[16px] text-[#6b7280] text-[11px] mt-[2px]">{task.preparer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-[rgba(245,245,245,0.6)] h-[48px] flex border-b border-[#e4e7ec] overflow-x-auto scrollbar-hide">
          {weeks.map((week, index) => (
            <div key={index} className="flex items-center justify-center px-[12px] border-r border-[#e4e7ec] min-w-[100px] flex-1">
              <p className="font-['Inter',sans-serif] font-semibold text-[#00332a] text-[11px]">{week}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-auto scrollbar-hide">
          {tasks.map((task) => {
            const barStyle = getTaskBarStyle(task);
            const hasDependencies = task.dependencies && task.dependencies.length > 0;
            return (
              <div
                key={task.id}
                className="h-[56px] relative border-b border-[#e4e7ec] hover:bg-[#fafafa] transition-colors cursor-pointer"
                onClick={() => onSelectTask(task.id)}
              >
                {weeks.map((_, index) => (
                  <div key={index} className="absolute top-0 bottom-0 border-r border-[#f3f4f6]" style={{ left: `${(index / weeks.length) * 100}%` }} />
                ))}
                <div
                  className={`absolute top-[12px] h-[32px] rounded-[6px] border-2 flex items-center px-[8px] ${statusColors[task.status]}`}
                  style={barStyle}
                >
                  <p className="font-['Inter',sans-serif] font-medium text-[11px] text-gray-700 truncate">{task.status}</p>
                  {hasDependencies && <div className="ml-auto size-[16px] shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
