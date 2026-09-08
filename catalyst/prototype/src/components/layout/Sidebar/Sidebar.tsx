import svgPaths from '@/imports/svg-cqmswwi8va';
import { AnimatePresence, motion } from 'motion/react';
import { useSidebar } from '@/hooks/use-sidebar';
import { SidebarCollapsed } from './SidebarCollapsed';
import { SidebarNav } from './SidebarNav';
import { SidebarAdminNav } from './SidebarAdminNav';
import { SidebarFooter } from './SidebarFooter';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const {
    activeItem, setActiveItem, isCloseExpanded, setIsCloseExpanded,
    navMode, expandedAdminSection, setCurrentPage,
    handleCollapsedClick, handleSettingsClick, handleBackToWorkspace, handleAdminAccordionToggle,
  } = useSidebar();

  if (isCollapsed) {
    return (
      <SidebarCollapsed
        activeItem={activeItem}
        navMode={navMode}
        onItemClick={(item) => handleCollapsedClick(item, onToggleCollapse)}
      />
    );
  }

  return (
    <div
      className="bg-gradient-to-b from-[#014a3d] to-[#00332a] border-r border-[#1d583f] flex flex-col transition-all duration-[280ms] ease-in-out shrink-0"
      style={{ flex: '0 0 240px', width: '240px', minWidth: '240px', maxWidth: '240px' }}
    >
      {/* Header with Logo */}
      <div className="h-[85px] flex items-center justify-between px-[22px] shrink-0">
        <div className="flex items-center gap-[12px]">
          <div className="bg-[#0c1e18] flex items-center justify-center rounded-[7.5px] size-[36px]">
            <div className="relative size-[24px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 23.9986 13.3624">
                <g id="Group">
                  <path d={svgPaths.p27237800} fill="#90E39A" id="Vector" />
                  <path d={svgPaths.p33ad7900} fill="white" id="FQ" />
                </g>
              </svg>
            </div>
          </div>
          <p className="font-['Museo_Sans:900',sans-serif] font-bold leading-[22.5px] text-white text-[15px]">FloQast</p>
        </div>
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#027965]/40 transition-colors"
          aria-label="Collapse sidebar"
        >
          <svg className="w-2.5 h-2.5" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5 8.16667">
            <path
              d={svgPaths.p2746600}
              stroke="#C0E8D7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.2"
            />
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-[18px] px-[16px] pt-[24px] flex-1 overflow-y-auto scrollbar-hide nav-no-scrollbar">
        <AnimatePresence mode="wait">
          {navMode === 'workspace' ? (
            <motion.div
              key="workspace-nav"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex flex-col gap-[18px]"
            >
              <SidebarNav
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                setCurrentPage={setCurrentPage}
                isCloseExpanded={isCloseExpanded}
                setIsCloseExpanded={setIsCloseExpanded}
              />
            </motion.div>
          ) : (
            <motion.div
              key="admin-nav"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex flex-col gap-[18px]"
            >
              <SidebarAdminNav
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                setCurrentPage={setCurrentPage}
                onBackToWorkspace={handleBackToWorkspace}
                expandedSection={expandedAdminSection}
                onAccordionToggle={handleAdminAccordionToggle}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <SidebarFooter navMode={navMode} activeItem={activeItem} onSettingsClick={handleSettingsClick} />
    </div>
  );
}
