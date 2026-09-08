import { useState } from 'react';
import type { Task, ActiveFilters } from '@/types';
import { emptyFilters } from '@/types';
import { today, parseTaskDate } from '@/data/tasks';

export function hasActiveFilters(filters: ActiveFilters): boolean {
  return (
    filters.statuses.length > 0 ||
    filters.types.length > 0 ||
    filters.preparers.length > 0 ||
    filters.reviewers.length > 0 ||
    filters.agentStatuses.length > 0 ||
    filters.dueDateRange !== 'all' ||
    filters.tags.length > 0
  );
}

export function getActiveFilterCount(filters: ActiveFilters): number {
  let count = 0;
  count += filters.statuses.length;
  count += filters.types.length;
  count += filters.preparers.length;
  count += filters.reviewers.length;
  count += filters.agentStatuses.length;
  if (filters.dueDateRange !== 'all') count += 1;
  count += filters.tags.length;
  return count;
}

export function applyFilters(taskList: Task[], filters: ActiveFilters): Task[] {
  return taskList.filter(task => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) return false;
    if (filters.types.length > 0 && !filters.types.includes(task.type)) return false;
    if (filters.preparers.length > 0 && !filters.preparers.includes(task.preparer)) return false;
    if (filters.reviewers.length > 0 && !filters.reviewers.includes(task.reviewer)) return false;
    if (filters.agentStatuses.length > 0) {
      if (!task.agentStatus || !filters.agentStatuses.includes(task.agentStatus)) return false;
    }
    if (filters.tags.length > 0) {
      if (!filters.tags.some(tag => task.tags.includes(tag))) return false;
    }
    if (filters.dueDateRange !== 'all') {
      const dueDate = parseTaskDate(task.dueDate);

      switch (filters.dueDateRange) {
        case 'late':
          if (dueDate >= today || task.status === 'Complete') return false;
          break;
        case 'today':
          if (dueDate.getTime() !== today.getTime()) return false;
          break;
        case 'thisWeek': {
          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
          if (dueDate < today || dueDate > endOfWeek) return false;
          break;
        }
        case 'upcoming':
          if (dueDate <= today) return false;
          break;
      }
    }
    return true;
  });
}

export function dueDateLabel(range: string): string {
  switch (range) {
    case 'late': return 'Late Items';
    case 'today': return 'Due Today';
    case 'thisWeek': return 'This Week';
    case 'upcoming': return 'Upcoming';
    default: return 'All';
  }
}

export function useTaskFilters(initialFilter?: ActiveFilters | null) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(
    initialFilter ? { ...initialFilter } : { ...emptyFilters }
  );
  const [pendingFilters, setPendingFilters] = useState<ActiveFilters>(
    initialFilter ? { ...initialFilter } : { ...emptyFilters }
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleOpenFilter = () => {
    setPendingFilters({ ...activeFilters });
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilters = () => {
    setActiveFilters({ ...pendingFilters });
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setPendingFilters({ ...emptyFilters });
  };

  const handleClearAllFilters = () => {
    setActiveFilters({ ...emptyFilters });
    setPendingFilters({ ...emptyFilters });
  };

  const handleRemoveFilterPill = (category: string, value: string) => {
    const updated = { ...activeFilters };
    switch (category) {
      case 'status': updated.statuses = updated.statuses.filter(s => s !== value); break;
      case 'type': updated.types = updated.types.filter(t => t !== value); break;
      case 'preparer': updated.preparers = updated.preparers.filter(p => p !== value); break;
      case 'reviewer': updated.reviewers = updated.reviewers.filter(r => r !== value); break;
      case 'agentStatus': updated.agentStatuses = updated.agentStatuses.filter(a => a !== value); break;
      case 'dueDate': updated.dueDateRange = 'all'; break;
      case 'tag': updated.tags = updated.tags.filter(t => t !== value); break;
    }
    setActiveFilters(updated);
    setPendingFilters(updated);
  };

  const updateFilters = (filter: ActiveFilters) => {
    setActiveFilters({ ...filter });
    setPendingFilters({ ...filter });
  };

  return {
    activeFilters,
    pendingFilters,
    setPendingFilters,
    isFilterOpen,
    setIsFilterOpen,
    handleOpenFilter,
    handleApplyFilters,
    handleResetFilters,
    handleClearAllFilters,
    handleRemoveFilterPill,
    updateFilters,
  };
}
