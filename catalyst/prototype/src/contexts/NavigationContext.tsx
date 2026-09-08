import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { PageName, TaskView, TaskSort, TaskFilter } from '@/types';

const HASH_PAGE_MAP: Record<string, PageName> = {
  'recs-ag': 'ReconciliationsAG',
  'recs': 'Reconciliations',
  'rec-items': 'ReconcilingItems',
  'tasks': 'Tasks',
  'workflows': 'Workflows',
};

interface NavigationContextType {
  currentPage: PageName;
  setCurrentPage: (page: PageName) => void;
  selectedTaskId: number | null;
  taskInitialView: TaskView;
  taskInitialSort: TaskSort | null;
  taskInitialFilter: TaskFilter | null;
  taskKey: number;
  navigateToTask: (taskId: number) => void;
  navigateToBlockedTasks: () => void;
  navigateToReadyForReviewTasks: () => void;
  navigateToLateTasks: () => void;
  navigateToDueTodayTasks: () => void;
  navigateToKanban: () => void;
  recItemsFilter: string | null;
  navigateToRecItems: (accountNumber: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function useNavigation(): NavigationContextType {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPageRaw] = useState<PageName>('Home');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [taskInitialView, setTaskInitialView] = useState<TaskView>('board');
  const [taskInitialSort, setTaskInitialSort] = useState<TaskSort | null>(null);
  const [taskInitialFilter, setTaskInitialFilter] = useState<TaskFilter | null>(null);
  const [taskKey, setTaskKey] = useState(0);
  const [recItemsFilter, setRecItemsFilter] = useState<string | null>(null);

  // Deep-link from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const page = HASH_PAGE_MAP[hash];
    if (page) setCurrentPageRaw(page);
  }, []);

  const setCurrentPage = useCallback((page: PageName) => {
    setCurrentPageRaw(page);
    if (page !== 'Tasks') {
      setSelectedTaskId(null);
    } else {
      // Navigating to Tasks page via sidebar — clear drilldown
      setSelectedTaskId(null);
      setTaskKey(prev => prev + 1);
    }
  }, []);

  const navigateToTask = useCallback((taskId: number) => {
    setCurrentPage('Tasks');
    setSelectedTaskId(taskId);
    setTaskInitialView('board');
    setTaskInitialSort(null);
    setTaskInitialFilter(null);
    setTaskKey(prev => prev + 1);
  }, []);

  const navigateToBlockedTasks = useCallback(() => {
    setCurrentPage('Tasks');
    setSelectedTaskId(null);
    setTaskInitialView('board');
    setTaskInitialSort(null);
    setTaskInitialFilter({
      statuses: ['Blocked'],
      types: [],
      preparers: [],
      reviewers: [],
      agentStatuses: [],
      dueDateRange: 'all',
      tags: [],
    });
  }, []);

  const navigateToReadyForReviewTasks = useCallback(() => {
    setCurrentPage('Tasks');
    setSelectedTaskId(null);
    setTaskInitialView('board');
    setTaskInitialSort(null);
    setTaskInitialFilter({
      statuses: ['Ready for Review'],
      types: [],
      preparers: [],
      reviewers: [],
      agentStatuses: [],
      dueDateRange: 'all',
      tags: [],
    });
  }, []);

  const navigateToLateTasks = useCallback(() => {
    setCurrentPage('Tasks');
    setSelectedTaskId(null);
    setTaskInitialView('table');
    setTaskInitialSort({ column: 'dueDate', direction: 'asc' });
    setTaskInitialFilter({
      statuses: [],
      types: [],
      preparers: [],
      reviewers: [],
      agentStatuses: [],
      dueDateRange: 'late',
      tags: [],
    });
  }, []);

  const navigateToDueTodayTasks = useCallback(() => {
    setCurrentPage('Tasks');
    setSelectedTaskId(null);
    setTaskInitialView('calendar');
    setTaskInitialSort(null);
    setTaskInitialFilter({
      statuses: [],
      types: [],
      preparers: [],
      reviewers: [],
      agentStatuses: [],
      dueDateRange: 'today',
      tags: [],
    });
  }, []);

  const navigateToKanban = useCallback(() => {
    setCurrentPage('Tasks');
    setSelectedTaskId(null);
    setTaskInitialView('board');
    setTaskInitialSort(null);
    setTaskInitialFilter(null);
  }, []);

  const navigateToRecItems = useCallback((accountNumber: string | null) => {
    setRecItemsFilter(accountNumber);
    setCurrentPageRaw('ReconcilingItems');
  }, []);

  return (
    <NavigationContext.Provider value={{
      currentPage,
      setCurrentPage,
      selectedTaskId,
      taskInitialView,
      taskInitialSort,
      taskInitialFilter,
      taskKey,
      navigateToTask,
      navigateToBlockedTasks,
      navigateToReadyForReviewTasks,
      navigateToLateTasks,
      navigateToDueTodayTasks,
      navigateToKanban,
      recItemsFilter,
      navigateToRecItems,
    }}>
      {children}
    </NavigationContext.Provider>
  );
}
