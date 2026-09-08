import { createContext, useContext, useState, useRef, type ReactNode, type RefObject } from 'react';

interface UIState {
  isSidebarCollapsed: boolean;
  isSearchOpen: boolean;
  isAIPanelOpen: boolean;
  isNotificationOpen: boolean;
  toggleSidebar: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleAIPanel: () => void;
  toggleNotification: () => void;
  closeAIPanel: () => void;
  closeSearch: () => void;
  closeNotification: () => void;
  searchButtonRef: RefObject<HTMLDivElement | null>;
  bellButtonRef: RefObject<HTMLButtonElement | null>;
}

const UIContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const searchButtonRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <UIContext.Provider value={{
      isSidebarCollapsed,
      isSearchOpen,
      isAIPanelOpen,
      isNotificationOpen,
      toggleSidebar: () => setIsSidebarCollapsed(prev => !prev),
      setSearchOpen: (open: boolean) => setIsSearchOpen(open),
      toggleAIPanel: () => setIsAIPanelOpen(prev => !prev),
      toggleNotification: () => setIsNotificationOpen(prev => !prev),
      closeAIPanel: () => setIsAIPanelOpen(false),
      closeSearch: () => setIsSearchOpen(false),
      closeNotification: () => setIsNotificationOpen(false),
      searchButtonRef,
      bellButtonRef,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
