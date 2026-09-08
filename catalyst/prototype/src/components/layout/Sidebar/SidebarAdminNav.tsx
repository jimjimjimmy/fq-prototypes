import { ChevronDown } from '@/components/shared/SidebarIcons';
import type { PageName } from '@/types';
import type { AdminAccordion } from '@/hooks/use-sidebar';

interface SidebarAdminNavProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
  setCurrentPage: (page: PageName) => void;
  onBackToWorkspace: () => void;
  expandedSection: AdminAccordion | null;
  onAccordionToggle: (accordion: AdminAccordion) => void;
}

const platformSettings = [
  { label: 'Workflows', hasPage: true },
  { label: 'Entities' },
  { label: 'Team Members' },
  { label: 'Roles' },
  { label: 'Groups' },
  { label: 'API Keys' },
  { label: 'AI' },
  { label: 'Connections' },
];

const closeSettingsItems = [
  'Checklist', 'Reconciliations', 'Intercompany', 'Journal Entries', 'Variance Analysis',
];

const productAccordions: { key: AdminAccordion; label: string }[] = [
  { key: 'close', label: 'Close' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'reporting', label: 'Reporting' },
  { key: 'opsWorkflow', label: 'Ops Workflow' },
];

export function SidebarAdminNav({
  activeItem, setActiveItem, setCurrentPage, onBackToWorkspace,
  expandedSection, onAccordionToggle,
}: SidebarAdminNavProps) {
  return (
    <>
      {/* Back to Workspace */}
      <button
        onClick={onBackToWorkspace}
        className="flex items-center gap-[6px] px-[10px] py-[8px] -mt-[8px] hover:opacity-80 transition-opacity"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
          <path d="M7.5 9L4.5 6L7.5 3" stroke="#C0E8D7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="font-['Inter',sans-serif] font-medium text-[12px] leading-[18px] text-[#c0e8d7]">
          Back to Workspace
        </p>
      </button>

      {/* Admin Settings Header */}
      <div className="flex flex-col">
        <div className="h-[38px] flex items-center px-[10px]">
          <p className="font-['Inter',sans-serif] font-bold leading-[18px] text-white tracking-[-0.12px] text-[15px]">Admin Settings</p>
        </div>
      </div>

      {/* Platform Settings Section */}
      <div className="flex flex-col">
        <div className="h-[30px] flex items-center px-[10px]">
          <p className="font-['Inter',sans-serif] font-bold leading-[18px] text-[#769583] text-[11px] tracking-[1px] uppercase">Platform Settings</p>
        </div>
        {platformSettings.map(({ label, hasPage }) => (
          <button
            key={label}
            onClick={() => {
              setActiveItem(label);
              if (hasPage) setCurrentPage(label as PageName);
            }}
            className={`h-[38px] rounded-[6px] w-full px-[10px] text-left transition-colors hover:bg-[#027965]/40 ${activeItem === label ? 'bg-[#027965]/40' : ''}`}
          >
            <p className="font-['Inter',sans-serif] font-medium leading-[18px] text-[#f3faf4] text-[14px] tracking-[-0.12px]">
              {label}
            </p>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] opacity-60 bg-[#D1D5DB]"></div>

      {/* Product Settings Section (Accordion Group) */}
      <div className="flex flex-col">
        <div className="h-[30px] flex items-center px-[10px]">
          <p className="font-['Inter',sans-serif] font-bold leading-[18px] text-[#769583] text-[11px] tracking-[1px] uppercase">Product Settings</p>
        </div>

        {productAccordions.map(({ key, label }) => (
          <div key={key} className="flex flex-col">
            <button
              onClick={() => onAccordionToggle(key)}
              className="h-[38px] rounded-[6px] w-full flex items-center justify-between px-[10px] transition-colors hover:bg-[#027965]/40"
            >
              <p className="font-['Inter',sans-serif] font-medium leading-[18px] text-[14px] tracking-[-0.12px] text-[#f3faf4]">
                {label}
              </p>
              <div className={`flex items-center justify-center size-[16px] transition-transform ${expandedSection === key ? '' : '-rotate-90'}`}>
                <ChevronDown />
              </div>
            </button>

            {key === 'close' && expandedSection === key && (
              <div className="flex flex-col pl-[22px] pt-[8px] gap-[0px]">
                <div className="flex flex-col pt-[4px]">
                  {closeSettingsItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveItem(`${item} Settings`)}
                      className="h-[36px] px-[12px] text-left rounded-[6px] hover:bg-[#027965]/40 transition-colors font-['Inter',sans-serif] font-normal text-[14px] text-[#F3FAF4]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
