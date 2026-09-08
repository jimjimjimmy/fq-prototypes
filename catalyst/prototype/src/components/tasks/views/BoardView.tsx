import { motion } from 'motion/react';
import { Circle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import type { Task } from '@/types';
import { TaskCard } from '../TaskCard';

interface BoardViewProps {
  tasks: Task[];
  onSelectTask: (id: number) => void;
}

const columns = [
  { title: 'Not Started', status: 'Not Started' as const, icon: Circle, badgeBg: 'bg-status-not-started-bg', badgeText: 'text-status-not-started-text', columnBg: 'bg-[rgba(85,83,82,0.08)]' },
  { title: 'In Progress', status: 'In Progress' as const, icon: Clock, badgeBg: 'bg-status-in-progress-bg', badgeText: 'text-status-in-progress-text', columnBg: 'bg-[rgba(80,127,192,0.08)]' },
  { title: 'Ready for Review', status: 'Ready for Review' as const, icon: AlertCircle, badgeBg: 'bg-status-review-bg', badgeText: 'text-status-review-text', columnBg: 'bg-[rgba(115,65,138,0.08)]' },
  { title: 'Blocked', status: 'Blocked' as const, icon: AlertCircle, badgeBg: 'bg-status-blocked-bg', badgeText: 'text-status-blocked-text', columnBg: 'bg-[rgba(225,80,21,0.08)]' },
  { title: 'Complete', status: 'Complete' as const, icon: CheckCircle2, badgeBg: 'bg-status-complete-bg', badgeText: 'text-status-complete-text', columnBg: 'bg-[rgba(42,106,57,0.08)]' },
];

export function BoardView({ tasks, onSelectTask }: BoardViewProps) {
  return (
    <div className="h-full bg-white px-[24px] py-[24px]">
      <div className="flex gap-[16px] h-full overflow-x-auto scrollbar-hide">
        {columns.map((column, columnIndex) => {
          const columnTasks = tasks.filter(task => task.status === column.status);
          const Icon = column.icon;

          return (
            <motion.div
              key={column.status}
              className="flex-shrink-0 w-[300px] flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + (columnIndex * 0.08), ease: "easeOut" }}
            >
              <div className={`${column.columnBg} flex flex-col relative rounded-[12px] h-full overflow-hidden`}>
                <div className="px-[16px] py-[12px] border-b border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-[8px]">
                    <div className={`${column.badgeBg} ${column.badgeText} rounded-[6px] px-[8px] py-[4px] flex items-center gap-[4px]`}>
                      <Icon className="size-[14px]" strokeWidth={2} />
                      <p className="font-['Inter',sans-serif] font-semibold text-[12px]">{column.title}</p>
                    </div>
                    <span className="font-['Inter',sans-serif] font-medium text-text-tertiary text-[12px]">{columnTasks.length}</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide p-[12px]">
                  <div className="flex flex-col gap-[8px]">
                    {columnTasks.map((task, taskIndex) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onSelect={() => onSelectTask(task.id)}
                        animationDelay={0.2 + (columnIndex * 0.08) + (taskIndex * 0.03)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
