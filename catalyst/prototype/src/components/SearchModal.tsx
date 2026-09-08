import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from "../imports/svg-fm0lgdc0e8";

interface SearchModalProps {
  onClose: () => void;
  searchButtonRef?: React.RefObject<HTMLDivElement | null>;
}

export function SearchModal({ onClose, searchButtonRef }: SearchModalProps) {
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [panelPosition, setPanelPosition] = useState<{ top: number; left: number | string; transform: string }>({ top: 63, left: '50%', transform: 'translateX(-50%)' });
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const PANEL_WIDTH = 671; // Fixed panel width
  const VIEWPORT_PADDING = 12; // Padding from viewport edges
  const GAP_FROM_SEARCH = 8; // Gap below search bar

  useEffect(() => {
    const calculatePosition = () => {
      if (searchButtonRef?.current) {
        const rect = searchButtonRef.current.getBoundingClientRect();
        
        // Calculate center of search bar
        const anchorX = rect.left + rect.width / 2;
        
        // Position panel centered under search bar
        let left = anchorX - PANEL_WIDTH / 2;
        
        // Clamp within viewport with padding
        const maxLeft = window.innerWidth - PANEL_WIDTH - VIEWPORT_PADDING;
        left = Math.max(VIEWPORT_PADDING, Math.min(left, maxLeft));
        
        // Top position with gap
        const top = rect.bottom + GAP_FROM_SEARCH;
        
        setPanelPosition({
          top,
          left,
          transform: 'none'
        });
      }
    };

    // Initial calculation
    calculatePosition();
    
    // Focus input
    inputRef.current?.focus();
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // Recalculate on resize
    const handleResize = () => {
      calculatePosition();
    };

    // Recalculate on scroll
    const handleScroll = () => {
      calculatePosition();
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true); // Use capture to catch all scrolls
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [onClose, searchButtonRef]);

  const triggerFilledState = () => {
    if (!showResults) {
      setSearchQuery('Unresolved review notes assigned to me in March 2026');
      setShowResults(true);
    }
  };

  const handleInputClick = () => {
    triggerFilledState();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ignore escape key as it's handled separately
    if (e.key === 'Escape') return;
    
    // Trigger filled state for any other key press
    triggerFilledState();
  };

  const handleContentClick = () => {
    triggerFilledState();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        className="fixed z-50 bg-white content-stretch flex flex-col items-start overflow-clip rounded-[8px] w-[671px] max-h-[80vh]"
        style={{
          top: panelPosition.top,
          left: panelPosition.left,
          transform: panelPosition.transform,
          boxShadow: '0px 12px 32px rgba(0,0,0,0.18), 0px 2px 8px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(4px)'
        }}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.14, ease: 'easeOut' }}
      >
        {/* Search Input Section */}
        <div className="bg-white h-[70px] relative rounded-tl-[12px] rounded-tr-[12px] shrink-0 w-full">
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex gap-[8px] items-center p-[16px] relative size-full">
              {/* Search Icon */}
              <div className="relative shrink-0 size-[16px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g id="search-md">
                    <path d={svgPaths.p24e04a80} id="Icon" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>
              
              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={handleInputClick}
                onKeyDown={handleKeyDown}
                placeholder="Search or ask a question..."
                className="flex-[1_0_0] font-['Inter',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic overflow-hidden relative text-[#2b2a29] text-[14px] text-ellipsis whitespace-nowrap outline-none bg-transparent placeholder:text-[#6d6d6d]"
              />
              
              {/* Ask FloQast Button - Only show when in results state */}
              {showResults && (
                <div className="bg-white relative rounded-[8px] shrink-0">
                  <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[14px] py-[10px] relative rounded-[inherit]">
                    <div className="relative shrink-0 size-[20px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                        <g id="magic_ai_star">
                          <path d="M7.99953 12.1458L9.04284 9.87666L11.312 8.83334L9.04284 7.79003L7.99953 5.52084L6.95621 7.79003L4.68703 8.83334L6.95621 9.87666L7.99953 12.1458ZM7.99953 15.1667L6.02036 10.8125L1.66619 8.83334L6.02036 6.85418L7.99953 2.50001L9.97869 6.85418L14.3329 8.83334L9.97869 10.8125L7.99953 15.1667ZM15.1662 17.5L14.187 15.3125L11.9995 14.3333L14.187 13.3333L15.1662 11.1667L16.1662 13.3333L18.3329 14.3333L16.1662 15.3125L15.1662 17.5Z" fill="#344054" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <div className="content-stretch flex items-center justify-center px-[2px] relative shrink-0">
                      <p className="font-['Inter',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#344054] text-[12px]">Ask FloQast</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)]" />
                  <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
                </div>
              )}
            </div>
          </div>
          <div aria-hidden="true" className="absolute border-[#e4e7ec] border-b border-solid inset-0 pointer-events-none rounded-tl-[12px] rounded-tr-[12px]" />
        </div>

        {/* Content Section - Toggle between default and results */}
        <div className="flex-1 overflow-y-auto w-full" onClick={handleContentClick}>
          {!showResults ? <DefaultContent /> : <ResultsContent />}
        </div>

        {/* Footer */}
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}

