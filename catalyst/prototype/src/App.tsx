import { Component, type ErrorInfo, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Toaster } from 'sonner';

class PageErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Page error:', error, info); }
  render() {
    if (this.state.error) {
      const msg = (this.state.error as Error).message;
      return (
        <div style={{ padding: '40px', fontFamily: 'Inter, sans-serif', color: '#1d2433' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Something went wrong loading this page</h2>
          <pre style={{ background: '#f8fafc', border: '1px solid #e1e6ef', borderRadius: '6px', padding: '16px', fontSize: '12px', color: '#424867', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{msg}</pre>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: '16px', padding: '8px 16px', background: '#186749', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/Header';
import { SearchModal } from './components/SearchModal';
import { AIPanel } from './components/AIPanel';
import { Dashboard } from './components/dashboard/Dashboard';
import { TaskManagement } from './components/TaskManagement';
import { WorkflowManagement } from './components/WorkflowManagement';
import { ReconciliationsPage } from './components/reconciliations/ReconciliationsPage';
import { ReconciliationsPageAG } from './components/reconciliations/ReconciliationsPageAG';
import { ReconcilingItemsPageAG } from './components/reconciliations/ReconcilingItemsPageAG';
import { ConfigureFieldsPage } from './components/reconciliations/ConfigureFieldsPage';
import { NotificationDropdown } from './components/NotificationDropdown';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { UIProvider, useUI } from './contexts/UIContext';
import { PersonaProvider } from './contexts/PersonaContext';
import { AgingBucketsProvider } from './contexts/AgingBucketsContext';
import { TaskStoreProvider } from './runtime/TaskStore';

export default function App() {
  return (
    <PersonaProvider>
      <NavigationProvider>
        <UIProvider>
          <AgingBucketsProvider>
            <TaskStoreProvider>
              <AppContent />
            </TaskStoreProvider>
          </AgingBucketsProvider>
        </UIProvider>
      </NavigationProvider>
    </PersonaProvider>
  );
}

function AppContent() {
  const { currentPage, selectedTaskId, taskInitialView, taskInitialSort, taskInitialFilter, taskKey } = useNavigation();
  const {
    isSidebarCollapsed, toggleSidebar,
    isSearchOpen, setSearchOpen,
    isAIPanelOpen, toggleAIPanel, closeAIPanel,
    isNotificationOpen, toggleNotification, closeNotification,
    searchButtonRef, bellButtonRef,
  } = useUI();

  return (
    <div className="flex h-screen bg-neutral-100">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebar} />

      <div className="flex flex-col flex-1 min-w-0">
        <Header
          onSearchClick={() => setSearchOpen(true)}
          onAIClick={toggleAIPanel}
          onNotificationClick={toggleNotification}
          searchButtonRef={searchButtonRef}
          bellButtonRef={bellButtonRef}
          isNotificationOpen={isNotificationOpen}
        />

        <motion.div
          className="flex-1 overflow-hidden bg-[#f9fafb] min-w-0"
          animate={{ marginRight: isAIPanelOpen ? '386px' : '0' }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {currentPage === 'Home' && <Dashboard />}
          {currentPage === 'Tasks' && <TaskManagement key={taskKey} selectedTaskId={selectedTaskId} initialView={taskInitialView} initialSort={taskInitialSort} initialFilter={taskInitialFilter} />}
          {currentPage === 'Workflows' && <WorkflowManagement />}
          {currentPage === 'Reconciliations' && <ReconciliationsPage />}
          {currentPage === 'ReconciliationsAG' && <ReconciliationsPageAG />}
          {currentPage === 'ReconcilingItems' && <PageErrorBoundary><ReconcilingItemsPageAG /></PageErrorBoundary>}
          {currentPage === 'ConfigureFields' && <ConfigureFieldsPage />}
        </motion.div>
      </div>

      <motion.div
        className="fixed right-0 w-[386px]"
        style={{ top: '55px', height: 'calc(100vh - 55px)' }}
        initial={{ x: '100%' }}
        animate={{ x: isAIPanelOpen ? 0 : '100%' }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {isAIPanelOpen && (
          <div className="h-full p-[6px]">
            <AIPanel isOpen={isAIPanelOpen} onClose={closeAIPanel} />
          </div>
        )}
      </motion.div>

      {isSearchOpen && (
        <SearchModal onClose={() => setSearchOpen(false)} searchButtonRef={searchButtonRef} />
      )}

      {isNotificationOpen && (
        <NotificationDropdown onClose={closeNotification} bellButtonRef={bellButtonRef} />
      )}

      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
