import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Sparkles, Paperclip, ChevronRight } from 'lucide-react';
import type { ReviewNote } from '@/types';

interface TaskReviewNotesProps {
  notes: ReviewNote[];
}

export function TaskReviewNotes({ notes }: TaskReviewNotesProps) {
  const [showAllNotes, setShowAllNotes] = useState(false);
  const visibleNotes = showAllNotes ? notes : notes.slice(-2);

  return (
    <div className="bg-white/95 rounded-[12px] border border-white/60 p-[24px] bg-[#ffffffe6]">
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="font-['Inter',sans-serif] font-semibold text-[15px] text-[#101828] flex items-center gap-[8px]">
          <MessageSquare className="w-[16px] h-[16px] text-[#475467]" />
          Review Notes
        </h3>
        <span className="font-['Inter',sans-serif] font-medium text-[12px] text-[#475467] px-[8px] py-[2px] bg-[#f3f4f6] rounded-[6px]">
          {notes.length}
        </span>
      </div>

      <div className="space-y-[16px]">
        {visibleNotes.map((note) => (
          <ReviewNoteThread key={note.id} note={note} />
        ))}

        {!showAllNotes && notes.length > 2 && (
          <button
            onClick={() => setShowAllNotes(true)}
            className="flex items-center gap-[6px] text-[#047857] hover:text-[#065f46] transition-colors px-[12px] py-[6px] hover:bg-[rgba(4,120,87,0.05)] rounded-[6px]"
          >
            <span className="font-['Inter',sans-serif] font-semibold text-[12.5px]">
              Show {notes.length - 2} earlier comments
            </span>
            <ChevronRight className="w-[14px] h-[14px]" />
          </button>
        )}

        {showAllNotes && notes.length > 2 && (
          <button
            onClick={() => setShowAllNotes(false)}
            className="flex items-center gap-[6px] text-[#475467] hover:text-[#101828] transition-colors px-[12px] py-[6px]"
          >
            <span className="font-['Inter',sans-serif] font-semibold text-[12.5px]">Show less</span>
          </button>
        )}
      </div>

      {/* Add Comment Input */}
      <div className="mt-[20px] pt-[20px] border-t border-[#e5e7eb]">
        <div className="flex items-start gap-[12px]">
          <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-b from-[#005133] to-[#0a3b33] flex items-center justify-center shrink-0">
            <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#c0e8d7]">KJ</p>
          </div>
          <div className="flex-1">
            <textarea
              placeholder="Add a comment..."
              className="w-full px-[14px] py-[10px] border border-[#d1d5db] rounded-[8px] font-['Inter',sans-serif] font-medium text-[13px] text-[#101828] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between mt-[8px]">
              <div className="flex items-center gap-[6px]">
                <button className="p-[6px] hover:bg-[#f3f4f6] rounded-[6px] transition-colors">
                  <Paperclip className="w-[16px] h-[16px] text-[#667085]" />
                </button>
              </div>
              <button className="px-[14px] py-[7px] bg-[#047857] hover:bg-[#065f46] text-white rounded-[8px] font-['Inter',sans-serif] font-semibold text-[12px] transition-colors">
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewNoteThread({ note }: { note: ReviewNote }) {
  const [showReplyInput, setShowReplyInput] = useState(false);

  return (
    <div className="group">
      <div className="flex items-start gap-[12px] px-[12px] py-[10px] rounded-[8px] hover:bg-[rgba(0,0,0,0.02)] transition-colors">
        <div className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center shrink-0 ${
          note.isAgent
            ? 'bg-gradient-to-br from-[#047857] to-[#065f46]'
            : 'bg-gradient-to-b from-[#005133] to-[#0a3b33]'
        }`}>
          {note.isAgent ? (
            <Sparkles className="w-[15px] h-[15px] text-white" />
          ) : (
            <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#c0e8d7]">{note.initials}</p>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[8px] mb-[5px]">
            <p className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828]">{note.author}</p>
            {note.isAgent && (
              <span className="px-[6px] py-[1px] bg-[#f0fdf4] text-[#166534] rounded-[4px] font-['Inter',sans-serif] font-semibold text-[10px]">Agent</span>
            )}
            <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af]">{note.time}</p>
          </div>
          <p className="font-['Inter',sans-serif] font-medium text-[12.5px] leading-[18px] text-[#475467] mb-[8px]">{note.message}</p>

          <div className="flex items-center gap-[12px]">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-[4px] text-[#667085] hover:text-[#047857] transition-colors opacity-0 group-hover:opacity-100"
            >
              <MessageSquare className="w-[13px] h-[13px]" />
              <span className="font-['Inter',sans-serif] font-medium text-[11.5px]">Reply</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReplyInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-[44px] mt-[8px]"
          >
            <div className="flex items-start gap-[12px] px-[12px] py-[10px]">
              <div className="w-[28px] h-[28px] rounded-[7px] bg-gradient-to-b from-[#005133] to-[#0a3b33] flex items-center justify-center shrink-0">
                <p className="font-['Inter',sans-serif] font-semibold text-[10px] text-[#c0e8d7]">KJ</p>
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Write a reply..."
                  className="w-full px-[12px] py-[8px] border border-[#d1d5db] rounded-[7px] font-['Inter',sans-serif] font-medium text-[12.5px] text-[#101828] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent resize-none"
                  rows={2}
                  autoFocus
                />
                <div className="flex items-center justify-end gap-[6px] mt-[6px]">
                  <button onClick={() => setShowReplyInput(false)} className="px-[12px] py-[6px] text-[#667085] hover:bg-[#f3f4f6] rounded-[6px] font-['Inter',sans-serif] font-semibold text-[11.5px] transition-colors">Cancel</button>
                  <button className="px-[12px] py-[6px] bg-[#047857] hover:bg-[#065f46] text-white rounded-[6px] font-['Inter',sans-serif] font-semibold text-[11.5px] transition-colors">Reply</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
