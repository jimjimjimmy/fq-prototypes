import type { TaskStatus } from './task';

export type WorkflowStageStatus = 'complete' | 'current' | 'pending' | 'skipped';
export type SubtaskStatus = 'complete' | 'in-progress' | 'pending';
export type DependencyType = 'blocked-by' | 'blocking' | 'related-to';
export type DependencyStatus = 'complete' | 'in-progress' | 'blocked' | 'not-started';
export type DetailTier = 1 | 2 | 3;

export interface WorkflowStage {
  id: string;
  label: string;
  status: WorkflowStageStatus;
  agent?: string;
}

export interface EvidenceItem {
  label: string;
  value: string;
}

export interface EvidenceSection {
  section: string;
  items: EvidenceItem[];
}

export interface ReviewNote {
  id: string;
  author: string;
  initials: string;
  time: string;
  message: string;
  isAgent?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  isAgentGenerated?: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  status: SubtaskStatus;
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
}

export interface TaskDependency {
  id: string;
  taskName: string;
  type: DependencyType;
  status: DependencyStatus;
  assignee: string;
  assigneeInitials: string;
}

export interface Assignee {
  name: string;
  initials: string;
  role: string;
  isPrimary?: boolean;
  badge: 'Preparer' | 'Reviewer';
}

export interface CriticalPath {
  isOnPath: boolean;
  downstreamTasks: number;
  pathDescription: string;
  upstream: { task: string; status: string; time?: string }[];
  downstream: { task: string; status: string; assignee?: string }[];
}

export interface RecommendedAutomation {
  id: string;
  title: string;
  description: string;
  confidence: 'High' | 'Medium' | 'Low';
  timeSaved: string;
}

export interface AutomationInsight {
  aiPreparedWork: string[];
  humanReviewedWork: string[];
  futureImprovements: string[];
}

export interface TaskDetail {
  tier: DetailTier;
  title: string;
  description: string;
  period: string;
  entity: string;
  folder: string;
  frequency: string;
  assignees: Assignee[];
  preparedByAgent?: string;
  currentStage: string;
  workflowStages: WorkflowStage[];
  whySurfaced?: string;
  systemVerified?: string[];
  aiPreparedWork?: string[];
  nextActionSteps?: string[];
  supportingEvidence?: EvidenceSection[];
  systemVerifiedSignals?: string[];
  aiVerifiedItems?: string[];
  requiresHumanReview?: string[];
  reviewRationale?: string;
  attachments?: Attachment[];
  reviewNotes?: ReviewNote[];
  subtasks?: Subtask[];
  dependencies?: TaskDependency[];
  criticalPath?: CriticalPath;
  recommendedAutomations?: RecommendedAutomation[];
  automationInsight?: AutomationInsight;
  // State fields (mutable via TaskStore)
  isSignedOff?: boolean;
  journalEntrySubmitted?: boolean;
}
