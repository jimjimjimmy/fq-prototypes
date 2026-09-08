export type PageName = 'Home' | 'Tasks' | 'Workflows' | 'Reconciliations' | 'ReconciliationsAG' | 'ReconcilingItems' | 'ConfigureFields';
export type TaskView = 'board' | 'table' | 'timeline' | 'calendar';
export type TaskSort = { column: 'type' | 'status' | 'dueDate' | 'preparer' | 'reviewer' | 'agentStatus'; direction: 'asc' | 'desc' };
export type TaskFilter = { statuses: string[]; types: string[]; preparers: string[]; reviewers: string[]; agentStatuses: string[]; dueDateRange: 'all' | 'late' | 'today' | 'thisWeek' | 'upcoming'; tags: string[] };
