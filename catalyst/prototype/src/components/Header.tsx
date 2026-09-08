import { useRef } from 'react';
import svgPaths from "../imports/svg-t6wwpd34fb";
import searchSvgPaths from "../imports/svg-envcvnhhyw";
import bellSvgPaths from "../imports/svg-sucfm36ktd";
import { PersonaSwitcher } from './shared/PersonaSwitcher';

interface HeaderProps {
  onSearchClick: () => void;
  onAIClick: () => void;
  onNotificationClick: () => void;
  searchButtonRef?: React.RefObject<HTMLDivElement | null>;
  bellButtonRef?: React.RefObject<HTMLButtonElement | null>;
  isNotificationOpen?: boolean;
}

export function Header({ onSearchClick, onAIClick, onNotificationClick, searchButtonRef, bellButtonRef, isNotificationOpen }: HeaderProps) {
  const localSearchRef = useRef<HTMLDivElement>(null);
  const refToUse = searchButtonRef || localSearchRef;

  return (
    <div className="bg-[#f5f5f5] h-[55px] flex items-center justify-between px-[24px] relative">
      <div aria-hidden="true" className="absolute border-[rgba(26,26,26,0.08)] border-b border-solid inset-0 pointer-events-none]" />
      
      {/* Left spacer to balance the layout */}
      <div className="w-[24px]" />
      
      {/* Centered Search Input */}
      <div ref={refToUse} className="relative h-[34px] w-[530px]">
        {/* Search Input */}
        <button
          onClick={onSearchClick}
          className="bg-[#fafaf9] h-full rounded-[8px] border border-[#e1e6ef] w-full flex items-center gap-[6px] px-[12px] py-[8px] hover:bg-stone-100 transition-colors"
        >
          <div className="relative shrink-0 size-[16px]">
            <div className="absolute inset-[12.5%]">
              <div className="absolute inset-[-6.25%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
                  <path d={searchSvgPaths.p161fcb70} stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="font-['Inter',sans-serif] font-normal leading-[16px] not-italic text-[#555352] text-[12px] text-ellipsis overflow-hidden">
            Search or ask a question
          </p>
        </button>
        
        {/* Ask FloQast Button - positioned absolutely on the right */}
        <div className="absolute right-[4px] top-[4px]">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAIClick();
            }}
            className="h-[26px] rounded-[9px] flex items-center justify-center px-[10px] py-[12px] gap-[4px] hover:opacity-90 transition-opacity"
            style={{ backgroundImage: "linear-gradient(106.356deg, rgb(0, 51, 42) 2.627%, rgb(3, 116, 96) 90.77%)" }}
          >
            <svg className="size-[19px]" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <path d={searchSvgPaths.p2ad10f00} fill="#C0E8D7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Right side - Notification Bell with Badge */}
      <div className="relative flex items-center gap-[8px]">
        <button 
          ref={bellButtonRef} 
          onClick={onNotificationClick} 
          className={`relative p-2 rounded-lg transition-colors ${isNotificationOpen ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
        >
          <NotificationBell isNotificationOpen={isNotificationOpen} />
        </button>
        
        {/* Persona Switcher */}
        <PersonaSwitcher />
      </div>
    </div>
  );
}

function NotificationBell({ isNotificationOpen }: { isNotificationOpen?: boolean }) {
  return (
    <div className="relative size-[18px]">
      {/* Bell Icon */}
      <div className="absolute left-0 size-[18px] top-px">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <g id="bell-01">
            <path d={bellSvgPaths.p270b7f80} id="Icon" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
      
      {/* Red Badge - Avatar online indicator */}
      <div className="absolute bg-[#b81313] left-[10px] rounded-[9999px] size-[8px] top-0">
        <div aria-hidden="true" className="absolute border-[#f5f5f5] border-[1.5px] border-solid inset-[-1.5px] pointer-events-none rounded-[10000.5px]" />
      </div>
    </div>
  );
}
