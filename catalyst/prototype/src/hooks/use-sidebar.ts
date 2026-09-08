import { useState } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import type { PageName } from '@/types';

export type AdminAccordion = 'close' | 'compliance' | 'reporting' | 'opsWorkflow';

export function useSidebar() {
  const { setCurrentPage } = useNavigation();
  const [activeItem, setActiveItem] = useState('Home');
  const [isCloseExpanded, setIsCloseExpanded] = useState(false);
  const [navMode, setNavMode] = useState<'workspace' | 'admin'>('workspace');
  const [previousPage, setPreviousPage] = useState('Home');
  const [expandedAdminSection, setExpandedAdminSection] = useState<AdminAccordion | null>(null);

  const handleCollapsedClick = (item: string, onToggleCollapse: () => void) => {
    if (item === 'Settings') {
      setPreviousPage(activeItem);
      setNavMode('admin');
      setActiveItem('Workflows');
      setCurrentPage('Workflows');
    } else {
      setActiveItem(item);
      setCurrentPage(item as PageName);
    }
    onToggleCollapse();
  };

  const handleSettingsClick = () => {
    if (navMode === 'admin') {
      setNavMode('workspace');
      setActiveItem(previousPage);
      setCurrentPage(previousPage as PageName);
    } else {
      setPreviousPage(activeItem);
      setNavMode('admin');
      setActiveItem('Workflows');
      setCurrentPage('Workflows');
    }
  };

  const handleBackToWorkspace = () => {
    setNavMode('workspace');
    setActiveItem(previousPage);
    setCurrentPage(previousPage as PageName);
  };

  const handleAdminAccordionToggle = (accordion: AdminAccordion) => {
    setExpandedAdminSection(prev => prev === accordion ? null : accordion);
  };

  return {
    activeItem,
    setActiveItem,
    isCloseExpanded,
    setIsCloseExpanded,
    navMode,
    expandedAdminSection,
    setCurrentPage,
    handleCollapsedClick,
    handleSettingsClick,
    handleBackToWorkspace,
    handleAdminAccordionToggle,
  };
}
