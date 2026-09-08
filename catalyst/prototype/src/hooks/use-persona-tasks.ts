import { useMemo } from 'react';
import type { Task } from '@/types';
import { usePersona } from '@/contexts/PersonaContext';

/**
 * Filters tasks based on the active persona's taskFilter.
 * - Sarah Chen: sees tasks where she's preparer
 * - David Kim: sees tasks where he's reviewer
 * - Maria Rodriguez: sees all tasks (controller oversight)
 */
export function usePersonaTasks(tasks: Task[]): Task[] {
  const { activePersona } = usePersona();

  return useMemo(() => {
    const filter = activePersona.taskFilter;
    if (!filter) return tasks; // Maria sees everything

    return tasks.filter(t => {
      if (filter.preparers?.length && filter.preparers.includes(t.preparer)) return true;
      if (filter.reviewers?.length && filter.reviewers.includes(t.reviewer)) return true;
      return false;
    });
  }, [tasks, activePersona.taskFilter]);
}
