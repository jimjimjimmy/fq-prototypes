import type { Task } from '@/types';
import { isTaskOverdue } from '@/data/tasks';
import svgPathsIcons from '@/imports/svg-810619rqb8';
import svgPathsBook from '@/imports/svg-it1mcd9mgh';
import svgPathsPriority from '@/imports/svg-alk7jslkg5';

const statusStyles: Record<Task['status'], string> = {
  'Complete': 'bg-status-complete-bg text-status-complete-text',
  'Not Started': 'bg-status-not-started-bg text-status-not-started-text',
  'In Progress': 'bg-status-in-progress-bg text-status-in-progress-text',
  'Ready for Review': 'bg-status-review-bg text-status-review-text',
  'Blocked': 'bg-status-blocked-bg text-status-blocked-text',
};

interface TaskRowProps {
  task: Task;
  onSelect: () => void;
}

export function TaskRow({ task, onSelect }: TaskRowProps) {
  return (
    <div
      className="flex h-[64px] items-center w-full border-b border-border-default hover:bg-[#fafafa] transition-colors cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex h-full items-center px-[20px] py-[12px] flex-[3] min-w-0">
        <div className="flex items-center gap-[8px] flex-1 min-w-0">
          <p className="font-['Inter',sans-serif] font-medium leading-[20px] text-text-primary text-[12px] truncate">{task.name}</p>
          <div className="flex gap-[6px] items-center shrink-0">
            {task.attachments && (
              <div className="flex items-center gap-[3px]">
                <div className="relative shrink-0 size-[13.986px]">
                  <svg className="size-full" fill="none" viewBox="0 0 12.8333 6.41667" style={{ transform: 'rotate(90deg)' }}>
                    <path d={svgPathsIcons.pb89bd00} fill="var(--text-tertiary)" />
                  </svg>
                </div>
                <p className="font-['Inter',sans-serif] font-medium leading-[18px] text-text-tertiary text-[11px]">{task.attachments}</p>
              </div>
            )}
            {task.comments && (
              <div className="flex items-center gap-[3px]">
                <div className="overflow-clip relative shrink-0 size-[14px]">
                  <div className="absolute inset-[8.33%]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
                      <path d={svgPathsIcons.p239a2a80} fill="var(--text-tertiary)" />
                    </svg>
                  </div>
                </div>
                <p className="font-['Inter',sans-serif] font-medium leading-[18px] text-text-tertiary text-[11px]">{task.comments}</p>
              </div>
            )}
            {task.journals && (
              <div className="flex items-center gap-[3px]">
                <div className="relative size-[13.972px]">
                  <div className="absolute inset-[8.33%_16.67%]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.33333 9.16667">
                      <path d={svgPathsBook.p3b397c80} fill="var(--text-tertiary)" />
                    </svg>
                  </div>
                </div>
                <p className="font-['Inter',sans-serif] font-medium leading-[18px] text-text-tertiary text-[11px]">{task.journals}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full items-start justify-center px-[12px] w-[100px]">
        <p className="font-['Inter',sans-serif] font-medium leading-[20px] text-text-secondary text-[12px] truncate">{task.type}</p>
      </div>

      <div className="flex flex-col h-full items-start justify-center px-[12px] flex-[1.2]">
        <div className={`flex items-center justify-center px-[10px] py-[4px] rounded-[6px] ${statusStyles[task.status]}`}>
          <p className="font-['Inter',sans-serif] font-medium leading-[18px] text-[12px] truncate">{task.status}</p>
        </div>
      </div>

      <div className="flex flex-col h-full items-start justify-center px-[12px] w-[80px]">
        <p className={`font-['Inter',sans-serif] font-medium leading-[20px] text-[12px] ${isTaskOverdue(task.dueDate) && task.status !== 'Complete' ? 'text-text-overdue' : 'text-text-secondary'}`}>{task.dueDate}</p>
      </div>

      <div className="flex flex-col h-full items-start justify-center px-[12px] flex-1 min-w-0">
        <p className="font-['Inter',sans-serif] font-medium leading-[20px] text-text-secondary text-[12px] truncate">{task.preparer}</p>
      </div>

      <div className="flex flex-col h-full items-start justify-center px-[12px] flex-1 min-w-0">
        <p className="font-['Inter',sans-serif] font-medium leading-[20px] text-text-secondary text-[12px] truncate">{task.reviewer}</p>
      </div>

      <div className="flex flex-col h-full items-start justify-center px-[12px] flex-1 min-w-0">
        <div className="flex gap-[4px] items-start flex-wrap">
          {task.tags.map((tag, index) => (
            <div key={index} className="bg-tag-bg border border-border-default rounded-[6px] px-[6px] py-[2px]">
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
      </div>

      <div className="flex flex-col h-full items-start justify-center px-[12px] flex-[1.2] min-w-0">
        {task.agentStatus && (
          <div className="bg-tag-bg border border-border-default rounded-[6px] px-[6px] py-[2px]">
            <p className="font-['Inter',sans-serif] font-medium text-tag-text text-[12px] truncate">{task.agentStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
}
