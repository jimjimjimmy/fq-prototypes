import svgPathsNotes from '@/imports/svg-bkvl4690in';

interface ReviewNote {
  initials: string;
  title: string;
  time: string;
  description: string;
  status: {
    text: string;
    variant: 'critical' | 'ready';
  };
}

const reviewNotes: ReviewNote[] = [
  {
    initials: 'KJ',
    title: 'Fixed Assets - 1020 Citi Savings Account',
    time: '2 min ago',
    description: 'Some invoices missing approval. Please update.',
    status: { text: 'Your response is holding final sign-off', variant: 'critical' },
  },
  {
    initials: 'SL',
    title: 'Project Management - Q4 Budget Review',
    time: '2 hr ago',
    description: 'Review budget allocations for next quarter.',
    status: { text: 'Allocation validation needed.', variant: 'ready' },
  },
  {
    initials: 'KJ',
    title: 'Procurement - Vendor Management',
    time: 'Mar 1 at 11:05 am',
    description: 'Need to finalize the vendor contracts by end of week.',
    status: { text: 'Workflow paused pending revised contract terms.', variant: 'ready' },
  },
  {
    initials: 'KJ',
    title: 'Marketing - Campaign Analysis',
    time: 'Mar 1 at 10:28 am',
    description: 'Update on the marketing campaign accrual.',
    status: { text: 'Accrual update requested.', variant: 'ready' },
  },
];

export function RecentReviewNotes() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] flex flex-col items-start overflow-hidden relative rounded-[12px] size-full">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.7)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_4px_16px_0px_rgba(0,51,42,0.08)]" />

      {/* Card Header */}
      <div className="bg-[rgba(255,255,255,0.6)] flex flex-col gap-[20px] isolate items-start relative shrink-0 w-full">
        <div className="relative shrink-0 w-full z-[2]">
          <div className="flex gap-[16px] items-start pt-[16px] px-[24px] relative w-full">
            <div className="flex flex-[1_0_0] flex-col gap-[2px] h-[52px] items-start justify-center min-h-px min-w-px relative">
              <div className="flex gap-[8px] items-center relative shrink-0 w-full">
                <p className="font-['Inter',sans-serif] font-semibold leading-[28px] not-italic relative shrink-0 text-[#101828] text-[15px]">
                  Recent Review Notes
                </p>
              </div>
              <p className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#475467] text-[12px] text-ellipsis w-full whitespace-nowrap">
                Updates from recent review activity prioritized for you
              </p>
            </div>
            <button className="bg-[rgba(255,255,255,0.5)] flex flex-col h-[40px] items-start p-px relative rounded-[12px] shrink-0 w-[84.766px] hover:bg-[rgba(255,255,255,0.7)] transition-colors">
              <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.6)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
              <div className="flex h-[38px] items-center justify-center overflow-clip relative shrink-0 w-full">
                <div className="h-[20px] relative shrink-0 w-[54.766px]">
                  <div className="flex items-center justify-center relative size-full">
                    <p className="font-['Inter',sans-serif] font-semibold leading-[20px] not-italic text-[#00332a] text-[13px] text-center">View All</p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="h-px relative shrink-0 w-full z-[1]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 468 1">
            <path clipRule="evenodd" d="M468 1H0V0H468V1Z" fill="#E4E7EC" fillRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Review Notes List - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide w-full">
        {reviewNotes.map((note, index) => (
          <ReviewNoteCard key={index} note={note} showLeftAccent={index === 0} />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_100.48px_104.667px_0px_rgba(255,255,255,0.25)]" />
    </div>
  );
}

function ReviewNoteCard({ note, showLeftAccent }: { note: ReviewNote; showLeftAccent?: boolean }) {
  const isCritical = note.status.variant === 'critical';

  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e5e4e3] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col gap-[12px] items-start pb-[17px] pt-[16px] px-[24px] relative w-full">
        <div className="relative shrink-0 w-full">
          <div className="flex gap-[8px] items-start relative w-full">
            {/* Avatar */}
            <div className="bg-gradient-to-b from-[#005133] to-[#0a3b33] flex items-center justify-center relative rounded-[8px] shrink-0 size-[29px]">
              <p className="font-['Inter',sans-serif] font-semibold leading-[18px] not-italic text-[#c0e8d7] text-[12px]">
                {note.initials}
              </p>
            </div>

            {/* Content */}
            <div className="flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px relative">
              <div className="flex font-['Inter',sans-serif] font-medium items-start justify-between gap-[8px] leading-[normal] not-italic relative shrink-0 text-[#475467] text-[11px] w-full">
                <p className="relative truncate flex-1 min-w-0">{note.title}</p>
                <p className="relative shrink-0 whitespace-nowrap">{note.time}</p>
              </div>

              <div className="flex flex-col gap-[7px] items-start relative shrink-0 w-full">
                <p className="font-['Inter',sans-serif] font-medium leading-[normal] min-w-full not-italic relative shrink-0 text-[#101828] text-[12px] w-[min-content] whitespace-pre-wrap">
                  {note.description}
                </p>

                <div className={`flex gap-[6px] items-center px-[8px] py-[5px] relative rounded-[8px] shrink-0 max-w-full ${isCritical ? 'bg-[rgba(134,5,5,0.06)]' : 'bg-[rgba(1,58,48,0.06)]'}`}>
                  <div className="flex flex-col items-start overflow-clip relative shrink-0 size-[13px]">
                    <div className="h-[13px] overflow-clip relative shrink-0 w-full">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                        <path d={svgPathsNotes.p2f8e6000} fill={isCritical ? '#860505' : '#013A30'} />
                      </svg>
                    </div>
                  </div>
                  <p className={`font-['Inter',sans-serif] font-medium leading-[16px] not-italic relative text-[11px] truncate ${isCritical ? 'text-[#860505]' : 'text-[#013a30]'}`}>
                    {note.status.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLeftAccent && <div className="absolute bg-[#780404] h-[104px] left-0 top-0 w-[4px]" />}
    </div>
  );
}
