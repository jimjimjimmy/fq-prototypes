import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useTaskStore } from '@/runtime/TaskStore';
import { usePersona } from '@/contexts/PersonaContext';
import { MyPriorities } from '@/components/MyPriorities';
import { InsightCarousel } from './InsightCarousel';
import { MetricsGrid } from './MetricsGrid';
import { RecentReviewNotes } from './RecentReviewNotes';

export function Dashboard() {
  const { navigateToTask } = useNavigation();
  const { state } = useTaskStore();
  const { personaData } = usePersona();
  const [isAnimating, setIsAnimating] = useState(false);

  // Filter insight cards to only show those whose linked task is NOT complete
  const activeCards = useMemo(() => {
    return personaData.insights.filter(card => {
      if (!card.taskId) return true;
      const task = state.tasks.find(t => t.id === card.taskId);
      return !task || task.status !== 'Complete';
    });
  }, [state.tasks, personaData.insights]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Reset card index when persona changes or active cards shrink
  useEffect(() => {
    setCurrentCardIndex(0);
  }, [personaData.insights]);

  useEffect(() => {
    if (activeCards.length > 0 && currentCardIndex >= activeCards.length) {
      setCurrentCardIndex(0);
    }
  }, [activeCards.length, currentCardIndex]);

  const handleNextCard = useCallback(() => {
    if (isAnimating || activeCards.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % activeCards.length);
      setIsAnimating(false);
    }, 250);
  }, [isAnimating, activeCards.length]);

  const allInsightsDone = activeCards.length === 0;

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-b from-[#f8faf9] via-[#f0f5f3] via-50% to-[#e8f2ed]">
      <div className="w-full max-w-[1360px] mx-auto px-[34px] flex flex-col min-h-full">
        {/* Page Header */}
        <motion.div
          className="py-[32px] shrink-0"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        />

        {/* Top Section: Insight Card + KPI Stats */}
        <div className="pb-[32px] shrink-0">
          <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-[24px] items-start">
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              {allInsightsDone ? (
                <InsightAllDone />
              ) : (
                <InsightCarousel
                  card={activeCards[currentCardIndex]}
                  taskStatus={activeCards[currentCardIndex]?.taskId ? state.tasks.find(t => t.id === activeCards[currentCardIndex].taskId)?.status ?? null : null}
                  onNext={handleNextCard}
                  onClick={handleNextCard}
                  onDismiss={(e) => { e.stopPropagation(); handleNextCard(); }}
                  isAnimating={isAnimating}
                  onNavigateToTask={navigateToTask}
                />
              )}
            </motion.div>
            <div className="w-full">
              <MetricsGrid />
            </div>
          </div>
        </div>

        {/* Bottom Section: Tasks + Review Notes */}
        <motion.div
          className="pb-[32px] flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[6.4fr_3.6fr] gap-[24px]" style={{ minHeight: "450px" }}>
            <div className="min-w-0" style={{ height: "450px" }}>
              <MyPriorities />
            </div>
            <div className="min-w-0" style={{ height: "450px" }}>
              <RecentReviewNotes />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InsightAllDone() {
  return (
    <div
      className="relative w-full h-[275px] flex justify-center items-center rounded-[12px]"
      style={{ backgroundImage: "linear-gradient(-0.188788deg, rgb(1, 53, 44) 0%, rgb(35, 117, 86) 107.56%)" }}
    >
      <div className="flex flex-col items-center gap-[12px] text-center px-[32px]">
        <div className="bg-[rgba(218,255,223,0.2)] rounded-full size-[48px] flex items-center justify-center">
          <svg className="size-[24px]" fill="none" viewBox="0 0 24 24" stroke="#daffdf" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-['Inter',sans-serif] font-semibold text-[16px] text-white">All caught up</p>
        <p className="font-['Inter',sans-serif] font-medium text-[13px] text-[rgba(255,255,255,0.7)] max-w-[400px]">
          All prioritized items have been reviewed and signed off. New insights will appear as agents prepare work.
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.6)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_8px_32px_0px_rgba(0,51,42,0.12)]" />
    </div>
  );
}
