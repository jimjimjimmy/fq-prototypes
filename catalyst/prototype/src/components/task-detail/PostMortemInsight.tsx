import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import type { AutomationInsight } from '@/types';

interface PostMortemInsightProps {
  insight: AutomationInsight;
}

export function PostMortemInsight({ insight }: PostMortemInsightProps) {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-[12px] border border-[#bbf7d0] p-[28px] relative overflow-hidden shadow-[0px_4px_16px_rgba(4,120,87,0.1)]"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-[10px] mb-[20px]">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#047857] flex items-center justify-center shrink-0">
            <Sparkles className="w-[20px] h-[20px] text-white" />
          </div>
          <div>
            <p className="font-['Inter',sans-serif] font-semibold text-[10.5px] text-[#166534] uppercase tracking-[0.5px] mb-[2px]">
              Post-Sign-Off Insight
            </p>
            <h3 className="font-['Inter',sans-serif] font-semibold text-[16px] leading-[22px] text-[#101828]">
              Workflow Summary
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] mb-[20px]">
          <div>
            <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#166534] uppercase tracking-[0.4px] mb-[10px]">Agent Prepared</p>
            <div className="space-y-[5px]">
              {insight.aiPreparedWork.map((item, idx) => (
                <div key={idx} className="flex items-start gap-[6px]">
                  <Check className="w-[12px] h-[12px] text-[#047857] shrink-0 mt-[3px]" />
                  <p className="font-['Inter',sans-serif] font-medium text-[11.5px] leading-[16px] text-[#166534]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#166534] uppercase tracking-[0.4px] mb-[10px]">You Reviewed</p>
            <div className="space-y-[5px]">
              {insight.humanReviewedWork.map((item, idx) => (
                <div key={idx} className="flex items-start gap-[6px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-[#047857] shrink-0 mt-[6px]" />
                  <p className="font-['Inter',sans-serif] font-medium text-[11.5px] leading-[16px] text-[#166534]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#166534] uppercase tracking-[0.4px] mb-[10px]">Future Improvements</p>
            <div className="space-y-[5px]">
              {insight.futureImprovements.map((item, idx) => (
                <div key={idx} className="flex items-start gap-[6px]">
                  <Sparkles className="w-[12px] h-[12px] text-[#047857] shrink-0 mt-[2px]" />
                  <p className="font-['Inter',sans-serif] font-medium text-[11.5px] leading-[16px] text-[#166534]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-[20px] border-t border-[#bbf7d0]">
          <p className="font-['Inter',sans-serif] font-medium text-[12.5px] leading-[18px] text-[#166534] mb-[14px]">
            This workflow demonstrates effective human-in-the-loop automation. Consider enabling the recommended automations to further streamline this process.
          </p>
          <button className="px-[16px] py-[10px] bg-[#047857] hover:bg-[#065f46] text-white rounded-[10px] font-['Inter',sans-serif] font-semibold text-[13px] transition-colors">
            View Recommended Automations
          </button>
        </div>
      </div>
    </motion.div>
  );
}
