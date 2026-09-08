import type { Task } from '../components/TasksTable'

// Sample tasks per job id. Task counts match the `tasks` column on the
// main Jobs table. taskLabel for AI Matching tasks maps to one of
// AI_MATCHING_TASK_OPTIONS in AddTaskDrawer ("Sync All" / "Apply Rules" /
// "Sync and Apply Rules"); for Transform Agent tasks it maps to one of
// AGENT_OPTIONS. Granular fields (aiTask / accounts / agent) are backfilled
// so the Edit drawer can round-trip these tasks.
export const TASKS_BY_JOB: Record<string, Task[]> = {
  // Cash Accounts Daily Matching — 4 tasks, Mixed
  '1': [
    {
      id: 's1-t1',
      taskLabel: 'Sync All',
      type: 'AI Matching',
      dependencies: [],
      aiTask: 'sync-all',
      accounts: ['cash-operating', 'cash-savings'],
    },
    {
      id: 's1-t2',
      taskLabel: 'Apply Rules',
      type: 'AI Matching',
      dependencies: ['s1-t1'],
      aiTask: 'apply-rules',
      accounts: ['cash-operating', 'cash-savings'],
    },
    {
      id: 's1-t3',
      taskLabel: 'Variance Detector',
      type: 'Transform Agent',
      dependencies: ['s1-t2'],
      agent: 'variance-detector',
    },
    {
      id: 's1-t4',
      taskLabel: 'Account Mapper',
      type: 'Transform Agent',
      dependencies: ['s1-t3'],
      agent: 'account-mapper',
    },
  ],

  // Revenue Recognition Reclass — 1 task, Transform Agent
  '2': [
    {
      id: 's2-t1',
      taskLabel: 'Period Allocator',
      type: 'Transform Agent',
      dependencies: [],
      agent: 'period-allocator',
    },
  ],

  // AP Aging Reconciliation — 6 tasks, Mixed
  '3': [
    {
      id: 's3-t1',
      taskLabel: 'Sync All',
      type: 'AI Matching',
      dependencies: [],
      aiTask: 'sync-all',
      accounts: ['ap'],
    },
    {
      id: 's3-t2',
      taskLabel: 'Apply Rules',
      type: 'AI Matching',
      dependencies: ['s3-t1'],
      aiTask: 'apply-rules',
      accounts: ['ap'],
    },
    {
      id: 's3-t3',
      taskLabel: 'Variance Detector',
      type: 'Transform Agent',
      dependencies: ['s3-t2'],
      agent: 'variance-detector',
    },
    {
      id: 's3-t4',
      taskLabel: 'Sync and Apply Rules',
      type: 'AI Matching',
      dependencies: ['s3-t3'],
      aiTask: 'sync-and-apply-rules',
      accounts: ['ap'],
    },
    {
      id: 's3-t5',
      taskLabel: 'Account Mapper',
      type: 'Transform Agent',
      dependencies: ['s3-t4'],
      agent: 'account-mapper',
    },
    {
      id: 's3-t6',
      taskLabel: 'Variance Detector',
      type: 'Transform Agent',
      dependencies: ['s3-t5'],
      agent: 'variance-detector',
    },
  ],

  // Intercompany Eliminations — 3 tasks, Mixed
  '4': [
    {
      id: 's4-t1',
      taskLabel: 'Sync All',
      type: 'AI Matching',
      dependencies: [],
      aiTask: 'sync-all',
      accounts: ['revenue-sub', 'revenue-services'],
    },
    {
      id: 's4-t2',
      taskLabel: 'Account Mapper',
      type: 'Transform Agent',
      dependencies: ['s4-t1'],
      agent: 'account-mapper',
    },
    {
      id: 's4-t3',
      taskLabel: 'Variance Detector',
      type: 'Transform Agent',
      dependencies: ['s4-t2'],
      agent: 'variance-detector',
    },
  ],

  // Multi-Currency FX Sync — 1 task, Transform Agent
  '5': [
    {
      id: 's5-t1',
      taskLabel: 'Multi-Currency Converter',
      type: 'Transform Agent',
      dependencies: [],
      agent: 'fx-converter',
    },
  ],

  // Bank Reconciliation Sweep — 5 tasks, Mixed
  '6': [
    {
      id: 's6-t1',
      taskLabel: 'Sync All',
      type: 'AI Matching',
      dependencies: [],
      aiTask: 'sync-all',
      accounts: ['cash-operating', 'cash-savings'],
    },
    {
      id: 's6-t2',
      taskLabel: 'Apply Rules',
      type: 'AI Matching',
      dependencies: ['s6-t1'],
      aiTask: 'apply-rules',
      accounts: ['cash-operating', 'cash-savings'],
    },
    {
      id: 's6-t3',
      taskLabel: 'Variance Detector',
      type: 'Transform Agent',
      dependencies: ['s6-t2'],
      agent: 'variance-detector',
    },
    {
      id: 's6-t4',
      taskLabel: 'Sync and Apply Rules',
      type: 'AI Matching',
      dependencies: ['s6-t3'],
      aiTask: 'sync-and-apply-rules',
      accounts: ['cash-operating', 'cash-savings'],
    },
    {
      id: 's6-t5',
      taskLabel: 'Account Mapper',
      type: 'Transform Agent',
      dependencies: ['s6-t4'],
      agent: 'account-mapper',
    },
  ],

  // Sales Tax Allocations — 2 tasks, AI Matching
  '7': [
    {
      id: 's7-t1',
      taskLabel: 'Sync All',
      type: 'AI Matching',
      dependencies: [],
      aiTask: 'sync-all',
      accounts: ['revenue-sub', 'revenue-services'],
    },
    {
      id: 's7-t2',
      taskLabel: 'Apply Rules',
      type: 'AI Matching',
      dependencies: ['s7-t1'],
      aiTask: 'apply-rules',
      accounts: ['revenue-sub', 'revenue-services'],
    },
  ],
}

export function getSampleTasksForJob(jobId?: string): Task[] {
  if (!jobId) return []
  return TASKS_BY_JOB[jobId] ?? []
}