// Default Content - Recent, Quick Actions, Suggestions
function DefaultContent() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
        {/* Recent Section */}
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          <p className="font-['Inter',sans-serif] font-semibold leading-[16.5px] not-italic relative shrink-0 text-[#828282] text-[10px] tracking-[0.5px]">RECENT</p>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <RecentItem 
              title="FloQast Corporate - 07 Prepaid expenses - Checklist"
              lastViewed="2/28/2026"
            />
            <RecentItem 
              title="FloQast Corporate - 1000 Wells Fargo Checking - AI Matching"
              lastViewed="2/26/2026"
            />
            <RecentItem 
              title="FloQast Corporate - 04 Accounts receivable - Checklist"
              lastViewed="2/24/2026"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-0 relative shrink-0 w-[598px]">
          <div className="absolute inset-[-1px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 598 1">
              <line id="Line 231" stroke="#E4E7EC" x2="598" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          <p className="font-['Inter',sans-serif] font-semibold leading-[16.5px] not-italic relative shrink-0 text-[#828282] text-[10px] tracking-[0.5px]">QUICK ACTIONS</p>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[639px]">
            <QuickActionItem icon={<CheckDoneIcon />} label="Go to My Tasks" />
            <QuickActionItem icon={<BookClosedIcon />} label="Create a Journal Entry" />
            <QuickActionItem icon={<FolderIcon />} label="Go to Folders" />
            <QuickActionItem icon={<StarIcon />} label="Create Agent" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-0 relative shrink-0 w-[598px]">
          <div className="absolute inset-[-1px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 598 1">
              <line id="Line 231" stroke="#E4E7EC" x2="598" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          <p className="font-['Inter',sans-serif] font-semibold leading-[16.5px] not-italic relative shrink-0 text-[#828282] text-[10px] tracking-[0.5px]">SUGGESTIONS</p>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[639px]">
            <SuggestionItem text="Show unresolved review notes assigned to me" />
            <SuggestionItem text="Show reconciliations missing supporting documents" />
            <SuggestionItem text="Show tasks due this week" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Results Content - Filters and Top Results
