import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, ChevronRight } from 'lucide-react';
import type { TaskDetail } from '@/types';

interface ItemDetailsCardProps {
  detail: TaskDetail;
  dueDate: string;
  taskStatus?: string;
}

export function ItemDetailsCard({ detail, dueDate, taskStatus }: ItemDetailsCardProps) {
  const [showAllAssignees, setShowAllAssignees] = useState(false);
  const visibleAssignees = showAllAssignees ? detail.assignees : detail.assignees.slice(0, 2);
  const remainingCount = detail.assignees.length - 2;

  return (
    <div className="bg-white/95 rounded-[12px] border border-white/60 shadow-[0px_2px_8px_rgba(0,51,42,0.04)] bg-[#ffffffe6] h-[590px] flex flex-col">
      <div className="px-[22px] pt-[22px] pb-[12px] shrink-0">
        <h3 className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#101828] flex items-center gap-[8px]">
          <FileText className="w-[16px] h-[16px] text-[#475467]" />
          Item Details
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-[22px] pb-[22px] scrollbar-hide">
        <div className="grid grid-cols-2 gap-x-[16px] gap-y-[14px] mb-[14px]">
          <DetailRow label="Status" value={taskStatus || detail.workflowStages.find(s => s.status === 'current')?.label || 'Pending'} />
          <DetailRow label="Period" value={detail.period} />
          <DetailRow label="Due Date" value={dueDate} />
          <DetailRow label="Estimated Time" value="~2 hours" />
          <DetailRow label="Entity" value={detail.entity} />
          <DetailRow label="Folder" value={detail.folder} />
          <DetailRow label="Frequency" value={detail.frequency} />
        </div>

        <div className="pt-[14px] border-t border-[#f3f4f6]">
          <div className="flex items-center justify-between mb-[8px]">
            <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] uppercase tracking-[0.4px]">Assigned To</p>
            <span className="font-['Inter',sans-serif] font-medium text-[11px] text-[#667085] px-[6px] py-[1px] bg-[#f3f4f6] rounded-[4px]">{detail.assignees.length}</span>
          </div>

          <div className="space-y-[8px]">
            {visibleAssignees.map((assignee, idx) => (
              <div key={idx} className="flex items-center gap-[10px]">
                <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-b from-[#005133] to-[#0a3b33] flex items-center justify-center shrink-0">
                  <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#c0e8d7]">{assignee.initials}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-[6px]">
                    <p className="font-['Inter',sans-serif] font-semibold text-[12.5px] text-[#101828] truncate">{assignee.name}</p>
                    {assignee.badge && (
                      <span className="px-[8px] py-[2px] bg-[#f3f4f6] text-[#667085] rounded-[6px] font-['Inter',sans-serif] font-semibold text-[11px] shrink-0">{assignee.badge}</span>
                    )}
                  </div>
                  <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] truncate">{assignee.role}</p>
                </div>
              </div>
            ))}
          </div>

          {detail.assignees.length > 2 && (
            <button
              onClick={() => setShowAllAssignees(!showAllAssignees)}
              className="flex items-center gap-[5px] mt-[10px] text-[#047857] hover:text-[#065f46] transition-colors px-[8px] py-[4px] hover:bg-[rgba(4,120,87,0.05)] rounded-[6px]"
            >
              <span className="font-['Inter',sans-serif] font-semibold text-[11.5px]">
                {showAllAssignees ? 'Show less' : `Show ${remainingCount} more`}
              </span>
              <motion.div animate={{ rotate: showAllAssignees ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight className="w-[13px] h-[13px]" />
              </motion.div>
            </button>
          )}
        </div>

        <div className="pt-[14px] border-t border-[#f3f4f6]">
          <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] uppercase tracking-[0.4px] mb-[6px]">Description</p>
          <p className="font-['Inter',sans-serif] font-medium text-[12px] leading-[17px] text-[#475467]">{detail.description}</p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] mb-[3px]">{label}</p>
      <p className="font-['Inter',sans-serif] font-semibold text-[12.5px] text-[#101828]">{value}</p>
    </div>
  );
}
