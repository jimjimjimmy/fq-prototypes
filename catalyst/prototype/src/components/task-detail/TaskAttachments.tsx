import { Paperclip, Download, Upload } from 'lucide-react';
import type { Attachment } from '@/types';

interface TaskAttachmentsProps {
  attachments: Attachment[];
}

export function TaskAttachments({ attachments }: TaskAttachmentsProps) {
  return (
    <div className="bg-white/95 rounded-[12px] border border-white/60 p-[20px] bg-[#ffffff]">
      <div className="flex items-center justify-between mb-[16px]">
        <h3 className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#101828] flex items-center gap-[7px]">
          <Paperclip className="w-[15px] h-[15px] text-[#475467]" />
          Attachments
        </h3>
        <span className="font-['Inter',sans-serif] font-medium text-[11px] text-[#475467] px-[7px] py-[2px] bg-[#f3f4f6] rounded-[5px]">
          {attachments.length}
        </span>
      </div>

      <div className="space-y-[8px] mb-[16px]">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center gap-[12px] px-[14px] py-[11px] bg-white rounded-[8px] border border-[#e5e7eb] hover:border-[#d1d5db] hover:shadow-[0px_2px_8px_rgba(0,0,0,0.04)] transition-all cursor-pointer group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[8px]">
                <p className="font-['Inter',sans-serif] font-medium text-[13px] text-[#101828] truncate">{attachment.name}</p>
                {attachment.isAgentGenerated && (
                  <span className="px-[6px] py-[1px] bg-[rgba(4,120,87,0.1)] text-[#047857] rounded-[4px] font-['Inter',sans-serif] font-semibold text-[9.5px] shrink-0">
                    AI Generated
                  </span>
                )}
              </div>
              <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af]">{attachment.size}</p>
            </div>
            <Download className="w-[16px] h-[16px] text-[#9ca3af] group-hover:text-[#047857] transition-colors" />
          </div>
        ))}
      </div>

      <div className="pt-[16px] border-t border-[#e5e7eb]">
        <div className="border-[2px] border-dashed border-[#d1d5db] rounded-[8px] p-[16px] hover:border-[#047857] hover:bg-[rgba(4,120,87,0.02)] transition-all cursor-pointer group">
          <div className="flex flex-col items-center gap-[6px]">
            <Upload className="w-[20px] h-[20px] text-[#9ca3af] group-hover:text-[#047857] transition-colors" />
            <p className="font-['Inter',sans-serif] font-medium text-[11.5px] text-[#475467] group-hover:text-[#047857] transition-colors text-center">
              Drop files
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
