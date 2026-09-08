import { Check } from 'lucide-react';
import type { WorkflowStage } from '@/types';

interface WorkflowProgressTrackerProps {
  stages: WorkflowStage[];
}

export function WorkflowProgressTracker({ stages }: WorkflowProgressTrackerProps) {
  const currentIndex = stages.findIndex(s => s.status === 'current');
  const completedCount = stages.filter(s => s.status === 'complete').length;
  const activeIndex = currentIndex !== -1 ? currentIndex : completedCount - 1;
  const progressPercent = stages.length > 1 ? (activeIndex / (stages.length - 1)) * 100 : 0;

  return (
    <div className="bg-white rounded-[12px] border border-white/60 px-[28px] py-[24px] shadow-[0px_2px_8px_rgba(0,51,42,0.04)] bg-[#ffffff99]">
      <div className="relative">
        <div className="absolute top-[8px] left-0 right-0 h-[2px] bg-[#e5e7eb]" />
        <div
          className="absolute top-[8px] left-0 h-[2px] bg-[#02533F] transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="relative flex">
          {stages.map((stage) => {
            const isComplete = stage.status === 'complete';
            const isCurrent = stage.status === 'current';

            return (
              <div
                key={stage.id}
                className="flex flex-col items-start gap-[10px]"
                style={{ width: `${100 / stages.length}%` }}
              >
                <div className="relative">
                  <div
                    className={`w-[16px] h-[16px] rounded-full flex items-center justify-center transition-all duration-400 ease-out ${
                      isComplete
                        ? 'bg-[#02533F]'
                        : isCurrent
                        ? 'bg-white border-[2.5px] border-[#02533F]'
                        : 'bg-white border-[2px] border-[#d1d5db]'
                    }`}
                  >
                    {isComplete && <Check className="w-[9px] h-[9px] text-white stroke-[2.5]" />}
                    {isCurrent && <div className="w-[5px] h-[5px] rounded-full bg-[#02533F]" />}
                  </div>
                </div>

                <div className="flex flex-col gap-[3px] max-w-[140px]">
                  <p className={`font-['Inter',sans-serif] font-semibold text-[11.5px] leading-[15px] transition-colors duration-300 ${
                    isComplete || isCurrent ? 'text-[#101828]' : 'text-[#9ca3af]'
                  }`}>
                    {stage.label}
                  </p>
                  {stage.agent && (
                    <p className={`font-['Inter',sans-serif] font-medium text-[10px] leading-[13px] transition-colors duration-300 ${
                      isComplete ? 'text-[#02533F]' : isCurrent ? 'text-[#101828]' : 'text-[#cbd5e1]'
                    }`}>
                      {stage.agent}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
