import { useState, useEffect } from 'react';
import type { ActiveFilters } from '@/types';
import { useTaskStore } from '@/runtime/TaskStore';
import { BoardSkeleton, TableSkeleton, TimelineSkeleton, CalendarSkeleton } from './tasks/TaskSkeletons';
import { useTaskFilters, hasActiveFilters, applyFilters } from '@/hooks/use-task-filters';
import { useTaskSort, sortTasks } from '@/hooks/use-task-sort';
import { usePersonaTasks } from '@/hooks/use-persona-tasks';
import { usePagination } from '@/hooks/use-pagination';
import { TaskToolbar } from './tasks/TaskToolbar';
import { BoardView } from './tasks/views/BoardView';
import { TableView } from './tasks/views/TableView';
import { TimelineView } from './tasks/views/TimelineView';
import { CalendarView } from './tasks/views/calendar/CalendarView';
import { TaskDrilldown } from './TaskDrilldown';

interface TaskManagementProps {
  selectedTaskId?: number | null;
  initialView?: 'table' | 'board' | 'timeline' | 'calendar';
  initialSort?: { column: 'type' | 'status' | 'dueDate' | 'preparer' | 'reviewer' | 'agentStatus'; direction: 'asc' | 'desc' } | null;
  initialFilter?: ActiveFilters | null;
}

export function TaskManagement({ selectedTaskId: initialTaskId, initialView, initialSort, initialFilter }: TaskManagementProps = {}) {
  const { state, isLoading } = useTaskStore();
  const tasks = usePersonaTasks(state.tasks);

  const [view, setView] = useState<'table' | 'board' | 'timeline' | 'calendar'>(initialView || 'board');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(initialTaskId || null);

  const filters = useTaskFilters(initialFilter);
  const sort = useTaskSort(initialSort);
  const pagination = usePagination(15);

  useEffect(() => { if (initialTaskId !== undefined && initialTaskId !== selectedTaskId) setSelectedTaskId(initialTaskId); }, [initialTaskId]);
  useEffect(() => { if (initialView) setView(initialView); }, [initialView]);
  useEffect(() => { if (initialSort) { sort.setSortColumn(initialSort.column); sort.setSortDirection(initialSort.direction); } }, [initialSort]);
  useEffect(() => { if (initialFilter) { filters.updateFilters(initialFilter); pagination.resetPage(); } }, [initialFilter]);

  if (selectedTaskId !== null) {
    return <TaskDrilldown taskId={selectedTaskId} onBack={() => setSelectedTaskId(null)} />;
  }

  const filteredTasks = hasActiveFilters(filters.activeFilters) ? applyFilters(tasks, filters.activeFilters) : tasks;
  const sortedTasks = sortTasks(filteredTasks, sort.sortColumn, sort.sortDirection);
  const { paginatedItems: paginatedTasks, totalPages } = pagination.paginate(sortedTasks);

  const handleSort = (column: typeof sort.sortColumn & string) => {
    sort.handleSort(column as any);
    pagination.resetPage();
  };

  const handleApplyFilters = () => { filters.handleApplyFilters(); pagination.resetPage(); };
  const handleApplyFiltersDirect = (f: ActiveFilters) => { filters.updateFilters(f); pagination.resetPage(); };
  const handleClearAllFilters = () => { filters.handleClearAllFilters(); pagination.resetPage(); };
  const handleRemoveFilterPill = (category: string, value: string) => { filters.handleRemoveFilterPill(category, value); pagination.resetPage(); };

  return (
    <div className="flex flex-col h-full bg-[#f9fafb] overflow-x-hidden min-w-0">
      <TaskToolbar
        view={view}
        onViewChange={setView}
        isFilterOpen={filters.isFilterOpen}
        onToggleFilter={filters.handleOpenFilter}
        activeFilters={filters.activeFilters}
        pendingFilters={filters.pendingFilters}
        onPendingFiltersChange={filters.setPendingFilters}
        onApplyFilters={handleApplyFilters}
        onApplyFiltersDirect={handleApplyFiltersDirect}
        onResetFilters={filters.handleResetFilters}
        onCloseFilter={() => filters.setIsFilterOpen(false)}
        onClearAllFilters={handleClearAllFilters}
        onRemoveFilterPill={handleRemoveFilterPill}
        totalTasks={tasks.length}
        filteredCount={sortedTasks.length}
        tasks={tasks}
      />

      <div className="flex-1 min-h-0 overflow-hidden">
        {isLoading ? (
          view === 'table' ? <TableSkeleton /> :
          view === 'timeline' ? <TimelineSkeleton /> :
          view === 'calendar' ? <CalendarSkeleton /> :
          <BoardSkeleton />
        ) : (<>
        {view === 'table' && (
          <TableView
            tasks={paginatedTasks}
            onSelectTask={setSelectedTaskId}
            currentPage={pagination.currentPage}
            totalPages={totalPages}
            rowsPerPage={pagination.rowsPerPage}
            onPageChange={pagination.setCurrentPage}
            onRowsPerPageChange={pagination.setRowsPerPage}
            sortColumn={sort.sortColumn}
            sortDirection={sort.sortDirection}
            onSort={handleSort}
          />
        )}
        {view === 'board' && <BoardView tasks={hasActiveFilters(filters.activeFilters) ? filteredTasks : tasks} onSelectTask={setSelectedTaskId} />}
        {view === 'timeline' && <TimelineView tasks={hasActiveFilters(filters.activeFilters) ? filteredTasks : tasks} onSelectTask={setSelectedTaskId} />}
        {view === 'calendar' && <CalendarView tasks={hasActiveFilters(filters.activeFilters) ? filteredTasks : tasks} onSelectTask={setSelectedTaskId} />}
        </>)}
      </div>
    </div>
  );
}
