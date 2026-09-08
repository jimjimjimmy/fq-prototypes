import { useState } from 'react';
import type { Task, SortableColumn } from '@/types';

const statusOrder: Record<string, number> = {
  'Not Started': 0, 'In Progress': 1, 'Ready for Review': 2, 'Blocked': 3, 'Complete': 4,
};

function parseDateStr(dateStr: string): number {
  const monthMap: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11,
  };
  const parts = dateStr.split(' ');
  if (parts.length !== 2) return 0;
  const month = monthMap[parts[0]] ?? 0;
  const day = parseInt(parts[1], 10) || 0;
  return new Date(2026, month, day).getTime();
}

export function sortTasks(tasks: Task[], column: SortableColumn | null, direction: 'asc' | 'desc'): Task[] {
  if (!column) return tasks;
  return [...tasks].sort((a, b) => {
    let comparison = 0;
    switch (column) {
      case 'type': comparison = a.type.localeCompare(b.type); break;
      case 'status': comparison = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0); break;
      case 'dueDate': comparison = parseDateStr(a.dueDate) - parseDateStr(b.dueDate); break;
      case 'preparer': comparison = a.preparer.localeCompare(b.preparer); break;
      case 'reviewer': comparison = a.reviewer.localeCompare(b.reviewer); break;
      case 'agentStatus': comparison = (a.agentStatus || '').localeCompare(b.agentStatus || ''); break;
    }
    return direction === 'asc' ? comparison : -comparison;
  });
}

export function useTaskSort(initialSort?: { column: SortableColumn; direction: 'asc' | 'desc' } | null) {
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(initialSort?.column || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSort?.direction || 'asc');

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection('asc');
      } else {
        setSortDirection('desc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return { sortColumn, sortDirection, handleSort, setSortColumn, setSortDirection };
}
