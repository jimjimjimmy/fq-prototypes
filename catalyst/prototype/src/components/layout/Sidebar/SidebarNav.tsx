import { HoverPanelTrigger } from '@/components/shared/HoverPanelTrigger';
import { PinnedItemsPanel } from '@/components/PinnedItemsPanel';
import { AgentsPanel } from '@/components/AgentsPanel';
import { DefenderPanel } from '@/components/DefenderPanel';
import {
  HomeLine, CheckDone, Folder, Bookmark, Star,
  AgentsIcon, Signal, CheckSquare, Award, FileIcon,
  Dataflow, ChevronDown,
} from '@/components/shared/SidebarIcons';
import type { PageName } from '@/types';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`h-[38px] rounded-[6px] w-full flex items-center transition-colors hover:bg-[#027965]/40 gap-[8px] px-[10px] ${isActive ? 'bg-[#027965]/40' : ''}`}
      >
        <div className="shrink-0">{icon}</div>
        <p className="capitalize font-['Inter',sans-serif] font-medium leading-[18px] text-[#f3faf4] text-[14px] tracking-[-0.12px]">
          {label}
        </p>
      </button>
    </div>
  );
}

function NavItemWithChevron({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`h-[38px] rounded-[6px] w-full flex items-center transition-colors hover:bg-[#027965]/40 justify-between px-[10px] ${isActive ? 'bg-[#027965]/40' : ''}`}
      >
        <div className="flex items-center gap-[8px] overflow-hidden">
          <div className="shrink-0">{icon}</div>
          <p className="capitalize font-['Inter',sans-serif] font-medium leading-[18px] text-[#f3faf4] text-[14px] tracking-[-0.12px] whitespace-nowrap">
            {label}
          </p>
        </div>
        <div className="flex items-center justify-center size-[16px]">
          <div className="-rotate-90">
            <ChevronDown />
          </div>
        </div>
      </button>
    </div>
  );
}

interface SidebarNavProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
  setCurrentPage: (page: PageName) => void;
  isCloseExpanded: boolean;
  setIsCloseExpanded: (expanded: boolean) => void;
}

const closeSubItems = [
  'Close Workspace', 'Folders', 'Checklist', 'Reconciliations', 'Recs (AG Grid)',
  'Rec Items', 'Intercompany', 'Journal Entries', 'Variance Analysis',
];

export function SidebarNav({
  activeItem, setActiveItem, setCurrentPage,
  isCloseExpanded, setIsCloseExpanded,
}: SidebarNavProps) {
  return (
    <>
      {/* Main Navigation */}
      <div className="flex flex-col">
        <NavItem icon={<HomeLine />} label="Home" isActive={activeItem === 'Home'}
          onClick={() => { setActiveItem('Home'); setCurrentPage('Home'); }} />
        <NavItem icon={<CheckDone />} label="Tasks" isActive={activeItem === 'Tasks'}
          onClick={() => { setActiveItem('Tasks'); setCurrentPage('Tasks'); }} />
        <NavItem icon={<Folder />} label="Documents" isActive={false}
          onClick={() => setActiveItem('Documents')} />
        <HoverPanelTrigger panel={(maxHeight) => <PinnedItemsPanel maxHeight={maxHeight} />} gap={22}>
          {/* Pinned Items hover zone */}
        </HoverPanelTrigger>
      </div>

      {/* Automation Section */}
      <div className="flex flex-col">
        <div className="h-[38px] flex items-center px-[10px]">
          <p className="font-['Inter',sans-serif] font-bold leading-[18px] text-[#769583] text-[11px] tracking-[1px] uppercase">Automation</p>
        </div>
        <NavItem icon={<Star />} label="Transform" isActive={false}
          onClick={() => setActiveItem('Transform')} />
        <HoverPanelTrigger panel={(maxHeight) => <AgentsPanel maxHeight={maxHeight} />} gap={22}>
          <NavItem icon={<AgentsIcon />} label="Agents" isActive={activeItem === 'Agents'}
            onClick={() => setActiveItem('Agents')} />
        </HoverPanelTrigger>
        <HoverPanelTrigger panel={(maxHeight) => <DefenderPanel maxHeight={maxHeight} />} gap={22}>
          <NavItem icon={<Signal />} label="Defender" isActive={activeItem === 'Defender'}
            onClick={() => setActiveItem('Defender')} />
        </HoverPanelTrigger>
      </div>

      {/* Products Section */}
      <div className="flex flex-col">
        <div className="h-[38px] flex items-center px-[10px]">
          <p className="font-['Inter',sans-serif] font-bold leading-[18px] text-[#769583] text-[11px] tracking-[1px] uppercase">Products</p>
        </div>

        {/* Close Section - Expandable */}
        <div className="flex flex-col">
          <button
            onClick={() => setIsCloseExpanded(!isCloseExpanded)}
            className="h-[38px] rounded-[6px] w-full flex items-center justify-between px-[10px] transition-colors hover:bg-[#027965]/40"
          >
            <div className="flex items-center gap-[8px]">
              <div className="shrink-0"><CheckSquare /></div>
              <p className="capitalize font-['Inter',sans-serif] font-medium leading-[18px] text-[14px] tracking-[-0.12px] text-[#f3faf4]">
                Close
              </p>
            </div>
            <div className={`flex items-center justify-center size-[16px] transition-transform ${isCloseExpanded ? '' : '-rotate-90'}`}>
              <ChevronDown />
            </div>
          </button>

          {isCloseExpanded && (
            <div className="flex flex-col pl-[22px] pt-[8px] gap-[0px]">
              <div className="flex flex-col pt-[4px]">
                {closeSubItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveItem(item);
                      if (item === 'Reconciliations') setCurrentPage('Reconciliations');
                      if (item === 'Recs (AG Grid)') setCurrentPage('ReconciliationsAG');
                      if (item === 'Rec Items') setCurrentPage('ReconcilingItems');
                    }}
                    className={`h-[36px] px-[12px] text-left rounded-[6px] hover:bg-[#027965]/40 transition-colors font-['Inter',sans-serif] font-normal text-[14px] text-[#F3FAF4] ${activeItem === item ? 'bg-[#027965]/40' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <NavItemWithChevron icon={<Award />} label="Compliance" isActive={activeItem === 'Compliance'}
          onClick={() => setActiveItem('Compliance')} />
        <NavItemWithChevron icon={<FileIcon />} label="Reporting" isActive={activeItem === 'Reporting'}
          onClick={() => setActiveItem('Reporting')} />
        <NavItemWithChevron icon={<Dataflow />} label="Ops Workflow" isActive={activeItem === 'Ops Workflow'}
          onClick={() => setActiveItem('Ops Workflow')} />
      </div>
    </>
  );
}
