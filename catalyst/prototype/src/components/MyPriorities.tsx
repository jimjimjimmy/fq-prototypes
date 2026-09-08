import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useTaskStore } from '@/runtime/TaskStore';
import { useNavigation } from '@/contexts/NavigationContext';
import { isTaskOverdue } from '@/data/tasks';
import { usePersonaTasks } from '@/hooks/use-persona-tasks';
import type { Task } from '@/types';
import svgPathsCloseAgent from '../imports/svg-0gmqjynf3e';

export function MyPriorities() {
  const { state } = useTaskStore();
  const { navigateToTask, navigateToKanban } = useNavigation();
  const personaTasks = usePersonaTasks(state.tasks);

  const { urgent, readyForReview, inProgress } = useMemo(() => {
    const incomplete = personaTasks.filter(t => t.status !== 'Complete');

    // Urgent: overdue or blocked
    const urgent = incomplete.filter(t =>
      t.status === 'Blocked' || (isTaskOverdue(t.dueDate) && t.status !== 'Not Started')
    ).sort((a, b) => {
      // Blocked first, then overdue sorted by due date
      if (a.status === 'Blocked' && b.status !== 'Blocked') return 1;
      if (b.status === 'Blocked' && a.status !== 'Blocked') return -1;
      return 0;
    });

    // Ready for Review (not already in urgent)
    const urgentIds = new Set(urgent.map(t => t.id));
    const readyForReview = incomplete.filter(t =>
      t.status === 'Ready for Review' && !urgentIds.has(t.id)
    );

    // In Progress (not already in urgent)
    const inProgress = incomplete.filter(t =>
      (t.status === 'In Progress' || t.status === 'Not Started') && !urgentIds.has(t.id)
    ).sort((a, b) => {
      // Due soonest first
      const aOverdue = isTaskOverdue(a.dueDate) ? -1 : 0;
      const bOverdue = isTaskOverdue(b.dueDate) ? -1 : 0;
      return aOverdue - bOverdue;
    });

    return { urgent, readyForReview, inProgress };
  }, [personaTasks]);

  const allDone = urgent.length === 0 && readyForReview.length === 0 && inProgress.length === 0;

  return (
    <div className="flex flex-col items-start relative rounded-[12px] size-full min-h-0">
      <div className="bg-[rgba(255,255,255,0.6)] flex flex-col items-start relative rounded-[12px] w-full h-full overflow-hidden">
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.7)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_4px_16px_0px_rgba(0,51,42,0.08)]" />

        {/* Header */}
        <div className="bg-[rgba(255,255,255,0.6)] flex flex-col isolate items-start relative shrink-0 w-full z-20 backdrop-blur-sm">
          <div className="relative shrink-0 w-full z-[2]">
            <div className="flex gap-[16px] items-start px-[24px] py-[16px] relative w-full">
              <div className="flex flex-[1_0_0] flex-col gap-[2px] h-[52px] items-start justify-center min-h-px min-w-px relative">
                <div className="flex gap-[8px] items-center relative shrink-0 w-full">
                  <p className="font-['Inter',sans-serif] font-semibold leading-[28px] text-[#101828] text-[15px]">Up Next</p>
                  <div className="bg-[rgba(0,81,51,0.1)] flex gap-[4px] items-center px-[7px] py-[3px] relative rounded-[5px]">
                    <div aria-hidden="true" className="absolute border border-[rgba(29,88,63,0.2)] border-solid inset-0 pointer-events-none rounded-[5px]" />
                    <div className="relative shrink-0 w-[14px]">
                      <div className="flex flex-col items-center justify-center overflow-clip py-[2px] relative w-full">
                        <div className="h-[9.333px] relative shrink-0 w-[11.667px]">
                          <div className="absolute inset-[-6.43%_-5.14%]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8667 10.5335">
                              <g>
                                <path d="M6.43333 2.93333V0.6H4.1" stroke="#1D583F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                <path d={svgPathsCloseAgent.p3eeed600} stroke="#1D583F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                <path d="M0.6 6.4335H1.76667" stroke="#1D583F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                <path d="M11.1 6.4335H12.2667" stroke="#1D583F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                <path d="M8.1835 5.85V7.01667" stroke="#1D583F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                <path d="M4.6835 5.85V7.01667" stroke="#1D583F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="font-['Inter',sans-serif] font-medium leading-[15px] text-[#1d583f] text-[11px]">Prepared by Close Agent</p>
                  </div>
                </div>
                <p className="font-['Inter',sans-serif] font-medium leading-[20px] text-[#475467] text-[12px] text-ellipsis w-full whitespace-nowrap overflow-hidden">Work organized for you based on urgency, dependencies, and close impact</p>
              </div>
              <button className="bg-[rgba(255,255,255,0.5)] flex h-[40px] items-center justify-center px-[14px] rounded-[12px] shrink-0 hover:bg-[rgba(255,255,255,0.7)] transition-colors" onClick={navigateToKanban}>
                <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.6)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)]" style={{ position: 'absolute' }} />
                <p className="font-['Inter',sans-serif] font-semibold leading-[20px] text-[#00332a] text-[13px] text-center relative">View All</p>
              </button>
            </div>
          </div>
          <div className="h-px w-full bg-[#e4e7ec]" />
        </div>

        {/* Content */}
        <div className="flex-1 w-full min-h-0 relative overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {allDone ? (
            <AllDoneState />
          ) : (
            <AnimatePresence mode="popLayout">
              {urgent.length > 0 && (
                <motion.div key="urgent" layout>
                  <SectionHeader label="Waiting On Me" />
                  {urgent.map(task => (
                    <PriorityRow key={task.id} task={task} onClick={() => navigateToTask(task.id)} variant="urgent" />
                  ))}
                </motion.div>
              )}
              {readyForReview.length > 0 && (
                <motion.div key="review" layout>
                  <SectionHeader label="Ready to Review" />
                  {readyForReview.map(task => (
                    <PriorityRow key={task.id} task={task} onClick={() => navigateToTask(task.id)} variant="ready" />
                  ))}
                </motion.div>
              )}
              {inProgress.length > 0 && (
                <motion.div key="progress" layout>
                  <SectionHeader label="In Progress" />
                  {inProgress.map(task => (
                    <PriorityRow key={task.id} task={task} onClick={() => navigateToTask(task.id)} variant="neutral" />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_100.48px_104.667px_0px_rgba(255,255,255,0.25)]" />
      </div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="bg-[rgba(245,245,245,1)] h-[40px] w-full sticky top-0 z-10 backdrop-blur-sm border-b border-[#e4e7ec] flex items-center px-[24px]">
      <p className="font-['Inter',sans-serif] font-semibold leading-[18px] text-[#00332a] text-[11px] tracking-[0.44px] uppercase">{label}</p>
    </div>
  );
}

function PriorityRow({ task, onClick, variant }: { task: Task; onClick: () => void; variant: 'urgent' | 'ready' | 'neutral' }) {
  const overdue = isTaskOverdue(task.dueDate) && task.status !== 'Complete';
  const isBlocked = task.status === 'Blocked';

  const contextMessage = (() => {
    if (isBlocked) return `Blocked: ${task.agentStatus || 'Awaiting resolution'}`;
    if (overdue) return 'Overdue — review recommended';
    if (variant === 'ready' && task.agentStatus) return `Ready: ${task.agentStatus}`;
    if (task.agentStatus) return task.agentStatus;
    return null;
  })();

  const contextColor = variant === 'urgent'
    ? 'text-[#860505] bg-[#fef2f2] border-[#fecaca]'
    : 'text-[#013a30] bg-[#f0fdf4] border-[#bbf7d0]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      className="relative w-full group hover:bg-[#fafafa] transition-colors cursor-pointer bg-white border-b border-[#e4e7ec]"
      onClick={onClick}
    >
      {variant === 'urgent' && (
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#780404]" />
      )}
      <div className="flex items-center w-full">
        <div className="flex-1 min-w-0 px-[24px] py-[12px]">
          <div className="flex gap-[8px] items-center mb-[6px]">
            <p className="font-['Inter',sans-serif] font-medium leading-[20px] text-[#101828] text-[13px] truncate">{task.name}</p>
            <div className="flex gap-[6px] items-center shrink-0">
              {task.comments && (
                <span className="font-['Inter',sans-serif] font-medium text-[#6b7280] text-[11px]">{task.comments} comments</span>
              )}
            </div>
          </div>
          {contextMessage && (
            <div className={`inline-flex gap-[6px] items-center px-[8px] py-[4px] rounded-[8px] border ${contextColor}`}>
              <p className="font-['Inter',sans-serif] font-medium leading-[16px] text-[11px] truncate">{contextMessage}</p>
            </div>
          )}
        </div>

        <div className="shrink-0 px-[16px] w-[120px]">
          {task.agentStatus && (
            <div className="bg-[#f9fafb] border border-[#e4e7ec] rounded-[6px] px-[6px] py-[2px] inline-block">
              <p className="font-['Inter',sans-serif] font-medium text-[#344054] text-[12px] text-center">{task.agentStatus}</p>
            </div>
          )}
        </div>

        <div className="shrink-0 px-[16px] w-[90px]">
          <p className={`font-['Inter',sans-serif] font-medium leading-[20px] text-[13px] ${overdue ? 'text-[#DC2626]' : 'text-[#475467]'}`}>{task.dueDate}</p>
        </div>
      </div>
    </motion.div>
  );
}

function AllDoneState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-[16px] px-[32px] py-[48px]">
      <div className="bg-[#e3f5e6] rounded-full size-[56px] flex items-center justify-center">
        <CheckCircle2 className="size-[28px] text-[#2a6a39]" strokeWidth={2} />
      </div>
      <div className="text-center">
        <p className="font-['Inter',sans-serif] font-semibold text-[15px] text-[#101828] mb-[4px]">All caught up!</p>
        <p className="font-['Inter',sans-serif] font-medium text-[13px] text-[#475467] max-w-[320px]">
          All prioritized tasks have been completed. New items will appear here as they're assigned or prepared by agents.
        </p>
      </div>
    </div>
  );
}
