export type TaskStatus = 'Not Started' | 'In Progress' | 'Ready for Review' | 'Blocked' | 'Complete';

export interface AgentRecord {
  agentName: string;
  action: string;
  timestamp: string;
}

export interface StatusChange {
  from: TaskStatus;
  to: TaskStatus;
  changedBy: string;
  timestamp: string;
}

export interface Task {
  id: number;
  name: string;
  type: string;
  status: TaskStatus;
  dueDate: string;
  preparer: string;
  reviewer: string;
  tags: string[];
  agentStatus: string | null;
  attachments?: number;
  comments?: number;
  journals?: number;
  startDate?: string;
  dependencies?: number[];
  processGroup?: string;
  agents?: string[];
  statusHistory?: StatusChange[];
  agentHistory?: AgentRecord[];
}

export interface ActiveFilters {
  statuses: string[];
  types: string[];
  preparers: string[];
  reviewers: string[];
  agentStatuses: string[];
  dueDateRange: 'all' | 'late' | 'today' | 'thisWeek' | 'upcoming';
  tags: string[];
}

export type SortableColumn = 'type' | 'status' | 'dueDate' | 'preparer' | 'reviewer' | 'agentStatus';

export const emptyFilters: ActiveFilters = {
  statuses: [],
  types: [],
  preparers: [],
  reviewers: [],
  agentStatuses: [],
  dueDateRange: 'all',
  tags: [],
};
