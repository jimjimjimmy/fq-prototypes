import { AnimatePresence, motion } from 'motion/react';
import svgPaths from '@/imports/svg-ni0ebo43wn';
import svgPathsBadge from '@/imports/svg-0u6xfxm5l1';
import type { InsightCard, TaskStatus } from '@/types';

interface InsightCarouselProps {
  card: InsightCard;
  taskStatus?: TaskStatus | null;
  onNext: () => void;
  onClick: () => void;
  onDismiss: (e: React.MouseEvent) => void;
  isAnimating: boolean;
  onNavigateToTask?: (taskId: number) => void;
}

const statusToAction: Record<TaskStatus, string> = {
  'Blocked': 'Needs Attention',
  'Not Started': 'Upcoming',
  'In Progress': 'In Progress',
  'Ready for Review': 'Ready for Review',
  'Complete': 'Complete',
};

export function InsightCarousel({
  card, taskStatus, onNext, onClick, onDismiss, isAnimating, onNavigateToTask,
}: InsightCarouselProps) {
  const subtitle = taskStatus ? statusToAction[taskStatus] : 'Ready for Review';
  return (
    <div className="relative w-full h-[275px] flex justify-center items-center">
      {/* Back stacked cards for depth */}
      <div className="absolute bg-[#a1b6af] h-[275px] rounded-[12px] top-[13px] w-[calc(100%-112px)] pointer-events-none">
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.4)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_8px_32px_0px_rgba(0,51,42,0.08)]" />
      </div>
      <div className="absolute bg-[#a1b6af] h-[267px] rounded-[12px] top-[13px] w-[calc(100%-48px)] pointer-events-none">
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_8px_32px_0px_rgba(0,51,42,0.1)]" />
      </div>

      {/* Main card with dark green gradient */}
      <div
        className="absolute h-[275px] rounded-[12px] top-0 w-full"
        style={{ backgroundImage: "linear-gradient(-0.188788deg, rgb(1, 53, 44) 0%, rgb(35, 117, 86) 107.56%)" }}
      >
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start p-px relative size-full">
            <div className="h-[273px] relative rounded-[18px] shrink-0 w-full">
              <div className="overflow-clip rounded-[inherit] size-full">
                <div className="content-stretch flex flex-col gap-[16px] items-start px-[32px] py-[28px] relative size-full">
                  {/* Top Right Badge - Agent attribution */}
                  {card.agentBadge && (
                    <div className="absolute top-[28px] right-[32px]">
                      <div className="bg-[rgba(218,255,223,0.15)] content-stretch flex gap-[5px] items-center px-[7px] py-[3px] relative rounded-[5px]">
                        <div aria-hidden="true" className="absolute border border-[rgba(218,255,223,0.3)] border-solid inset-0 pointer-events-none rounded-[5px]" />
                        <div className="relative shrink-0 w-[14px]">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center overflow-clip py-[2px] relative rounded-[inherit] w-full">
                            <div className="h-[9.333px] relative shrink-0 w-[11.667px]">
                              <div className="absolute inset-[-6.43%_-5.14%]">
                                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8667 10.5335">
                                  <g>
                                    <path d="M6.43333 2.93333V0.6H4.1" stroke="#C0E8D7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                    <path d={svgPathsBadge.p3eeed600} stroke="#C0E8D7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                    <path d="M0.6 6.4335H1.76667" stroke="#C0E8D7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                    <path d="M11.1 6.4335H12.2667" stroke="#C0E8D7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                    <path d="M8.1835 5.85V7.01667" stroke="#C0E8D7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                    <path d="M4.6835 5.85V7.01667" stroke="#C0E8D7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="font-['Inter',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#daffdf] text-[10px]">{card.agentBadge}</p>
                      </div>
                    </div>
                  )}

                  {/* Header Badge */}
                  <div className="content-stretch flex flex-col items-start relative shrink-0">
                    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-[139.125px]">
                      <div className="bg-[rgba(218,255,223,0.7)] relative rounded-[8px] shrink-0 size-[34px]">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative size-full">
                          <div className="relative shrink-0 size-[26px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
                              <path d={svgPaths.pc737900} fill="#01220F" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="relative shrink-0 w-[300px]">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start not-italic relative text-[11px] w-full">
                          <p className="font-['Inter',sans-serif] font-semibold leading-[18px] relative shrink-0 text-[#daffdf] tracking-[0.3px] uppercase">
                            Today's Top Priority
                          </p>
                          <p className="font-['Inter',sans-serif] font-medium leading-[16px] text-white">
                            {subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content with crossfade - clickable for card rotation */}
                  <div className="content-stretch flex flex-col gap-[17px] items-start relative shrink-0 flex-1 max-w-[550px] cursor-pointer" onClick={onClick}>
                    <div className="relative w-full">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                          key={card.title}
                          className="blur-[0px] content-stretch flex flex-col gap-[9px] items-start not-italic relative shrink-0"
                          initial={{ opacity: 0, filter: "blur(2px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, filter: "blur(1px)" }}
                          transition={{
                            opacity: { duration: 0.24, ease: [0.32, 0.72, 0, 1] },
                            filter: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
                          }}
                        >
                          <p className="font-['Inter',sans-serif] font-semibold leading-[26px] relative shrink-0 text-[15px] text-white">
                            {card.title}
                          </p>
                          <p className="font-['Inter',sans-serif] font-medium leading-[21px] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.8)] w-full max-w-[610px] whitespace-pre-wrap">
                            {card.body}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 mt-auto z-10">
                      <button
                        className="bg-[rgba(255,255,255,0.28)] content-stretch flex items-center justify-center h-[40px] px-[14px] relative rounded-[12px] shrink-0 hover:bg-[rgba(255,255,255,0.35)] transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (onNavigateToTask && card.taskId) onNavigateToTask(card.taskId);
                        }}
                      >
                        <p className="font-['Inter',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white">
                          {taskStatus === 'Blocked' ? 'View Details' : taskStatus === 'In Progress' ? 'Continue' : 'Review Now'}
                        </p>
                      </button>
                      <button
                        className="content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDismiss) onDismiss(e);
                        }}
                      >
                        <p className="font-['Inter',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-white invisible">
                          Dismiss
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.6)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_8px_32px_0px_rgba(0,51,42,0.12)]" />
      </div>
    </div>
  );
}