function ResultsContent() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
        {/* Filters */}
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
          <FilterDropdown label="Type" />
          <FilterDropdown label="Period" />
          <FilterDropdown label="Assignee" />
          <FilterDropdown label="Status" />
        </div>

        {/* Results and Suggestions */}
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
          {/* Top Results */}
          <div className="content-stretch flex flex-col gap-[12px] items-start pb-[12px] relative shrink-0 w-full">
            <div aria-hidden="true" className="absolute border-[#e4e7ec] border-b border-solid inset-0 pointer-events-none" />
            <p className="font-['Inter',sans-serif] font-semibold leading-[16.5px] not-italic relative shrink-0 text-[#828282] text-[11px] tracking-[0.5px]">TOP RESULTS</p>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
              <ResultItem
                title="FloQast Corporate - 04 Accounts receivable - Checklist"
                description="Where is the invoice for the $34,098 variance?"
                status="Unresolved"
                lastUpdated="3/12/2026 9:05am"
              />
              <ResultItem
                title="FloQast Corporate - 15 Deferred Revenue - Checklist"
                description="provide a more detailed explanation for the 2 differences greater than 5% in the analytic."
                status="Unresolved"
                lastUpdated="1/12/2026 2:05pm"
              />
              <ResultItem
                title="FQ Netherlands - 14 Deferred Revenue - 2640 Deferred Revenue Subscriptions"
                description="Subscription revenue increased this month due to new product launched into the market."
                status="Unresolved"
                lastUpdated="2/28/2026 8:25am"
              />
              <ResultItem
                title="FQ Australia - 14 Accrued expenses - 2010 Accrued Expense"
                description="Please check why there is a $30k difference?"
                status="Unresolved"
                lastUpdated="3/5/2026 11:02am"
              />
              <ViewTasksButton />
            </div>
          </div>

          {/* Suggestions */}
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <p className="font-['Inter',sans-serif] font-semibold leading-[16.5px] not-italic relative shrink-0 text-[#828282] text-[11px] tracking-[0.5px]">SUGGESTIONS</p>
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[639px]">
              <SuggestionItem text="Show unresolved notes for accounts receivable only" />
              <SuggestionItem text="Show notes waiting on external documents" />
              <SuggestionItem text="Only show notes that are past due" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(255,255,255,0.8)] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e7ec] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[18px] pr-[8px] py-[8px] relative w-full">
          {/* Navigation Up/Down */}
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
            <div className="content-stretch flex gap-[6px] items-start relative shrink-0">
              <div className="bg-white content-stretch flex items-center justify-center p-[6px] relative rounded-[8px] shrink-0 size-[26px]">
                <div aria-hidden="true" className="absolute border border-[#e4e7ec] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <div className="relative shrink-0 size-[16px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <g id="arrow-up">
                      <path d={svgPaths.p2b9ec400} id="Icon" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="bg-white content-stretch flex items-center justify-center p-[6px] relative rounded-[8px] shrink-0 size-[26px]">
                <div aria-hidden="true" className="absolute border border-[#e4e7ec] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <div className="relative shrink-0 size-[16px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <g id="arrow-down">
                      <path d={svgPaths.p14089660} id="Icon" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col font-['Inter',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#667085] text-[11px] whitespace-nowrap">
              <p className="leading-[20px]">to navigate</p>
            </div>
          </div>

          {/* Select */}
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
            <div className="bg-white content-stretch flex items-center justify-center p-[6px] relative rounded-[8px] shrink-0 size-[26px]">
              <div aria-hidden="true" className="absolute border border-[#e4e7ec] border-solid inset-0 pointer-events-none rounded-[8px]" />
              <div className="relative shrink-0 size-[16px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g id="corner-down-left">
                    <path d={svgPaths.p2fb0dd00} id="Icon" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="flex flex-col font-['Inter',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#667085] text-[11px] whitespace-nowrap">
              <p className="leading-[20px]">to select</p>
            </div>
          </div>

          {/* Close */}
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
            <div className="bg-white content-stretch flex items-center justify-center py-[4px] relative rounded-[8px] shrink-0 size-[26px]">
              <div aria-hidden="true" className="absolute border border-[#e4e7ec] border-solid inset-0 pointer-events-none rounded-[8px]" />
              <div className="flex flex-col font-['Inter',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#667085] text-[10px] whitespace-nowrap">
                <p className="leading-[20px]">esc</p>
              </div>
            </div>
            <div className="flex flex-col font-['Inter',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#667085] text-[11px] whitespace-nowrap">
              <p className="leading-[20px]">to close</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Recent Item Component
interface RecentItemProps {
  title: string;
  lastViewed: string;
}

function RecentItem({ title, lastViewed }: RecentItemProps) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <div className="relative shrink-0">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative">
            <div className="capitalize content-stretch flex flex-col items-start leading-[18px] not-italic relative shrink-0 tracking-[-0.12px]">
              <p className="font-['Inter',sans-serif] font-semibold relative shrink-0 text-[#2b2a29] text-[12px]">{title}</p>
              <p className="font-['Inter',sans-serif] font-normal relative shrink-0 text-[#757575] text-[10px]">Last Viewed: {lastViewed}</p>
            </div>
          </div>
        </div>
        <div className="relative shrink-0 size-[18px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <g id="corner-down-left">
              <path d={svgPaths.p32758400} id="Icon" stroke="#A2AABB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

// Quick Action Item Component
interface QuickActionItemProps {
  icon: React.ReactNode;
  label: string;
}

function QuickActionItem({ icon, label }: QuickActionItemProps) {
  return (
    <div className="content-stretch flex gap-[7px] items-center p-px relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      {icon}
      <p className="font-['Inter',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#2b2a29] text-[12px] tracking-[-0.12px]">{label}</p>
    </div>
  );
}

// Icon Components
function CheckDoneIcon() {
  return (
    <div className="relative shrink-0 size-[15px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_2085_4297)" id="check-done-01">
          <path d={svgPaths.p2098f8c0} id="Icon" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2085_4297">
            <rect fill="white" height="15" width="15" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function BookClosedIcon() {
  return (
    <div className="relative shrink-0 size-[15px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="book-closed">
          <path d={svgPaths.p652a600} id="Icon" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function FolderIcon() {
  return (
    <div className="relative shrink-0 size-[15px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="folder">
          <path d={svgPaths.p1b3d7e80} id="Icon" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function StarIcon() {
  return (
    <div className="relative shrink-0 size-[15px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_2085_2921)" id="star-05">
          <path d={svgPaths.p1e404e80} id="Icon" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2085_2921">
            <rect fill="white" height="15" width="15" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// Filter Dropdown Component
interface FilterDropdownProps {
  label: string;
}

function FilterDropdown({ label }: FilterDropdownProps) {
  return (
    <div className="bg-white h-[30px] relative rounded-[8px] shrink-0">
      <div className="content-stretch flex gap-[8px] items-center overflow-clip p-[8px] relative rounded-[inherit] size-full">
        <p className="flex-[1_0_0] font-['Inter',sans-serif] font-medium h-[16px] leading-[16px] min-h-px min-w-px not-italic overflow-hidden relative text-[#424867] text-[12px] text-ellipsis whitespace-nowrap">{label}</p>
        <div className="relative shrink-0 size-[20px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <g id="chevron-down-expand-more">
              <mask height="20" id="mask0_2050_47190" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="20" x="0" y="0">
                <rect fill="#D9D9D9" height="20" id="Bounding box" width="20" />
              </mask>
              <g mask="url(#mask0_2050_47190)">
                <path d={svgPaths.p1664b100} fill="#1D2433" id="expand_more" />
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e6ef] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

// Result Item Component
interface ResultItemProps {
  title: string;
  description: string;
  status: string;
  lastUpdated: string;
}

function ResultItem({ title, description, status, lastUpdated }: ResultItemProps) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <div className="relative shrink-0">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start justify-center relative">
            <div className="content-stretch flex flex-col items-start leading-[18px] not-italic relative shrink-0 tracking-[-0.12px]">
              <p className="capitalize font-['Inter',sans-serif] font-semibold relative shrink-0 text-[#2b2a29] text-[12px]">{title}</p>
              <p className="font-['Inter',sans-serif] font-normal relative shrink-0 text-[#757371] text-[11px]">{description}</p>
            </div>
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
              <div className="bg-[#fef6ee] content-stretch flex h-[18px] items-center justify-center px-[6px] py-[2px] relative rounded-[19px] shrink-0">
                <div aria-hidden="true" className="absolute border border-[#f9dbaf] border-solid inset-0 pointer-events-none rounded-[19px]" />
                <p className="font-['Inter',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#b93815] text-[10px] text-center">{status}</p>
              </div>
              <p className="capitalize font-['Inter',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#757575] text-[10px] tracking-[-0.12px] w-[427px] whitespace-pre-wrap">Last updated: {lastUpdated}</p>
            </div>
          </div>
        </div>
        <div className="relative shrink-0 size-[18px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <g id="corner-down-left">
              <path d={svgPaths.p32758400} id="Icon" stroke="#A2AABB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

// View Tasks Button
function ViewTasksButton() {
  return (
    <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-full">
      <div className="flex-[1_0_0] min-h-px min-w-px relative">
        <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center p-px relative w-full">
          <p className="font-['Inter',sans-serif] font-semibold leading-[18px] not-italic relative shrink-0 text-[#2b2a29] text-[12px] tracking-[-0.12px]">View Tasks</p>
          <div className="relative shrink-0 size-[15px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
              <g clipPath="url(#clip0_2050_29951)" id="open-in-new-expand-launch">
                <path d="M0.5 14.5V0.5H7.5V2H2V13H13V7.5H14.5V14.5H0.5ZM5.5625 10.5L4.5 9.4375L11.9375 2H9.5V0.5H14.5V5.5H13V3.0625L5.5625 10.5Z" fill="#3F3E3C" id="Vector" />
              </g>
              <defs>
                <clipPath id="clip0_2050_29951">
                  <rect fill="white" height="15" width="15" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Suggestion Item Component
interface SuggestionItemProps {
  text: string;
}

function SuggestionItem({ text }: SuggestionItemProps) {
  return (
    <div className="content-stretch flex gap-[6px] items-center p-px relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <div className="relative shrink-0 size-[16px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <g id="search-md">
            <path d={svgPaths.p24e04a80} id="Icon" stroke="#076D5B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
      <p className="font-['Inter',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#2b2a29] text-[12px] tracking-[-0.12px]">{text}</p>
    </div>
  );
}