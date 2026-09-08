import { useState, useRef, useEffect } from 'react';
import svgPathsSlim from '@/imports/svg-2zc8u13p0h';
import { HoverPanelTrigger } from '@/components/shared/HoverPanelTrigger';
import { PinnedItemsPanel } from '@/components/PinnedItemsPanel';
import { AgentsPanel } from '@/components/AgentsPanel';
import { DefenderPanel } from '@/components/DefenderPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import {
  HomeLine, CheckDone, Folder, Bookmark, Star,
  AgentsIcon, Signal, CheckSquare, Award, FileIcon,
  Dataflow, SettingsIcon,
} from '@/components/shared/SidebarIcons';

interface SlimNavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function SlimNavButton({ icon, label, isActive, onClick }: SlimNavButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showTooltip && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 5
      });
    }
  }, [showTooltip]);

  return (
    <div className="relative group">
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`h-[38px] w-[48px] rounded-[6px] flex items-center justify-center p-[8px] transition-colors hover:bg-[#027965]/40 ${isActive ? 'bg-[#027965]/40' : ''}`}
      >
        {icon}
      </button>
      {showTooltip && (
        <div
          className="fixed z-50 pointer-events-none -translate-y-1/2"
          style={{ top: `${tooltipPos.top}px`, left: `${tooltipPos.left}px` }}
        >
          <div className="bg-[#00221C] text-white px-[12px] py-[8px] rounded-[6px] shadow-lg whitespace-nowrap">
            <p className="font-['Inter',sans-serif] font-medium text-[11px] leading-[18px]">
              {label}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface SidebarCollapsedProps {
  activeItem: string;
  navMode: 'workspace' | 'admin';
  onItemClick: (item: string) => void;
}

export function SidebarCollapsed({ activeItem, navMode, onItemClick }: SidebarCollapsedProps) {
  return (
    <div className="bg-gradient-to-b from-[#014a3d] to-[#00332a] border-r border-[#1d583f] flex flex-col w-[60px] transition-all duration-[280ms] ease-in-out">
      {/* Header with Logo - Centered */}
      <div className="h-[85px] flex flex-col items-center justify-center px-[20px] shrink-0">
        <div className="bg-[#13362a] flex items-center justify-center rounded-[7.5px] size-[36px]">
          <div className="relative size-[24px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 23.9986 13.3624">
              <g id="Group">
                <path d={svgPathsSlim.p27237800} fill="#90E39A" id="Vector" />
                <path d={svgPathsSlim.p33ad7900} fill="white" id="FQ" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-[18px] pt-[24px] flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="flex flex-col items-center px-[16px]">
          <SlimNavButton icon={<HomeLine />} label="Home" isActive={activeItem === 'Home'} onClick={() => onItemClick('Home')} />
          <SlimNavButton icon={<CheckDone />} label="Tasks" isActive={false} onClick={() => onItemClick('Tasks')} />
          <SlimNavButton icon={<Folder />} label="Documents" isActive={false} onClick={() => onItemClick('Documents')} />
          <HoverPanelTrigger panel={(maxHeight) => <PinnedItemsPanel maxHeight={maxHeight} />} gap={11} viewportPadding={11}>
            <SlimNavButton icon={<Bookmark />} label="Pinned Items" isActive={activeItem === 'Pinned Items'} onClick={() => onItemClick('Pinned Items')} />
          </HoverPanelTrigger>
        </div>

        {/* Automation Section */}
        <div className="flex flex-col items-center px-[16px] pt-[20px]">
          <SlimNavButton icon={<Star />} label="Transform" isActive={false} onClick={() => onItemClick('Transform')} />
          <HoverPanelTrigger panel={(maxHeight) => <AgentsPanel maxHeight={maxHeight} />} gap={11} viewportPadding={11}>
            <SlimNavButton icon={<AgentsIcon />} label="Agents" isActive={activeItem === 'Agents'} onClick={() => onItemClick('Agents')} />
          </HoverPanelTrigger>
          <HoverPanelTrigger panel={(maxHeight) => <DefenderPanel maxHeight={maxHeight} />} gap={11} viewportPadding={11}>
            <SlimNavButton icon={<Signal />} label="Defender" isActive={activeItem === 'Defender'} onClick={() => onItemClick('Defender')} />
          </HoverPanelTrigger>
        </div>

        {/* Products Section */}
        <div className="flex flex-col items-center px-[16px] pt-[20px]">
          <SlimNavButton icon={<CheckSquare />} label="Close" isActive={false} onClick={() => onItemClick('Close')} />
          <SlimNavButton icon={<Award />} label="Compliance" isActive={false} onClick={() => onItemClick('Compliance')} />
          <SlimNavButton icon={<FileIcon />} label="Reporting" isActive={false} onClick={() => onItemClick('Reporting')} />
          <SlimNavButton icon={<Dataflow />} label="Ops Workflow" isActive={false} onClick={() => onItemClick('Ops Workflow')} />
        </div>
      </div>

      {/* Footer with Settings */}
      <div className="flex flex-col items-center px-[16px] pb-[24px] shrink-0">
        {navMode === 'workspace' && (
          <HoverPanelTrigger panel={(maxHeight) => <SettingsPanel maxHeight={maxHeight} />} gap={12} viewportPadding={12}>
            <SlimNavButton icon={<SettingsIcon />} label="Settings" isActive={activeItem === 'Settings'} onClick={() => onItemClick('Settings')} />
          </HoverPanelTrigger>
        )}
      </div>
    </div>
  );
}
