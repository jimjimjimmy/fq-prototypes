import { motion } from 'motion/react';
import type { Task } from '@/types';
import { isTaskOverdue } from '@/data/tasks';
import svgPathsPriority from '@/imports/svg-alk7jslkg5';

interface TaskCardProps {
  task: Task;
  onSelect: () => void;
  animationDelay?: number;
}

export function TaskCard({ task, onSelect, animationDelay = 0 }: TaskCardProps) {
  return (
    <motion.div
      className="bg-white border border-border-default rounded-[8px] p-[12px] hover:shadow-sm transition-all cursor-pointer"
      onClick={onSelect}
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay, ease: "easeOut" }}
    >
      <p className="font-['Inter',sans-serif] font-medium leading-[20px] text-text-primary text-[12px] mb-[8px]">{task.name}</p>

      <div className="flex items-center justify-between mb-[8px]">
        <p className="font-['Inter',sans-serif] font-medium text-text-secondary text-[12px]">{task.type}</p>
        <p className={`font-['Inter',sans-serif] font-medium text-[12px] ${isTaskOverdue(task.dueDate) && task.status !== 'Complete' ? 'text-text-overdue' : 'text-text-secondary'}`}>{task.dueDate}</p>
      </div>

      {task.tags.length > 0 && (
        <div className="flex gap-[4px] mb-[8px] flex-wrap">
          {task.tags.map((tag, index) => (
            <div key={index} className="bg-tag-bg border border-border-default rounded-[4px] px-[6px] py-[2px]">
              <p className="font-['Inter',sans-serif] font-medium text-tag-text text-[12px]">{tag}</p>
            </div>
          ))}
          {task.id === 15 && (
            <div className="bg-gradient-to-r from-[rgba(192,232,215,0.4)] to-[rgba(192,232,215,0.2)] flex gap-[6px] items-center px-[6px] py-[2px] rounded-[4px]">
              <div className="size-[13px] shrink-0">
                <svg className="size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                  <path d={svgPathsPriority.p2f8e6000} fill="var(--floqast-deep)" />
                </svg>
              </div>
              <p className="font-['Inter',sans-serif] font-medium text-floqast-deep text-[11px] leading-[16px]">Priority</p>
            </div>
          )}
        </div>
      )}

      {task.agentStatus && (
        <div className="mt-[8px] pt-[8px] border-t border-border-default">
          <p className="font-['Inter',sans-serif] font-medium text-text-secondary text-[12px]">{task.agentStatus}</p>
        </div>
      )}
    </motion.div>
  );
}
