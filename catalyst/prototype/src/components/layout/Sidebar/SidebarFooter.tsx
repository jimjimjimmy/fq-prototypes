import { SettingsIcon } from '@/components/shared/SidebarIcons';

interface SidebarFooterProps {
  navMode: 'workspace' | 'admin';
  activeItem: string;
  onSettingsClick: () => void;
}

export function SidebarFooter({ navMode, activeItem, onSettingsClick }: SidebarFooterProps) {
  if (navMode !== 'workspace') return null;

  return (
    <div className="flex flex-col px-[16px] pb-[24px] shrink-0">
      <button
        onClick={onSettingsClick}
        className={`h-[38px] rounded-[6px] w-full flex items-center gap-[8px] px-[10px] transition-colors hover:bg-[#027965]/40 ${activeItem === 'Settings' ? 'bg-[#027965]/40' : ''}`}
      >
        <div className="shrink-0"><SettingsIcon /></div>
        <p className="capitalize font-['Inter',sans-serif] font-medium leading-[18px] text-[#f3faf4] text-[14px] tracking-[-0.12px]">
          Settings
        </p>
      </button>
    </div>
  );
}
