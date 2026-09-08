import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import svgPathsMetrics from '@/imports/svg-10emqfml8s';
import { ProgressBar } from '@/components/ProgressBar';
import { isTaskOverdue, today, parseTaskDate } from '@/data/tasks';
import { useNavigation } from '@/contexts/NavigationContext';
import { useTaskStore } from '@/runtime/TaskStore';
import { usePersonaTasks } from '@/hooks/use-persona-tasks';

export function MetricsGrid() {
  const { navigateToBlockedTasks, navigateToReadyForReviewTasks, navigateToLateTasks, navigateToDueTodayTasks } = useNavigation();
  const { state } = useTaskStore();
  const allTasks = usePersonaTasks(state.tasks);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const completedCount = allTasks.filter(t => t.status === 'Complete').length;
  const targetProgress = allTasks.length > 0 ? (completedCount / allTasks.length) * 100 : 0;
  const dueTodayTasks = allTasks.filter(t => {
    const due = parseTaskDate(t.dueDate);
    return due.getTime() === today.getTime() && t.status !== 'Complete';
  });
  const targetCount = dueTodayTasks.length;

  // Derive late tasks data
  const lateTasks = allTasks.filter(t => isTaskOverdue(t.dueDate) && t.status !== 'Complete');
  const lateTaskCount = lateTasks.length;
  const latestLateTask = lateTasks.length > 0
    ? lateTasks.reduce((latest, t) => {
        const dateA = parseTaskDate(latest.dueDate);
        const dateB = parseTaskDate(t.dueDate);
        return dateB > dateA ? t : latest;
      })
    : null;
  const lateTaskDescription = latestLateTask ? latestLateTask.name : 'No late tasks';

  // Derive blocked tasks data
  const blockedTasks = allTasks.filter(t => t.status === 'Blocked');
  const blockedCount = blockedTasks.length;
  const blockedDescription = blockedTasks[0]?.name ?? 'No blocked tasks';

  // Derive ready for review tasks data
  const readyForReviewTasks = allTasks.filter(t => t.status === 'Ready for Review');
  const readyForReviewCount = readyForReviewTasks.length;
  const readyForReviewDescription = readyForReviewTasks[0]?.name ?? 'No tasks ready for review';

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setProgress(targetProgress);
      setCount(targetCount);
      return;
    }

    const progressDuration = 600;
    const progressStart = Date.now();
    const animateProgress = () => {
      const elapsed = Date.now() - progressStart;
      const percent = Math.min(elapsed / progressDuration, 1);
      const eased = 1 - Math.pow(1 - percent, 3);
      setProgress(eased * targetProgress);
      if (percent < 1) requestAnimationFrame(animateProgress);
    };

    const countDuration = 500;
    const countStart = Date.now();
    const animateCount = () => {
      const elapsed = Date.now() - countStart;
      const percent = Math.min(elapsed / countDuration, 1);
      const eased = 1 - Math.pow(1 - percent, 3);
      setCount(Math.round(eased * targetCount));
      if (percent < 1) requestAnimationFrame(animateCount);
    };

    const progressTimer = setTimeout(() => requestAnimationFrame(animateProgress), 350);
    const countTimer = setTimeout(() => requestAnimationFrame(animateCount), 350);
    return () => { clearTimeout(progressTimer); clearTimeout(countTimer); };
  }, []);

  return (
    <div className="gap-[18px] grid grid-cols-2 grid-rows-2 w-full h-[275px]">
      <MetricCard delay={0.35} onClick={navigateToLateTasks}
        title="Late Tasks" value={lateTaskCount} description={lateTaskDescription}
        iconPath={svgPathsMetrics.p2d618580} iconBg="rgba(142,6,6,0.08)" iconStroke="#C00000" clipId="clip0_late" />

      <MetricCard delay={0.4} onClick={navigateToBlockedTasks}
        title="Blocked" value={blockedCount} description={blockedDescription}
        iconPath={svgPathsMetrics.p677c0f0} iconBg="rgba(177,94,7,0.08)" iconStroke="#CC7C14" clipId="clip0_blocked" />

      <motion.div
        className="bg-[rgba(255,255,255,0.6)] relative rounded-[12px] cursor-pointer hover:bg-[rgba(255,255,255,0.8)] transition-colors"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
        onClick={navigateToDueTodayTasks}
      >
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.7)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_4px_16px_0px_rgba(0,51,42,0.08)]" />
        <div className="content-stretch flex flex-col gap-[4px] items-start p-[24px] relative size-full">
          <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full min-w-0">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-0 not-italic relative whitespace-pre-wrap">
              <p className="font-['Inter',sans-serif] font-medium leading-[20px] relative text-[#475467] text-[14px] truncate w-full">Due Today</p>
              <p className="font-['Inter',sans-serif] font-semibold leading-[32px] relative shrink-0 text-[#101828] text-[24px]">{count}</p>
            </div>
            <div className="bg-[rgba(4,120,87,0.08)] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[33px]">
              <div className="relative shrink-0 size-[18px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                  <path d={svgPathsMetrics.p3f25ed80} stroke="#02533F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <div className="h-[23px] w-full">
            <ProgressBar targetProgress={targetProgress} remainingCount={allTasks.length - completedCount} />
          </div>
        </div>
      </motion.div>

      <MetricCard delay={0.5} onClick={navigateToReadyForReviewTasks}
        title="Ready to Review" value={readyForReviewCount} description={readyForReviewDescription}
        iconPath={svgPathsMetrics.p26976b40} iconBg="rgba(6,51,142,0.08)" iconStroke="#0041A1" />
    </div>
  );
}

interface MetricCardProps {
  delay: number;
  onClick: () => void;
  title: string;
  value: number;
  description: string;
  iconPath: string;
  iconBg: string;
  iconStroke: string;
  clipId?: string;
}

function MetricCard({ delay, onClick, title, value, description, iconPath, iconBg, iconStroke, clipId }: MetricCardProps) {
  return (
    <motion.div
      className="bg-[rgba(255,255,255,0.6)] relative rounded-[12px] cursor-pointer hover:bg-[rgba(255,255,255,0.8)] transition-colors"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      onClick={onClick}
    >
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.7)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_4px_16px_0px_rgba(0,51,42,0.08)]" />
      <div className="content-stretch flex flex-col items-start justify-center p-[24px] relative size-full">
        <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full min-w-0">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-0 not-italic relative whitespace-pre-wrap">
            <p className="font-['Inter',sans-serif] font-medium leading-[20px] relative text-[#475467] text-[14px] truncate w-full">{title}</p>
            <p className="font-['Inter',sans-serif] font-semibold leading-[32px] relative shrink-0 text-[#101828] text-[24px]">{value}</p>
            <p className="font-['Inter',sans-serif] font-medium leading-[18px] relative text-[#475467] text-[12px] w-full line-clamp-2">{description}</p>
          </div>
          <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[33px]" style={{ backgroundColor: iconBg }}>
            <div className="relative shrink-0 size-[18px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                {clipId ? (
                  <>
                    <g clipPath={`url(#${clipId})`}>
                      <path d={iconPath} stroke={iconStroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </g>
                    <defs>
                      <clipPath id={clipId}>
                        <rect fill="white" height="18" width="18" />
                      </clipPath>
                    </defs>
                  </>
                ) : (
                  <path d={iconPath} stroke={iconStroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
